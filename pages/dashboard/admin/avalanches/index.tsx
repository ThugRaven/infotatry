import {
  Button,
  Checkbox,
  FormControl,
  FormLabel,
  Input,
  Select,
} from '@chakra-ui/react';
import Pagination from '@components/common/Pagination';
import { Table, Td, Th, Tr } from '@components/common/Table';
import { DashboardLayout } from '@components/layouts';
import { getServerSidePropsIsAdmin, PaginationResponse } from '@lib/api';
import s from '@styles/DashboardAdminAvalanches.module.css';
import { usePagination } from 'hooks/usePagination';
import React, { ReactElement, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from 'react-query';

type AvalancheBulletin = {
  _id: string;
  danger: number;
  increase: boolean;
  am: {
    elevation?: number;
    danger: number[];
    increase: boolean[];
    problem: string[];
    aspect: string[];
  };
  pm: {
    elevation?: number;
    danger: number[];
    increase: boolean[];
    problem: string[];
    aspect: string[];
  };
  forecast: number;
  until: string;
};

type AvalancheBulletinForm = {
  danger: number;
  increase: boolean;
  am_elevation?: string;
  am_danger: string;
  am_increase: boolean[];
  am_problem: string[];
  am_aspect: string;
  pm_elevation?: string;
  pm_danger: string;
  pm_increase: boolean[];
  pm_problem: string[];
  pm_aspect: string;
  forecast: number;
  until: string;
};

const initialAvalancheBulletinValues: AvalancheBulletinForm = {
  danger: 0,
  increase: false,
  am_elevation: '',
  am_danger: '',
  am_increase: [false, false],
  am_problem: [],
  am_aspect: '',
  pm_elevation: '',
  pm_danger: '',
  pm_increase: [false, false],
  pm_problem: [],
  pm_aspect: '',
  forecast: 0,
  until: new Date(
    new Date(new Date().setDate(new Date().getDate() + 1)).setHours(
      20,
      0,
      0,
      0,
    ),
  )
    .toISOString()
    .slice(0, -1),
};

export const getServerSideProps = getServerSidePropsIsAdmin;

const Avalanches = () => {
  const [bulletinForm, setBulletinForm] = useState(
    initialAvalancheBulletinValues,
  );
  console.log(bulletinForm.until);
  const [selectedBulletinId, setSelectedBulletinId] = useState('');
  const { page, handlePageClick } = usePagination();

  const fetchAllAvalancheBulletins = async (page: number) => {
    try {
      console.log('fetch all avalanche bulletins');

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/avalanches/all?page=${page}`,
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
    PaginationResponse<AvalancheBulletin[]>,
    Error
  >(['avalanche-bulletins', page], () => fetchAllAvalancheBulletins(page), {
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

    setBulletinForm({
      ...bulletinForm,
      [name]: value,
    });
  };

  const createAvalancheBulletin = async (bulletin: AvalancheBulletinForm) => {
    try {
      if (!bulletin) {
        return null;
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/avalanches`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            danger: bulletin.danger,
            increase: bulletin.increase,
            am: {
              elevation: bulletin.am_elevation,
              danger: bulletin.am_danger.split(','),
              increase: bulletin.am_increase,
              problem: bulletin.am_problem,
              aspect: bulletin.am_aspect.split(','),
            },
            pm: {
              elevation: bulletin.pm_elevation,
              danger: bulletin.pm_danger.split(','),
              increase: bulletin.pm_increase,
              problem: bulletin.pm_problem,
              aspect: bulletin.pm_aspect.split(','),
            },
            forecast: bulletin.forecast,
            until: bulletin.until,
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

  const updateAvalancheBulletin = async (id: string) => {
    try {
      if (!id) {
        return null;
      }

      console.log(bulletinForm);

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/avalanches/${id}`,
        {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            danger: bulletinForm.danger,
            increase: bulletinForm.increase,
            am: {
              elevation: bulletinForm.am_elevation,
              danger: bulletinForm.am_danger.split(','),
              increase: bulletinForm.am_increase,
              problem: bulletinForm.am_problem,
              aspect: bulletinForm.am_aspect.split(','),
            },
            pm: {
              elevation: bulletinForm.pm_elevation,
              danger: bulletinForm.pm_danger.split(','),
              increase: bulletinForm.pm_increase,
              problem: bulletinForm.pm_problem,
              aspect: bulletinForm.pm_aspect.split(','),
            },
            forecast: bulletinForm.forecast,
            until: bulletinForm.until,
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

  const deleteAvalancheBulletin = async (id: string) => {
    try {
      if (!id) {
        return null;
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/avalanches/${id}`,
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

  const bulletinMutation = useMutation((newBulletin: AvalancheBulletinForm) =>
    createAvalancheBulletin(newBulletin),
  );

  const bulletinUpdateMutation = useMutation((id: string) =>
    updateAvalancheBulletin(id),
  );

  const bulletinDeleteMutation = useMutation((id: string) =>
    deleteAvalancheBulletin(id),
  );

  const handleAddBulletin = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(bulletinForm);

    bulletinMutation.mutate(bulletinForm, {
      onSuccess: (data) => {
        console.log(data);
        console.log(data && data._id);
      },
    });
  };

  const queryClient = useQueryClient();

  const handleSelectBulletin = (bulletin: AvalancheBulletin) => {
    console.log('bulletin', bulletin);
    const { danger, increase, am, pm, forecast, until } = bulletin;

    if (selectedBulletinId === bulletin._id) {
      setSelectedBulletinId('');
      setBulletinForm(initialAvalancheBulletinValues);
      return;
    }

    setSelectedBulletinId(bulletin._id);
    setBulletinForm({
      danger,
      increase,
      am_elevation: am.elevation ? am.elevation.toString() : '',
      am_danger: am.danger.toString(),
      am_increase: am.increase,
      am_problem: am.problem.length > 0 ? am.problem : ['', ''],
      am_aspect: am.aspect.toString(),
      pm_elevation: pm.elevation ? pm.elevation.toString() : '',
      pm_danger: pm.danger.toString(),
      pm_increase: pm.increase,
      pm_problem: pm.problem.length > 0 ? pm.problem : ['', ''],
      pm_aspect: pm.aspect.toString(),
      forecast,
      until: until.slice(0, -1),
    });
  };

  const handleUpdateBulletin = () => {
    bulletinUpdateMutation.mutate(selectedBulletinId, {
      onSuccess: (data) => {
        queryClient.setQueryData<AvalancheBulletin[]>(
          'avalanche-bulletins-all',
          (bulletins) => {
            if (bulletins) {
              const bulletin = bulletins.find(
                (bulletin) => bulletin._id === data._id,
              );
              if (bulletin) {
                Object.assign(bulletin, data);
              }
              return bulletins;
            }
            return [];
          },
          data,
        );
        // queryClient.invalidateQueries('announcements');
        console.log(data);
      },
    });
  };

  const handleDeleteBulletin = (id: string) => {
    bulletinDeleteMutation.mutate(id, {
      onSuccess: (data) => {
        queryClient.setQueryData<AvalancheBulletin[]>(
          'avalanche-bulletins-all',
          (bulletins) => {
            if (bulletins) {
              return bulletins.filter((bulletin) => bulletin._id !== id);
            }
            return [];
          },
          data,
        );
        // queryClient.invalidateQueries('announcements');
        console.log(data);
      },
    });
  };

  return (
    <div className={s.container}>
      {/* <div>
        <TableContainer>
          <TableChakra variant="striped" colorScheme="orange">
            <TableCaption placement="top">Komunikaty lawinowe</TableCaption>
            <Thead>
              <TrChakra>
                <ThChakra isNumeric>Danger level</ThChakra>
                <ThChakra>Until</ThChakra>
                <ThChakra>Action</ThChakra>
              </TrChakra>
            </Thead>
            <Tbody>
              {data &&
                data.data &&
                data.data.map((bulletin) => (
                  <TrChakra
                    key={bulletin._id}
                    onClick={() => handleSelectBulletin(bulletin)}
                  >
                    <TdChakra
                      isNumeric
                      backgroundColor={
                        selectedBulletinId === bulletin._id
                          ? 'orange.300 !important'
                          : undefined
                      }
                    >
                      {bulletin.danger}
                    </TdChakra>
                    <TdChakra
                      backgroundColor={
                        selectedBulletinId === bulletin._id
                          ? 'orange.300 !important'
                          : undefined
                      }
                    >
                      {bulletin.until
                        ? new Date(bulletin.until).toLocaleString()
                        : 'N/A'}
                    </TdChakra>
                    <TdChakra
                      backgroundColor={
                        selectedBulletinId === bulletin._id
                          ? 'orange.300 !important'
                          : undefined
                      }
                    >
                      <Button
                        ml={1}
                        size="sm"
                        colorScheme={'red'}
                        onClick={() => handleDeleteBulletin(bulletin._id)}
                      >
                        Delete
                      </Button>
                    </TdChakra>
                  </TrChakra>
                ))}
            </Tbody>
            <Tfoot>
              <TrChakra>
                <ThChakra colSpan={3}>
                  {data && (
                    <Pagination
                      page={page}
                      pageSize={data.pageSize}
                      count={data.count}
                      onPageClick={handlePageClick}
                    />
                  )}
                </ThChakra>
              </TrChakra>
            </Tfoot>
          </TableChakra>
        </TableContainer>
      </div> */}

      <div>
        <Table isLoading={isFetching}>
          <thead>
            <Tr>
              <Th center>#</Th>
              <Th center>Danger level</Th>
              <Th isNumeric>Until</Th>
              <Th center>Action</Th>
            </Tr>
          </thead>
          <tbody>
            {data &&
              data.data &&
              data.data.map((bulletin, index) => (
                <Tr
                  key={bulletin._id}
                  onClick={() => handleSelectBulletin(bulletin)}
                  active={selectedBulletinId === bulletin._id}
                >
                  <Td center>
                    {data.page * data.pageSize - data.pageSize + 1 + index}
                  </Td>
                  <Td center>{bulletin.danger}</Td>
                  <Td isNumeric>
                    {bulletin.until
                      ? new Date(bulletin.until).toLocaleString()
                      : 'N/A'}
                  </Td>
                  <Td center>
                    <Button
                      ml={1}
                      size="sm"
                      colorScheme={'red'}
                      onClick={() => handleDeleteBulletin(bulletin._id)}
                    >
                      Delete
                    </Button>
                  </Td>
                </Tr>
              ))}
          </tbody>
          <tfoot>
            <Tr>
              <Th colSpan={4}>
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

      {/* <div>
        {data && (
          <ul>
            {data.map((bulletin) => (
              <li
                key={bulletin._id}
                onClick={() => handleSelectBulletin(bulletin)}
              >
                {`${bulletin._id} ${bulletin.danger} ${
                  bulletin.until
                    ? new Date(bulletin.until).toLocaleString()
                    : 'N/A'
                }`}

                <Button
                  ml={1}
                  size="sm"
                  colorScheme={'red'}
                  onClick={() => handleDeleteBulletin(bulletin._id)}
                >
                  Delete
                </Button>
              </li>
            ))}
          </ul>
        )}
      </div> */}
      <form onSubmit={handleAddBulletin} className={s.form}>
        <FormControl isRequired>
          <FormLabel>Danger level</FormLabel>
          <Select
            placeholder="Select danger level"
            name="danger"
            value={bulletinForm.danger}
            mb={2}
            onChange={handleChangeForm}
          >
            <option value="0">0</option>
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
            <option value="5">5</option>
          </Select>
        </FormControl>
        <FormControl>
          <Checkbox
            name="increase"
            isChecked={bulletinForm.increase}
            mb={2}
            onChange={(e) =>
              setBulletinForm({
                ...bulletinForm,
                increase: e.target.checked,
              })
            }
          >
            Increases with temperature
          </Checkbox>
        </FormControl>
        AM
        <FormControl>
          <FormLabel>Elevation</FormLabel>
          <Input
            type="number"
            name="am_elevation"
            value={bulletinForm.am_elevation}
            mb={2}
            onChange={handleChangeForm}
          />
        </FormControl>
        <FormControl isRequired>
          <FormLabel>Danger level</FormLabel>
          <Input
            type="text"
            name="am_danger"
            value={bulletinForm.am_danger}
            mb={2}
            onChange={handleChangeForm}
          />
        </FormControl>
        <FormControl>
          <Checkbox
            isChecked={bulletinForm.am_increase[0]}
            mb={2}
            onChange={(e) =>
              setBulletinForm({
                ...bulletinForm,
                am_increase: [e.target.checked, bulletinForm.am_increase[1]],
              })
            }
          >
            Increases with temperature
          </Checkbox>
        </FormControl>
        <FormControl>
          <Checkbox
            isChecked={bulletinForm.am_increase[1]}
            mb={2}
            onChange={(e) =>
              setBulletinForm({
                ...bulletinForm,
                am_increase: [bulletinForm.am_increase[0], e.target.checked],
              })
            }
          >
            Increases with temperature
          </Checkbox>
        </FormControl>
        <FormControl>
          <FormLabel>Avalanche problem</FormLabel>
          <Select
            name="am_problem"
            value={bulletinForm.am_problem[0] ?? ''}
            mb={2}
            onChange={(e) =>
              setBulletinForm({
                ...bulletinForm,
                am_problem: [e.target.value, bulletinForm.am_problem[1]],
              })
            }
          >
            <option value="">None</option>
            <option value="new">New snow</option>
            <option value="wind">Wind slab</option>
            <option value="weak">Persistent weak layers</option>
            <option value="gliding">Gliding snow</option>
            <option value="wet">Wet snow</option>
          </Select>
        </FormControl>
        <FormControl>
          <FormLabel>Avalanche problem</FormLabel>
          <Select
            name="am_problem"
            value={bulletinForm.am_problem[1] ?? ''}
            mb={2}
            onChange={(e) =>
              setBulletinForm({
                ...bulletinForm,
                am_problem: [bulletinForm.am_problem[0], e.target.value],
              })
            }
          >
            <option value="">None</option>
            <option value="new">New snow</option>
            <option value="wind">Wind slab</option>
            <option value="weak">Persistent weak layers</option>
            <option value="gliding">Gliding snow</option>
            <option value="wet">Wet snow</option>
          </Select>
        </FormControl>
        <FormControl>
          <FormLabel>Aspect</FormLabel>
          <Input
            type="text"
            name="am_aspect"
            value={bulletinForm.am_aspect.toString()}
            mb={2}
            onChange={handleChangeForm}
          />
        </FormControl>
        PM
        <FormControl>
          <FormLabel>Elevation</FormLabel>
          <Input
            type="number"
            name="pm_elevation"
            value={bulletinForm.pm_elevation}
            mb={2}
            onChange={handleChangeForm}
          />
        </FormControl>
        <FormControl isRequired>
          <FormLabel>Danger level</FormLabel>
          <Input
            type="text"
            name="pm_danger"
            value={bulletinForm.pm_danger}
            mb={2}
            onChange={handleChangeForm}
          />
        </FormControl>
        <FormControl>
          <Checkbox
            isChecked={bulletinForm.pm_increase[0]}
            mb={2}
            onChange={(e) =>
              setBulletinForm({
                ...bulletinForm,
                pm_increase: [e.target.checked, bulletinForm.pm_increase[1]],
              })
            }
          >
            Increases with temperature
          </Checkbox>
        </FormControl>
        <FormControl>
          <Checkbox
            isChecked={bulletinForm.pm_increase[1]}
            mb={2}
            onChange={(e) =>
              setBulletinForm({
                ...bulletinForm,
                pm_increase: [bulletinForm.pm_increase[0], e.target.checked],
              })
            }
          >
            Increases with temperature
          </Checkbox>
        </FormControl>
        <FormControl>
          <FormLabel>Avalanche problem</FormLabel>
          <Select
            name="pm_problem"
            value={bulletinForm.pm_problem[0] ?? ''}
            mb={2}
            onChange={(e) =>
              setBulletinForm({
                ...bulletinForm,
                pm_problem: [e.target.value, bulletinForm.pm_problem[1]],
              })
            }
          >
            <option value="">None</option>
            <option value="new">New snow</option>
            <option value="wind">Wind slab</option>
            <option value="weak">Persistent weak layers</option>
            <option value="gliding">Gliding snow</option>
            <option value="wet">Wet snow</option>
          </Select>
        </FormControl>
        <FormControl>
          <FormLabel>Avalanche problem</FormLabel>
          <Select
            name="pm_problem"
            value={bulletinForm.pm_problem[1] ?? ''}
            mb={2}
            onChange={(e) =>
              setBulletinForm({
                ...bulletinForm,
                pm_problem: [bulletinForm.pm_problem[0], e.target.value],
              })
            }
          >
            <option value="">None</option>
            <option value="new">New snow</option>
            <option value="wind">Wind slab</option>
            <option value="weak">Persistent weak layers</option>
            <option value="gliding">Gliding snow</option>
            <option value="wet">Wet snow</option>
          </Select>
        </FormControl>
        <FormControl>
          <FormLabel>Aspect</FormLabel>
          <Input
            type="text"
            name="pm_aspect"
            value={bulletinForm.pm_aspect.toString()}
            mb={2}
            onChange={handleChangeForm}
          />
        </FormControl>
        <FormControl isRequired>
          <FormLabel>Forecast danger level</FormLabel>
          <Select
            placeholder="Select danger level"
            name="forecast"
            value={bulletinForm.forecast}
            mb={2}
            onChange={handleChangeForm}
          >
            <option value="0">0</option>
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
            <option value="5">5</option>
          </Select>
        </FormControl>
        <FormControl isRequired>
          <FormLabel>Until</FormLabel>
          <Input
            type="datetime-local"
            name="until"
            mb={2}
            value={bulletinForm.until}
            onChange={handleChangeForm}
          />
        </FormControl>
        <Button colorScheme="blue" mr={3} type="submit">
          Add avalanche bulletin
        </Button>
        <Button colorScheme="blue" mr={3} onClick={handleUpdateBulletin}>
          Update bulletin
        </Button>
      </form>
    </div>
  );
};

Avalanches.getLayout = function getLayout(page: ReactElement) {
  return <DashboardLayout maxHeight={true}>{page}</DashboardLayout>;
};

export default Avalanches;
