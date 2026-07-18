import { n as cn } from "./button-BpE9Czok.js";
import { jsx, jsxs } from "react/jsx-runtime";
//#region src/components/brand/logo.tsx
function Logo({ className, showWordmark = true }) {
	return /* @__PURE__ */ jsxs("div", {
		className: cn("flex items-center gap-2", className),
		children: [/* @__PURE__ */ jsx("span", {
			"aria-hidden": true,
			className: "grid h-8 w-8 place-items-center rounded-md bg-primary text-primary-foreground shadow-[var(--shadow-elevation-2)]",
			children: /* @__PURE__ */ jsxs("svg", {
				viewBox: "0 0 24 24",
				className: "h-4 w-4",
				fill: "none",
				stroke: "currentColor",
				strokeWidth: "2.4",
				children: [
					/* @__PURE__ */ jsx("path", {
						d: "M3 11.5 12 4l9 7.5",
						strokeLinecap: "round",
						strokeLinejoin: "round"
					}),
					/* @__PURE__ */ jsx("path", {
						d: "M5 10.5V20h14v-9.5",
						strokeLinecap: "round",
						strokeLinejoin: "round"
					}),
					/* @__PURE__ */ jsx("path", {
						d: "M10 20v-5h4v5",
						strokeLinecap: "round",
						strokeLinejoin: "round"
					})
				]
			})
		}), showWordmark ? /* @__PURE__ */ jsx("span", {
			className: "text-base font-semibold tracking-tight text-foreground",
			children: "Hostly"
		}) : null]
	});
}
//#endregion
export { Logo as t };
