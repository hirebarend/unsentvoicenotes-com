import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";

export function UnauthenticatedRoute() {
  return (
    <>
      <Card className="my-4">
        <Card.Body>
          <Card.Title className="text-center">
            Welcome to Unsent Voice Notes
          </Card.Title>
          <Card.Text className="text-center">
            Journaling app. From once-in-a-lifetime events to everyday moments,
            our elegant interface makes journaling your life a simple pleasure.
          </Card.Text>
          <img className="w-100" src="/undraw_recording_re_5xyq.svg" />
        </Card.Body>
      </Card>

      <Button className="fw-semibold w-100" variant="primary">
        Get Started
      </Button>
    </>
  );
}
