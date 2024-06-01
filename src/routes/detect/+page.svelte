<script lang="ts">
  import { page } from "$app/stores";
  import { webSocket, type YoloPayload } from "$lib/webSocket";

  import VideoRecorder from "./VideoRecorder.svelte";
  import YoloCanvas from "./YoloCanvas.svelte";

  let canvas: YoloCanvas;

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

    const onYOLOFrame = async (payload: YoloPayload) => {
      if (!running) {
        running = true;
        throughput = payload.throughput;

        canvas.renderYoloFrame(payload, () => {
          running = false;
        });
      }
    };

    webSocket.emit("start", {
      width,
      height,
      frameRate,
    });
    webSocket.on("yolo", onYOLOFrame);
  };
</script>

<div id="root-container">
  <VideoRecorder width={1280} height={720} onReady={onReady} onFrame={onFrame} />

  <h1>분리수거 101</h1>
  <div id="canvas-container">
    <YoloCanvas bind:this={canvas} debug={$page.data.debug} />
  </div>
</div>

<style>
  @font-face {
    font-family: "Noto Sans KR", sans-serif;
    font-style: normal;
    src: local("Noto Sans KR"), url(https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@100..900&display=swap);
  }

  #root-container {
    display: flex;
    flex-direction: column;
    height: 100vh;
  }

  h1 {
    font-family: "Noto Sans KR";
    flex-shrink: 0;
    text-align: center;
  }

  #canvas-container {
    flex-grow: 1;
    width: 100%;
    height: 0;
  }
</style>
