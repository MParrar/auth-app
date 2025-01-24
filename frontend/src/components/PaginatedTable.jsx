import React, { useState } from "react";
import {
  Pagination,
  PaginationList,
  PaginationNext,
  PaginationPage,
  PaginationPrevious,
} from "../components/pagination";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/table";
import { Text } from '../components/text'

function PaginatedTable({ data, headers, rowsPerPage = 5, actions }) {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(data.length / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const paginatedData = data.slice(startIndex, startIndex + rowsPerPage);

  const handlePageChange = (page) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <>
      <Table>
        <TableHead>
          <TableRow>
            {headers.map((header, index) => (
              <TableHeader key={index}>{header}</TableHeader>
            ))}
            {actions && <TableHeader>Actions</TableHeader>}
          </TableRow>
        </TableHead>
        <TableBody>
          {
          paginatedData?.length > 0 
          ?
          paginatedData.map((row, rowIndex) => (
            <TableRow key={rowIndex}>
              {headers.map((header, colIndex) => (
                <TableCell key={colIndex} className={colIndex === 0 ? "font-medium" : ""}>
                  {row[header?.toLowerCase()]}
                </TableCell>
              ))}
              {actions && (
                <TableCell>
                  <div className="flex gap-2">{actions(row)}</div>
                </TableCell>
              )}
            </TableRow>
          ))
          :
          <TableRow>
          <TableCell colSpan={headers.length + (actions ? 1 : 0)} className="text-center">
            <Text>No data available</Text>
          </TableCell>
        </TableRow>
        }
        </TableBody>
      </Table>

      <Pagination className="mt-6">
        <PaginationPrevious
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Previous
        </PaginationPrevious>
        <PaginationList>
          {Array.from({ length: totalPages }, (_, index) => (
            <PaginationPage
              key={index}
              current={currentPage === index + 1}
              onClick={() => {
                handlePageChange(index + 1);
              }}
            >
              {index + 1}
            </PaginationPage>
          ))}
        </PaginationList>
        <PaginationNext
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          Next
        </PaginationNext>
      </Pagination>
    </>
  );
}

export default PaginatedTable;
