<script lang="ts">
  import { onMount } from "svelte";

  import List from "$lib/List.svelte";
  import { webSocket } from "$lib/webSocket";

  let throughput = 0;  

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
  
    throughput = frameRate;

    const video = document.getElementById("video") as HTMLVideoElement;
    const dummyCanvas = document.getElementById("dummyCanvas") as HTMLCanvasElement;
    const context = dummyCanvas.getContext("2d");

    video.srcObject = stream;
    video.addEventListener("play", () => {
      dummyCanvas.width = width;
      dummyCanvas.height = height;

      const callback = () => {
        context?.drawImage(video, 0, 0, width, height);
        webSocket.emit("frame", {
          image: dummyCanvas.toDataURL("image/jpeg"),
          timestamp: Date.now(),
        });

        setTimeout(callback, 1000 / throughput);
      };
      setTimeout(callback, 1000 / throughput);
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
    const context = canvas.getContext("2d");
    canvas.width = settings.width;
    canvas.height = settings.height;

    const list = new List({
      target: document.body,
    });
    let running = false;
    let lastAddedTime = 0;

    webSocket.on("yolo", async (data: { image: string, objects: { x1: number, x2: number, y1: number, y2: number, score: number, label: string }[], timestamp: number, throughput: number }) => {
      if (running) {
        return;
      } else {
        running = true;
        throughput = data.throughput;
      }

      const image = new Image();
      image.src = data.image;
      image.onload = () => {
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

        context!.fillText(new Date(data.timestamp).toISOString(), 10, canvas.height - 20);

        if (hasObject && Date.now() - lastAddedTime >= 1000) {
          list.addItem(canvas.toDataURL("image/jpeg"));
          lastAddedTime = Date.now();
        }

        const delay = Date.now() - data.timestamp;
        context!.fillText(`Delay: ${delay}ms`, 10, 20);
        context!.fillText(`Throughput: ${data.throughput.toFixed(2)} FPS`, 10, 40);

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
