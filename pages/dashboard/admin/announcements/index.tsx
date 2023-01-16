import {
  Button,
  FormControl,
  FormLabel,
  Input,
  Select,
  Textarea,
} from '@chakra-ui/react';
import { DashboardLayout } from '@components/layouts';
import { Announcement } from '@components/map/MapContainer/MapContainer';
import s from '@styles/Hikes.module.css';
import 'mapbox-gl/dist/mapbox-gl.css';
import React, { ReactElement, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from 'react-query';

type AnnouncementForm = {
  type: string;
  title: string;
  featuresType: string;
  featuresIds: number[];
  reason: string;
  since: string;
  until: string;
  source: string;
  description: string;
};

const initialAnnouncementValues: AnnouncementForm = {
  type: '',
  title: '',
  featuresType: '',
  featuresIds: [],
  reason: '',
  since: '',
  until: '',
  source: '',
  description: '',
};

const Announcements = () => {
  const [announcementForm, setAnnouncementForm] = useState(
    initialAnnouncementValues,
  );
  const [selectedAnnouncementId, setSelectedAnnouncementId] = useState('');

  const fetchAllAnnouncements = async () => {
    try {
      console.log('fetch all announcements');

      const response = await fetch(`http://localhost:8080/announcements/all`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message);
      }

      return response.json();
    } catch (error) {
      console.log(error);
      if (error instanceof Error) {
        throw new Error(error.message);
      }
    }
  };

  const { isLoading, error, data } = useQuery<Announcement[], Error>(
    ['announcements-all'],
    fetchAllAnnouncements,
    {
      refetchOnWindowFocus: false,
      retry: false,
      cacheTime: 15 * 60 * 1000, // 15 minutes
      staleTime: 10 * 60 * 1000, // 10 minutes
      onSuccess: (data) => {
        console.log(data);
      },
    },
  );

  const handleChangeForm = (
    e:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLSelectElement>
      | React.ChangeEvent<HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    console.log(name, value);

    setAnnouncementForm({
      ...announcementForm,
      [name]: value,
    });
  };

  const createAnnouncement = async (announcement: AnnouncementForm) => {
    try {
      if (!announcement) {
        return null;
      }

      const response = await fetch('http://localhost:8080/announcements', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...announcement,
          featuresIds: announcement.featuresIds.toString(),
        }),
        credentials: 'include',
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message);
      }

      return response.json();
    } catch (error) {
      console.log(error);
      if (error instanceof Error) {
        throw new Error(error.message);
      }
    }
  };

  const closeAnnouncement = async (id: string) => {
    try {
      if (!id) {
        return null;
      }

      const response = await fetch(
        `http://localhost:8080/announcements/${id}`,
        {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
        },
      );

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message);
      }

      return response.json();
    } catch (error) {
      console.log(error);
      if (error instanceof Error) {
        throw new Error(error.message);
      }
      throw new Error(error as string);
    }
  };

  const updateAnnouncement = async (id: string) => {
    try {
      if (!id) {
        return null;
      }

      console.log(announcementForm);

      const response = await fetch(
        `http://localhost:8080/announcements/${id}`,
        {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ...announcementForm,
            featuresIds: announcementForm.featuresIds.toString(),
          }),
          credentials: 'include',
        },
      );

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message);
      }

      return response.json();
    } catch (error) {
      console.log(error);
      if (error instanceof Error) {
        throw new Error(error.message);
      }
      throw new Error(error as string);
    }
  };

  const announcementMutation = useMutation(
    (newAnnouncement: AnnouncementForm) => createAnnouncement(newAnnouncement),
  );

  const announcementCloseMutation = useMutation((id: string) =>
    closeAnnouncement(id),
  );

  const announcementUpdateMutation = useMutation((id: string) =>
    updateAnnouncement(id),
  );

  const handleAddAnnouncement = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(announcementForm);

    announcementMutation.mutate(announcementForm, {
      onSuccess: (data) => {
        console.log(data);
        console.log(data && data._id);
      },
    });
  };

  const queryClient = useQueryClient();

  const handleCloseAnnouncement = (id: string) => {
    announcementCloseMutation.mutate(id, {
      onSuccess: (data) => {
        queryClient.setQueryData<Announcement[]>(
          'announcements-all',
          (announcements) => {
            if (announcements) {
              const announcement = announcements.find(
                (announcement) => announcement._id === data._id,
              );
              if (announcement) {
                announcement.isClosed = data.isClosed;
              }
              return announcements;
            }
            return [];
          },
          data,
        );
        queryClient.invalidateQueries('announcements');
        console.log(data);
      },
    });
  };

  const handleSelectAnnouncement = (announcement: Announcement) => {
    console.log('announcement', announcement);
    const {
      type,
      title,
      featuresType,
      featuresIds,
      reason,
      since,
      until,
      source,
      description,
    } = announcement;

    setSelectedAnnouncementId(announcement._id);
    setAnnouncementForm({
      type,
      title,
      featuresType,
      featuresIds,
      reason,
      since: since ? new Date(since).toISOString().slice(0, -14) : '',
      until: until ? new Date(until).toISOString().slice(0, -14) : '',
      source: source ?? '',
      description,
    });
  };

  const handleUpdateAnnouncement = () => {
    announcementUpdateMutation.mutate(selectedAnnouncementId, {
      onSuccess: (data) => {
        queryClient.setQueryData<Announcement[]>(
          'announcements-all',
          (announcements) => {
            if (announcements) {
              let announcement = announcements.find(
                (announcement) => announcement._id === data._id,
              );
              if (announcement) {
                Object.assign(announcement, data);
              }
              return announcements;
            }
            return [];
          },
          data,
        );
        queryClient.invalidateQueries('announcements');
        console.log(data);
      },
    });
  };

  return (
    <div className={s.container}>
      <div>
        {data && (
          <ul>
            {data.map((announcement) => (
              <li
                key={announcement._id}
                onClick={() => handleSelectAnnouncement(announcement)}
              >
                {`${announcement._id} ${announcement.title} ${
                  announcement.since
                    ? new Date(announcement.since).toLocaleDateString()
                    : 'N/A'
                } - ${
                  announcement.until
                    ? new Date(announcement.until).toLocaleDateString()
                    : 'N/A'
                } ${announcement.isClosed}`}
                <Button
                  ml={1}
                  size="sm"
                  onClick={() => handleCloseAnnouncement(announcement._id)}
                >
                  Toggle closure
                </Button>
              </li>
            ))}
          </ul>
        )}
      </div>
      <form onSubmit={handleAddAnnouncement}>
        <FormControl isRequired>
          <FormLabel>Type</FormLabel>
          <Select
            placeholder="Select type"
            name="type"
            value={announcementForm.type}
            mb={2}
            onChange={handleChangeForm}
          >
            <option value="closure">closure</option>
          </Select>
        </FormControl>
        <FormControl isRequired>
          <FormLabel>Title</FormLabel>
          <Input
            type="text"
            name="title"
            value={announcementForm.title}
            mb={2}
            onChange={handleChangeForm}
          />
        </FormControl>
        <FormControl isRequired>
          <FormLabel>Features type</FormLabel>
          <Select
            placeholder="Select type"
            name="featuresType"
            value={announcementForm.featuresType}
            mb={2}
            onChange={handleChangeForm}
          >
            <option value="trail">trail</option>
            <option value="node">node</option>
          </Select>
        </FormControl>
        <FormControl isRequired>
          <FormLabel>Features ids</FormLabel>
          <Input
            type="text"
            name="featuresIds"
            value={announcementForm.featuresIds.toString()}
            mb={2}
            onChange={handleChangeForm}
          />
        </FormControl>
        <FormControl isRequired>
          <FormLabel>Reason</FormLabel>
          <Input
            type="text"
            name="reason"
            value={announcementForm.reason}
            mb={2}
            onChange={handleChangeForm}
          />
        </FormControl>
        <FormControl>
          <FormLabel>Since</FormLabel>
          <Input
            type="date"
            name="since"
            mb={2}
            value={announcementForm.since}
            onChange={handleChangeForm}
          />
        </FormControl>
        <FormControl>
          <FormLabel>Until</FormLabel>
          <Input
            type="date"
            name="until"
            mb={2}
            value={announcementForm.until}
            onChange={handleChangeForm}
          />
        </FormControl>
        <FormControl isRequired>
          <FormLabel>Description</FormLabel>
          <Textarea
            name="description"
            value={announcementForm.description}
            mb={2}
            onChange={handleChangeForm}
          />
        </FormControl>
        <FormControl>
          <FormLabel>Source link</FormLabel>
          <Input
            type="text"
            name="source"
            value={announcementForm.source}
            mb={2}
            onChange={handleChangeForm}
          />
        </FormControl>

        <Button colorScheme="blue" mr={3} type="submit">
          Add an announcement
        </Button>

        <Button colorScheme="blue" mr={3} onClick={handleUpdateAnnouncement}>
          Update announcement
        </Button>
      </form>
    </div>
  );
};

Announcements.getLayout = function getLayout(page: ReactElement) {
  return <DashboardLayout>{page}</DashboardLayout>;
};

export default Announcements;
