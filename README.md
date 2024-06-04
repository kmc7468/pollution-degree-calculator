# pollution-degree-calculator

KAIST 2024 봄학기 '스타트업 101' 수업 **B반 1조**의 프로토타입입니다.

1. 카메라를 이용하여 실시간으로 쓰레기의 존재 유무 및 재질을 판별하고,
2. 쓰레기가 존재하는 경우 해당 쓰레기의 오염도와 배출 가이드라인을 제공합니다.

## 기술 스택
- 객체 인식을 위한 YOLOv5, YOLOv8 모델
- 오염도 인식 및 배출 가이드라인 제공을 위한 GPT-4o 모델
- 웹 UI 제공을 위한 SvelteKit 프레임워크

## 실행 방법
```bash
$ git clone https://github.com/kmc7468/pollution-degree-calculator
$ cd pollution-degree-calculator
$ cp .env.example .env
$ vim .env # 환경 변수를 설정해 주세요.
$ pnpm install
$ pnpm run dev --host 0.0.0.0
```
프로토타입으로 제작되었기 때문에, Vite를 이용한 임시적인 배포만 가능합니다. 필요에 따라 [svelte.config.js](/svelte.config.js) 및 [webSocket.ts](/src/lib/webSocket.ts) 파일을 적절히 수정해 주세요.

## YOLO 모델 설명
객체 인식에 사용할 YOLO 모델은 [socket.ts](/src/lib/server/socket.ts) 파일에서 변경하실 수 있습니다. 기본 상태에서는 `yolov8m-trash` 모델을 사용합니다.
- `yolov5s`: 기본 yolov5s 모델입니다.
- `yolov5s-trash`: yolov5s 모델을 기반으로 쓰레기 데이터셋을 학습시킨 모델입니다. *사용을 권장하지 않습니다.* (GPU: RTX 4080, Batch: 16, Epoch: 30)
- `yolov8s-trash`: yolov8s 모델을 기반으로 쓰레기 데이터셋을 학습시킨 모델입니다. (GPU: RTX 4080, Batch: 32, Epoch: ~200)
- `yolov8m-trash`: yolov8m 모델을 기반으로 쓰레기 데이터셋을 학습시킨 모델입니다. (GPU: RTX 4080, Batch: 32, Epoch: ~200)

## 만든 사람들
- [김민찬](https://github.com/kmc7468): 프론트엔드, 백엔드, YOLO 모델 학습
- [신도윤](https://github.com/DoyunShin): 프론트엔드, GPT 모델 프롬프트 제작, YOLO 모델 학습

## 참고한 곳
- [da2so/tfjs_tutorial](https://github.com/da2so/tfjs_tutorial/blob/main/yolov5n_detection.html): YOLOv5 on JavaScript
- [Hyuto/yolov8-tfjs](https://github.com/Hyuto/yolov8-tfjs/blob/master/src/utils/detect.js): YOLOv8 on JavaScript
- [manaporkun/Trash-Filter-YOLOV5](https://github.com/manaporkun/Trash-Filter-YOLOV5): YOLO 모델 학습용 데이터셋
