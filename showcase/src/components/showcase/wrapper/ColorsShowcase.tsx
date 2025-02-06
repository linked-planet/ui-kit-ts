import ShowcaseWrapperItem, {
	type ShowcaseProps,
} from "../../ShowCaseWrapperItem/ShowcaseWrapperItem"

//#region colorstest
function Colors() {
	return (
		<>
			<div className="grid w-full grid-cols-4 gap-2">
				{/* blue */}
				<div className="bg-blue border-blue-border hover:bg-blue-hovered active:bg-blue-pressed text-blue-text-bold border-2 p-1">
					blue
				</div>
				<div className="bg-blue-subtle border-blue-border hover:bg-blue-subtle-hovered active:bg-blue-subtle-pressed text-blue-text border-2 p-1">
					blue-subtle
				</div>
				<div className="bg-blue-subtlest border-blue-border hover:bg-blue-subtlest-hovered active:bg-blue-subtlest-pressed text-blue-text border-2 p-1">
					blue-subtlest
				</div>
				<div className="bg-blue-bold border-blue-border hover:bg-blue-bold-hovered active:bg-blue-bold-pressed text-blue-text-inverse border-2 p-1">
					blue-bold
				</div>

				{/* sky */}
				<div className="bg-sky border-sky-border hover:bg-sky-hovered active:bg-sky-pressed text-sky-text-bold border-2 p-1">
					sky
				</div>
				<div className="bg-sky-subtle border-sky-border hover:bg-sky-subtle-hovered active:bg-sky-subtle-pressed text-sky-text border-2 p-1">
					sky-subtle
				</div>
				<div className="bg-sky-subtlest border-sky-border hover:bg-sky-subtlest-hovered active:bg-sky-subtlest-pressed text-sky-text border-2 p-1">
					sky-subtlest
				</div>
				<div className="bg-sky-bold border-sky-border hover:bg-sky-bold-hovered active:bg-sky-bold-pressed text-sky-text-inverse border-2 p-1">
					sky-bold
				</div>
				{/* cyan */}
				<div className="bg-cyan border-cyan-border hover:bg-cyan-hovered active:bg-cyan-pressed text-cyan-text-bold border-2 p-1">
					cyan
				</div>
				<div className="bg-cyan-subtle border-cyan-border hover:bg-cyan-subtle-hovered active:bg-cyan-subtle-pressed text-cyan-text border-2 p-1">
					cyan-subtle
				</div>
				<div className="bg-cyan-subtlest border-cyan-border hover:bg-cyan-subtlest-hovered active:bg-cyan-subtlest-pressed text-cyan-text border-2 p-1">
					cyan-subtlest
				</div>
				<div className="bg-cyan-bold border-cyan-border hover:bg-cyan-bold-hovered active:bg-cyan-bold-pressed text-cyan-text-inverse border-2 p-1">
					cyan-bold
				</div>
				{/* teal */}
				<div className="bg-teal border-teal-border hover:bg-teal-hovered active:bg-teal-pressed text-teal-text-bold border-2 p-1">
					teal
				</div>
				<div className="bg-teal-subtle border-teal-border hover:bg-teal-subtle-hovered active:bg-teal-subtle-pressed text-teal-text border-2 p-1">
					teal-subtle
				</div>
				<div className="bg-teal-subtlest border-teal-border hover:bg-teal-subtlest-hovered active:bg-teal-subtlest-pressed text-teal-text border-2 p-1">
					teal-subtlest
				</div>
				<div className="bg-teal-bold border-teal-border hover:bg-teal-bold-hovered active:bg-teal-bold-pressed text-teal-text-inverse border-2 p-1">
					teal-bold
				</div>
				{/* emerald */}
				<div className="bg-emerald border-emerald-border hover:bg-emerald-hovered active:bg-emerald-pressed text-emerald-text-bold border-2 p-1">
					emerald
				</div>
				<div className="bg-emerald-subtle border-emerald-border hover:bg-emerald-subtle-hovered active:bg-emerald-subtle-pressed text-emerald-text border-2 p-1">
					emerald-subtle
				</div>
				<div className="bg-emerald-subtlest border-emerald-border hover:bg-emerald-subtlest-hovered active:bg-emerald-subtlest-pressed text-emerald-text border-2 p-1">
					emerald-subtlest
				</div>
				<div className="bg-emerald-bold border-emerald-border hover:bg-emerald-bold-hovered active:bg-emerald-bold-pressed text-emerald-text-inverse border-2 p-1">
					emerald-bold
				</div>
				{/* green */}
				<div className="bg-green border-green-border hover:bg-green-hovered active:bg-green-pressed text-green-text-bold border-2 p-1">
					green
				</div>
				<div className="bg-green-subtle border-green-border hover:bg-green-subtle-hovered active:bg-green-subtle-pressed text-green-text border-2 p-1">
					green-subtle
				</div>
				<div className="bg-green-subtlest border-green-border hover:bg-green-subtlest-hovered active:bg-green-subtlest-pressed text-green-text border-2 p-1">
					green-subtlest
				</div>
				<div className="bg-green-bold border-green-border hover:bg-green-bold-hovered active:bg-green-bold-pressed text-green-text-inverse border-2 p-1">
					green-bold
				</div>

				{/* lime */}
				<div className="bg-lime border-lime-border hover:bg-lime-hovered active:bg-lime-pressed text-lime-text-bold border-2 p-1">
					lime
				</div>
				<div className="bg-lime-subtle border-lime-border hover:bg-lime-subtle-hovered active:bg-lime-subtle-pressed text-lime-text border-2 p-1">
					lime-subtle
				</div>
				<div className="bg-lime-subtlest border-lime-border hover:bg-lime-subtlest-hovered active:bg-lime-subtlest-pressed text-lime-text border-2 p-1">
					lime-subtlest
				</div>
				<div className="bg-lime-bold border-lime-border hover:bg-lime-bold-hovered active:bg-lime-bold-pressed text-lime-text-inverse border-2 p-1">
					lime-bold
				</div>
				{/* red */}
				<div className="bg-red border-red-border hover:bg-red-hovered active:bg-red-pressed text-red-text-bold border-2 p-1">
					red
				</div>
				<div className="bg-red-subtle border-red-border hover:bg-red-subtle-hovered active:bg-red-subtle-pressed text-red-text border-2 p-1">
					red-subtle
				</div>
				<div className="bg-red-subtlest border-red-border hover:bg-red-subtlest-hovered active:bg-red-subtlest-pressed text-red-text border-2 p-1">
					red-subtlest
				</div>
				<div className="bg-red-bold border-red-border hover:bg-red-bold-hovered active:bg-red-bold-pressed text-red-text-inverse border-2 p-1">
					red-bold
				</div>
				{/* orange */}
				<div className="bg-orange border-orange-border hover:bg-orange-hovered active:bg-orange-pressed text-orange-text-bold border-2 p-1">
					orange
				</div>
				<div className="bg-orange-subtle border-orange-border hover:bg-orange-subtle-hovered active:bg-orange-subtle-pressed text-orange-text border-2 p-1">
					orange-subtle
				</div>
				<div className="bg-orange-subtlest border-orange-border hover:bg-orange-subtlest-hovered active:bg-orange-subtlest-pressed text-orange-text border-2 p-1">
					orange-subtlest
				</div>
				<div className="bg-orange-bold border-orange-border hover:bg-orange-bold-hovered active:bg-orange-bold-pressed text-orange-text-inverse border-2 p-1">
					orange-bold
				</div>
				{/* amber */}
				<div className="bg-amber border-amber-border hover:bg-amber-hovered active:bg-amber-pressed text-amber-text-bold border-2 p-1">
					amber
				</div>
				<div className="bg-amber-subtle border-amber-border hover:bg-amber-subtle-hovered active:bg-amber-subtle-pressed text-amber-text border-2 p-1">
					amber-subtle
				</div>
				<div className="bg-amber-subtlest border-amber-border hover:bg-amber-subtlest-hovered active:bg-amber-subtlest-pressed text-amber-text border-2 p-1">
					amber-subtlest
				</div>
				<div className="bg-amber-bold border-amber-border hover:bg-amber-bold-hovered active:bg-amber-bold-pressed text-amber-text-inverse border-2 p-1">
					amber-bold
				</div>
				{/* yellow */}
				<div className="bg-yellow border-yellow-border hover:bg-yellow-hovered active:bg-yellow-pressed text-yellow-text-bold border-2 p-1">
					yellow
				</div>
				<div className="bg-yellow-subtle border-yellow-border hover:bg-yellow-subtle-hovered active:bg-yellow-subtle-pressed text-yellow-text border-2 p-1">
					yellow-subtle
				</div>
				<div className="bg-yellow-subtlest border-yellow-border hover:bg-yellow-subtlest-hovered active:bg-yellow-subtlest-pressed text-yellow-text border-2 p-1">
					yellow-subtlest
				</div>
				<div className="bg-yellow-bold border-yellow-border hover:bg-yellow-bold-hovered active:bg-yellow-bold-pressed text-yellow-text-inverse border-2 p-1">
					yellow-bold
				</div>
				{/* pink */}
				<div className="bg-pink border-pink-border hover:bg-pink-hovered active:bg-pink-pressed text-pink-text-bold border-2 p-1">
					pink
				</div>
				<div className="bg-pink-subtle border-pink-border hover:bg-pink-subtle-hovered active:bg-pink-subtle-pressed text-pink-text border-2 p-1">
					pink-subtle
				</div>
				<div className="bg-pink-subtlest border-pink-border hover:bg-pink-subtlest-hovered active:bg-pink-subtlest-pressed text-pink-text border-2 p-1">
					pink-subtlest
				</div>
				<div className="bg-pink-bold border-pink-border hover:bg-pink-bold-hovered active:bg-pink-bold-pressed text-pink-text-inverse border-2 p-1">
					pink-bold
				</div>
				{/* fuchsia */}
				<div className="bg-fuchsia border-fuchsia-border hover:bg-fuchsia-hovered active:bg-fuchsia-pressed text-fuchsia-text-bold border-2 p-1">
					fuchsia
				</div>
				<div className="bg-fuchsia-subtle border-fuchsia-border hover:bg-fuchsia-subtle-hovered active:bg-fuchsia-subtle-pressed text-fuchsia-text border-2 p-1">
					fuchsia-subtle
				</div>
				<div className="bg-fuchsia-subtlest border-fuchsia-border hover:bg-fuchsia-subtlest-hovered active:bg-fuchsia-subtlest-pressed text-fuchsia-text border-2 p-1">
					fuchsia-subtlest
				</div>
				<div className="bg-fuchsia-bold border-fuchsia-border hover:bg-fuchsia-bold-hovered active:bg-fuchsia-bold-pressed text-fuchsia-text-inverse border-2 p-1">
					fuchsia-bold
				</div>
				{/* purple */}
				<div className="bg-purple border-purple-border hover:bg-purple-hovered active:bg-purple-pressed text-purple-text-bold border-2 p-1">
					purple
				</div>
				<div className="bg-purple-subtle border-purple-border hover:bg-purple-subtle-hovered active:bg-purple-subtle-pressed text-purple-text border-2 p-1">
					purple-subtle
				</div>
				<div className="bg-purple-subtlest border-purple-border hover:bg-purple-subtlest-hovered active:bg-purple-subtlest-pressed text-purple-text border-2 p-1">
					purple-subtlest
				</div>
				<div className="bg-purple-bold border-purple-border hover:bg-purple-bold-hovered active:bg-purple-bold-pressed text-purple-text-inverse border-2 p-1">
					purple-bold
				</div>
				{/* violet */}
				<div className="bg-violet border-violet-border hover:bg-violet-hovered active:bg-violet-pressed text-violet-text-bold border-2 p-1">
					violet
				</div>
				<div className="bg-violet-subtle border-violet-border hover:bg-violet-subtle-hovered active:bg-violet-subtle-pressed text-violet-text border-2 p-1">
					violet-subtle
				</div>
				<div className="bg-violet-subtlest border-violet-border hover:bg-violet-subtlest-hovered active:bg-violet-subtlest-pressed text-violet-text border-2 p-1">
					violet-subtlest
				</div>
				<div className="bg-violet-bold border-violet-border hover:bg-violet-bold-hovered active:bg-violet-bold-pressed text-violet-text-inverse border-2 p-1">
					violet-bold
				</div>
				{/* indigo */}
				<div className="bg-indigo border-indigo-border hover:bg-indigo-hovered active:bg-indigo-pressed text-indigo-text-bold border-2 p-1">
					indigo
				</div>
				<div className="bg-indigo-subtle border-indigo-border hover:bg-indigo-subtle-hovered active:bg-indigo-subtle-pressed text-indigo-text border-2 p-1">
					indigo-subtle
				</div>
				<div className="bg-indigo-subtlest border-indigo-border hover:bg-indigo-subtlest-hovered active:bg-indigo-subtlest-pressed text-indigo-text border-2 p-1">
					indigo-subtlest
				</div>
				<div className="bg-indigo-bold border-indigo-border hover:bg-indigo-bold-hovered active:bg-indigo-bold-pressed text-indigo-text-inverse border-2 p-1">
					indigo-bold
				</div>
				{/* slate */}
				<div className="bg-slate border-slate-border hover:bg-slate-hovered active:bg-slate-pressed text-slate-text-bold border-2 p-1">
					slate
				</div>
				<div className="bg-slate-subtle border-slate-border hover:bg-slate-subtle-hovered active:bg-slate-subtle-pressed text-slate-text border-2 p-1">
					slate-subtle
				</div>
				<div className="bg-slate-subtlest border-slate-border hover:bg-slate-subtlest-hovered active:bg-slate-subtlest-pressed text-slate-text border-2 p-1">
					slate-subtlest
				</div>
				<div className="bg-slate-bold border-slate-border hover:bg-slate-bold-hovered active:bg-slate-bold-pressed text-slate-text-inverse border-2 p-1">
					slate-bold
				</div>
				{/* gray */}
				<div className="bg-gray border-gray-border hover:bg-gray-hovered active:bg-gray-pressed text-gray-text-bold border-2 p-1">
					gray
				</div>
				<div className="bg-gray-subtle border-gray-border hover:bg-gray-subtle-hovered active:bg-gray-subtle-pressed text-gray-text border-2 p-1">
					gray-subtle
				</div>
				<div className="bg-gray-subtlest border-gray-border hover:bg-gray-subtlest-hovered active:bg-gray-subtlest-pressed text-gray-text border-2 p-1">
					gray-subtlest
				</div>
				<div className="bg-gray-bold border-gray-border hover:bg-gray-bold-hovered active:bg-gray-bold-pressed text-gray-text-inverse border-2 p-1">
					gray-bold
				</div>
				<div className="bg-zinc border-zinc-border hover:bg-zinc-hovered active:bg-zinc-pressed text-zinc-text-bold border-2 p-1">
					zinc
				</div>
				<div className="bg-zinc-subtle border-zinc-border hover:bg-zinc-subtle-hovered active:bg-zinc-subtle-pressed text-zinc-text border-2 p-1">
					zinc-subtle
				</div>
				<div className="bg-zinc-subtlest border-zinc-border hover:bg-zinc-subtlest-hovered active:bg-zinc-subtlest-pressed text-zinc-text border-2 p-1">
					zinc-subtlest
				</div>
				<div className="bg-zinc-bold border-zinc-border hover:bg-zinc-bold-hovered active:bg-zinc-bold-pressed text-zinc-text-inverse border-2 p-1">
					zinc-bold
				</div>
			</div>
			<hr className="mt-4" />

			<div className="mt-4 grid w-full grid-cols-3 gap-2">
				<div className="bg-selected hover:bg-selected-hovered text-selected-text-inverse active:bg-selected-pressed border-selected-border border-2 p-1">
					selected
				</div>
				<div className="bg-selected-bold text-text-inverse hover:bg-selected-bold-hovered active:bg-selected-bold-pressed border-selected-border border-2 p-1">
					selected-bold
				</div>
				<div className="bg-selected-subtle text-text hover:bg-selected-subtle-hovered active:bg-selected-subtle-pressed border-selected-border border-2 p-1">
					selected-bold
				</div>
				<div className="bg-neutral text-text hover:bg-neutral-hovered active:bg-neutral-pressed border-2 p-1">
					neutral
				</div>
				<div className="bg-neutral-bold text-text hover:bg-neutral-bold-hovered active:bg-neutral-bold-pressed border-2 p-1">
					neutral-bold
				</div>
				<div className="bg-neutral-subtle text-text hover:bg-neutral-subtle-hovered active:bg-neutral-subtle-pressed border-2 p-1">
					neutral-subtle
				</div>
				<div className="bg-warning text-warning-text hover:bg-warning-hovered active:bg-warning-pressed border-2 p-1">
					warning
				</div>
				<div className="bg-warning-bold text-text hover:bg-warning-bold-hovered active:bg-warning-bold-pressed border-2 p-1">
					warning-bold
				</div>
				<div />
				<div className="bg-danger text-danger-text border-danger-border hover:bg-danger-hovered active:bg-danger-pressed border-2 p-1">
					danger
				</div>
				<div className="bg-danger-bold text-text hover:bg-danger-bold-hovered active:bg-danger-bold-pressed border-2 p-1">
					danger-bold
				</div>
				<div />
				<div className="bg-success text-success-text border-success-border hover:bg-success-hovered active:bg-success-pressed border-2 p-1">
					success
				</div>
				<div className="bg-success-bold text-text hover:bg-success-bold-hovered active:bg-success-bold-pressed border-2 p-1">
					success-bold
				</div>
				<div />
				<div className="bg-information text-information-text border-information-border hover:bg-information-hovered active:bg-information-pressed border-2 p-1">
					information
				</div>
				<div className="bg-information-bold text-text hover:bg-information-bold-hovered active:bg-information-bold-pressed border-2 p-1">
					information-bold
				</div>
				<div />
				<div className="bg-brand text-brand-text border-brand-border hover:bg-brand-hovered active:bg-brand-pressed border-2 p-1">
					brand
				</div>
				<div className="bg-brand-bold text-text hover:bg-brand-bold-hovered active:bg-brand-bold-pressed border-2 p-1">
					brand-bold
				</div>
			</div>
		</>
	)
}
//#endregion colorstest

export default function LayeringShowcase(props: ShowcaseProps) {
	return (
		<ShowcaseWrapperItem
			name="Colors"
			{...props}
			packages={[
				{
					name: "@linked-planet/ui-kit-ts",
					url: "https://www.github.com/linked-planet/ui-kit-ts",
				},
			]}
			description="Not a component but only a showcase of the color system."
			examples={[
				{
					title: "Colors",
					example: <Colors />,
					sourceCodeExampleId: "colorstest",
				},
			]}
		/>
	)
}
