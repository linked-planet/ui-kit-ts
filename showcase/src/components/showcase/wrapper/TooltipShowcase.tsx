import ShowcaseWrapperItem, {
	type ShowcaseProps,
} from "../../ShowCaseWrapperItem/ShowcaseWrapperItem"
import SearchIcon from "@atlaskit/icon/glyph/search"
import WatchIcon from "@atlaskit/icon/glyph/watch"
import ActivityIcon from "@atlaskit/icon/glyph/activity"
import CameraIcon from "@atlaskit/icon/glyph/camera"
import TaskIcon from "@atlaskit/icon/glyph/task"
import { Tooltip, TooltipProvider, Button } from "@linked-planet/ui-kit-ts"

//import "react-tooltip/dist/react-tooltip.css" -> imported into the libraries css

function TooltipShowcase(props: ShowcaseProps) {
	//#region tooltip
	const example = (
		<TooltipProvider>
			<div className="flex w-full flex-col items-center">
				<div className="flex gap-4">
					<Tooltip
						side="left"
						tooltipContent={<span>I&apos;m a tooltip</span>}
						usePortal
						align="start"
					>
						<div>
							<SearchIcon label="" />
						</div>
					</Tooltip>
					<Tooltip
						tooltipHTMLContent={
							"<span>I&apos;m a <b>top</b> tooltip with stringified HTML</span>"
						}
						usePortal={false}
						side="bottom"
						align="end"
					>
						<div>
							<ActivityIcon label="" />
						</div>
					</Tooltip>
					<Tooltip
						side="top"
						defaultOpen
						tooltipContent={"I'm a top tooltip"}
					>
						<div>
							<CameraIcon label="" />
						</div>
					</Tooltip>
					<Tooltip
						side="bottom"
						open
						tooltipContent={
							<p>
								I&apos;m a bottom-end tooltip <br />
								with a unique id.
							</p>
						}
					>
						<div>
							<TaskIcon label="" />
						</div>
					</Tooltip>
					<Tooltip
						tooltipContent={`Der Fliegenpilz ist mit seinem auffälligen roten, weiß gepunkteten Hut weit und gut zu sehen. Er hat einen Durchmesser von 5 bis über 15 Zentimeter, ist jung kugelig oder halbkugelig geschlossen, dann konvex, schließlich scheibenförmig mit etwas herabgebogenem, gestreiftem Rand. Jung ist er durch sehr dicht stehende Warzen und Schuppen noch fast weiß mit schwachem orangen oder rötlichem Schimmer, dann tief rot und mit grauweißen kegelförmigen Warzen, zum Teil auch breiten Schuppen – den charakteristischen weißen „Punkten“ – besetzt, die leicht abgewischt werden können. Sie sind Reste einer Gesamthülle (Velum universale), die den jungen Pilz anfangs schützend umschließt.

						Der rote Hut ist bisweilen auch fleckenweise heller, und zwar besonders gegen den Rand mit oranger Mischfarbe, gelegentlich durch tiefer rot gefärbte Linien wie faserig gestreift. Am Hutrand hängen teilweise leicht entfernbare weiße Velumflocken. Im Übrigen ist die Oberfläche weitgehend glatt bzw. wie gehämmert uneben, im feuchten Zustand etwas schmierig und schwach glänzend. Die Hutdeckschicht ist als Haut bis zur Mitte des Hutes abziehbar; das dadurch freigelegte Hutfleisch ist tief safrangelb gefärbt.
						
						Auf der Unterseite des Hutes befinden sich Lamellen. Diese stehen frei, untermischt und ziemlich gedrängt. Sie sind schwach bauchig und weisen eine fein gezähnte Schneide auf, die unter der Lupe gesehen zugleich flockig ist. Ihre Farbe ist weißlich, bei älteren Stücken aus der Tiefe heraus mit schwach lachsfarbenem Schein. Gegen den Hutrand sind sie stumpf geformt. Sie fühlen sich weich an und haben eine glatte Lamellenfläche. Der Sporenstaub ist weiß.
						
						Der Stiel ist 8 bis 20 Zentimeter hoch und 1,5 bis 3 Zentimeter dick und besitzt einen runden Querschnitt. Die Stielspitze ist gegen den Hut ausweitend, die Stielbasis knollig verdickt. In seiner oberen Hälfte (oft sogar ziemlich weit oben) weist er einen häutigen, empfindlichen Ring auf, der unterseits flockig ist und oberseits wie gepresste Watte aussieht; dieser hat einen gezähnten Rand und ist weiß bzw. gelegentlich und stellenweise leicht gelblich gefärbt.
						
						Der Stiel ist insgesamt weiß, an seiner Spitze bereift, gegen die Stielknolle auch schwach bräunlich und bisweilen durch unscheinbare Linien gezeichnet, die unregelmäßig netzig zusammenlaufen können. An der Stielknolle fügen sich zahlreiche weißlich-graue Warzen zu drei bis vier meist unvollständigen Ringzonen. Bisweilen findet sich auch eine Volva, die jedoch in der Regel nicht gut entwickelt ist.[3]
						
						Das Fleisch ist schwammig, weich, lediglich in der Knolle ziemlich fest und ohne besonderen Geruch. Es ist im Stiel voll und schwach faserig bis schwammig. Von der Hutoberfläche her ist es orangegelb eingefärbt, sonst rein weiß. Während des Trocknungsprozesses schimmert die Huthaut zeitweilig golden bis kupfern, nimmt jedoch später eine mattorange Färbung an, wobei der metallische Schimmer wieder verblasst.[4]:103–104
						
						Ältere Pilzkörper bilden im Becherstadium eine Vertiefung in ihrem Hut, in dem sich Regenwasser sammeln kann, der sogenannte Zwergenwein.[5]`}
					>
						<div>
							<WatchIcon label="" />
						</div>
					</Tooltip>
					<Tooltip
						tooltipContent={
							<div>
								Button:
								<Button>Button</Button>
							</div>
						}
						side="right"
						align="end"
					>
						<div className="bg-brand-bold p-2 rounded text-text-inverse">
							Button with tooltip
						</div>
					</Tooltip>
				</div>
			</div>
		</TooltipProvider>
	)
	//#endregion tooltip

	return (
		<ShowcaseWrapperItem
			name="Tooltip"
			description={
				<p>
					A tooltip component that wraps the children in a div and
					adds a tooltip to it. <br />
					Use tooltipContent for the tooltip content and
					tooltipHTMLContent in case you have stringified HTML as
					tooltip content. <br />
					<br />
					Based on react-tooltip.
					<br />
					The variant defines the color of the tooltip - if it is not
					defined, it is unstyled.
					<br />
					<b>Important:</b> The tooltip component's child must be
					ref-able, otherwise the tooltip will not work (i.g. use a
					div around an icon).
				</p>
			}
			{...props}
			packages={[
				{
					name: "tooltip",
					url: "http://localhost:3000/ui-kit-ts/single#Tooltip",
				},
			]}
			examples={[
				{ title: "Example", example, sourceCodeExampleId: "tooltip" },
			]}
		/>
	)
}

export default TooltipShowcase
