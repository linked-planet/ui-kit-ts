import React from "react"
import { CodeBlock } from "@atlaskit/code"
import { useDispatch } from "react-redux"
import { useEffect } from "react"

function IntroPage() {
	const dispatch = useDispatch()
	useEffect(() => {
		dispatch({
			type: "SET_MENU",
		})
	}, [dispatch])

	return (
		<div>
			<h1>Welcome to UI-Kit-TS</h1>
			<h3>Usage</h3>

			<p>
				All components have a &lsquo;Packages&rsquo; field in their
				documentation specifying the package to use for this component.
				<br></br>
				<br></br>
				For the <b>@atlaskit/*</b> components please install them
				directly to include them correctly in your project&apos;s
				package.json.
				<br></br>
				<br></br>
				For the <b>@linked-planet/ui-kit-ts</b> components you can
				install this package.
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
				<code>npm install -s @linked-planet/ui-kit-ts</code>
				<p>
					It looks like CodeBlock of @atlaskit/code is bugged when
					using the bundle. It does not show the code at the moment.
				</p>
				<CodeBlock
					text="npm install -s @linked-planet/ui-kit-ts"
					showLineNumbers={false}
					language="bash"
				/>
			</div>
		</div>
	)
}

export default IntroPage
