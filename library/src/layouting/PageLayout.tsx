import React, { useMemo } from "react"
import { twMerge } from "tailwind-merge"
import MenuIcon from "@atlaskit/icon/glyph/menu"
import { Dropdown } from "../components"

const Page = ({
	children,
	id,
	className,
}: {
	children: React.ReactNode
	id?: string
	className?: string
}) => (
	<div
		className={twMerge(
			"flex h-full min-h-0 w-full flex-col overflow-hidden",
			className,
		)}
		id={id}
	>
		{children}
	</div>
)

const PageHeader = ({
	shadow = true,
	children,
	id,
	className,
	style,
}: {
	shadow?: boolean
	children: React.ReactNode
	id?: string
	className?: string
	style?: React.CSSProperties
}) => (
	<div
		className={twMerge(
			`border-border bg-surface z-[1] flex flex-col border-b pb-1 pl-4 pr-4 pt-3 ${
				shadow ? "shadow-overflow" : ""
			}`,
			className,
		)}
		id={id}
		style={style}
	>
		{children}
	</div>
)

const PageHeaderTitle = ({
	children,
	id,
	className,
	style,
	titleMenuTrigger,
	titleMenu,
}: {
	children: React.ReactNode
	id?: string
	className?: string
	style?: React.CSSProperties
	titleMenuTrigger?: React.ReactNode
	titleMenu?: React.ReactNodeArray
}) => {
	const dropdownMenuItems = useMemo(() => {
		return React.Children.map(titleMenu, (it) => {
			if (React.isValidElement(it)) {
				if (
					it.type === Dropdown.Item ||
					it.type === Dropdown.ItemGroup ||
					it.type === Dropdown.ItemCheckbox ||
					it.type === Dropdown.ItemRadio ||
					it.type === Dropdown.ItemRadioGroup ||
					it.type === Dropdown.SubMenu
				) {
					return it
				}
			}
			return <Dropdown.Item>{it}</Dropdown.Item>
		})
	}, [titleMenu])

	return (
		<div
			className={twMerge("mb-2 flex items-center", className)}
			id={id}
			style={style}
		>
			{children}
			{titleMenu && (
				<span className="ml-auto flex-none">
					<Dropdown.Menu
						align="end"
						trigger={
							<>
								{titleMenuTrigger ? (
									titleMenuTrigger
								) : (
									<div className="flex items-center">
										<MenuIcon size="large" label="" />
									</div>
								)}
							</>
						}
					>
						{dropdownMenuItems}
					</Dropdown.Menu>
				</span>
			)}
		</div>
	)
}

const PageHeaderSubTitle = ({
	children,
	id,
	className,
	style,
}: {
	children: React.ReactNode
	id?: string
	className?: string
	style?: React.CSSProperties
}) => (
	<div
		className={twMerge("text-text-subtlest mb-1", className)}
		id={id}
		style={style}
	>
		{children}
	</div>
)

const PageHeaderLine = ({
	children,
	id,
	className,
	style,
}: {
	children: React.ReactNode
	id?: string
	className?: string
	style?: React.CSSProperties
}) => (
	<div
		className={twMerge("flex w-full items-center gap-1", className)}
		style={style}
		id={id}
	>
		{children}
	</div>
)

const PageBody = ({
	children,
	id,
	className,
	style,
}: {
	children: React.ReactNode
	id?: string
	className?: string
	style?: React.CSSProperties
}) => (
	<div
		className={twMerge(
			"bg-surface-sunken z-0 flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden",
			className,
		)}
		style={style}
		id={id}
	>
		{children}
	</div>
)

const PageBodyContent = ({
	children,
	id,
	className,
	style,
}: {
	children: React.ReactNode
	id?: string
	className?: string
	style?: React.CSSProperties
}) => (
	<div
		className={twMerge(
			"min-h-0 flex-1 overflow-y-auto pb-5 pl-5 pr-3 pt-3",
			className,
		)}
		id={id}
		style={style}
	>
		{children}
	</div>
)

const PageBodyHeader = ({
	children,
	id,
	className,
	style,
}: {
	children: React.ReactNode
	id?: string
	className?: string
	style?: React.CSSProperties
}) => (
	<div
		className={twMerge(
			"bg-neutral-subtle shadow-overflow z-0 pb-1 pl-4 pr-4 pt-1",
			className,
		)}
		id={id}
		style={style}
	>
		{children}
	</div>
)

const PageBodyFooter = ({
	children,
	id,
	className,
	style,
}: {
	children: React.ReactNode
	id?: string
	className?: string
	style?: React.CSSProperties
}) => (
	<div
		className={twMerge(
			"bg-neutral-subtle border-border shadow-overflow flex justify-center border-t pt-1",
			className,
		)}
		id={id}
		style={style}
	>
		{children}
	</div>
)

const PageLayout = {
	Page,
	PageHeader,
	PageHeaderTitle,
	PageHeaderSubTitle,
	PageBody,
	PageBodyContent,
	PageBodyHeader,
	PageBodyFooter,
	PageHeaderLine,
}
export default PageLayout
