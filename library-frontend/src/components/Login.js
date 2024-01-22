import React, { useState, useContext } from "react";
import { Form, Button } from "react-bootstrap";
import { AuthContext } from "../context/auth";

const Login = (props) => {
  const { signin } = useContext(AuthContext);
  //   const [login, result] = useMutation(LOGIN, {
  //     onError: (error) => {
  //       console.log("error", error);
  //       const messages = error.graphQLErrors.map((e) => e.message).join("\n");
  //       props.setErrorMessage(messages);
  //     },
  //     onCompleted: () => {
  //       console.log("completed...");
  //       navigate("/");
  //     },
  //   });
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
    signin(username, password);
    // login({ variables: { username, password } });

    setUsername("");
    setPassword("");

  };

  //   useEffect(() => {
  //     if (result.data) {
  //       const token = result.data.login.value;
  //       props.setToken(token);
  //       localStorage.setItem("library-user-token", token);
  //     }
  //   }, [result.data, props]);

  return (
    <Form style={{ marginTop: 40 }} onSubmit={handleSubmit}>
      <Form.Group className="mb-3">
        <Form.Label>Username:</Form.Label>
        <Form.Control
          type="text"
          onChange={(e) => setUsername(e.target.value)}
        />
      </Form.Group>
      <Form.Group className="mb-3">
        <Form.Label>Password:</Form.Label>
        <Form.Control
          type="password"
          onChange={(e) => setPassword(e.target.value)}
        />
      </Form.Group>
      <Button style={{ marginTop: 10 }} type="submit">
        Login
      </Button>
    </Form>
  );
};

export default Login;
