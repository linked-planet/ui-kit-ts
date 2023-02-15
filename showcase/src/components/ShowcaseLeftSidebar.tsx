import React from "react";
import {LeftSidebar} from "@atlaskit/page-layout";
import {
    ButtonItem,
    Footer,
    Header,
    NavigationFooter,
    NavigationHeader,
    NestableNavigationContent,
    SideNavigation
} from "@atlaskit/side-navigation";
import {State} from "../state/appStore";
import {useSelector} from "react-redux"

export function scrollAndHighlightElement(id: string) {
    const element = document.getElementById(id)
    if (element) {
        element.scrollIntoView({
            behavior: "smooth",
            block: "center"
        } as ScrollIntoViewOptions)
        element.classList.add("focus")
        setTimeout(() => {
            element.classList.remove("focus")
        }, 1500)
    }
}

function ShowcaseLeftSidebar() {

    const menuIds = useSelector((state: State) => state.menu)

    return (
        <LeftSidebar>
            <SideNavigation label="">
                <NavigationHeader>
                    <Header description="linked-planet">UI-Showcase</Header>
                </NavigationHeader>

                <NestableNavigationContent>
                    {
                        menuIds.map((item) => {
                            return (
                                <ButtonItem onClick={() => scrollAndHighlightElement(item.id)
                                }>{item.menuName}</ButtonItem>
                            )
                        })
                    }
                </NestableNavigationContent>

                <NavigationFooter>
                    <Footer>
                        Made with ❤ by
                        <a href="https://www.linked-planet.com/"> linked-planet</a>
                    </Footer>
                    <Footer>
                        Licensed under
                        <a href="http://www.apache.org/licenses/LICENSE-2.0"> Apache License, Version 2.0</a>
                    </Footer>
                </NavigationFooter>
            </SideNavigation>
        </LeftSidebar>
    )
}

export default ShowcaseLeftSidebar;