// import { useState } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Navbar from "react-bootstrap/Navbar";
import Row from "react-bootstrap/Row";
import { UnauthenticatedRoute } from "./routes";
import { HomeRoute } from "./routes/home-route";

const router = createBrowserRouter([
  {
    path: "/",
    element: <HomeRoute />,
  },
  {
    path: "/get-started",
    element: <UnauthenticatedRoute />,
  },
]);

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
            <RouterProvider router={router} />
          </Col>
        </Row>
      </Container>
    </>
  );
}

export default App;
