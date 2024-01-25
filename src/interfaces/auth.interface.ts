

interface IUser {
    username: string;
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    profileImage?: string;
    verificationToken?: string;
    createdAt?: Date;
    updatedAt?: Date;
}

interface IPrismaUser extends IUser{
  id: number;
}

interface IMutableUser {
  id: number;
  username: string;
  email: string;
  password?: string;
  firstName: string;
  lastName: string;
  verificationToken?: string | null;
  profileImage: string | null;
  createdAt?: Date;
  updatedAt?: Date;
}

interface IRefreshToken {
  token: string;
  userId: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export default IUser
export { IRefreshToken, IPrismaUser, IMutableUser }