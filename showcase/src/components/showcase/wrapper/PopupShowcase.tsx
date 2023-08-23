import React, { useState } from "react"
import ShowcaseWrapperItem, {
	ShowcaseProps,
} from "../../ShowCaseWrapperItem/ShowcaseWrapperItem"
import { Popup } from "@atlaskit/popup"
import Button from "@atlaskit/button"

function PopupShowcase(props: ShowcaseProps) {
	// region: popup
	const [isPopupActive, setIsPopupActive] = useState(false)
	const example = (
		<Popup
			isOpen={isPopupActive}
			placement="top"
			onClose={() => setIsPopupActive(false)}
			trigger={() => (
				<Button
					onClick={() => setIsPopupActive(true)}
					isSelected={isPopupActive}
				>
					OpenPopup
				</Button>
			)}
			content={() => (
				<div style={{ padding: "15px 15px" }}>
					<span>Popup content</span>
				</div>
			)}
		/>
	)
	// endregion: popup

	return (
		<ShowcaseWrapperItem
			name="Popup"
			sourceCodeExampleId="popup"
			{...props}
			packages={[
				{
					name: "@atlaskit/popup",
					url: "https://atlassian.design/components/popup/examples",
				},
			]}
			examples={[example]}
		/>
	)
}

export default PopupShowcase
