import React, { useMemo } from "react"
import { twMerge } from "tailwind-merge"
import MenuIcon from "@atlaskit/icon/glyph/menu"
import { Button, Dropdown } from "../components"

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
			"bg-surface flex h-full min-h-0 w-full flex-col overflow-hidden",
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
			`border-border bg-surface-raised z-[1] flex flex-col border-b pt-4 ${
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
	titleMenu,
}: {
	children: React.ReactNode
	id?: string
	className?: string
	style?: React.CSSProperties
	titleMenu?: React.ReactNodeArray
}) => {
	const headerMenu = useMemo(() => {
		if (!titleMenu || titleMenu.length === 0) return undefined
		if (titleMenu.length === 1) return titleMenu[0]
		const dropdownItems = React.Children.map(titleMenu, (it) => {
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

		return (
			<Dropdown.Menu
				trigger={
					<Button appearance="subtle" className="mr-2 p-0">
						<MenuIcon size="large" label="" />
					</Button>
				}
				align="end"
			>
				{dropdownItems}
			</Dropdown.Menu>
		)
	}, [titleMenu])

	return (
		<div
			className={twMerge("mb-2 flex items-center pl-8", className)}
			id={id}
			style={style}
		>
			{typeof children === "string" ? <h1>{children}</h1> : children}
			{titleMenu && <div className="ml-auto flex-none">{headerMenu}</div>}
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
		className={twMerge("text-text-subtlest mb-1 px-8", className)}
		id={id}
		style={style}
	>
		{typeof children === "string" ? (
			<p className="pt-0">{children}</p>
		) : (
			children
		)}
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
		className={twMerge(
			"px8 flex w-full items-center gap-1 px-8 pb-1",
			className,
		)}
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
			"bg-surface z-0 flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden",
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
			"min-h-0 flex-1 overflow-y-auto px-8 py-3",
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
			"bg-surface-raised shadow-overflow z-0 px-8 py-1",
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
			"bg-surface-raised border-border shadow-overflow flex justify-center border-t p-1.5",
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
