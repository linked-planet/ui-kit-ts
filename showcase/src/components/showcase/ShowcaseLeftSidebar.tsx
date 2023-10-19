import React, { useCallback } from "react"
import { LeftSidebar } from "@atlaskit/page-layout"
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

function ShowcaseLeftSidebar() {
	//#region leftsidebar
	const showcases = useShowcases({ overallSourceCode: "" })
	const location = useLocation()
	const navigate = useNavigate()

	const clickCB = useCallback(
		(showcaseName: string) => {
			console.log("LOCATION", location)
			if (location.pathname === "/wrappers") {
				scrollAndHighlightElement(showcaseName)
				return
			}
			navigate("/single#" + showcaseName)
		},
		[location, navigate],
	)

	return (
		<LeftSidebar>
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
						<a href="https://www.linked-planet.com/">
							{" "}
							linked-planet
						</a>
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
		</LeftSidebar>
	)
	//#endregion leftsidebar
}

export default ShowcaseLeftSidebar
