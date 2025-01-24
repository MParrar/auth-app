import React, { useEffect, useState } from "react";
import { Heading } from "../components/heading";
import { Divider } from "../components/divider";
import axios from "axios";
import PaginatedTable from "../components/PaginatedTable";
import { format } from "date-fns";

export const AuditLogs = () => {
  const [logs, setLogs] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_BASE_URL}/admin/logs`)
      .then((res) => setLogs(res?.data?.logs))
      .catch((err) => console.log(err));
  }, []);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const filteredLogs = logs
    .map((log) => {
      return {
        ...log,
        user: log?.name,
        date: format(new Date(log?.timestamp), "yyyy-MM-dd HH:mm:ss"),
      };
    })
    .filter((log) => {
      const searchLower = searchTerm.toLowerCase().trim();
      const normalizedTimestamp = format(
        new Date(log.timestamp),
        "yyyy-MM-dd HH:mm:ss"
      ).toLowerCase();
      const dateOnly = format(new Date(log.timestamp), "yyyy-MM-dd");
      const timeOnly = format(new Date(log.timestamp), "HH:mm:ss");

      return (
        log.name.toLowerCase().includes(searchLower) ||
        log.action.toLowerCase().includes(searchLower) ||
        normalizedTimestamp.includes(searchLower) ||
        (searchLower.includes(" ") &&
          dateOnly.includes(searchLower.split(" ")[0]) &&
          timeOnly.includes(searchLower.split(" ")[1]))
      );
    });

  return (
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
        headers={["User", "Action", "Date"]}
        rowsPerPage={5}
      />
    </>
  );
};
