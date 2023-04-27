import { useState } from "react";
import Button from "react-bootstrap/Button";
import { BsRecordCircle, BsStopCircle } from "react-icons/bs";
import { AudioRecorder } from "../core";

export function VoiceNoteRecorderButton(props: { fn: (blob: Blob) => void }) {
  const [isRecording, setIsRecording] = useState(false);

  const [audioRecorder] = useState(new AudioRecorder((blob) => props.fn(blob)));

  return (
    <Button
      className="w-100"
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
          }, 1000);
        }
      }}
      variant="outline-primary"
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
