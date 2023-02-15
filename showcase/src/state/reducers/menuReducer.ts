
const initialState: MenuItem[] = []

export interface MenuItem {
    id: string
    menuName: string | null
}

export interface SetMenu {
    type: "SET_MENU"
}

export interface ClearMenu {
    type: "CLEAR_MENU"
}

export type Action = SetMenu | ClearMenu

const menuReducer = (state: MenuItem[] = initialState, action: Action) => {
    switch (action.type) {
        case "SET_MENU":
            const ids = Array.from(document.getElementsByClassName("menu")).map((item) => {
                return {  id: item.id,  menuName: item.getAttribute("menu-name")}
            })
            return [...ids]
        case "CLEAR_MENU":
            return []
        default:
            return [...state]
    }
}

export default menuReducer