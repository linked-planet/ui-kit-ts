import { useMemo } from "react"
import AccordionShowcase from "./components/showcase/wrapper/AccordionShowcase"
import AnimatedListShowcase from "./components/showcase/wrapper/AnimatedListShowcase"
import AvatarShowcase from "./components/showcase/wrapper/AvatarShowcase"
import AwesomeSliderShowcase from "./components/showcase/wrapper/AwesomeSliderShowcase"
import BadgeShowcase from "./components/showcase/wrapper/BadgeShowcase"
import BannerShowcase from "./components/showcase/wrapper/BannerShowcase"
import BookCardShowcase from "./components/showcase/wrapper/BookCardShowcase"
import ButtonShowcase from "./components/showcase/wrapper/ButtonShowcase"
import Calendar2Showcase from "./components/showcase/wrapper/Calendar2Showcase"
import CheckboxShowcase from "./components/showcase/wrapper/CheckboxShowcase"
import CodeBlockShowcase from "./components/showcase/wrapper/CodeBlockShowcase"
import CollapsibleShowcase from "./components/showcase/wrapper/CollapsibleShowcase"
import ColorsShowcase from "./components/showcase/wrapper/ColorsShowcase"
import DateTimePickerShowcase from "./components/showcase/wrapper/DateTimePickerShowcase"
import DropDownMenuShowcase from "./components/showcase/wrapper/DropdownMenuShowcase"
import DataTableShowcase from "./components/showcase/wrapper/DataTableShowcase"
import EmptyStateShowcase from "./components/showcase/wrapper/EmptyStateShowcase"
import FiltersShowcase from "./components/showcase/wrapper/FiltersShowcase"
import FlagShowcase from "./components/showcase/wrapper/FlagShowcase"
import IconShowcase from "./components/showcase/wrapper/IconShowcase"
import IconSizeHelperShowcase from "./components/showcase/wrapper/IconSizeHelperShowcase"
import InlineMessageShowcase from "./components/showcase/wrapper/InlineMessageShowcase"
import InputShowcase from "./components/showcase/wrapper/InputShowcase"
import JoyrideShowcase from "./components/showcase/wrapper/JoyrideShowcase"
import TimeTableShowcase from "./components/showcase/wrapper/TimeTableShowcase"
import LayeringShowcase from "./components/showcase/wrapper/LayeringShowcase"
import LoadingSpinnerShowcase from "./components/showcase/wrapper/LoadingSpinnerShowcase"
import LozengeShowcase from "./components/showcase/wrapper/LozengeShowcase"
import MenuShowcase from "./components/showcase/wrapper/MenuShowcase"
import ModalShowcase from "./components/showcase/wrapper/ModalShowcase"
import PageLayoutShowcase from "./components/showcase/wrapper/PageLayoutShowcase"
import PaginationShowcase from "./components/showcase/wrapper/PaginationShowcase"
import PopoverShowcase from "./components/showcase/wrapper/PopoverShowcase"
import SelectShowcase from "./components/showcase/wrapper/SelectShowcase"
import { SidebarShowcase } from "./components/showcase/wrapper/SidebarShowcase"
import TableTreeShowcase from "./components/showcase/wrapper/TableTreeShowcase"
import TabsShowcase from "./components/showcase/wrapper/TabsShowcase"
import TagShowcase from "./components/showcase/wrapper/TagShowcase"
import TextAreaShowcase from "./components/showcase/wrapper/TextAreaShowcase"
import TextFieldShowcase from "./components/showcase/wrapper/TextFieldShowcase"
import ToastFlagShowcase from "./components/showcase/wrapper/ToastFlagShowcase"
import ToggleShowcase from "./components/showcase/wrapper/ToggleShowcase"
import TooltipShowcase from "./components/showcase/wrapper/TooltipShowcase"
import TruncatedTextShowcase from "./components/showcase/wrapper/TruncatedTextShowcase"
import UtilsShowcase from "./components/showcase/wrapper/UtilsShowcase"
import AppLayoutShowcase from "./components/showcase/wrapper/AppLayoutShowcase"
import SideNavigationShowcase from "./components/showcase/wrapper/SideNavigationShowcase"
import BlanketShowcase from "./components/showcase/wrapper/BlanketShowcase"
import BreadcrumbsShowcase from "./components/showcase/wrapper/BreadcrumbsShowcase"
import SectionMessageShowcase from "./components/showcase/wrapper/SectionMessageShowcase"
import DragAndDropShowcase from "./components/showcase/wrapper/DragAndDropShowcase"
import TourShowcase from "./components/showcase/wrapper/TourShowcase";
import FormShowcase from "./components/showcase/wrapper/FormShowcase";
export default function useShowcases({
	overallSourceCode,
}: {
	overallSourceCode: string
}) {
	return useMemo(
		() => ({
			Accordion: (
				<AccordionShowcase overallSourceCode={overallSourceCode} />
			),
			"Animated List": (
				<AnimatedListShowcase overallSourceCode={overallSourceCode} />
			),
			"App Layout": (
				<AppLayoutShowcase overallSourceCode={overallSourceCode} />
			),
			Avatars: <AvatarShowcase overallSourceCode={overallSourceCode} />,
			"Awesome Slider": (
				<AwesomeSliderShowcase overallSourceCode={overallSourceCode} />
			),
			Badge: <BadgeShowcase overallSourceCode={overallSourceCode} />,
			Banner: <BannerShowcase overallSourceCode={overallSourceCode} />,
			"Book Card": (
				<BookCardShowcase overallSourceCode={overallSourceCode} />
			),
			Blanket: <BlanketShowcase overallSourceCode={overallSourceCode} />,
			Breadcrumbs: (
				<BreadcrumbsShowcase overallSourceCode={overallSourceCode} />
			),
			Button: <ButtonShowcase overallSourceCode={overallSourceCode} />,
			Calendar: (
				<Calendar2Showcase overallSourceCode={overallSourceCode} />
			),
			Checkbox: (
				<CheckboxShowcase overallSourceCode={overallSourceCode} />
			),
			"Code Block": (
				<CodeBlockShowcase overallSourceCode={overallSourceCode} />
			),
			Collapsible: (
				<CollapsibleShowcase overallSourceCode={overallSourceCode} />
			),
			Colors: <ColorsShowcase overallSourceCode={overallSourceCode} />,
			"Date Time Picker": (
				<DateTimePickerShowcase overallSourceCode={overallSourceCode} />
			),
			"Data Table": (
				<DataTableShowcase overallSourceCode={overallSourceCode} />
			),
			"Drag and Drop": (
				<DragAndDropShowcase overallSourceCode={overallSourceCode} />
			),
			Dropdown: (
				<DropDownMenuShowcase overallSourceCode={overallSourceCode} />
			),
			"Empty State": (
				<EmptyStateShowcase overallSourceCode={overallSourceCode} />
			),
			Flag: <FlagShowcase overallSourceCode={overallSourceCode} />,
			Filters: <FiltersShowcase overallSourceCode={overallSourceCode} />,
			Form: <FormShowcase overallSourceCode={overallSourceCode} />,
			Icon: <IconShowcase overallSourceCode={overallSourceCode} />,
			"Icon Size Helper": (
				<IconSizeHelperShowcase overallSourceCode={overallSourceCode} />
			),
			Input: <InputShowcase overallSourceCode={overallSourceCode} />,
			Joyride: <JoyrideShowcase overallSourceCode={overallSourceCode} />,
			"Inline Message": (
				<InlineMessageShowcase overallSourceCode={overallSourceCode} />
			),

			Menu: <MenuShowcase overallSourceCode={overallSourceCode} />,

			Layering: (
				<LayeringShowcase overallSourceCode={overallSourceCode} />
			),

			"Loading Spinner": (
				<LoadingSpinnerShowcase overallSourceCode={overallSourceCode} />
			),

			Lozenge: <LozengeShowcase overallSourceCode={overallSourceCode} />,
			Modal: <ModalShowcase overallSourceCode={overallSourceCode} />,
			"Page Layout": (
				<PageLayoutShowcase overallSourceCode={overallSourceCode} />
			),
			Pagination: (
				<PaginationShowcase overallSourceCode={overallSourceCode} />
			),
			Popover: <PopoverShowcase overallSourceCode={overallSourceCode} />,
			"Section Message": (
				<SectionMessageShowcase overallSourceCode={overallSourceCode} />
			),
			Select: <SelectShowcase overallSourceCode={overallSourceCode} />,
			Sidebar: <SidebarShowcase overallSourceCode={overallSourceCode} />,
			"Side Navigation": (
				<SideNavigationShowcase overallSourceCode={overallSourceCode} />
			),
			Tabs: <TabsShowcase overallSourceCode={overallSourceCode} />,
			Tag: <TagShowcase overallSourceCode={overallSourceCode} />,
			"Table Tree": (
				<TableTreeShowcase overallSourceCode={overallSourceCode} />
			),
			"Text Area": (
				<TextAreaShowcase overallSourceCode={overallSourceCode} />
			),
			"Text Field": (
				<TextFieldShowcase overallSourceCode={overallSourceCode} />
			),
			Timetable: (
				<TimeTableShowcase overallSourceCode={overallSourceCode} />
			),
			"Toast Flag": (
				<ToastFlagShowcase overallSourceCode={overallSourceCode} />
			),
			Toggle: <ToggleShowcase overallSourceCode={overallSourceCode} />,
			Tooltip: <TooltipShowcase overallSourceCode={overallSourceCode} />,
			"Truncated Text": (
				<TruncatedTextShowcase overallSourceCode={overallSourceCode} />
			),
			Tour: <TourShowcase overallSourceCode={overallSourceCode} />,
			Utils: <UtilsShowcase overallSourceCode={overallSourceCode} />,
		}),
		[overallSourceCode],
	)
}
