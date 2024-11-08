import {
  Chip,
  CircularProgress,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  TableSortLabel,
} from "@mui/material";
import _ from "lodash";
import React, { useEffect, useState } from "react";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import CommentIcon from "@mui/icons-material/Comment";
import ConfirmationModal from "../modal/confirmation-modal";
import moment from "moment";
import {
  findLabelByValue,
  getChipColor,
  getStatusStyle,
  priority,
  todoStatus,
} from "../../common";
import ViewTodo from "../modal/viewTodo";

const CustomTable = (props) => {
  const [rowData, setRowData] = useState(props.rowData);
  const [deleteInfo, setDeleteInfo] = useState({
    row: 0,
    index: 0,
    show: false,
    deleteFunc: undefined,
  });

  const [viewInfo, setviewInfo] = useState({
    data: {},
    show: false,
    editFunc: undefined,
  });

  const [loading, setLoading] = useState(props.loading);
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("");

  useEffect(() => {
    setLoading(props.loading);
  }, [props.loading]);

  useEffect(() => {
    setRowData(props.rowData);
  }, [props.rowData]);

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);

    const sortedData = [...rowData].sort((a, b) => {
      if (property === "dueDate") {
        const dateA = new Date(a[property]);
        const dateB = new Date(b[property]);
        return isAsc ? dateA - dateB : dateB - dateA;
      } else if (property === "priority") {
        const priorityOrder = { High: 1, Medium: 2, Low: 3 };
        const priorityA = priorityOrder[a[property]] || 4;
        const priorityB = priorityOrder[b[property]] || 4;
        return isAsc ? priorityA - priorityB : priorityB - priorityA;
      } else if (property === "status") {
        const statusOrder = { Pending: 1, progress: 2, Complete: 3 };
        const statusA = statusOrder[a[property]] || 4;
        const statusB = statusOrder[b[property]] || 4;
        return isAsc ? statusA - statusB : statusB - statusA;
      } else {
        const valueA = a[property]?.toString().toLowerCase() || "";
        const valueB = b[property]?.toString().toLowerCase() || "";
        return isAsc
          ? valueA.localeCompare(valueB)
          : valueB.localeCompare(valueA);
      }
    });

    setRowData(sortedData);
  };

  const getCell = (colDef, row, rowIndex, colIndex) => {
    let children;
    switch (colDef.type) {
      case "text":
        children = <Typography>{row[colDef.key]}</Typography>;
        break;
      case "date":
        children = (
          <Typography>
            {moment(new Date(row[colDef.key])).format("DD-MM-YYYY")}
          </Typography>
        );
        break;
      case "valueToText":
        children = (
          <Typography>
            {findLabelByValue(colDef.employeeArray, row[colDef.key])}
          </Typography>
        );
        break;
      case "textColor":
        children = (
          <Typography sx={getStatusStyle(row[colDef.key])}>
            {findLabelByValue(todoStatus, row[colDef.key])}
          </Typography>
        );
        break;
      case "chip":
        const { color } = getChipColor(row[colDef.key]);
        children = (
          <Chip
            label={findLabelByValue(priority, row[colDef.key])}
            color={color}
            variant="contained"
            style={{ margin: "4px" }}
          />
        );
        break;
      case "dropdown":
        const label = findLabelByValue(row[colDef.key]);
        children = <Typography>{label}</Typography>;
        break;
      case "action":
        children = (
          <Stack justifyContent="center" spacing={2} direction="row">
            {colDef.isEdit ? (
              <EditIcon
                onClick={(e) => {
                  e.stopPropagation();
                  colDef.editFunc(row, rowIndex);
                }}
                sx={{ cursor: "pointer" }}
                id={`${colDef.editId}-${rowIndex}`}
              ></EditIcon>
            ) : (
              ""
            )}
            {colDef.isDelete ? (
              <DeleteIcon
                onClick={(e) => {
                  e.stopPropagation();
                  setDeleteInfo({
                    row: row,
                    index: rowIndex,
                    show: true,
                    deleteFunc: colDef.deleteFunc,
                  });
                }}
                sx={{ cursor: "pointer" }}
                id={`${colDef.deleteId}-${rowIndex}`}
              ></DeleteIcon>
            ) : (
              ""
            )}
            {colDef.isComment ? (
              <CommentIcon
                onClick={(e) => {
                  e.stopPropagation();
                  colDef.commentFunc(row, rowIndex);
                }}
                sx={{ cursor: "pointer" }}
                id={`${colDef.deleteId}-${rowIndex}`}
              ></CommentIcon>
            ) : (
              ""
            )}
          </Stack>
        );
        break;
      default:
        children = <Typography>{row[colDef.key]}</Typography>;
    }
    return (
      <TableCell
        align={colDef.align}
        key={`header-${colDef.id}`}
        id={`${colDef.id}-column-header`}
      >
        {children}
      </TableCell>
    );
  };

  const handleSort = (array, order, orderBy) => {
    const sortedArray = _.orderBy(array, [orderBy], [order]);
    return sortedArray;
  };

  const sortedRowData = handleSort(rowData, order, orderBy);

  return (
    <>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead className="job-table-header">
            <TableRow sx={{ position: "sticky", zIndex: 900, top: 0 }}>
              {props.colDef.map((column) =>
                column.isSort ? (
                  <TableCell
                    key={`header-${column.id}`}
                    align={column.align}
                    sortDirection={orderBy === column.key ? order : false}
                  >
                    <TableSortLabel
                      active={orderBy === column.key}
                      direction={orderBy === column.key ? order : "asc"}
                      onClick={(event) => handleRequestSort(event, column.key)}
                    >
                      {_.upperCase(column.label)}
                    </TableSortLabel>
                  </TableCell>
                ) : (
                  <TableCell
                    align={column.align}
                    key={`header-${column.id}`}
                    id={`${column.id}-column-header`}
                  >
                    {_.upperCase(column.label)}
                  </TableCell>
                )
              )}
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <CircularProgress />
            ) : sortedRowData?.length > 0 ? (
              sortedRowData.map(
                (row, rowIndex) =>
                  row && (
                    <TableRow
                      key={`row-${rowIndex}`}
                      sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                      onClick={(e) => {
                        e.stopPropagation();
                        setviewInfo({
                          data: row,
                          show: true,
                        });
                      }}
                    >
                      {props.colDef.map((column, colIndex) => {
                        return getCell(column, row, rowIndex, colIndex);
                      })}
                    </TableRow>
                  )
              )
            ) : (
              <TableRow>
                <TableCell colSpan={props.colDef.length}>
                  <Typography align="center">No records found</Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      {deleteInfo.show ? (
        <ConfirmationModal
          open={deleteInfo.show}
          title={props.deleteContent.title}
          message={props.deleteContent.message}
          handleConfirm={() => {
            deleteInfo.deleteFunc(deleteInfo.row, deleteInfo.index);
            setDeleteInfo({ show: false });
          }}
          handleCancel={() => setDeleteInfo({ show: false })}
        />
      ) : null}
      {viewInfo.show ? (
        <ViewTodo
          open={viewInfo.show}
          data={viewInfo.data}
          handleEdit={() => {
            props.handleEditTodo(viewInfo.data);
            setviewInfo({ show: false });
          }}
          handleCancel={() => setviewInfo({ show: false })}
        />
      ) : null}
    </>
  );
};

export default CustomTable;
