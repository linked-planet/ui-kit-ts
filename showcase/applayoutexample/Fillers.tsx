import React from "react"

export default function Fillers() {
	const fillers = Array.from({ length: 100 }, (_, i) => (
		// biome-ignore lint/suspicious/noArrayIndexKey: intentional
		<li key={i}>
			<div className="bg-brand border-brand-bold my-2 h-8 w-full rounded-sm border-2" />
		</li>
	))

	return (
		<div className="mt-4 w-full">
			<ul className="m-0 w-full list-none p-0">{fillers}</ul>
		</div>
	)
}
