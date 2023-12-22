import React from "react"
import {
	Button,
	ButtonGroup,
	Dropdown,
	PageLayout,
} from "@linked-planet/ui-kit-ts"
import ShowcaseWrapperItem, {
	ShowcaseProps,
} from "../../ShowCaseWrapperItem/ShowcaseWrapperItem"

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
						Page Header Title
					</PageLayout.PageHeaderTitle>
					<PageLayout.PageHeaderSubTitle>
						Page Header Sub Title
					</PageLayout.PageHeaderSubTitle>
					<PageLayout.PageHeaderLine>
						<ButtonGroup>
							<Button>Button</Button>
							<Button>Button</Button>
							<Button>Button</Button>
							<Button>Button</Button>
						</ButtonGroup>
					</PageLayout.PageHeaderLine>
				</PageLayout.PageHeader>
				<PageLayout.PageBody>
					<PageLayout.PageBodyContent>
						<h1>Text H1</h1>
						<h2>Text H2</h2>
						<h3>Text H3</h3>
						<h4>Text H4</h4>
						<h5>Text H5</h5>
						<h6>Text H6</h6>
						<p>Text P (paragraph)</p>
						<span>Text SPAN</span>
						<pre>Text PRE</pre>
						<code>Text CODE</code>
						<hr />
						<div className="text-2xs">Text 2XS</div>
						<div className="text-xs">Text XS</div>
						<div className="text-sm">Text SM</div>
						<div className="text-md">Text MD</div>
						<div className="text-lg">Text LG</div>
						<div className="text-xl">Text XL</div>
						<div className="text-2xl">Text 2XL</div>
						<div className="text-3xl">Text 3XL</div>
						<div className="text-4xl">Text 4XL</div>
						<div className="text-5xl">Text 5XL</div>
						<div className="text-6xl">Text 6XL</div>
						<div className="text-7xl">Text 7XL</div>
						<div className="text-8xl">Text 8XL</div>
						<div className="text-9xl">Text 9XL</div>
						<hr />
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
					<PageLayout.PageHeaderTitle>
						Page Header Title
					</PageLayout.PageHeaderTitle>
					<PageLayout.PageHeaderSubTitle>
						Page Header Sub Title
					</PageLayout.PageHeaderSubTitle>
					<PageLayout.PageHeaderLine>
						<ButtonGroup>
							<Button>Button</Button>
							<Button>Button</Button>
							<Button>Button</Button>
							<Button>Button</Button>
						</ButtonGroup>
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

function PageLayouOnlyTitle() {
	//#region pagelayouttitleonly
	return (
		<div
			style={{
				height: "40vh",
			}}
		>
			<PageLayout.Page>
				<PageLayout.PageHeader>
					<PageLayout.PageHeaderTitle>
						Page Header Title
					</PageLayout.PageHeaderTitle>
				</PageLayout.PageHeader>
				<PageLayout.PageBody>
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
	//#endregion pagelayouttitleonly
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
					title: "Body Header",
					example: <PageLayoutExampleWithBodyHeader />,
					sourceCodeExampleId: "pagelayoutwithbodyheader",
				},
				{
					title: "Title Only",
					example: <PageLayouOnlyTitle />,
					sourceCodeExampleId: "pagelayouttitleonly",
				},
			]}
		/>
	)
}
