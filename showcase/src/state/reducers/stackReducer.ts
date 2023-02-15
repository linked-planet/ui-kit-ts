export interface SetStack {
    type: "SET_STACK"
    stack: string[]
}

export interface Default {
    type: "GET_STACK"
}

export type MyAction =  SetStack | Default

const stackReducer = (state: string[] = [], action: MyAction) => {
    switch (action.type) {
        case "SET_STACK":
            return [...action.stack]
        default:
            return [...state]
    }
}

export default stackReducer