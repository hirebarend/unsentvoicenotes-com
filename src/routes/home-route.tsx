import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";

import Badge from "react-bootstrap/Badge";
import ListGroup from "react-bootstrap/ListGroup";

export function HomeRoute() {
  return (
    <>
      <Card className="my-4">
        <Card.Body>
          <Card.Title className="text-center">
            Your Unsent Voice Notes
          </Card.Title>
          <Card.Text className="text-center">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus eu
            elit ut lectus sollicitudin molestie a ut nisl.
          </Card.Text>
          <ListGroup as="ol">
            <ListGroup.Item
              as="li"
              className="align-items-start d-flex justify-content-between"
            >
              <div className="ms-2 me-auto">
                <div className="fw-bold">30th March 2023 09:26</div>
                Cras justo odio
              </div>
              <Badge bg="primary" pill>
                14
              </Badge>
            </ListGroup.Item>
            <ListGroup.Item
              as="li"
              className="d-flex justify-content-between align-items-start"
            >
              <div className="ms-2 me-auto">
                <div className="fw-bold">Subheading</div>
                Cras justo odio
              </div>
              <Badge bg="primary" pill>
                14
              </Badge>
            </ListGroup.Item>
            <ListGroup.Item
              as="li"
              className="d-flex justify-content-between align-items-start"
            >
              <div className="ms-2 me-auto">
                <div className="fw-bold">Subheading</div>
                Cras justo odio
              </div>
              <Badge bg="primary" pill>
                14
              </Badge>
            </ListGroup.Item>
          </ListGroup>
        </Card.Body>
      </Card>

      <Button className="fw-semibold w-100" variant="primary">
        Get Started
      </Button>
    </>
  );
}
