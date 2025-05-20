const releaseTag = import.meta.env.VITE_GH_RELEASE_TAG

console.log("ui-kit-ts release:", releaseTag)

const codeClassNames =
	"bg-neutral my-2 overflow-auto rounded p-2 font-mono block" as const

function IntroPage() {
	return (
		<div className="m-12">
			<h1>Welcome to UI-Kit-TS</h1>
			<h4>Release: {releaseTag}</h4>
			<h2>Usage</h2>
			<br />

			<p>
				All components have a &lsquo;Packages&rsquo; field in their
				documentation specifying the package to use for this component.
				<br />
				<br />
				For the <b>@atlaskit/*</b> components please install them
				directly to include them correctly in your project&apos;s
				package.json.
				<br />
				<span className={codeClassNames}>
					npm install @atlaskit/badge
				</span>
				<br />
				<br />
				For the <b>@linked-planet/ui-kit-ts</b> components you can
				install this package.
				<br />
				<span className={codeClassNames}>
					npm install @linked-planet/ui-kit-ts
				</span>
			</p>
			<br />
			<hr />
			<br />

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
				<div className="bg-neutral my-2 overflow-auto rounded p-2 font-mono">
					npm install -s @linked-planet/ui-kit-ts
				</div>
			</div>
		</div>
	)
}

export default IntroPage
