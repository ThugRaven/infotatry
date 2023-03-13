import {
  Button,
  FormControl,
  FormLabel,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
} from '@chakra-ui/react';
import { DashboardLayout } from '@components/layouts';
import { getServerSidePropsIsAdmin } from '@lib/api';
import s from '@styles/DashboardAdminUsers.module.css';
import React, { ReactElement, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from 'react-query';

type UserForm = {
  name: string;
  email: string;
  image: string;
};

const initialUserValues: UserForm = {
  name: '',
  email: '',
  image: '',
};

type UserBanForm = {
  duration: number;
  reason: string;
};

type UserFull = {
  _id: string;
  name: string;
  email: string;
  image?: string;
  createdAt: Date;
  updatedAt: Date;
};

export const getServerSideProps = getServerSidePropsIsAdmin;

const Users = () => {
  const [userForm, setUserForm] = useState(initialUserValues);
  const [userBanForm, setUserBanForm] = useState<UserBanForm>({
    duration: 0,
    reason: '',
  });
  const [selectedUserId, setSelectedUserId] = useState('');
  const { isOpen: isModalOpen, onOpen, onClose } = useDisclosure();

  const fetchUsers = async () => {
    try {
      console.log('fetch users');

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users`, {
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

  const { isLoading, error, data } = useQuery<UserFull[], Error>(
    ['users'],
    fetchUsers,
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

    setUserForm({
      ...userForm,
      [name]: value,
    });
  };

  const handleChangeBanForm = (
    e:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLSelectElement>
      | React.ChangeEvent<HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    console.log(name, value);

    setUserBanForm({
      ...userBanForm,
      [name]: value,
    });
  };

  const banUser = async (id: string) => {
    try {
      if (!id) {
        return null;
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/users/ban/${id}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(userBanForm),
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

  const updateUser = async (id: string) => {
    try {
      if (!id) {
        return null;
      }

      console.log(userForm);

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/users/${id}`,
        {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(userForm),
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

  const deleteUser = async (id: string) => {
    try {
      if (!id) {
        return null;
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/users/${id}`,
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

  const userBanMutation = useMutation((id: string) => banUser(id));

  const userUpdateMutation = useMutation((id: string) => updateUser(id));

  const userDeleteMutation = useMutation((id: string) => deleteUser(id));

  const queryClient = useQueryClient();

  const handleOpenModal = (id: string) => {
    setSelectedUserId(id);
    onOpen();
  };

  const handleBanUser = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    userBanMutation.mutate(selectedUserId, {
      onSuccess: (data) => {
        onClose();
        // queryClient.setQueryData<UserFull[]>(
        //   'users',
        //   (users) => {
        //     if (users) {
        //       const user = users.find(
        //         (user) => user._id === data._id,
        //       );
        //       if (user) {
        //         user.isClosed = data.isClosed;
        //       }
        //       return users;
        //     }
        //     return [];
        //   },
        //   data,
        // );
        console.log(data);
      },
    });
  };

  const handleSelectUser = (user: UserFull) => {
    console.log('user', user);
    const { name, email, image } = user;

    setSelectedUserId(user._id);
    setUserForm({
      name,
      email,
      image: image ?? '',
    });
  };

  const handleUpdateUser = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(userForm);

    userUpdateMutation.mutate(selectedUserId, {
      onSuccess: (data) => {
        // queryClient.setQueryData<UserFull[]>(
        //   'announcements-all',
        //   (announcements) => {
        //     if (announcements) {
        //       let announcement = announcements.find(
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
        console.log(data);
      },
    });
  };

  const handleDeleteUser = (id: string) => {
    userDeleteMutation.mutate(id, {
      onSuccess: (data) => {
        // queryClient.setQueryData<UserFull[]>(
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
        console.log(data);
      },
    });
  };

  return (
    <div className={s.container}>
      <div>
        {data && (
          <ul>
            {data.map((user) => (
              <li key={user._id} onClick={() => handleSelectUser(user)}>
                {`${user._id} ${user.name} ${user.email} ${
                  user.createdAt
                    ? new Date(user.createdAt).toLocaleDateString()
                    : 'N/A'
                } - ${
                  user.updatedAt
                    ? new Date(user.updatedAt).toLocaleDateString()
                    : 'N/A'
                }`}
                <Button
                  ml={1}
                  size="sm"
                  onClick={() => handleOpenModal(user._id)}
                >
                  Ban user
                </Button>

                <Button
                  ml={1}
                  size="sm"
                  colorScheme={'red'}
                  onClick={() => handleDeleteUser(user._id)}
                >
                  Delete user
                </Button>
              </li>
            ))}
          </ul>
        )}
      </div>
      <form onSubmit={handleUpdateUser}>
        <FormControl isRequired>
          <FormLabel>Name</FormLabel>
          <Input
            type="text"
            name="name"
            value={userForm.name}
            mb={2}
            onChange={handleChangeForm}
          />
        </FormControl>
        <FormControl isRequired>
          <FormLabel>Email</FormLabel>
          <Input
            type="email"
            name="email"
            value={userForm.email}
            mb={2}
            onChange={handleChangeForm}
          />
        </FormControl>
        <FormControl>
          <FormLabel>Image</FormLabel>
          <Input
            type="text"
            name="image"
            value={userForm.image}
            mb={2}
            onChange={handleChangeForm}
          />
        </FormControl>

        <Button colorScheme="blue" mr={3} type="submit">
          Update user
        </Button>
      </form>
      <Modal isOpen={isModalOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Ban user</ModalHeader>
          <ModalCloseButton />
          <form onSubmit={handleBanUser}>
            <ModalBody>
              <FormControl isRequired>
                <FormLabel>Duration</FormLabel>
                <Input
                  type="number"
                  name="duration"
                  mb={2}
                  value={userBanForm.duration}
                  onChange={handleChangeBanForm}
                />
              </FormControl>
              <FormControl>
                <FormLabel>Reason</FormLabel>
                <Input
                  type="text"
                  name="reason"
                  mb={2}
                  value={userBanForm.reason}
                  onChange={handleChangeBanForm}
                />
              </FormControl>
            </ModalBody>

            <ModalFooter>
              <Button colorScheme="blue" mr={3} type="submit">
                Ban user
              </Button>
              <Button onClick={onClose}>Cancel</Button>
            </ModalFooter>
          </form>
        </ModalContent>
      </Modal>
    </div>
  );
};

Users.getLayout = function getLayout(page: ReactElement) {
  return <DashboardLayout maxHeight={true}>{page}</DashboardLayout>;
};

export default Users;
