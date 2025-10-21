export type TBlockStatus = "blocked" | "unblocked";

export type IUser = {
  id: string;
  fullName: string;
  email: string;
  dateOfBirth: string | null;
  role: string;
  status: string;
  createdAt: string;
};


export type TProfile = {
  fullName: string;
  email: string;
  phone: string;
  profileImg: string;
}

export type IUserDataSource = {
  key: number;
  serial: number;
  _id: string;
  fullName: string;
  email: string;
  phone: string;
  profileImg: string;
  status: string;
}

