import { ActionRequestContext, StateRequestContext } from "../types/types";

export const Reducer = (state: StateRequestContext, action: ActionRequestContext): StateRequestContext => {
    switch (action.type) {
        case 'isDownloadDoc': return { ...state, isDownloadDoc: action.payload }
        default: return state;
    }
}