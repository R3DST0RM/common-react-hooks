import { SetStateAction, useEffect, useState } from "react";
import { isNil } from "typescript-toolbox";
import { getLocalStorageItem } from "./getLocalStorageItem";

const isFunction = <T>(functionToCheck: T | ((...args: any[]) => any)): functionToCheck is (...args: any[]) => any => {
    return typeof functionToCheck === "function";
}


export function useLocalStorageState<T>(key: string, initialState?: T | (() => T)): [T | null, (updater: SetStateAction<T | null>) => void] {
    function getInitialState() {
        const valueFromStorage = getLocalStorageItem<T>(key);

        if (isNil(valueFromStorage) && initialState) {
            return isFunction(initialState) ? initialState() : initialState;
        }

        return valueFromStorage;
    }

    const [state, setState] = useState(getInitialState);

    useEffect(() => {
        setState(getInitialState());
    }, [key]);

    const updateLocalState = (updater: SetStateAction<T | null>) => {
        const updateFn = (prev: T | null) => {
            const nextState = isFunction(updater) ? updater(prev) : updater;
            localStorage.setItem(key, JSON.stringify(nextState));
            return nextState;
        }

        setState(updateFn);
    }

    return [state, updateLocalState];
}