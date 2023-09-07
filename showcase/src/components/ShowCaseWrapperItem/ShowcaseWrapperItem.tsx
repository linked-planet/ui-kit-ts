import React, {
	ElementRef,
	ReactNode,
	useEffect,
	useMemo,
	useRef,
	useState,
} from "react"
import Tabs, { Tab, TabList, TabPanel } from "@atlaskit/tabs"
import { CodeBlock } from "@atlaskit/code"

import styles from "./ShowCaseWrapperItem.module.css"
import { token } from "@atlaskit/tokens"
import Button, { ButtonGroup } from "@atlaskit/button"

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

	useEffect(() => {
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
	}, [])

	useEffect(() => {
		if (window.location.hash === "#" + id) {
			if (ref.current) {
				ref.current.scrollIntoView()
			}
		}
	}, [id])

	/*console.info( "ShowCaseWrapperItem overallSourceCode", props.overallSourceCode )
	console.info( "ShowCaseWrapperItem sourceCodeExampleId", props.sourceCodeExampleId )
	console.info( "ShowCaseWrapperItem Code", code )*/

	return (
		<div
			id={id}
			data-menu-name={name}
			style={{
				marginTop: "40px",
				marginBottom: "40px",
			}}
			ref={ref}
		>
			<h3>{name}</h3>

			<div
				style={{
					fontWeight: "lighter",
					fontSize: "0.8rem",
					paddingTop: "0.2rem",
					paddingBottom: "0.5rem",
				}}
			>
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
			</div>
			<div>
				{description && (
					<div className="font-light pt-1 pb-2 text-sm">
						{description}
					</div>
				)}
			</div>

			<Tabs id={name + "-tabs"}>
				<TabList>
					{examples.map((example) => {
						return <Tab key={example.title}>{example.title}</Tab>
					})}
				</TabList>
				{examples.map((example, i) => {
					return (
						<TabPanel key={i}>
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
		<div
			style={{
				width: "100%",
				backgroundColor: token("elevation.surface", "#fff"),
				paddingTop: "12px",
				paddingBottom: "12px",
			}}
		>
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
				<div
					style={{
						padding: "0px",
					}}
				>
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
