
export enum NotificationType {
    WARNING, INFO, ERROR, SUCCESS
}

export interface FlagAction {
    content: string
    onClick: () => void
}

export interface Notification {
    id: string
    type: NotificationType
    title: String
    description: String
    actions: Array<FlagAction>
}