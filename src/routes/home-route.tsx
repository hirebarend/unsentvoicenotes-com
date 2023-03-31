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
  findAllVoiceNotes,
  findFile,
} from "../core";
import { useAuthentication } from "../custom-hooks";

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
      .then(() => result.refetch());
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
          {result.data && result.data.length ? (
            <ListGroup as="ol">
              {result.data.map((x) => (
                <ListGroup.Item as="li" key={x.timestamp}>
                  <div className="align-items-center d-flex justify-content-between">
                    <div>
                      <div className="fw-bold">
                        {moment(x.timestamp).format("dddd")} at{" "}
                        {moment(x.timestamp).format("HH:mm")}
                      </div>
                      <div>{Math.round(x.duration)} seconds</div>
                    </div>
                    <div>
                      <BsPlayCircleFill
                        className="text-secondary"
                        onClick={() => {
                          findFile(x.fileId).then(async (file) => {
                            const audioContext = new AudioContext();

                            const gainNode = audioContext.createGain();
                            gainNode.gain.value = 1;

                            const audioBuffer =
                              await audioContext.decodeAudioData(
                                cloneArrayBuffer(file.arrayBuffer)
                              );

                            var source = audioContext.createBufferSource();
                            source.buffer = audioBuffer;
                            source.connect(audioContext.destination);
                            source.start();
                          });
                        }}
                        size={24}
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
