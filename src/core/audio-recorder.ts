export class AudioRecorder {
  protected blobs: Array<Blob> = [];

  protected mediaRecorder: MediaRecorder | null = null;

  protected mediaStream: MediaStream | null = null;

  constructor(protected cb: (blob: Blob) => void) {}

  public async requestAccess(): Promise<void> {
    const mediaStream: MediaStream = await navigator.mediaDevices.getUserMedia({
      audio: true,
      video: false,
    });

    this.disposeMediaStream(mediaStream);
  }

  public async start(): Promise<void> {
    this.blobs = [];

    await this.requestAccess();

    const mediaDeviceInfos = await navigator.mediaDevices.enumerateDevices();

    const mediaDeviceInfo: MediaDeviceInfo | null =
      mediaDeviceInfos.find((x) => x.kind === "audioinput") || null;

    if (!mediaDeviceInfo) {
      return;
    }

    this.mediaStream = await navigator.mediaDevices.getUserMedia({
      audio: {
        deviceId: mediaDeviceInfo.deviceId,
      },
    });

    this.mediaRecorder = this.getMediaRecorder(this.mediaStream);

    this.mediaRecorder.addEventListener(
      "dataavailable",
      (blobEvent: BlobEvent) => {
        if (blobEvent.data.size > 0) {
          this.blobs.push(blobEvent.data);
        }
      }
    );

    this.mediaRecorder.addEventListener("stop", () => {
      if (!this.mediaStream) {
        return;
      }

      this.disposeMediaStream(this.mediaStream);

      this.mediaStream = null;

      this.cb(new Blob(this.blobs));
    });

    this.mediaRecorder.start();
  }

  public async stop(): Promise<void> {
    if (this.mediaRecorder) {
      this.mediaRecorder.stop();

      this.mediaRecorder = null;
    }
  }

  protected disposeMediaStream(mediaStream: MediaStream): void {
    const mediaStreamTracks: Array<MediaStreamTrack> =
      mediaStream.getAudioTracks();
    for (const mediaStreamTrack of mediaStreamTracks) {
      mediaStreamTrack.stop();
    }
  }

  protected getMediaRecorder(mediaStream: MediaStream): MediaRecorder {
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
}
