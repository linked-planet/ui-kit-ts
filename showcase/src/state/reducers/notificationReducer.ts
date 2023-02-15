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

export default notificationReducer