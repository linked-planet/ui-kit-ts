import React from "react"
import ShowcaseWrapperItem, {
	ShowcaseProps,
} from "../../ShowCaseWrapperItem/ShowcaseWrapperItem"
import { SimpleTag } from "@atlaskit/tag"
import TagGroup from "@atlaskit/tag-group"

function TagShowcase(props: ShowcaseProps) {
	//#region tags
	const example = (
		<TagGroup>
			<SimpleTag text="Simple Tag" />
			<SimpleTag text="Colored simple Tag" color="purple" />
		</TagGroup>
	)
	//#endregion tags

	return (
		<ShowcaseWrapperItem
			name="Tag & Tag-Group"
			{...props}
			packages={[
				{
					name: "@atlaskit/tag",
					url: "https://atlassian.design/components/tag/examples",
				},
				{
					name: "@atlaskit/tag-group",
					url: "https://atlassian.design/components/tag-group/examples",
				},
			]}
			examples={[
				{ title: "Example", example, sourceCodeExampleId: "tags" },
			]}
		/>
	)
}

export default TagShowcase
