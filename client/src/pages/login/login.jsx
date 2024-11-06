import React, { useState } from "react";
import { Button, Box, Typography, Container, Link } from "@mui/material";
import Textfield from "../../components/textfield/textfield";
import { useNavigate } from "react-router-dom";
import { login } from "../../api";
import { useUser } from "../../todoContext";

const Login = () => {
  const { handleLogin } = useUser();
  const [user, setUser] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState({
    email: false,
    password: false,
  });

  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const loggedInUser = await login(user, error, setError);
      if (loggedInUser) {
        handleLogin(loggedInUser);
        navigate("/");
      }
    } catch (err) {
      console.error("Login failed:", err);
    }
  };

  const handleEdit = (value, field) => {
    setUser({ ...user, [field]: value });
  };

  return (
    <Container maxWidth="xs" className="login-container">
      <Box sx={{ mt: 12 }} className="box">
        <Typography variant="h5" gutterBottom className="login-typography">
          Login
        </Typography>
        <form onSubmit={handleSubmit} className="login-form">
          <Textfield
            id="login-email"
            label="Email"
            variant="outlined"
            margin="normal"
            fullWidth
            required
            value={user.email}
            error={error.email}
            errorObj={error}
            setError={setError}
            helperText={error.email ? "Please enter correct Email" : ""}
            config={{ field: "email", type: "email" }}
            handleEdit={handleEdit}
          />
          <Textfield
            id="login-password"
            label="Password"
            variant="outlined"
            margin="normal"
            fullWidth
            required
            type="password"
            value={user.password}
            error={error.password}
            errorObj={error}
            setError={setError}
            helperText={error.password ? "Please enter correct password" : ""}
            config={{ field: "password", type: "password" }}
            handleEdit={handleEdit}
          />
          <Link
            className="sign-up-link"
            onClick={() => {
              navigate("/signup");
            }}
          >
            Not a Member? Sign up
          </Link>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className="login-button"
          >
            Login
          </Button>
        </form>
      </Box>
    </Container>
  );
};

export default Login;
