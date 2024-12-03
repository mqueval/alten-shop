export interface UserDataCreateType extends Omit<UserDataType, "id"> {
  password: string;
}

interface UserDataType {
  username: string;
  firstname: string;
  email: string;
}

interface UserType extends UserDataType {
  createdAt: number;
  id: number;
  updatedAt: number;
}

export default UserType;
