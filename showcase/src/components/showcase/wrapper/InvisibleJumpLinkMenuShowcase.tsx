import { InvisibleJumpLinkMenu } from "@linked-planet/ui-kit-ts"
import { useState } from "react"
import ShowcaseWrapperItem, {
	type ShowcaseProps,
} from "../../ShowCaseWrapperItem/ShowcaseWrapperItem"

function InvisibleJumpLinkMenuShowcase(props: ShowcaseProps) {
	const [selectedSection, setSelectedSection] = useState<string>("")

	//#region invisible-jump-link-menu-basic-example
	const basicExample = (
		<div className="relative min-h-32 p-4 border rounded bg-surface">
			<InvisibleJumpLinkMenu
				visible={true}
				className="relative top-0 left-0 translate-y-0"
				jumpLinks={[
					{
						href: "#section1",
						label: "Introduction",
						ariaLabel: "Jump to Introduction section",
						onClick: () => setSelectedSection("Introduction"),
					},
					{
						href: "#section2",
						label: "Features",
						ariaLabel: "Jump to Features section",
						onClick: () => setSelectedSection("Features"),
					},
					{
						href: "#section3",
						label: "Documentation",
						ariaLabel: "Jump to Documentation section",
						onClick: () => setSelectedSection("Documentation"),
					},
					{
						href: "#section4",
						label: "Contact",
						ariaLabel: "Jump to Contact section",
						onClick: () => setSelectedSection("Contact"),
					},
				]}
			/>
			<div className="mt-4 p-4 bg-surface-overlay rounded border">
				<p className="text-sm text-text-subtle">
					{selectedSection
						? `Selected section: ${selectedSection}`
						: "Click on any jump link above to see the navigation in action."}
				</p>
			</div>
		</div>
	)
	//#endregion invisible-jump-link-menu-basic-example

	//#region invisible-jump-link-menu-styled-example
	const styledExample = (
		<div className="relative min-h-32 p-4 border rounded bg-surface">
			<InvisibleJumpLinkMenu
				visible={true}
				className="relative top-0 left-1/2 -translate-x-1/2 translate-y-0"
				jumpLinks={[
					{
						href: "#home",
						label: "Home",
						onClick: () => setSelectedSection("Home"),
					},
					{
						href: "#about",
						label: "About Us",
						onClick: () => setSelectedSection("About Us"),
					},
					{
						href: "#services",
						label: "Services",
						onClick: () => setSelectedSection("Services"),
					},
				]}
				ulClassName="bg-blue-50 border-blue-200"
				aClassName="text-blue-700 hover:bg-blue-100 hover:text-blue-800"
			/>
			<div className="mt-4 p-4 bg-surface-overlay rounded border">
				<p className="text-sm text-text-subtle">
					Custom styled jump link menu with centered positioning and
					blue theme.
				</p>
			</div>
		</div>
	)
	//#endregion invisible-jump-link-menu-styled-example

	//#region invisible-jump-link-menu-accessibility-example
	const accessibilityExample = (
		<div className="relative min-h-32 p-4 border rounded bg-surface">
			<InvisibleJumpLinkMenu
				visible={true}
				className="relative top-0 left-0 translate-y-0"
				id="accessibility-jump-menu"
				jumpLinks={[
					{
						href: "#main-content",
						label: "Skip to main content",
						ariaLabel:
							"Skip navigation and jump directly to main content",
						onClick: () => setSelectedSection("Main Content"),
					},
					{
						href: "#navigation",
						label: "Skip to navigation",
						ariaLabel: "Jump to main navigation menu",
						onClick: () => setSelectedSection("Navigation"),
					},
					{
						href: "#footer",
						label: "Skip to footer",
						ariaLabel:
							"Jump to page footer with links and information",
						onClick: () => setSelectedSection("Footer"),
					},
				]}
			/>
			<div className="mt-4 p-4 bg-surface-overlay rounded border">
				<p className="text-sm text-text-subtle">
					Accessibility-focused example with descriptive aria-labels
					and semantic jump targets.
					{selectedSection && (
						<span className="block mt-2 font-medium">
							Navigated to: {selectedSection}
						</span>
					)}
				</p>
			</div>
		</div>
	)
	//#endregion invisible-jump-link-menu-accessibility-example

	return (
		<ShowcaseWrapperItem
			name="Invisible Jump Link Menu"
			description="Invisible jump link menu that becomes visible when focused via keyboard navigation. 
			Provides quick navigation to main page sections for accessibility. States can be styled using data-[focused=true] and data-[focused=false]."
			{...props}
			packages={[
				{
					name: "@linked-planet/ui-kit-ts",
					url: "single?component=InvisibleJumpLinkMenu",
				},
			]}
			examples={[
				{
					title: "Basic Example",
					example: basicExample,
					sourceCodeExampleId:
						"invisible-jump-link-menu-basic-example",
				},
				{
					title: "Styled Example",
					example: styledExample,
					sourceCodeExampleId:
						"invisible-jump-link-menu-styled-example",
				},
				{
					title: "Accessibility Example",
					example: accessibilityExample,
					sourceCodeExampleId:
						"invisible-jump-link-menu-accessibility-example",
				},
			]}
		/>
	)
}

export default InvisibleJumpLinkMenuShowcase
