import React from 'react';
import { PageLayout, Content, Main } from "@atlaskit/page-layout"
import ShowcaseTopNavigation from "./components/ShowcaseTopNavigation";
import ShowcaseLeftSidebar from "./components/ShowcaseLeftSidebar";
import {HashRouter, Routes, Route, Navigate} from "react-router-dom";
import IntroPage from "./page/IntroPage";
import NotFoundPage from "./page/NotFoundPage";
import UtilsPage from "./page/UtilsPage";
import WrappersPage from "./page/WrappersPage";
import "@atlaskit/css-reset";

function App() {
    require("./custom.css")

    return (
        <div className="App">
            <PageLayout>
                <ShowcaseTopNavigation />
                <Content>
                    <ShowcaseLeftSidebar />

                    <Main>
                        <div style={{
                            margin: "50px 50px",
                            display: "flex",
                            flexDirection: "column"
                        }}>
                            <HashRouter>
                                <Routes>
                                    <Route
                                        path="/"
                                        element={<Navigate to="/intro"/>}
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
                                        path="/utils"
                                        element={<UtilsPage />}
                                        />
                                    <Route
                                        element={<NotFoundPage />}
                                        />
                                </Routes>
                            </HashRouter>
                        </div>
                    </Main>
                </Content>
            </PageLayout>
        </div>
    );
}

export default App;
