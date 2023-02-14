import React from "react";
import {CodeBlock} from "@atlaskit/code";

function UtilsPage() {

    const str =`
    requestAndParseResultWithError(
    url = "/rest/v1/items",
    headers = json(
        "Accept" to "application/json"
    ),
    parse = { json ->
        Object.keys(json).map { item =>
            val entries = json[item] as Array<dynamic>
            item.toInt() to
                    entries.map {
                        Item(
                            it.id as Int,
                            it.name as String,
                            it.parentId as Int
                        )
                    }
        }.toMap()
    }
)`

    return (
        <div>
            <h1>Utilities</h1>
            <h3>RequestUtil</h3>
            <p>RequestUtil contains multiple functions to execute a http request and parse the corresponding json response.</p>
            <h5>Example</h5>
            <CodeBlock
                language="typescript"
                text={str.trim().trimStart().trimEnd()}
                />
        </div>
    )
}

export default UtilsPage;