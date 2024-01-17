import React from "react";
import { useState } from "react";
import { useMutation } from "@apollo/client";
import { Form, Button } from "react-bootstrap";
import { EDIT_AUTHOR } from "../queries";

const EditAuthor = (props) => {
  const setErrorMessage = props.setErrorMessage;
  const [editAuthor] = useMutation(EDIT_AUTHOR, {
    onError: (error) => {
      const messages = error.graphQLErrors.map((e) => e.message).join("\n");
      setErrorMessage(messages);
    },
  });

  const [name, setName] = useState("");
  const [born, setBorn] = useState("");

  const submit = (event) => {
    event.preventDefault();

    editAuthor({ variables: { name, setBornTo: Number(born) } });

    setName("");
    setBorn("");
  };

  return (
    <Form onSubmit={submit} style={{ marginTop: 20 }}>
      <Form.Group className="mb-3">
        <Form.Label>Name:</Form.Label>
        <Form.Select value={name} onChange={({ target }) => setName(target.value)}>
          {props.authors.map((a) => (
            <option key={a.name} value={a.name}>
              {a.name}
            </option>
          ))}
        </Form.Select>
        {/* <Form.Control value={name} onChange={({ target }) => setName(target.value)} /> */}
      </Form.Group>
      <Form.Group className="mb-3">
        <Form.Label>Born:</Form.Label>
        <Form.Control value={born} onChange={({ target }) => setBorn(target.value)} />
      </Form.Group>
      <Button type="submit">Update Author</Button>
    </Form>
  );
};

export default EditAuthor;
