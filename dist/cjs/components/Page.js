"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PageHeaderLine = exports.PageBody = exports.PageHeaderSubTitle = exports.PageHeaderTitle = exports.PageHeader = exports.Page = void 0;
const styled_components_1 = __importDefault(require("styled-components"));
exports.Page = styled_components_1.default.div `
  height: 100%;
  display: flex;
  flex-direction: column;
  
  h5 {
    margin: 0 0 10px;
  }
`;
exports.PageHeader = styled_components_1.default.div `
  margin: -20px;
  margin-bottom: 0;
  padding: 40px 40px 20px;
  background-color: var(--ds-background-subtleBorderedNeutral-resting, #FAFBFC);
  border-bottom: 1px solid #dfe1e6;
  box-shadow: 0 2px 15px #ddd;
  
  input {
    background-color: white;
  }
`;
exports.PageHeaderTitle = styled_components_1.default.div `
  display: flex;
  gap: 10px;
  align-items: center;   
`;
exports.PageHeaderSubTitle = styled_components_1.default.p `
`;
exports.PageBody = styled_components_1.default.div `
  display: flex;
  flex: 1;
  flex-direction: column;
  min-width: 0;
  min-height: 0;
  padding: 0 20px 0 6px;
  margin: 15px 15px 0 15px;
`;
exports.PageHeaderLine = styled_components_1.default.div `
  margin-top: 15px;
  width: 65%;
  display: flex;
  align-items: center;
  
  > * {
    margin-right: 5px;
  }
`;
//# sourceMappingURL=Page.js.map