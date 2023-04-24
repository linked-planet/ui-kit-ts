import React, { useState } from "react";
import ShowcaseWrapperItem, { ShowcaseProps } from "../../ShowCaseWrapperItem/ShowcaseWrapperItem";
import Button, { ButtonGroup } from "@atlaskit/button";
import CrossIcon from "@atlaskit/icon/glyph/cross";
import Modal, { ModalBody, ModalFooter, ModalHeader, ModalTitle, ModalTransition } from "@atlaskit/modal-dialog";


function ModalShowcase ( props: ShowcaseProps ) {

	// region: modal
	const [ isModalActive, setIsModalActive ] = useState( false )
	const example = (
		<div>
			<Button onClick={ () => setIsModalActive( true ) }>
				Show modal
			</Button>

			{ isModalActive &&
				<ModalTransition>
					<Modal onClose={ () => setIsModalActive( false ) }>
						<ModalHeader>
							<ModalTitle>Sample Modal</ModalTitle>
							<Button
								appearance="link"
								onClick={ () => setIsModalActive( false ) }>
								<CrossIcon label="Close popup" primaryColor="#000" />
							</Button>
						</ModalHeader>

						<ModalBody>
							<p>This is the body of the modal.</p>
						</ModalBody>

						<ModalFooter>
							<ButtonGroup>
								<Button autoFocus={ true } appearance="primary"
									onClick={ () => setIsModalActive( false ) }>Close</Button>
							</ButtonGroup>
						</ModalFooter>
					</Modal>
				</ModalTransition>
			}
		</div>
	)
	// endregion: modal

	return (
		<ShowcaseWrapperItem
			name="Modal"
			sourceCodeExampleId="modal"
			overallSourceCode={ props.overallSourceCode }
			packages={ [
				{
					name: "@atlaskit/modal-dialog",
					url: "https://atlassian.design/components/modal-dialog/examples"
				}
			] }

			examples={
				[
					( example )
				]
			}
		/>
	)

}

export default ModalShowcase;