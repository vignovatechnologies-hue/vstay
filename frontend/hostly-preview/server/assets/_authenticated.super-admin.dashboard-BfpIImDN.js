import { d as db, n as useAuth } from "./auth-provider-ucs5_vFo.js";
import { t as Button } from "./button-BpE9Czok.js";
import { a as DashboardShell, r as SUPER_ADMIN_NAV } from "./navigation-BC2JVMIz.js";
import { a as CardTitle, i as CardHeader, n as CardContent, r as CardDescription, t as Card } from "./card-BM637P_-.js";
import { t as Badge } from "./badge-DHlcf1ty.js";
import { t as KpiCard } from "./kpi-card-CU_Ktzc8.js";
import { Navigate, useNavigate } from "@tanstack/react-router";
import { jsx, jsxs } from "react/jsx-runtime";
import { Activity, ArrowRight, Building2, CreditCard, Database, Server, ShieldCheck, Tag, Users } from "lucide-react";
import { CartesianGrid, Cell, Line, LineChart, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
//#region src/routes/_authenticated.super-admin.dashboard.tsx?tsr-split=component
var mrrGrowthData = [
	{
		name: "Jul",
		mrr: 4.2
	},
	{
		name: "Aug",
		mrr: 4.8
	},
	{
		name: "Sep",
		mrr: 5.5
	},
	{
		name: "Oct",
		mrr: 6.8
	},
	{
		name: "Nov",
		mrr: 7.9
	},
	{
		name: "Dec",
		mrr: 8.4
	}
];
var subscriptionDistribution = [
	{
		name: "Yearly",
		value: 45
	},
	{
		name: "Monthly",
		value: 75
	},
	{
		name: "Trial",
		value: 8
	}
];
var COLORS = [
	"#4F6EF7",
	"#10B981",
	"#F59E0B"
];
function SuperAdminDashboard() {
	const { user } = useAuth();
	const navigate = useNavigate();
	if (!user) return null;
	if (user.role !== "super_admin") return /* @__PURE__ */ jsx(Navigate, { to: "/unauthorized" });
	const totalOrgs = db.workspaces.length;
	const totalOwners = db.users.filter((u) => u.role === "owner").length;
	const totalUsers = db.users.length;
	return /* @__PURE__ */ jsx(DashboardShell, {
		title: "Super Admin Dashboard",
		subtitle: "Monitor organizations, subscriptions, platform growth and system operations.",
		navGroups: SUPER_ADMIN_NAV,
		children: /* @__PURE__ */ jsxs("div", {
			className: "space-y-6",
			children: [
				/* @__PURE__ */ jsxs("div", {
					className: "grid gap-4 sm:grid-cols-2 lg:grid-cols-5",
					children: [
						/* @__PURE__ */ jsx(KpiCard, {
							label: "Total Organizations",
							value: totalOrgs.toString(),
							delta: "+3 this week",
							icon: Building2,
							tone: "up"
						}),
						/* @__PURE__ */ jsx(KpiCard, {
							label: "Total PG Owners",
							value: totalOwners.toString(),
							delta: "+2 this week",
							icon: Users,
							tone: "up"
						}),
						/* @__PURE__ */ jsx(KpiCard, {
							label: "Platform Users",
							value: totalUsers.toString(),
							delta: "+45 this month",
							icon: Users,
							tone: "neutral"
						}),
						/* @__PURE__ */ jsx(KpiCard, {
							label: "Active Subscriptions",
							value: "120",
							delta: "94% retention",
							icon: Tag,
							tone: "up"
						}),
						/* @__PURE__ */ jsx(KpiCard, {
							label: "Platform MRR",
							value: "₹ 8.4L",
							delta: "+12.4% MoM",
							icon: CreditCard,
							tone: "up"
						})
					]
				}),
				/* @__PURE__ */ jsxs("div", {
					className: "grid gap-4 md:grid-cols-3",
					children: [/* @__PURE__ */ jsxs(Card, {
						className: "col-span-1 md:col-span-2",
						children: [/* @__PURE__ */ jsxs(CardHeader, { children: [/* @__PURE__ */ jsx(CardTitle, {
							className: "text-base font-semibold",
							children: "Platform MRR Growth (6 Months)"
						}), /* @__PURE__ */ jsx(CardDescription, { children: "Recurring subscription revenue in Lakhs (₹)" })] }), /* @__PURE__ */ jsx(CardContent, {
							className: "h-[280px]",
							children: /* @__PURE__ */ jsx(ResponsiveContainer, {
								width: "100%",
								height: "100%",
								children: /* @__PURE__ */ jsxs(LineChart, {
									data: mrrGrowthData,
									margin: {
										top: 10,
										right: 10,
										left: 0,
										bottom: 0
									},
									children: [
										/* @__PURE__ */ jsx(CartesianGrid, {
											strokeDasharray: "3 3",
											vertical: false,
											stroke: "rgba(148, 163, 184, 0.10)"
										}),
										/* @__PURE__ */ jsx(XAxis, {
											dataKey: "name",
											axisLine: false,
											tickLine: false,
											tick: {
												fill: "#64748B",
												fontSize: 12
											},
											dy: 10
										}),
										/* @__PURE__ */ jsx(YAxis, {
											axisLine: false,
											tickLine: false,
											tick: {
												fill: "#64748B",
												fontSize: 12
											},
											tickFormatter: (value) => `₹${value}L`,
											dx: -10
										}),
										/* @__PURE__ */ jsx(Tooltip, {
											cursor: {
												stroke: "rgba(255,255,255,0.1)",
												strokeWidth: 1,
												strokeDasharray: "3 3"
											},
											contentStyle: {
												backgroundColor: "#152238",
												borderColor: "#314462",
												color: "#F8FAFC",
												borderRadius: "8px"
											},
											itemStyle: { color: "#CBD5E1" }
										}),
										/* @__PURE__ */ jsx(Line, {
											type: "monotone",
											dataKey: "mrr",
											stroke: "#4F6EF7",
											strokeWidth: 3,
											dot: {
												fill: "#111C2E",
												r: 4,
												strokeWidth: 2
											},
											activeDot: { r: 6 }
										})
									]
								})
							})
						})]
					}), /* @__PURE__ */ jsxs(Card, {
						className: "col-span-1",
						children: [/* @__PURE__ */ jsxs(CardHeader, { children: [/* @__PURE__ */ jsx(CardTitle, {
							className: "text-base font-semibold",
							children: "Subscription Plans"
						}), /* @__PURE__ */ jsx(CardDescription, { children: "Current active distribution" })] }), /* @__PURE__ */ jsxs(CardContent, {
							className: "flex flex-col items-center justify-center h-[280px] relative",
							children: [/* @__PURE__ */ jsx(ResponsiveContainer, {
								width: "100%",
								height: "100%",
								children: /* @__PURE__ */ jsxs(PieChart, { children: [/* @__PURE__ */ jsx(Pie, {
									data: subscriptionDistribution,
									cx: "50%",
									cy: "50%",
									innerRadius: 50,
									outerRadius: 80,
									paddingAngle: 2,
									dataKey: "value",
									stroke: "none",
									children: subscriptionDistribution.map((entry, index) => /* @__PURE__ */ jsx(Cell, { fill: COLORS[index % COLORS.length] }, `cell-${index}`))
								}), /* @__PURE__ */ jsx(Tooltip, {
									contentStyle: {
										backgroundColor: "#152238",
										borderColor: "#314462",
										color: "#F8FAFC",
										borderRadius: "8px"
									},
									itemStyle: { color: "#CBD5E1" }
								})] })
							}), /* @__PURE__ */ jsxs("div", {
								className: "absolute inset-0 flex flex-col items-center justify-center pointer-events-none mt-4",
								children: [/* @__PURE__ */ jsx("span", {
									className: "text-3xl font-bold tracking-tight",
									children: "128"
								}), /* @__PURE__ */ jsx("span", {
									className: "text-xs text-muted-foreground",
									children: "Total"
								})]
							})]
						})]
					})]
				}),
				/* @__PURE__ */ jsxs("div", {
					className: "grid gap-4 md:grid-cols-3",
					children: [/* @__PURE__ */ jsxs(Card, {
						className: "md:col-span-2",
						children: [/* @__PURE__ */ jsxs(CardHeader, {
							className: "flex flex-row items-center justify-between pb-2",
							children: [/* @__PURE__ */ jsxs("div", {
								className: "space-y-1",
								children: [/* @__PURE__ */ jsx(CardTitle, {
									className: "text-base font-semibold",
									children: "Recent Organizations"
								}), /* @__PURE__ */ jsx(CardDescription, { children: "Latest PG workspaces joined platform" })]
							}), /* @__PURE__ */ jsxs(Button, {
								variant: "ghost",
								size: "sm",
								className: "h-8 text-xs",
								onClick: () => navigate({ to: "/super-admin/properties" }),
								children: ["View all ", /* @__PURE__ */ jsx(ArrowRight, { className: "ml-1 h-3 w-3" })]
							})]
						}), /* @__PURE__ */ jsx(CardContent, { children: /* @__PURE__ */ jsx("div", {
							className: "rounded-md border border-border/50",
							children: /* @__PURE__ */ jsx("div", {
								className: "w-full overflow-auto",
								children: /* @__PURE__ */ jsxs("table", {
									className: "w-full text-sm text-left",
									children: [/* @__PURE__ */ jsx("thead", {
										className: "bg-muted/50 text-muted-foreground",
										children: /* @__PURE__ */ jsxs("tr", { children: [
											/* @__PURE__ */ jsx("th", {
												className: "font-medium p-3",
												children: "Organization"
											}),
											/* @__PURE__ */ jsx("th", {
												className: "font-medium p-3",
												children: "Owner ID"
											}),
											/* @__PURE__ */ jsx("th", {
												className: "font-medium p-3",
												children: "Plan"
											}),
											/* @__PURE__ */ jsx("th", {
												className: "font-medium p-3",
												children: "Status"
											})
										] })
									}), /* @__PURE__ */ jsx("tbody", {
										className: "divide-y divide-border/50",
										children: db.workspaces.slice(0, 4).map((org) => /* @__PURE__ */ jsxs("tr", {
											className: "hover:bg-muted/30 transition-colors",
											children: [
												/* @__PURE__ */ jsx("td", {
													className: "p-3 font-medium",
													children: org.name
												}),
												/* @__PURE__ */ jsx("td", {
													className: "p-3 text-muted-foreground text-xs font-mono",
													children: org.ownerId
												}),
												/* @__PURE__ */ jsx("td", {
													className: "p-3",
													children: /* @__PURE__ */ jsx(Badge, {
														variant: "outline",
														children: org.planId === "yearly" ? "Yearly" : "Monthly"
													})
												}),
												/* @__PURE__ */ jsx("td", {
													className: "p-3",
													children: /* @__PURE__ */ jsx(Badge, {
														variant: "secondary",
														className: "bg-success text-success-foreground border-success hover:bg-success/80",
														children: "Active"
													})
												})
											]
										}, org.id))
									})]
								})
							})
						}) })]
					}), /* @__PURE__ */ jsxs("div", {
						className: "space-y-4",
						children: [/* @__PURE__ */ jsxs(Card, { children: [/* @__PURE__ */ jsx(CardHeader, {
							className: "pb-3",
							children: /* @__PURE__ */ jsx(CardTitle, {
								className: "text-base font-semibold",
								children: "System Health (Mock)"
							})
						}), /* @__PURE__ */ jsxs(CardContent, {
							className: "space-y-4",
							children: [
								/* @__PURE__ */ jsxs("div", {
									className: "flex items-center justify-between",
									children: [/* @__PURE__ */ jsxs("div", {
										className: "flex items-center gap-2",
										children: [/* @__PURE__ */ jsx(Server, { className: "h-4 w-4 text-muted-foreground" }), /* @__PURE__ */ jsx("span", {
											className: "text-sm font-medium",
											children: "API Gateway"
										})]
									}), /* @__PURE__ */ jsx(Badge, {
										variant: "outline",
										className: "text-emerald-600 bg-emerald-50",
										children: "Operational"
									})]
								}),
								/* @__PURE__ */ jsxs("div", {
									className: "flex items-center justify-between",
									children: [/* @__PURE__ */ jsxs("div", {
										className: "flex items-center gap-2",
										children: [/* @__PURE__ */ jsx(Database, { className: "h-4 w-4 text-muted-foreground" }), /* @__PURE__ */ jsx("span", {
											className: "text-sm font-medium",
											children: "Database (Mock)"
										})]
									}), /* @__PURE__ */ jsx(Badge, {
										variant: "outline",
										className: "text-emerald-600 bg-emerald-50",
										children: "Operational"
									})]
								}),
								/* @__PURE__ */ jsxs("div", {
									className: "flex items-center justify-between",
									children: [/* @__PURE__ */ jsxs("div", {
										className: "flex items-center gap-2",
										children: [/* @__PURE__ */ jsx(Activity, { className: "h-4 w-4 text-muted-foreground" }), /* @__PURE__ */ jsx("span", {
											className: "text-sm font-medium",
											children: "Background Jobs"
										})]
									}), /* @__PURE__ */ jsx(Badge, {
										variant: "outline",
										className: "text-emerald-600 bg-emerald-50",
										children: "Operational"
									})]
								})
							]
						})] }), /* @__PURE__ */ jsxs(Card, { children: [/* @__PURE__ */ jsx(CardHeader, {
							className: "pb-3",
							children: /* @__PURE__ */ jsx(CardTitle, {
								className: "text-base font-semibold",
								children: "Platform Activity"
							})
						}), /* @__PURE__ */ jsxs(CardContent, {
							className: "space-y-4",
							children: [
								/* @__PURE__ */ jsxs("div", {
									className: "flex items-start gap-3",
									children: [/* @__PURE__ */ jsx("div", {
										className: "mt-0.5 rounded-full bg-blue-100 p-1",
										children: /* @__PURE__ */ jsx(Building2, { className: "h-3 w-3 text-blue-600" })
									}), /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("p", {
										className: "text-sm font-medium",
										children: "New organization created"
									}), /* @__PURE__ */ jsx("p", {
										className: "text-xs text-muted-foreground",
										children: "Skyline Stays just registered."
									})] })]
								}),
								/* @__PURE__ */ jsxs("div", {
									className: "flex items-start gap-3",
									children: [/* @__PURE__ */ jsx("div", {
										className: "mt-0.5 rounded-full bg-emerald-100 p-1",
										children: /* @__PURE__ */ jsx(Tag, { className: "h-3 w-3 text-emerald-600" })
									}), /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("p", {
										className: "text-sm font-medium",
										children: "Subscription upgraded"
									}), /* @__PURE__ */ jsx("p", {
										className: "text-xs text-muted-foreground",
										children: "Lotus Ladies PG moved to Yearly."
									})] })]
								}),
								/* @__PURE__ */ jsxs("div", {
									className: "flex items-start gap-3",
									children: [/* @__PURE__ */ jsx("div", {
										className: "mt-0.5 rounded-full bg-rose-100 p-1",
										children: /* @__PURE__ */ jsx(ShieldCheck, { className: "h-3 w-3 text-rose-600" })
									}), /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("p", {
										className: "text-sm font-medium",
										children: "Account suspended"
									}), /* @__PURE__ */ jsx("p", {
										className: "text-xs text-muted-foreground",
										children: "Violation on u_owner_902."
									})] })]
								})
							]
						})] })]
					})]
				})
			]
		})
	});
}
//#endregion
export { SuperAdminDashboard as component };
