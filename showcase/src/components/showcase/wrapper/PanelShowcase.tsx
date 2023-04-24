import React, { useState } from "react";
import ShowcaseWrapperItem, { ShowcaseProps } from "../../ShowCaseWrapperItem/ShowcaseWrapperItem";
import { PanelStateless } from "@atlaskit/panel"
import { IntlProvider } from "react-intl-next";

function PanelShowcase ( props: ShowcaseProps ) {

	// region: panel
	const [ isPanelActive, setIsPanelActive ] = useState( false )
	const example = (
		<div style={ { minWidth: 300, paddingLeft: 24 } }>
			<IntlProvider locale="en">
				<PanelStateless
					isExpanded={ isPanelActive }
					onChange={ () => setIsPanelActive( !isPanelActive ) }
					header={ <span>Panel</span> }>
					<span>Panel content...</span>
				</PanelStateless>
			</IntlProvider>
		</div>
	)
	// endregion: panel

	return (
		<ShowcaseWrapperItem
			name="Panel"
			sourceCodeExampleId="panel"
			overallSourceCode={ props.overallSourceCode }
			packages={ [
				{
					name: "@atlaskit/panel",
					url: "https://atlaskit.atlassian.com/packages/bitbucket/panel"
				}
			] }

			examples={
				[
					( example )
				]
			}
		/>
	)

}

export default PanelShowcase;