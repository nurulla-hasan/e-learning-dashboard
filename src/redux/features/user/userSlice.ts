import { createSlice } from "@reduxjs/toolkit";

// User shape based on /user/me response
export interface IUserProfile {
  id: string;
  fullName: string;
  email: string;
  role: string;
  dateOfBirth: string | null;
  phoneNumber: string | null;
  address: string | null;
  image: string | null;
  createdAt: string;
  updatedAt: string;
}

type TInitialState = {
  CreateError: string;
  user: IUserProfile | null;
}

const initialState: TInitialState = {
  CreateError: "",
  user: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    SetUser: (state, action) => {
      state.user = action.payload;
    },
  },
});

export const {
  SetUser
} = userSlice.actions;

const userSliceReducer = userSlice.reducer;
export default userSliceReducer;
