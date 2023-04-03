import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import { useNavigate } from "react-router-dom";
import { useAuthentication } from "../custom-hooks";

export function UnauthenticatedRoute() {
  const authentication = useAuthentication();

  const navigate = useNavigate();

  return (
    <>
      <Card className="my-4">
        <Card.Body>
          <Card.Text className="text-center">
            Start your journey of self-reflection and personal growth with our
            intuitive and easy-to-use journaling app.
          </Card.Text>
          <div className="p-5">
            <img className="w-100" src="/undraw_recording_re_5xyq.svg" />
          </div>
        </Card.Body>
      </Card>

      <Button
        className="fw-semibold text-white w-100"
        onClick={() => {
          authentication.signIn();

          navigate("/");
        }}
        variant="primary"
      >
        Get Started
      </Button>
    </>
  );
}
