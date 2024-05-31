<script lang="ts">
  import { onMount } from "svelte";

  import { page } from "$app/stores";
  import VideoRecorder from "$lib/VideoRecorder.svelte";
  import { webSocket } from "$lib/webSocket";

  interface YOLOPayload {
    image: string;
    objects: {
      x1: number;
      x2: number;
      y1: number;
      y2: number;
      score: number;
      label: string;
    }[];
    timestamp: number;
    throughput: number;
  }

  let canvas: HTMLCanvasElement;
  let context: CanvasRenderingContext2D | null = null;

  onMount(() => {
    const resizeCanvas = () => {
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width;
      canvas.height = rect.height;

      context = canvas.getContext("2d");
      if (!context) {
        return;
      }

      context.font = "16px Arial";
      context.lineWidth = 2;
      context.strokeStyle = "#00FF00";
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);
  });

  let throughput = 0;

  const onFrame = (image: string) => {
    webSocket.emit("frame", {
      image,
      timestamp: Date.now(),
    });
    return throughput;
  };

  const onReady = (width: number, height: number, frameRate: number) => {
    throughput = frameRate;

    let running = false;

    const calcFitSize = () => {
      const canvasRatio = canvas.width / canvas.height;
      const frameRatio = width / height;
      if (canvasRatio > frameRatio) {
        return {
          width: canvas.height * frameRatio,
          height: canvas.height,
          x: (canvas.width - canvas.height * frameRatio) / 2,
          y: 0,
        };
      } else {
        return {
          width: canvas.width,
          height: canvas.width / frameRatio,
          x: 0,
          y: (canvas.height - canvas.width / frameRatio) / 2,
        };
      }
    };

    const onYOLOFrame = async (payload: YOLOPayload) => {
      if (running) {
        return;
      } else {
        running = true;
        throughput = payload.throughput;
      }

      const image = new Image();
      image.src = payload.image;
      image.onload = () => {
        if (!context) {
          running = false;
          return;
        }

        const fitSize = calcFitSize();
        context.drawImage(image, fitSize.x, fitSize.y, fitSize.width, fitSize.height);

        let hasObject = false;
        for (const object of payload.objects) {
          const width = object.x2 - object.x1;
          const height = object.y2 - object.y1;
          const area = width * height;
          if (object.score < 0.4 || area < 0.2) {
            continue;
          }

          context.strokeRect(
            fitSize.x + object.x1 * fitSize.width,
            fitSize.y + object.y1 * fitSize.height,
            width * fitSize.width,
            height * fitSize.height);
          context.fillText(
            `${object.label} (${(object.score * 100).toFixed(2)}%)`,
            fitSize.x + object.x1 * fitSize.width,
            fitSize.y + object.y1 * fitSize.height - 5);
          console.log("hi");

          hasObject = true;
        }

        if ($page.data.debug) {
          context.fillText(
            new Date(payload.timestamp).toISOString(),
            fitSize.x + 10,
            fitSize. y + fitSize.height - 20);

          const delay = Date.now() - payload.timestamp;
          context.fillText(`Delay: ${delay}ms`, fitSize.x + 10, fitSize.y + 20);
          context.fillText(`Throughput: ${throughput.toFixed(2)} FPS`, fitSize.x + 10, fitSize.y + 40);
        }

        running = false;
      };
    };

    webSocket.emit("start", {
      width,
      height,
      frameRate,
    });
    webSocket.on("yolo", onYOLOFrame);
  };
</script>

<div>
  <VideoRecorder onReady={onReady} onFrame={onFrame} />

  <h1>분리수거 101</h1>
  <canvas bind:this={canvas}></canvas>
</div>

<style>
  div {
    display: flex;
    flex-direction: column;
    height: 100vh;
  }
  h1 {
    flex-shrink: 0;
    text-align: center;
  }
  canvas {
    flex-grow: 1;
    width: 100%;
    height: 0;
  }
</style>
