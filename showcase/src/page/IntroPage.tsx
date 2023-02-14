import {CodeBlock} from "@atlaskit/code";

function IntroPage() {

    return (
        <div>
            <h1>Welcome to UI-Kit-TS</h1>
            <h3>Usage</h3>

            <p>UI-Kit-TS is published to <a href="https://www.npmjs.com/package/@linked-planet/ui-kit-ts" target="_blank">npmjs</a>.</p>
            <p> To use it in your project simply add the following dependency to your build.gradle:</p>
            <p>
                <CodeBlock
                    text="npm install -s @linked-planet/ui-kit-ts"
                    showLineNumbers={false}
                />
            </p>
        </div>
    )
}

export default IntroPage;