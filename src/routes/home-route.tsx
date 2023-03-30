import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";

import Badge from "react-bootstrap/Badge";
import ListGroup from "react-bootstrap/ListGroup";
import { useEffect, useState } from "react";

function useVoiceNoteRecorder() {
  const [blob, setBlob] = useState(null as Blob | null);

  const [isRecording, setIsRecording] = useState(false);

  const [mediaRecorder, setMediaRecorder] = useState(
    null as MediaRecorder | null
  );

  useEffect(() => {
    navigator.mediaDevices
      .enumerateDevices()
      .then((mediaDeviceInfos) => {
        const result = mediaDeviceInfos.filter((x) => x.kind === "audioinput");

        return navigator.mediaDevices.getUserMedia({
          audio: {
            deviceId: result[0].deviceId,
          },
        });
      })
      .then((stream) => {
        const mediaRecorder = new MediaRecorder(stream, {
          mimeType: "audio/mp3",
        });

        const blobs: Array<Blob> = [];

        mediaRecorder.addEventListener("dataavailable", (blobEvent) => {
          console.log(blobEvent.data);

          if (blobEvent.data.size > 0) {
            blobs.push(blobEvent.data);
          }
        });

        mediaRecorder.addEventListener("start", () => {
          setBlob(null);
          setIsRecording(true);
        });

        mediaRecorder.addEventListener("stop", () => {
          setBlob(new Blob(blobs));
          setIsRecording(false);
        });

        setMediaRecorder(mediaRecorder);
      })
      .catch((error) => alert(error.message));
  }, []);

  return {
    blob,
    isRecording,
    start: () => {
      mediaRecorder?.start();
    },
    stop: () => {
      mediaRecorder?.stop();
    },
  };
}

export function HomeRoute() {
  const voiceNoteRecorder = useVoiceNoteRecorder();

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
          <div className="py-3">
            <Button
              className="fw-semibold w-100"
              onClick={() => {
                if (voiceNoteRecorder.isRecording) {
                  voiceNoteRecorder.stop();
                } else {
                  voiceNoteRecorder.start();
                }
              }}
              variant={voiceNoteRecorder.isRecording ? "secondary" : "primary"}
            >
              {voiceNoteRecorder.isRecording
                ? "Stop Recording"
                : "Start Recording"}
            </Button>
          </div>
          <ListGroup as="ol">
            {[0, 1, 2].map((x) => (
              <ListGroup.Item
                as="li"
                className="align-items-start d-flex justify-content-between"
                key={x}
              >
                <div className="ms-2 me-auto">
                  <div className="fw-bold">Today at 09:26</div>
                  46 seconds
                </div>
              </ListGroup.Item>
            ))}
          </ListGroup>
        </Card.Body>
      </Card>
    </>
  );
}
