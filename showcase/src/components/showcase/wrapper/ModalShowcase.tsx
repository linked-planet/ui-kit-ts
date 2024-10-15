import { useState } from "react"
import ShowcaseWrapperItem, {
	type ShowcaseProps,
} from "../../ShowCaseWrapperItem/ShowcaseWrapperItem"
import CrossIcon from "@atlaskit/icon/glyph/cross"
/*import {
	default as AKModal,
	ModalBody as AKModalBody,
	ModalFooter as AKModalFooter,
	ModalHeader as AKModalHeader,
	ModalTitle as AKModalTitle,
	ModalTransition as AKModalTransition,
} from "@atlaskit/modal-dialog"*/
import {
	Modal,
	Select,
	Button,
	Dropdown,
	Collapsible,
} from "@linked-planet/ui-kit-ts"
//import { default as AKSelect } from "@atlaskit/select"
import { DropdownMenuItem } from "@radix-ui/react-dropdown-menu"

function AKExample() {
	const [isAKModalActive, setIsAKModalActive] = useState(false)

	const selectOptions = []
	for (let i = 0; i < 100; i++) {
		selectOptions.push({
			label: i.toString(),
			value: i.toString(),
		})
	}

	return (
		<>
			<div>AKModal: {isAKModalActive.toString()}</div>
			<Button onClick={() => setIsAKModalActive(true)}>
				Show AK Modal
			</Button>

			{/*isAKModalActive && (
				<AKModalTransition>
					<AKModal onClose={() => setIsAKModalActive(false)}>
						<AKModalHeader>
							<AKModalTitle>Sample Modal</AKModalTitle>
							<Button
								appearance="link"
								onClick={() => setIsAKModalActive(false)}
							>
								<CrossIcon label="Close popup" />
							</Button>
						</AKModalHeader>

						<AKModalBody>
							<p>This is the body of the AK modal.</p>
							<AKSelect options={selectOptions} />
							<Select
								placeholder="Choose"
								options={selectOptions}
								className="z-10"
							/>
							Lorem, ipsum dolor sit amet consectetur adipisicing
							elit. Distinctio ipsam harum rerum quia, nam, autem
							non, commodi expedita dolore quisquam saepe odit
							maiores id alias reiciendis. Aut aperiam minus eum.
							Lorem ipsum dolor sit amet consectetur adipisicing
							elit. Illum quos dolorum officia id porro illo sit
							voluptates error doloremque? Iste deserunt amet illo
							incidunt modi. Facilis reiciendis ratione at
							veritatis. Lorem ipsum dolor sit amet consectetur,
							adipisicing elit. Deserunt non, perspiciatis
							voluptate cumque vel eveniet ratione sequi ullam
							facilis! Beatae, voluptatem aperiam consequatur
							assumenda consectetur possimus accusantium maxime
							similique labore! Lorem ipsum dolor sit amet
							consectetur, adipisicing elit. Ullam, possimus
							facere ut odit mollitia vel consectetur earum
							reiciendis beatae inventore fugiat, quo eaque ipsum
							soluta facilis doloremque, voluptatibus odio
							officiis. Lorem ipsum dolor sit amet consectetur
							adipisicing elit. Laudantium voluptatum aut
							voluptates distinctio nam neque dolore, maiores
							autem impedit, doloribus eveniet laborum
							necessitatibus ex! Possimus odit in commodi nulla
							architecto. Lorem ipsum dolor sit amet consectetur
							adipisicing elit. Officia, facere reiciendis
							incidunt obcaecati aut corrupti tempora commodi nam
							aspernatur et quas beatae delectus perspiciatis
							alias quia inventore molestias quis exercitationem?
							Lorem, ipsum dolor sit amet consectetur adipisicing
							elit. Blanditiis temporibus doloremque nam molestiae
							quidem, repellendus eligendi ex magnam quasi. Est
							doloribus quam accusantium? Consequuntur, vel
							sapiente alias repudiandae nisi soluta. Lorem ipsum
							dolor sit amet consectetur adipisicing elit.
							Reiciendis, quibusdam maxime. Numquam, explicabo! At
							vero eligendi cupiditate vel molestias eos sint,
							obcaecati minus suscipit ducimus libero
							reprehenderit, itaque debitis atque? Lorem ipsum
							dolor sit amet, consectetur adipisicing elit.
							Repellendus vero consequatur velit dolores neque
							distinctio harum tempore. Vitae, doloribus
							perferendis! Deserunt reprehenderit dolor tempora
							atque amet officiis ea, velit iste. Lorem ipsum
							dolor sit, amet consectetur adipisicing elit. Est
							nemo accusamus, inventore assumenda et nulla. Eius,
							consequuntur repudiandae ea corrupti eos magni
							itaque temporibus blanditiis aspernatur, earum quam
							ut. Laudantium. Lorem ipsum dolor sit amet
							consectetur adipisicing elit. Doloremque recusandae,
							distinctio in fuga vero ullam tempora nisi laborum
							unde architecto, doloribus dicta fugiat itaque
							voluptatibus dolorum vel aspernatur, inventore nemo?
							Lorem ipsum dolor sit amet consectetur adipisicing
							elit. Error, corporis animi. Praesentium voluptate,
							optio tenetur harum odio sequi eos possimus officiis
							dignissimos. Laboriosam voluptates fuga est.
							Deserunt quod officia harum!
						</AKModalBody>

						<AKModalFooter>
							<ButtonGroup>
								<Button
									autoFocus={true}
									appearance="primary"
									onClick={() => setIsAKModalActive(false)}
								>
									Close
								</Button>
							</ButtonGroup>
						</AKModalFooter>
					</AKModal>
				</AKModalTransition>
			)*/}
		</>
	)
}

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
					shouldCloseOnEscapePress={true}
					accessibleDialogDescription="This is a modal dialog example"
					useModal={true}
				>
					<Modal.Header>
						<Modal.Title accessibleDialogTitle="Sample Modal">
							Sample Modal
						</Modal.Title>
						<Button
							appearance="link"
							onClick={() => setIsModalActive(false)}
							className="text-text p-0"
						>
							<CrossIcon label="Close popup" />
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
						<Collapsible header={"lorem"} defaultOpen={false}>
							Lorem, ipsum dolor sit amet consectetur adipisicing
							elit. Distinctio ipsam harum rerum quia, nam, autem
							non, commodi expedita dolore quisquam saepe odit
							maiores id alias reiciendis. Aut aperiam minus eum.
							Lorem ipsum dolor sit amet consectetur adipisicing
							elit. Illum quos dolorum officia id porro illo sit
							voluptates error doloremque? Iste deserunt amet illo
							incidunt modi. Facilis reiciendis ratione at
							veritatis. Lorem ipsum dolor sit amet consectetur,
							adipisicing elit. Deserunt non, perspiciatis
							voluptate cumque vel eveniet ratione sequi ullam
							facilis! Beatae, voluptatem aperiam consequatur
							assumenda consectetur possimus accusantium maxime
							similique labore! Lorem ipsum dolor sit amet
							consectetur, adipisicing elit. Ullam, possimus
							facere ut odit mollitia vel consectetur earum
							reiciendis beatae inventore fugiat, quo eaque ipsum
							soluta facilis doloremque, voluptatibus odio
							officiis. Lorem ipsum dolor sit amet consectetur
							adipisicing elit. Laudantium voluptatum aut
							voluptates distinctio nam neque dolore, maiores
							autem impedit, doloribus eveniet laborum
							necessitatibus ex! Possimus odit in commodi nulla
							architecto. Lorem ipsum dolor sit amet consectetur
							adipisicing elit. Officia, facere reiciendis
							incidunt obcaecati aut corrupti tempora commodi nam
							aspernatur et quas beatae delectus perspiciatis
							alias quia inventore molestias quis exercitationem?
							Lorem, ipsum dolor sit amet consectetur adipisicing
							elit. Blanditiis temporibus doloremque nam molestiae
							quidem, repellendus eligendi ex magnam quasi. Est
							doloribus quam accusantium? Consequuntur, vel
							sapiente alias repudiandae nisi soluta. Lorem ipsum
							dolor sit amet consectetur adipisicing elit.
							Reiciendis, quibusdam maxime. Numquam, explicabo! At
							vero eligendi cupiditate vel molestias eos sint,
							obcaecati minus suscipit ducimus libero
							reprehenderit, itaque debitis atque? Lorem ipsum
							dolor sit amet, consectetur adipisicing elit.
							Repellendus vero consequatur velit dolores neque
							distinctio harum tempore. Vitae, doloribus
							perferendis! Deserunt reprehenderit dolor tempora
							atque amet officiis ea, velit iste. Lorem ipsum
							dolor sit, amet consectetur adipisicing elit. Est
							nemo accusamus, inventore assumenda et nulla. Eius,
							consequuntur repudiandae ea corrupti eos magni
							itaque temporibus blanditiis aspernatur, earum quam
							ut. Laudantium. Lorem ipsum dolor sit amet
							consectetur adipisicing elit. Doloremque recusandae,
							distinctio in fuga vero ullam tempora nisi laborum
							unde architecto, doloribus dicta fugiat itaque
							voluptatibus dolorum vel aspernatur, inventore nemo?
							Lorem ipsum dolor sit amet consectetur adipisicing
							elit. Error, corporis animi. Praesentium voluptate,
							optio tenetur harum odio sequi eos possimus officiis
							dignissimos. Laboriosam voluptates fuga est.
							Deserunt quod officia harum!
						</Collapsible>
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

function ModalShowcase(props: ShowcaseProps) {
	const example = (
		<>
			<AKExample />
			<ControlledExample />
		</>
	)

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
			]}
		/>
	)
}

export default ModalShowcase
