import { useMutation } from "@apollo/client";
import { useCallback, useEffect, useState } from "react";
import { Container, Nav, NavDropdown, Navbar } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { LOGIN } from "../gql/RegisterQueries";
import { NavLink } from "react-router-dom";

interface AuthenticateFormData {
  username: string;
  password: string;
}

interface AuthenticateUserResult {
  login: {
    username: string;
    token: string;
  };
}

interface AuthenticateUserVariables {
  loginDto: {
    username: string;
    password: string;
  };
}

export function NavBar() {
  const { register, handleSubmit } = useForm<AuthenticateFormData>();

  const [loggedIn, setLoggedIn] = useState(false);
  const [username, setUsername] = useState("");

  useEffect(() => {
    const auth = localStorage.getItem("AUTH_TOKEN");
    if (auth) {
      setLoggedIn(true);
      const userObj = JSON.parse(auth);
      const capitalizedName =
        userObj.username.charAt(0).toUpperCase() + userObj.username.slice(1);
      setUsername(capitalizedName);
    }
  }, []);

  const [authenticate, { loading }] = useMutation<
    AuthenticateUserResult,
    AuthenticateUserVariables
  >(LOGIN);

  const onSubmit = async (formData: AuthenticateFormData) => {
    try {
      const { data } = await authenticate({
        variables: {
          loginDto: {
            username: formData.username,
            password: formData.password,
          },
        },
      });

      const token = data?.login.token;
      if (token) {
        localStorage.setItem("AUTH_TOKEN", JSON.stringify(data?.login));
        const capitalizedName =
          data?.login.username.charAt(0).toUpperCase() +
          data?.login.username.slice(1);
        setUsername(capitalizedName);
        setLoggedIn(true);
      }

      console.log("User authenticated successfully: ", data);
    } catch (error) {
      console.log("Error authenticating user: ", error);
    }
  };

  const logout = useCallback(() => {
    localStorage.removeItem("AUTH_TOKEN");
    setUsername("");
  }, []);

  return (
    <Navbar variant="dark" bg="primary" expand="md">
      <Container>
        <Navbar.Brand href="/">Dating App</Navbar.Brand>
        {loggedIn ? (
          <>
            <Nav
              className="me-auto my-2 my-lg-0"
              style={{ maxHeight: "100px" }}
            >
              <NavLink
                to={"/members"}
                className={({ isActive }) =>
                  isActive ? "nav-link active" : "nav-link"
                }
              >
                Matches
              </NavLink>
              <NavLink
                to="/lists"
                className={({ isActive }) =>
                  isActive ? "nav-link active" : "nav-link"
                }
              >
                Lists
              </NavLink>
              <NavLink
                to="/messages"
                className={({ isActive }) =>
                  isActive ? "nav-link active" : "nav-link"
                }
              >
                Messages
              </NavLink>
            </Nav>
            <Navbar.Collapse
              style={{
                display: "flex",
                flexWrap: "inherit",
                alignItems: "flex-end",
                justifyContent: "flex-end",
              }}
            >
              <Nav>
                <NavDropdown
                  id="nav-dropdown-dark-example"
                  title={`Welcome ${username}`}
                >
                  <NavDropdown.Item href="/">Edit profile</NavDropdown.Item>
                  <NavDropdown.Item onClick={logout} href="/">
                    Logout
                  </NavDropdown.Item>
                </NavDropdown>
              </Nav>
            </Navbar.Collapse>
          </>
        ) : (
          <form
            autoComplete="off"
            className="d-flex"
            onSubmit={handleSubmit(onSubmit)}
          >
            <input
              className="form-control me-2"
              type="text"
              placeholder="Username"
              {...register("username", {})}
            />
            <input
              className="form-control me-2"
              type="password"
              placeholder="Password"
              {...register("password", {})}
            />
            <button
              className="btn btn-success"
              disabled={loading}
              type="submit"
            >
              {loading ? "Loading..." : "Login"}
            </button>
          </form>
        )}
      </Container>
    </Navbar>
  );
}
