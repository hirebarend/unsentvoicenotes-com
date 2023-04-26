import axios from "axios";
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { ref, getDownloadURL, getStorage, uploadBytes } from "firebase/storage";
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

export async function createVoiceNote(arrayBuffer: ArrayBuffer): Promise<void> {
  const fileId: string = uuid.v4();

  const storageReference = ref(firebaseStorage, fileId);

  await uploadBytes(storageReference, arrayBuffer, {
    contentType: "video/mp4",
  });

  const url: string = await getDownloadURL(storageReference);

  await axios.post(
    "https://func-unsentvoicenotes-prod-001.azurewebsites.net/api/voice-notes-post",
    {
      id: uuid.v4(),
      text: null,
      timestamp: new Date().getTime(),
      url,
    }
  );
}

export async function findAllVoiceNotes(): Promise<
  Array<{
    id: string;
    text: string | null;
    timestamp: number;
    url: string;
  }>
> {
  const response = await axios.get<
    Array<{
      id: string;
      text: string | null;
      timestamp: number;
      url: string;
    }>
  >(
    "https://func-unsentvoicenotes-prod-001.azurewebsites.net/api/voice-notes-get"
  );

  return response.data;
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
