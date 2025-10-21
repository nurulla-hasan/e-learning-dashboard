export type TBlockStatus = "blocked" | "unblocked";

export type IUser = {
  id: string;
  fullName: string;
  email: string;
  password?: string; // Optional as it might not always be included
  dateOfBirth: string | null;
  role: string;
  status: string;
  isVerified: boolean;
  isProfileComplete: boolean;
  address: string | null;
  isLoggedIn: boolean;
  image: string | null;
  phoneNumber: string | null;
  gender: string | null;
  plateForm: string | null;
  fcmToken: string | null;
  fcmTokenEx: string | null;
  stripeCustomerId: string | null;
  isVerifiedForPasswordReset: boolean;
  createdAt: string;
  updatedAt: string;
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

