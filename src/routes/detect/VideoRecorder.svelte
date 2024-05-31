<script lang="ts">
  import { onMount } from "svelte";

  export let width = 640;
  export let height = 480;
  export let frameRate = 30;
  export let onReady: ((width: number, height: number, frameRate: number) => void) | undefined = undefined;
  export let onFrame: (image: string) => number;

  let video: HTMLVideoElement;
  let canvas: HTMLCanvasElement;

  onMount(async () => {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: {
        width: { ideal: width },
        height: { ideal: height },
        frameRate: { ideal: frameRate },
      },
    });

    const track = stream.getVideoTracks()[0];
    const settings = track.getSettings();
    if (!settings.width || !settings.height || !settings.frameRate) {
      throw new Error("Failed to get camera settings");
    }

    const realWidth = settings.width;
    const realHeight = settings.height;
    const realFrameRate = settings.frameRate;

    video.srcObject = stream;
    video.addEventListener("play", () => {
      canvas.width = realWidth;
      canvas.height = realHeight;

      const context = canvas.getContext("2d");
      if (!context) {
        throw new Error("Failed to get canvas context");
      }

      const callback = () => {
        context.drawImage(video, 0, 0, realWidth, realHeight);

        const newFrameRate = onFrame(canvas.toDataURL("image/jpeg"));
        setTimeout(callback, 1000 / newFrameRate);
      };

      onReady?.(realWidth, realHeight, realFrameRate);
      setTimeout(callback, 1000 / realFrameRate);
    });
    video.play();
  });
</script>

<div>
  <video bind:this={video}></video>
  <canvas bind:this={canvas}></canvas>
</div>

<style>
  video {
    display: none;
  }
  canvas {
    display: none;
  }
</style>
