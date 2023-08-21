import React, { useEffect, useMemo, useState } from "react"
import AvatarShowcase from "../components/showcase/wrapper/AvatarShowcase"
import AwesomeSliderShowcase from "../components/showcase/wrapper/AwesomeSliderShowcase"
import BadgeShowcase from "../components/showcase/wrapper/BadgeShowcase"
import BannerShowcase from "../components/showcase/wrapper/BannerShowcase"
import ButtonShowcase from "../components/showcase/wrapper/ButtonShowcase"
import CalendarShowcase from "../components/showcase/wrapper/CalendarShowcase"
import CheckboxShowcase from "../components/showcase/wrapper/CheckboxShowcase"
import CodeBlockShowcase from "../components/showcase/wrapper/CodeBlockShowcase"
import DateTimePickerShowcase from "../components/showcase/wrapper/DateTimePickerShowcase"
import DateTimeRangePickerShowcase from "../components/showcase/wrapper/DateRangePickerShowcase"
import DropDownMenuShowcase from "../components/showcase/wrapper/DropdownMenuShowcase"
import DynamicTableShowcase from "../components/showcase/wrapper/DynamicTableShowcase"
import EmptyStateShowcase from "../components/showcase/wrapper/EmptyStateShowcase"
import FlagShowcase from "../components/showcase/wrapper/FlagShowcase"
import FormShowcase from "../components/showcase/wrapper/FormShowcase"
import IconShowcase from "../components/showcase/wrapper/IconShowcase"
import JoyrideShowcase from "../components/showcase/wrapper/JoyrideShowcase"
import LozengeShowcase from "../components/showcase/wrapper/LozengeShowcase"
import MenuShowcase from "../components/showcase/wrapper/MenuShowcase"
import ModalShowcase from "../components/showcase/wrapper/ModalShowcase"
import PaginationShowcase from "../components/showcase/wrapper/PaginationShowcase"
import PopupShowcase from "../components/showcase/wrapper/PopupShowcase"
import SelectShowcase from "../components/showcase/wrapper/SelectShowcase"
import TableTreeShowcase from "../components/showcase/wrapper/TableTreeShowcase"
import TabsShowcase from "../components/showcase/wrapper/TabsShowcase"
import TagShowcase from "../components/showcase/wrapper/TagShowcase"
import TextAreaShowcase from "../components/showcase/wrapper/TextAreaShowcase"
import TextFieldShowcase from "../components/showcase/wrapper/TextFieldShowcase"
import ToggleShowcase from "../components/showcase/wrapper/ToggleShowcase"
import TooltipShowcase from "../components/showcase/wrapper/TooltipShowcase"
import LPTimeTableShowCase from "../components/showcase/wrapper/LPTimeTableShowcase"
import PageLayoutShowcase from "../components/PageLayoutShowcase"
import { useDispatch } from "react-redux"
import LoadingSpinnerShowcase from "../components/showcase/wrapper/LoadingSpinnerShowcase"
import UtilsShowCase from "../components/showcase/wrapper/UtilsShowCase"
import InlineMessageShowcase from "../components/showcase/wrapper/InlineMessageShowcase"
import Select from "@atlaskit/select"

