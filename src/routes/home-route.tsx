import { useEffect, useState } from "react";
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
import { useAuthentication } from "../custom-hooks";
import { VoiceNoteRecorderButton } from "../components";

export function HomeRoute() {
  const authentication = useAuthentication();

  const navigate = useNavigate();

  const result = useQuery({
    queryKey: ["voice-notes"],
    queryFn: async () => {
      return await findAllVoiceNotes();
    },
  });

  const [blob, setBlob] = useState(null as Blob | null);

  useEffect(() => {
    if (!blob) {
      return;
    }

    convertBlobToArrayBuffer(blob)
      .then((arrayBuffer: ArrayBuffer) => createVoiceNote(arrayBuffer))
      .then(() => result.refetch())
      .then(() => setBlob(null));
  }, [blob]);

  if (!authentication.isAuthenticated) {
    navigate("/get-started");

    return <></>;
  }

  return (
    <>
      <Card className="my-4">
        <Card.Body>
          <Card.Title className="text-center">
            Your Unsent Voice Notes
          </Card.Title>
          <Card.Text className="text-center">
            Your voice notes are securely stored on your device and will never
            be uploaded or shared with anyone.
          </Card.Text>
          <div className="py-3">
            <VoiceNoteRecorderButton fn={(blob: Blob) => setBlob(blob)} />
          </div>
          {result.data && result.data.length ? (
            <ListGroup as="ol" variant="flush">
              {result.data.map((x: any) => (
                <ListGroup.Item as="li" key={x.timestamp}>
                  <div>
                    <div className="fs-6 text-center">
                      <p className="fw-semibold">
                        {moment(x.timestamp).format("dddd")} at{" "}
                        {moment(x.timestamp).format("HH:mm")}
                      </p>
                      {x.text ? <p>{x.text}</p> : null}
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
