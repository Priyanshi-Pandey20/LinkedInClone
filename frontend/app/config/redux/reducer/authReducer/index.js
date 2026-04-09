import { createSlice } from "@reduxjs/toolkit";
import { getAboutUser, getAllUsers, getConnectionsRequest, getMyConnectionRequest, loginUser, registerUser } from "../../action/authAction";

const initialState = {
  user: undefined,
  isError: false,
  isSuccess: false,
  isLoading: false,
  loggedIn: false,
  message: "",
  profileFetched: false,
  connections: [],
  connectionRequest: [],
  all_profiles_fetched: false,
  all_users:[],
  isTokenThere : false
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    reset: () => initialState,
    handleLoginUser: (state) => {
      state.message = "hello";
    },
    emptyMessage:(state) => {
      state.message=""
    },
    setTokenIsThere : (state) => {
      state.isTokenThere = true
    },
    setTokenIsNotThere :(state) => {
      state.isTokenThere = false
    },
  },


  extraReducers: (builder) => {
    builder

      // ================= LOGIN ================= //
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.message = "knocking the door...";
      })

      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
        state.loggedIn = true;
        state.message = "Login is Successful";
      })

      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;

        state.message =
          typeof action.payload === "string"
            ? action.payload
            : action.payload?.message || "Login failed";
      })


      // ================= REGISTER ================= //
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
        state.message = "Registering you...";
      })

      .addCase(registerUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;

        // ⚠️ only set true if your backend actually logs in user
        state.loggedIn = false;

        // ✅ USE BACKEND MESSAGE
        state.message =
          typeof action.payload === "string"
            ? action.payload
            : action.payload?.message || "Register is Successful, Please Log In";
      })


      

      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;

        // ✅ HANDLE BOTH STRING & OBJECT ERROR
        state.message =
          typeof action.payload === "string"
            ? action.payload
            : action.payload?.message || "Registration failed";
      })

      .addCase(getAboutUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.profileFetched = true;
        state.user = action.payload.profile
      })

      .addCase(getAllUsers.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.all_profiles_fetched = true
        state.all_users = action.payload.profiles
      })

      .addCase(getConnectionsRequest.fulfilled, (state, action) => {
        state.connections = action.payload
      })
      .addCase(getConnectionsRequest.rejected, (state, action) => {
        state.message = action.payload
      })
      .addCase(getMyConnectionRequest.fulfilled, (state, action) => {
        state.connectionRequest = action.payload
      })
      .addCase(getMyConnectionRequest.rejected, (state, action) => {
        state.message = action.payload
      })

  }
});
export const {emptyMessage} = authSlice.actions;
export const { reset, handleLoginUser,setTokenIsThere,setTokenIsNotThere } = authSlice.actions;
export default authSlice.reducer;