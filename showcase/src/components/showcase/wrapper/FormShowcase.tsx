import React, {Fragment} from "react";
import ShowcaseWrapperItem, {ShowcaseProps} from "../../ShowcaseWrapperItem";
import Form, {CheckboxField, Field, Fieldset, FormFooter, FormHeader, FormSection, HelperMessage} from "@atlaskit/form";
import TextField from "@atlaskit/textfield";
import Button, {ButtonGroup, LoadingButton} from "@atlaskit/button";
import Checkbox from "@atlaskit/checkbox";
import Select, {CreatableSelect, OptionType, ValueType} from "@atlaskit/select";

function FormShowcase(props: ShowcaseProps) {

    // region: form
    interface TestData {
        name: string
        readonlyField: string
        disabledField: string
        surname: string
        checkboxGroup: string[]
        favoriteColor: "RED" | "BLUE"
        favoriteColorCreatable: string
    }

    const colors: string[] = ["BLUE", "RED"]

    const initFormData = {
        name: "Carl",
        readonlyField: "Read-only Field",
        disabledField: "Disabled Field",
        surname: "Coderrrr",
        checkboxGroup: ["Coder"],
        favoriteColor: "BLUE",
        favoriteColorCreatable: "BLUE"
    }

    const example = (
        <Form onSubmit={(formData: TestData) => console.log("Form submit:", formData)}>
            {({formProps}) => (
                <form {...formProps}>
                    <FormHeader title="Give me your input" description="I describe this form"/>

                    <FormSection title="Your data" description="I'm curious">

                        <Field label="Name" name="name" defaultValue={initFormData.name}>
                            {({fieldProps}) => (
                                <Fragment>
                                    <TextField
                                        {...fieldProps}
                                    />
                                    <HelperMessage>Help!</HelperMessage>
                                </Fragment>
                            )}
                        </Field>

                        <Field label="Read-only Field" name="readonlyField" defaultValue={initFormData.readonlyField}>
                            {({fieldProps}) => (
                                <Fragment>
                                    <TextField
                                        readOnly={true}
                                        {...fieldProps}
                                    />
                                </Fragment>
                            )}
                        </Field>

                        <Field label="Disabled Field" name="disabledField" defaultValue={initFormData.disabledField}>
                            {({fieldProps}) => (
                                <Fragment>
                                    <TextField
                                        disabled={true}
                                        {...fieldProps}
                                    />
                                </Fragment>
                            )}
                        </Field>

                        <Field label="Surname" name="surname" defaultValue={initFormData.surname}>
                            {({fieldProps}) => (
                                <Fragment>
                                    <TextField
                                        {...fieldProps}
                                    />
                                    <HelperMessage>Help!</HelperMessage>
                                </Fragment>
                            )}
                        </Field>

                        <Fieldset legend="See more info">
                            {["Coder", "React fan"].map((item) => {
                                return (
                                    <CheckboxField name="checkboxGroup" value={item}
                                                   defaultIsChecked={initFormData.checkboxGroup.includes(item)}>
                                        {({fieldProps}) => (
                                            <Checkbox {...fieldProps} label={item}/>
                                        )}
                                    </CheckboxField>
                                )
                            })}
                        </Fieldset>
                    </FormSection>

                    <FormSection title="More data" description="Tell me more">
                        <Field<ValueType<OptionType>> label="Favorite Color" name="favoriteColor" defaultValue={{label: initFormData.favoriteColor, value: initFormData.favoriteColor}}>
                            {({fieldProps}) => (
                                <Fragment>
                                    <Select
                                        {...fieldProps}
                                        inputId="favoriteColor"
                                        options={
                                            [
                                                {label: "RED", value: "RED"},
                                                {label: "BLUE", value: "BLUE"}
                                            ]
                                        }
                                        defaultValue={{label: initFormData.favoriteColor, value:initFormData.favoriteColor}}
                                    />
                                </Fragment>
                            )}
                        </Field>

                        <Field<ValueType<OptionType>> label="Favorite Color (Creatable)" name="favoriteColorCreatable" defaultValue={{label: initFormData.favoriteColor, value: initFormData.favoriteColor}}>
                            {({fieldProps}) => (
                                <Fragment>
                                    <CreatableSelect
                                        {...fieldProps}
                                        inputId="favoriteColorCreatable"
                                        options={
                                            [
                                                {label: "RED", value: "RED"},
                                                {label: "BLUE", value: "BLUE"}
                                            ]
                                        }
                                        defaultValue={{label: initFormData.favoriteColorCreatable, value:initFormData.favoriteColorCreatable}}
                                    />
                                </Fragment>
                            )}
                        </Field>
                    </FormSection>

                    <FormFooter>
                        <ButtonGroup>
                            <Button appearance="subtle">Reset</Button>
                            <LoadingButton
                                type="submit"
                                appearance="primary"
                                isLoading={false}>
                                Save
                            </LoadingButton>
                        </ButtonGroup>
                    </FormFooter>
                </form>
            )}
        </Form>
    )
    // endregion: form

    return (
        <ShowcaseWrapperItem
            name="Form"
            sourceCodeExampleId="form"
            overallSourceCode={props.overallSourceCode}
            packages={[
                {
                    name: "@atlaskit/form",
                    url: "https://atlassian.design/components/form/examples"
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

export default FormShowcase;