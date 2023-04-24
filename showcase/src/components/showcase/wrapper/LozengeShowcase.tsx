import React from "react";
import ShowcaseWrapperItem, { ShowcaseProps } from "../../ShowCaseWrapperItem/ShowcaseWrapperItem";
import Lozenge from "@atlaskit/lozenge";

function LozengeShowcase ( props: ShowcaseProps ) {

	// region: lozenge
	const example1 = (
		<Lozenge>First lozenge</Lozenge>
	)
	const example2 = (
		<Lozenge appearance="new">Colored lozenge</Lozenge>
	)
	const example3 = (
		<Lozenge appearance="success" isBold>Colored bold lozenge</Lozenge>
	)
	const example4 = (
		<Lozenge appearance="success" isBold={ false }>Colored non-bold lozenge</Lozenge>
	)
	// endregion: lozenge

	return (
		<ShowcaseWrapperItem
			name="Lozenge"
			sourceCodeExampleId="lozenge"
			overallSourceCode={ props.overallSourceCode }
			packages={ [
				{
					name: "@atlaskit/lozenge",
					url: "https://atlassian.design/components/lozenge/examples"
				}
			] }

			examples={
				[
					( example1 ),
					( example2 ),
					( example3 ),
					( example4 ),
				]
			}
		/>
	)

}

export default LozengeShowcase;