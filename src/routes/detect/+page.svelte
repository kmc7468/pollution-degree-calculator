<script lang="ts">
  import List from "$lib/List.svelte";
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

    const canvas = document.getElementById("canvas") as HTMLCanvasElement;
    canvas.width = width;
    canvas.height = height;

    const context = canvas.getContext("2d");
    if (context) {
      context.font = "16px Arial";
      context.lineWidth = 2;
      context.strokeStyle = "#00FF00";
    } else {
      throw new Error("Failed to get canvas context");
    }

    const list = new List({
      target: document.body,
    });
    let running = false;
    let lastAddedTime = 0;

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
        context.drawImage(image, 0, 0, canvas.width, canvas.height);

        let hasObject = false;
        for (const object of payload.objects) {
          const width = object.x2 - object.x1;
          const height = object.y2 - object.y1;
          const area = width * height;
          if (object.score < 0.4 || area < 0.2) {
            continue;
          }

          context.strokeRect(object.x1 * canvas.width, object.y1 * canvas.height, width * canvas.width, height * canvas.height);
          context.fillText(`${object.label} (${(object.score * 100).toFixed(2)}%)`, object.x1 * canvas.width, object.y1 * canvas.height - 5);
          hasObject = true;
        }

        context.fillText(new Date(payload.timestamp).toISOString(), 10, canvas.height - 20);

        if (hasObject && Date.now() - lastAddedTime >= 1000) {
          list.addItem(canvas.toDataURL("image/jpeg"));
          lastAddedTime = Date.now();
        }

        const delay = Date.now() - payload.timestamp;
        context!.fillText(`Delay: ${delay}ms`, 10, 20);
        context!.fillText(`Throughput: ${throughput.toFixed(2)} FPS`, 10, 40);

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
  <h1>분리수거 101</h1>

  <VideoRecorder onReady={onReady} onFrame={onFrame} />
  <canvas id="canvas"></canvas>
</div>

<style>
  div {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
</style>
