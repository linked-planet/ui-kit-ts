import {
	Button,
	Collapsible,
	Dropdown,
	Modal,
	Select,
} from "@linked-planet/ui-kit-ts"
import { DropdownMenuItem } from "@radix-ui/react-dropdown-menu"
import { XIcon } from "lucide-react"
import { useEffect, useRef, useState } from "react"
import React from "react-dom/client"
import { createShowcaseShadowRoot } from "../../ShowCaseWrapperItem/createShadowRoot"
import ShowcaseWrapperItem, {
	type ShowcaseProps,
} from "../../ShowCaseWrapperItem/ShowcaseWrapperItem"

function ControlledExample() {
	const selectOptions = []
	for (let i = 0; i < 100; i++) {
		selectOptions.push({
			label: i.toString(),
			value: i.toString(),
		})
	}

	const ddItems = []
	for (let i = 0; i < 100; i++) {
		ddItems.push(<DropdownMenuItem>{i}</DropdownMenuItem>)
	}

	//#region modal_controlled
	const [isModalActive, setIsModalActive] = useState(false)

	return (
		<>
			<div>Modal: {isModalActive.toString()}</div>
			<div>
				<Button onClick={() => setIsModalActive(true)}>
					Show Modal2
				</Button>

				<Modal.Container
					open={isModalActive}
					//defaultOpen={true}
					onOpenChange={(opened) => {
						if (!opened) setIsModalActive(false)
					}}
					shouldCloseOnEscapePress={false}
					accessibleDialogDescription="This is a modal dialog example"
					accessibleDialogTitle="Sample Modal"
					useModal={true}
				>
					<Modal.Header>
						<Modal.Title>Sample Modal</Modal.Title>
						<Button
							appearance="link"
							onClick={() => setIsModalActive(false)}
							className="text-text p-0"
						>
							<XIcon aria-label="Close popup" size="12" />
						</Button>
					</Modal.Header>
					<Modal.Body>
						<div>
							<p>This is the body of the modal.</p>
						</div>
						<Select
							placeholder="Choose..."
							options={selectOptions}
						/>
						<Select
							placeholder="Choose..."
							options={selectOptions}
							menuPlacement="top"
							menuIsOpen
						/>
						<Dropdown.Menu
							className="w-full"
							align="end"
							trigger="Dropdown"
							usePortal={false}
						>
							{ddItems}
						</Dropdown.Menu>
						<Collapsible.Root defaultOpen={false}>
							<Collapsible.Trigger>
								<div className="p-2">Lorem</div>
							</Collapsible.Trigger>
							<Collapsible.Content>
								Lorem, ipsum dolor sit amet consectetur
								adipisicing elit. Distinctio ipsam harum rerum
								quia, nam, autem non, commodi expedita dolore
								quisquam saepe odit maiores id alias reiciendis.
								Aut aperiam minus eum. Lorem ipsum dolor sit
								amet consectetur adipisicing elit. Illum quos
								dolorum officia id porro illo sit voluptates
								error doloremque? Iste deserunt amet illo
								incidunt modi. Facilis reiciendis ratione at
								veritatis. Lorem ipsum dolor sit amet
								consectetur, adipisicing elit. Deserunt non,
								perspiciatis voluptate cumque vel eveniet
								ratione sequi ullam facilis! Beatae, voluptatem
								aperiam consequatur assumenda consectetur
								possimus accusantium maxime similique labore!
								Lorem ipsum dolor sit amet consectetur,
								adipisicing elit. Ullam, possimus facere ut odit
								mollitia vel consectetur earum reiciendis beatae
								inventore fugiat, quo eaque ipsum soluta facilis
								doloremque, voluptatibus odio officiis. Lorem
								ipsum dolor sit amet consectetur adipisicing
								elit. Laudantium voluptatum aut voluptates
								distinctio nam neque dolore, maiores autem
								impedit, doloribus eveniet laborum
								necessitatibus ex! Possimus odit in commodi
								nulla architecto. Lorem ipsum dolor sit amet
								consectetur adipisicing elit. Officia, facere
								reiciendis incidunt obcaecati aut corrupti
								tempora commodi nam aspernatur et quas beatae
								delectus perspiciatis alias quia inventore
								molestias quis exercitationem? Lorem, ipsum
								dolor sit amet consectetur adipisicing elit.
								Blanditiis temporibus doloremque nam molestiae
								quidem, repellendus eligendi ex magnam quasi.
								Est doloribus quam accusantium? Consequuntur,
								vel sapiente alias repudiandae nisi soluta.
								Lorem ipsum dolor sit amet consectetur
								adipisicing elit. Reiciendis, quibusdam maxime.
								Numquam, explicabo! At vero eligendi cupiditate
								vel molestias eos sint, obcaecati minus suscipit
								ducimus libero reprehenderit, itaque debitis
								atque? Lorem ipsum dolor sit amet, consectetur
								adipisicing elit. Repellendus vero consequatur
								velit dolores neque distinctio harum tempore.
								Vitae, doloribus perferendis! Deserunt
								reprehenderit dolor tempora atque amet officiis
								ea, velit iste. Lorem ipsum dolor sit, amet
								consectetur adipisicing elit. Est nemo
								accusamus, inventore assumenda et nulla. Eius,
								consequuntur repudiandae ea corrupti eos magni
								itaque temporibus blanditiis aspernatur, earum
								quam ut. Laudantium. Lorem ipsum dolor sit amet
								consectetur adipisicing elit. Doloremque
								recusandae, distinctio in fuga vero ullam
								tempora nisi laborum unde architecto, doloribus
								dicta fugiat itaque voluptatibus dolorum vel
								aspernatur, inventore nemo? Lorem ipsum dolor
								sit amet consectetur adipisicing elit. Error,
								corporis animi. Praesentium voluptate, optio
								tenetur harum odio sequi eos possimus officiis
								dignissimos. Laboriosam voluptates fuga est.
								Deserunt quod officia harum!
							</Collapsible.Content>
						</Collapsible.Root>
					</Modal.Body>
					<Modal.Footer>
						<Modal.CloseTrigger>
							<Button appearance="primary" className="z-0">
								Close
							</Button>
						</Modal.CloseTrigger>
					</Modal.Footer>
				</Modal.Container>
			</div>
		</>
	)
	//#endregion modal_controlled
}

