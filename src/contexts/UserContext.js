import { createContext, useContext, useState, useCallback } from "react";
import axios from "../http";

// Create the context
const UserContext = createContext();

// Custom hook to use the UserContext
export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};

// UserProvider component
export const UserProvider = ({ children }) => {
  const [user, setUser] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  // Function to fetch user data
  const fetchUser = useCallback(async (id) => {
    setIsLoading(true);
    try {
      const result = await axios.get(`/users/user/${id}`);
      setUser(result.data);
    } catch (error) {
      console.error("Error fetching user:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Function to update user data locally
  const updateUser = useCallback((updatedData) => {
    setUser((prevUser) => ({ ...prevUser, ...updatedData }));
  }, []);

  // Function to clear user data
  const clearUser = useCallback(() => {
    setUser({});
  }, []);

  const value = {
    user,
    setUser,
    isLoading,
    setIsLoading,
    fetchUser,
    updateUser,
    clearUser,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};
