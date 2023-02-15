import notificationReducer from "./reducers/notificationReducer";
import {configureStore} from "@reduxjs/toolkit";
import stackReducer from "./reducers/stackReducer";
import menuReducer from "./reducers/menuReducer";

export const appStore = configureStore({
    reducer: {
        notifications: notificationReducer,
        stack: stackReducer,
        menu: menuReducer
    }
})

export type State = ReturnType<typeof appStore.getState>
