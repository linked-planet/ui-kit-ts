import { Button, ButtonGroup, CodeBlock, Tabs } from "@linked-planet/ui-kit-ts"
import type React from "react"
import {
	type ElementRef,
	type ReactNode,
	useEffect,
	useMemo,
	useRef,
	useState,
} from "react"
import { useLocation, useSearchParams } from "react-router-dom"
import styles from "./ShowCaseWrapperItem.module.css"

export interface Package {
	name: string
	url: string
}

export interface ShowcaseProps {
	overallSourceCode: string
	id?: string
}

export interface ShowcaseWrapperItemProps {
	id?: string
	name: string
	description?: React.ReactNode
	packages: Array<Package>
	overallSourceCode: string
	examples: {
		title: string
		example: ReactNode
		sourceCodeExampleId: string
	}[]
}

function extractSourceCodeExample(
	overallSourceCode: string,
	sourceCodeExampleId: string,
) {
	const exampleCodeStartMarker = `//#region ${sourceCodeExampleId}`
	const exampleCodeEndMarker = `//#endregion ${sourceCodeExampleId}`
	if (
		overallSourceCode.indexOf(exampleCodeStartMarker) &&
		overallSourceCode.indexOf(exampleCodeEndMarker)
	) {
		const result = overallSourceCode.substring(
			overallSourceCode.indexOf(exampleCodeStartMarker) +
				exampleCodeStartMarker.length,
			overallSourceCode.indexOf(exampleCodeEndMarker),
		)
		return result
	}
	return ""
}

export default function ShowcaseWrapperItem({
	overallSourceCode,
	id,
	name,
	description,
	packages,
	examples,
}: ShowcaseWrapperItemProps) {
	const ref = useRef<ElementRef<"div">>(null)
	//console.info("OverallSourceCode, SourceCodeExampleId", props.overallSourceCode, props.sourceCodeExampleId)

	const location = useLocation()
	const [params, setParams] = useSearchParams()
	const exampleFromParam = params.get("example")

	const [example, setExample] = useState(exampleFromParam)

	useEffect(() => {
		if (location.pathname !== "/wrappers") {
			return
		}
		const handleIntersection = (entries: IntersectionObserverEntry[]) => {
			entries.forEach((entry) => {
				if (entry.isIntersecting) {
					if (ref.current) {
						window.history.pushState({}, "", `#${ref.current.id}`)
					}
				}
			})
		}

		const observer = new IntersectionObserver(handleIntersection)

		if (ref.current) {
			observer.observe(ref.current)
		}

		return () => observer.disconnect()
	}, [location.pathname])

	useEffect(() => {
		if (window.location.hash === `#${id}`) {
			if (ref.current) {
				ref.current.scrollIntoView()
			}
		}
	}, [id])

	return (
		<div id={id} data-menu-name={name} className="my-12" ref={ref}>
			<h3>{name}</h3>

			<small>
				<span>Packages: </span>
				{packages.map((pack) => {
					return (
						<a
							href={pack.url}
							key={pack.name}
							target="_blank"
							rel="noreferrer"
						>
							{pack.name}
						</a>
					)
				})}
			</small>
			<div>
				{description && (
					<div className="pb-2 pt-1 text-sm font-light">
						{description}
					</div>
				)}
			</div>

			<Tabs.Container
				id={`${name}-tabs`}
				selected={example}
				onChange={(title) => {
					setExample(title)
					params.set("example", title)
					setParams(params)
				}}
			>
				<Tabs.TabList>
					{examples.map((example) => {
						return (
							<Tabs.Tab key={example.title} label={example.title}>
								{example.title}
							</Tabs.Tab>
						)
					})}
				</Tabs.TabList>
				{examples.map((example) => {
					return (
						<Tabs.TabPanel
							key={example.sourceCodeExampleId}
							label={example.title}
							className="overflow-hidden"
						>
							<ShowCaseExample
								example={example.example}
								overallSourceCode={overallSourceCode}
								sourceCodeExampleId={
									example.sourceCodeExampleId
								}
							/>
						</Tabs.TabPanel>
					)
				})}
			</Tabs.Container>
		</div>
	)
}

function ShowCaseExample({
	example,
	sourceCodeExampleId,
	overallSourceCode,
}: {
	example: ReactNode
	sourceCodeExampleId: string
	overallSourceCode: string
}) {
	const [content, setContent] = useState<"example" | "source">("example")

	const code = useMemo(
		() => extractSourceCodeExample(overallSourceCode, sourceCodeExampleId),
		[overallSourceCode, sourceCodeExampleId],
	)

	return (
		<div className="bg-surface w-full overflow-hidden py-4">
			<ButtonGroup>
				<Button
					selected={content === "example"}
					onClick={() => setContent("example")}
				>
					Example
				</Button>
				<Button
					selected={content === "source"}
					onClick={() => setContent("source")}
				>
					Source
				</Button>
			</ButtonGroup>
			{content === "example" && (
				<div className={`${styles.example} overflow-auto`}>
					{example}
				</div>
			)}
			{content === "source" && (
				<div>
					{!code && <span>No sources found...</span>}
					{code && (
						<div>
							<CodeBlock language="typescript">{code}</CodeBlock>
						</div>
					)}
				</div>
			)}
		</div>
	)
}
