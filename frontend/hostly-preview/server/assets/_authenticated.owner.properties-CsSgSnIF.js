import { n as useAuth } from "./auth-provider-ucs5_vFo.js";
import { n as useWorkspace } from "./workspace-provider-Cxe5ySHG.js";
import { t as Button } from "./button-BpE9Czok.js";
import { a as DashboardShell, c as DropdownMenu, d as DropdownMenuTrigger, l as DropdownMenuContent, t as OWNER_NAV, u as DropdownMenuItem } from "./navigation-BC2JVMIz.js";
import { n as CardContent, t as Card } from "./card-BM637P_-.js";
import { t as Badge } from "./badge-DHlcf1ty.js";
import { t as Input } from "./input-NvmijQlt.js";
import { t as Label } from "./label-AutfcB-T.js";
import { a as DialogHeader, i as DialogFooter, n as DialogContent, o as DialogTitle, s as DialogTrigger, t as Dialog } from "./dialog-YNSXVwJV.js";
import { useState } from "react";
import { Navigate, useNavigate } from "@tanstack/react-router";
import { jsx, jsxs } from "react/jsx-runtime";
import { toast } from "sonner";
import { BedDouble, Building2, MapPin, MoreHorizontal, Plus, Users } from "lucide-react";
//#region src/routes/_authenticated.owner.properties.tsx?tsr-split=component
function PropertiesPage() {
	const { user } = useAuth();
	const { workspaces, switchWorkspace } = useWorkspace();
	const navigate = useNavigate();
	const [open, setOpen] = useState(false);
	const [form, setForm] = useState({
		name: "",
		city: "",
		address: "",
		beds: ""
	});
	if (!user) return null;
	if (user.role !== "owner") return /* @__PURE__ */ jsx(Navigate, { to: "/unauthorized" });
	function submit() {
		if (!form.name.trim() || !form.city.trim()) {
			toast.error("Name and city required");
			return;
		}
		toast.success(`${form.name} queued — activation email sent`);
		setForm({
			name: "",
			city: "",
			address: "",
			beds: ""
		});
		setOpen(false);
	}
	return /* @__PURE__ */ jsxs(DashboardShell, {
		title: "Properties",
		subtitle: `${workspaces.length} properties in your portfolio`,
		navGroups: OWNER_NAV,
		showWorkspaceSwitcher: true,
		children: [/* @__PURE__ */ jsxs("div", {
			className: "mb-4 flex items-center justify-between",
			children: [/* @__PURE__ */ jsx("p", {
				className: "text-sm text-muted-foreground",
				children: "Manage buildings, floors and amenities"
			}), /* @__PURE__ */ jsxs(Dialog, {
				open,
				onOpenChange: setOpen,
				children: [/* @__PURE__ */ jsx(DialogTrigger, {
					asChild: true,
					children: /* @__PURE__ */ jsxs(Button, {
						size: "sm",
						children: [/* @__PURE__ */ jsx(Plus, { className: "mr-1 h-4 w-4" }), " Add property"]
					})
				}), /* @__PURE__ */ jsxs(DialogContent, { children: [
					/* @__PURE__ */ jsx(DialogHeader, { children: /* @__PURE__ */ jsx(DialogTitle, { children: "Add property" }) }),
					/* @__PURE__ */ jsxs("div", {
						className: "grid gap-3",
						children: [
							/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx(Label, { children: "Property name" }), /* @__PURE__ */ jsx(Input, {
								value: form.name,
								onChange: (e) => setForm({
									...form,
									name: e.target.value
								}),
								className: "mt-1.5"
							})] }),
							/* @__PURE__ */ jsxs("div", {
								className: "grid grid-cols-2 gap-3",
								children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx(Label, { children: "City" }), /* @__PURE__ */ jsx(Input, {
									value: form.city,
									onChange: (e) => setForm({
										...form,
										city: e.target.value
									}),
									className: "mt-1.5"
								})] }), /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx(Label, { children: "Total beds" }), /* @__PURE__ */ jsx(Input, {
									type: "number",
									value: form.beds,
									onChange: (e) => setForm({
										...form,
										beds: e.target.value
									}),
									className: "mt-1.5"
								})] })]
							}),
							/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx(Label, { children: "Address" }), /* @__PURE__ */ jsx(Input, {
								value: form.address,
								onChange: (e) => setForm({
									...form,
									address: e.target.value
								}),
								className: "mt-1.5"
							})] })
						]
					}),
					/* @__PURE__ */ jsxs(DialogFooter, { children: [/* @__PURE__ */ jsx(Button, {
						variant: "outline",
						onClick: () => setOpen(false),
						children: "Cancel"
					}), /* @__PURE__ */ jsx(Button, {
						onClick: submit,
						children: "Add property"
					})] })
				] })]
			})]
		}), /* @__PURE__ */ jsx("div", {
			className: "grid gap-4 md:grid-cols-2 xl:grid-cols-3",
			children: workspaces.map((w) => {
				const occ = Math.round(w.occupiedBeds / w.totalBeds * 100);
				return /* @__PURE__ */ jsx(Card, {
					className: "border-border/70",
					children: /* @__PURE__ */ jsxs(CardContent, {
						className: "p-5",
						children: [
							/* @__PURE__ */ jsxs("div", {
								className: "flex items-start justify-between",
								children: [/* @__PURE__ */ jsxs("div", {
									className: "flex items-center gap-3",
									children: [/* @__PURE__ */ jsx("span", {
										className: "grid h-11 w-11 place-items-center rounded-md bg-primary/10 text-sm font-semibold text-primary",
										children: w.initials
									}), /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("p", {
										className: "text-sm font-semibold",
										children: w.name
									}), /* @__PURE__ */ jsxs("p", {
										className: "flex items-center gap-1 text-xs text-muted-foreground",
										children: [
											/* @__PURE__ */ jsx(MapPin, { className: "h-3 w-3" }),
											" ",
											w.city
										]
									})] })]
								}), /* @__PURE__ */ jsxs(DropdownMenu, { children: [/* @__PURE__ */ jsx(DropdownMenuTrigger, {
									asChild: true,
									children: /* @__PURE__ */ jsx(Button, {
										variant: "ghost",
										size: "icon",
										className: "h-7 w-7",
										children: /* @__PURE__ */ jsx(MoreHorizontal, { className: "h-4 w-4" })
									})
								}), /* @__PURE__ */ jsxs(DropdownMenuContent, {
									align: "end",
									children: [
										/* @__PURE__ */ jsx(DropdownMenuItem, {
											onClick: () => {
												switchWorkspace(w.id);
												navigate({ to: "/owner/dashboard" });
											},
											children: "Open dashboard"
										}),
										/* @__PURE__ */ jsx(DropdownMenuItem, {
											onClick: () => {
												switchWorkspace(w.id);
												navigate({ to: "/owner/rooms" });
											},
											children: "Manage rooms"
										}),
										/* @__PURE__ */ jsx(DropdownMenuItem, {
											onClick: () => {
												navigator.clipboard?.writeText(w.address);
												toast.success("Address copied");
											},
											children: "Copy address"
										})
									]
								})] })]
							}),
							/* @__PURE__ */ jsx("p", {
								className: "mt-3 text-xs text-muted-foreground",
								children: w.address
							}),
							/* @__PURE__ */ jsxs("div", {
								className: "mt-4 grid grid-cols-3 gap-2 text-center",
								children: [
									/* @__PURE__ */ jsx(Stat, {
										icon: BedDouble,
										label: "Beds",
										value: w.totalBeds.toString()
									}),
									/* @__PURE__ */ jsx(Stat, {
										icon: Users,
										label: "Occupied",
										value: w.occupiedBeds.toString()
									}),
									/* @__PURE__ */ jsx(Stat, {
										icon: Building2,
										label: "Occupancy",
										value: `${occ}%`
									})
								]
							}),
							/* @__PURE__ */ jsxs("div", {
								className: "mt-4 flex items-center justify-between",
								children: [/* @__PURE__ */ jsx(Badge, {
									variant: "secondary",
									className: "bg-success/10 text-success",
									children: "Active"
								}), /* @__PURE__ */ jsx(Button, {
									size: "sm",
									variant: "outline",
									onClick: () => {
										switchWorkspace(w.id);
										navigate({ to: "/owner/dashboard" });
									},
									children: "Manage"
								})]
							})
						]
					})
				}, w.id);
			})
		})]
	});
}
function Stat({ icon: Icon, label, value }) {
	return /* @__PURE__ */ jsxs("div", {
		className: "rounded-md border border-border/70 bg-muted/30 p-2",
		children: [
			/* @__PURE__ */ jsx(Icon, { className: "mx-auto h-3.5 w-3.5 text-muted-foreground" }),
			/* @__PURE__ */ jsx("p", {
				className: "mt-1 text-sm font-semibold",
				children: value
			}),
			/* @__PURE__ */ jsx("p", {
				className: "text-[10px] uppercase tracking-wider text-muted-foreground",
				children: label
			})
		]
	});
}
//#endregion
export { PropertiesPage as component };
