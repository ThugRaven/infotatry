import {
  Button,
  Flex,
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
  useToast,
} from '@chakra-ui/react';
import { Pagination, Table, Td, Th, Tr } from '@components/common';
import { DashboardLayout } from '@components/layouts';
import { PaginationResponse, getServerSidePropsIsAdmin } from '@lib/api';
import s from '@styles/DashboardAdminUsers.module.css';
import { usePagination } from 'hooks/usePagination';
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
  password?: string;
  image?: string;
  roles: string[];
  ban: Ban;
  stats: UserStats;
  createdAt: Date;
  updatedAt: Date;
};

type Ban = {
  duration: number | null;
  bannedAt: Date | null;
  reason?: string;
};

interface UserStats {
  time: number;
  distance: number;
  ascent: number;
  descent: number;
}

export const getServerSideProps = getServerSidePropsIsAdmin;

const Users = () => {
  const [userForm, setUserForm] = useState(initialUserValues);
  const [userBanForm, setUserBanForm] = useState<UserBanForm>({
    duration: 0,
    reason: '',
  });
  const [selectedUserId, setSelectedUserId] = useState('');
  const { isOpen: isModalOpen, onOpen, onClose } = useDisclosure();
  const { page, handlePageClick } = usePagination();
  const toast = useToast();

  const fetchUsers = async (page: number) => {
    try {
      console.log('fetch users');

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/users?page=${page}`,
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

  const { data, isFetching } = useQuery<PaginationResponse<UserFull[]>, Error>(
    ['users', page],
    () => fetchUsers(page),
    {
      refetchOnWindowFocus: false,
      retry: false,
      cacheTime: 15 * 60 * 1000, // 15 minutes
      staleTime: 10 * 60 * 1000, // 10 minutes
      keepPreviousData: true,
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

  const unbanUser = async (id: string) => {
    try {
      if (!id) {
        return null;
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/users/unban/${id}`,
        {
          method: 'POST',
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

  const userBanMutation = useMutation((id: string) => banUser(id));

  const userUnbanMutation = useMutation((id: string) => unbanUser(id));

  const userUpdateMutation = useMutation((id: string) => updateUser(id));

  const queryClient = useQueryClient();

  const handleOpenModal = (id: string) => {
    setSelectedUserId(id);
    setUserBanForm({
      duration: 0,
      reason: '',
    });
    onOpen();
  };

  const handleBanUser = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    userBanMutation.mutate(selectedUserId, {
      onSuccess: (data) => {
        onClose();
        toast({
          title: 'Zablokowano użytkownika!',
          status: 'success',
          duration: 5000,
          isClosable: true,
        });
        queryClient.invalidateQueries('users');
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

  const handleUnbanUser = () => {
    userUnbanMutation.mutate(selectedUserId, {
      onSuccess: (data) => {
        console.log(data);
        toast({
          title: 'Odblokowano użytkownika!',
          status: 'success',
          duration: 5000,
          isClosable: true,
        });
        queryClient.invalidateQueries('users');
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

  const handleSelectUser = (user: UserFull) => {
    console.log('user', user);
    const { name, email, image } = user;

    if (selectedUserId === user._id) {
      setSelectedUserId('');
      setUserForm(initialUserValues);
      return;
    }

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
        console.log(data);
        toast({
          title: 'Zaktualizowano użytkownika!',
          status: 'success',
          duration: 5000,
          isClosable: true,
        });
        queryClient.invalidateQueries('users');
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
              <Th>Name</Th>
              <Th>Email</Th>
              <Th isNumeric>Created At</Th>
              <Th isNumeric>Updated At</Th>
              <Th center>Banned</Th>
              <Th center>Actions</Th>
            </Tr>
          </thead>
          <tbody>
            {data &&
              data.data &&
              data.data.map((user, index) => (
                <Tr
                  key={user._id}
                  onClick={() => handleSelectUser(user)}
                  active={selectedUserId === user._id}
                >
                  <Td center>
                    {data.page * data.pageSize - data.pageSize + 1 + index}
                  </Td>
                  <Td wrap>{user.name}</Td>
                  <Td wrap>{user.email}</Td>
                  <Td isNumeric>
                    {user.createdAt
                      ? new Date(user.createdAt).toLocaleDateString()
                      : 'N/A'}
                  </Td>
                  <Td isNumeric>
                    {user.updatedAt
                      ? new Date(user.updatedAt).toLocaleDateString()
                      : 'N/A'}
                  </Td>
                  <Td center>
                    {user.ban.duration &&
                    user.ban.bannedAt &&
                    (new Date(user.ban.bannedAt).getTime() + user.ban.duration >
                      Date.now() ||
                      user.ban.duration === -1)
                      ? 'Yes'
                      : 'No'}
                  </Td>
                  <Td center>
                    {user.ban.duration &&
                    user.ban.bannedAt &&
                    (new Date(user.ban.bannedAt).getTime() + user.ban.duration >
                      Date.now() ||
                      user.ban.duration === -1) ? (
                      <Button ml={1} size="sm" onClick={handleUnbanUser}>
                        Unban user
                      </Button>
                    ) : (
                      <Button
                        ml={1}
                        size="sm"
                        onClick={() => handleOpenModal(user._id)}
                      >
                        Ban user
                      </Button>
                    )}
                  </Td>
                </Tr>
              ))}
          </tbody>
          <tfoot>
            <Tr>
              <Th colSpan={7}>
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
      <form onSubmit={handleUpdateUser} className={s.form}>
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
              <Flex gap={1} wrap={'wrap'}>
                <Button
                  colorScheme="blue"
                  onClick={() => {
                    setUserBanForm((state) => ({
                      ...state,
                      duration: 1000 * 1 * 60,
                    }));
                  }}
                >
                  1 min
                </Button>
                <Button
                  colorScheme="blue"
                  onClick={() => {
                    setUserBanForm((state) => ({
                      ...state,
                      duration: 1000 * 1 * 60 * 5,
                    }));
                  }}
                >
                  5 min
                </Button>
                <Button
                  colorScheme="blue"
                  onClick={() => {
                    setUserBanForm((state) => ({
                      ...state,
                      duration: 1000 * 1 * 60 * 15,
                    }));
                  }}
                >
                  15 min
                </Button>
                <Button
                  colorScheme="blue"
                  onClick={() => {
                    setUserBanForm((state) => ({
                      ...state,
                      duration: 1000 * 1 * 60 * 60,
                    }));
                  }}
                >
                  1 h
                </Button>
                <Button
                  colorScheme="blue"
                  onClick={() => {
                    setUserBanForm((state) => ({
                      ...state,
                      duration: 1000 * 1 * 60 * 60 * 24,
                    }));
                  }}
                >
                  24 h
                </Button>
                <Button
                  colorScheme="blue"
                  onClick={() => {
                    setUserBanForm((state) => ({
                      ...state,
                      duration: 1000 * 1 * 60 * 60 * 24 * 7,
                    }));
                  }}
                >
                  7 d
                </Button>
                <Button
                  colorScheme="blue"
                  onClick={() => {
                    setUserBanForm((state) => ({
                      ...state,
                      duration: 1000 * 1 * 60 * 60 * 24 * 31,
                    }));
                  }}
                >
                  1 mo
                </Button>
                <Button
                  colorScheme="blue"
                  onClick={() => {
                    setUserBanForm((state) => ({
                      ...state,
                      duration: 1000 * 1 * 60 * 60 * 24 * 365,
                    }));
                  }}
                >
                  1 yr
                </Button>
                <Button
                  colorScheme="blue"
                  onClick={() => {
                    setUserBanForm((state) => ({
                      ...state,
                      duration: -1,
                    }));
                  }}
                >
                  Perm
                </Button>
              </Flex>
            </ModalBody>

            <ModalFooter>
              <Button colorScheme="red" mr={3} type="submit">
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
