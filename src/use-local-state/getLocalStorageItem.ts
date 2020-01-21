import { isNil } from "typescript-toolbox";

export const getLocalStorageItem = <T>(key: string): T | null => {
    const value = localStorage.getItem(key);

    if (isNil(value)) {
        return null;
    }

    try {
        return JSON.parse(value);
    } catch (exception) {
        return null;
    }
}