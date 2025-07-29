import {
	Badge,
	BookCard,
	BookCardComponents,
	Button,
	ButtonGroup,
	Fieldset,
	Tag,
	TagGroup,
} from "@linked-planet/ui-kit-ts"
import { TruncatedText } from "@linked-planet/ui-kit-ts/components/TruncatedText"
import { type CSSProperties, useMemo, useRef, useState } from "react"

import { CSSTransition } from "react-transition-group"
import ShowcaseWrapperItem, {
	type ShowcaseProps,
} from "../../ShowCaseWrapperItem/ShowcaseWrapperItem"

//#region bookcardcomponents
function BookCardComponentsExample() {
	return (
		<BookCardComponents.CardBase
			header={
				<BookCardComponents.CardHeader>
					<BookCardComponents.CardHeaderMeta>
						<BookCardComponents.CardHeaderTitle>
							Book Title very very very very very very very very
							very very very very very very very long
						</BookCardComponents.CardHeaderTitle>
						<BookCardComponents.CardHeaderSubtitle>
							Book Subtitle
						</BookCardComponents.CardHeaderSubtitle>
					</BookCardComponents.CardHeaderMeta>
					<BookCardComponents.CardHeaderActions>
						<Badge appearance="default">action</Badge>
					</BookCardComponents.CardHeaderActions>
				</BookCardComponents.CardHeader>
			}
			defaultOpen={true}
		>
			<BookCardComponents.CardGridBody>
				<BookCardComponents.CardBodyEntry>
					<BookCardComponents.CardBodyEntryTitle>
						Book Entry Title very very very very very very very very
						very very very very very very very long
					</BookCardComponents.CardBodyEntryTitle>
					<div>Book Entry Content</div>
				</BookCardComponents.CardBodyEntry>
				<BookCardComponents.CardBodyEntry>
					<BookCardComponents.CardBodyEntryTitle>
						Book Entry Title 2
					</BookCardComponents.CardBodyEntryTitle>
					<Tag>
						Lorem ipsum dolor sit, amet consectetur adipisicing
						elit. Consequatur qui fuga similique dicta doloremque
						incidunt aliquid nesciunt quae culpa? Eos expedita
						doloribus exercitationem nihil fuga quidem rem quod
						voluptate? A!
					</Tag>
				</BookCardComponents.CardBodyEntry>
			</BookCardComponents.CardGridBody>
		</BookCardComponents.CardBase>
	)
}
//#endregion bookcardcomponents

//#region bookcard-animation
function BookCardAnimationExample() {
	const [showCard, setShowCard] = useState(true)
	const nodeRef = useRef<HTMLDivElement>(null)

	return (
		<>
			<Button onClick={() => setShowCard(!showCard)} className="mb-4">
				Toggle Card
			</Button>
			<CSSTransition
				in={showCard}
				timeout={300} // this needs to be the same as the duration of the animation in the css
				classNames={{
					exit: "transition-opacity duration-300 ease-out opacity-0",
				}}
				nodeRef={nodeRef}
				unmountOnExit
			>
				<BookCardComponents.CardBase
					header={
						<BookCardComponents.CardHeader>
							<BookCardComponents.CardHeaderMeta>
								<BookCardComponents.CardHeaderTitle className="">
									Title
								</BookCardComponents.CardHeaderTitle>
							</BookCardComponents.CardHeaderMeta>
						</BookCardComponents.CardHeader>
					}
					defaultOpen={true}
					ref={nodeRef}
				>
					<BookCardComponents.CardGridBody>
						<BookCardComponents.CardBodyEntry>
							<BookCardComponents.CardBodyEntryTitle>
								Entry Title
							</BookCardComponents.CardBodyEntryTitle>
							<div>Book Entry Content</div>
						</BookCardComponents.CardBodyEntry>
					</BookCardComponents.CardGridBody>
				</BookCardComponents.CardBase>
			</CSSTransition>
		</>
	)
}
//#endregion bookcard-animation

