import React from "react"
import ShowcaseWrapperItem, {
	ShowcaseProps,
} from "../../ShowCaseWrapperItem/ShowcaseWrapperItem"
import { SimpleTag as AKSimpleTag, default as AKTag } from "@atlaskit/tag"
import AKTagGroup from "@atlaskit/tag-group"
import { TagGroup, SimpleTag, Tag } from "@linked-planet/ui-kit-ts"

function TagShowcase(props: ShowcaseProps) {
	const akExample = (
		<>
			<AKTagGroup alignment="end">
				<AKTag
					onBeforeRemoveAction={() => {
						console.log("ON BEFORE REMOVE")
						return true
					}}
					onAfterRemoveAction={(str) =>
						console.log("ON AFTER REMOVE", str)
					}
					text="Removable Tag"
				/>
				<AKTag isRemovable={false} text="Not Removable Tag" />
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
			</AKTagGroup>
		</>
	)

	//#region tags
	const lpExample = (
		<div className="flex w-full items-center">
			<div>TEST</div>
			<Tag
				onBeforeRemoveAction={() => {
					console.log("ON BEFORE REMOVE")
					return false
				}}
				onAfterRemoveAction={(str) =>
					console.log("ON AFTER REMOVE", str)
				}
				text="Removable Tag"
			/>
			{/*<TagGroup>
				<Tag
					onBeforeRemoveAction={() => {
						console.log("ON BEFORE REMOVE")
						return false
					}}
					onAfterRemoveAction={(str) =>
						console.log("ON AFTER REMOVE", str)
					}
					text="Removable Tag"
				/>
				<Tag isRemovable={false} text="Not Removable Tag" />
				<SimpleTag text="Simple Tag" />
				<SimpleTag
					text="Colored simple Tag"
					textColor="var(--ds-text-accent-purple-bolder, #172B4D)"
					color="var(--ds-background-accent-purple-subtle, #998DD9)"
					looks="rounded"
				/>
				<SimpleTag
					text="Colored simple Tag"
					textColor="var(--ds-text-accent-purple-bolder, #172B4D)"
					color="var(--ds-background-accent-purple-subtle, #998DD9)"
				/>
				</TagGroup>*/}
			{/*<TagGroup>
				<SimpleTag text="Simple Tag" appearance="danger" />
				<SimpleTag text="Simple Tag" appearance="warning" />
				</TagGroup>*/}
		</div>
	)
	//#endregion tags

	const akColorTags = (
		<AKTagGroup>
			<AKTag color="blue" text="Blue" />
			<AKTag color="blueLight" text="blueLight" />
			<AKSimpleTag color="green" text="green" />
			<AKSimpleTag color="greenLight" text="greenLight" />
			<AKSimpleTag color="grey" text="grey" />
			<AKSimpleTag color="greyLight" text="greyLight" />
			<AKSimpleTag color="purple" text="purple" />
			<AKSimpleTag color="purpleLight" text="purpleLight" />
			<AKSimpleTag color="red" text="red" />
			<AKSimpleTag color="redLight" text="redLight" />
			<AKSimpleTag color="teal" text="teal" />
			<AKSimpleTag color="tealLight" text="tealLight" />
			<AKSimpleTag color="yellow" text="yellow" />
			<AKSimpleTag color="yellowLight" text="yellowLight" />
			<AKSimpleTag color="lime" text="lime" />
			<AKSimpleTag color="limeLight" text="limeLight" />
			<AKSimpleTag color="magenta" text="magenta" />
			<AKSimpleTag color="magentaLight" text="magentaLight" />
			<AKSimpleTag color="orange" text="orange" />
			<AKSimpleTag color="orangeLight" text="orangeLight" />
			<AKSimpleTag color="standard" text="standard" />
		</AKTagGroup>
	)

	//#region tagscolors
	const colorTags = (
		<TagGroup>
			<Tag appearance="blue" text="Blue" />
			<Tag appearance="blueLight" text="blueLight" />
			<SimpleTag appearance="green" text="green" />
			<SimpleTag appearance="greenLight" text="greenLight" />
			<SimpleTag appearance="gray" text="grey" />
			<SimpleTag appearance="grayLight" text="greyLight" />
			<SimpleTag appearance="purple" text="purple" />
			<SimpleTag appearance="purpleLight" text="purpleLight" />
			<SimpleTag appearance="red" text="red" />
			<SimpleTag appearance="redLight" text="redLight" />
			<SimpleTag appearance="teal" text="teal" />
			<SimpleTag appearance="tealLight" text="tealLight" />
			<SimpleTag appearance="yellow" text="yellow" />
			<SimpleTag appearance="yellowLight" text="yellowLight" />
			<SimpleTag appearance="lime" text="lime" />
			<SimpleTag appearance="limeLight" text="limeLight" />
			<SimpleTag appearance="pink" text="pink" />
			<SimpleTag appearance="pinkLight" text="pinkLight" />
			<SimpleTag appearance="orange" text="orange" />
			<SimpleTag appearance="orangeLight" text="orangeLight" />
			<SimpleTag appearance="indigo" text="indigo" />
			<SimpleTag appearance="indigoLight" text="indigoLight" />
			<SimpleTag appearance="cyan" text="cyan" />
			<SimpleTag appearance="cyanLight" text="cyanLight" />
			<SimpleTag appearance="violet" text="violet" />
			<SimpleTag appearance="violetLight" text="violetLight" />
			<SimpleTag appearance="amber" text="amber" />
			<SimpleTag appearance="amberLight" text="amberLight" />
			<SimpleTag appearance="emerald" text="emerald" />
			<SimpleTag appearance="emeraldLight" text="emeraldLight" />
			<SimpleTag appearance="fuchsia" text="fuchsia" />
			<SimpleTag appearance="fuchsiaLight" text="fuchsiaLight" />
			<SimpleTag appearance="sky" text="sky" />
			<SimpleTag appearance="skyLight" text="skyLight" />
		</TagGroup>
	)
	//#endregion

	const example = (
		<>
			{akExample}
			{lpExample}
		</>
	)

	const colors = (
		<div>
			<div>{akColorTags}</div>
			<hr className="border-border my-4" />
			<div>{colorTags}</div>
		</div>
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
				{
					title: "Colors",
					example: colors,
					sourceCodeExampleId: "tagscolors",
				},
			]}
		/>
	)
}

export default TagShowcase
