import { openDB, IDBPDatabase } from "idb";
import * as uuid from "uuid";

let _db: IDBPDatabase | null = null;

async function getDb(): Promise<IDBPDatabase> {
  if (_db) {
    return _db;
  }

  _db = await openDB("unsent-voice-notes", 4, {
    upgrade: (x, oldVersion, newVersion) => {
      for (const objectStoreName of x.objectStoreNames) {
        x.deleteObjectStore(objectStoreName);
      }

      x.createObjectStore("voice-notes", {
        autoIncrement: true,
      });

      x.createObjectStore("files", {
        keyPath: "id",
      });
    },
  });

  return _db;
}

export async function findFile(
  id: string
): Promise<{ arrayBuffer: ArrayBuffer; id: string }> {
  const db = await getDb();

  return await db.get("files", id);
}

export async function createVoiceNote(arrayBuffer: ArrayBuffer): Promise<void> {
  const db = await getDb();

  const audioContext = new AudioContext();

  const audioBuffer = await audioContext.decodeAudioData(
    cloneArrayBuffer(arrayBuffer)
  );

  const duration = audioBuffer.duration;

  await audioContext.close();

  const fileId: string = uuid.v4();

  await db.add("voice-notes", {
    duration,
    fileId,
    timestamp: new Date().getTime(),
  });

  await db.add("files", {
    arrayBuffer,
    id: fileId,
  });
}

export async function findAllVoiceNotes(): Promise<
  Array<{ duration: number; fileId: string; timestamp: number }>
> {
  const db = await getDb();

  const voiceNotes = await db.getAll("voice-notes");

  return voiceNotes.sort((a, b) => b.timestamp - a.timestamp);
}

export function cloneArrayBuffer(arrayBuffer: ArrayBuffer) {
  const result = new ArrayBuffer(arrayBuffer.byteLength);

  new Uint8Array(result).set(new Uint8Array(arrayBuffer));

  return result;
}

export function convertArrayBufferToBase64(arrayBuffer: ArrayBuffer) {
  let result: string = "";

  let uInt8Array: Uint8Array = new Uint8Array(arrayBuffer);

  for (let i = 0; i < uInt8Array.byteLength; i++) {
    result += String.fromCharCode(uInt8Array[i]);
  }

  return window.btoa(result);
}

export function convertBlobToArrayBuffer(blob: Blob): Promise<ArrayBuffer> {
  return new Promise((resolve, reject) => {
    const fileReader = new FileReader();

    fileReader.addEventListener("loadend", () => {
      resolve(fileReader.result as ArrayBuffer);
    });

    fileReader.addEventListener("error", reject);
    fileReader.readAsArrayBuffer(blob);
  });
}
