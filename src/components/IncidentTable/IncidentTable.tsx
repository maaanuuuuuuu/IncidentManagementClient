import { IIncident } from "../../features/IncidentListPage/useIncidentListPage";
import { Table, TableHead, TableRow, TableCell, TableBody } from "@material-ui/core";
import { TablePagination } from "@mui/material";
import { useState, useEffect } from 'react';
import { format } from "date-fns";

interface IIncidentTableProps {
  incidentsOnPage: IIncident[];
  pageNumber: number;
  totalCount: number;
  onChangePage: (page: number, rowsPerPage: number) => void
}

export const IncidentTable = ({ incidentsOnPage, pageNumber, totalCount, onChangePage }: IIncidentTableProps) => {
  const columns = [
    { field: 'emailClient', headerName: 'Email du client' },
    { field: 'pickupLocation', headerName: 'Point de relais' },
    { field: 'incidentDate', headerName: 'Date', type: 'date' },
    { field: 'incidentType', headerName: "Type d'incident" },
    { field: 'cause', headerName: 'Cause' },
    { field: 'resolution', headerName: 'Résolution' },
    { field: 'reimbursedAmount', headerName: 'Montant remboursé' },
  ];
  const [rowsPerPage, setRowsPerPage] = useState<number>(5);
  const [page, setPage] = useState<number>(pageNumber);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };
  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  useEffect(() => {
    onChangePage(page, rowsPerPage);
  }, [page, rowsPerPage]);

  return (
    <div>
      <Table>
        <TableHead>
          <TableRow>
            {columns.map((column, index) => {
              return (
                <TableCell key={column.field + "_" + index}>{column.headerName}</TableCell>
              )
            })}
          </TableRow>
        </TableHead>
        <TableBody>
          {incidentsOnPage.length === 0 &&
            <div className="table__no-data">
              Pas de donnée dans la base
            </div>
          }
          {incidentsOnPage.map((incident: IIncident) => (
            <TableRow key={incident.id}>
              {columns.map((column, index) => (
                <TableCell key={incident.id + "_" + index}>
                  {column.field === "incidentDate" ?
                    format(new Date(incident.incidentDate), "dd/MM/yyyy")
                    :
                    incident[column.field as (keyof IIncident)]
                  }
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={totalCount}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </div>
  );
}
