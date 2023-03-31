import { useEffect, useState } from "react";

export function useAuthentication() {
  const [isAuthenticated, setIsAuthenticated] = useState(
    localStorage.getItem("isAuthenticated")
      ? localStorage.getItem("isAuthenticated") === "true"
      : false
  );

  return {
    isAuthenticated,
    signIn: () => {
      localStorage.setItem("isAuthenticated", "true");

      setIsAuthenticated(
        localStorage.getItem("isAuthenticated")
          ? localStorage.getItem("isAuthenticated") === "true"
          : false
      );
    },
  };
}
