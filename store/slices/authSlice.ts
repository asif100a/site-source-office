import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
  name: "auth",
  initialState: {
    token: null as string | null,
    otpToken: null as string | null,
    forgotToken: null as string | null,
    requiresProfileSetup: false,
    requiresPlanSelection: false,
    requiresVehicleSetup: false,
  },
  reducers: {
    setToken: (state, action) => {
      state.token = action.payload;
      if (action.payload) {
        state.otpToken = null;
        state.forgotToken = null;
      }
    },
    setOtpToken: (state, action) => {
      state.otpToken = action.payload;
    },
    setForgotToken: (state, action) => {
      state.forgotToken = action.payload;
    },
    setRequiresProfileSetup: (state, action) => {
      state.requiresProfileSetup = action.payload;
    },
    setRequiresPlanSelection: (state, action) => {
      state.requiresPlanSelection = action.payload;
    },
    setRequiresVehicleSetup: (state, action) => {
      state.requiresVehicleSetup = action.payload;
    },
    clearRequiresProfileSetup: (state) => {
      state.requiresProfileSetup = false;
    },
    clearRequiresPlanSelection: (state) => {
      state.requiresPlanSelection = false;
    },
    clearRequiresVehicleSetup: (state) => {
      state.requiresVehicleSetup = false;
    },
    clearForgotToken: (state) => {
      state.forgotToken = null;
    },
    clearOtpToken: (state) => {
      state.otpToken = null;
    },
    logout: (state) => {
      state.token = null;
      state.otpToken = null;
      state.forgotToken = null;
      state.requiresProfileSetup = false;
      state.requiresPlanSelection = false;
      state.requiresVehicleSetup = false;
    },
  },
});

export const {
  setToken,
  setOtpToken,
  setForgotToken,
  setRequiresProfileSetup,
  setRequiresPlanSelection,
  setRequiresVehicleSetup,
  clearRequiresProfileSetup,
  clearRequiresPlanSelection,
  clearRequiresVehicleSetup,
  clearForgotToken,
  clearOtpToken,
  logout,
} = authSlice.actions;
export default authSlice.reducer;
