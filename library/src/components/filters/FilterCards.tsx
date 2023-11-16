import { useDebounceHelper } from "@linked-planet/ui-kit-ts/utils"
import React, {
	ChangeEvent,
	useCallback,
	useMemo,
	useRef,
	useState,
} from "react"
import { twMerge } from "tailwind-merge"
import EditorSearchIcon from "@atlaskit/icon/glyph/editor/search"
import EditorCloseIcon from "@atlaskit/icon/glyph/editor/close"

/**
 * the FilterType is the same as the Filter generated by the backends Swagger file
 * but with all properties required and readonly
 */
export type FilterType = {
	readonly attributeName: string
	readonly availableValues: readonly string[]
	readonly selectableValues: readonly string[]
	readonly selectedValues: readonly string[]
} // this is equivalent to Readonly<Required<Filter>>

/**
 * FilterCard is a single filter card, if you need multiple filters use FilterCards
 */
export function FilterCard({
	onAttributeClick,
	onSelectedChanged,
	filter,
	className,
	style,
}: {
	onAttributeClick?: (filterIdent: string, attribute: string) => void
	onSelectedChanged?: (filterIdent: string, attributes: string[]) => void
	filter: FilterType
	className?: string
	style?: React.CSSProperties
}) {
	const { availableValues, selectedValues, selectableValues } = filter
	const [searchString, setSearchString] = useState<string>("")
	const inputRef = useRef<HTMLInputElement>(null)

	const visibleValues = useMemo(() => {
		if (!searchString) {
			return availableValues
		}
		return availableValues.filter((it) =>
			it.toLowerCase().includes(searchString.toLowerCase()),
		)
	}, [searchString, availableValues])

	const debounceHelper = useDebounceHelper()
	const onSearchInputChange = useCallback(
		(e: ChangeEvent<HTMLInputElement>) => {
			const searchString = e.target.value
			debounceHelper(() => setSearchString(searchString), 250)
		},
		[debounceHelper],
	)

	return useMemo(
		() => (
			<div
				className={twMerge(
					"border-border bg-surface box-border flex flex-col overflow-hidden rounded border",
					className,
				)}
				style={style}
			>
				<div
					className={`bg-surface-sunken border-border flex items-center border-b px-1 py-0.5 font-bold`}
				>
					<fieldset className="flex min-w-[1rem] flex-1 items-center">
						<input
							ref={inputRef}
							required
							type="text"
							placeholder={filter.attributeName}
							className={`focus:bg-surface  focus:border-border placeholder:text-text focus:placeholder:text-disabled-text peer relative min-w-0 flex-1 truncate  bg-transparent px-0.5 outline-none transition-transform duration-100 ease-in-out focus:translate-y-0 focus:border ${
								searchString
									? "translate-y-0"
									: "-translate-y-1.5"
							}`}
							defaultValue={searchString}
							onChange={onSearchInputChange}
						/>
						{/* seems like that the peer-* dependent property needs to be after the peer tailwind definition usage */}
						<legend
							className={`text-text-subtle h-3 pl-0.5 text-[0.6rem] font-light transition duration-300 ease-in-out peer-focus:opacity-100 ${
								searchString ? "opacity-100" : "opacity-0"
							}`}
						>
							{filter.attributeName}
						</legend>
					</fieldset>
					<div
						className={`text-disabled-text hover:text-brand-bold-hovered active:text-brand-bold-pressed flex flex-none cursor-pointer items-center justify-center duration-100 ease-in-out peer-focus:translate-y-0`}
						onClick={() => {
							inputRef.current?.focus()
							if (searchString) {
								setSearchString("")
								if (inputRef.current)
									inputRef.current.value = ""
							}
						}}
					>
						{searchString ? (
							<EditorCloseIcon label="Clear" />
						) : (
							<EditorSearchIcon label="Search" />
						)}
						<div
							className={`text-text-inverse bg-danger-bold flex items-center justify-center rounded text-xs duration-1000 ease-in-out ${
								!selectedValues.length ? "w-0" : "w-5"
							}`}
						>
							{selectedValues.length ? selectedValues.length : ""}
						</div>
					</div>
				</div>
				<div className="flex flex-1 flex-col overflow-y-auto overflow-x-hidden">
					{visibleValues.length === 0 && (
						<div className="text-disabled-text px-2 py-0.5">
							No results
						</div>
					)}
					{visibleValues.map((item) => {
						const isSelected =
							selectedValues?.includes(item) ?? false
						const isSelectable =
							selectableValues?.includes(item) ?? false

						const onClick = !isSelectable
							? undefined
							: onAttributeClick || onSelectedChanged
							  ? () => {
										onAttributeClick?.(
											filter.attributeName,
											item,
										)
										if (onSelectedChanged) {
											const removed =
												selectedValues.filter(
													(it) => it !== item,
												)
											if (
												removed.length ===
												selectedValues.length
											) {
												onSelectedChanged(
													filter.attributeName,
													[...selectedValues, item],
												)
											} else {
												onSelectedChanged(
													filter.attributeName,
													removed,
												)
											}
										}
							    }
							  : undefined

						return (
							<div
								className={`px-2 py-0.5 ${
									!isSelectable
										? "text-disabled-text cursor-not-allowed"
										: isSelected
										  ? "text-selected-text bg-selected hover:bg-selected-hovered active:bg-selected-pressed cursor-pointer"
										  : "hover:bg-surface-hovered active:bg-surface-pressed cursor-pointer"
								}`}
								key={item}
								onClick={onClick}
							>
								<div className="truncate">{item}</div>
							</div>
						)
					})}
				</div>
			</div>
		),
		[
			className,
			filter.attributeName,
			onAttributeClick,
			onSearchInputChange,
			onSelectedChanged,
			searchString,
			selectableValues,
			selectedValues,
			style,
			visibleValues,
		],
	)
}

/**
 * FilterCards is a collection of FilterCards, horizontally aligned and scrollable
 */
export function FilterCards({
	filters,
	onAttributeClick,
	onSelectedChanged,
	style,
	className,
}: {
	filters: readonly FilterType[]
	onAttributeClick?: (filterCategory: string, attribute: string) => void
	onSelectedChanged?: (filterCategory: string, attributes: string[]) => void
	style?: React.CSSProperties
	className?: string
}) {
	const filterCards = useMemo(
		() =>
			filters.map((filter) => {
				return (
					<FilterCard
						key={filter.attributeName}
						filter={filter}
						onAttributeClick={onAttributeClick}
						onSelectedChanged={onSelectedChanged}
					/>
				)
			}),
		[filters, onAttributeClick, onSelectedChanged],
	)

	return (
		<div
			className={twMerge(
				"flex w-full flex-row gap-2 overflow-x-auto px-2 py-1",
				className,
			)}
			style={{
				scrollbarGutter: "stable both-edges",
				...style,
			}}
		>
			{filterCards}
		</div>
	)
}
