import React from "react";
import {LeftSidebar} from "@atlaskit/page-layout";
import {
    ButtonItem,
    Header,
    NavigationHeader,
    NestableNavigationContent,
    Section,
    SideNavigation
} from "@atlaskit/side-navigation";

function ShowcaseLeftSidebar() {

    return (
        <LeftSidebar>
            <SideNavigation label="">
                <NavigationHeader>
                    <Header description="linked-planet">UI-Showcase</Header>
                </NavigationHeader>

                <NestableNavigationContent>
                    <Section>
                        <ButtonItem>Menu item</ButtonItem>
                    </Section>
                </NestableNavigationContent>
            </SideNavigation>
        </LeftSidebar>
    )
}

export default ShowcaseLeftSidebar;