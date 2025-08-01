import { AppLayout, LocaleProvider, PageLayout } from "@linked-planet/ui-kit-ts"
import { useState } from "react"
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom"
import ShowcaseLeftSidebar from "./components/showcase/ShowcaseLeftSidebar"
import ShowcaseTopNavigation from "./components/showcase/ShowcaseTopNavigation"
import IntroPage from "./page/IntroPage"
import NotFoundPage from "./page/NotFoundPage"
import SinglePage from "./page/SinglePage"
import WrappersPage from "./page/WrappersPage"

import "./custom.css"

export default function ShowcaseApp() {
	const [sidebarPosition, setSidebarPosition] = useState<"left" | "right">(
		"left",
	)

	return (
		<BrowserRouter basename="ui-kit-ts">
			<LocaleProvider>
				<AppLayout.Container>
					<AppLayout.TopNavigation>
						<ShowcaseTopNavigation
							sidebarPosition={sidebarPosition}
							setSidebarPosition={setSidebarPosition}
						/>
					</AppLayout.TopNavigation>

					<AppLayout.Content>
						<ShowcaseLeftSidebar position="left" />
						<AppLayout.Main className="overflow-hidden">
							<PageLayout.Page>
								<PageLayout.PageBody>
									<PageLayout.PageBodyContent ariaLabel="Showcase Content">
										<Routes>
											<Route
												path="/"
												element={
													<Navigate to="/intro" />
												}
											/>
											<Route
												path="/intro"
												element={<IntroPage />}
											/>
											<Route
												path="/wrappers"
												element={<WrappersPage />}
											/>
											<Route
												path="/single"
												element={<SinglePage />}
											/>
											<Route
												path="*"
												element={<NotFoundPage />}
											/>
										</Routes>
									</PageLayout.PageBodyContent>
								</PageLayout.PageBody>
							</PageLayout.Page>
						</AppLayout.Main>
					</AppLayout.Content>
				</AppLayout.Container>
			</LocaleProvider>
		</BrowserRouter>
	)
}
