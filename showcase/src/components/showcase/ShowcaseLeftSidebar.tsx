import React, { useCallback } from "react"
import {
	ButtonItem,
	Footer,
	Header,
	NavigationFooter,
	NavigationHeader,
	NestableNavigationContent,
	SideNavigation,
} from "@atlaskit/side-navigation"
import useShowcases from "../../useShowcases"
import { useLocation, useNavigate } from "react-router-dom"
import { LeftSidebar, RightSidebar } from "@linked-planet/ui-kit-ts"

function scrollAndHighlightElement(id: string) {
	const element = document.getElementById(id)
	if (element) {
		element.scrollIntoView({
			behavior: "smooth",
			block: "center",
		} as ScrollIntoViewOptions)
		element.classList.add("focus")
		setTimeout(() => {
			element.classList.remove("focus")
		}, 1500)
	}
}

function ShowcaseLeftSidebar({
	position = "left",
}: {
	position: "left" | "right"
}) {
	//#region leftsidebar
	const showcases = useShowcases({ overallSourceCode: "" })
	const location = useLocation()
	const navigate = useNavigate()

	const clickCB = useCallback(
		(showcaseName: string) => {
			if (location.pathname === "/wrappers") {
				scrollAndHighlightElement(showcaseName)
				return
			}
			navigate(`/single?component=${showcaseName}`)
		},
		[location, navigate],
	)

	const content = (
		<SideNavigation label="">
			<NavigationHeader>
				<Header description="linked-planet">UI-Showcase</Header>
			</NavigationHeader>

			<NestableNavigationContent>
				{Object.keys(showcases).map((showcaseName) => {
					return (
						<ButtonItem
							key={showcaseName}
							onClick={() => clickCB(showcaseName)}
						>
							{showcaseName}
						</ButtonItem>
					)
				})}
			</NestableNavigationContent>

			<NavigationFooter>
				<Footer>
					Made with ❤ by
					<a href="https://www.linked-planet.com/"> linked-planet</a>
				</Footer>
				<Footer>
					Licensed under
					<a href="http://www.apache.org/licenses/LICENSE-2.0">
						{" "}
						Apache License, Version 2.0
					</a>
				</Footer>
			</NavigationFooter>
		</SideNavigation>
	)

	if (position === "left") {
		return <LeftSidebar sticky>{content}</LeftSidebar>
	}

	return <RightSidebar sticky>{content}</RightSidebar>
	//#endregion leftsidebar
}

export default ShowcaseLeftSidebar
