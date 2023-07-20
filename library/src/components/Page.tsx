import styled from "@emotion/styled"

export const Page = styled.div`
	height: 100%;
	display: flex;
	flex-direction: column;

	h5 {
		margin: 0 0 10px;
	}
`

export const PageHeader = styled.div`
	margin: -20px;
	margin-bottom: 0;
	padding: 40px 40px 20px;
	background-color: var(
		--ds-background-subtleBorderedNeutral-resting,
		#fafbfc
	);
	border-bottom: 1px solid #dfe1e6;
	box-shadow: 0 2px 15px #ddd;

	input {
		background-color: white;
	}
`

export const PageHeaderTitle = styled.div`
	display: flex;
	gap: 10px;
	align-items: center;
`

export const PageHeaderSubTitle = styled.p``

export const PageBody = styled.div`
	display: flex;
	flex: 1;
	flex-direction: column;
	min-width: 0;
	min-height: 0;
	padding: 0 20px 0 6px;
	margin: 15px 15px 0 15px;
`

export const PageHeaderLine = styled.div`
	margin-top: 15px;
	width: 65%;
	display: flex;
	align-items: center;

	> * {
		margin-right: 5px;
	}
`
