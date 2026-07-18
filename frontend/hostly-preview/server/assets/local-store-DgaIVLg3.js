import { useCallback, useEffect, useRef, useState } from "react";
//#region src/lib/local-store.ts
function isBrowser() {
	return typeof window !== "undefined" && !!window.localStorage;
}
function read(key, fallback) {
	if (!isBrowser()) return fallback;
	try {
		const raw = window.localStorage.getItem(key);
		return raw ? JSON.parse(raw) : fallback;
	} catch {
		return fallback;
	}
}
function write(key, value) {
	if (!isBrowser()) return;
	try {
		window.localStorage.setItem(key, JSON.stringify(value));
	} catch {}
}
function useLocalState(key, seed) {
	const [state, setState] = useState(() => read(key, seed));
	const first = useRef(true);
	useEffect(() => {
		if (first.current) {
			first.current = false;
			return;
		}
		write(key, state);
	}, [key, state]);
	return [
		state,
		setState,
		useCallback(() => setState(seed), [seed])
	];
}
function useLocalCollection(key, seed) {
	const [items, setItems] = useLocalState(key, seed);
	return {
		items,
		setItems,
		add: useCallback((item) => setItems((prev) => [item, ...prev]), [setItems]),
		update: useCallback((id, patch) => setItems((prev) => prev.map((it) => it.id === id ? {
			...it,
			...patch
		} : it)), [setItems]),
		remove: useCallback((id) => setItems((prev) => prev.filter((it) => it.id !== id)), [setItems])
	};
}
//#endregion
export { useLocalState as n, useLocalCollection as t };