function BookCardExample() {
	//#region bookcard
	const [bodyLayout, setBodyLayout] = useState<"row" | "grid" | "column">(
		"grid",
	)

	const [isClosed, setIsClosed] = useState<boolean | undefined>(undefined)

	const children = useMemo(() => {
		const childCount = bodyLayout === "column" ? 10 : 100
		const ret = Array(childCount)
		for (let i = 0; i < childCount; i++) {
			ret[i] = (
				<BookCardComponents.CardBodyEntry key={i}>
					<BookCardComponents.CardBodyEntryTitle>
						Book Entry Title {i}
					</BookCardComponents.CardBodyEntryTitle>
					<div>Book Entry Content {i}</div>
				</BookCardComponents.CardBodyEntry>
			)
		}
		return ret
	}, [bodyLayout])

	const bodyStyle = useMemo(() => {
		switch (bodyLayout) {
			case "row":
				break
			case "grid":
				return {
					maxHeight: "400px",
					overflowY: "auto",
					overflowX: "hidden",
				} satisfies CSSProperties
			case "column":
				return {
					maxHeight: "400px",
					overflowY: "auto",
					overflowX: "hidden",
				} satisfies CSSProperties
			default:
				break
		}
	}, [bodyLayout])

	const bookCardExample = (
		<>
			<BookCard
				title="Book Title very very very very very very very very very
						very very very very very very long"
				subtitle="Book Subtitle also very very very very very very long"
				upperTitle="Book Upper Title also looooooooooooooooooooooooooooong"
				headerPrefix={{
					children: "looooooooooooooooooooooooooooong prefix",
					className: "text-red-500",
					style: {
						color: "red",
					},
				}}
				bodyLayout={bodyLayout}
				bodyStyle={bodyStyle}
				closed={isClosed}
				actions={
					<div className="flex items-center">
						Actions:&nbsp;
						<TagGroup>
							<Tag key="action" appearance="danger">
								DAUERAUSLEIHE
							</Tag>
							<Tag key="action 1" appearance="greenLight">
								action item
							</Tag>
						</TagGroup>
					</div>
				}
			>
				<BookCardComponents.CardBodyEntry>
					<BookCardComponents.CardBodyEntryTitle>
						Book Entry Title
					</BookCardComponents.CardBodyEntryTitle>
					<TruncatedText>
						truncated - Lorem ipsum dolor sit amet consectetur
						adipisicing elit. Beatae aperiam tenetur est in quidem?
						Tempore, cumque perspiciatis optio aperiam dolorem saepe
						harum, sequi eaque nisi quas, assumenda praesentium!
						Labore, incidunt.
					</TruncatedText>
				</BookCardComponents.CardBodyEntry>
				<BookCardComponents.CardBodyEntry>
					<BookCardComponents.CardBodyEntryTitle>
						Book Entry Title
					</BookCardComponents.CardBodyEntryTitle>
					<TruncatedText>untruncated</TruncatedText>
				</BookCardComponents.CardBodyEntry>
				<BookCardComponents.CardBodyEntry>
					<BookCardComponents.CardBodyEntryTitle>
						Book Entry Title
					</BookCardComponents.CardBodyEntryTitle>
					<Tag>
						Lorem ipsum, dolor sit amet consectetur adipisicing
						elit. Illo cumque eum laborum voluptate ipsa sed
						consectetur tempore vel quia est quas itaque voluptatem
						neque odio, maiores ut cum at distinctio?
					</Tag>
					<Tag>
						Lorem ipsum, dolor sit amet consectetur adipisicing
						elit. Illo cumque eum laborum voluptate ipsa sed
						consectetur tempore vel quia est quas itaque voluptatem
						neque odio, maiores ut cum at distinctio?
					</Tag>
				</BookCardComponents.CardBodyEntry>
				{children}
			</BookCard>
		</>
	)
	//#endregion bookcard

	return (
		<div>
			<div className="mb-2 flex flex-row justify-between">
				<Fieldset legend="Book Card Collapsible">
					<ButtonGroup>
						<Button
							selected={isClosed === false}
							onClick={() => setIsClosed(false)}
						>
							Opened
						</Button>
						<Button
							selected={isClosed === true}
							onClick={() => setIsClosed(true)}
						>
							Closed
						</Button>
						<Button
							selected={isClosed === undefined}
							onClick={() => setIsClosed(undefined)}
						>
							Closed Undefined
						</Button>
					</ButtonGroup>
				</Fieldset>
				<Fieldset legend="Book Card Body Layout">
					<ButtonGroup>
						<Button
							selected={bodyLayout === "row"}
							onClick={() => setBodyLayout("row")}
						>
							Row
						</Button>
						<Button
							selected={bodyLayout === "grid"}
							onClick={() => setBodyLayout("grid")}
						>
							Grid
						</Button>
						<Button
							selected={bodyLayout === "column"}
							onClick={() => setBodyLayout("column")}
						>
							Column
						</Button>
					</ButtonGroup>
				</Fieldset>
			</div>
			{bookCardExample}
		</div>
	)
}

export default function BookCardShowcase(props: ShowcaseProps) {
	return (
		<ShowcaseWrapperItem
			name="Book Card (Components)"
			{...props}
			packages={[
				{
					name: "@linked-planet/ui-kit-ts",
					url: "https://www.github.com/linked-planet/ui-kit-ts",
				},
			]}
			description={
				<>
					<p>
						Book Card is a card component that is used to display
						search result information or similar. It can be used as
						a collapsible component or as a static component.
					</p>
					<p>
						If <b>closed</b> is used, the collapse state is
						controlled. By <b>defaultOpen</b> if it collapsible but
						uncontrolled. If both are undefined, the component is
						static.
					</p>
					<p>
						Book Card is a composition of several components. The
						components can be used individually or as a whole.
					</p>
				</>
			}
			examples={[
				{
					title: "Complete Bookcard",
					example: <BookCardExample key="bookcardexample" />,
					sourceCodeExampleId: "bookcard",
				},
				{
					title: "Components",
					example: (
						<BookCardComponentsExample key="bookcardcomponentexample" />
					),
					sourceCodeExampleId: "bookcardcomponents",
				},
				{
					title: "Animation",
					example: (
						<BookCardAnimationExample key="bookcardanimationexample" />
					),
					sourceCodeExampleId: "bookcard-animation",
				},
			]}
		/>
	)
}
