import { useCallback } from "react";
import { Button, Container } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();

  const goToForm = useCallback(() => navigate("/register"), [navigate]);

  return (
    <Container className="mt-5" style={{ marginTop: 100, width: "50%" }}>
      <div style={{ textAlign: "center" }}>
        <h1>Find your match</h1>
        <p className="lead">
          Come on in to view your matches... all you need to do is sign up!
        </p>
        <div className="text-center">
          <Button variant="primary" onClick={goToForm}>
            Register
          </Button>
          <Button variant="info">Learn more</Button>
        </div>
      </div>
    </Container>
  );
}
