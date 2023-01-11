import {
  Button,
  FormControl,
  FormLabel,
  Input,
  Select,
  Textarea,
} from '@chakra-ui/react';
import { DashboardLayout } from '@components/layouts';
import s from '@styles/Hikes.module.css';
import 'mapbox-gl/dist/mapbox-gl.css';
import React, { ReactElement, useState } from 'react';
import { useMutation } from 'react-query';

type AnnouncementForm = {
  type: string;
  title: string;
  featuresType: string;
  featuresIds: number[];
  reason: string;
  since: string;
  until: string;
  link: string;
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
  link: '',
  description: '',
};

const Announcements = () => {
  const [announcementForm, setAnnouncementForm] = useState(
    initialAnnouncementValues,
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

      const response = await fetch('http://localhost:8080/announcement', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...announcement,
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

  const announcementMutation = useMutation(
    (newAnnouncement: AnnouncementForm) => createAnnouncement(newAnnouncement),
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

  return (
    <div className={s.container}>
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
          <FormLabel>Link</FormLabel>
          <Input
            type="text"
            name="link"
            value={announcementForm.link}
            mb={2}
            onChange={handleChangeForm}
          />
        </FormControl>

        <Button colorScheme="blue" mr={3} type="submit">
          Add an announcement
        </Button>
      </form>
    </div>
  );
};

Announcements.getLayout = function getLayout(page: ReactElement) {
  return <DashboardLayout>{page}</DashboardLayout>;
};

export default Announcements;
