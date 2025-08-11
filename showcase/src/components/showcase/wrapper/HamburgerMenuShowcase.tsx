import { HamburgerMenu, SideNavigation } from "@linked-planet/ui-kit-ts"
import { ActivityIcon, Home, Info, Mail, Settings, User } from "lucide-react"
import { useState } from "react"
import ShowcaseWrapperItem, {
	type ShowcaseProps,
} from "../../ShowCaseWrapperItem/ShowcaseWrapperItem"

function HamburgerMenuShowcase(props: ShowcaseProps) {
	const [isOpen, setIsOpen] = useState(false)

	//#region basic
	const basicExample = (
		<div className="flex items-center justify-center p-4">
			<HamburgerMenu>
				<nav className="space-y-6">
					<div className="text-2xl font-bold text-gray-800 mb-8">
						Navigation Menu
					</div>
					<a
						href="/home"
						className="flex items-center space-x-3 text-lg text-gray-700 hover:text-blue-600 transition-colors"
					>
						<Home className="w-5 h-5" />
						<span>Home</span>
					</a>
					<a
						href="/profile"
						className="flex items-center space-x-3 text-lg text-gray-700 hover:text-blue-600 transition-colors"
					>
						<User className="w-5 h-5" />
						<span>Profile</span>
					</a>
					<a
						href="/settings"
						className="flex items-center space-x-3 text-lg text-gray-700 hover:text-blue-600 transition-colors"
					>
						<Settings className="w-5 h-5" />
						<span>Settings</span>
					</a>
					<a
						href="/about"
						className="flex items-center space-x-3 text-lg text-gray-700 hover:text-blue-600 transition-colors"
					>
						<Info className="w-5 h-5" />
						<span>About</span>
					</a>
					<a
						href="/contact"
						className="flex items-center space-x-3 text-lg text-gray-700 hover:text-blue-600 transition-colors"
					>
						<Mail className="w-5 h-5" />
						<span>Contact</span>
					</a>
				</nav>
			</HamburgerMenu>
		</div>
	)
	//#endregion basic

	//#region controlled
	const controlledExample = (
		<div className="flex items-center justify-center p-4 space-x-4">
			<HamburgerMenu defaultOpen={isOpen} onOpenChange={setIsOpen}>
				<div className="space-y-6">
					<div className="text-2xl font-bold text-gray-800 mb-8">
						Controlled Menu
					</div>
					<p className="text-gray-600">
						This menu is controlled externally. Current state:{" "}
						<span className="font-semibold">
							{isOpen ? "Open" : "Closed"}
						</span>
					</p>
					<nav className="space-y-4">
						<a
							href="/dashboard"
							className="block text-lg text-gray-700 hover:text-blue-600 transition-colors"
						>
							Dashboard
						</a>
						<a
							href="/projects"
							className="block text-lg text-gray-700 hover:text-blue-600 transition-colors"
						>
							Projects
						</a>
						<a
							href="/team"
							className="block text-lg text-gray-700 hover:text-blue-600 transition-colors"
						>
							Team
						</a>
						<a
							href="/analytics"
							className="block text-lg text-gray-700 hover:text-blue-600 transition-colors"
						>
							Analytics
						</a>
					</nav>
				</div>
			</HamburgerMenu>
			<button
				type="button"
				onClick={() => setIsOpen(!isOpen)}
				className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
			>
				{isOpen ? "Close Menu" : "Open Menu"}
			</button>
		</div>
	)
	//#endregion controlled

	//#region custom-styling
	const customStylingExample = (
		<div className="flex items-center justify-center p-4">
			<HamburgerMenu
				buttonClassName="bg-blue-600 text-white hover:bg-blue-700 rounded-lg"
				menuClassName="bg-gradient-to-br from-blue-900 to-purple-900"
			>
				<div className="space-y-6">
					<div className="text-2xl font-bold text-gray-800 mb-8 text-center">
						Custom Styled Menu
					</div>
					<div className="grid grid-cols-1 gap-4">
						<div className="bg-white p-4 rounded-lg shadow-md">
							<h3 className="font-semibold text-gray-800 mb-2">
								Quick Actions
							</h3>
							<div className="space-y-2">
								<button
									type="button"
									className="w-full text-left px-3 py-2 rounded hover:bg-gray-100 transition-colors"
								>
									Create New Project
								</button>
								<button
									type="button"
									className="w-full text-left px-3 py-2 rounded hover:bg-gray-100 transition-colors"
								>
									Import Data
								</button>
								<button
									type="button"
									className="w-full text-left px-3 py-2 rounded hover:bg-gray-100 transition-colors"
								>
									Export Report
								</button>
							</div>
						</div>
						<div className="bg-white p-4 rounded-lg shadow-md">
							<h3 className="font-semibold text-gray-800 mb-2">
								Recent Items
							</h3>
							<div className="space-y-2">
								<a
									href="/projects/alpha"
									className="block px-3 py-2 rounded hover:bg-gray-100 transition-colors"
								>
									Project Alpha
								</a>
								<a
									href="/projects/beta"
									className="block px-3 py-2 rounded hover:bg-gray-100 transition-colors"
								>
									Project Beta
								</a>
								<a
									href="/projects/gamma"
									className="block px-3 py-2 rounded hover:bg-gray-100 transition-colors"
								>
									Project Gamma
								</a>
							</div>
						</div>
					</div>
				</div>
			</HamburgerMenu>
		</div>
	)
	//#endregion custom-styling

	//#region accessibility
	const accessibilityExample = (
		<div className="flex items-center justify-center p-4">
			<HamburgerMenu closeOnOutsideClick={true} closeOnEscape={true}>
				<div className="space-y-6">
					<div className="text-2xl font-bold text-gray-800 mb-8">
						Accessible Menu
					</div>
					<div className="bg-blue-50 p-4 rounded-lg mb-6">
						<h3 className="font-semibold text-blue-800 mb-2">
							Accessibility Features:
						</h3>
						<ul className="text-blue-700 space-y-1 text-sm">
							<li>• Keyboard navigation (Tab, Escape)</li>
							<li>• Screen reader support</li>
							<li>• Focus management</li>
							<li>• ARIA labels and roles</li>
						</ul>
					</div>
					<nav className="space-y-4">
						<a
							href="/home"
							className="block text-lg text-gray-700 hover:text-blue-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded px-2 py-1"
						>
							Home
						</a>
						<a
							href="/about"
							className="block text-lg text-gray-700 hover:text-blue-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded px-2 py-1"
						>
							About
						</a>
						<a
							href="/services"
							className="block text-lg text-gray-700 hover:text-blue-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded px-2 py-1"
						>
							Services
						</a>
						<a
							href="/contact"
							className="block text-lg text-gray-700 hover:text-blue-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded px-2 py-1"
						>
							Contact
						</a>
					</nav>
				</div>
			</HamburgerMenu>
		</div>
	)
	//#endregion accessibility

	//#region sidenav-components
	const sidenavComponentExample = (
		<div className="flex items-center justify-center p-4">
			<HamburgerMenu closeOnOutsideClick={true} closeOnEscape={true}>
				<SideNavigation.Container
					className="max-w-sm"
					aria-label="Side navigation"
				>
					<SideNavigation.NavigationHeader>
						<span>test header</span>
					</SideNavigation.NavigationHeader>
					<SideNavigation.Content>
						<SideNavigation.NestableNavigationContent sideNavStoreIdent="side-nav-store-showcase">
							<SideNavigation.NestingItem
								title="test nesting"
								sideNavStoreIdent="side-nav-store-showcase"
								id="test-nesting"
							>
								<SideNavigation.ButtonItem>
									Test Nested Button
								</SideNavigation.ButtonItem>
								<SideNavigation.NestableNavigationContent>
									<SideNavigation.NestingItem
										title="inner nesting"
										sideNavStoreIdent="side-nav-store-showcase"
										id="inner-nesting"
									>
										<SideNavigation.ButtonItem>
											Inner Test Nested Button
										</SideNavigation.ButtonItem>
									</SideNavigation.NestingItem>
								</SideNavigation.NestableNavigationContent>
							</SideNavigation.NestingItem>
						</SideNavigation.NestableNavigationContent>

						<SideNavigation.ButtonItem
							description="This is a description which is also waaaaaaaaaaaaaaaaaaaaaay tooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooong"
							iconBefore={
								<ActivityIcon aria-label="Activity" size="12" />
							}
						>
							Button Item 1 with a tooooooooooooooooooooooo long
							title
						</SideNavigation.ButtonItem>
						<SideNavigation.ButtonItem>
							Button Item 1
						</SideNavigation.ButtonItem>
						<SideNavigation.ButtonItem
							selected
							description="This is a description"
							iconBefore={
								<ActivityIcon aria-label="Activity" size="16" />
							}
						>
							Selected Button Item
						</SideNavigation.ButtonItem>
						<SideNavigation.ButtonItem
							disabled
							description="This is a description"
							iconBefore={
								<ActivityIcon aria-label="Activity" size="16" />
							}
						>
							Disabled Button Item
						</SideNavigation.ButtonItem>

						<SideNavigation.Section
							title="Section"
							hasSeparator
							isList
						>
							<SideNavigation.ButtonItem description="This is a description">
								Button Item 1
							</SideNavigation.ButtonItem>
							<SideNavigation.GoBackItem description="This is a description">
								Go Back Item
							</SideNavigation.GoBackItem>
							<SideNavigation.LinkItem
								href="https://www.google.com"
								description={"test link description"}
							>
								Link Item
							</SideNavigation.LinkItem>
						</SideNavigation.Section>
						<SideNavigation.SkeletonItem />
						<SideNavigation.SkeletonItem shimmering={false} />
						<SideNavigation.SkeletonItem hasIconBefore shimmering />
						<SideNavigation.SkeletonItem
							hasAvatarBefore
							shimmering
						/>
					</SideNavigation.Content>
					<SideNavigation.NavigationFooter>
						<div>test footer</div>
					</SideNavigation.NavigationFooter>
				</SideNavigation.Container>
			</HamburgerMenu>
		</div>
	)
	//#endregion sidenav-components

	return (
		<ShowcaseWrapperItem
			name="Hamburger Menu"
			{...props}
			packages={[
				{
					name: "@linked-planet/ui-kit-ts",
					url: "https://github.com/linked-planet/ui-kit-ts",
				},
			]}
			examples={[
				{
					title: "Basic Navigation",
					example: basicExample,
					sourceCodeExampleId: "basic",
				},
				{
					title: "Controlled State",
					example: controlledExample,
					sourceCodeExampleId: "controlled",
				},
				{
					title: "Custom Styling",
					example: customStylingExample,
					sourceCodeExampleId: "custom-styling",
				},
				{
					title: "Accessibility Features",
					example: accessibilityExample,
					sourceCodeExampleId: "accessibility",
				},
				{
					title: "Side Navigation Components",
					example: sidenavComponentExample,
					sourceCodeExampleId: "sidenav-components",
				},
			]}
		/>
	)
}

export default HamburgerMenuShowcase
