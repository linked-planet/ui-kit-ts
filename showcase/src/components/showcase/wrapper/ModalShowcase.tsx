import React, { useState } from "react"
import ShowcaseWrapperItem, {
	ShowcaseProps,
} from "../../ShowCaseWrapperItem/ShowcaseWrapperItem"
import CrossIcon from "@atlaskit/icon/glyph/cross"
import {
	default as AKModal,
	ModalBody as AKModalBody,
	ModalFooter as AKModalFooter,
	ModalHeader as AKModalHeader,
	ModalTitle as AKModalTitle,
	ModalTransition as AKModalTransition,
} from "@atlaskit/modal-dialog"
import {
	Modal,
	Select,
	Button,
	ButtonGroup,
	Dropdown,
} from "@linked-planet/ui-kit-ts"
import { default as AKSelect } from "@atlaskit/select"
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

			{isAKModalActive && (
				<AKModalTransition>
					<AKModal onClose={() => setIsAKModalActive(false)}>
						<AKModalHeader>
							<AKModalTitle>Sample Modal</AKModalTitle>
							<Button
								appearance="link"
								onClick={() => setIsAKModalActive(false)}
							>
								<CrossIcon
									label="Close popup"
									primaryColor="#000"
								/>
							</Button>
						</AKModalHeader>

						<AKModalBody>
							<p>This is the body of the AK modal.</p>
							<AKSelect options={selectOptions}></AKSelect>
							<Select
								placeholder="Choose"
								options={selectOptions}
								side="bottom"
								align="end"
								className="z-10"
							></Select>
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
			)}
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
					Show Modal
				</Button>

				{isModalActive && (
					<Modal.Container
						open={isModalActive}
						onOpenChange={(opened) => {
							if (!opened) setIsModalActive(false)
						}}
					>
						<Modal.Header>
							<Modal.Title>Sample Modal</Modal.Title>
							<Button
								appearance="link"
								onClick={() => setIsModalActive(false)}
							>
								<CrossIcon
									label="Close popup"
									primaryColor="#000"
								/>
							</Button>
						</Modal.Header>
						<Modal.Body>
							<div>
								<p>This is the body of the modal.</p>
							</div>
							<AKSelect options={selectOptions}></AKSelect>
							<Select
								placeholder="Choose"
								options={selectOptions}
								side="bottom"
								align="end"
							/>
							<Dropdown.Menu
								triggerClassName="w-full"
								align="end"
								trigger="Dropdown"
							>
								{ddItems}
							</Dropdown.Menu>
						</Modal.Body>
						<Modal.Footer>
							<Modal.CloseTrigger>
								<Button appearance="primary" className="z-0">
									Close
								</Button>
							</Modal.CloseTrigger>
						</Modal.Footer>
					</Modal.Container>
				)}
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
