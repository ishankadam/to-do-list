/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { getAllEmployees, getAllTodos } from "../../api";
import TodoTable from "../toDo/todoTable";
import { Alert, Button, Snackbar, Typography } from "@mui/material";
import MenuAppBar from "../../components/appbar/appbar";
import ToDoForm from "../../components/modal/todoForm";
import SelectDropdown from "../../components/select-dropdown/selectDropdown";
import { todoStatus } from "../../common";
import Textfield from "../../components/textfield/textfield";
const Dashboard = ({ socket }) => {
  const [todos, setTodos] = useState([]);
  const [filteredTodos, setFilteredTodos] = useState([]);
  const [filterArray, setFilterArray] = useState({
    employeeArray: [],
    statusArray: [],
  });
  const [snackbarDetails, setSnackbarDetails] = useState({
    open: false,
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const [employeeArray, setEmployeeArray] = useState([]);
  const [userRole, setUserRole] = useState("");
  const [showModal, setShowModal] = useState({
    show: false,
    isEdit: false,
    data: {},
    isComment: false,
    isUpload: true,
  });
  const [filter, setFilter] = useState({
    assignedTo: "all",
    status: "all",
    text: "",
  });

  useEffect(() => {
    getAllTodos({
      setTodos,
      employeeId: localStorage.getItem("employeeId"),
    });

    socket.on("taskCreated", (newTodo) => {
      setTodos((prevTodos) => [...prevTodos, newTodo]);
      setSnackbarDetails({
        open: true,
        message: `New task "${newTodo.title}" created!`,
      });
    });

    socket.on("taskUpdated", (updatedTodo) => {
      setTodos((prevTodos) =>
        prevTodos.map((todo) =>
          todo.todoId === updatedTodo.todoId ? updatedTodo : todo
        )
      );

      setSnackbarDetails({
        open: true,
        message: `"${updatedTodo.title}" Edited!`,
      });
    });

    return () => {
      socket.off("taskCreated");
    };
  }, []);

  useEffect(() => {
    getAllEmployees({ setEmployees: setEmployeeArray });
    const role = localStorage.getItem("role");
    setUserRole(role);

    const statusOptions = [{ label: "All", value: "all" }, ...todoStatus];
    setFilterArray((prevDetails) => ({
      ...prevDetails,
      statusArray: statusOptions,
    }));
  }, []);

  useEffect(() => {
    if (employeeArray.length > 0) {
      const filterForEmployee = [
        { label: "All", value: "all" },
        ...employeeArray,
      ];
      setFilterArray((prevDetails) => ({
        ...prevDetails,
        employeeArray: filterForEmployee,
      }));
    }
  }, [employeeArray]);

  const handleOpenForm = () => {
    setShowModal({
      show: true,
      isEdit: false,
      isComment: false,
      isUpload: true,
      title: "Create Todo",
      data: {},
    });
  };

  const handleChange = (value, field) => {
    setFilter((prevDetails) => ({
      ...prevDetails,
      [field]: value,
    }));
  };

  useEffect(() => {
    const applyFilters = () => {
      const filteredTasks = todos.filter((task) => {
        const assigneeMatch =
          filter.assignedTo === "all" || task.assignedTo === filter.assignedTo;

        const statusMatch =
          filter.status === "all" || task.status === filter.status;

        const keywordMatch = filter.text
          ? task.title.toLowerCase().includes(filter.text.toLowerCase()) ||
            task.description.toLowerCase().includes(filter.text.toLowerCase())
          : true;

        return assigneeMatch && statusMatch && keywordMatch;
      });

      setFilteredTodos(filteredTasks);
    };

    applyFilters();
  }, [todos, filter]);

  const handleModalClose = () => {
    setShowModal({
      show: false,
      data: {},
    });
  };

  const handleCloseSnackbar = () => {
    setSnackbarDetails({
      open: false,
      message: "",
    });
  };

  return (
    <div>
      <MenuAppBar />
      <div className="header-wrapper">
        <Typography variant="h2">To-do's</Typography>
        {userRole === "admin" && (
          <>
            <SelectDropdown
              label="Assigned To"
              variant="outlined"
              margin="normal"
              fullWidth
              required
              select
              name="Assigned To"
              value={filter.assignedTo}
              config={{ field: "assignedTo" }}
              handleEdit={handleChange}
              optionList={filterArray.employeeArray}
            />
            <SelectDropdown
              label="Status"
              variant="outlined"
              margin="normal"
              fullWidth
              required
              select
              name="Status"
              value={filter.status}
              config={{ field: "status" }}
              handleEdit={handleChange}
              optionList={filterArray.statusArray}
            />
            <Textfield
              label="Search anything..."
              variant="outlined"
              margin="normal"
              fullWidth
              name="text"
              value={filter.text}
              config={{ field: "text", type: "filter" }}
              handleEdit={handleChange}
            />
            <Button
              variant="contained"
              sx={{ margin: "10px 20px" }}
              onClick={handleOpenForm}
            >
              Add To-do
            </Button>{" "}
          </>
        )}
      </div>
      <TodoTable
        todos={filteredTodos}
        setTodos={setTodos}
        showModal={showModal}
        setShowModal={setShowModal}
        employeeArray={employeeArray}
        setLoading={setLoading}
        userRole={userRole}
      />
      {showModal.show && (
        <ToDoForm
          open={showModal.show}
          isEdit={showModal.isEdit}
          data={showModal.data}
          isComment={showModal.isComment}
          title={showModal.title}
          isUpload={showModal.isUpload}
          isStatus={showModal.isStatus}
          handleModalSubmit={() => {}}
          handleModalClose={handleModalClose}
          setShowModal={setShowModal}
          employeeArray={employeeArray}
          loading={loading}
          setLoading={setLoading}
          setTodos={setTodos}
        />
      )}
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
  );
};

export default Dashboard;
