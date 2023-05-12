import { useCallback } from "react";
import { Container } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

export default function NotFound() {
  const navigation = useNavigate();

  const onClick = useCallback(() => navigation("/"), [navigation]);

  return (
    <Container>
      <h1>Not found</h1>
      <button className="btn btn-info btn-lg" onClick={onClick}>
        Return to home page
      </button>
    </Container>
  );
}
