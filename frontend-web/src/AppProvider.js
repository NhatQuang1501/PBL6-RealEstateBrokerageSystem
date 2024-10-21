import PropTypes from "prop-types";
import { createContext, useContext, useEffect, useState } from "react";

const AppContext = createContext();

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppContext must be used within an AppProvider");
  }
  return context;
};

export default function AppProvider({
  children,
  initialSessionToken,
  initialRole,
  initialId,
}) {
  const [id, setId] = useState(() => {
    return initialId || localStorage.getItem("id");
  });
  const [role, setRole] = useState(() => {
    return initialRole || localStorage.getItem("role");
  });

  const [sessionToken, setSessionToken] = useState(() => {
    return initialSessionToken || localStorage.getItem("accessToken") || "";
  });

  useEffect(() => {
    if (sessionToken && role) {
      localStorage.setItem("role", role);
      localStorage.setItem("accessToken", sessionToken);
      localStorage.setItem("id", id);
    } else {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("role");
      localStorage.removeItem("id");
    }
  }, [sessionToken, role, id]);

  return (
    <AppContext.Provider
      value={{
        sessionToken,
        setSessionToken,
        role,
        setRole,
        id,
        setId,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

AppProvider.propTypes = {
  children: PropTypes.node,
  initialSessionToken: PropTypes.string,
  initialRole: PropTypes.string,
  initialId: PropTypes.string,
};
