import { useState } from "react";
import classNames from "classnames";
import Button from "react-bootstrap/Button";
import { BsRecordCircleFill, BsStopCircleFill } from "react-icons/bs";
import { AudioRecorder } from "../core";

export function VoiceNoteRecorderButton(props: { fn: (blob: Blob) => void }) {
  const [isRecording, setIsRecording] = useState(false);

  const [audioRecorder, setAudioRecorder] = useState(
    new AudioRecorder((blob) => props.fn(blob))
  );

  return (
    <Button
      className={classNames("fw-semibold w-100", {
        "text-black": isRecording,
        "text-white": !isRecording,
      })}
      onClick={() => {
        if (isRecording) {
          audioRecorder.stop();

          setIsRecording(false);
        } else {
          audioRecorder.start();

          setIsRecording(true);
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
  );
}
