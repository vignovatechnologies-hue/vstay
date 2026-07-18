import { n as cn } from "./button-BpE9Czok.js";
import { n as CardContent, t as Card } from "./card-BM637P_-.js";
import { jsx, jsxs } from "react/jsx-runtime";
//#region src/components/layout/kpi-card.tsx
function KpiCard({ label, value, delta, tone = "neutral", icon: Icon }) {
	return /* @__PURE__ */ jsx(Card, {
		className: "border-border/70 shadow-[var(--shadow-elevation-1)]",
		children: /* @__PURE__ */ jsxs(CardContent, {
			className: "flex items-start gap-4 p-5",
			children: [Icon ? /* @__PURE__ */ jsx("span", {
				className: "grid h-10 w-10 place-items-center rounded-md bg-primary/10 text-primary",
				children: /* @__PURE__ */ jsx(Icon, { className: "h-5 w-5" })
			}) : null, /* @__PURE__ */ jsxs("div", {
				className: "min-w-0 flex-1",
				children: [
					/* @__PURE__ */ jsx("p", {
						className: "text-xs font-medium uppercase tracking-wider text-muted-foreground",
						children: label
					}),
					/* @__PURE__ */ jsx("p", {
						className: "mt-1 text-2xl font-semibold tracking-tight text-foreground",
						children: value
					}),
					delta ? /* @__PURE__ */ jsx("p", {
						className: cn("mt-1 text-xs font-medium", tone === "up" && "text-success", tone === "down" && "text-destructive", tone === "neutral" && "text-muted-foreground"),
						children: delta
					}) : null
				]
			})]
		})
	});
}
//#endregion
export { KpiCard as t };
