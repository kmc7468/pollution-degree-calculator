import bcrypt from "bcrypt";

export interface Trash {
  name: string;
  image: string;
}

export interface Item {
  name: string;
  point: number;
  image: string;
  description: string;
};

interface PointLog {
  deltaPoint: number;
  date: Date;
  trash?: Trash;
  item?: Item;
}

interface User {
  phoneNumber: string;
  password: string;
  name: string;
  pointLogs: PointLog[];
}

const saltRounds = 10;
const salt = bcrypt.genSaltSync(saltRounds);

const users: User[] = [];
const items: Item[] = [];

export const registerUser = (phoneNumber: string, password: string, name: string) => {
  if (users.find((user) => user.phoneNumber === phoneNumber)) {
    return false;
  }

  users.push({
    phoneNumber,
    password: bcrypt.hashSync(password, salt),
    name,
    pointLogs: [],
  });

  return true;
};

export const getPointLogs = (phoneNumber: string) => {
  return users.find((user) => user.phoneNumber === phoneNumber)?.pointLogs;
};

export const addPointReceivedLog = (phoneNumber: string, point: number, trash: Trash) => {
  const user = users.find((user) => user.phoneNumber === phoneNumber);
  if (!user) {
    return null;
  }

  user.pointLogs.push({
    deltaPoint: point,
    date: new Date(),
    trash,
  });

  return user.pointLogs.reduce((acc, cur) => acc + cur.deltaPoint, 0);
};

export const addPointUsedLog = (phoneNumber: string, item: Item) => {
  const user = users.find((user) => user.phoneNumber === phoneNumber);
  if (!user) {
    return null;
  }

  user.pointLogs.push({
    deltaPoint: -item.point,
    date: new Date(),
    item,
  });

  return user.pointLogs.reduce((acc, cur) => acc + cur.deltaPoint, 0);
}

export const getItems = () => {
  return items;
};

export const addItem = (item: Item) => {
  items.push(item);
};
