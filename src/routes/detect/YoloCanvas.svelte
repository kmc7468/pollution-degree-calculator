<script lang="ts">
  import { onMount } from "svelte";

  import { type YoloPayload } from "$lib/webSocket";

  export let debug = false;

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

      context.font = "16px Noto Sans KR";
      context.lineWidth = 4;
      context.strokeStyle = "#FFFFFF";
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);
  });

  const calcFitSize = (width: number, height: number) => {
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

  const fillTextWithRect = (text: string, fgColor: string, bgColor: string, x: number, y: number, h: number) => {
    const textWidth = context!.measureText(text).width;

    context!.fillStyle = bgColor;
    context!.fillRect(x, y - h, textWidth + 8, h);

    context!.fillStyle = fgColor;
    context!.fillText(text, x + 4, y - 4);
  };

  export const renderYoloFrame = (payload: YoloPayload, callback: () => void) => {
    const context = canvas.getContext("2d");
    if (!context) {
      callback();
      throw new Error("Failed to get canvas context");
    }

    const image = new Image();
    image.src = payload.image;
    image.onload = () => {
      if (!context) {
        callback();
        return;
      }

      context.fillStyle = "#FFFFFF";
      context.clearRect(0, 0, canvas.width, canvas.height);

      const { width, height, x, y } = calcFitSize(image.width, image.height);
      context.drawImage(image, x, y, width, height);

      const objects = payload.objects.map((object) => {
        const objectWidth = object.x2 - object.x1;
        const objectHeight = object.y2 - object.y1;
        const objectArea = objectWidth * objectHeight;
        return {
          ...object,
          width: objectWidth,
          height: objectHeight,
          area: objectArea,
          score2: object.score * objectArea,
        };
      });

      let isWhiteUsed = false;
      for (const object of objects.sort((a, b) => b.score2 - a.score2)) {
        const candidate = !isWhiteUsed && object.score >= 0.3 && object.area >= 0.05;
        if (!candidate) {
          if (debug) {
            context.lineWidth = 2;
            context.strokeStyle = "#00FF00";
          } else {
            continue;
          }
        }

        const text = debug
          ? `${object.label} ${object.score.toFixed(2)} ${object.area.toFixed(2)} ${object.score2.toFixed(2)}`
          : `${object.label} (${(object.score * 100).toFixed(2)}%)`;
        fillTextWithRect(
          text, "#000000", context.strokeStyle as string,
          x + object.x1 * width, y + object.y1 * height, 20);

        context.strokeRect(
          x + object.x1 * width,
          y + object.y1 * height,
          object.width * width,
          object.height * height);

        if (candidate) {
          isWhiteUsed = true;
        } else if (!candidate && debug) {
          context.lineWidth = 4;
          context.strokeStyle = "#FFFFFF";
        }
      }

      if (debug) {
        fillTextWithRect(
          `Delay: ${Date.now() - payload.timestamp}ms`, "#000000", "#FFFFFF",
          x + 5, y + 25, 20);
        fillTextWithRect(
          `Throughput: ${payload.throughput.toFixed(2)} FPS`, "#000000", "#FFFFFF",
          x + 5, y + 45, 20);
        fillTextWithRect(
          new Date(payload.timestamp).toISOString(), "#000000", "#FFFFFF",
          x + 5, y + height - 5, 20);
      }

      callback();
    };
  };
</script>

<canvas bind:this={canvas}></canvas>

<style>
  canvas {
    width: 100%;
    height: 100%;
  }
</style>
