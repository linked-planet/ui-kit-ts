import React from "react"
import ShowcaseWrapperItem, {
	type ShowcaseProps,
} from "../../ShowCaseWrapperItem/ShowcaseWrapperItem"
import { IconSizeHelper, SideNavigation } from "@linked-planet/ui-kit-ts"
import {
	SideNavigation as AKSideNavigation,
	NavigationHeader as AKNavigationHeader,
	NavigationContent as AKNavigationContent,
	NavigationFooter as AKNavigationFooter,
	ButtonItem as AKButtonItem,
	GoBackItem as AKGoBackItem,
	Section as AKSection,
	LinkItem as AKLinkItem,
	SkeletonItem as AKSkeletonItem,
	Header as AKHeader,
	NestingItem as AKNestingItem,
	NestableNavigationContent as AKNestableNavigationContent,
} from "@atlaskit/side-navigation"

import ActivityIcon from "@atlaskit/icon/glyph/activity"

//#region side-nav-example
function SideNavExample() {
	return (
		<div className="flex gap-8">
			<div className="h-[350px]">
				<SideNavigation.Container
					className="max-w-sm"
					aria-label="Side navigation"
				>
					<SideNavigation.Header>
						<span>test header</span>
					</SideNavigation.Header>
					<SideNavigation.Content storeIdent="side-nav-store-showcase">
						<SideNavigation.NestableNavigationContent>
							<SideNavigation.NestingItem title="test nesting">
								<SideNavigation.ButtonItem>
									Test Nested Button
								</SideNavigation.ButtonItem>
								<SideNavigation.NestableNavigationContent>
									<SideNavigation.NestingItem title="inner nesting">
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
								<IconSizeHelper>
									<ActivityIcon
										label="Activity"
										size="large"
									/>
								</IconSizeHelper>
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
								<IconSizeHelper>
									<ActivityIcon
										label="Activity"
										size="large"
									/>
								</IconSizeHelper>
							}
						>
							Selected Button Item
						</SideNavigation.ButtonItem>
						<SideNavigation.ButtonItem
							disabled
							description="This is a description"
							iconBefore={
								<IconSizeHelper>
									<ActivityIcon
										label="Activity"
										size="large"
									/>
								</IconSizeHelper>
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
					<SideNavigation.Footer>
						<div>test footer</div>
					</SideNavigation.Footer>
				</SideNavigation.Container>
			</div>

			<div className="h-[350px]">
				<AKSideNavigation label="">
					<AKNavigationHeader>
						<AKHeader>test header</AKHeader>
					</AKNavigationHeader>
					<AKNestableNavigationContent>
						<AKNestingItem id={"id"} title={"title"}>
							<AKButtonItem
								iconBefore={
									<IconSizeHelper>
										<ActivityIcon
											label="Activity"
											size="large"
										/>
									</IconSizeHelper>
								}
								description={"test description"}
							>
								test button
							</AKButtonItem>
							<AKNestableNavigationContent>
								<AKNestingItem
									id={"idinner"}
									title={"inner nesting"}
								>
									<AKButtonItem
										iconBefore={
											<IconSizeHelper>
												<ActivityIcon
													label="Activity"
													size="large"
												/>
											</IconSizeHelper>
										}
										description={"test description"}
									>
										inner nesting button
									</AKButtonItem>
								</AKNestingItem>
							</AKNestableNavigationContent>
						</AKNestingItem>
					</AKNestableNavigationContent>
					<AKNavigationContent>
						<AKButtonItem
							iconBefore={
								<IconSizeHelper>
									<ActivityIcon
										label="Activity"
										size="large"
									/>
								</IconSizeHelper>
							}
							description={"test description"}
						>
							test button
						</AKButtonItem>
						<AKButtonItem>test button</AKButtonItem>
						<AKButtonItem
							isSelected
							iconBefore={
								<IconSizeHelper>
									<ActivityIcon
										label="Activity"
										size="large"
									/>
								</IconSizeHelper>
							}
							description={"test description"}
						>
							selected button item
						</AKButtonItem>
						<AKButtonItem
							isDisabled
							iconBefore={
								<IconSizeHelper>
									<ActivityIcon
										label="Activity"
										size="large"
									/>
								</IconSizeHelper>
							}
							description={"test description"}
						>
							disabled button item
						</AKButtonItem>
						<AKSection title="Section" hasSeparator isList>
							<AKButtonItem description="This is a description">
								Button Item 1
							</AKButtonItem>
							<AKGoBackItem description="test description">
								Go Back
							</AKGoBackItem>
							<AKLinkItem
								href="https://www.google.com"
								description={"test link description"}
							>
								Link Item
							</AKLinkItem>
						</AKSection>
						<AKSkeletonItem />
						<AKSkeletonItem isShimmering />
						<AKSkeletonItem hasIcon />
						<AKSkeletonItem hasAvatar />
					</AKNavigationContent>
					<AKNavigationFooter>
						<div>test footer</div>
					</AKNavigationFooter>
				</AKSideNavigation>
			</div>
		</div>
	)
}
//#endregion side-nav-example

function SideNavigationShowcase(props: ShowcaseProps) {
	return (
		<ShowcaseWrapperItem
			name="Side Navigation"
			{...props}
			packages={[
				{
					name: "@linked-planet/ui-kit-ts",
					url: "https://linked-planet.github.io/ui-kit-ts/single?component=Side%20Navigation",
				},
			]}
			examples={[
				{
					title: "Example",
					example: <SideNavExample />,
					sourceCodeExampleId: "side-nav-example",
				},
			]}
		/>
	)
}

export default SideNavigationShowcase
