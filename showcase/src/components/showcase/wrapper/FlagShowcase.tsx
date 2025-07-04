import { Flag, Toast, ToastFlagProvider } from "@linked-planet/ui-kit-ts"
import { TriangleAlertIcon } from "lucide-react"
import ShowcaseWrapperItem, {
	type ShowcaseProps,
} from "../../ShowCaseWrapperItem/ShowcaseWrapperItem"

function FlagShowcase(props: ShowcaseProps) {
	//#region flag
	const example = (
		<ToastFlagProvider>
			<div className="flex flex-col gap-3">
				<Flag
					title="Flag"
					icon={
						<TriangleAlertIcon
							aria-label="Triangle Alert"
							size="12"
						/>
					}
					description="Action Flag"
					id="testflag"
					testId="testflag"
					actions={[
						{
							content: "Action",
							onClick: () => {
								console.log("Action clicked")
								Toast.showFlag({
									title: "Flag",
									description: "Action Flag",
									autoClose: false,
								})
							},
						},
					]}
				/>
				<Flag
					title="Flag"
					description="Inverted Action Flag"
					actions={[{ content: "Action", onClick: () => {} }]}
					type="inverted"
				/>

				<Flag
					title="Flag"
					description="Pale Action Flag"
					actions={[{ content: "Action", onClick: () => {} }]}
					type="pale"
				/>

				<Flag
					title="Flag"
					description="Success Flag"
					appearance="success"
				/>

				<Flag
					title="Flag"
					description="Inverted Success Flag"
					appearance="success"
					type="inverted"
					actions={[{ content: "Action", onClick: () => {} }]}
				/>

				<Flag
					title="Flag"
					description="Pale Success Flag"
					appearance="success"
					type="pale"
					actions={[{ content: "Action", onClick: () => {} }]}
				/>

				<Flag
					title="Flag"
					description="Warning Flag"
					appearance="warning"
					actions={[{ content: "Action", onClick: () => {} }]}
				/>

				<Flag
					title="Flag"
					description="Inverted Warning Flag"
					appearance="warning"
					type="inverted"
					actions={[{ content: "Action", onClick: () => {} }]}
				/>

				<Flag
					title="Flag"
					description="Pale Warning Flag"
					appearance="warning"
					type="pale"
					actions={[{ content: "Action", onClick: () => {} }]}
				/>

				<Flag
					title="Flag"
					description="Error Flag"
					appearance="error"
					actions={[{ content: "Action", onClick: () => {} }]}
				/>

				<Flag
					title="Flag"
					description="Inverted Error Flag"
					appearance="error"
					type="inverted"
					actions={[{ content: "Action", onClick: () => {} }]}
				/>

				<Flag
					title="Flag"
					description="Pale Error Flag"
					appearance="error"
					type="pale"
					actions={[{ content: "Action", onClick: () => {} }]}
				/>

				<Flag
					title="Flag"
					description="Information Flag"
					appearance="information"
					actions={[{ content: "Action", onClick: () => {} }]}
				/>

				<Flag
					title="Flag"
					description="Inverted Information Flag"
					appearance="information"
					type="inverted"
					actions={[{ content: "Action", onClick: () => {} }]}
				/>

				<Flag
					title="Flag"
					description="Pale Information Flag"
					appearance="information"
					type="pale"
					actions={[{ content: "Action", onClick: () => {} }]}
				/>

				<Flag
					title="Flag"
					description="Discovery Flag"
					appearance="discovery"
					actions={[{ content: "Action", onClick: () => {} }]}
				/>

				<Flag
					title="Flag"
					description="Inverted Discovery Flag"
					appearance="discovery"
					type="inverted"
					actions={[{ content: "Action", onClick: () => {} }]}
				/>

				<Flag
					title="Flag"
					description="Pale Discovery Flag"
					appearance="discovery"
					type="pale"
					actions={[{ content: "Action", onClick: () => {} }]}
				/>
			</div>
		</ToastFlagProvider>
	)
	//#endregion flag

	return (
		<ShowcaseWrapperItem
			name="Flag"
			{...props}
			packages={[
				{
					name: "@linked-planet/ui-kit-ts",
					url: "/ui-kit-ts/single#Flag",
				},
			]}
			description="Drop in replacement for the @atlaskit/flag component."
			examples={[
				{ title: "Example", example, sourceCodeExampleId: "flag" },
			]}
		/>
	)
}

export default FlagShowcase