export function useShowCases({
	overallSourceCode,
}: {
	overallSourceCode: string
}) {
	return useMemo(
		() => [
			<AvatarShowcase
				key="Avatars"
				overallSourceCode={overallSourceCode}
			/>,

			<AwesomeSliderShowcase
				key="AwesomeSlider"
				overallSourceCode={overallSourceCode}
			/>,

			<BadgeShowcase key="Badge" overallSourceCode={overallSourceCode} />,

			<ButtonShowcase
				key="Button"
				overallSourceCode={overallSourceCode}
			/>,

			<BannerShowcase
				key="Banner"
				overallSourceCode={overallSourceCode}
			/>,

			<CalendarShowcase
				key="Calendar"
				overallSourceCode={overallSourceCode}
			/>,

			<CheckboxShowcase
				key="Checkbox"
				overallSourceCode={overallSourceCode}
			/>,

			<CodeBlockShowcase
				key="Codeblock"
				overallSourceCode={overallSourceCode}
			/>,

			<DateTimePickerShowcase
				key="DateTimePicker"
				overallSourceCode={overallSourceCode}
			/>,

			<DateTimeRangePickerShowcase
				key="DateTimeRangePicker"
				overallSourceCode={overallSourceCode}
			/>,

			<DropDownMenuShowcase
				key="DropDown"
				overallSourceCode={overallSourceCode}
			/>,

			<EmptyStateShowcase
				key="EmptyState"
				overallSourceCode={overallSourceCode}
			/>,

			<FlagShowcase key="Flag" overallSourceCode={overallSourceCode} />,
			<FormShowcase key="Form" overallSourceCode={overallSourceCode} />,
			<IconShowcase key="Icon" overallSourceCode={overallSourceCode} />,
			<InlineMessageShowcase
				key="InlineMessage"
				overallSourceCode={overallSourceCode}
			/>,
			<LoadingSpinnerShowcase
				key="LoadingSpinner"
				overallSourceCode={overallSourceCode}
			/>,
			<JoyrideShowcase
				key="JoyRide"
				overallSourceCode={overallSourceCode}
			/>,
			<LozengeShowcase
				key="Lozenge"
				overallSourceCode={overallSourceCode}
			/>,
			<ModalShowcase key="Modal" overallSourceCode={overallSourceCode} />,
			<PaginationShowcase
				key="Pagination"
				overallSourceCode={overallSourceCode}
			/>,
			<PopupShowcase key="Popup" overallSourceCode={overallSourceCode} />,
			<SelectShowcase
				key="Select"
				overallSourceCode={overallSourceCode}
			/>,
			<TabsShowcase key="Tabs" overallSourceCode={overallSourceCode} />,
			<TagShowcase key="Tag" overallSourceCode={overallSourceCode} />,
			<DynamicTableShowcase
				key="DynamicTable"
				overallSourceCode={overallSourceCode}
			/>,
			<TableTreeShowcase
				key="TableTree"
				overallSourceCode={overallSourceCode}
			/>,
			<TextAreaShowcase
				key="TextArea"
				overallSourceCode={overallSourceCode}
			/>,
			<TextFieldShowcase
				key="TextField"
				overallSourceCode={overallSourceCode}
			/>,
			<LPTimeTableShowCase
				key="TimeTable"
				overallSourceCode={overallSourceCode}
			/>,
			<ToggleShowcase
				key="Toggle"
				overallSourceCode={overallSourceCode}
			/>,
			<TooltipShowcase
				key="Tooltip"
				overallSourceCode={overallSourceCode}
			/>,
			<MenuShowcase key="Menu" overallSourceCode={overallSourceCode} />,
			<UtilsShowCase key="Utils" overallSourceCode={overallSourceCode} />,
			<PageLayoutShowcase
				key="PageLayout"
				overallSourceCode={overallSourceCode}
			/>,
			//<LPEditorShowcase key="editorsc" overallSourceCode={overallSourceCode} />,
		],
		[overallSourceCode],
	)
}

export default function SinglePage() {
	const dispatch = useDispatch()
	const [overallSourceCode, setOverallSourceCode] = useState("")
	const [sc, setSC] = useState<React.ReactNode>(undefined)
	// retrieve source code

	useEffect(() => {
		fetch("./showcase-sources.txt")
			.then((response) => response.text())
			.then((sourceCode) => {
				//console.info( "Loaded SourceCode:", sourceCode );
				setOverallSourceCode(sourceCode)
			})
		dispatch({
			type: "SET_MENU",
		})
	}, [dispatch])

	const scs = useShowCases({ overallSourceCode })

	const options = useMemo(
		() =>
			scs.map((it) => ({
				label: it.key as string,
				value: it,
			})),
		[scs],
	)

	return (
		<>
			<Select
				options={options}
				onChange={(e) => {
					if (e?.value) {
						setSC(e.value)
					}
				}}
				defaultOptions={[options[0]]}
			/>
			{sc}
		</>
	)
}
