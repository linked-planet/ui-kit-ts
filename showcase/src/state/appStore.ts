import notificationReducer from "./reducers/notificationReducer";
import {configureStore} from "@reduxjs/toolkit";
import stackReducer from "./reducers/stackReducer";

export const appStore = configureStore({
    reducer: {
        notifications: notificationReducer,
        stack: stackReducer
    }
})

export type State = ReturnType<typeof appStore.getState>
