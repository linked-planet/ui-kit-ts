import React from "react";
import {CodeBlock} from "@atlaskit/code";

function ReduxPage() {

    const reduxInstall =`npm install -s react-redux @types/react-redux @reduxjs/toolkit`

    const reduxAppStore = `import notificationReducer from "./reducers/notificationReducer";
import {configureStore} from "@reduxjs/toolkit";
import stackReducer from "./reducers/stackReducer";

export const appStore = configureStore({
    reducer: {
        notifications: notificationReducer,
        stack: stackReducer
    }
})

export type State = ReturnType<typeof appStore.getState>`

    const reduxRegister =`// index.tsx
<Provider store={appStore}>
    <App/>
</Provider>`

    const reduxReducer = `import {Notification} from "../../model/AppModel";

const initialState: Notification[] = []

export interface AddNotification {
    type: "ADD_NOTIFICATION"
    notification: Notification
}

export interface RemoveNotification {
    type: "REMOVE_NOTIFICATION"
    string: string
}

export interface ClearAllNotifications {
    type: "CLEAR_NOTIFICATION"
}

export type Action = AddNotification | RemoveNotification | ClearAllNotifications

function generateId() {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    let counter = 0;
    while (counter < 8) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
        counter += 1;
    }
    return result;
}

const notificationReducer = (state: Notification[] = initialState, action: Action) => {
    switch (action.type) {
        case "ADD_NOTIFICATION":
            action.notification.id = generateId()
            return [...state, action.notification]
        case "REMOVE_NOTIFICATION":
            console.info("Remove", action.string)
            return [...state.filter((item) => item.id != action.string )]
        default:
            return [...state]
    }
}

export default notificationReducer`

    const reduxUsage = `// get updating notifications from stack (reloads on change)
const notifications = useSelector((appState: State) => appState.notifications)

// update state
// before rendering
const dispatch = useDispatch()

// within rendering
dispatch({
    type: 'ADD_NOTIFICATION',
    notification: notification
})`

    return (
        <div>
            <h1>Redux</h1>
            <p>Redux is used for global stack handling. For example for handling notifications</p>

            <h5>Install Redux</h5>
            <p>Not needed if you use this library. It is already included</p>
            <br/>
            <CodeBlock
                language="bash"
                text={reduxInstall}
            />

            <h5>Init appStore</h5>
            <br/>
            <CodeBlock
                language="typescript"
                text={reduxAppStore}
            />

            <h5>Integrate appStore</h5>
            <br/>
            <CodeBlock
                language="tsx"
                text={reduxRegister}
            />

            <h5>Create reducer</h5>
            <br/>
            <CodeBlock
                language="typescript"
                text={reduxReducer}
            />

            <h5>Use and change redux states</h5>
            <br/>
            <CodeBlock
                language="typescript"
                text={reduxUsage}
            />
        </div>
    )
}

export default ReduxPage;