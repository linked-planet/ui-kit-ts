import React, { useEffect, useState } from "react";
import AvatarShowcase from "../components/showcase/wrapper/AvatarShowcase";
import AwesomeSliderShowcase from "../components/showcase/wrapper/AwesomeSliderShowcase";
import BadgeShowcase from "../components/showcase/wrapper/BadgeShowcase";
import BannerShowcase from "../components/showcase/wrapper/BannerShowcase";
import ButtonShowcase from "../components/showcase/wrapper/ButtonShowcase";
import CalendarShowcase from "../components/showcase/wrapper/CalendarShowcase";
import CheckboxShowcase from "../components/showcase/wrapper/CheckboxShowcase";
import CodeBlockShowcase from "../components/showcase/wrapper/CodeBlockShowcase";
import DateTimePickerShowcase from "../components/showcase/wrapper/DateTimePickerShowcase";
import DateTimeRangePickerShowcase from "../components/showcase/wrapper/DateTimeRangePickerShowcase";
import DropDownMenuShowcase from "../components/showcase/wrapper/DropdownMenuShowcase";
import DynamicTableShowcase from "../components/showcase/wrapper/DynamicTableShowcase";
import EmptyStateShowcase from "../components/showcase/wrapper/EmptyStateShowcase";
import FlagShowcase from "../components/showcase/wrapper/FlagShowcase";
import FormShowcase from "../components/showcase/wrapper/FormShowcase";
import IconShowcase from "../components/showcase/wrapper/IconShowcase";
import JoyrideShowcase from "../components/showcase/wrapper/JoyrideShowcase";
import LozengeShowcase from "../components/showcase/wrapper/LozengeShowcase";
import MenuShowcase from "../components/showcase/wrapper/MenuShowcase";
import ModalShowcase from "../components/showcase/wrapper/ModalShowcase";
import PaginationShowcase from "../components/showcase/wrapper/PaginationShowcase";
import PanelShowcase from "../components/showcase/wrapper/PanelShowcase";
import PopupShowcase from "../components/showcase/wrapper/PopupShowcase";
import SelectShowcase from "../components/showcase/wrapper/SelectShowcase";
import TableTreeShowcase from "../components/showcase/wrapper/TableTreeShowcase";
import TabsShowcase from "../components/showcase/wrapper/TabsShowcase";
import TagShowcase from "../components/showcase/wrapper/TagShowcase";
import TextAreaShowcase from "../components/showcase/wrapper/TextAreaShowcase";
import TextFieldShowcase from "../components/showcase/wrapper/TextFieldShowcase";
import ToggleShowcase from "../components/showcase/wrapper/ToggleShowcase";
import TooltipShowcase from "../components/showcase/wrapper/TooltipShowcase";
import LPTimeTableShowCase from "../components/showcase/wrapper/LPTimeTableShowcase";
import { useDispatch } from "react-redux"

function WrappersPage () {

	const dispatch = useDispatch()
	const [ overallSourceCode, setOverallSourceCode ] = useState( "" )
	// retrieve source code

	useEffect( () => {
		fetch( "./showcase-sources.txt" )
			.then( ( response ) => response.text() )
			.then( ( sourceCode ) => {
				//console.info( "Loaded SourceCode:", sourceCode );
				setOverallSourceCode( sourceCode );
			} );
		dispatch( {
			type: "SET_MENU"
		} )
	}, [ dispatch ] )

	return (
		<div>
			<h1>Wrappers</h1>

			<AvatarShowcase overallSourceCode={ overallSourceCode } />

			<AwesomeSliderShowcase overallSourceCode={ overallSourceCode } />

			<BadgeShowcase overallSourceCode={ overallSourceCode } />

			<ButtonShowcase overallSourceCode={ overallSourceCode } />

			<BannerShowcase overallSourceCode={ overallSourceCode } />

			<CalendarShowcase overallSourceCode={ overallSourceCode } />

			<CheckboxShowcase overallSourceCode={ overallSourceCode } />

			<CodeBlockShowcase overallSourceCode={ overallSourceCode } />

			<DateTimePickerShowcase overallSourceCode={ overallSourceCode } />

			<DateTimeRangePickerShowcase overallSourceCode={ overallSourceCode } />

			<DropDownMenuShowcase overallSourceCode={ overallSourceCode } />

			<EmptyStateShowcase overallSourceCode={ overallSourceCode } />

			<FlagShowcase overallSourceCode={ overallSourceCode } />
			<FormShowcase overallSourceCode={ overallSourceCode } />
			<IconShowcase overallSourceCode={ overallSourceCode } />
			<JoyrideShowcase overallSourceCode={ overallSourceCode } />
			<LozengeShowcase overallSourceCode={ overallSourceCode } />
			<ModalShowcase overallSourceCode={ overallSourceCode } />
			<PaginationShowcase overallSourceCode={ overallSourceCode } />
			<PanelShowcase overallSourceCode={ overallSourceCode } />
			<PopupShowcase overallSourceCode={ overallSourceCode } />
			<SelectShowcase overallSourceCode={ overallSourceCode } />
			<TabsShowcase overallSourceCode={ overallSourceCode } />
			<TagShowcase overallSourceCode={ overallSourceCode } />
			<DynamicTableShowcase overallSourceCode={ overallSourceCode } />
			<TableTreeShowcase overallSourceCode={ overallSourceCode } />
			<TextAreaShowcase overallSourceCode={ overallSourceCode } />
			<TextFieldShowcase overallSourceCode={ overallSourceCode } />
			<ToggleShowcase overallSourceCode={ overallSourceCode } />
			<TooltipShowcase overallSourceCode={ overallSourceCode } />
			{/*<LPEditorShowcase overallSourceCode={overallSourceCode} />*/ }
			<MenuShowcase overallSourceCode={ overallSourceCode } />
			<LPTimeTableShowCase overallSourceCode={ overallSourceCode } />

		</div>
	)
}

export default WrappersPage;