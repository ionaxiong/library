import React, { useContext } from "react";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import { Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/auth";

const NavBar = (props) => {
  const { signout } = useContext(AuthContext);

  const username = props.username;

  const handleLogout = () => {
    signout();
  };

  return (
    <Navbar expand="lg" className="bg-body-tertiary">
      <Container>
        <Navbar.Brand>Library</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav
            className="me-auto"
            style={{
              alignContent: "center",
              textAlign: "center",
              alignItems: "center",
            }}
          >
            <Link style={{ textDecoration: "none", marginRight: 10 }} to="/">
              Authors
            </Link>
            <Link style={{ textDecoration: "none", marginRight: 10 }} to="/books">
              Books
            </Link>
            <Link style={{ textDecoration: "none", marginRight: 10 }} to="/add_book">
              Add Book
            </Link>
            <Link style={{ textDecoration: "none", marginRight: 10 }} to="/recommend">
              Recommend
            </Link>
            {username ? (
              <div>
                <em style={{ marginLeft: 10 }}>{username} logged in</em>
                <Button
                  style={{ textDecoration: "none", marginLeft: 10 }}
                  type="submit"
                  onClick={handleLogout}
                >
                  Logout
                </Button>
              </div>
            ) : (
              <Link tyle={{ textDecoration: "none" }} to="/login">
                Login
              </Link>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavBar;