//#region shadow_dom_uncontrolled
function ModalTest() {
	const divRef = useRef<HTMLDivElement>(null)

	useEffect(() => {
		if (divRef.current && !divRef.current.shadowRoot) {
			const shadowRoot = createShowcaseShadowRoot(divRef.current)
			React.createRoot(shadowRoot).render(
				<Modal.Container
					accessibleDialogTitle="Sample Modal"
					accessibleDialogDescription="This is a modal dialog example"
					shouldCloseOnEscapePress
					trigger={"Show Modal"}
				>
					<Modal.Header>
						<Modal.Title>Sample Modal</Modal.Title>
					</Modal.Header>
					<Modal.Body>
						<p>This is the body of the modal.</p>
					</Modal.Body>
				</Modal.Container>,
			)
		}
	}, [])

	return <div ref={divRef} />
}

function ModalShowcase(props: ShowcaseProps) {
	const example = <ControlledExample />

	return (
		<ShowcaseWrapperItem
			name="Modal"
			{...props}
			packages={[
				{
					name: "@linked-planet/ui-kit-ts",
					url: "http://linked-planet.github.io/ui-kit-ts/single?component=Modal",
				},
			]}
			examples={[
				{
					title: "Example Controlled",
					example,
					sourceCodeExampleId: "modal_controlled",
				},
				{
					title: "Shadow DOM Uncontrolled",
					example: <ModalTest />,
					sourceCodeExampleId: "shadow_dom_uncontrolled",
				},
			]}
		/>
	)
}

export default ModalShowcase
