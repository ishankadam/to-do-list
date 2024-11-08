import React, { useEffect, useState } from "react";
import CustomTable from "../../components/custom-table/customTable";
import { deleteTodo } from "../../api";
import { Alert, Snackbar } from "@mui/material";

const TodoTable = (props) => {
  const [todos, setTodos] = useState(props.todos || []);
  const [snackbarDetails, setSnackbarDetails] = useState({
    open: false,
    message: "",
  });
  useEffect(() => {
    setTodos(props.todos);
  }, [props.todos]);

  const handleComments = (row) => {
    props.setShowModal({
      show: true,
      isEdit: false,
      isUpload: false,
      isComment: true,
      status: false,
      title: "Add Comment",
      data: row,
    });
  };
  const handleDeleteTodo = (todo) => {
    deleteTodo({
      todo,
      setLoading: props.setLoading,
      setTodo: props.setTodos,
      setSnackbarDetails,
    });
  };

  const handleCloseSnackbar = () => {
    setSnackbarDetails({
      open: false,
      message: "",
    });
  };

  const handleEditTodo = (row) => {
    props.setShowModal({
      show: true,
      isEdit: true,
      isUpload: false,
      isComment: false,
      status: false,
      title: "Edit Todo",
      data: row,
    });
  };

  const colDef = [
    {
      id: "title",
      label: "Title",
      key: "title",
      type: "text",
      align: "left",
    },
    {
      id: "description",
      label: "Description",
      key: "description",
      type: "text",
      align: "left",
    },
    {
      id: "due-date",
      label: "Due Date",
      key: "dueDate",
      type: "date",
      align: "left",
      isSort: true,
    },
    {
      id: "assigned-to",
      label: "Assigned to",
      key: "assignedTo",
      type: "valueToText",
      align: "left",
      employeeArray: props.employeeArray,
    },
    {
      id: "priority",
      label: "Priority",
      key: "priority",
      type: "chip",
      align: "left",
      isSort: true,
    },
    {
      id: "status",
      label: "status",
      key: "status",
      type: "textColor",
      align: "left",
      isSort: true,
    },
    {
      id: "notification-icon",
      label: "",
      key: "editAction",
      type: "action",
      align: "left",
      editId: "edit-icon",
      deleteId: "delete-icon",
      commentId: "comment-icon",
      editFunc: (row, index) => handleEditTodo(row, true, index),
      commentFunc: (row, index) => handleComments(row, true, index),
      deleteFunc: (row, index) => handleDeleteTodo(row, index),
      isDelete: props.userRole === "admin" && true,
      isEdit: true,
      isComment: true,
      page: "TodoListing",
    },
  ];
  return (
    <>
      <div className="todos-table">
        <CustomTable
          colDef={colDef}
          rowData={todos}
          deleteContent={{
            title: "Delete Confirmation",
            message: "Are you sure you want to delete this record?",
          }}
          loading={false}
          handleEditTodo={handleEditTodo}
        ></CustomTable>
        <Snackbar
          open={snackbarDetails.open}
          autoHideDuration={5000}
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
        >
          <Alert
            onClose={handleCloseSnackbar}
            severity="success"
            sx={{
              display: "flex",
              justifyContent: "center",
              backgroundColor: "#4caf50",
              color: "#000",
            }}
          >
            {snackbarDetails.message}
          </Alert>
        </Snackbar>
      </div>
    </>
  );
};

export default TodoTable;
