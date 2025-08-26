/*import { SimpleTag as AKSimpleTag, default as AKTag } from "@atlaskit/tag"
import AKTagGroup from "@atlaskit/tag-group"*/
import { Tag, TagGroup } from "@linked-planet/ui-kit-ts"
import ShowcaseWrapperItem, {
	type ShowcaseProps,
} from "../../ShowCaseWrapperItem/ShowcaseWrapperItem"

function TagShowcase(props: ShowcaseProps) {
	const akExample = (
		<>
			{/*<AKTagGroup alignment="end">
				<AKTag
					onBeforeRemoveAction={() => {
						console.log("on before remove")
						return true
					}}
					onAfterRemoveAction={(str) =>
						console.log("on after remove", str)
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
			</AKTagGroup>*/}
		</>
	)

	//#region tags
	const lpExample = (
		<div className="flex w-full flex-wrap items-center">
			<TagGroup>
				<Tag
					onBeforeRemoveAction={() => {
						console.log("on before remove")
						return false
					}}
					onAfterRemoveAction={(str) =>
						console.log("on after remove", str)
					}
					removable
				>
					Removable Tag
				</Tag>
				<Tag removable={false}>Non-removal Tag</Tag>
				<Tag>Simple Tag</Tag>
				<Tag looks="rounded">Colored Simple Tag</Tag>
				<Tag>Colored Simple Tag</Tag>
			</TagGroup>
			<TagGroup>
				<Tag appearance="danger">Danger Simple Tag</Tag>
				<Tag appearance="warning">Warning Simple Tag</Tag>
				<Tag appearance="brand">Brand Simple Tag</Tag>
				<Tag appearance="success">Success Simple Tag</Tag>
				<Tag appearance="discovery" truncate>
					Discovery Simple Tag
				</Tag>
				<Tag appearance="information" truncate>
					Information Simple Tag
				</Tag>
				<Tag appearance="discovery" truncate removable>
					Discovery Simple Tag
				</Tag>
			</TagGroup>
		</div>
	)
	//#endregion tags

	const akColorTags = (
		<>
			{/*<AKTagGroup>
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
		</AKTagGroup>*/}
		</>
	)

	//#region tagscolors
	const colorTags = (
		<div className="flex w-full flex-col gap-2 overflow-hidden">
			<TagGroup wrap>
				<Tag appearance="blue">blue</Tag>
				<Tag appearance="green">green</Tag>
				<Tag appearance="gray">gray</Tag>
				<Tag appearance="purple">purple</Tag>
				<Tag appearance="red">red</Tag>
				<Tag appearance="teal">teal</Tag>
				<Tag appearance="yellow">yellow</Tag>
				<Tag appearance="lime">lime</Tag>
				<Tag appearance="pink">pink</Tag>
				<Tag appearance="orange">orange</Tag>
				<Tag appearance="indigo">indigo</Tag>
				<Tag appearance="cyan">cyan</Tag>
				<Tag appearance="violet">violet</Tag>
				<Tag appearance="amber">amber</Tag>
				<Tag appearance="emerald">emerald</Tag>
				<Tag appearance="fuchsia">fuchsia</Tag>
				<Tag appearance="sky">sky</Tag>
			</TagGroup>
			<TagGroup wrap>
				<Tag appearance="blueLight">blueLight</Tag>
				<Tag appearance="greenLight">greenLight</Tag>
				<Tag appearance="grayLight">greyLight</Tag>
				<Tag appearance="purpleLight">purpleLight</Tag>
				<Tag appearance="redLight">redLight</Tag>
				<Tag appearance="tealLight">tealLight</Tag>
				<Tag appearance="yellowLight">yellowLight</Tag>
				<Tag appearance="limeLight">limeLight</Tag>
				<Tag appearance="pinkLight">pinkLight</Tag>
				<Tag appearance="orangeLight">orangeLight</Tag>
				<Tag appearance="indigoLight">indigoLight</Tag>
				<Tag appearance="cyanLight">cyanLight</Tag>
				<Tag appearance="violetLight">violetLight</Tag>
				<Tag appearance="amberLight">amberLight</Tag>
				<Tag appearance="emeraldLight">emeraldLight</Tag>
				<Tag appearance="fuchsiaLight">fuchsiaLight</Tag>
				<Tag appearance="skyLight">skyLight</Tag>
			</TagGroup>
			<TagGroup wrap>
				<Tag appearance="blueBold">blueBold</Tag>
				<Tag appearance="greenBold">greenBold</Tag>
				<Tag appearance="grayBold">greyBold</Tag>
				<Tag appearance="purpleBold">purpleBold</Tag>
				<Tag appearance="redBold">redBold</Tag>
				<Tag appearance="tealBold">tealBold</Tag>
				<Tag appearance="yellowBold">yellowBold</Tag>
				<Tag appearance="limeBold">limeBold</Tag>
				<Tag appearance="pinkBold">pinkBold</Tag>
				<Tag appearance="orangeBold">orangeBold</Tag>
				<Tag appearance="indigoBold">indigoBold</Tag>
				<Tag appearance="cyanBold">cyanBold</Tag>
				<Tag appearance="violetBold">violetBold</Tag>
				<Tag appearance="amberBold">amberBold</Tag>
				<Tag appearance="emeraldBold">emeraldBold</Tag>
				<Tag appearance="fuchsiaBold">fuchsiaBold</Tag>
				<Tag appearance="skyBold">skyBold</Tag>
			</TagGroup>
			<TagGroup wrap>
				<Tag appearance="default">default</Tag>
				<Tag appearance="danger">danger</Tag>
				<Tag appearance="warning">warning</Tag>
				<Tag appearance="information">information</Tag>
				<Tag appearance="success">success</Tag>
				<Tag appearance="discovery">discovery</Tag>
				<Tag appearance="brand">brand</Tag>
			</TagGroup>
		</div>
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

	//#region tagsgroupaslist
	const tagsGroupAsList = (
		<TagGroup asElement="ul" className="list-none">
			<Tag asElement="li" appearance="blue">
				Blue Tag
			</Tag>
			<Tag asElement="li" appearance="green">
				Green Tag
			</Tag>
			<Tag asElement="li" appearance="red">
				Red Tag
			</Tag>
			<Tag asElement="li" appearance="yellow">
				Yellow Tag
			</Tag>
			<Tag asElement="li" appearance="purple">
				Purple Tag
			</Tag>
		</TagGroup>
	)
	//#endregion tagsgroupaslist

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
				{
					title: "Tags Group as List",
					example: tagsGroupAsList,
					sourceCodeExampleId: "tagsgroupaslist",
				},
			]}
		/>
	)
}

export default TagShowcase
