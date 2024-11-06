/* eslint-disable react-hooks/exhaustive-deps */
import { Route, Routes } from "react-router-dom";
import "./App.css";
import "./css/styles.scss";
import Login from "./pages/login/login";
import Signup from "./pages/signup/signup";
import Dashboard from "./pages/dashboard/dashboard";
import io from "socket.io-client";
import { useEffect } from "react";

const App = () => {
  const socket = io("http://localhost:5000", {
    transports: ["websocket"],
  });
  useEffect(() => {
    socket.on("connect", () => {
      console.log("Connected to Socket.io server with ID:", socket.id);
    });

    socket.on("disconnect", () => {
      console.log("Socket disconnected");
    });

    socket.on("connect_error", (err) => {
      console.error("Socket connection error:", err);
    });

    return () => {
      socket.off("connect");
      socket.off("disconnect");
      socket.off("connect_error");
    };
  }, []);

  return (
    <Routes>
      <Route exact path="/login" element={<Login />} />
      <Route exact path="/signup" element={<Signup />} />
      <Route exact path="/" element={<Dashboard socket={socket} />} />
    </Routes>
  );
};

export default App;
