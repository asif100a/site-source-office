import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { baseApi } from "./api/_base/baseApi";
import { aiApi } from "./api/_base/aiApi";
import { setupListeners } from "@reduxjs/toolkit/query";
import authReducer from "./slices/authSlice";
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import AsyncStorage from "@react-native-async-storage/async-storage";

const rootReducer = combineReducers({
  [baseApi.reducerPath]: baseApi.reducer,
  [aiApi.reducerPath]: aiApi.reducer,
  auth: authReducer,
});

const persistConfig = {
  key: "root",
  storage: AsyncStorage,
  whitelist: ["auth"], // Persist auth
};

const persistReducerVar = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistReducerVar,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }).concat(baseApi.middleware, aiApi.middleware),
});

export const persistor = persistStore(store);
// Enable refetchOnFocus and refetchOnReconnect
setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
