import { useEffect, useState } from "react";
import moment from "moment";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import ListGroup from "react-bootstrap/ListGroup";
import {
  BsPlayCircleFill,
  BsRecordCircleFill,
  BsStopCircleFill,
} from "react-icons/bs";
import { useQuery } from "@tanstack/react-query";
import {
  convertArrayBufferToBase64,
  convertBlobToArrayBuffer,
  createVoiceNote,
  findAllVoiceNotes,
} from "../core";

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
  const result = useQuery({
    queryKey: ["voice-notes"],
    queryFn: async () => {
      console.log(await findAllVoiceNotes());

      return await findAllVoiceNotes();
    },
  });

  const voiceNoteRecorder = useVoiceNoteRecorder();

  useEffect(() => {
    if (!voiceNoteRecorder.blob) {
      return;
    }

    convertBlobToArrayBuffer(voiceNoteRecorder.blob)
      .then((arrayBuffer: ArrayBuffer) => createVoiceNote(arrayBuffer))
      .then(() => result.refetch());
  }, [voiceNoteRecorder.blob]);

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
          {result.data ? (
            <ListGroup as="ol">
              {result.data.map((x) => (
                <ListGroup.Item as="li" key={x.timestamp}>
                  <div className="align-items-center d-flex justify-content-between">
                    <div>
                      <div className="fw-bold">
                        {moment(x.timestamp).format("dddd")} at{" "}
                        {moment(x.timestamp).format("HH:mm")}
                      </div>
                      <div>46 seconds</div>
                    </div>
                    <div>
                      <BsPlayCircleFill
                        className="text-secondary"
                        onClick={() => {
                          const audio = new Audio(
                            `data:video/mp4;base64,${convertArrayBufferToBase64(
                              x.arrayBuffer
                            )}`
                          );

                          audio.play();
                        }}
                        size={24}
                      />
                    </div>
                  </div>
                </ListGroup.Item>
              ))}
            </ListGroup>
          ) : null}
        </Card.Body>
      </Card>
    </>
  );
}
