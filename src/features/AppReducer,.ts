import { ActionAppContext, StateAppContext } from "../types/types";

export const Reducer = (state: StateAppContext, action: ActionAppContext): StateAppContext => {
    switch (action.type) {
        case 'updateTheme': return { ...state, theme: action.payload }
        case 'updateState': return {
            ...state,
            status: action.payload.state,
            User: action.payload.User
        }

        default: return state;
    }

}