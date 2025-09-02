import {
	AtlassianNavigation,
	CustomProductHome,
	PrimaryButton,
} from "@atlaskit/atlassian-navigation"
import {
	AppLayout,
	Label,
	LocaleDropDown,
	ThemeSwitch,
	Toggle,
} from "@linked-planet/ui-kit-ts"
import { Avatar } from "@linked-planet/ui-kit-ts/components/Avatar"
import type React from "react"
import { useNavigate } from "react-router-dom"
export const ProfileIcon = () => {
	return (
		<img
			src="images/github-logo.png"
			alt="github logo"
			style={{
				borderRadius: "50%",
				width: 32,
				height: 32,
			}}
		/>
	)
}

function SidebarToggle({
	position,
	setSidebarPosition,
}: {
	position: "left" | "right"
	setSidebarPosition: React.Dispatch<React.SetStateAction<"left" | "right">>
}) {
	return (
		<div className="flex items-center pr-2">
			<Label className="p-0">Sidebar:</Label>
			<div className="">
				<Toggle
					defaultChecked={position === "left"}
					onChange={(checked) => {
						if (checked) {
							setSidebarPosition("left")
						} else {
							setSidebarPosition("right")
						}
					}}
				/>
			</div>
		</div>
	)
}

function ShowcaseTopNavigation({
	sidebarPosition,
	setSidebarPosition,
}: {
	sidebarPosition: "left" | "right"
	setSidebarPosition: React.Dispatch<React.SetStateAction<"left" | "right">>
}) {
	//#region topnavigation
	const navigation = useNavigate()
	return (
		<AppLayout.TopNavigation sticky>
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
						<SidebarToggle
							position={sidebarPosition}
							setSidebarPosition={setSidebarPosition}
						/>
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
		</AppLayout.TopNavigation>
	)
	//#endregion topnavigation
}

export default ShowcaseTopNavigation
