import tf from "@tensorflow/tfjs-node-gpu";
import sharp from "sharp";

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

export const loadModel = async () => {
  return await tf.loadGraphModel("file://models/yolov8s-trash/model.json");
};

export const detect = async (model: tf.GraphModel, data: string) => {
  const [modelWidth, modelHeight] = model.inputs[0].shape!.slice(1, 3);
  const base64 = data.replace(/^data:image\/jpeg;base64,/, "");
  const image = await sharp(Buffer.from(base64, "base64")).resize(modelWidth, modelHeight).toBuffer();

  const input1 = tf.node.decodeImage(image, 3);
  const input2 = input1.expandDims(0);
  const input3 = input2.toFloat();
  const input4 = input3.div(255);
  const output = await model.executeAsync(input4) as tf.Tensor[];

  const boxes = await output[0].array() as number[][][];
  const scores = await output[1].array() as number[][];
  const classes = await output[2].array() as number[][];
  const numDetections = (await output[3].array() as number[])[0];

  const result = [];
  for (let i = 0; i < numDetections; ++i) {
    const [x1, y1, x2, y2] = boxes[0][i];
    const score = scores[0][i];
    const label = trashNames[classes[0][i]];

    result.push({ y1, x1, y2, x2, score, label });
  }

  // TF sucks!
  tf.dispose(output);
  tf.dispose(input4);
  tf.dispose(input3);
  tf.dispose(input2);
  tf.dispose(input1);

  return result;
};
