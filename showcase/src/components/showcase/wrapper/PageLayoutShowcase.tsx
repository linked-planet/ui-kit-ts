import React from "react"
import { Dropdown, PageLayout } from "@linked-planet/ui-kit-ts"
import ShowcaseWrapperItem, {
	ShowcaseProps,
} from "../../ShowCaseWrapperItem/ShowcaseWrapperItem"

import SettingsIcon from "@atlaskit/icon/glyph/settings"

function PageLayoutExample() {
	//#region pagelayout
	return (
		<div
			style={{
				height: "40vh",
			}}
		>
			<PageLayout.Page>
				<PageLayout.PageHeader>
					<PageLayout.PageHeaderTitle
						titleMenu={[
							<div key="0">Menu Item 1</div>,
							<div key="1">Menu Item 2</div>,
							<Dropdown.SubMenu
								key="sub"
								trigger="submenu"
								chevronSide="left"
							>
								<Dropdown.Item>Submenu Entry</Dropdown.Item>
							</Dropdown.SubMenu>,
							<Dropdown.ItemGroup key="4" hasSeparator>
								<Dropdown.ItemCheckbox>
									Check 1
								</Dropdown.ItemCheckbox>
								<Dropdown.ItemCheckbox>
									Check 2
								</Dropdown.ItemCheckbox>
							</Dropdown.ItemGroup>,
							<Dropdown.ItemRadioGroup key="5" hasSeparator>
								<Dropdown.ItemRadio value="r1">
									Radio 1
								</Dropdown.ItemRadio>
								<Dropdown.ItemRadio value="r2">
									Radio 2
								</Dropdown.ItemRadio>
							</Dropdown.ItemRadioGroup>,
						]}
					>
						<h1>Page Header Title</h1>
					</PageLayout.PageHeaderTitle>
					<PageLayout.PageHeaderSubTitle>
						<h2>Page Header Sub Title</h2>
					</PageLayout.PageHeaderSubTitle>
					<PageLayout.PageHeaderLine>
						<div>Page Header Line</div>
						<div>Page Header Line</div>
						<div>Page Header Line</div>
					</PageLayout.PageHeaderLine>
				</PageLayout.PageHeader>
				<PageLayout.PageBody>
					<PageLayout.PageBodyContent>
						<div>TEST</div>
						{Array(100)
							.fill(null)
							.map((_, i) => (
								<div key={i}>Page Body Content {i}</div>
							))}
					</PageLayout.PageBodyContent>
					<PageLayout.PageBodyFooter>
						Page Body Footer
					</PageLayout.PageBodyFooter>
				</PageLayout.PageBody>
			</PageLayout.Page>
		</div>
	)
	//#endregion pagelayout
}

function PageLayoutExampleWithBodyHeader() {
	//#region pagelayoutwithbodyheader
	return (
		<div
			style={{
				height: "40vh",
			}}
		>
			<PageLayout.Page>
				<PageLayout.PageHeader shadow={false}>
					<PageLayout.PageHeaderTitle
						titleMenuTrigger={
							<SettingsIcon label="" size="large" />
						}
						titleMenu={[
							<div key="0">Menu Item 1</div>,
							<div key="1">Menu Item 2</div>,
							<Dropdown.SubMenu
								key="sub"
								trigger="submenu"
								chevronSide="left"
							>
								<Dropdown.Item>Submenu Entry</Dropdown.Item>
							</Dropdown.SubMenu>,
							<Dropdown.ItemGroup key="4" hasSeparator>
								<Dropdown.ItemCheckbox>
									Check 1
								</Dropdown.ItemCheckbox>
								<Dropdown.ItemCheckbox>
									Check 2
								</Dropdown.ItemCheckbox>
							</Dropdown.ItemGroup>,
							<Dropdown.ItemRadioGroup key="5" hasSeparator>
								<Dropdown.ItemRadio value="r1">
									Radio 1
								</Dropdown.ItemRadio>
								<Dropdown.ItemRadio value="r2">
									Radio 2
								</Dropdown.ItemRadio>
							</Dropdown.ItemRadioGroup>,
						]}
					>
						<h1>Page Header Title</h1>
					</PageLayout.PageHeaderTitle>
					<PageLayout.PageHeaderSubTitle>
						<h2>Page Header Sub Title</h2>
					</PageLayout.PageHeaderSubTitle>
					<PageLayout.PageHeaderLine>
						<div>Page Header Line</div>
						<div>Page Header Line</div>
						<div>Page Header Line</div>
					</PageLayout.PageHeaderLine>
				</PageLayout.PageHeader>
				<PageLayout.PageBody>
					<PageLayout.PageBodyHeader>
						Body Header
					</PageLayout.PageBodyHeader>
					<PageLayout.PageBodyContent>
						Body Content
					</PageLayout.PageBodyContent>
					<PageLayout.PageBodyFooter>
						Page Body Footer
					</PageLayout.PageBodyFooter>
				</PageLayout.PageBody>
			</PageLayout.Page>
		</div>
	)
	//#endregion pagelayoutwithbodyheader
}

export default function PageLayoutShowcase(props: ShowcaseProps) {
	return (
		<ShowcaseWrapperItem
			name="PageLayout"
			{...props}
			packages={[
				{
					name: "@linked-planet/ui-kit-ts",
					url: "https://github.com/linked-planet/ui-kit-ts",
				},
			]}
			examples={[
				{
					title: "Page Layout",
					example: <PageLayoutExample />,
					sourceCodeExampleId: "pagelayout",
				},
				{
					title: "Page Layout With Body Header",
					example: <PageLayoutExampleWithBodyHeader />,
					sourceCodeExampleId: "pagelayoutwithbodyheader",
				},
			]}
		/>
	)
}
