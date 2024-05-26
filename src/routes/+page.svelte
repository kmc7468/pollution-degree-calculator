<script lang="ts">
  import { onMount } from "svelte";

  import { webSocket } from "$lib/webSocket";

  const startCamera = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: {
        width: { ideal: 1280 },
        height: { ideal: 720 },
        frameRate: { ideal: 30 },
      }
    });

    const track = stream.getVideoTracks()[0];
    const settings = track.getSettings();
    if (!settings.width || !settings.height || !settings.frameRate) {
      throw new Error("Failed to get camera settings.");
    }

    const { width, height, frameRate } = settings;
    webSocket.emit("start", {
      width,
      height,
      frameRate,
    });

    const video = document.getElementById("video") as HTMLVideoElement;
    const dummyCanvas = document.getElementById("dummyCanvas") as HTMLCanvasElement;
    const context = dummyCanvas.getContext("2d");

    video.srcObject = stream;
    video.addEventListener("play", () => {
      dummyCanvas.width = width;
      dummyCanvas.height = height;

      setInterval(() => {
        context?.drawImage(video, 0, 0, width, height);
        webSocket.emit("frame", dummyCanvas.toDataURL("image/jpeg"));
      }, 1000 / frameRate);
    });
    video.play();

    return {
      width,
      height,
    };
  };

  onMount(async () => {
    const settings = await startCamera();

    const canvas = document.getElementById("canvas") as HTMLCanvasElement;
    canvas.width = settings.width;
    canvas.height = settings.height;

    const context = canvas.getContext("2d");
    context?.translate(settings.width, 0);
    context?.scale(-1, 1);

    webSocket.on("yolo", (data: string) => {
      const image = new Image();
      image.src = data;
      image.onload = () => {
        context?.drawImage(image, 0, 0, canvas.width, canvas.height);
      };
    });
  });
</script>

<style>
  video {
    display: none;
  }
  #dummyCanvas {
    display: none;
  }
</style>

<video id="video"></video>
<canvas id="dummyCanvas"></canvas>
<canvas id="canvas"></canvas>
