import { token } from "@atlaskit/tokens"
import styled from "@emotion/styled"

const Page = styled.div`
	width: 100%;
	height: 100%;
	min-height: 0;
	display: flex;
	flex-direction: column;
	overflow: hidden;
	background-color: ${token("elevation.surface", "#fff")};
`

const PageHeader = styled.div`
	background: ${token("elevation.surface.raised", "#fafbfc")};
	padding-top: 20px;
	padding-left: 20px;
	padding-right: 14px;
	border-bottom: 1px solid ${token("color.border", "#091e4224")};
`

const PageHeaderTitle = styled.div`
	margin-bottom: 8px;
`

const PageHeaderSubTitle = styled.div`
	color: ${token("color.text.subtlest", "#172B4D")};
	margin-top: 10px;
	margin-bottom: 10px;
`

const PageHeaderLine = styled.div`
	display: flex;
	width: 100%;
	gap: 4px;
	margin-bottom: 8px;
`

const PageBody = styled.div`
	display: flex;
	flex-direction: column;
	min-height: 0;
	flex: 1;
	min-width: 0;
	margin-bottom: 4px;
`

const PageBodyHeader = styled.div`
	z-index: 0;
	background-color: ${token("elevation.surface.raised", "#fafbfc")};
	padding-top: 14px;
	padding-bottom: 10px;
	padding-left: 20px;
	padding-right: 14px;
	box-shadow: 0 4px 4px ${token("color.border", "#091e4224")};
`

const PageBodyContent = styled.div`
	flex: 1;
	overflow-y: auto;
	min-height: 0;
	padding-left: 20px;
	padding-right: 14px;
	padding-bottom: 20px;
	padding-top: 10px;
`

const PageBodyFooter = styled.div`
	display: flex;
	min-height: 0;
	justify-content: center;
	background-color: ${token("elevation.surface.raised", "#fafbfc")};
	padding-top: 4px;
	border-top: 1px solid ${token("color.border", "#091e4224")};
	box-shadow: 0 -4px 4px ${token("color.border", "#091e4224")};
`

const PageLayout = {
	Page,
	PageHeader,
	PageHeaderTitle,
	PageHeaderSubTitle,
	PageBody,
	PageBodyHeader,
	PageBodyContent,
	PageBodyFooter,
	PageHeaderLine,
}
export default PageLayout
