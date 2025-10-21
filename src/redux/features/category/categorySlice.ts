import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

type TInitialState = {
  CategoryCreateError: string;
  CategoryUpdateError: string,
  categoryOptions: []
}

const initialState: TInitialState = {
  CategoryCreateError: "",
  CategoryUpdateError: "",
  categoryOptions: []
};

const categorySlice = createSlice({
  name: "category",
  initialState,
  reducers: {
    SetCategoryCreateError: (state, action: PayloadAction<string>) => {
      state.CategoryCreateError = action.payload;
    },
    SetCategoryUpdateError: (state, action: PayloadAction<string>) => {
      state.CategoryUpdateError = action.payload;
    },
    SetCategoryOptions: (state, action) => {
      state.categoryOptions = action.payload;
    }
  },
});

export const {
  SetCategoryCreateError,
  SetCategoryUpdateError,
  SetCategoryOptions
} = categorySlice.actions;

const categorySliceReducer = categorySlice.reducer;
export default categorySliceReducer;
