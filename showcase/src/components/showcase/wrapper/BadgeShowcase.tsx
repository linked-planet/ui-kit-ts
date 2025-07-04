//import AKBadge from "@atlaskit/badge"
import { Badge } from "@linked-planet/ui-kit-ts"

import ShowcaseWrapperItem, {
	type ShowcaseProps,
} from "../../ShowCaseWrapperItem/ShowcaseWrapperItem"

function BadgeShowcase(props: ShowcaseProps) {
	const akExample = (
		<>
			{/*<div
				style={{
					display: "flex",
					gap: "1rem",
				}}
			>
				<AKBadge></AKBadge>
				<AKBadge appearance="added" />
				<AKBadge appearance="important" />
				<AKBadge appearance="removed" />
				<AKBadge appearance="primary" />
				<AKBadge appearance="primaryInverted">test</AKBadge>
			</div>*/}
		</>
	)

	//#region badge
	const lpExample = (
		<div
			style={{
				display: "flex",
				gap: "1rem",
			}}
		>
			<Badge>0</Badge>
			<Badge appearance="added">1</Badge>
			<Badge appearance="important">2</Badge>
			<Badge appearance="removed">3</Badge>
			<Badge appearance="primary">4</Badge>
			<Badge appearance="primaryInverted">test</Badge>
		</div>
	)
	//#endregion badge

	const example = (
		<div>
			{akExample}
			{lpExample}
		</div>
	)

	return (
		<ShowcaseWrapperItem
			name="Badge"
			{...props}
			packages={[
				{
					name: "@linked-planet/ui-kit-ts",
					url: "http://linked-planet.github.io/ui-kit-ts/single?component=Badge",
				},
			]}
			examples={[
				{
					title: "Example 1",
					example: example,
					sourceCodeExampleId: "badge",
				},
			]}
		/>
	)
}

export default BadgeShowcase
