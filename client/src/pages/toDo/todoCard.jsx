import React, { useEffect, useState } from "react";
import { Button, Card, CardContent, Typography } from "@mui/material";
import { imageUrl } from "../../api";

const TodoCard = (props) => {
  const [todo, setTodo] = useState({});

  useEffect(() => {
    setTodo(props.todo);
  }, [props.todo]);
  return (
    <Card className="todo-card">
      <CardContent>
        <Typography
          variant="h5"
          component="div"
          color="primary"
          sx={{ marginBottom: "20px" }}
        >
          {todo.title}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          <strong>Description:</strong> {todo.description}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          <strong>Due Date:</strong>{" "}
          {new Date(todo.dueDate).toLocaleDateString()}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          <strong>Assigned To:</strong> {todo.assignedTo}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          <strong>Priority:</strong> {todo.priority}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          <strong>Status:</strong> {todo.status}
        </Typography>
        <div className="comments">
          <strong>Comments:</strong>
          <ul>
            {todo.comments && todo.comments.length > 0
              ? todo.comments.map((comment, index) => (
                  <li key={index}>
                    <strong>{comment.user}:</strong> {comment.comment}
                  </li>
                ))
              : "NO Comments"}
          </ul>
        </div>
        {todo.file && todo.file instanceof File ? (
          todo.file.type.startsWith("image/") ? (
            <img
              className="attachment-file"
              src={URL.createObjectURL(todo.file)}
              alt="attachment"
              style={{ width: "100%", height: "auto" }}
            />
          ) : (
            <a href={URL.createObjectURL(todo.file)} download={todo.file.name}>
              <Button variant="outlined">Download File</Button>
            </a>
          )
        ) : todo.file ? (
          todo.file.toLowerCase().endsWith(".jpg") ||
          todo.file.toLowerCase().endsWith(".jpeg") ||
          todo.file.toLowerCase().endsWith(".png") ||
          todo.file.toLowerCase().endsWith(".gif") ? (
            <img
              className="attachment-file"
              src={`${imageUrl}${todo.file}`}
              alt="attachment"
              style={{ width: "200px", height: "200px" }}
            />
          ) : (
            <a href={`${imageUrl}${todo.file}`} download={todo.file}>
              <Button variant="outlined">Download File</Button>
            </a>
          )
        ) : null}
      </CardContent>
    </Card>
  );
};

export default TodoCard;
