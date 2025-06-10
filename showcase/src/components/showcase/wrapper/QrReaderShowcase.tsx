import { useState } from "react"
import ShowcaseWrapperItem, {
	type ShowcaseProps,
} from "../../ShowCaseWrapperItem/ShowcaseWrapperItem"
import { QrReader, QrReaderDialog } from "@linked-planet/ui-kit-ts"

//#region qrreader-example
function QrReaderExample() {
	const [results, setResults] = useState<string[]>([])
	return (
		<div className="flex flex-col gap-4 items-start">
			<QrReader onScan={setResults} className="w-full max-w-xs" />
			<div>
				<strong>Scanned Results:</strong>
				<ul className="list-disc pl-4">
					{results.length === 0 && (
						<li className="italic text-muted">
							No QR code detected
						</li>
					)}
					{results.map((r) => (
						<li key={r}>{r}</li>
					))}
				</ul>
			</div>
		</div>
	)
}
//#endregion qrreader-example

//#region qrreader-dialog-example
function QrReaderDialogExample() {
	const [results, setResults] = useState<string[]>([])
	return (
		<div className="flex flex-col gap-4 items-start">
			<QrReaderDialog
				trigger="Scan QR Code"
				onScan={setResults}
				shouldCloseOnScan={false}
				accessibleDialogTitle="Scan QR Code"
				accessibleDialogDescription="Scan a QR code to get the result"
				title="Scan QR Code"
				description="Scan a QR code to get the result"
			/>
			<div>
				<strong>Scanned Results:</strong>
				<ul className="list-disc pl-4">
					{results.length === 0 && (
						<li className="italic text-muted">
							No QR code detected
						</li>
					)}
					{results.map((r) => (
						<li key={r}>{r}</li>
					))}
				</ul>
			</div>
		</div>
	)
}
//#endregion qrreader-dialog-example

export default function QrReaderShowcase(props: ShowcaseProps) {
	return (
		<ShowcaseWrapperItem
			name="QrReader"
			description={
				<>
					A simple QR code reader component using{" "}
					<code>@yudiel/react-qr-scanner</code>.<br />
					<span className="text-xs">
						Note: Only works in browsers with camera access, and
						requires https if not on localhost.
					</span>
				</>
			}
			{...props}
			packages={[
				{
					name: "@linked-planet/ui-kit-ts",
					url: "https://linked-planet.github.io/ui-kit-ts/single?component=QrReader",
				},
				{
					name: "@yudiel/react-qr-scanner",
					url: "https://github.com/yudiel/react-qr-scanner",
				},
			]}
			examples={[
				{
					title: "QR Reader Example",
					example: <QrReaderExample />,
					sourceCodeExampleId: "qrreader-example",
				},
				{
					title: "QR Reader Dialog Example",
					example: <QrReaderDialogExample />,
					sourceCodeExampleId: "qrreader-dialog-example",
				},
			]}
		/>
	)
}
