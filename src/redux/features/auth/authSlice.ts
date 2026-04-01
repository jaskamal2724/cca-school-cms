import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export interface AuthState {
  user_id: string | null;
}

const initialState: AuthState = {
  user_id: null,
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUserId: (state, action: PayloadAction<string>) => {
      state.user_id = action.payload;
    },
    clearUserId: (state) => {
      state.user_id = null;
    },
  },
});

export const { setUserId, clearUserId } = authSlice.actions;

export default authSlice.reducer;
