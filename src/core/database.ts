import { initializeApp } from "firebase/app";
import { ref, getDownloadURL, getStorage, uploadBytes } from "firebase/storage";
import { openDB, IDBPDatabase } from "idb";
import * as uuid from "uuid";

const firebaseApp = initializeApp({
  apiKey: "AIzaSyBA4tBw7CxYL-_ABZZtlytgSCGKrCbH9IE",
  authDomain: "unsentvoicenotes-com.firebaseapp.com",
  projectId: "unsentvoicenotes-com",
  storageBucket: "unsentvoicenotes-com.appspot.com",
  messagingSenderId: "347359764919",
  appId: "1:347359764919:web:4d6f5e57747891a00b0832",
});

const firebaseStorage = getStorage(firebaseApp);

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
    },
  });

  return _db;
}

export async function createVoiceNote(arrayBuffer: ArrayBuffer): Promise<void> {
  const db = await getDb();

  const fileId: string = uuid.v4();

  const storageReference = ref(firebaseStorage, fileId);

  await uploadBytes(storageReference, arrayBuffer);

  await db.add("voice-notes", {
    fileId,
    timestamp: new Date().getTime(),
    url: await getDownloadURL(storageReference),
  });
}

export async function findAllVoiceNotes(): Promise<
  Array<{ fileId: string; timestamp: number; url: string }>
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
