import {
  Button,
  FormControl,
  FormLabel,
  Input,
  Select,
  Textarea,
  useToast,
} from '@chakra-ui/react';
import Pagination from '@components/common/Pagination';
import { Table, Td, Th, Tr } from '@components/common/Table';
import { DashboardLayout } from '@components/layouts';
import { Announcement } from '@components/map/MapContainer/MapContainer';
import { getServerSidePropsIsAdmin, PaginationResponse } from '@lib/api';
import s from '@styles/DashboardAdminAnnouncements.module.css';
import { usePagination } from 'hooks/usePagination';
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

export const getServerSideProps = getServerSidePropsIsAdmin;

const Announcements = () => {
  const [announcementForm, setAnnouncementForm] = useState(
    initialAnnouncementValues,
  );
  const [selectedAnnouncementId, setSelectedAnnouncementId] = useState('');
  const { page, handlePageClick } = usePagination();
  const toast = useToast();

  const fetchAllAnnouncements = async (page: number) => {
    try {
      console.log('fetch all announcements');

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/announcements/all?page=${page}`,
        {
          method: 'GET',
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
    }
  };

  const { isLoading, error, data, isFetching } = useQuery<
    PaginationResponse<Announcement[]>,
    Error
  >(['announcements-all', page], () => fetchAllAnnouncements(page), {
    refetchOnWindowFocus: false,
    retry: false,
    cacheTime: 15 * 60 * 1000, // 15 minutes
    staleTime: 10 * 60 * 1000, // 10 minutes
    keepPreviousData: true,
    onSuccess: (data) => {
      console.log(data);
    },
  });

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

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/announcements`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ...announcement,
            featuresIds: announcement.featuresIds.toString(),
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
    }
  };

  const closeAnnouncement = async (id: string) => {
    try {
      if (!id) {
        return null;
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/announcements/${id}`,
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
        `${process.env.NEXT_PUBLIC_API_URL}/announcements/${id}`,
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

  const deleteAnnouncement = async (id: string) => {
    try {
      if (!id) {
        return null;
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/announcements/${id}`,
        {
          method: 'DELETE',
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

  const announcementMutation = useMutation(
    (newAnnouncement: AnnouncementForm) => createAnnouncement(newAnnouncement),
  );

  const announcementCloseMutation = useMutation((id: string) =>
    closeAnnouncement(id),
  );

  const announcementUpdateMutation = useMutation((id: string) =>
    updateAnnouncement(id),
  );

  const announcementDeleteMutation = useMutation((id: string) =>
    deleteAnnouncement(id),
  );

  const handleAddAnnouncement = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(announcementForm);

    announcementMutation.mutate(announcementForm, {
      onSuccess: (data) => {
        console.log(data);
        console.log(data && data._id);
        toast({
          title: 'Dodano ogłoszenie!',
          status: 'success',
          duration: 5000,
          isClosable: true,
        });
        queryClient.invalidateQueries(['announcements-all', 1]);
      },
      onError: (error) => {
        if (error instanceof Error) {
          toast({
            title: 'Wystąpił błąd!',
            description: error.message,
            status: 'error',
            duration: 5000,
            isClosable: true,
          });
        }
      },
    });
  };

  const queryClient = useQueryClient();

  const handleCloseAnnouncement = (id: string) => {
    announcementCloseMutation.mutate(id, {
      onSuccess: (data) => {
        // queryClient.setQueryData<Announcement[]>(
        //   'announcements-all',
        //   (announcements) => {
        //     if (announcements) {
        //       const announcement = announcements.find(
        //         (announcement) => announcement._id === data._id,
        //       );
        //       if (announcement) {
        //         announcement.isClosed = data.isClosed;
        //       }
        //       return announcements;
        //     }
        //     return [];
        //   },
        //   data,
        // );
        toast({
          title: 'Zaktualizowano ogłoszenie!',
          status: 'success',
          duration: 5000,
          isClosable: true,
        });
        queryClient.invalidateQueries('announcements-all');
        console.log(data);
      },
      onError: (error) => {
        if (error instanceof Error) {
          toast({
            title: 'Wystąpił błąd!',
            description: error.message,
            status: 'error',
            duration: 5000,
            isClosable: true,
          });
        }
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

    if (selectedAnnouncementId === announcement._id) {
      setSelectedAnnouncementId('');
      setAnnouncementForm(initialAnnouncementValues);
      return;
    }

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
        // queryClient.setQueryData<Announcement[]>(
        //   'announcements-all',
        //   (announcements) => {
        //     if (announcements) {
        //       const announcement = announcements.find(
        //         (announcement) => announcement._id === data._id,
        //       );
        //       if (announcement) {
        //         Object.assign(announcement, data);
        //       }
        //       return announcements;
        //     }
        //     return [];
        //   },
        //   data,
        // );
        toast({
          title: 'Zaktualizowano ogłoszenie!',
          status: 'success',
          duration: 5000,
          isClosable: true,
        });
        queryClient.invalidateQueries('announcements-all');
        console.log(data);
      },
      onError: (error) => {
        if (error instanceof Error) {
          toast({
            title: 'Wystąpił błąd!',
            description: error.message,
            status: 'error',
            duration: 5000,
            isClosable: true,
          });
        }
      },
    });
  };

  const handleDeleteAnnouncement = (id: string) => {
    announcementDeleteMutation.mutate(id, {
      onSuccess: (data) => {
        // queryClient.setQueryData<Announcement[]>(
        //   'announcements-all',
        //   (announcements) => {
        //     if (announcements) {
        //       return announcements.filter(
        //         (announcement) => announcement._id !== id,
        //       );
        //     }
        //     return [];
        //   },
        //   data,
        // );
        toast({
          title: 'Usunięto ogłoszenie!',
          status: 'success',
          duration: 5000,
          isClosable: true,
        });
        queryClient.invalidateQueries('announcements-all');
        console.log(data);
      },
      onError: (error) => {
        if (error instanceof Error) {
          toast({
            title: 'Wystąpił błąd!',
            description: error.message,
            status: 'error',
            duration: 5000,
            isClosable: true,
          });
        }
      },
    });
  };

  return (
    <div className={s.container}>
      <div>
        <Table isLoading={isFetching}>
          <thead>
            <Tr>
              <Th center>#</Th>
              <Th center>Title</Th>
              <Th isNumeric>Since</Th>
              <Th isNumeric>Until</Th>
              <Th center>Closed</Th>
              <Th center>Actions</Th>
            </Tr>
          </thead>
          <tbody>
            {data &&
              data.data &&
              data.data.map((announcement, index) => (
                <Tr
                  key={announcement._id}
                  onClick={() => handleSelectAnnouncement(announcement)}
                  active={selectedAnnouncementId === announcement._id}
                >
                  <Td center>
                    {data.page * data.pageSize - data.pageSize + 1 + index}
                  </Td>
                  <Td center wrap>
                    {announcement.title}
                  </Td>
                  <Td isNumeric>
                    {announcement.since
                      ? new Date(announcement.since).toLocaleDateString()
                      : 'N/A'}
                  </Td>
                  <Td isNumeric>
                    {announcement.until
                      ? new Date(announcement.until).toLocaleDateString()
                      : 'N/A'}
                  </Td>
                  <Td center>{announcement.isClosed ? 'Yes' : 'No'}</Td>
                  <Td center>
                    <Button
                      ml={1}
                      size="sm"
                      onClick={() => handleCloseAnnouncement(announcement._id)}
                    >
                      Toggle closure
                    </Button>
                    <Button
                      ml={1}
                      size="sm"
                      colorScheme={'red'}
                      onClick={() => handleDeleteAnnouncement(announcement._id)}
                    >
                      Delete
                    </Button>
                  </Td>
                </Tr>
              ))}
          </tbody>
          <tfoot>
            <Tr>
              <Th colSpan={6}>
                {data && (
                  <Pagination
                    page={page}
                    pageSize={data.pageSize}
                    count={data.count}
                    onPageClick={handlePageClick}
                  />
                )}
              </Th>
            </Tr>
          </tfoot>
        </Table>
      </div>
      <form onSubmit={handleAddAnnouncement} className={s.form}>
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
  return <DashboardLayout maxHeight={true}>{page}</DashboardLayout>;
};

export default Announcements;
