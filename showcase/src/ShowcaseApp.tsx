import React, { useState } from "react"
import ShowcaseTopNavigation from "./components/showcase/ShowcaseTopNavigation"
import ShowcaseLeftSidebar from "./components/showcase/ShowcaseLeftSidebar"
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom"
import IntroPage from "./page/IntroPage"
import NotFoundPage from "./page/NotFoundPage"

import { AppLayout, LocaleProvider } from "@linked-planet/ui-kit-ts"
import SinglePage from "./page/SinglePage"
import WrappersPage from "./page/WrappersPage"

import "./custom.css"
import "@atlaskit/css-reset" // sets base styles of AK

export default function ShowcaseApp() {
	const [sidebarPosition, setSidebarPosition] = useState<"left" | "right">(
		"left",
	)

	console.log("SIDEBAR POS", sidebarPosition)

	return (
		<BrowserRouter basename="ui-kit-ts">
			<LocaleProvider>
				<AppLayout.Container>
					<ShowcaseTopNavigation
						sidebarPosition={sidebarPosition}
						setSidebarPosition={setSidebarPosition}
					/>
					<AppLayout.Content>
						<ShowcaseLeftSidebar position={sidebarPosition} />
						<AppLayout.Main className="overflow-hidden p-4">
							<Routes>
								<Route
									path="/"
									element={<Navigate to="/intro" />}
								/>
								<Route path="/intro" element={<IntroPage />} />
								<Route
									path="/wrappers"
									element={<WrappersPage />}
								/>
								<Route
									path="/single"
									element={<SinglePage />}
								/>
								<Route path="*" element={<NotFoundPage />} />
							</Routes>
						</AppLayout.Main>
					</AppLayout.Content>
				</AppLayout.Container>
			</LocaleProvider>
		</BrowserRouter>
	)
}
