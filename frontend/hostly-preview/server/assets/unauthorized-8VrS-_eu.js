import { t as Button } from "./button-BpE9Czok.js";
import { Link } from "@tanstack/react-router";
import { jsx, jsxs } from "react/jsx-runtime";
import { ShieldAlert } from "lucide-react";
//#region src/routes/unauthorized.tsx?tsr-split=component
var SplitComponent = () => /* @__PURE__ */ jsx("div", {
	className: "grid min-h-dvh place-items-center bg-background px-6",
	children: /* @__PURE__ */ jsxs("div", {
		className: "max-w-md text-center",
		children: [
			/* @__PURE__ */ jsx(ShieldAlert, { className: "mx-auto h-10 w-10 text-warning" }),
			/* @__PURE__ */ jsx("h1", {
				className: "mt-4 text-2xl font-semibold tracking-tight",
				children: "You don't have access"
			}),
			/* @__PURE__ */ jsx("p", {
				className: "mt-2 text-sm text-muted-foreground",
				children: "Your account doesn't have permission to view this page. If you think this is a mistake, ask your workspace administrator."
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "mt-6 flex justify-center gap-2",
				children: [/* @__PURE__ */ jsx(Button, {
					asChild: true,
					children: /* @__PURE__ */ jsx(Link, {
						to: "/",
						children: "Back to dashboard"
					})
				}), /* @__PURE__ */ jsx(Button, {
					asChild: true,
					variant: "outline",
					children: /* @__PURE__ */ jsx(Link, {
						to: "/login",
						children: "Switch account"
					})
				})]
			})
		]
	})
});
//#endregion
export { SplitComponent as component };
