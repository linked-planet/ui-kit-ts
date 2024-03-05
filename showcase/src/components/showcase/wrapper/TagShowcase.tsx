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
			<Tag
				onBeforeRemoveAction={() => {
					console.log("ON BEFORE REMOVE")
					return false
				}}
				onAfterRemoveAction={(str) =>
					console.log("ON AFTER REMOVE", str)
				}
			>
				Removable Tag
			</Tag>
			<TagGroup>
				<Tag
					onBeforeRemoveAction={() => {
						console.log("ON BEFORE REMOVE")
						return false
					}}
					onAfterRemoveAction={(str) =>
						console.log("ON AFTER REMOVE", str)
					}
				>
					Removable Tag
				</Tag>
				<Tag isRemovable={false}>Non-removal Tag</Tag>
				<SimpleTag>Simple Tag</SimpleTag>
				<SimpleTag looks="rounded">Colored Simple Tag</SimpleTag>
				<SimpleTag>Colored Simple Tag</SimpleTag>
			</TagGroup>
			<TagGroup>
				<SimpleTag appearance="danger">Danger Simple Tag</SimpleTag>
				<SimpleTag appearance="warning">Warning Simple Tag</SimpleTag>
				<SimpleTag appearance="brand">Brand Simple Tag</SimpleTag>
				<SimpleTag appearance="success">Success Simple Tag</SimpleTag>
				<SimpleTag appearance="discovery">
					Discovery Simple Tag
				</SimpleTag>
				<SimpleTag appearance="information">
					Information Simple Tag
				</SimpleTag>
				<SimpleTag appearance="discovery">
					Discovery Simple Tag
				</SimpleTag>
			</TagGroup>
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
		<>
			<TagGroup>
				<Tag appearance="blue">blue</Tag>
				<SimpleTag appearance="green">green</SimpleTag>
				<SimpleTag appearance="gray">gray</SimpleTag>
				<SimpleTag appearance="purple">purple</SimpleTag>
				<SimpleTag appearance="red">red</SimpleTag>
				<SimpleTag appearance="teal">teal</SimpleTag>
				<SimpleTag appearance="yellow">yellow</SimpleTag>
				<SimpleTag appearance="lime">lime</SimpleTag>
				<SimpleTag appearance="pink">pink</SimpleTag>
				<SimpleTag appearance="orange">orange</SimpleTag>
				<SimpleTag appearance="indigo">indigo</SimpleTag>
				<SimpleTag appearance="cyan">cyan</SimpleTag>
				<SimpleTag appearance="violet">violet</SimpleTag>
				<SimpleTag appearance="amber">amber</SimpleTag>
				<SimpleTag appearance="emerald">emerald</SimpleTag>
				<SimpleTag appearance="fuchsia">fuchsia</SimpleTag>
				<SimpleTag appearance="sky">sky</SimpleTag>
			</TagGroup>
			<TagGroup>
				<Tag appearance="blueLight">blueLight</Tag>
				<SimpleTag appearance="greenLight">greenLight</SimpleTag>
				<SimpleTag appearance="grayLight">greyLight</SimpleTag>
				<SimpleTag appearance="purpleLight">purpleLight</SimpleTag>
				<SimpleTag appearance="redLight">redLight</SimpleTag>
				<SimpleTag appearance="tealLight">tealLight</SimpleTag>
				<SimpleTag appearance="yellowLight">yellowLight</SimpleTag>
				<SimpleTag appearance="limeLight">limeLight</SimpleTag>
				<SimpleTag appearance="pinkLight">pinkLight</SimpleTag>
				<SimpleTag appearance="orangeLight">orangeLight</SimpleTag>
				<SimpleTag appearance="indigoLight">indigoLight</SimpleTag>
				<SimpleTag appearance="cyanLight">cyanLight</SimpleTag>
				<SimpleTag appearance="violetLight">violetLight</SimpleTag>
				<SimpleTag appearance="amberLight">amberLight</SimpleTag>
				<SimpleTag appearance="emeraldLight">emeraldLight</SimpleTag>
				<SimpleTag appearance="fuchsiaLight">fuchsiaLight</SimpleTag>
				<SimpleTag appearance="skyLight">skyLight</SimpleTag>
			</TagGroup>
			<TagGroup>
				<Tag appearance="blueBold">blueBold</Tag>
				<SimpleTag appearance="greenBold">greenBold</SimpleTag>
				<SimpleTag appearance="grayBold">greyBold</SimpleTag>
				<SimpleTag appearance="purpleBold">purpleBold</SimpleTag>
				<SimpleTag appearance="redBold">redBold</SimpleTag>
				<SimpleTag appearance="tealBold">tealBold</SimpleTag>
				<SimpleTag appearance="yellowBold">yellowBold</SimpleTag>
				<SimpleTag appearance="limeBold">limeBold</SimpleTag>
				<SimpleTag appearance="pinkBold">pinkBold</SimpleTag>
				<SimpleTag appearance="orangeBold">orangeBold</SimpleTag>
				<SimpleTag appearance="indigoBold">indigoBold</SimpleTag>
				<SimpleTag appearance="cyanBold">cyanBold</SimpleTag>
				<SimpleTag appearance="violetBold">violetBold</SimpleTag>
				<SimpleTag appearance="amberBold">amberBold</SimpleTag>
				<SimpleTag appearance="emeraldBold">emeraldBold</SimpleTag>
				<SimpleTag appearance="fuchsiaBold">fuchsiaBold</SimpleTag>
				<SimpleTag appearance="skyBold">skyBold</SimpleTag>
			</TagGroup>
			<TagGroup>
				<Tag appearance="default">default</Tag>
				<Tag appearance="danger">danger</Tag>
				<Tag appearance="warning">warning</Tag>
				<Tag appearance="information">information</Tag>
				<Tag appearance="success">success</Tag>
				<Tag appearance="discovery">discovery</Tag>
				<Tag appearance="brand">brand</Tag>
			</TagGroup>
		</>
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
