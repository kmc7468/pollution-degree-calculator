<script lang="ts">
  import { page } from "$app/stores";
  import { webSocket, type YoloObject, type YoloPayload } from "$lib/webSocket";

  import VideoRecorder from "./VideoRecorder.svelte";
  import YoloCanvas from "./YoloCanvas.svelte";

  type State =
    "detecting" | "detected" | "gptDone" |
    "detecting2" | "detected2" | "gptDone2";

  let state: State = "detecting";
  let title = "분리배출 101";
  let description = "쓰레기를 찾고 있어요. 카메라에 쓰레기를 보여주세요.";
  let canvas: YoloCanvas;

  let throughput = 0;

  const onFrame = (image: string) => {
    if (state === "detecting" || state === "detecting2") {
      webSocket.emit("frame", {
        image,
        timestamp: Date.now(),
      });
    }
    return throughput;
  };

  const onReady = (width: number, height: number, frameRate: number) => {
    throughput = frameRate;

    let running = false;
    let targetObject: {
      image: string;
      object: YoloObject;
      timestamp: number;
      miss: number;
      hit: number;
    } | null = null;
    let timeout: NodeJS.Timeout | null = null;

    const onYOLOFrame = async (payload: YoloPayload) => {
      if (!running && (state === "detecting" || state === "detecting2")) {
        running = true;
        throughput = payload.throughput;

        canvas.renderYoloFrame(payload, (candidateObject: YoloObject | null) => {
          if (!targetObject && candidateObject) {
            targetObject = {
              image: payload.image,
              object: candidateObject,
              timestamp: Date.now(),
              miss: 0,
              hit: 1,
            };
          } else if (targetObject) {
            if (!candidateObject || targetObject.object.label !== candidateObject.label) {
              targetObject.miss += 1;
            } else {
              targetObject.image = payload.image;
              targetObject.object = candidateObject;
              targetObject.hit += 1;
            }

            if (targetObject.timestamp + 1000 <= Date.now()) {
              const hitRate = targetObject.hit / (targetObject.hit + targetObject.miss);
              if (hitRate >= 0.6 && candidateObject?.label === targetObject.object.label) {
                state = state === "detecting" ? "detected" : "detected2";
                title = `${targetObject.object.label}을(를) 발견했어요.`;
                description = "오염도를 분석하고 있어요. 잠시만 기다려 주세요.";

                if (timeout) {
                  clearTimeout(timeout);
                  timeout = null;
                }

                const queryGpt = (retry: boolean) => {
                  fetch("/api/gpt", {
                    method: "POST",
                    body: payload.image,
                  }).then(response => response.text()).then(text => {
                    const left = text.indexOf("{");
                    const right = text.lastIndexOf("}") + 1;
                    const json = JSON.parse(text.substring(left, right));

                    const reset = () => {
                      state = "detecting";
                      title = "분리배출 101";
                      description = "쓰레기를 찾고 있어요. 카메라에 쓰레기를 보여주세요.";
                      targetObject = null;

                      if (timeout) {
                        clearTimeout(timeout);
                        timeout = null;
                      }
                    };
                    const addPoint = (point: number, needTimeout: boolean) => {
                      const phoneNumber = prompt("포인트를 적립할 전화번호를 입력해 주세요.");
                      if (!phoneNumber) {
                        if (needTimeout) {
                          timeout = setTimeout(reset, 10000);
                        }
                        return;
                      }

                      fetch("/api/users/addPointReceivedLog", {
                        method: "POST",
                        headers: {
                          "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                          phoneNumber,
                          point,
                          trash: {
                            name: targetObject!.object.label,
                            image: targetObject!.image,
                          }
                        }),
                      }).then(response => {
                        if (response.status === 200) {
                          response.text().then(text => {
                            alert(`포인트가 적립되었어요. 지금까지 ${text} 포인트를 모았어요.`);
                            reset();
                          });
                        } else {
                          alert("포인트 적립에 실패했어요. 전화번호가 올바른지 다시 확인해 주세요.");
                          addPoint(point, needTimeout);
                        }
                      });
                    };

                    if (json.pollution <= 30 && state === "detected") {
                      title = `오염도가 낮아요! (${json.pollution}%) 포인트를 받을 수 있어요.`;
                      description = json.description;

                      canvas.drawButton(width, height, "포인트 적립하기", targetObject!.object, () => {
                        if (timeout) {
                          clearTimeout(timeout);
                          timeout = null;
                        }

                        addPoint(5, true);
                      }, reset);
                      timeout = setTimeout(reset, 10000);
                    } else if (json.pollution <= 30 && state === "detected2") {
                      title = `오염도가 낮아졌어요! (${json.pollution}%) 포인트를 받을 수 있어요.`;
                      description = json.description;

                      canvas.drawButton(width, height, "포인트 적립하기", targetObject!.object, () => {
                        addPoint(10, false);
                      }, reset);
                    } else if (state === "detected") {
                      title = `오염도가 높아요! (${json.pollution}%) 세척 후 버리면 포인트를 드려요.`;
                      description = json.description;

                      canvas.drawButton(width, height, "세척하고 다시 시도하기", targetObject!.object, () => {
                        state = "detecting2";
                        title = "쓰레기를 세척해 주세요.";
                        description = "세척이 완료된 쓰레기를 카메라에 보여주세요. 오염도가 이전보다 낮아져야 포인트를 받을 수 있어요.";
                        targetObject = null;

                        if (timeout) {
                          clearTimeout(timeout);
                          timeout = null;
                        }
                      }, reset);
                      timeout = setTimeout(reset, 10000);
                    } else {
                      title = `오염도가 아직도 높아요! (${json.pollution}%) 조금 더 깨끗이 세척해 주세요.`;
                      description = json.description;

                      canvas.drawButton(width, height, "다시 시도하기", targetObject!.object, () => {
                        state = "detecting2";
                        title = "쓰레기를 세척해 주세요.";
                        description = "세척이 완료된 쓰레기를 카메라에 보여주세요. 오염도가 이전보다 낮아져야 포인트를 받을 수 있어요.";
                        targetObject = null;

                        if (timeout) {
                          clearTimeout(timeout);
                          timeout = null;
                        }
                      }, reset);
                    }

                    state = state === "detected" ? "gptDone" : "gptDone2";
                  }).catch(() => {
                    if (retry) {
                      state = state === "detected" ? "detecting" : "detecting2";
                      title = "알 수 없는 오류가 발생했어요.";
                      description = "오염도를 분석하는데 실패했어요. 다시 시도해주세요.";

                      targetObject = null;
                      timeout = setTimeout(() => {
                        if (state === "detected") {
                          title = "쓰레기를 찾고 있어요.";
                          description = "카메라에 쓰레기를 보여주세요.";
                        } else {
                          title = "쓰레기를 세척해 주세요.";
                          description = "세척이 완료된 쓰레기를 카메라에 보여주세요. 오염도가 이전보다 낮아져야 포인트를 받을 수 있어요.";
                        }

                        timeout = null;
                      }, 5000);
                    } else {
                      queryGpt(true);
                    }
                  });
                };
                queryGpt(false);
              } else if (hitRate < 0.6) {
                targetObject = null;
              }
            }
          }

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

  <div id="text-container">
    <h1>{title}</h1>
    <p>{description}</p>
  </div>
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

  #text-container {
    flex-shrink: 0;
  }

  h1 {
    font-family: "Noto Sans KR";
    text-align: center;
  }

  p {
    font-family: "Noto Sans KR";
    font-size: 16pt;
    text-align: center;
  }

  #canvas-container {
    flex-grow: 1;
    width: 100%;
    height: 0;
  }
</style>
