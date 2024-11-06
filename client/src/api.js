import { getToken } from "./auth";
import { urlToFile } from "./common";

const { REACT_APP_API_URL, REACT_APP_IMAGE_URL } = process.env;
export const apiUrl = REACT_APP_API_URL;
export const imageUrl = REACT_APP_IMAGE_URL;
export const login = async (user, error, setError) => {
  const requestOptions = {
    method: "POST",
    body: JSON.stringify({
      email: user.email,
      password: user.password,
    }),
    headers: {
      "Content-Type": "application/json",
    },
  };
  try {
    if (user.email !== "" && user.password !== "") {
      const response = await fetch(`${apiUrl}/auth/login`, requestOptions);
      const result = await response.json();
      if (result.isValid) {
        localStorage.setItem("employeeId", result.employeeDetails.userId);
        localStorage.setItem("email", result.employeeDetails.email);
        localStorage.setItem("role", result.employeeDetails.role);
        localStorage.setItem("token", result.token);
        return result.employeeDetails;
      } else if (result.isPasswordInvalid) {
        setError({
          ...error,
          password: true,
        });
      } else if (result.isEmailInvalid) {
        setError({
          ...error,
          email: true,
        });
      } else {
        console.log("Something went Wrong");
      }
    } else {
      setError({
        ...error,
        email: true,
        password: true,
        errorMsg: { password: "Please enter correct password" },
      });
    }
  } catch (err) {
    console.log(err);
  }
};

export const getAllTodos = async ({ setTodos, employeeId }) => {
  const authToken = getToken();
  const requestOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + authToken,
    },
    body: JSON.stringify({
      employeeId: employeeId,
    }),
  };
  return fetch(`${apiUrl}/todos`, requestOptions)
    .then(async function (response) {
      if (response.ok) {
        return await response.json();
      } else {
        if (response.status === 401) {
          console.log("error");
        }
      }
    })
    .then((data) => {
      setTodos(data);
    })
    .catch((err) => {
      console.log(err);
    });
};

export const getAllEmployees = async ({ setEmployees }) => {
  const authToken = getToken();
  const requestOptions = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + authToken,
    },
  };
  return fetch(`${apiUrl}/employees`, requestOptions)
    .then(async function (response) {
      if (response.ok) {
        return await response.json();
      } else {
        if (response.status === 401) {
          console.log("error");
        }
      }
    })
    .then((data) => {
      setEmployees(data);
    })
    .catch((err) => {
      console.log(err);
    });
};

export const createUser = async (userDetails, navigate) => {
  const authToken = getToken();
  const requestOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + authToken,
    },
    body: JSON.stringify(userDetails),
  };
  fetch(`${apiUrl}/auth/createUser`, requestOptions)
    .then(async (res) => {
      if (res.ok) {
        navigate("/login");
      }
    })
    .catch((e) => {
      console.log(e);
    });
};

export const createTodo = async ({ todo, setLoading, setAllTodo }) => {
  const authToken = getToken();

  setLoading(true);
  const formData = new FormData();

  formData.append("todo", JSON.stringify(todo));
  if (todo.file && todo.file instanceof File) {
    formData.append("file", todo.file);
  }
  const requestOptions = {
    method: "POST",
    headers: {
      Authorization: "Bearer " + authToken,
    },
    body: formData,
  };

  try {
    const response = await fetch(`${apiUrl}/createTodo`, requestOptions);

    if (response.ok) {
      const data = await response.json();
      return data;
    } else {
      const errorData = await response.json();
      console.error("Error creating TODO:", errorData);
    }
  } catch (e) {
    console.error("Fetch error:", e);
  } finally {
    setLoading(false);
  }
};

export const editTodo = async ({ todo, setTodo, setLoading }) => {
  const authToken = getToken();

  setLoading(true);

  const formData = new FormData();

  formData.append("todo", JSON.stringify(todo));
  if (todo.file) {
    if (todo.file instanceof File) {
      formData.append("file", todo.file);
    } else if (typeof todo.file === "string") {
      try {
        const file = await urlToFile(todo.file, todo.file.split("/").pop());
        formData.append("file", file);
      } catch (error) {
        console.error("Error converting URL to File:", error);
      }
    }
  } else {
    formData.append("file", "");
  }

  const requestOptions = {
    method: "PUT",
    body: formData,
    headers: {
      Authorization: "Bearer " + authToken,
    },
  };

  try {
    const response = await fetch(`${apiUrl}/editTodo`, requestOptions);
    if (response.ok) {
      const data = await response.json();
      setTodo(data);
    } else {
      const errorData = await response.json();
      throw new Error(errorData.message || "Network response was not ok.");
    }
  } catch (error) {
    console.log(error);
    throw error;
  } finally {
    setLoading(false);
  }
};

export const deleteTodo = async ({ todo, setLoading, setTodo }) => {
  const authToken = getToken();
  const requestOptions = {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + authToken,
    },
    body: JSON.stringify({
      todo: todo,
    }),
  };
  try {
    const response = await fetch(`${apiUrl}/deleteTodo`, requestOptions);

    if (response.ok) {
      const data = await response.json();
      setTodo(data);
      setLoading(false);
    } else {
      const errorData = await response.json();
      console.error("Error:", errorData);
    }
  } catch (error) {
    console.error("Fetch error:", error);
  }
};
