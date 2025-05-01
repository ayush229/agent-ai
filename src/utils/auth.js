export const isAuthenticated = () => {
  const auth = localStorage.getItem("auth");
  return !!auth;
};

export const getAuthHeader = () => {
  const auth = localStorage.getItem("auth");
  return auth ? `Basic ${auth}` : null;
};

export const logout = () => {
  localStorage.removeItem("auth");
};
