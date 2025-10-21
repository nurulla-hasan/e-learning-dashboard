import { createSlice } from "@reduxjs/toolkit";


type TInitialState = {
  CreateError: string;
  UpdateError: string;
}

const initialState: TInitialState = {
  CreateError: "",
  UpdateError: "",
};

const adminSlice = createSlice({
  name: "admin",
  initialState,
  reducers: {
    SetAdminCreateError: (state, action) => {
      state.CreateError = action.payload;
    },
    SetAdminUpdateError: (state, action) => {
      state.UpdateError = action.payload;
    },
  },
});

export const {
  SetAdminCreateError,
  SetAdminUpdateError,
} = adminSlice.actions;

const adminSliceReducer = adminSlice.reducer;
export default adminSliceReducer;
