import { IconSizeHelper } from "@linked-planet/ui-kit-ts"
import { PlusCircleIcon } from "lucide-react"
import ShowcaseWrapperItem, {
	type ShowcaseProps,
} from "../../ShowCaseWrapperItem/ShowcaseWrapperItem"

export default function IconSizeHelperShowcase(props: ShowcaseProps) {
	//#region iconsizehelper
	const example = (
		<>
			<IconSizeHelper size={67}>
				<PlusCircleIcon aria-label="Plus" size="12" />
			</IconSizeHelper>
			<IconSizeHelper
				size={"2.3rem"}
				className="text-brand bg-warning-bold"
				style={{
					borderRadius: "50%",
				}}
			>
				<PlusCircleIcon aria-label="Plus" size="12" />
			</IconSizeHelper>
		</>
	)
	//#endregion iconsizehelper

	return (
		<ShowcaseWrapperItem
			name="Icon Size Helper"
			{...props}
			packages={[
				{
					name: "@linked-planet/ui-kit-ts",
					url: "/ui-kit-ts/single#IconSizeHelper",
				},
			]}
			examples={[
				{
					title: "Icon Size Helper",
					example: example,
					sourceCodeExampleId: "iconsizehelper",
				},
			]}
		/>
	)
}
