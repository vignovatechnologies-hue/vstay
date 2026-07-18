import { n as useTheme } from "./theme-provider-DmSyALUT.js";
import { i as ROLE_LABEL, n as useAuth } from "./auth-provider-ucs5_vFo.js";
import { n as useWorkspace } from "./workspace-provider-Cxe5ySHG.js";
import { n as cn, t as Button } from "./button-BpE9Czok.js";
import { t as Logo } from "./logo-CiKh46W1.js";
import * as React from "react";
import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { jsx, jsxs } from "react/jsx-runtime";
import { BarChart3, BedDouble, Bell, Building2, Check, ChevronRight, ChevronsUpDown, Circle, CreditCard, FileText, LayoutDashboard, LogOut, MessagesSquare, Monitor, Moon, Search, Settings, ShieldCheck, Sun, Tag, User, Users, WashingMachine, Wrench } from "lucide-react";
import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu";
import * as AvatarPrimitive from "@radix-ui/react-avatar";
//#region src/components/layout/sidebar.tsx
function Sidebar({ groups, footerSlot }) {
	const pathname = useRouterState({ select: (s) => s.location.pathname });
	return /* @__PURE__ */ jsxs("aside", {
		className: "hidden h-dvh w-60 shrink-0 flex-col border-r border-sidebar-border bg-sidebar md:flex",
		children: [
			/* @__PURE__ */ jsx("div", {
				className: "flex h-14 items-center border-b border-sidebar-border px-4",
				children: /* @__PURE__ */ jsx(Link, {
					to: "/",
					className: "rounded outline-none focus-visible:ring-2 focus-visible:ring-ring",
					children: /* @__PURE__ */ jsx(Logo, {})
				})
			}),
			/* @__PURE__ */ jsx("nav", {
				className: "flex-1 overflow-y-auto px-2 py-3",
				"aria-label": "Primary",
				children: groups.map((group) => /* @__PURE__ */ jsxs("div", {
					className: "mb-4",
					children: [/* @__PURE__ */ jsx("p", {
						className: "px-2 pb-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground",
						children: group.label
					}), /* @__PURE__ */ jsx("ul", {
						className: "space-y-0.5",
						children: group.items.map((item) => {
							const active = pathname === item.to || pathname.startsWith(item.to + "/");
							const Icon = item.icon;
							return /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsxs(Link, {
								to: item.to,
								className: cn("flex h-9 items-center gap-2.5 rounded-md px-2.5 text-sm font-medium transition-colors", "text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground", active && "bg-sidebar-accent text-sidebar-accent-foreground shadow-[inset_2px_0_0_var(--sidebar-primary)]"),
								"aria-current": active ? "page" : void 0,
								children: [/* @__PURE__ */ jsx(Icon, { className: "h-4 w-4 shrink-0" }), /* @__PURE__ */ jsx("span", {
									className: "truncate",
									children: item.label
								})]
							}) }, item.to);
						})
					})]
				}, group.label))
			}),
			footerSlot ? /* @__PURE__ */ jsx("div", {
				className: "border-t border-sidebar-border p-3",
				children: footerSlot
			}) : null
		]
	});
}
//#endregion
//#region src/components/ui/dropdown-menu.tsx
var DropdownMenu = DropdownMenuPrimitive.Root;
var DropdownMenuTrigger = DropdownMenuPrimitive.Trigger;
var DropdownMenuSubTrigger = React.forwardRef(({ className, inset, children, ...props }, ref) => /* @__PURE__ */ jsxs(DropdownMenuPrimitive.SubTrigger, {
	ref,
	className: cn("flex cursor-default select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none focus:bg-accent data-[state=open]:bg-accent [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0", inset && "pl-8", className),
	...props,
	children: [children, /* @__PURE__ */ jsx(ChevronRight, { className: "ml-auto" })]
}));
DropdownMenuSubTrigger.displayName = DropdownMenuPrimitive.SubTrigger.displayName;
var DropdownMenuSubContent = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(DropdownMenuPrimitive.SubContent, {
	ref,
	className: cn("z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-lg data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 origin-(--radix-dropdown-menu-content-transform-origin)", className),
	...props
}));
DropdownMenuSubContent.displayName = DropdownMenuPrimitive.SubContent.displayName;
var DropdownMenuContent = React.forwardRef(({ className, sideOffset = 4, ...props }, ref) => /* @__PURE__ */ jsx(DropdownMenuPrimitive.Portal, { children: /* @__PURE__ */ jsx(DropdownMenuPrimitive.Content, {
	ref,
	sideOffset,
	className: cn("z-50 max-h-[var(--radix-dropdown-menu-content-available-height)] min-w-[8rem] overflow-y-auto overflow-x-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md", "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 origin-(--radix-dropdown-menu-content-transform-origin)", className),
	...props
}) }));
DropdownMenuContent.displayName = DropdownMenuPrimitive.Content.displayName;
var DropdownMenuItem = React.forwardRef(({ className, inset, ...props }, ref) => /* @__PURE__ */ jsx(DropdownMenuPrimitive.Item, {
	ref,
	className: cn("relative flex cursor-default select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&>svg]:size-4 [&>svg]:shrink-0", inset && "pl-8", className),
	...props
}));
DropdownMenuItem.displayName = DropdownMenuPrimitive.Item.displayName;
var DropdownMenuCheckboxItem = React.forwardRef(({ className, children, checked, ...props }, ref) => /* @__PURE__ */ jsxs(DropdownMenuPrimitive.CheckboxItem, {
	ref,
	className: cn("relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50", className),
	checked,
	...props,
	children: [/* @__PURE__ */ jsx("span", {
		className: "absolute left-2 flex h-3.5 w-3.5 items-center justify-center",
		children: /* @__PURE__ */ jsx(DropdownMenuPrimitive.ItemIndicator, { children: /* @__PURE__ */ jsx(Check, { className: "h-4 w-4" }) })
	}), children]
}));
DropdownMenuCheckboxItem.displayName = DropdownMenuPrimitive.CheckboxItem.displayName;
var DropdownMenuRadioItem = React.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ jsxs(DropdownMenuPrimitive.RadioItem, {
	ref,
	className: cn("relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50", className),
	...props,
	children: [/* @__PURE__ */ jsx("span", {
		className: "absolute left-2 flex h-3.5 w-3.5 items-center justify-center",
		children: /* @__PURE__ */ jsx(DropdownMenuPrimitive.ItemIndicator, { children: /* @__PURE__ */ jsx(Circle, { className: "h-2 w-2 fill-current" }) })
	}), children]
}));
DropdownMenuRadioItem.displayName = DropdownMenuPrimitive.RadioItem.displayName;
var DropdownMenuLabel = React.forwardRef(({ className, inset, ...props }, ref) => /* @__PURE__ */ jsx(DropdownMenuPrimitive.Label, {
	ref,
	className: cn("px-2 py-1.5 text-sm font-semibold", inset && "pl-8", className),
	...props
}));
DropdownMenuLabel.displayName = DropdownMenuPrimitive.Label.displayName;
var DropdownMenuSeparator = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(DropdownMenuPrimitive.Separator, {
	ref,
	className: cn("-mx-1 my-1 h-px bg-muted", className),
	...props
}));
DropdownMenuSeparator.displayName = DropdownMenuPrimitive.Separator.displayName;
var DropdownMenuShortcut = ({ className, ...props }) => {
	return /* @__PURE__ */ jsx("span", {
		className: cn("ml-auto text-xs tracking-widest opacity-60", className),
		...props
	});
};
DropdownMenuShortcut.displayName = "DropdownMenuShortcut";
//#endregion
//#region src/components/layout/theme-toggle.tsx
function ThemeToggle() {
	const { theme, setTheme } = useTheme();
	return /* @__PURE__ */ jsxs(DropdownMenu, { children: [/* @__PURE__ */ jsx(DropdownMenuTrigger, {
		asChild: true,
		children: /* @__PURE__ */ jsxs(Button, {
			variant: "ghost",
			size: "icon",
			"aria-label": "Toggle theme",
			children: [/* @__PURE__ */ jsx(Sun, { className: "h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" }), /* @__PURE__ */ jsx(Moon, { className: "absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" })]
		})
	}), /* @__PURE__ */ jsxs(DropdownMenuContent, {
		align: "end",
		className: "w-36",
		children: [
			/* @__PURE__ */ jsxs(DropdownMenuItem, {
				onClick: () => setTheme("light"),
				children: [
					/* @__PURE__ */ jsx(Sun, { className: "mr-2 h-4 w-4" }),
					" Light",
					theme === "light" ? /* @__PURE__ */ jsx("span", {
						className: "ml-auto text-xs text-muted-foreground",
						children: "✓"
					}) : null
				]
			}),
			/* @__PURE__ */ jsxs(DropdownMenuItem, {
				onClick: () => setTheme("dark"),
				children: [
					/* @__PURE__ */ jsx(Moon, { className: "mr-2 h-4 w-4" }),
					" Dark",
					theme === "dark" ? /* @__PURE__ */ jsx("span", {
						className: "ml-auto text-xs text-muted-foreground",
						children: "✓"
					}) : null
				]
			}),
			/* @__PURE__ */ jsxs(DropdownMenuItem, {
				onClick: () => setTheme("system"),
				children: [
					/* @__PURE__ */ jsx(Monitor, { className: "mr-2 h-4 w-4" }),
					" System",
					theme === "system" ? /* @__PURE__ */ jsx("span", {
						className: "ml-auto text-xs text-muted-foreground",
						children: "✓"
					}) : null
				]
			})
		]
	})] });
}
//#endregion
//#region src/components/ui/avatar.tsx
var Avatar = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(AvatarPrimitive.Root, {
	ref,
	className: cn("relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full", className),
	...props
}));
Avatar.displayName = AvatarPrimitive.Root.displayName;
var AvatarImage = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(AvatarPrimitive.Image, {
	ref,
	className: cn("aspect-square h-full w-full", className),
	...props
}));
AvatarImage.displayName = AvatarPrimitive.Image.displayName;
var AvatarFallback = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(AvatarPrimitive.Fallback, {
	ref,
	className: cn("flex h-full w-full items-center justify-center rounded-full bg-muted", className),
	...props
}));
AvatarFallback.displayName = AvatarPrimitive.Fallback.displayName;
//#endregion
//#region src/components/layout/user-menu.tsx
function initials(name) {
	return name.split(" ").map((s) => s[0]).filter(Boolean).slice(0, 2).join("").toUpperCase();
}
function UserMenu() {
	const { user, logout } = useAuth();
	const navigate = useNavigate();
	if (!user) return null;
	async function handleLogout() {
		await logout();
		navigate({ to: "/login" });
	}
	return /* @__PURE__ */ jsxs(DropdownMenu, { children: [/* @__PURE__ */ jsx(DropdownMenuTrigger, {
		asChild: true,
		children: /* @__PURE__ */ jsxs(Button, {
			variant: "ghost",
			className: "gap-2 px-2",
			"aria-label": "Account menu",
			children: [/* @__PURE__ */ jsx(Avatar, {
				className: "h-7 w-7",
				children: /* @__PURE__ */ jsx(AvatarFallback, {
					className: "bg-primary text-[11px] font-semibold text-primary-foreground",
					children: initials(user.fullName)
				})
			}), /* @__PURE__ */ jsx("span", {
				className: "hidden text-sm font-medium md:inline",
				children: user.fullName.split(" ")[0]
			})]
		})
	}), /* @__PURE__ */ jsxs(DropdownMenuContent, {
		align: "end",
		className: "w-60",
		children: [
			/* @__PURE__ */ jsxs(DropdownMenuLabel, {
				className: "flex flex-col gap-0.5",
				children: [
					/* @__PURE__ */ jsx("span", {
						className: "text-sm font-medium",
						children: user.fullName
					}),
					/* @__PURE__ */ jsx("span", {
						className: "text-xs text-muted-foreground",
						children: user.email
					}),
					/* @__PURE__ */ jsx("span", {
						className: "mt-1 inline-flex w-fit rounded bg-secondary px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wider text-secondary-foreground",
						children: ROLE_LABEL[user.role]
					})
				]
			}),
			/* @__PURE__ */ jsx(DropdownMenuSeparator, {}),
			/* @__PURE__ */ jsxs(DropdownMenuItem, {
				disabled: true,
				children: [/* @__PURE__ */ jsx(User, { className: "mr-2 h-4 w-4" }), " Profile (soon)"]
			}),
			/* @__PURE__ */ jsx(DropdownMenuSeparator, {}),
			/* @__PURE__ */ jsxs(DropdownMenuItem, {
				onClick: handleLogout,
				className: "text-destructive focus:text-destructive",
				children: [/* @__PURE__ */ jsx(LogOut, { className: "mr-2 h-4 w-4" }), " Sign out"]
			})
		]
	})] });
}
//#endregion
//#region src/components/layout/workspace-switcher.tsx
var ACCENT = {
	blue: "bg-info/15 text-info",
	violet: "bg-[oklch(0.93_0.05_300)] text-[oklch(0.45_0.18_300)] dark:bg-[oklch(0.3_0.08_300)] dark:text-[oklch(0.85_0.12_300)]",
	amber: "bg-warning/20 text-warning-foreground",
	emerald: "bg-success/15 text-success",
	rose: "bg-destructive/10 text-destructive"
};
function WorkspaceSwitcher() {
	const { workspaces, activeWorkspace, switchWorkspace } = useWorkspace();
	if (workspaces.length === 0) return null;
	return /* @__PURE__ */ jsxs(DropdownMenu, { children: [/* @__PURE__ */ jsx(DropdownMenuTrigger, {
		asChild: true,
		children: /* @__PURE__ */ jsxs(Button, {
			variant: "outline",
			className: "h-9 justify-between gap-2 px-2.5 text-sm",
			children: [/* @__PURE__ */ jsxs("span", {
				className: "flex items-center gap-2 min-w-0",
				children: [/* @__PURE__ */ jsx("span", {
					className: cn("grid h-6 w-6 place-items-center rounded text-[11px] font-semibold", ACCENT[activeWorkspace?.accent ?? "blue"]),
					"aria-hidden": true,
					children: activeWorkspace?.initials ?? /* @__PURE__ */ jsx(Building2, { className: "h-3.5 w-3.5" })
				}), /* @__PURE__ */ jsx("span", {
					className: "truncate font-medium",
					children: activeWorkspace?.name ?? "Select workspace"
				})]
			}), /* @__PURE__ */ jsx(ChevronsUpDown, { className: "h-4 w-4 shrink-0 opacity-60" })]
		})
	}), /* @__PURE__ */ jsxs(DropdownMenuContent, {
		align: "start",
		className: "w-72",
		children: [
			/* @__PURE__ */ jsx(DropdownMenuLabel, {
				className: "text-xs font-medium text-muted-foreground",
				children: "Your workspaces"
			}),
			/* @__PURE__ */ jsx(DropdownMenuSeparator, {}),
			workspaces.map((w) => {
				const active = activeWorkspace?.id === w.id;
				return /* @__PURE__ */ jsxs(DropdownMenuItem, {
					onClick: () => switchWorkspace(w.id),
					className: "gap-3 py-2",
					children: [
						/* @__PURE__ */ jsx("span", {
							className: cn("grid h-8 w-8 place-items-center rounded text-xs font-semibold", ACCENT[w.accent]),
							"aria-hidden": true,
							children: w.initials
						}),
						/* @__PURE__ */ jsxs("span", {
							className: "flex min-w-0 flex-col",
							children: [/* @__PURE__ */ jsx("span", {
								className: "truncate text-sm font-medium",
								children: w.name
							}), /* @__PURE__ */ jsx("span", {
								className: "truncate text-xs text-muted-foreground",
								children: w.city
							})]
						}),
						active ? /* @__PURE__ */ jsx(Check, { className: "ml-auto h-4 w-4 text-primary" }) : null
					]
				}, w.id);
			})
		]
	})] });
}
//#endregion
//#region src/components/layout/topbar.tsx
function Topbar({ title, subtitle, showWorkspaceSwitcher = false }) {
	const { hasRole } = useAuth();
	const showSwitcher = showWorkspaceSwitcher && hasRole("owner");
	return /* @__PURE__ */ jsxs("header", {
		className: "sticky top-0 z-30 flex h-14 items-center gap-3 border-b border-border bg-background/85 px-4 backdrop-blur supports-[backdrop-filter]:bg-background/70",
		children: [
			/* @__PURE__ */ jsxs("div", {
				className: "min-w-0 flex-1",
				children: [/* @__PURE__ */ jsx("h1", {
					className: "truncate text-sm font-semibold leading-tight text-foreground",
					children: title
				}), subtitle ? /* @__PURE__ */ jsx("p", {
					className: "truncate text-xs text-muted-foreground",
					children: subtitle
				}) : null]
			}),
			showSwitcher ? /* @__PURE__ */ jsx(WorkspaceSwitcher, {}) : null,
			/* @__PURE__ */ jsx(Button, {
				variant: "ghost",
				size: "icon",
				"aria-label": "Search",
				className: "hidden sm:inline-flex",
				children: /* @__PURE__ */ jsx(Search, { className: "h-4 w-4" })
			}),
			/* @__PURE__ */ jsx(Button, {
				variant: "ghost",
				size: "icon",
				"aria-label": "Notifications",
				children: /* @__PURE__ */ jsx(Bell, { className: "h-4 w-4" })
			}),
			/* @__PURE__ */ jsx(ThemeToggle, {}),
			/* @__PURE__ */ jsx(UserMenu, {})
		]
	});
}
//#endregion
//#region src/components/layout/dashboard-shell.tsx
function DashboardShell({ title, subtitle, navGroups, showWorkspaceSwitcher, children }) {
	return /* @__PURE__ */ jsxs("div", {
		className: "flex min-h-dvh w-full bg-background",
		children: [/* @__PURE__ */ jsx(Sidebar, { groups: navGroups }), /* @__PURE__ */ jsxs("div", {
			className: "flex min-w-0 flex-1 flex-col",
			children: [/* @__PURE__ */ jsx(Topbar, {
				title,
				subtitle,
				showWorkspaceSwitcher
			}), /* @__PURE__ */ jsx("main", {
				className: "flex-1 px-4 py-6 md:px-8",
				children
			})]
		})]
	});
}
//#endregion
//#region src/config/navigation.ts
var SUPER_ADMIN_NAV = [{
	label: "Platform",
	items: [
		{
			label: "Overview",
			to: "/super-admin/dashboard",
			icon: LayoutDashboard
		},
		{
			label: "Owners",
			to: "/super-admin/owners",
			icon: Users
		},
		{
			label: "Properties",
			to: "/super-admin/properties",
			icon: Building2
		},
		{
			label: "Revenue",
			to: "/super-admin/revenue",
			icon: CreditCard
		},
		{
			label: "Plans & Pricing",
			to: "/super-admin/plans",
			icon: Tag
		},
		{
			label: "Pricing",
			to: "/pricing",
			icon: Tag
		}
	]
}, {
	label: "Operations",
	items: [
		{
			label: "Reports",
			to: "/super-admin/reports",
			icon: BarChart3
		},
		{
			label: "Audit logs",
			to: "/super-admin/audit",
			icon: ShieldCheck
		},
		{
			label: "Announcements",
			to: "/super-admin/announcements",
			icon: Bell
		},
		{
			label: "Settings",
			to: "/super-admin/settings",
			icon: Settings
		}
	]
}];
var OWNER_NAV = [
	{
		label: "Workspace",
		items: [
			{
				label: "Dashboard",
				to: "/owner/dashboard",
				icon: LayoutDashboard
			},
			{
				label: "Properties",
				to: "/owner/properties",
				icon: Building2
			},
			{
				label: "Rooms & Beds",
				to: "/owner/rooms",
				icon: BedDouble
			},
			{
				label: "Tenants",
				to: "/owner/tenants",
				icon: Users
			}
		]
	},
	{
		label: "Finance",
		items: [
			{
				label: "Rent & Payments",
				to: "/owner/payments",
				icon: CreditCard
			},
			{
				label: "Reports",
				to: "/owner/reports",
				icon: BarChart3
			},
			{
				label: "Pricing",
				to: "/pricing",
				icon: Tag
			}
		]
	},
	{
		label: "Operations",
		items: [
			{
				label: "Staff",
				to: "/owner/staff",
				icon: Users
			},
			{
				label: "Complaints",
				to: "/owner/complaints",
				icon: MessagesSquare
			},
			{
				label: "Settings",
				to: "/owner/settings",
				icon: Settings
			}
		]
	}
];
var STAFF_NAV = [{
	label: "Today",
	items: [
		{
			label: "Dashboard",
			to: "/staff/dashboard",
			icon: LayoutDashboard
		},
		{
			label: "Tenants",
			to: "/staff/tenants",
			icon: Users
		},
		{
			label: "Rooms",
			to: "/staff/rooms",
			icon: BedDouble
		},
		{
			label: "Pricing",
			to: "/pricing",
			icon: Tag
		}
	]
}, {
	label: "Operations",
	items: [{
		label: "Complaints",
		to: "/staff/complaints",
		icon: MessagesSquare
	}, {
		label: "Maintenance",
		to: "/staff/maintenance",
		icon: Wrench
	}]
}];
var TENANT_NAV = [{
	label: "My stay",
	items: [
		{
			label: "Dashboard",
			to: "/tenant/dashboard",
			icon: LayoutDashboard
		},
		{
			label: "My room",
			to: "/tenant/room",
			icon: BedDouble
		},
		{
			label: "Rent & receipts",
			to: "/tenant/payments",
			icon: CreditCard
		},
		{
			label: "Pricing",
			to: "/pricing",
			icon: Tag
		}
	]
}, {
	label: "Services",
	items: [
		{
			label: "Laundry",
			to: "/tenant/laundry",
			icon: WashingMachine
		},
		{
			label: "Complaints",
			to: "/tenant/complaints",
			icon: MessagesSquare
		},
		{
			label: "Documents",
			to: "/tenant/documents",
			icon: FileText
		}
	]
}];
//#endregion
export { DashboardShell as a, DropdownMenu as c, DropdownMenuTrigger as d, TENANT_NAV as i, DropdownMenuContent as l, STAFF_NAV as n, Avatar as o, SUPER_ADMIN_NAV as r, AvatarFallback as s, OWNER_NAV as t, DropdownMenuItem as u };
