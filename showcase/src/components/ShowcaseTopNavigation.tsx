import React from "react";
import {TopNavigation} from "@atlaskit/page-layout";
import {AtlassianNavigation, CustomProductHome, PrimaryButton, Profile} from "@atlaskit/atlassian-navigation";
import {useNavigate} from "react-router";
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
    const navigation = useNavigate()

    return (
        <TopNavigation isFixed>
            <AtlassianNavigation
                label=""
                primaryItems={
                    [
                        <PrimaryButton onClick={() => navigation("/intro")}><span>Intro</span></PrimaryButton>,
                        <PrimaryButton onClick={() => navigation("/wrappers")}><span>Wrappers</span></PrimaryButton>,
                        <PrimaryButton onClick={() => navigation("/utils")}><span>Utils</span></PrimaryButton>,
                    ]
                }
                renderProductHome={() => <CustomProductHome siteTitle="UI-Kit-TS" iconUrl="./images/logo.png" logoAlt=""
                                                            onClick={() => navigation("/utils")}
                                                            logoUrl="images/logo.png" iconAlt=""/>}
                renderProfile={() => <Profile tooltip="" href="https://github.com/linked-planet/ui-kit-ts" target="_blank" icon={<ProfileIcon/>}/>}
            />
        </TopNavigation>
    )
}

export default ShowcaseTopNavigation;