import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

type TInitialState = {
  CreateFaqError: string,
  EditFaqError: string
}

const initialState: TInitialState = {
  CreateFaqError: "",
  EditFaqError: ""
};

const faqSlice = createSlice({
  name: "faq",
  initialState,
  reducers: {
    SetCreateFaqError: (state, action: PayloadAction<string>) => {
      state.CreateFaqError = action.payload;
    },
    SetEditFaqError: (state, action: PayloadAction<string>) => {
      state.EditFaqError = action.payload;
    },
  },
});

export const { SetCreateFaqError, SetEditFaqError } = faqSlice.actions;

const faqSliceReducer = faqSlice.reducer;
export default faqSliceReducer;
