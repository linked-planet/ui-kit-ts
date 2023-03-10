import React from 'react';
import {Content, Main, PageLayout} from "@atlaskit/page-layout"
import ShowcaseTopNavigation from "./components/ShowcaseTopNavigation";
import ShowcaseLeftSidebar from "./components/ShowcaseLeftSidebar";
import {HashRouter, Navigate, Route, Routes} from "react-router-dom";
import IntroPage from "./page/IntroPage";
import NotFoundPage from "./page/NotFoundPage";
import ReduxPage from "./page/ReduxPage";
import WrappersPage from "./page/WrappersPage";
import "@atlaskit/css-reset";
import {appStore} from "./state/appStore";
import {Provider} from "react-redux";
import {QueryClient, QueryClientProvider} from "react-query";
import axios from "axios";
import ReactQueryPage from "./page/ReactQueryPage";


export const axiosClient = axios.create({

})
export const queryClient = new QueryClient()
function App() {
    require("./custom.css")

    return (
        <HashRouter>
            <Provider store={appStore}>
                <QueryClientProvider client={queryClient}>
                    <div className="App">
                        <PageLayout>
                            <ShowcaseTopNavigation/>
                            <Content>
                                <ShowcaseLeftSidebar/>

                                <Main>
                                    <div style={{
                                        margin: "50px 50px",
                                        display: "flex",
                                        flexDirection: "column"
                                    }}>
                                        <Routes>
                                            <Route
                                                path="/"
                                                element={<Navigate to="/intro"/>}
                                            />
                                            <Route
                                                path="/intro"
                                                element={<IntroPage/>}
                                            />
                                            <Route
                                                path="/wrappers"
                                                element={<WrappersPage/>}
                                            />
                                            <Route
                                                path="/redux"
                                                element={<ReduxPage/>}
                                            />
                                            <Route
                                                path="/query"
                                                element={<ReactQueryPage/>}
                                            />
                                            <Route
                                                path="*"
                                                element={<NotFoundPage/>}
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
