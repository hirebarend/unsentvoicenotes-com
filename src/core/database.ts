import { openDB, IDBPDatabase } from "idb";

let _db: IDBPDatabase | null = null;

async function getDb(): Promise<IDBPDatabase> {
  if (_db) {
    return _db;
  }

  _db = await openDB("unsent-voice-notes", 1, {
    upgrade: (x) => {
      x.createObjectStore("voice-notes", {
        autoIncrement: true,
      });
    },
  });

  return _db;
}

export async function createVoiceNote(arrayBuffer: ArrayBuffer): Promise<void> {
  const db = await getDb();

  await db.add("voice-notes", {
    arrayBuffer,
    timestamp: new Date().getTime(),
  });
}

export async function findAllVoiceNotes(): Promise<
  Array<{ arrayBuffer: ArrayBuffer; timestamp: number }>
> {
  const db = await getDb();

  return await db.getAll("voice-notes");
}

export function convertArrayBufferToBase64(arrayBuffer: ArrayBuffer) {
  let result = "";

  let uInt8Array = new Uint8Array(arrayBuffer);

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
