// import { useState } from "react";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Navbar from "react-bootstrap/Navbar";
import Row from "react-bootstrap/Row";

function App() {
  return (
    <>
      <Navbar bg="light" expand="lg">
        <Container>
          <Navbar.Brand className="fw-semibold" href="/">
            Unsent Voice Notes
          </Navbar.Brand>
        </Container>
      </Navbar>
      <Container>
        <Row>
          <Col sm={{ offset: 3, span: 6 }}>
            <Card className="my-4">
              <Card.Body>
                <Card.Title className="text-center">
                  Welcome to Unset Voice Notes
                </Card.Title>
                <Card.Text className="text-center">
                  Journaling app. From once-in-a-lifetime events to everyday
                  moments, our elegant interface makes journaling your life a
                  simple pleasure.
                </Card.Text>
                <img className="w-100" src="/undraw_recording_re_5xyq.svg" />
              </Card.Body>
            </Card>

            <Button className="fw-semibold w-100" variant="primary">
              Get Started
            </Button>
          </Col>
        </Row>
      </Container>
    </>
  );
}

export default App;
