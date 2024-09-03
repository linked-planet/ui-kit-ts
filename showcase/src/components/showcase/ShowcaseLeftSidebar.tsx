import React, { useCallback } from "react"
import useShowcases from "../../useShowcases"
import { useLocation, useNavigate } from "react-router-dom"
import {
	LeftSidebar,
	RightSidebar,
	SideNavigation,
} from "@linked-planet/ui-kit-ts"

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
			<SideNavigation.NavigationHeader>
				<h2 className="text-text-subtle pb-2 text-sm font-bold">
					UI-Showcase
				</h2>
				<span className="text-text-subtlest text-sm font-[400]">
					linked-planet
				</span>
			</SideNavigation.NavigationHeader>
			<SideNavigation.Content>
				{Object.keys(showcases).map((showcaseName) => {
					return (
						<SideNavigation.ButtonItem
							key={showcaseName}
							onMouseDown={(e) => {
								if (e.button === 1) {
									window.open(
										`/ui-kit-ts/single?component=${showcaseName}`,
										"_blank",
									)
								}
							}}
							onClick={(e) => clickCB(showcaseName)}
						>
							{showcaseName}
						</SideNavigation.ButtonItem>
					)
				})}
			</SideNavigation.Content>

			<SideNavigation.NavigationFooter className="flex flex-col gap-4">
				<div className="text-center">
					Made with ❤ by
					<a href="https://www.linked-planet.com/"> linked-planet</a>
				</div>
				<div className="text-center">
					Licensed under
					<a href="http://www.apache.org/licenses/LICENSE-2.0">
						{" "}
						Apache License, Version 2.0
					</a>
				</div>
			</SideNavigation.NavigationFooter>
		</SideNavigation.Container>
	)

	if (position === "left") {
		return <LeftSidebar sticky>{content}</LeftSidebar>
	}

	return <RightSidebar sticky>{content}</RightSidebar>
	//#endregion leftsidebar
}

export default ShowcaseLeftSidebar
