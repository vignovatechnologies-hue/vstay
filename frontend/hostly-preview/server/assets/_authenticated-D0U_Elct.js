import { a as getDashboardRouteForRole, n as useAuth, o as isStaffRole } from "./auth-provider-ucs5_vFo.js";
import { useEffect } from "react";
import { Navigate, Outlet, useLocation } from "@tanstack/react-router";
import { jsx } from "react/jsx-runtime";
//#region src/routes/_authenticated.tsx?tsr-split=component
/**
* Pathless layout that gates every authenticated page. Runs client-side
* only (ssr:false) so we can read the mock session from localStorage.
*/
function AuthenticatedLayout() {
	const { status, user } = useAuth();
	const location = useLocation();
	useEffect(() => {
		const root = document.documentElement;
		root.classList.add("theme-navy", "dark");
		return () => {
			root.classList.remove("theme-navy");
		};
	}, []);
	if (status === "loading") return /* @__PURE__ */ jsx("div", {
		className: "grid min-h-dvh place-items-center bg-background",
		children: /* @__PURE__ */ jsx("div", { className: "h-5 w-5 animate-spin rounded-full border-2 border-primary border-t-transparent" })
	});
	if (!user) return /* @__PURE__ */ jsx(Navigate, {
		to: "/login",
		search: { redirect: location.href }
	});
	const path = location.pathname;
	if (path.startsWith("/owner") && user.role !== "owner") return /* @__PURE__ */ jsx(Navigate, { to: getDashboardRouteForRole(user.role) });
	if (path.startsWith("/super-admin") && user.role !== "super_admin") return /* @__PURE__ */ jsx(Navigate, { to: getDashboardRouteForRole(user.role) });
	if (path.startsWith("/tenant") && user.role !== "tenant") return /* @__PURE__ */ jsx(Navigate, { to: getDashboardRouteForRole(user.role) });
	if (path.startsWith("/staff") && !isStaffRole(user.role)) return /* @__PURE__ */ jsx(Navigate, { to: getDashboardRouteForRole(user.role) });
	return /* @__PURE__ */ jsx(Outlet, {});
}
//#endregion
export { AuthenticatedLayout as component };
