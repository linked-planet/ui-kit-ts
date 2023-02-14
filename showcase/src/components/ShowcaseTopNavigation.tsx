import React from "react";
import {TopNavigation} from "@atlaskit/page-layout";
import {AtlassianNavigation, CustomProductHome, PrimaryButton, Profile} from "@atlaskit/atlassian-navigation";

export const ProfileIcon = () => {
    return (
        <img
            src="./images/github-logo.png"
            style={{
                borderRadius: "50%",
                width: 32,
                height: 32
            }
            }
        />
    )
}

function ShowcaseTopNavigation() {
    return (
        <TopNavigation isFixed>
            <AtlassianNavigation
                label=""
                primaryItems={
                    [
                        <PrimaryButton onClick={() => window.location.href = "/#/intro"}><span>Intro</span></PrimaryButton>,
                        <PrimaryButton onClick={() => window.location.href = "/#/wrappers"}><span>Wrappers</span></PrimaryButton>,
                        <PrimaryButton onClick={() => window.location.href = "/#/utils"}><span>Utils</span></PrimaryButton>,
                    ]
                }
                renderProductHome={() => <CustomProductHome siteTitle="UI-Kit-TS" iconUrl="./images/logo.png" logoAlt=""
                                                            onClick={() => window.location.href = "/#/intro"}
                                                            logoUrl="images/logo.png" iconAlt=""/>}
                renderProfile={() => <Profile tooltip="" href="https://github.com/linked-planet/ui-kit-ts" target="_blank" icon={<ProfileIcon/>}/>}
            />
        </TopNavigation>
    )
}

export default ShowcaseTopNavigation;