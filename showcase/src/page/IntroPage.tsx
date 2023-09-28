import React from "react"
import styled from "@emotion/styled"
import { token } from "@atlaskit/tokens"

const releaseTag = import.meta.env.VITE_GH_RELEASE_TAG

console.log("ui-kit-ts release:", releaseTag)

const Code = styled.div`
	overflow: auto;
	margin-top: 0.5rem;
	margin-bottom: 0.5rem;
	background-color: ${token("color.background.neutral", "#f4f5f7")};
	border-radius: 3px;
	font-family: monospace;
	padding: 0.5rem;
`

function IntroPage() {
	return (
		<div
			style={{
				margin: "3rem",
			}}
		>
			<h1>Welcome to UI-Kit-TS</h1>
			<h4>Release: {releaseTag}</h4>
			<h2>Usage</h2>
			<br></br>

			<p>
				All components have a &lsquo;Packages&rsquo; field in their
				documentation specifying the package to use for this component.
				<br></br>
				<br></br>
				For the <b>@atlaskit/*</b> components please install them
				directly to include them correctly in your project&apos;s
				package.json.
				<br></br>
				<Code>npm install @atlaskit/badge</Code>
				<br></br>
				<br></br>
				For the <b>@linked-planet/ui-kit-ts</b> components you can
				install this package.
				<br></br>
				<Code>npm install @linked-planet/ui-kit-ts</Code>
			</p>
			<br></br>
			<hr />
			<br></br>

			<p>
				UI-Kit-TS is published to{" "}
				<a
					href="https://www.npmjs.com/package/@linked-planet/ui-kit-ts"
					rel="noreferrer"
					target="_blank"
				>
					npmjs
				</a>
				.
			</p>
			<p>
				{" "}
				To use it in your project simply add the following dependency to
				your build.gradle:
			</p>
			<div>
				<Code>npm install -s @linked-planet/ui-kit-ts</Code>
			</div>
		</div>
	)
}

export default IntroPage
