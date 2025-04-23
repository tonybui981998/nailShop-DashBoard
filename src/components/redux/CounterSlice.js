import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import {
  deleteAppointment,
  deleteFeedBack,
  DeleteRequired,
  deleteService,
  getAdminColor,
  getadMinStaff,
  GetAllRequired,
  getCustomerFeedBack,
  getLogin,
  getPayrollHistory,
} from "../service/ApiService";

export const fetLogin = createAsyncThunk("counter/fetLogin", async (data) => {
  const login = await getLogin(data);
  return login;
});
export const fetFeedBack = createAsyncThunk("counter/fetFeedBack", async () => {
  const feedback = await getCustomerFeedBack();
  return feedback.data;
});
export const FetDelete = createAsyncThunk("counter/fetDelete", async (id) => {
  await deleteFeedBack(id);
  const reRender = await getCustomerFeedBack();
  return reRender;
});
export const fetRequired = createAsyncThunk("counter/fetRequired", async () => {
  const respond = await GetAllRequired();
  return respond.data;
});
export const fetDeleteRequired = createAsyncThunk(
  "counter/fetDeleteRequired",
  async (id) => {
    await DeleteRequired(id);
    const reRender = await GetAllRequired();
    return reRender.data;
  }
);
export const fetAdminStaff = createAsyncThunk(
  "counter/fetAdminStaff",
  async () => {
    const respond = await getadMinStaff();
    return respond.data;
  }
);
export const fetPayrollHistory = createAsyncThunk(
  "counter/fetPayrollHistory",
  async () => {
    const respond = await getPayrollHistory();
    return respond.data;
  }
);

export const fetAdminColor = createAsyncThunk(
  "/counterfetAdminColor",
  async () => {
    const result = await getAdminColor();
    return result.data;
  }
);
export const fetBookingCancle = createAsyncThunk(
  "counter/fetBookingCancle",
  async (id, thunkAPI) => {
    await deleteAppointment(id);
    const reRender = await thunkAPI.dispatch(fetAdminStaff());
    return reRender;
  }
);

export const counterSlice = createSlice({
  name: "counter",
  initialState: {
    loading: false,
    error: null,
    loginData: [],
    FeedBack: [],
    CusRequired: [],
    AdminStaff: [],
    HistoryPayroll: [],
    GetStaffWorkingDay: [],
    GetAdminColorCheck: [],
  },
  reducers: {
    handleClockOut: (state) => {
      state.loginData = null;
    },
    handleDisplayStaffWorking: (state, action) => {
      const today = new Date(action.payload);
      const dayName = today.toLocaleDateString("en-NZ", { weekday: "long" });
      state.GetStaffWorkingDay = state.AdminStaff.filter((staff) =>
        staff.staffScheduleDtos?.some((s) => s.dayOfWeek === dayName)
      );
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetLogin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetLogin.fulfilled, (state, action) => {
        state.loading = false;
        state.loginData = action.payload;
      })
      .addCase(fetLogin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(fetFeedBack.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetFeedBack.fulfilled, (state, action) => {
        state.loading = false;
        state.FeedBack = action.payload;
      })
      .addCase(fetFeedBack.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(FetDelete.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(FetDelete.fulfilled, (state, action) => {
        state.loading = false;
        state.FeedBack = action.payload;
      })
      .addCase(FetDelete.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(fetRequired.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetRequired.fulfilled, (state, action) => {
        state.loading = false;
        state.CusRequired = action.payload;
      })
      .addCase(fetRequired.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(fetDeleteRequired.pending, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(fetDeleteRequired.fulfilled, (state, action) => {
        state.loading = false;
        state.CusRequired = action.payload;
      })
      .addCase(fetDeleteRequired.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(fetAdminStaff.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetAdminStaff.fulfilled, (state, action) => {
        state.loading = false;
        state.AdminStaff = action.payload;
      })
      .addCase(fetAdminStaff.rejected, (state, action) => {
        state.loading = false;
        action.error = action.error.message;
      })
      .addCase(fetPayrollHistory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetPayrollHistory.fulfilled, (state, action) => {
        state.loading = false;
        state.HistoryPayroll = action.payload;
      })
      .addCase(fetPayrollHistory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(fetAdminColor.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetAdminColor.fulfilled, (state, action) => {
        state.loading = false;
        state.GetAdminColorCheck = action.payload;
      })
      .addCase(fetAdminColor.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(fetBookingCancle.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetBookingCancle.fulfilled, (state, action) => {
        state.loading = false;
        state.AdminStaff = action.payload;
      })
      .addCase(fetBookingCancle.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const { handleClockOut, handleDisplayStaffWorking } =
  counterSlice.actions;

export default counterSlice.reducer;
