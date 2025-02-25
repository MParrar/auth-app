import React, { useEffect, useState } from 'react';
import { Heading } from '../components/heading';
import { Divider } from '../components/divider';
import PaginatedTable from '../components/PaginatedTable';
import { format } from 'date-fns';
import { Loading } from '../components/Loading';
import { getAdminLogs } from '../services/userServices';
import { useNotification } from '../contexts/NotificationProvider';
import useAxios from '../hook/axiosInstance';

export const AuditLogs = () => {
  const showNotification = useNotification();
  const axiosInstance = useAxios();

  const [logs, setLogs] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchLogs = async () => {
      setLoading(true); 
      const response = await getAdminLogs(
        axiosInstance,
        showNotification
      );
      if (response?.status === 'success') {
        setLogs(response.logs);
      }
      setLoading(false);
      return response;
    };
    fetchLogs();
  }, []);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const filteredLogs = logs
    .map((log) => {
      return {
        ...log,
        user: log?.name,
        date: format(new Date(log?.timestamp), 'yyyy-MM-dd HH:mm:ss'),
      };
    })
    .filter((log) => {
      const searchLower = searchTerm.toLowerCase().trim();
      const normalizedTimestamp = format(
        new Date(log.timestamp),
        'yyyy-MM-dd HH:mm:ss'
      ).toLowerCase();
      const dateOnly = format(new Date(log.timestamp), 'yyyy-MM-dd');
      const timeOnly = format(new Date(log.timestamp), 'HH:mm:ss');

      return (
        log.name.toLowerCase().includes(searchLower) ||
        log.action.toLowerCase().includes(searchLower) ||
        normalizedTimestamp.includes(searchLower) ||
        (searchLower.includes(' ') &&
          dateOnly.includes(searchLower.split(' ')[0]) &&
          timeOnly.includes(searchLower.split(' ')[1]))
      );
    });

  return loading ? (
    <div
      style={{ height: '80vh', overflow: 'hidden' }}
      className="overflow-y-hidden"
    >
      <Loading />
    </div>
  ) : (
    <>
      <div className="flex w-full flex-wrap items-end justify-between border-zinc-950/10 pb-6 dark:border-white/10">
        <Heading>Audit Logs</Heading>
        <div className="flex gap-4">
          <input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="px-2 py-1 border rounded-md"
          />
        </div>
      </div>
      <Divider />
      <PaginatedTable
        data={filteredLogs}
        headers={['User', 'Action', 'Date']}
        rowsPerPage={5}
      />
    </>
  );
};
