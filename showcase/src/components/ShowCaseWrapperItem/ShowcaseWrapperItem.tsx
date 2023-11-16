import React, {
	ElementRef,
	ReactNode,
	useEffect,
	useMemo,
	useRef,
	useState,
} from "react"
import {
	Tabs,
	Tab,
	TabList,
	TabPanel,
	Button,
	ButtonGroup,
} from "@linked-planet/ui-kit-ts"
import { CodeBlock } from "@atlaskit/code"

import styles from "./ShowCaseWrapperItem.module.css"
import { useLocation, useSearchParams } from "react-router-dom"

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
	const exampleCodeStartMarker = "//#region " + sourceCodeExampleId
	const exampleCodeEndMarker = "//#endregion " + sourceCodeExampleId
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
						window.history.pushState({}, "", "#" + ref.current.id)
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
		if (window.location.hash === "#" + id) {
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
				{packages.map((pack, i) => {
					return (
						<a
							href={pack.url}
							key={i}
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

			<Tabs
				id={name + "-tabs"}
				selected={example}
				onChange={(title) => {
					setExample(title)
					params.set("example", title)
					setParams(params)
				}}
			>
				<TabList>
					{examples.map((example) => {
						return (
							<Tab key={example.title} label={example.title}>
								{example.title}
							</Tab>
						)
					})}
				</TabList>
				{examples.map((example, i) => {
					return (
						<TabPanel key={i} label={example.title}>
							<ShowCaseExample
								example={example.example}
								overallSourceCode={overallSourceCode}
								sourceCodeExampleId={
									example.sourceCodeExampleId
								}
							/>
						</TabPanel>
					)
				})}
			</Tabs>
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
		<div className="bg-surface w-full py-4">
			<ButtonGroup>
				<Button
					isSelected={content === "example"}
					onClick={() => setContent("example")}
				>
					Example
				</Button>
				<Button
					isSelected={content === "source"}
					onClick={() => setContent("source")}
				>
					Source
				</Button>
			</ButtonGroup>
			{content === "example" && (
				<div className={styles.example}>{example}</div>
			)}
			{content === "source" && (
				<div>
					{!code && <span>No sources found...</span>}
					{code && (
						<div>
							<CodeBlock text={code} language="typescript" />
						</div>
					)}
				</div>
			)}
		</div>
	)
}
