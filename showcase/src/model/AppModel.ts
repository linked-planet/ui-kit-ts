export enum NotificationType {
	WARNING = 0,
	INFO = 1,
	ERROR = 2,
	SUCCESS = 3,
}

export interface FlagAction {
	content: string
	onClick: () => void
}

export interface Notification {
	id: string
	type: NotificationType
	title: string
	description: string
	actions: Array<FlagAction>
}
