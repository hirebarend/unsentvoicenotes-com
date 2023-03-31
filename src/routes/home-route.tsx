import { useEffect, useState } from "react";
import mixpanel from "mixpanel-browser";
import moment from "moment";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import ListGroup from "react-bootstrap/ListGroup";
import {
  BsPlayCircleFill,
  BsRecordCircleFill,
  BsStopCircleFill,
} from "react-icons/bs";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import {
  VoiceNoteRecorder,
  cloneArrayBuffer,
  convertArrayBufferToBase64,
  convertBlobToArrayBuffer,
  createVoiceNote,
  findAllFiles,
  findAllVoiceNotes,
} from "../core";
import { useAuthentication } from "../custom-hooks";

export function HomeRoute() {
  const authentication = useAuthentication();

  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState({} as { [key: string]: boolean });

  const resultVoiceNotes = useQuery({
    queryKey: ["voice-notes"],
    queryFn: async () => {
      return await findAllVoiceNotes();
    },
  });

  const resultFiles = useQuery({
    queryKey: ["files"],
    queryFn: async () => {
      return await findAllFiles();
    },
  });

  const [blob, setBlob] = useState(null as Blob | null);

  const [isRecording, setIsRecording] = useState(false);

  const [voiceNoteRecorder, setVoiceNoteRecorder] = useState(
    new VoiceNoteRecorder((blob) => setBlob(blob))
  );

  useEffect(() => {
    if (!blob) {
      return;
    }

    convertBlobToArrayBuffer(blob)
      .then((arrayBuffer: ArrayBuffer) => createVoiceNote(arrayBuffer))
      .then(() => {
        resultVoiceNotes.refetch();

        resultFiles.refetch();
      });
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
          {/* <Card.Text className="text-center">
            Begin your writing journey and capture your thoughts and experiences
            with our blank canvas waiting for your words.
          </Card.Text> */}
          <Card.Text className="text-center">
            Your voice notes are securely stored on your device and will never
            be uploaded or shared with anyone.
          </Card.Text>
          <div className="py-3">
            <Button
              className="fw-semibold w-100"
              onClick={() => {
                if (isRecording) {
                  voiceNoteRecorder.stop();

                  setIsRecording(false);

                  mixpanel.track("voicenoterecorder.stopped");
                } else {
                  voiceNoteRecorder.start();

                  setIsRecording(true);

                  mixpanel.track("voicenoterecorder.started");
                }
              }}
              variant={isRecording ? "secondary" : "primary"}
            >
              {isRecording ? (
                <>
                  <BsStopCircleFill style={{ marginBottom: "3px" }} />
                  &nbsp; Stop Recording
                </>
              ) : (
                <>
                  <BsRecordCircleFill style={{ marginBottom: "3px" }} />
                  &nbsp; Start Recording
                </>
              )}
            </Button>
          </div>
          {resultVoiceNotes.data && resultVoiceNotes.data.length ? (
            <ListGroup as="ol">
              {resultVoiceNotes.data.map((x) => (
                <ListGroup.Item as="li" key={x.timestamp}>
                  <div>
                    <div>
                      {moment(x.timestamp).format("dddd")} at{" "}
                      {moment(x.timestamp).format("HH:mm")}
                    </div>
                    <div className="py-2">
                      <audio
                        controls
                        src={`data:video/mp4;base64,${convertArrayBufferToBase64(
                          resultFiles.data?.find((y) => y.id === x.fileId)
                            ?.arrayBuffer || new ArrayBuffer(0)
                        )}`}
                      />
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
