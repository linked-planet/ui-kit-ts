import React, { useEffect, useState } from "react"
import type { ComponentPropsWithoutRef } from "react"
import { twMerge } from "tailwind-merge"

type BreadcrumbsProps = ComponentPropsWithoutRef<"div"> & {
	maxItems?: number
	ellipsisLabel?: string
	expanded?: boolean
	defaultExpanded?: boolean
	onExpandedChange?: (expanded: boolean) => void
	itemsBeforeCollapse?: number
	itemsAfterCollapse?: number
	testId?: string
}

export function Breadcrumbs({
	className,
	children,
	maxItems,
	ellipsisLabel,
	expanded: _expanded,
	defaultExpanded = true,
	onExpandedChange,
	testId,
	itemsBeforeCollapse = 1,
	itemsAfterCollapse = 1,
	...props
}: BreadcrumbsProps) {
	const [expanded, setExpanded] = useState(
		_expanded ??
			(maxItems !== undefined &&
				maxItems >= React.Children.count(children)),
	)

	const childCount = React.Children.count(children)

	useEffect(() => {
		if (_expanded === undefined && maxItems !== undefined) {
			setExpanded((expanded) => {
				const newExpanded = maxItems >= childCount
				if (expanded !== newExpanded) {
					onExpandedChange?.(newExpanded)
				}
				return newExpanded
			})
		}
	}, [_expanded, maxItems, childCount, onExpandedChange])

	if (_expanded !== undefined && _expanded !== expanded) {
		setExpanded(_expanded)
		onExpandedChange?.(_expanded)
	}

	let items = children
	if (!expanded && itemsBeforeCollapse + itemsAfterCollapse < childCount) {
		const _children = React.Children.toArray(children)
		const before = _children.slice(0, itemsBeforeCollapse)
		const after = _children.slice(-itemsAfterCollapse)

		items = [
			...before,
			<Ellipsis
				key="ellipsis"
				ellipsisLabel={ellipsisLabel}
				onClick={() => {
					setExpanded(true)
					onExpandedChange?.(true)
				}}
			/>,
			...after,
		]
	}

	return (
		<div
			className={twMerge(
				"text-text-subtle flex items-center text-sm",
				className,
			)}
			data-testid={testId}
			{...props}
		>
			{items}
		</div>
	)
}

function Ellipsis({
	onClick,
	ellipsisLabel = "Show more",
	className,
	style,
}: {
	onClick?: () => void
	ellipsisLabel?: string
	className?: string
	style?: React.CSSProperties
}) {
	return (
		<span className="flex gap-1 pl-0 pr-1">
			<span
				onClick={onClick}
				onKeyUp={(e) => {
					if (e.key === "Enter") {
						onClick?.()
					}
				}}
				title={ellipsisLabel}
				aria-label={ellipsisLabel}
				className={twMerge(
					"cursor-pointer pr-1 hover:underline",
					className,
				)}
				style={style}
			>
				...
			</span>
			/
		</span>
	)
}

type BreadcrumbsItemProps = ComponentPropsWithoutRef<"a"> & {
	iconBefore?: React.ReactNode
	iconAfter?: React.ReactNode
	testId?: string
}

function Item({
	children,
	className,
	iconBefore,
	iconAfter,
	testId,
	...props
}: BreadcrumbsItemProps) {
	return (
		<>
			<a
				className={twMerge(
					"text-text-subtle hover:text-text-subtle flex items-center",
					className,
				)}
				data-testid={testId}
				{...props}
			>
				{iconBefore && iconBefore}
				{children}
				{iconAfter && iconAfter}
			</a>

			<span className="pl-1.5 pr-1 last:hidden last:truncate">/</span>
		</>
	)
}

Breadcrumbs.Item = Item
