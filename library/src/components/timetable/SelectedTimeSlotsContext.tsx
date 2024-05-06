import React, {
	createContext,
	useContext,
	type Dispatch,
	useReducer,
	useCallback,
	useEffect,
	useState,
} from "react"
import type { TimeTableGroup, TimeTableViewType } from "./LPTimeTable"

import type { Dayjs } from "dayjs"
import { useTimeTableMessage } from "./TimeTableMessageContext"
import type { TimeFrameDay } from "./timeTableUtils"

export type SelectedTimeSlots<G extends TimeTableGroup> = {
	timeSlots: number[]
	group: G
}

type ContextType<G extends TimeTableGroup> = {
	selectedTimeSlots: SelectedTimeSlots<G> | undefined
	setSelectedTimeSlots: Dispatch<SelectedTimeSlots<G> | undefined>
	toggleTimeSlotCB: (
		timeSlot: number,
		group: G,
		interaction: InteractionType,
	) => undefined

	multiselectionMode: boolean
	setMultiselectionMode: Dispatch<boolean>
}

const selectedTimeSlotsContext = createContext<
	ContextType<TimeTableGroup> | undefined
>(undefined)

type InteractionType = "click" | "drag" | "remove"

export function SelectedTimeSlotsProvider<G extends TimeTableGroup>({
	slotsArray,
	timeFrameDay,
	viewType,
	timeSlotMinutes,
	disableWeekendInteractions,
	onTimeRangeSelected,
	setClearSelectedTimeRangeCB,
	children,
}: {
	slotsArray: Dayjs[]
	timeFrameDay: TimeFrameDay
	viewType: TimeTableViewType
	timeSlotMinutes: number // length of 1 slot in minutes (for example if the day starts at 8, and ends at 16, and the time slot is a week, that this means (16-8)*60*7 minutes)
	onTimeRangeSelected?: (
		s: { group: G; startDate: Dayjs; endDate: Dayjs } | undefined,
	) => boolean | undefined // if return is true, clear selection
	// this is a callback that can be used to clear the selected time slots... maybe there is a better way to do this?
	setClearSelectedTimeRangeCB?: (cb: () => void) => void
	disableWeekendInteractions?: boolean
	children: JSX.Element
}) {
	const { setMessage } = useTimeTableMessage()
	const [multiselectionMode, setMultiselectionMode] = useState(false) // keeps track if the user selects time slots while dragging the mouse
	const [selectedTimeSlots, setSelectedTimeSlotsG] = useReducer(
		(
			state:
				| (SelectedTimeSlots<G> & { viewType: TimeTableViewType })
				| undefined,
			action:
				| (SelectedTimeSlots<G> & { viewType: TimeTableViewType })
				| undefined,
		) => {
			if (!action) return undefined
			action.timeSlots.sort((a, b) => a - b)
			return action
		},
		undefined,
	)

	// remove any selection in case fundamental time table properties change
	useEffect(() => {
		console.info(
			"LPTimeTable - clearing selection because the slotsArray, time of the day or weekend interactions changed",
		)
		setSelectedTimeSlotsG(undefined)
	}, [
		slotsArray,
		timeFrameDay,
		disableWeekendInteractions,
		onTimeRangeSelected,
		viewType,
	])

	// maybe there is a better way to clear the selection from the parent component, then returning a callback from this component
	const clearSelectionCB = useCallback(
		() => () => {
			setSelectedTimeSlotsG(undefined)
		},
		[],
	)
	useEffect(() => {
		if (setClearSelectedTimeRangeCB) {
			setClearSelectedTimeRangeCB(clearSelectionCB)
		}
	}, [setClearSelectedTimeRangeCB, clearSelectionCB])

	// callback to toggle a time slot
	const toggleTimeSlotCBG = useCallback(
		(timeSlot: number, group: G, interaction: InteractionType) => {
			if (!onTimeRangeSelected) {
				return
			}
			if (!selectedTimeSlots) {
				setSelectedTimeSlotsG({
					timeSlots: [timeSlot],
					group,
					viewType,
				})
				return
			}

			const timeSlotBefore = selectedTimeSlots.timeSlots.find(
				(it) => timeSlot - 1 === it,
			)
			const timeSlotAfter = selectedTimeSlots.timeSlots.find(
				(it) => timeSlot + 1 === it,
			)
			const alreadySelected =
				selectedTimeSlots.timeSlots.includes(timeSlot)

			if (
				interaction === "click" ||
				(interaction === "drag" && !multiselectionMode)
			) {
				if (
					selectedTimeSlots.group !== group ||
					(!alreadySelected && !timeSlotAfter && !timeSlotBefore)
				) {
					setSelectedTimeSlotsG({
						timeSlots: [timeSlot],
						group,
						viewType,
					})
					return
				}
			}

			if (alreadySelected) {
				if (interaction === "drag") {
					return // we only add during drag selection
				}
				if (
					timeSlotBefore !== undefined &&
					timeSlotAfter !== undefined
				) {
					setMessage({
						appearance: "information",
						messageKey: "timetable.deselectFromOuterBorder",
						timeOut: 3,
					})
					return
				}
				if (
					timeSlotBefore === undefined &&
					timeSlotAfter === undefined &&
					selectedTimeSlots.timeSlots.length === 1
				) {
					setSelectedTimeSlotsG(undefined)
					return
				}
				if (
					timeSlotBefore !== undefined ||
					timeSlotAfter !== undefined
				) {
					setSelectedTimeSlotsG({
						timeSlots: selectedTimeSlots.timeSlots.filter(
							(it) => it !== timeSlot,
						),
						group: selectedTimeSlots.group,
						viewType,
					})
				}
				return
			}

			if (interaction === "drag" && multiselectionMode) {
				// selectedTimeSlots.timeSlots is already sorted
				let min = selectedTimeSlots.timeSlots[0]
				let max =
					selectedTimeSlots.timeSlots[
						selectedTimeSlots.timeSlots.length - 1
					]
				if (timeSlot < min) {
					min = timeSlot
				} else if (timeSlot > max) {
					max = timeSlot
				}
				const newTimeSlots = []
				for (let i = min; i <= max; i++) {
					newTimeSlots.push(i)
				}
				setSelectedTimeSlotsG({
					timeSlots: newTimeSlots,
					group: selectedTimeSlots.group,
					viewType,
				})
			} else if (
				timeSlotAfter !== undefined ||
				timeSlotBefore !== undefined
			) {
				setSelectedTimeSlotsG({
					timeSlots: [...selectedTimeSlots.timeSlots, timeSlot],
					group: selectedTimeSlots.group,
					viewType,
				})
			} else {
				setSelectedTimeSlotsG({
					timeSlots: [timeSlot],
					group: selectedTimeSlots.group,
					viewType,
				})
			}
		},
		[
			multiselectionMode,
			onTimeRangeSelected,
			selectedTimeSlots,
			setMessage,
			viewType,
		],
	)

	useEffect(() => {
		if (multiselectionMode) return
		if (!onTimeRangeSelected) return
		if (!selectedTimeSlots) {
			onTimeRangeSelected(undefined)
			return
		}
		if (selectedTimeSlots.viewType !== viewType) {
			setSelectedTimeSlotsG(undefined)
			return // race condition with the clearing useEffect above
		}
		let startDate = slotsArray[selectedTimeSlots.timeSlots[0]]
		let endDate = slotsArray[
			selectedTimeSlots.timeSlots[selectedTimeSlots.timeSlots.length - 1]
		].add(timeSlotMinutes, "minutes")

		if (viewType !== "hours") {
			startDate = startDate
				.startOf("day")
				.add(timeFrameDay.startHour, "hours")
				.add(timeFrameDay.startMinute, "minutes")
			endDate = endDate
				.startOf("day")
				.add(timeFrameDay.endHour, "hours")
				.add(timeFrameDay.endMinute, "minutes")
		}

		const shouldClearSelection = onTimeRangeSelected({
			group: selectedTimeSlots.group,
			startDate,
			endDate,
		})
		if (shouldClearSelection) {
			setSelectedTimeSlotsG(undefined)
		}
	}, [
		selectedTimeSlots,
		multiselectionMode,
		onTimeRangeSelected,
		slotsArray,
		timeSlotMinutes,
		timeFrameDay.startHour,
		timeFrameDay.startMinute,
		viewType,
		timeFrameDay.endHour,
		timeFrameDay.endMinute,
	])

	const setSelectedTimeSlots = setSelectedTimeSlotsG as Dispatch<
		SelectedTimeSlots<TimeTableGroup> | undefined
	>
	const toggleTimeSlotCB = toggleTimeSlotCBG as (
		timeSlot: number,
		group: TimeTableGroup,
		interaction: InteractionType,
	) => undefined

	return (
		<selectedTimeSlotsContext.Provider
			value={{
				selectedTimeSlots,
				setSelectedTimeSlots,
				toggleTimeSlotCB,
				multiselectionMode,
				setMultiselectionMode,
			}}
		>
			{children}
		</selectedTimeSlotsContext.Provider>
	)
}

/**
 * Hook that keeps track of the selected time slots.
 */
export function useSelectedTimeSlots<G extends TimeTableGroup>() {
	const ret = useContext(selectedTimeSlotsContext)
	if (!ret)
		throw new Error(
			"useSelectedTimeSlots must be used within a SelectedTimeSlotsProvider",
		)
	return ret as unknown as ContextType<G> // until Typescript supports higher order generics I have to do this. see: https://github.com/microsoft/TypeScript/issues/1213
}

/**
 * Hook that keeps track of the selected time slots.
 */
export function useMultiSelectionMode() {
	const ret = useContext(selectedTimeSlotsContext)
	if (!ret)
		throw new Error(
			"useMultiSelectionMode must be used within a SelectedTimeSlotsProvider",
		)
	return {
		multiSelectionMode: ret.multiselectionMode,
		setMultiSelectionMode: ret.setMultiselectionMode,
	}
}
