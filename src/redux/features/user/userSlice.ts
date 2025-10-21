import { createSlice } from "@reduxjs/toolkit";
import type { IUser } from "../../../types/user.type";


type TInitialState = {
  CreateError: string;
  user: IUser | null;
}

const initialState: TInitialState = {
  CreateError: "",
  user: null
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
