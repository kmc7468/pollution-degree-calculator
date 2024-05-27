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
        webSocket.emit("frame", {
          image: dummyCanvas.toDataURL("image/jpeg"),
          timestamp: Date.now(),
        });
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
    // context?.translate(settings.width, 0);
    // context?.scale(-1, 1);

    let running = false;
    webSocket.on("yolo", async (data: { image: string, objects: { x1: number, x2: number, y1: number, y2: number, score: number, label: string }[], timestamp: number, throughput: number }) => {
      if (running) {
        return;
      } else {
        running = true;
      }

      const image = new Image();
      image.src = data.image;
      image.onload = async () => {
        context!.drawImage(image, 0, 0, canvas.width, canvas.height);

        context!.strokeStyle = "#00ff00";
        context!.lineWidth = 2;
        context!.font = "16px Arial";

        let hasObject = false;
        for (const object of data.objects) {
          if (object.score < 0.4) {
            continue;
          }

          context!.strokeRect(object.x1 * canvas.width, object.y1 * canvas.height, (object.x2 - object.x1) * canvas.width, (object.y2 - object.y1) * canvas.height);
          context!.fillText(`${object.label} (${(object.score * 100).toFixed(2)}%)`, object.x1 * canvas.width, object.y1 * canvas.height - 5);
          hasObject = true;
        }

        const delay = Date.now() - data.timestamp;
        context!.fillText(`Delay: ${delay}ms`, 10, 20);
        context!.fillText(`Throughput: ${data.throughput.toFixed(2)} FPS`, 10, 40);

        if (hasObject) {
          const gptResult = await fetch("/api/gpt", {
            method: "POST",
            body: data.image,
          });
          console.log(await gptResult.text());
        }

        running = false;
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
