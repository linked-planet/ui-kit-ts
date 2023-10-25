import React from "react"
import ShowcaseWrapperItem, {
	ShowcaseProps,
} from "../../ShowCaseWrapperItem/ShowcaseWrapperItem"

import { IconSizeHelper } from "@linked-planet/ui-kit-ts"

import AddItemIcon from "@atlaskit/icon/glyph/add-item"

export default function IconSizeHelperShowcase(props: ShowcaseProps) {
	//#region iconsizehelper
	const example = (
		<>
			<IconSizeHelper size={67}>
				<AddItemIcon label="" />
			</IconSizeHelper>
			<IconSizeHelper
				size={"2.3rem"}
				className="text-brand bg-warning-bold"
				style={{
					borderRadius: "50%",
				}}
			>
				<AddItemIcon label="" />
			</IconSizeHelper>
		</>
	)
	//#endregion iconsizehelper

	return (
		<ShowcaseWrapperItem
			name="Icon Size Helper"
			{...props}
			packages={[
				{
					name: "@linked-planet/ui-kit-ts",
					url: "https://linked-planet.github.io/ui-kit-ts/single#IconSizeHelper",
				},
			]}
			examples={[
				{
					title: "Icon Size Helper",
					example: example,
					sourceCodeExampleId: "iconsizehelper",
				},
			]}
		/>
	)
}
