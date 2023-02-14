import React, {useState} from "react";
import ShowcaseWrapperItem, {ShowcaseProps} from "../../ShowcaseWrapperItem";
import Button, {ButtonGroup, LoadingButton} from "@atlaskit/button"

function ButtonShowcase(props: ShowcaseProps) {

    // region: button
    const [isLoading, setIsLoading] = useState(false)

    const example = (
        <ButtonGroup>
            <Button
                appearance="primary"
                onClick={() => console.log("Button pressed")}
            >Normal button</Button>

            <LoadingButton
                isLoading={isLoading}
                onClick={
                    () => {
                        setIsLoading(true)
                        window.setTimeout(() => setIsLoading(false), 3000)
                    }
                }
            >Loading Button</LoadingButton>
        </ButtonGroup>
    )
    // endregion: button

    return (
        <ShowcaseWrapperItem
            name="Button & Button-Group"
            sourceCodeExampleId="button"
            overallSourceCode={props.overallSourceCode}
            packages={[
                {
                    name: "@atlaskit/button",
                    url: "https://atlassian.design/components/button/examples"
                }
            ]}

            examples={
                [
                    (example),
                ]
            }
        />
    )

}

export default ButtonShowcase;