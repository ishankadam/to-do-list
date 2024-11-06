import React from "react";
import ModalComponent from "./generic-modal";
import TodoCard from "../../pages/toDo/todoCard";

const ViewTodo = (props) => {
  return (
    <div>
      <ModalComponent
        className="todo-form-modal"
        open={props.open}
        title={{
          label: props.title || "",
          variant: "h2",
          id: "confirmation-modal-title",
        }}
        primaryButton={{
          isRequired: true,
          label: "Edit",
          handler: props.handleEdit,
          className: "confirmation-modal-confirm",
          color: "error",
        }}
        secondaryButton={{
          isRequired: true,
          label: "cancel",
          handler: props.handleCancel,
          className: "confirmation-modal-cancel",
        }}
        isConfirmation={true}
      >
        <TodoCard todo={props.data} />
      </ModalComponent>
    </div>
  );
};

export default ViewTodo;
