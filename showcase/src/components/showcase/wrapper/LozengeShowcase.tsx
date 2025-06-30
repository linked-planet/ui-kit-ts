import { Lozenge } from "@linked-planet/ui-kit-ts"
import ShowcaseWrapperItem, {
	type ShowcaseProps,
} from "../../ShowCaseWrapperItem/ShowcaseWrapperItem"

function LozengeShowcase(props: ShowcaseProps) {
	//#region lozenge
	const example = (
		<div className="flex flex-col gap-8">
			<div className="">
				{/*<AKLozenge>First lozenge</AKLozenge>
				<AKLozenge appearance="new">new</AKLozenge>
				<AKLozenge appearance="new" isBold>
					new bold
				</AKLozenge>
				<AKLozenge appearance="success">success</AKLozenge>
				<AKLozenge appearance="success" isBold>
					success bold
				</AKLozenge>
				<AKLozenge appearance="inprogress">inprogress</AKLozenge>
				<AKLozenge appearance="inprogress" isBold>
					inprogress bold
				</AKLozenge>
				<AKLozenge appearance="moved">moved</AKLozenge>
				<AKLozenge appearance="moved" isBold>
					moved bold
				</AKLozenge>
				<AKLozenge appearance="removed">removed</AKLozenge>
				<AKLozenge appearance="removed" isBold>
					removed bold
				</AKLozenge>*/}
			</div>
			<div>
				<Lozenge>First lozenge</Lozenge>
				<Lozenge appearance="new">new</Lozenge>
				<Lozenge appearance="new" bold>
					new bold
				</Lozenge>
				<Lozenge appearance="success">success</Lozenge>
				<Lozenge appearance="success" bold>
					success bold
				</Lozenge>
				<Lozenge appearance="inprogress">inprogress</Lozenge>
				<Lozenge appearance="inprogress" bold>
					inprogress bold
				</Lozenge>
				<Lozenge appearance="moved">moved</Lozenge>
				<Lozenge appearance="moved" bold>
					moved bold
				</Lozenge>
				<Lozenge appearance="removed">removed</Lozenge>
				<Lozenge appearance="removed" bold>
					removed bold
				</Lozenge>
			</div>
		</div>
	)
	//#endregion lozenge

	return (
		<ShowcaseWrapperItem
			name="Lozenge"
			{...props}
			packages={[
				{
					name: "@linked-planet/ui-kit-ts",
					url: "https://linked-planet.github.io/ui-kit-ts/single?component=Lozenge",
				},
			]}
			examples={[
				{
					title: "Example",
					example,
					sourceCodeExampleId: "lozenge",
				},
			]}
		/>
	)
}

export default LozengeShowcase
