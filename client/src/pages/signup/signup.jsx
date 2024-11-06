import React, { useEffect, useState } from "react";
import { Button, Box, Typography, Container } from "@mui/material";
import { Cancel, CheckCircle } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { departments, hasEmptyField, roles } from "../../common";
import Textfield from "../../components/textfield/textfield";
import SelectDropdown from "../../components/select-dropdown/selectDropdown";
import { createUser } from "../../api";

const Signup = () => {
  const [user, setUser] = useState({
    password: "",
    role: "",
    department: "",
  });

  const navigate = useNavigate();
  const [error, setError] = useState({
    name: false,
    email: false,
    password: false,
    confirmPassword: false,
    phone: false,
    role: false,
    department: false,
  });
  const [buttonDisabled, setButtonDisabled] = useState(true);
  const [validation, setValidation] = useState({
    minLength: null,
    uppercase: null,
    lowercase: null,
    digit: null,
    specialChar: null,
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (user.password !== user.confirmPassword) {
      setError({ ...error, confirmPassword: true });
    } else {
      setError({ ...error, confirmPassword: false });
    }
    createUser(user, navigate);
  };

  useEffect(() => {
    const hasErrors = Object.values(error).some((err) => err === true);
    const hasEmptyFields = hasEmptyField(user);

    setButtonDisabled(hasEmptyFields || hasErrors);
  }, [user, error]);

  const handleEdit = (value, field) => {
    setUser({ ...user, [field]: value });
  };

  const BulletPoint = ({ condition, text }) => (
    <Box
      display="flex"
      alignItems="center"
      mb={1}
      color={condition !== null ? (condition ? "green" : "red") : "grey"}
    >
      {condition ? <CheckCircle /> : <Cancel />}
      <Typography ml={1}>{text}</Typography>
    </Box>
  );

  return (
    <Container maxWidth="xs" className="signup-container">
      <Box sx={{ mt: 8 }} className="signup-box">
        <Typography variant="h5" gutterBottom className="signup-typography">
          Signup
        </Typography>
        <Textfield
          id="login-fullName"
          label="Full Name"
          variant="outlined"
          margin="normal"
          fullWidth
          required
          value={user.name}
          error={error.name}
          errorMessage="This field is required"
          helperText={error.name ? "Please enter your full name" : ""}
          errorObj={error}
          setError={setError}
          config={{ isrequired: true, field: "name", type: "name" }}
          handleEdit={handleEdit}
        />
        <Textfield
          id="login-email"
          label="Email"
          variant="outlined"
          margin="normal"
          fullWidth
          required
          type="email"
          value={user.email}
          error={error.email}
          errorMessage="This field is required"
          helperText={error.email ? "Please enter correct email id" : ""}
          errorObj={error}
          setError={setError}
          config={{ isrequired: true, field: "email", type: "email" }}
          handleEdit={handleEdit}
        />
        <Textfield
          id="login-phone"
          label="Phone Number"
          variant="outlined"
          margin="normal"
          fullWidth
          required
          value={user.phone}
          error={error.phone}
          errorMessage="This field is required"
          helperText={
            error.phone ? "Please enter your correct phone number" : ""
          }
          errorObj={error}
          setError={setError}
          type="number"
          config={{ isrequired: true, field: "phone", type: "phone" }}
          handleEdit={handleEdit}
        />
        <Box>
          <Textfield
            label="Password"
            type="password"
            value={user.password}
            error={error.password}
            errorObj={error}
            setError={setError}
            handleEdit={handleEdit}
            variant="outlined"
            fullWidth
            setValidation={setValidation}
            errorMessage="This field is required"
            helperText={error.password ? "Please enter your passowrd" : ""}
            config={{ isrequired: true, field: "password", type: "password" }}
            sx={{ width: "100%" }}
          />
          <Box mt={2}>
            <Typography variant="body2">
              <BulletPoint
                condition={validation.minLength}
                text="At least 8 characters"
              />
              <BulletPoint
                condition={validation.uppercase}
                text="At least one uppercase letter"
              />
              <BulletPoint
                condition={validation.lowercase}
                text="At least one lowercase letter"
              />
              <BulletPoint
                condition={validation.digit}
                text="At least one digit"
              />
              <BulletPoint
                condition={validation.specialChar}
                text="At least one special character"
              />
            </Typography>
          </Box>
        </Box>
        <Textfield
          id="signup-confirm-password"
          label="Confirm Password"
          variant="outlined"
          margin="normal"
          fullWidth
          required
          type="password"
          value={user.confirmPassword}
          error={error.confirmPassword}
          errorObj={error}
          setError={setError}
          errorMessage="This field is required"
          helperText={error.confirmPassword ? "Password does not match" : ""}
          config={{
            isrequired: true,
            field: "confirmPassword",
            type: "password",
          }}
          handleEdit={handleEdit}
        />
        <SelectDropdown
          label="Role"
          variant="outlined"
          value={user.role}
          config={{ field: "role" }}
          handleEdit={handleEdit}
          fullWidth
          margin="normal"
          optionList={roles}
        ></SelectDropdown>
        <SelectDropdown
          label="Department"
          variant="outlined"
          value={user.department}
          config={{ field: "department" }}
          handleEdit={handleEdit}
          fullWidth
          margin="normal"
          optionList={departments}
        ></SelectDropdown>
        <Button
          type="submit"
          fullWidth
          variant="contained"
          color="primary"
          className="signup-button"
          disabled={buttonDisabled}
          onClick={handleSubmit}
        >
          Signup
        </Button>
      </Box>
    </Container>
  );
};

export default Signup;
