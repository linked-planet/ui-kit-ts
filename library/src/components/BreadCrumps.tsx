import React from "react"
import type { ComponentPropsWithoutRef } from "react"
import { twMerge } from "tailwind-merge"

type BreadcrumbsProps = ComponentPropsWithoutRef<"div"> & {
	maxItems?: number
}

export function Breadcrumps({
	className,
	children,
	maxItems,
	...props
}: BreadcrumbsProps) {
	const _children = React.Children.toArray(children)

	const items =
		!maxItems || maxItems - 1 > _children.length
			? _children
			: React.Children.toArray(_children).slice(0, maxItems)
	if (_children.length > 0) {
		items.unshift("... / ")
		items.unshift(_children[_children.length - 1])
	}

	return (
		<div
			className={twMerge(
				"text-text-subtle flex items-center space-x-1 px-4 text-sm",
				className,
			)}
			{...props}
		>
			{items}
		</div>
	)
}

type BreadcrumbsItemProps = ComponentPropsWithoutRef<"a"> & {
	iconBefore?: React.ReactNode
	iconAfter?: React.ReactNode
}

function Item({
	children,
	className,
	iconBefore,
	iconAfter,
	...props
}: BreadcrumbsItemProps) {
	return (
		<>
			<a
				className={twMerge(
					"text-text-subtle hover:text-text flex items-center gap-2 text-base",
					className,
				)}
				{...props}
			>
				{iconBefore && iconBefore}
				{children}
				{iconAfter && iconAfter}
			</a>

			<span className="px-2 last:hidden last:truncate">/</span>
		</>
	)
}

Breadcrumps.Item = Item
