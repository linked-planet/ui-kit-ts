import React from "react"
import { Content, Main, PageLayout } from "@atlaskit/page-layout"
import ShowcaseTopNavigation from "./components/ShowcaseTopNavigation"
import ShowcaseLeftSidebar from "./components/ShowcaseLeftSidebar"
import { HashRouter, Navigate, Route, Routes } from "react-router-dom"
import IntroPage from "./page/IntroPage"
import NotFoundPage from "./page/NotFoundPage"
import ReduxPage from "./page/ReduxPage"
import WrappersPage from "./page/WrappersPage"
import "@atlaskit/css-reset";
import { appStore } from "./state/appStore"
import { Provider } from "react-redux";
import { QueryClientProvider } from "react-query"
import ReactQueryPage from "./page/ReactQueryPage"

import "./custom.css"
import { queryClient } from "./setup"
import { initTheming } from "@linked-planet/ui-kit-ts/theming"



function App () {
	//require("./custom.css")

	initTheming() // without it the table would be invisible because the css variables are not set

	return (
		<HashRouter>
			<Provider store={ appStore }>
				<QueryClientProvider client={ queryClient }>
					<div className="App">
						<PageLayout>
							<ShowcaseTopNavigation />
							<Content>
								<ShowcaseLeftSidebar />

								<Main>
									<div style={ {
										margin: "50px 50px",
										display: "flex",
										flexDirection: "column"
									} }>
										<Routes>
											<Route
												path="/"
												element={ <Navigate to="/intro" /> }
											/>
											<Route
												path="/intro"
												element={ <IntroPage /> }
											/>
											<Route
												path="/wrappers"
												element={ <WrappersPage /> }
											/>
											<Route
												path="/redux"
												element={ <ReduxPage /> }
											/>
											<Route
												path="/query"
												element={ <ReactQueryPage /> }
											/>
											<Route
												path="*"
												element={ <NotFoundPage /> }
											/>
										</Routes>
									</div>
								</Main>
							</Content>
						</PageLayout>
					</div>
				</QueryClientProvider>
			</Provider>
		</HashRouter>
	);
}

export default App;
