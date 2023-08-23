import React, { useEffect } from "react"
import { CodeBlock } from "@atlaskit/code"
import { useDispatch } from "react-redux"

function ReduxPage() {
	const reduxInstall = `npm install -s react-redux @types/react-redux @reduxjs/toolkit`

	const reduxAppStore = `// state/appStore.ts
import notificationReducer from "./reducers/notificationReducer";
import {configureStore} from "@reduxjs/toolkit";
import stackReducer from "./reducers/stackReducer";

export const appStore = configureStore({
    reducer: {
        notifications: notificationReducer,
        stack: stackReducer
    }
})

export type State = ReturnType<typeof appStore.getState>`

	const reduxRegister = `// index.tsx
<Provider store={appStore}>
    <App/>
</Provider>`

	const reduxReducer = `// state/reducers/notificationReducer.ts
import {Notification} from "../../model/AppModel";    

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

	const reduxUsage = `// get updating notifications from state (reloads component on state change)
const notifications = useSelector((appState: State) => appState.notifications)

// update state
// before rendering
const dispatch = useDispatch()

// within rendering
dispatch({
    type: 'ADD_NOTIFICATION',
    notification: notification
})`
	const dispatch = useDispatch()
	useEffect(() => {
		dispatch({
			type: "SET_MENU",
		})
	}, [dispatch])

	return (
		<div>
			<h1>Redux</h1>
			<p>
				Redux is used for global state handling. For example for
				handling notifications.
			</p>

			<div
				id="dependencies"
				data-menu-name="Dependencies"
				className="menu pd"
			>
				<h5>Dependencies</h5>
				<p>This library uses the following dependencies:</p>
				<br />
				<CodeBlock language="bash" text={reduxInstall} />
			</div>

			<div
				id="init-appstore"
				data-menu-name="Init AppStore"
				className="menu pd"
			>
				<h5>Init appStore</h5>
				<br />
				<CodeBlock language="typescript" text={reduxAppStore} />
			</div>

			<div
				id="integrate-appstore"
				data-menu-name="Integrate AppStore"
				className="menu pd"
			>
				<h5>Integrate appStore</h5>
				<br />
				<CodeBlock language="tsx" text={reduxRegister} />
			</div>

			<div
				id="create-reducer"
				data-enu-name="Create Reducer"
				className="menu pd"
			>
				<h5>Create reducer</h5>
				<br />
				<CodeBlock language="typescript" text={reduxReducer} />
			</div>

			<div
				id="use-redux"
				data-menu-name="Use Redux States"
				className="menu pd"
			>
				<h5>Use and change redux states</h5>
				<br />
				<CodeBlock language="typescript" text={reduxUsage} />
			</div>
		</div>
	)
}

export default ReduxPage
