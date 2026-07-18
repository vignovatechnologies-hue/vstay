import { n as useAuth } from "./auth-provider-ucs5_vFo.js";
import { n as useWorkspace } from "./workspace-provider-Cxe5ySHG.js";
import { t as Button } from "./button-BpE9Czok.js";
import { a as DashboardShell, t as OWNER_NAV } from "./navigation-BC2JVMIz.js";
import { a as CardTitle, i as CardHeader, n as CardContent, r as CardDescription, t as Card } from "./card-BM637P_-.js";
import { t as Badge } from "./badge-DHlcf1ty.js";
import { t as KpiCard } from "./kpi-card-CU_Ktzc8.js";
import { Navigate, useNavigate } from "@tanstack/react-router";
import { jsx, jsxs } from "react/jsx-runtime";
import { AlertCircle, ArrowRight, BedDouble, Building2, CreditCard, Megaphone, PlusCircle, Sparkles, TrendingUp, UserPlus, Users, Wrench } from "lucide-react";
import { Bar, BarChart, CartesianGrid, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
//#region src/routes/_authenticated.owner.dashboard.tsx?tsr-split=component
var revenueData = [
	{
		name: "Jul",
		revenue: 32e4
	},
	{
		name: "Aug",
		revenue: 35e4
	},
	{
		name: "Sep",
		revenue: 345e3
	},
	{
		name: "Oct",
		revenue: 41e4
	},
	{
		name: "Nov",
		revenue: 462e3
	},
	{
		name: "Dec",
		revenue: 485e3
	}
];
var COLORS = ["#4F6EF7", "#314462"];
function OwnerDashboard() {
	const { user } = useAuth();
	const { activeWorkspace, workspaces } = useWorkspace();
	const navigate = useNavigate();
	if (!user) return null;
	if (user.role !== "owner") return /* @__PURE__ */ jsx(Navigate, { to: "/unauthorized" });
	if (user.workspaceIds.length > 1 && !activeWorkspace) return /* @__PURE__ */ jsx(Navigate, { to: "/workspace-select" });
	const w = activeWorkspace ?? workspaces[0] ?? null;
	const occupancyRate = w ? Math.round(w.occupiedBeds / w.totalBeds * 100) : 0;
	const occupancyData = w ? [{
		name: "Occupied",
		value: w.occupiedBeds
	}, {
		name: "Vacant",
		value: w.totalBeds - w.occupiedBeds
	}] : [];
	return /* @__PURE__ */ jsx(DashboardShell, {
		title: "Owner Dashboard",
		subtitle: "Manage your properties, occupancy, tenants, payments and daily operations.",
		navGroups: OWNER_NAV,
		showWorkspaceSwitcher: true,
		children: !w ? /* @__PURE__ */ jsx(Card, {
			className: "border-dashed",
			children: /* @__PURE__ */ jsxs(CardContent, {
				className: "flex flex-col items-center gap-3 p-12 text-center",
				children: [
					/* @__PURE__ */ jsx(Building2, { className: "h-10 w-10 text-muted-foreground" }),
					/* @__PURE__ */ jsx("h2", {
						className: "text-base font-semibold",
						children: "No property selected"
					}),
					/* @__PURE__ */ jsx("p", {
						className: "max-w-sm text-sm text-muted-foreground",
						children: "Pick a workspace from the top bar to see its dashboard."
					})
				]
			})
		}) : /* @__PURE__ */ jsxs("div", {
			className: "space-y-6",
			children: [
				/* @__PURE__ */ jsxs("div", {
					className: "grid gap-4 sm:grid-cols-2 lg:grid-cols-4",
					children: [
						/* @__PURE__ */ jsx(KpiCard, {
							label: "Active Tenants",
							value: w.occupiedBeds.toString(),
							delta: "+4 this month",
							icon: Users,
							tone: "up"
						}),
						/* @__PURE__ */ jsx(KpiCard, {
							label: "Available Beds",
							value: (w.totalBeds - w.occupiedBeds).toString(),
							delta: `${occupancyRate}% occupancy`,
							icon: BedDouble,
							tone: "neutral"
						}),
						/* @__PURE__ */ jsx(KpiCard, {
							label: "Pending Payments",
							value: "₹ 45K",
							delta: "3 tenants overdue",
							icon: CreditCard,
							tone: "down"
						}),
						/* @__PURE__ */ jsx(KpiCard, {
							label: "Today's Visitors",
							value: "12",
							delta: "4 check-ins scheduled",
							icon: UserPlus,
							tone: "neutral"
						})
					]
				}),
				/* @__PURE__ */ jsxs("div", {
					className: "grid gap-4 md:grid-cols-3",
					children: [/* @__PURE__ */ jsxs(Card, {
						className: "col-span-1 md:col-span-2",
						children: [/* @__PURE__ */ jsxs(CardHeader, { children: [/* @__PURE__ */ jsx(CardTitle, {
							className: "text-base font-semibold",
							children: "Rent Collection (6 Months)"
						}), /* @__PURE__ */ jsx(CardDescription, { children: "Monthly operational revenue across your PG." })] }), /* @__PURE__ */ jsx(CardContent, {
							className: "h-[280px]",
							children: /* @__PURE__ */ jsx(ResponsiveContainer, {
								width: "100%",
								height: "100%",
								children: /* @__PURE__ */ jsxs(BarChart, {
									data: revenueData,
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
											tickFormatter: (value) => `₹${value / 1e3}k`,
											dx: -10
										}),
										/* @__PURE__ */ jsx(Tooltip, {
											cursor: { fill: "rgba(255,255,255,0.05)" },
											contentStyle: {
												backgroundColor: "#152238",
												borderColor: "#314462",
												color: "#F8FAFC",
												borderRadius: "8px"
											},
											itemStyle: { color: "#CBD5E1" }
										}),
										/* @__PURE__ */ jsx(Bar, {
											dataKey: "revenue",
											fill: "#4F6EF7",
											radius: [
												4,
												4,
												0,
												0
											],
											maxBarSize: 48
										})
									]
								})
							})
						})]
					}), /* @__PURE__ */ jsxs(Card, {
						className: "col-span-1",
						children: [/* @__PURE__ */ jsxs(CardHeader, { children: [/* @__PURE__ */ jsx(CardTitle, {
							className: "text-base font-semibold",
							children: "Occupancy Overview"
						}), /* @__PURE__ */ jsxs(CardDescription, { children: [w.name, " Capacity"] })] }), /* @__PURE__ */ jsxs(CardContent, {
							className: "flex flex-col items-center justify-center h-[280px] relative",
							children: [/* @__PURE__ */ jsx(ResponsiveContainer, {
								width: "100%",
								height: "100%",
								children: /* @__PURE__ */ jsxs(PieChart, { children: [/* @__PURE__ */ jsx(Pie, {
									data: occupancyData,
									cx: "50%",
									cy: "50%",
									innerRadius: 60,
									outerRadius: 80,
									paddingAngle: 2,
									dataKey: "value",
									stroke: "none",
									children: occupancyData.map((entry, index) => /* @__PURE__ */ jsx(Cell, { fill: COLORS[index % COLORS.length] }, `cell-${index}`))
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
								children: [/* @__PURE__ */ jsxs("span", {
									className: "text-3xl font-bold tracking-tight",
									children: [occupancyRate, "%"]
								}), /* @__PURE__ */ jsx("span", {
									className: "text-xs text-muted-foreground",
									children: "Occupied"
								})]
							})]
						})]
					})]
				}),
				/* @__PURE__ */ jsxs("div", {
					className: "grid gap-4 md:grid-cols-2 lg:grid-cols-3",
					children: [/* @__PURE__ */ jsxs(Card, {
						className: "bg-primary/5 border-primary/20 lg:col-span-2",
						children: [/* @__PURE__ */ jsx(CardHeader, {
							className: "pb-3",
							children: /* @__PURE__ */ jsxs(CardTitle, {
								className: "text-base font-semibold flex items-center gap-2",
								children: [/* @__PURE__ */ jsx(Sparkles, { className: "h-4 w-4 text-primary" }), "Hostly AI Insights (Demo)"]
							})
						}), /* @__PURE__ */ jsxs(CardContent, {
							className: "space-y-4",
							children: [/* @__PURE__ */ jsxs("div", {
								className: "flex gap-3 items-start",
								children: [/* @__PURE__ */ jsx("div", {
									className: "mt-0.5 rounded-full bg-primary/10 p-1",
									children: /* @__PURE__ */ jsx(TrendingUp, { className: "h-3 w-3 text-primary" })
								}), /* @__PURE__ */ jsxs("p", {
									className: "text-sm text-foreground/90 leading-relaxed",
									children: [
										/* @__PURE__ */ jsx("strong", { children: "Revenue Opportunity:" }),
										" You have ",
										w.totalBeds - w.occupiedBeds,
										" vacant beds. Running a short-term promotional offer could increase your monthly revenue by approximately ₹1.2L."
									]
								})]
							}), /* @__PURE__ */ jsxs("div", {
								className: "flex gap-3 items-start",
								children: [/* @__PURE__ */ jsx("div", {
									className: "mt-0.5 rounded-full bg-amber-500/10 p-1",
									children: /* @__PURE__ */ jsx(AlertCircle, { className: "h-3 w-3 text-amber-600" })
								}), /* @__PURE__ */ jsxs("p", {
									className: "text-sm text-foreground/90 leading-relaxed",
									children: [/* @__PURE__ */ jsx("strong", { children: "Payment Alert:" }), " Room 204 (Arjun Kapoor) is 5 days overdue on rent. Consider sending an automated WhatsApp reminder."]
								})]
							})]
						})]
					}), /* @__PURE__ */ jsxs(Card, { children: [/* @__PURE__ */ jsx(CardHeader, {
						className: "pb-3",
						children: /* @__PURE__ */ jsx(CardTitle, {
							className: "text-base font-semibold",
							children: "Quick Actions"
						})
					}), /* @__PURE__ */ jsxs(CardContent, {
						className: "flex flex-col gap-2",
						children: [
							/* @__PURE__ */ jsxs(Button, {
								variant: "outline",
								className: "justify-start h-9",
								onClick: () => navigate({ to: "/owner/tenants" }),
								children: [/* @__PURE__ */ jsx(UserPlus, { className: "mr-2 h-4 w-4" }), " Add Tenant"]
							}),
							/* @__PURE__ */ jsxs(Button, {
								variant: "outline",
								className: "justify-start h-9",
								onClick: () => navigate({ to: "/owner/payments" }),
								children: [/* @__PURE__ */ jsx(CreditCard, { className: "mr-2 h-4 w-4" }), " Record Payment"]
							}),
							/* @__PURE__ */ jsxs(Button, {
								variant: "outline",
								className: "justify-start h-9",
								onClick: () => navigate({ to: "/owner/complaints" }),
								children: [/* @__PURE__ */ jsx(Megaphone, { className: "mr-2 h-4 w-4" }), " Create Notice"]
							}),
							/* @__PURE__ */ jsxs(Button, {
								variant: "outline",
								className: "justify-start h-9",
								onClick: () => navigate({ to: "/owner/rooms" }),
								children: [/* @__PURE__ */ jsx(PlusCircle, { className: "mr-2 h-4 w-4" }), " Add Room"]
							})
						]
					})] })]
				}),
				/* @__PURE__ */ jsxs("div", {
					className: "grid gap-4 md:grid-cols-2",
					children: [/* @__PURE__ */ jsxs(Card, { children: [/* @__PURE__ */ jsxs(CardHeader, {
						className: "flex flex-row items-center justify-between pb-2",
						children: [/* @__PURE__ */ jsxs("div", {
							className: "space-y-1",
							children: [/* @__PURE__ */ jsx(CardTitle, {
								className: "text-base font-semibold",
								children: "Recent Complaints"
							}), /* @__PURE__ */ jsx(CardDescription, { children: "Tenant issues requiring attention" })]
						}), /* @__PURE__ */ jsxs(Button, {
							variant: "ghost",
							size: "sm",
							className: "h-8 text-xs",
							onClick: () => navigate({ to: "/owner/complaints" }),
							children: ["View all ", /* @__PURE__ */ jsx(ArrowRight, { className: "ml-1 h-3 w-3" })]
						})]
					}), /* @__PURE__ */ jsx(CardContent, { children: /* @__PURE__ */ jsx("div", {
						className: "space-y-4",
						children: [
							{
								id: "C-1029",
								room: "201",
								issue: "AC not cooling",
								status: "Open",
								priority: "High"
							},
							{
								id: "C-1028",
								room: "105",
								issue: "WiFi dropping",
								status: "In Progress",
								priority: "Medium"
							},
							{
								id: "C-1027",
								room: "304",
								issue: "Leaking tap",
								status: "Open",
								priority: "Low"
							}
						].map((complaint) => /* @__PURE__ */ jsxs("div", {
							className: "flex items-center justify-between border-b border-border/50 pb-3 last:border-0 last:pb-0",
							children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("p", {
								className: "text-sm font-medium",
								children: complaint.issue
							}), /* @__PURE__ */ jsxs("p", {
								className: "text-xs text-muted-foreground",
								children: [
									"Room ",
									complaint.room,
									" • ",
									complaint.id
								]
							})] }), /* @__PURE__ */ jsx(Badge, {
								variant: complaint.status === "Open" ? "destructive" : "secondary",
								children: complaint.status
							})]
						}, complaint.id))
					}) })] }), /* @__PURE__ */ jsxs(Card, { children: [/* @__PURE__ */ jsxs(CardHeader, {
						className: "flex flex-row items-center justify-between pb-2",
						children: [/* @__PURE__ */ jsxs("div", {
							className: "space-y-1",
							children: [/* @__PURE__ */ jsx(CardTitle, {
								className: "text-base font-semibold",
								children: "Maintenance Tasks"
							}), /* @__PURE__ */ jsx(CardDescription, { children: "Assigned staff operations" })]
						}), /* @__PURE__ */ jsxs(Button, {
							variant: "ghost",
							size: "sm",
							className: "h-8 text-xs",
							onClick: () => navigate({ to: "/owner/staff" }),
							children: ["View all ", /* @__PURE__ */ jsx(ArrowRight, { className: "ml-1 h-3 w-3" })]
						})]
					}), /* @__PURE__ */ jsx(CardContent, { children: /* @__PURE__ */ jsx("div", {
						className: "space-y-4",
						children: [
							{
								id: "M-402",
								task: "Deep Clean Room 102",
								assignee: "Ramesh (Housekeeping)",
								status: "Pending"
							},
							{
								id: "M-401",
								task: "Fix AC in 201",
								assignee: "Suresh (Maintenance)",
								status: "In Progress"
							},
							{
								id: "M-400",
								task: "Monthly Pest Control",
								assignee: "External Vendor",
								status: "Scheduled"
							}
						].map((task) => /* @__PURE__ */ jsxs("div", {
							className: "flex items-center justify-between border-b border-border/50 pb-3 last:border-0 last:pb-0",
							children: [/* @__PURE__ */ jsxs("div", {
								className: "flex items-start gap-3",
								children: [/* @__PURE__ */ jsx("div", {
									className: "mt-0.5 rounded bg-muted p-1.5",
									children: /* @__PURE__ */ jsx(Wrench, { className: "h-4 w-4 text-muted-foreground" })
								}), /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("p", {
									className: "text-sm font-medium",
									children: task.task
								}), /* @__PURE__ */ jsx("p", {
									className: "text-xs text-muted-foreground",
									children: task.assignee
								})] })]
							}), /* @__PURE__ */ jsx(Badge, {
								variant: "outline",
								children: task.status
							})]
						}, task.id))
					}) })] })]
				})
			]
		})
	});
}
//#endregion
export { OwnerDashboard as component };
