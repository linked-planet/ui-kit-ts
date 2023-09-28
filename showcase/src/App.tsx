import React from "react"
import { Content, Main, PageLayout } from "@atlaskit/page-layout"
import ShowcaseTopNavigation from "./components/ShowcaseTopNavigation"
import ShowcaseLeftSidebar from "./components/ShowcaseLeftSidebar"
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom"
import IntroPage from "./page/IntroPage"
import NotFoundPage from "./page/NotFoundPage"

import { LocaleProvider } from "@linked-planet/ui-kit-ts"
import SinglePage from "./page/SinglePage"
import WrappersPage from "./page/WrappersPage"

import "./custom.css"
import "./styles.css"
import "@atlaskit/css-reset" // sets base styles ot AK

export default function App() {
	return (
		<BrowserRouter basename="ui-kit-ts">
			<LocaleProvider>
				<div className="App">
					<PageLayout>
						<ShowcaseTopNavigation />
						<Content>
							<ShowcaseLeftSidebar />

							<Main>
								<main
									style={{
										margin: "12px 12px",
										display: "flex",
										flexDirection: "column",
									}}
								>
									<Routes>
										<Route
											path="/"
											element={<Navigate to="/intro" />}
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
								</main>
							</Main>
						</Content>
					</PageLayout>
				</div>
			</LocaleProvider>
		</BrowserRouter>
	)
}
