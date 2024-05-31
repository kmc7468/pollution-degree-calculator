interface PointLog {
  point: number;
  date: Date;
  trash: string;
}

interface User {
  phoneNumber: string;
  name: string;
  pointLogs: PointLog[];
}

const users: User[] = [];

export const registerUser = (phoneNumber: string, name: string) => {
  if (users.find((user) => user.phoneNumber === phoneNumber)) {
    return false;
  }

  users.push({
    phoneNumber,
    name,
    pointLogs: [],
  });
  return true;
};

export const getPointLogs = (phoneNumber: string) => {
  return users.find((user) => user.phoneNumber === phoneNumber)?.pointLogs;
};

export const addPointLog = (phoneNumber: string, point: number, trash: string) => {
  const user = users.find((user) => user.phoneNumber === phoneNumber);
  if (!user) {
    return null;
  }

  user.pointLogs.push({
    point,
    date: new Date(),
    trash,
  });

  return user.pointLogs.reduce((acc, cur) => acc + cur.point, 0);
}
