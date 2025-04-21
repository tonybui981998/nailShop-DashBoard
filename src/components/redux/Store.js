import { configureStore } from "@reduxjs/toolkit";
import counterReducer from "../redux/CounterSlice";
import { persistStore, persistReducer } from "redux-persist";
import sessionStorage from "redux-persist/lib/storage/session";

const persistConfig = {
  key: "root",
  storage: sessionStorage,
  whitelist: [],
};
const persistedReducer = persistReducer(persistConfig, counterReducer);
const store = configureStore({
  reducer: {
    counter: persistedReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export const persistor = persistStore(store);
export default store;
