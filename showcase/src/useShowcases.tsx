import React, { useMemo } from "react"
import PageLayoutShowcase from "./components/PageLayoutShowcase"
import AvatarShowcase from "./components/showcase/wrapper/AvatarShowcase"
import AwesomeSliderShowcase from "./components/showcase/wrapper/AwesomeSliderShowcase"
import BadgeShowcase from "./components/showcase/wrapper/BadgeShowcase"
import BannerShowcase from "./components/showcase/wrapper/BannerShowcase"
import BookCardShowcase from "./components/showcase/wrapper/BookCardShowcase"
import ButtonShowcase from "./components/showcase/wrapper/ButtonShowcase"
import CalendarShowcase from "./components/showcase/wrapper/CalendarShowcase"
import CheckboxShowcase from "./components/showcase/wrapper/CheckboxShowcase"
import CodeBlockShowcase from "./components/showcase/wrapper/CodeBlockShowcase"
import DateRangePickerShowcase from "./components/showcase/wrapper/DateRangePickerShowcase"
import DateTimePickerShowcase from "./components/showcase/wrapper/DateTimePickerShowcase"
import DropDownMenuShowcase from "./components/showcase/wrapper/DropdownMenuShowcase"
import DynamicTableShowcase from "./components/showcase/wrapper/DynamicTableShowcase"
import EmptyStateShowcase from "./components/showcase/wrapper/EmptyStateShowcase"
import FlagShowcase from "./components/showcase/wrapper/FlagShowcase"
import FormShowcase from "./components/showcase/wrapper/FormShowcase"
import IconShowcase from "./components/showcase/wrapper/IconShowcase"
import InlineMessageShowcase from "./components/showcase/wrapper/InlineMessageShowcase"
import JoyrideShowcase from "./components/showcase/wrapper/JoyrideShowcase"
import LoadingSpinnerShowcase from "./components/showcase/wrapper/LoadingSpinnerShowcase"
import LozengeShowcase from "./components/showcase/wrapper/LozengeShowcase"
import TimeTableShowcase from "./components/showcase/wrapper/LPTimeTableShowcase"
import MenuShowcase from "./components/showcase/wrapper/MenuShowcase"
import ModalShowcase from "./components/showcase/wrapper/ModalShowcase"
import PaginationShowcase from "./components/showcase/wrapper/PaginationShowcase"
import PopupShowcase from "./components/showcase/wrapper/PopupShowcase"
import SelectShowcase from "./components/showcase/wrapper/SelectShowcase"
import TableTreeShowcase from "./components/showcase/wrapper/TableTreeShowcase"
import TabsShowcase from "./components/showcase/wrapper/TabsShowcase"
import TagShowcase from "./components/showcase/wrapper/TagShowcase"
import TextAreaShowcase from "./components/showcase/wrapper/TextAreaShowcase"
import TextFieldShowcase from "./components/showcase/wrapper/TextFieldShowcase"
import ToggleShowcase from "./components/showcase/wrapper/ToggleShowcase"
import TooltipShowcase from "./components/showcase/wrapper/TooltipShowcase"
import UtilsShowCase from "./components/showcase/wrapper/UtilsShowCase"

export default function useShowCases({
	overallSourceCode,
}: {
	overallSourceCode: string
}) {
	return useMemo(
		() => ({
			avatars: <AvatarShowcase overallSourceCode={overallSourceCode} />,
			awesomeslider: (
				<AwesomeSliderShowcase overallSourceCode={overallSourceCode} />
			),
			badge: <BadgeShowcase overallSourceCode={overallSourceCode} />,
			banner: <BannerShowcase overallSourceCode={overallSourceCode} />,
			bookcard: (
				<BookCardShowcase overallSourceCode={overallSourceCode} />
			),
			button: <ButtonShowcase overallSourceCode={overallSourceCode} />,
			calendar: (
				<CalendarShowcase overallSourceCode={overallSourceCode} />
			),
			checkbox: (
				<CheckboxShowcase overallSourceCode={overallSourceCode} />
			),
			codeblock: (
				<CodeBlockShowcase overallSourceCode={overallSourceCode} />
			),
			datetimepicker: (
				<DateTimePickerShowcase overallSourceCode={overallSourceCode} />
			),
			daterangepicker: (
				<DateRangePickerShowcase
					overallSourceCode={overallSourceCode}
				/>
			),
			dropdown: (
				<DropDownMenuShowcase overallSourceCode={overallSourceCode} />
			),
			emptystate: (
				<EmptyStateShowcase overallSourceCode={overallSourceCode} />
			),
			flag: <FlagShowcase overallSourceCode={overallSourceCode} />,
			form: <FormShowcase overallSourceCode={overallSourceCode} />,
			icon: <IconShowcase overallSourceCode={overallSourceCode} />,
			joyride: <JoyrideShowcase overallSourceCode={overallSourceCode} />,
			inlinemessage: (
				<InlineMessageShowcase overallSourceCode={overallSourceCode} />
			),
			loadingspinner: (
				<LoadingSpinnerShowcase overallSourceCode={overallSourceCode} />
			),
			menu2: <MenuShowcase overallSourceCode={overallSourceCode} />,
			pagelayout: (
				<PageLayoutShowcase overallSourceCode={overallSourceCode} />
			),

			lozenge: <LozengeShowcase overallSourceCode={overallSourceCode} />,
			modal: <ModalShowcase overallSourceCode={overallSourceCode} />,
			pagination: (
				<PaginationShowcase overallSourceCode={overallSourceCode} />
			),
			popup: <PopupShowcase overallSourceCode={overallSourceCode} />,
			select: <SelectShowcase overallSourceCode={overallSourceCode} />,
			tabs: <TabsShowcase overallSourceCode={overallSourceCode} />,
			tag: <TagShowcase overallSourceCode={overallSourceCode} />,
			dynamictable: (
				<DynamicTableShowcase overallSourceCode={overallSourceCode} />
			),
			tabletree: (
				<TableTreeShowcase overallSourceCode={overallSourceCode} />
			),
			textarea: (
				<TextAreaShowcase overallSourceCode={overallSourceCode} />
			),
			textfield: (
				<TextFieldShowcase overallSourceCode={overallSourceCode} />
			),
			timetable: (
				<TimeTableShowcase overallSourceCode={overallSourceCode} />
			),
			toggle: <ToggleShowcase overallSourceCode={overallSourceCode} />,
			tooltip: <TooltipShowcase overallSourceCode={overallSourceCode} />,
			utils: <UtilsShowCase overallSourceCode={overallSourceCode} />,
		}),
		[overallSourceCode],
	)
}
