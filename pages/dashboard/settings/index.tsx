import { useToast } from '@chakra-ui/react';
import { SEO } from '@components/common';
import { DashboardLayout } from '@components/layouts';
import { Input } from '@components/ui';
import Button from '@components/ui/Button';
import Card from '@components/ui/Card';
import s from '@styles/Settings.module.css';
import { useAuth } from 'hooks/useAuth';
import { useSignOut } from 'hooks/useSignOut';
import { ReactElement, useState } from 'react';
import { useMutation, useQuery } from 'react-query';

const Settings = () => {
  const { user, refetch } = useAuth();
  const [name, setName] = useState(user?.name ?? '');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const toast = useToast();

  const fetchUser = async () => {
    try {
      const response = await fetch(`http://localhost:8080/user`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message);
      }

      return data;
    } catch (error) {
      console.log(error);
      if (error instanceof Error) {
        throw new Error(error.message);
      }
    }
  };

  const {
    isLoading: isLoadingUser,
    error: errorUser,
    data: userData,
  } = useQuery<any, Error>(['user', user?.id], fetchUser, {
    enabled: true,
    refetchOnWindowFocus: false,
    retry: false,
    onSuccess: (data) => {
      console.log(data);
      if (data && data.user) {
        setName(data.user.name);
      }
    },
  });

  const editUser = async (name: string) => {
    try {
      const response = await fetch(`http://localhost:8080/user/edit`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ name }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || response.status.toString());
      }

      return data;
    } catch (error) {
      console.log(error);
      if (error instanceof Error) {
        toast({
          title: 'Wystąpił błąd!',
          description: error.message,
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
        throw new Error(error.message);
      }
    }
  };

  const editUserMutation = useMutation((name: string) => editUser(name));

  const handleEditUser = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    editUserMutation.mutate(name, {
      onSuccess: (data) => {
        console.log(data);
        refetch && refetch();
        toast({
          title: 'Dane zaktualizowane!',
          status: 'success',
          duration: 5000,
          isClosable: true,
        });
      },
    });
  };

  const changePassword = async (
    currentPassword: string,
    newPassword: string,
    confirmPassword: string,
  ) => {
    try {
      const response = await fetch(
        `http://localhost:8080/user/change_password`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({
            password: {
              current: currentPassword,
              new: newPassword,
              confirm: confirmPassword,
            },
          }),
        },
      );

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || response.status.toString());
      }

      return data;
    } catch (error) {
      console.log(error);
      if (error instanceof Error) {
        toast({
          title: 'Wystąpił błąd!',
          description: error.message,
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
        throw new Error(error.message);
      }
    }
  };

  const changePasswordMutation = useMutation(
    ({
      currentPassword,
      newPassword,
      confirmPassword,
    }: {
      currentPassword: string;
      newPassword: string;
      confirmPassword: string;
    }) => changePassword(currentPassword, newPassword, confirmPassword),
  );

  const handleSignOut = useSignOut('/login');

  const handleChangePassword = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    changePasswordMutation.mutate(
      { currentPassword, newPassword, confirmPassword },
      {
        onSuccess: (data) => {
          console.log(data);
          handleSignOut();
          toast({
            title: 'Hasło zaktualizowane!',
            description: 'Zaloguj się ponownie do aplikacji.',
            status: 'success',
            duration: 5000,
            isClosable: true,
          });
        },
      },
    );
  };

  return (
    <>
      <SEO title="Ustawienia" />
      <div className={s.container}>
        {user && userData && (
          <div className={s.wrapper}>
            <Card cardTitle="Zmień nazwę użytkownika" className={s.card}>
              <form onSubmit={handleEditUser} className={s.form}>
                <div className={s.inputs}>
                  <Input
                    placeholder="Nazwa użytkownika"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>

                <Button>Zapisz zmiany</Button>
              </form>
            </Card>
            <Card cardTitle="Zmień hasło" className={s.card}>
              <form onSubmit={handleChangePassword} className={s.form}>
                <div className={s.inputs}>
                  <Input
                    type="password"
                    placeholder="Hasło"
                    required
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                  />
                  <Input
                    type="password"
                    placeholder="Nowe hasło"
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                  />
                  <Input
                    type="password"
                    placeholder="Powtórz nowe hasło"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                </div>

                <Button>Zapisz zmiany</Button>
              </form>
            </Card>
          </div>
        )}
      </div>
    </>
  );
};

Settings.getLayout = function getLayout(page: ReactElement) {
  return <DashboardLayout maxHeight={true}>{page}</DashboardLayout>;
};

export default Settings;
