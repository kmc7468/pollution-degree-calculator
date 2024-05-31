import tf from "@tensorflow/tfjs-node-gpu";
import sharp from "sharp";

const resizeImage = async (image: string, width: number, height: number) => {
  const imageBase64 = image.replace(/^data:image\/jpeg;base64,/, "");
  const imageBuffer = Buffer.from(imageBase64, "base64");
  return await sharp(imageBuffer).resize(width, height).toBuffer();
};

class YOLOv5Model {
  #model: tf.GraphModel;
  #labels: string[];

  constructor(model: tf.GraphModel, labels: string[]) {
    this.#model = model;
    this.#labels = labels;
  }

  async detect(inputImage: string) {
    tf.engine().startScope();

    const [modelWidth, modelHeight] = this.#model.inputs[0].shape!.slice(1, 3);
    const inputImageResized = await resizeImage(inputImage, modelWidth, modelHeight);

    const input = tf.node.decodeImage(inputImageResized, 3).expandDims(0).toFloat().div(255);
    const output = await this.#model.executeAsync(input) as tf.Tensor[];

    const boxes = await output[0].array() as number[][][];
    const scores = await output[1].array() as number[][];
    const classes = await output[2].array() as number[][];
    const numDetections = (await output[3].array() as number[])[0];

    const result = [];
    for (let i = 0; i < numDetections; ++i) {
      const [x1, y1, x2, y2] = boxes[0][i];
      const score = scores[0][i];
      const label = this.#labels[classes[0][i]];

      result.push({ x1, y1, x2, y2, score, label });
    }

    tf.engine().endScope();

    return result;
  }
}

class YOLOv8Model {
  #model: tf.GraphModel;
  #labels: string[];

  constructor(model: tf.GraphModel, labels: string[]) {
    this.#model = model;
    this.#labels = labels;
  }

  async detect(inputImage: string) {
    tf.engine().startScope();

    const [modelWidth, modelHeight] = this.#model.inputs[0].shape!.slice(1, 3);
    const inputImageResized = await resizeImage(inputImage, modelWidth, modelHeight);

    const input = tf.node.decodeImage(inputImageResized, 3).expandDims(0).toFloat().div(255);
    const output = this.#model.execute(input) as tf.Tensor
    const outputT = output.transpose([0, 2, 1]);

    const boxes = tf.tidy(() => {
      const width = outputT.slice([0, 0, 2], [-1, -1, 1]);
      const height = outputT.slice([0, 0, 3], [-1, -1, 1]);
      const x1 = outputT.slice([0, 0, 0], [-1, -1, 1]).sub(width.div(2));
      const y1 = outputT.slice([0, 0, 1], [-1, -1, 1]).sub(height.div(2));
      return tf.concat([
        x1.div(modelWidth),
        y1.div(modelHeight),
        x1.add(width).div(modelWidth),
        y1.add(height).div(modelHeight),
      ], 2).squeeze();
    });
    const [scores, classes] = tf.tidy(() => {
      const rawScores = outputT.slice([0, 0, 4], [-1, -1, this.#labels.length]).squeeze();
      return [rawScores.max(1), rawScores.argMax(1)];
    });

    const nms = tf.image.nonMaxSuppression(boxes, scores, 10, 0.45, 0.2);
    const boxes2 = boxes.gather(nms, 0).dataSync();
    const scores2 = scores.gather(nms, 0).dataSync();
    const classes2 = classes.gather(nms, 0).dataSync();

    const result = [];
    for (let i = 0; i < boxes2.length / 4; ++i) {
      const [x1, y1, x2, y2] = boxes2.slice(i * 4, i * 4 + 4);
      const score = scores2[i];
      const label = this.#labels[classes2[i]];
 
      result.push({ x1, y1, x2, y2, score, label });
    }

    tf.engine().endScope();

    return result;
  }
}

const cocoNames = [
  "person",
  "bicycle",
  "car",
  "motorcycle",
  "airplane",
  "bus",
  "train",
  "truck",
  "boat",
  "traffic light",
  "fire hydrant",
  "stop sign",
  "parking meter",
  "bench",
  "bird",
  "cat",
  "dog",
  "horse",
  "sheep",
  "cow",
  "elephant",
  "bear",
  "zebra",
  "giraffe",
  "backpack",
  "umbrella",
  "handbag",
  "tie",
  "suitcase",
  "frisbee",
  "skis",
  "snowboard",
  "sports ball",
  "kite",
  "baseball bat",
  "baseball glove",
  "skateboard",
  "surfboard",
  "tennis racket",
  "bottle",
  "wine glass",
  "cup",
  "fork",
  "knife",
  "spoon",
  "bowl",
  "banana",
  "apple",
  "sandwich",
  "orange",
  "broccoli",
  "carrot",
  "hot dog",
  "pizza",
  "donut",
  "cake",
  "chair",
  "couch",
  "potted plant",
  "bed",
  "dining table",
  "toilet",
  "tv",
  "laptop",
  "mouse",
  "remote",
  "keyboard",
  "cell phone",
  "microwave",
  "oven",
  "toaster",
  "sink",
  "refrigerator",
  "book",
  "clock",
  "vase",
  "scissors",
  "teddy bear",
  "hair drier",
  "toothbrush"
];

const trashNames = [
  "glass",
  "other",
  "paper",
  "cardboard",
  "foam",
  "metal",
  "plastic"
];

export type YOLOModel =
  "yolov5s" |
  "yolov5s-trash" |
  "yolov8s-trash" |
  "yolov8m-trash";

export const loadModel = async (model: YOLOModel) => {
  const graphModel = await tf.loadGraphModel(`file://models/${model}/model.json`);
  const labels = model.endsWith("-trash") ? trashNames : cocoNames;

  if (model.startsWith("yolov5")) {
    return new YOLOv5Model(graphModel, labels);
  } else {
    return new YOLOv8Model(graphModel, labels);
  }
}
