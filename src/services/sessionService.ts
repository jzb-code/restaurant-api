import {getSession} from "../store";

export const sessionService = {
    get(id: number) {
        return getSession(id);
    }
};
