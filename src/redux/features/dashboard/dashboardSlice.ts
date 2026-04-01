import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

interface DashboardState {
    full_name: string | null;
    role: string | null;
    email: string | null;
}

const initialState: DashboardState = {
    full_name: null,
    role: null,
    email: null,
}

export const dashboardSlice = createSlice({
    name: "dashboard",
    initialState,
    reducers: {
        setDashboardData: (state, action: PayloadAction<DashboardState>) => {
            state.full_name = action.payload.full_name;
            state.role = action.payload.role;
            state.email = action.payload.email;
        },
        clearDashboardData: (state) => {
            state.full_name = null;
            state.role = null;
            state.email = null;
        },
    },
})

export const { setDashboardData, clearDashboardData } = dashboardSlice.actions;
export default dashboardSlice.reducer;