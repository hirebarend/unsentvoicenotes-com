import { useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import ListGroup from "react-bootstrap/ListGroup";
import {
  BsPlayCircleFill,
  BsRecordCircleFill,
  BsStopCircleFill,
} from "react-icons/bs";

async function getMediaRecorder(): Promise<MediaRecorder> {
  await navigator.mediaDevices.getUserMedia({
    audio: true,
    video: false,
  });

  const mediaDeviceInfos = await navigator.mediaDevices.enumerateDevices();

  const mediaStream = await navigator.mediaDevices.getUserMedia({
    audio: {
      deviceId: mediaDeviceInfos[0].deviceId,
    },
  });

  try {
    const mediaRecorder = new MediaRecorder(mediaStream, {
      mimeType: "video/webm",
    });

    return mediaRecorder;
  } catch {
    const mediaRecorder = new MediaRecorder(mediaStream, {
      mimeType: "video/mp4",
    });

    return mediaRecorder;
  }
}

function useVoiceNoteRecorder() {
  const [blob, setBlob] = useState(null as Blob | null);

  const [isRecording, setIsRecording] = useState(false);

  const [mediaRecorder, setMediaRecorder] = useState(
    null as MediaRecorder | null
  );

  return {
    blob,
    isRecording,
    start: () => {
      if (!mediaRecorder) {
        getMediaRecorder().then((mediaRecorder) => {
          const blobs: Array<Blob> = [];

          mediaRecorder.addEventListener(
            "dataavailable",
            (blobEvent: BlobEvent) => {
              if (blobEvent.data.size > 0) {
                blobs.push(blobEvent.data);
              }
            }
          );

          mediaRecorder.addEventListener("start", () => {
            setBlob(null);
            setIsRecording(true);
          });

          mediaRecorder.addEventListener("stop", () => {
            setBlob(new Blob(blobs));
            setIsRecording(false);
          });

          setMediaRecorder(mediaRecorder);

          mediaRecorder.start();
        });

        return;
      }

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
              {voiceNoteRecorder.isRecording ? (
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
          <ListGroup as="ol">
            {[0, 1, 2].map((x) => (
              <ListGroup.Item
                as="li"
                // className="align-items-start d-flex justify-content-between"
                key={x}
              >
                <div className="align-items-center d-flex justify-content-between">
                  <div>
                    <div className="fw-bold">Today at 09:26</div>
                    <div>46 seconds</div>
                  </div>
                  <div>
                    <BsPlayCircleFill className="text-secondary" size={24} />
                  </div>
                </div>
              </ListGroup.Item>
            ))}
          </ListGroup>
        </Card.Body>
      </Card>
    </>
  );
}
