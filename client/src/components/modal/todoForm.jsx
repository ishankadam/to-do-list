/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { Box, Container } from "@mui/material";
import Textfield from "../textfield/textfield";
import SelectDropdown from "../select-dropdown/selectDropdown";
import ModalComponent from "./generic-modal";
import {
  errorMessages,
  findLabelByValue,
  hasEmptyField,
  priority,
  todoStatus,
} from "../../common";
import dayjs from "dayjs";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import UploadFiles from "../uploadFiles/uploadFiles";
import { createTodo, editTodo } from "../../api";

const ToDoForm = (props) => {
  const [todoDetails, settodoDetails] = useState({
    title: "",
    description: "",
    dueDate: dayjs(new Date()),
    assignedTo: "",
    comments: [],
    priority: "",
    status: "pending",
    file: undefined,
  });
  const [error, setError] = useState({
    title: false,
    description: false,
    dueDate: false,
    assignedTo: false,
    comments: false,
    priority: false,
    status: false,
    file: false,
  });
  const [employeeArray, setEmployeeArray] = useState(props.employeeArray || []);
  const [formMode, setFormMode] = useState("full");

  const handleChange = (value, field) => {
    if (field === "comments") {
      settodoDetails((prevDetails) => {
        const updatedComments = [...prevDetails.comments];
        const commentIndex =
          updatedComments.length > 0 ? updatedComments.length - 1 : 0;

        updatedComments[commentIndex] = {
          user: findLabelByValue(
            employeeArray,
            Number(localStorage.getItem("employeeId"))
          ),
          comment: value,
        };

        return {
          ...prevDetails,
          [field]: updatedComments,
        };
      });
    } else {
      settodoDetails((prevDetails) => ({
        ...prevDetails,
        [field]: value,
      }));
    }
  };

  const handleNewtodo = (e) => {
    e.preventDefault();
    createTodo({
      todo: todoDetails,
      setLoading: props.setLoading,
      setAllTodo: props.setTodos,
    });
    handleClose();
  };

  const handleEdittodo = (e) => {
    e.preventDefault();
    editTodo({
      todo: todoDetails,
      setLoading: props.setLoading,
      setTodo: props.setTodos,
    });
    handleClose();
  };

  const handleClose = () => {
    props.handleModalClose();
  };

  useEffect(() => {
    !props.isUpload && settodoDetails({ ...props.data });
  }, [props.data]);

  useEffect(() => {
    setEmployeeArray(props.employeeArray);
  }, [props.employeeArray]);

  useEffect(() => {
    if (props.isComment) {
      setFormMode("comment");
    } else if (props.isStatus) {
      setFormMode("status");
    } else {
      setFormMode("full");
    }
  }, [props.isCommentAdd, props.isStatusChange]);

  return (
    <ModalComponent
      className="todo-form-modal"
      open={props.open}
      title={{
        label: props.title,
        variant: "h2",
        id: "apply-todo-modal-title",
      }}
      primaryButton={{
        isRequired: true,
        label: props.isEdit ? "Save" : "Add",
        handler:
          props.isEdit || props.isComment ? handleEdittodo : handleNewtodo,
        disabled: hasEmptyField(todoDetails),
      }}
      secondaryButton={{
        isRequired: true,
        label: "Cancel",
        handler: handleClose,
      }}
    >
      <Container className="createtodo-container">
        <Box className="createtodo-box">
          {formMode === "full" && (
            <>
              <Textfield
                label="Title"
                variant="outlined"
                margin="normal"
                fullWidth
                required
                name="title"
                value={todoDetails.title}
                config={{ field: "title" }}
                handleEdit={handleChange}
                error={error.title}
                setError={setError}
                helperText={errorMessages.title}
              />
              <Textfield
                label="description"
                variant="outlined"
                margin="normal"
                fullWidth
                required
                name="description"
                value={todoDetails.description}
                config={{ field: "description" }}
                handleEdit={handleChange}
                error={error.description}
                setError={setError}
                helperText={errorMessages.description}
              />
              <SelectDropdown
                label="Assigned To"
                variant="outlined"
                margin="normal"
                fullWidth
                required
                select
                name="Assigned To"
                value={todoDetails.assignedTo || ""}
                config={{ field: "assignedTo" }}
                handleEdit={handleChange}
                optionList={employeeArray || []}
                sx={{ marginTop: "0 !important" }}
              />
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  label="Due Date"
                  value={dayjs(todoDetails.dueDate)}
                  onChange={(newValue) => handleChange(newValue, "dueDate")}
                />
              </LocalizationProvider>
              <SelectDropdown
                label="priority"
                variant="outlined"
                margin="normal"
                fullWidth
                required
                select
                name="priority"
                value={todoDetails.priority || ""}
                config={{ field: "priority" }}
                handleEdit={handleChange}
                optionList={priority}
              />

              <SelectDropdown
                label="status"
                variant="outlined"
                margin="normal"
                fullWidth
                required
                select
                name="status"
                value={todoDetails.status || ""}
                config={{ field: "status" }}
                handleEdit={handleChange}
                optionList={todoStatus}
              />

              <UploadFiles
                updateData={handleChange}
                isEdit={props.isEdit}
                images={todoDetails.file}
                file={todoDetails.file}
                acceptedFiles="image/png, image/jpeg, image/jpg, application/pdf"
                parentClass="product-form-container"
              />
              <Textfield
                label="comments"
                variant="outlined"
                margin="normal"
                fullWidth
                required
                name="comments"
                value={
                  todoDetails.comments.length > 1
                    ? todoDetails.comments[todoDetails.comments?.length - 1]
                        .comment
                    : ""
                }
                config={{ field: "comments" }}
                handleEdit={handleChange}
              />
            </>
          )}

          {formMode === "comment" && (
            <Textfield
              label="comments"
              variant="outlined"
              margin="normal"
              fullWidth
              required
              name="comments"
              value={
                todoDetails.comments.length > 1
                  ? todoDetails.comments[todoDetails.comments?.length - 1]
                      .comment
                  : ""
              }
              config={{ field: "comments" }}
              handleEdit={handleChange}
            />
          )}

          {formMode === "status" && (
            <SelectDropdown
              label="status"
              variant="outlined"
              margin="normal"
              fullWidth
              required
              select
              name="status"
              value={todoDetails.status || ""}
              config={{ field: "status" }}
              handleEdit={handleChange}
              optionList={todoStatus}
            />
          )}
        </Box>
      </Container>
    </ModalComponent>
  );
};

export default ToDoForm;
