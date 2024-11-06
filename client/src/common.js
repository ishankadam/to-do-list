export const validateEmail = (passedEmail) => {
  let emailRegex = /^[A-Za-z0-9_.-]{3,}@(gmail\.com)$/;
  return emailRegex.test(passedEmail);
};

export const isValidPhoneNumber = (phoneNumber) => {
  const phoneRegex = /^[7-9]\d{9}$/;

  return phoneRegex.test(phoneNumber);
};

export const validatePassword = (password) => {
  return {
    minLength: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    digit: /\d/.test(password),
    specialChar: /[!@#$%^&*(),.?":{}|<>]/.test(password),
  };
};

export const hasEmptyField = (obj) => {
  return Object.values(obj).some(
    (value) => typeof value === "string" && value.trim() === ""
  );
};

export const roles = [
  { label: "Employee", value: "emp" },
  { label: "Manager", value: "mgr" },
  { label: "Team Lead", value: "tl" },
  { label: "Admin", value: "admin" },
];

export const departments = [
  { label: "Human Resources", value: "hr" },
  { label: "Frontend", value: "frontend" },
  { label: "Backend", value: "backend" },
  { label: "UI/UX", value: "uiux" },
];

export const priority = [
  { label: "Low", value: "low" },
  { label: "Medium", value: "medium" },
  { label: "High", value: "high" },
];

export const todoStatus = [
  { label: "Pending", value: "pending" },
  { label: "In Progress", value: "progress" },
  { label: "Completed", value: "complete" },
];

export const errorMessages = {
  title: "Please Enter Title",
  description: "Please Enter Description",
};

export const findLabelByValue = (array, value) => {
  const element = array.find((ele) => ele.value === value);
  return element ? element.label : null;
};

export const getChipColor = (status) => {
  switch (status) {
    case "high":
      return { color: "error" };
    case "medium":
      return { color: "warning" };
    case "low":
      return { color: "success" };
    default:
      return { color: "default" };
  }
};

export const getStatusStyle = (status) => {
  switch (status) {
    case "pending":
      return { color: "#ed6c02" };
    case "progress":
      return { color: "#1976d2" };
    case "complete":
      return { color: "#2e7d32" };
    default:
      return { color: "black" };
  }
};

export const urlToFile = async (url, filename) => {
  const response = await fetch(url);
  const blob = await response.blob();

  const file = new File([blob], filename, { type: blob.type });
  return file;
};
