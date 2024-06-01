<script lang="ts">
  import { onMount } from "svelte";

  import type { YoloObject, YoloPayload } from "$lib/webSocket";

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

  export const renderYoloFrame = (payload: YoloPayload, callback: (candidateObject: YoloObject | null) => void) => {
    const image = new Image();
    image.src = payload.image;
    image.onload = () => {
      if (!context) {
        callback(null);
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

      let candidateObject: YoloObject | null = null;
      for (const object of objects.sort((a, b) => b.score2 - a.score2)) {
        const candidate = !candidateObject && object.score >= 0.3 && object.area >= 0.05;
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
          x + object.x1 * width - 2, y + object.y1 * height, 20);

        context.strokeRect(
          x + object.x1 * width,
          y + object.y1 * height,
          object.width * width,
          object.height * height);

        if (candidate) {
          candidateObject = object;
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
          `Throughput: ${payload.throughput.toFixed(2)}fps`, "#000000", "#FFFFFF",
          x + 5, y + 45, 20);
        fillTextWithRect(
          new Date(payload.timestamp).toISOString(), "#000000", "#FFFFFF",
          x + 5, y + height - 5, 20);
      }

      callback(candidateObject);
    };
  };

  export const drawButton = (imageWidth: number, imageHeight: number, text: string, candidateObject: YoloObject, callback: () => void, reset: () => void) => {
    const { width, height, x, y } = calcFitSize(imageWidth, imageHeight);

    const objectWidth = candidateObject.x2 - candidateObject.x1;
    const objectHeight = candidateObject.y2 - candidateObject.y1;

    context!.fillStyle = "#FFFFFF80";
    context!.fillRect(
      x + candidateObject.x1 * width,
      y + candidateObject.y1 * height,
      objectWidth * width,
      objectHeight * height);

    const textWidth = context!.measureText(text).width;

    context!.fillStyle = "#000000";
    context!.font = "bold 32px Noto Sans KR";
    context!.globalAlpha = 1;
    context!.fillText(
      text,
      x + candidateObject.x1 * width + objectWidth * width / 2 - textWidth,
      y + candidateObject.y1 * height + objectHeight * height / 2 + 5);

    context!.font = "16px Noto Sans KR";

    const onMouseUp = ({ offsetX, offsetY }: MouseEvent) => {
      canvas.removeEventListener("mouseup", onMouseUp);

      if (offsetX >= x + candidateObject.x1 * width &&
          offsetX <= x + candidateObject.x2 * width &&
          offsetY >= y + candidateObject.y1 * height &&
          offsetY <= y + candidateObject.y2 * height) {

        callback();
      } else {
        reset();
      }
    };
    canvas.addEventListener("mouseup", onMouseUp);
  };
</script>

<canvas bind:this={canvas}></canvas>

<style>
  canvas {
    width: 100%;
    height: 100%;
  }
</style>
