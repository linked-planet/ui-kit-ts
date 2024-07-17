import React, { useState } from "react"
import ShowcaseWrapperItem, {
	type ShowcaseProps,
} from "../../ShowCaseWrapperItem/ShowcaseWrapperItem"
import { BreadCrumps } from "@linked-planet/ui-kit-ts"
import AKBreadCrumps, {BreadcrumbsItem as AKBreadcrumbsItem} from "@atlaskit/breadcrumbs"

import AddCircleIcon from "@atlaskit/icon/glyph/add-circle"

function BannerShowcase(props: ShowcaseProps) {
	//#region bread-crumbs-example
	const example = (
		<div className="flex flex-col gap-4">
			<AKBreadCrumps>
				<AKBreadCrumps.Item
					href="#"
					iconBefore={<AddCircleIcon label="" />}
					iconAfter={<AddCircleIcon label="" />}
				>
					Home
				</BreadCrumps.Item>
				<BreadCrumps.Item href="#">Library</BreadCrumps.Item>
				<BreadCrumps.Item href="#">Components</BreadCrumps.Item>
				<BreadCrumps.Item href="#">Readme</BreadCrumps.Item>
				<BreadCrumps.Item href="#">Showcase</BreadCrumps.Item>
			</BreadCrumps>
			<hr />
			<BreadCrumps maxItems={2}>
				<BreadCrumps.Item
					href="#"
					iconBefore={<AddCircleIcon label="" />}
					iconAfter={<AddCircleIcon label="" />}
				>
					Home
				</BreadCrumps.Item>
				<BreadCrumps.Item href="#">Library</BreadCrumps.Item>
				<BreadCrumps.Item href="#">Components</BreadCrumps.Item>
				<BreadCrumps.Item href="#">Readme</BreadCrumps.Item>
				<BreadCrumps.Item href="#">Showcase</BreadCrumps.Item>
			</BreadCrumps>
		</div>
	)
	//#endregion bread-crumbs-example

	return (
		<ShowcaseWrapperItem
			name="Breadcrumbs"
			{...props}
			packages={[
				{
					name: "@linked-planet/ui-kit-ts",
					url: "single?component=BreadCrumbs",
				},
			]}
			examples={[
				{
					title: "Example",
					example: example,
					sourceCodeExampleId: "bread-crumbs-example",
				},
			]}
		/>
	)
}

export default BannerShowcase
