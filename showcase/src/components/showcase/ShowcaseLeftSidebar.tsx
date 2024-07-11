import React, { useCallback } from "react"
import useShowcases from "../../useShowcases"
import { useLocation, useNavigate } from "react-router-dom"
import {
	LeftSidebar,
	RightSidebar,
	SideNavigation,
} from "@linked-planet/ui-kit-ts"
import {
	Footer,
	Header,
	NestableNavigationContent,
} from "@atlaskit/side-navigation"

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
		<SideNavigation.Container>
			<SideNavigation.Header>
				<Header description="linked-planet">UI-Showcase</Header>
			</SideNavigation.Header>

			<NestableNavigationContent>
				{Object.keys(showcases).map((showcaseName) => {
					return (
						<SideNavigation.ButtonItem
							key={showcaseName}
							onClick={() => clickCB(showcaseName)}
						>
							{showcaseName}
						</SideNavigation.ButtonItem>
					)
				})}
			</NestableNavigationContent>

			<SideNavigation.Footer>
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
			</SideNavigation.Footer>
		</SideNavigation.Container>
	)

	if (position === "left") {
		return <LeftSidebar sticky>{content}</LeftSidebar>
	}

	return <RightSidebar sticky>{content}</RightSidebar>
	//#endregion leftsidebar
}

export default ShowcaseLeftSidebar
