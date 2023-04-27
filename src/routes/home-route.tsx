import { useEffect, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import moment from "moment";
import Card from "react-bootstrap/Card";
import ListGroup from "react-bootstrap/ListGroup";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import {
  convertBlobToArrayBuffer,
  createVoiceNote,
  findAllVoiceNotes,
} from "../core";
import { VoiceNoteRecorderButton } from "../components";

export function HomeRoute() {
  const { isAuthenticated, isLoading, user } = useAuth0();

  const navigate = useNavigate();

  const result = useQuery({
    enabled: isAuthenticated && user ? true : false,
    queryKey: ["voice-notes"],
    queryFn: async () => {
      return await findAllVoiceNotes(user?.sub || "");
    },
  });

  const [blob, setBlob] = useState(null as Blob | null);

  useEffect(() => {
    if (!blob) {
      return;
    }

    convertBlobToArrayBuffer(blob)
      .then((arrayBuffer: ArrayBuffer) =>
        createVoiceNote(user?.sub || "", arrayBuffer)
      )
      .then(() => result.refetch())
      .then(() => setBlob(null));
  }, [blob]);

  if (isLoading) {
    return <></>;
  }

  if (!isAuthenticated) {
    navigate("/get-started");

    return <></>;
  }

  return (
    <>
      <Card className="my-4">
        <Card.Body>
          <Card.Title className="text-center">
            Archive of my Thoughts
          </Card.Title>
          <div className="py-3">
            <VoiceNoteRecorderButton fn={(blob: Blob) => setBlob(blob)} />
          </div>
          {result.data && result.data.length ? (
            <ListGroup as="ol" variant="flush">
              {result.data.map((x: any) => (
                <ListGroup.Item as="li" className="px-0" key={x.timestamp}>
                  <div>
                    <div className="fs-6">
                      <p
                        className="text-end text-muted"
                        style={{ fontSize: "0.875rem" }}
                      >
                        {moment(x.timestamp).format("DD MMMM yyyy, HH:mm")}
                      </p>
                      {["unprocessed", "processing"].includes(x.status) ? (
                        <p style={{ textAlign: "justify" }}>
                          We are processing your entry, please hold on a moment.
                          This may take a few seconds depending on the length of
                          your recording. Thank you for using our app to capture
                          your thoughts!
                        </p>
                      ) : null}
                      {["processed", "optimized"].includes(x.status) &&
                      x.text ? (
                        <p style={{ textAlign: "justify" }}>{x.text}</p>
                      ) : null}
                    </div>
                  </div>
                </ListGroup.Item>
              ))}
            </ListGroup>
          ) : (
            <div className="p-5">
              <img className="w-100" src="/undraw_notes_re_pxhw.svg" />
            </div>
          )}
        </Card.Body>
      </Card>
    </>
  );
}
