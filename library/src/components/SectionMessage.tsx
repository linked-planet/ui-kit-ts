import type React from "react"
import { type CSSProperties, type ForwardedRef, forwardRef } from "react"
import { twMerge } from "tailwind-merge"
import { FlagIcon, type FlagAppearance, type FlagActionType } from "./Flag"

export type SectionMessageProps = {
	title?: string
	appearance?: FlagAppearance
	type?: "default" | "inverted" | "pale"
	icon?: JSX.Element
	actions?: FlagActionType[]
	style?: CSSProperties
	className?: string
	id?: string
	testId?: string
	children?: React.ReactNode
}

const defaultStyle = "bg-information"
const warningStyle = "bg-warning"
const errorStyle = "bg-danger"
const successStyle = "bg-success"
const informationStyle = "bg-information"
const discoveryStyle = "bg-discovery"

export const AppearanceStyles: {
	[style in FlagAppearance]: string
} = {
	default: defaultStyle,
	warning: warningStyle,
	error: errorStyle,
	success: successStyle,
	information: informationStyle,
	discovery: discoveryStyle,
} as const

export const SectionMessage = forwardRef(
	(
		{
			children,
			className,
			appearance = "information",
			style,
			testId,
			id,
			icon,
			title,
			actions,
		}: SectionMessageProps,
		ref: ForwardedRef<HTMLDivElement>,
	) => {
		const appStyle = AppearanceStyles[appearance]

		if (!icon) {
			icon = <FlagIcon appearance={appearance} type={"pale"} />
		}

		return (
			<div
				ref={ref}
				style={{
					gridTemplateColumns: "auto 1fr",
					...style,
				}}
				className={twMerge(
					appStyle,
					"grid gap-4 rounded-sm p-3.5",
					className,
				)}
				id={id}
				data-testid={testId}
			>
				{icon && (
					<div>
						<p className="flex items-center justify-center">
							{icon}
						</p>
					</div>
				)}
				<div className="flex flex-col justify-center gap-1">
					{title && (
						<div className="text-text text-base font-semibold">
							{title}
						</div>
					)}
					{children}
					<div>
						{actions?.map((action, i) => (
							<>
								<a
									key={`action${i}`}
									className="inline-block cursor-pointer text-sm"
									onClick={action.onClick}
									href={action.href}
									target={action.target}
								>
									{action.content}
								</a>
								<span
									key={`actionspacer${i}`}
									className="bg-text-subtlest mx-1.5 inline-block h-0.5 w-0.5 rounded-full align-middle last:hidden"
								/>
							</>
						))}
					</div>
				</div>
			</div>
		)
	},
)
