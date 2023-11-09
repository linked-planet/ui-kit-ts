import React from "react"
import ShowcaseWrapperItem, {
	ShowcaseProps,
} from "../../ShowCaseWrapperItem/ShowcaseWrapperItem"
//import { SimpleTag as AKSimpleTag } from "@atlaskit/tag"
//import AKTagGroup from "@atlaskit/tag-group"
import { TagGroup, SimpleTag } from "@linked-planet/ui-kit-ts"

function TagShowcase(props: ShowcaseProps) {
	const akExample = (
		<>
			{/*<AKTagGroup alignment="end">
				<AKSimpleTag text="Simple Tag" appearance="default" />
				<AKSimpleTag
					text="Colored simple Tag"
					color="purple"
					appearance="rounded"
				/>
				<AKSimpleTag
					text="Colored simple Tag"
					color="purple"
					appearance="default"
				/>
			</AKTagGroup>
			<AKTagGroup>
				<AKSimpleTag text="Simple Tag" color="blue" />
	</AKTagGroup>*/}
		</>
	)

	//#region tags
	const lpExample = (
		<>
			<TagGroup alignment="end">
				<SimpleTag text="Simple Tag" />
				<SimpleTag
					text="Colored simple Tag"
					textColor="var(--ds-text-accent-purple-bolder, #172B4D)"
					color="var(--ds-background-accent-purple-subtle, #998DD9)"
					appearance="rounded"
				/>
				<SimpleTag
					text="Colored simple Tag"
					textColor="var(--ds-text-accent-purple-bolder, #172B4D)"
					color="var(--ds-background-accent-purple-subtle, #998DD9)"
				/>
			</TagGroup>
			<TagGroup>
				<SimpleTag text="Simple Tag" color="blue" textColor="white" />
			</TagGroup>
		</>
	)
	//#endregion tags

	const example = (
		<>
			{akExample}
			{lpExample}
		</>
	)

	return (
		<ShowcaseWrapperItem
			name="Tag & Tag-Group"
			{...props}
			packages={[
				{
					name: "@linked-planet/ui-kit-ts",
					url: "http://linked-planet.github.io/ui-kit-ts/single?component=Tag",
				},
			]}
			examples={[
				{ title: "Example", example, sourceCodeExampleId: "tags" },
			]}
		/>
	)
}

export default TagShowcase
