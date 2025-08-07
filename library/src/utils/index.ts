import { debounceHelper, useDebounceHelper } from "./debounce"
import {
	getHamburgerMenuPortal,
	hamburgerMenuPortalContainerID,
} from "./getHamburgerPortal"
import {
	createPortalRootNode,
	getPortal,
	getPortalRootNode,
	portalContainerID,
	setPortalRootNode,
} from "./getPortal"
import { idleRateLimitHelper, useIdleRateLimitHelper } from "./idleRateLimit"
import { rateLimitHelper, useRateLimitHelper } from "./rateLimit"
import usePortalContainer from "./usePortalContainer"
export {
	rateLimitHelper,
	useRateLimitHelper,
	idleRateLimitHelper,
	useIdleRateLimitHelper,
	debounceHelper,
	useDebounceHelper,
	getPortal,
	setPortalRootNode,
	usePortalContainer,
	portalContainerID,
	getPortalRootNode,
	createPortalRootNode,
	getHamburgerMenuPortal,
	hamburgerMenuPortalContainerID,
}

import type { DateTimeType, DateType, TimeType } from "./DateUtils"
export type { TimeType, DateTimeType, DateType }

import { isDateTimeType, isDateType, isTimeType } from "./DateUtils"
export { isTimeType, isDateTimeType, isDateType }
export * as DateUtils from "./DateUtils"

export * from "./ErrorHandler"

export * from "./GlobalState"

export * from "./isMobileDevice"
