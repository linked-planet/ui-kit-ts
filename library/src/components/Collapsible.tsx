import React, { useCallback, useEffect, useState } from "react"
import * as CollapsibleRUI from "@radix-ui/react-collapsible"
import ChevronUpIcon from "@atlaskit/icon/glyph/chevron-up"
import ChevronDownIcon from "@atlaskit/icon/glyph/chevron-down"
import ChevronRightIcon from "@atlaskit/icon/glyph/chevron-right"
import { token } from "@atlaskit/tokens"

type CollapsibleProps = {
	opened?: boolean
	onChanged?: (opened: boolean) => void
	header: React.ReactNode
	headerContainerStyle?: React.CSSProperties
	style?: React.CSSProperties
	children: React.ReactNode
	openButtonPosition?: "left" | "right" | "hidden"
}

const backgroundColor = token("color.background.neutral", "#091E420A")

export function Collapsible({
	opened = true,
	onChanged,
	openButtonPosition = "left",
	header,
	style,
	headerContainerStyle,
	children,
}: CollapsibleProps) {
	const [open, setOpen] = useState(opened)

	useEffect(() => setOpen(opened), [opened])

	const openCB = useCallback(
		(opened: boolean) => {
			setOpen(opened)
			if (onChanged) onChanged(opened)
		},
		[onChanged],
	)

	return (
		<CollapsibleRUI.Root
			open={open}
			onOpenChange={openCB}
			style={style ?? { backgroundColor, borderRadius: "0.25rem" }}
		>
			<div
				className={`flex rounded p-1
				${open ? "rounded-b-none" : "rounded-b"}
				`}
				style={headerContainerStyle}
			>
				<CollapsibleRUI.Trigger asChild>
					{openButtonPosition === "hidden" ? null : (
						<button className="flex w-full items-center">
							{openButtonPosition === "left" ? (
								open ? (
									<>
										<ChevronDownIcon
											//size="large"
											label="close"
										/>
										<>{header}</>
									</>
								) : (
									<>
										<ChevronRightIcon
											//size="large"
											label="open"
										/>
										<>{header}</>
									</>
								)
							) : open ? (
								<>
									<>{header}</>
									<ChevronDownIcon
										size="large"
										label="open"
									/>
								</>
							) : (
								<>
									<>{header}</>
									<ChevronUpIcon size="large" label="close" />
								</>
							)}
						</button>
					)}
				</CollapsibleRUI.Trigger>
			</div>
			<CollapsibleRUI.Content>{children}</CollapsibleRUI.Content>
		</CollapsibleRUI.Root>
	)
}
