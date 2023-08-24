import React, { ElementRef, ReactNode, useEffect, useRef } from "react"
import Tabs, { Tab, TabList, TabPanel } from "@atlaskit/tabs"
import { CodeBlock } from "@atlaskit/code"

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
	packages: Array<Package>
	sourceCodeExampleId?: string
	overallSourceCode?: string
	examples: Array<ReactNode>
}

function extractSourceCodeExample(
	overallSourceCode: string,
	sourceCodeExampleId: string,
) {
	const exampleCodeStartMarker = "// region: " + sourceCodeExampleId
	const exampleCodeEndMarker = "// endregion: " + sourceCodeExampleId
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

export default function ShowcaseWrapperItem(props: ShowcaseWrapperItemProps) {
	const ref = useRef<ElementRef<"div">>(null)
	let code = ""
	//console.info("OverallSourceCode, SourceCodeExampleId", props.overallSourceCode, props.sourceCodeExampleId)
	if (
		props.overallSourceCode != null &&
		props.overallSourceCode != "" &&
		props.sourceCodeExampleId != null &&
		props.sourceCodeExampleId != ""
	) {
		code = extractSourceCodeExample(
			props.overallSourceCode,
			props.sourceCodeExampleId,
		)
	}

	useEffect(() => {
		const handleIntersection = (entries: IntersectionObserverEntry[]) => {
			console.log("INTERSECTION", ref?.current?.id)
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
		if (window.location.hash === "#" + props.id) {
			if (ref.current) {
				ref.current.scrollIntoView()
			}
		}
	}, [props.id])

	/*console.info( "ShowCaseWrapperItem overallSourceCode", props.overallSourceCode )
	console.info( "ShowCaseWrapperItem sourceCodeExampleId", props.sourceCodeExampleId )
	console.info( "ShowCaseWrapperItem Code", code )*/

	return (
		<div
			id={props.id}
			data-menu-name={props.name}
			className="menu"
			style={{
				padding: "20px",
				width: "100%",
			}}
			ref={ref}
		>
			<h3>{props.name}</h3>
			<div style={{ fontWeight: "lighter", fontSize: "0.8rem" }}>
				<span>Packages: </span>
				{props.packages.map((pack, i) => {
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

			<div
				style={{
					marginLeft: "-8px",
					width: "100%",
				}}
			>
				<Tabs id={props.name + "-tabs"}>
					<TabList>
						<Tab>Example</Tab>
						<Tab>Example Source</Tab>
					</TabList>
					<TabPanel>
						<div style={{ overflow: "hidden", width: "100%" }}>
							{props.examples.map((example, i) => {
								return (
									<div key={i} className={styles.example}>
										{example}
									</div>
								)
							})}
						</div>
					</TabPanel>
					<TabPanel>
						<div style={{ overflow: "hidden" }}>
							{code == "" && <span>No sources found...</span>}
							{code != "" && (
								<div>
									<CodeBlock
										text={code}
										language="typescript"
									/>
								</div>
							)}
						</div>
					</TabPanel>
				</Tabs>
			</div>
		</div>
	)
}
