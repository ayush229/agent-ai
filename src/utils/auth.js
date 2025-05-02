export const isAuthenticated = () => {
  const auth = localStorage.getItem("token"); // <-- Changed to "token"
  return !!auth;
};

export const getAuthHeader = () => {
  const auth = localStorage.getItem("token"); // <-- Changed to "token"
  return auth ? `Basic ${auth}` : null;
};

export const logout = () => {
  localStorage.removeItem("token"); // <-- Changed to "token"
};
