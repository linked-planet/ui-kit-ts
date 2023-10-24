import React from "react"
import { TopNavigation } from "@atlaskit/page-layout"
import {
	AtlassianNavigation,
	CustomProductHome,
	PrimaryButton,
	Profile,
} from "@atlaskit/atlassian-navigation"
import { useNavigate } from "react-router"
import { LocaleDropDown, ThemeSwitch } from "@linked-planet/ui-kit-ts"
import { Avatar } from "@linked-planet/ui-kit-ts/components/Avatar"
export const ProfileIcon = () => {
	return (
		<img
			src="images/github-logo.png"
			style={{
				borderRadius: "50%",
				width: 32,
				height: 32,
			}}
		/>
	)
}

function ShowcaseTopNavigation() {
	//#region topnavigation
	const navigation = useNavigate()
	return (
		<TopNavigation isFixed>
			<AtlassianNavigation
				label=""
				primaryItems={[
					<PrimaryButton key={0} onClick={() => navigation("/intro")}>
						<span>Intro</span>
					</PrimaryButton>,
					<PrimaryButton
						key={1}
						onClick={() => navigation("/wrappers")}
					>
						<span>Wrappers</span>
					</PrimaryButton>,
					<PrimaryButton
						key={1}
						onClick={() => navigation("/single")}
					>
						<span>Single Components</span>
					</PrimaryButton>,
					<div
						key={4}
						style={{
							display: "flex",
							justifyContent: "center",
							alignItems: "center",
						}}
					>
						<LocaleDropDown />
					</div>,
				]}
				renderAppSwitcher={undefined}
				renderProductHome={() => (
					<CustomProductHome
						siteTitle="UI-Kit-TS"
						iconUrl="./images/logo.png"
						logoAlt=""
						onClick={() => navigation("/intro")}
						logoUrl="images/logo.png"
						iconAlt=""
					/>
				)}
				renderProfile={() => (
					<>
						<ThemeSwitch />
						<Avatar
							href="https://github.com/linked-planet/ui-kit-ts"
							target="_blank"
							src={"images/github-logo.png"}
						/>
						<Avatar
							href="https://www.linked-planet.com"
							target="_blank"
							src={"images/logo.png"}
						/>
					</>
				)}
			/>
		</TopNavigation>
	)
	//#endregion topnavigation
}

export default ShowcaseTopNavigation
