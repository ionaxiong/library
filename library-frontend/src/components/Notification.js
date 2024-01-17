import React from "react";
import { Alert } from "react-bootstrap";

const Notification = (props) => {
  const messages = props.errorMessage;

  React.useEffect(() => {
    if (messages) {
      setTimeout(() => {
        props.setErrorMessage(null);
      }, 10000);
    }
  }, [messages]);

  console.log("messages", messages);

  if (!messages) {
    return null;
  }

  return <Alert variant="danger">{messages}</Alert>;
};

export default Notification;
