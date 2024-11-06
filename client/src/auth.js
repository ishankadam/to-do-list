const getToken = () => {
  const token = localStorage.getItem("token");
  return token;
};

const tokenLoader = () => {
  const token = getToken();

  if (!token) {
    window.location.href = "/";
  }
  return token;
};

export { getToken, tokenLoader };
