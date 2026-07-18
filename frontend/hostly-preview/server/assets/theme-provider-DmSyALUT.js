import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { jsx } from "react/jsx-runtime";
//#region src/providers/theme-provider.tsx
var ThemeContext = createContext(null);
var STORAGE_KEY = "hostly.theme.v1";
function readInitial() {
	if (typeof window === "undefined") return "system";
	return window.localStorage.getItem(STORAGE_KEY) ?? "system";
}
function systemTheme() {
	if (typeof window === "undefined") return "light";
	return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}
function ThemeProvider({ children }) {
	const [theme, setThemeState] = useState(readInitial);
	const [systemPref, setSystemPref] = useState(() => systemTheme());
	useEffect(() => {
		const mql = window.matchMedia("(prefers-color-scheme: dark)");
		const onChange = () => setSystemPref(mql.matches ? "dark" : "light");
		mql.addEventListener("change", onChange);
		return () => mql.removeEventListener("change", onChange);
	}, []);
	const resolvedTheme = theme === "system" ? systemPref : theme;
	useEffect(() => {
		document.documentElement.classList.toggle("dark", resolvedTheme === "dark");
	}, [resolvedTheme]);
	const value = useMemo(() => ({
		theme,
		resolvedTheme,
		setTheme: (next) => {
			setThemeState(next);
			window.localStorage.setItem(STORAGE_KEY, next);
		}
	}), [theme, resolvedTheme]);
	return /* @__PURE__ */ jsx(ThemeContext.Provider, {
		value,
		children
	});
}
function useTheme() {
	const ctx = useContext(ThemeContext);
	if (!ctx) throw new Error("useTheme must be used within <ThemeProvider>");
	return ctx;
}
//#endregion
export { useTheme as n, ThemeProvider as t };
