import React, { useEffect, useState } from "react";
import { LOGIN, ME } from "../queries";
import { useMutation, useLazyQuery } from "@apollo/client";
import { useNavigate } from "react-router-dom";
import { useApolloClient } from "@apollo/client";

/**
 * @typedef {Object} AuthContextProps
 * @property {React.ReactNode} children
 * @property {string | null} user
 * @property {boolean} hasToken
 * @property {(username: string, password: string) => void} signin
 * @property {() => void} signout
 */

/**
 * @type {React.Context<AuthContextProps>}
 */

export const AuthContext = React.createContext({
  children: null,
  user: null,
  hasToken: false,
  signin: (username, password) => {},
  signout: () => {},
});

/**
 * AuthContext Provider Component
 * @param {AuthContextProps} props
 */

export const AuthProvider = (props) => {
  const [hasToken, setHasToken] = useState(false);
  const client = useApolloClient();
  const navigate = useNavigate();
  const [user, setUser] = useState({ username: "", favoriteGenre: "" });
  const [loading, setLoading] = useState(true);
  const [meLoading, setMeLoading] = useState(true);

  const [getMe] = useLazyQuery(ME, {
    fetchPolicy: "network-only",
    onCompleted: (data) => {
      if (data.me) {
        setUser({
          username: data.me.username,
          favoriteGenre: data.me.favoriteGenre,
        });
      }
      setMeLoading(false);
    },
    onError: (error) => {
      console.log("User query error: ", error);
      const messages = error.graphQLErrors.map((err) => err.message);
      props.setErrorMessages(messages);
    },
  });

  useEffect(() => {
    localStorage.getItem("library-user-token");
    if (localStorage.getItem("library-user-token")) {
      setHasToken(true);
      getMe();
    } else {
      setMeLoading(false);
    }

    setLoading(false);
  }, []);

  const [login] = useMutation(LOGIN, {
    onError: (error) => {
      console.log("error", error);
    },
    onCompleted: () => {
      navigate("/");
    },
  });

  const signin = async (username, password) => {
    try {
      const result = await login({ variables: { username, password } });
      const token = result.data.login.value;
      localStorage.setItem("library-user-token", token);
      setHasToken(true);
      getMe();
    } catch (error) {
      console.log("error while signin", error);
    }
  };

  const signout = () => {
    setHasToken(false);
    setUser({ username: "", favoriteGenre: "" });
    localStorage.clear();
    client.resetStore();
    navigate("/login");
  };

  console.log({
    loading,
    meLoading,
    hasToken,
    user,
  });
  if (loading || meLoading) {
    return null;
  }

  return (
    <AuthContext.Provider
      value={{
        hasToken,
        user,
        signin,
        signout,
      }}
    >
      {props.children}
    </AuthContext.Provider>
  );
};

export default { AuthContext, AuthProvider };
