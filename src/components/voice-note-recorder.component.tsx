import { useState } from "react";
import classNames from "classnames";
import Button from "react-bootstrap/Button";
import { BsRecordCircle, BsStopCircle } from "react-icons/bs";
import { AudioRecorder } from "../core";

export function VoiceNoteRecorderButton(props: { fn: (blob: Blob) => void }) {
  const [isRecording, setIsRecording] = useState(false);

  const [audioRecorder] = useState(new AudioRecorder((blob) => props.fn(blob)));

  return (
    <Button
      className={classNames("w-100", {
        "bg-dark": isRecording,
        "text-white": isRecording,
      })}
      onClick={() => {
        if (isRecording) {
          audioRecorder.stop();

          setIsRecording(false);
        } else {
          audioRecorder.start();

          setIsRecording(true);

          setTimeout(() => {
            const audioContext = new AudioContext();
            const oscillatorNode = audioContext.createOscillator();
            oscillatorNode.type = "sine";
            oscillatorNode.frequency.value = 800;
            oscillatorNode.connect(audioContext.destination);
            oscillatorNode.start();

            setTimeout(() => {
              oscillatorNode.stop();
            }, 300);
          }, 500);
        }
      }}
      variant="outline-dark"
    >
      {isRecording ? (
        <>
          <BsStopCircle style={{ marginBottom: "3px" }} />
          &nbsp; Stop Recording
        </>
      ) : (
        <>
          <BsRecordCircle style={{ marginBottom: "3px" }} />
          &nbsp; Start Recording
        </>
      )}
    </Button>
  );
}
