import { useCallback } from "react";
import { Button, Container } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { REGISTER_MUTATION } from "../gql/RegisterQueries";
import { useMutation } from "@apollo/client";

interface RegisterFormData {
  username: string;
  password: string;
}

interface RegisterUserResult {
  register: {
    username: string;
    token: string;
  };
}

interface RegisterUserVariables {
  dto: {
    userName: string;
    password: string;
  };
}

export default function RegisterForm() {
  const navigation = useNavigate();
  const { register, handleSubmit } = useForm<RegisterFormData>();

  const [registerUser, { loading, error }] = useMutation<
    RegisterUserResult,
    RegisterUserVariables
  >(REGISTER_MUTATION);

  const cancel = useCallback(() => navigation("/"), [navigation]);

  const onSubmit = useCallback(
    async (formData: RegisterFormData) => {
      const { username, password } = formData;

      try {
        const { data } = await registerUser({
          variables: {
            dto: {
              userName: username,
              password,
            },
          },
        });

        const token = data?.register.token;
        if (token) {
          localStorage.setItem("AUTH_TOKEN", JSON.stringify(data?.register));
        }

        console.log("User registered successfully: ", data);
      } catch (e) {
        console.log("Error authenticating user: ", e);
      }
    },
    [registerUser]
  );

  return (
    <Container className="mt-4 col-4">
      {error ? <p>Error {error.message}</p> : null}
      <form autoComplete="off" onSubmit={handleSubmit(onSubmit)}>
        <h2 className="text-center text-primary">Sign up</h2>
        <hr />
        <div className="mb-3">
          <input
            type="text"
            className="form-control"
            placeholder="Username"
            {...register("username", {})}
          />
          <input
            type="password"
            className="form-control"
            placeholder="Password"
            {...register("password", {})}
          />
        </div>
        <div className="text-center">
          <Button
            type="submit"
            disabled={false}
            variant="success"
            className="me-2"
          >
            {loading ? "Loading..." : "Register"}
          </Button>
          <Button disabled={false} variant="default" onClick={cancel}>
            {loading ? "Wait..." : "Cancel"}
          </Button>
        </div>
      </form>
    </Container>
  );
}
