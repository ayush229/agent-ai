export const setAuth = (username, password) => {
  const encoded = btoa(`${username}:${password}`);
  localStorage.setItem("auth", encoded);
};

export const getAuthHeader = () => {
  const auth = localStorage.getItem("auth");
  if (!auth) return {};
  return {
    Authorization: `Basic ${auth}`,
  };
};

export const clearAuth = () => {
  localStorage.removeItem("auth");
};

export const isAuthenticated = () => {
  return !!localStorage.getItem("auth");
};
