import { n as useAuth } from "./auth-provider-ucs5_vFo.js";
import { t as Button } from "./button-BpE9Czok.js";
import { a as DashboardShell, i as TENANT_NAV } from "./navigation-BC2JVMIz.js";
import { a as CardTitle, i as CardHeader, n as CardContent, t as Card } from "./card-BM637P_-.js";
import { t as Badge } from "./badge-DHlcf1ty.js";
import { a as SelectValue, i as SelectTrigger, n as SelectContent, r as SelectItem, t as Select } from "./select-DxHg2FK2.js";
import { a as TableHeader, i as TableHead, n as TableBody, o as TableRow, r as TableCell, t as Table } from "./table-CyFoctdv.js";
import { n as useLocalState, t as useLocalCollection } from "./local-store-DgaIVLg3.js";
import { a as shortId, n as downloadText, r as formatShortDate } from "./actions-BLzNNc_h.js";
import { t as Input } from "./input-NvmijQlt.js";
import { t as Label } from "./label-AutfcB-T.js";
import { a as DialogHeader, i as DialogFooter, n as DialogContent, o as DialogTitle, t as Dialog } from "./dialog-YNSXVwJV.js";
import { useState } from "react";
import { Navigate } from "@tanstack/react-router";
import { jsx, jsxs } from "react/jsx-runtime";
import { toast } from "sonner";
import { CheckCircle2, Clock, CreditCard, Download } from "lucide-react";
//#region src/routes/_authenticated.tenant.payments.tsx?tsr-split=component
var SEED = [
	{
		id: "RCP-2611",
		month: "November 2026",
		amount: "₹ 11,500",
		date: "05 Nov 2026",
		method: "UPI · HDFC",
		status: "paid"
	},
	{
		id: "RCP-2610",
		month: "October 2026",
		amount: "₹ 11,500",
		date: "04 Oct 2026",
		method: "UPI · HDFC",
		status: "paid"
	},
	{
		id: "RCP-2609",
		month: "September 2026",
		amount: "₹ 11,500",
		date: "06 Sep 2026",
		method: "Card · Visa 4021",
		status: "paid"
	},
	{
		id: "RCP-2608",
		month: "August 2026",
		amount: "₹ 11,500",
		date: "05 Aug 2026",
		method: "UPI · HDFC",
		status: "paid"
	},
	{
		id: "RCP-2607",
		month: "July 2026",
		amount: "₹ 11,500",
		date: "07 Jul 2026",
		method: "Cash",
		status: "paid"
	}
];
function PaymentsPage() {
	const { user } = useAuth();
	const { items, add } = useLocalCollection("hostly.tenant.receipts", SEED);
	const [autopay, setAutopay] = useLocalState("hostly.tenant.autopay", false);
	const [payOpen, setPayOpen] = useState(false);
	const [nextDue, setNextDue] = useLocalState("hostly.tenant.nextDue", {
		amount: 11500,
		dueOn: "5 December 2026",
		paid: false
	});
	const [method, setMethod] = useState("upi");
	const [processing, setProcessing] = useState(false);
	if (!user) return null;
	if (user.role !== "tenant") return /* @__PURE__ */ jsx(Navigate, { to: "/unauthorized" });
	function receiptText(r) {
		return `HOSTLY · RENT RECEIPT
-------------------------
Receipt ID : ${r.id}
Tenant     : ${user.fullName}
For        : ${r.month}
Amount     : ${r.amount}
Paid on    : ${r.date}
Method     : ${r.method}
Status     : PAID

Thank you for staying with Greenhaven Residency.`;
	}
	function download(r) {
		downloadText(`${r.id}.txt`, receiptText(r));
		toast.success(`Receipt ${r.id} downloaded`);
	}
	function pay() {
		setProcessing(true);
		setTimeout(() => {
			const r = {
				id: shortId("RCP"),
				month: nextDue.dueOn.split(" ").slice(1).join(" "),
				amount: `₹ ${nextDue.amount.toLocaleString("en-IN")}`,
				date: formatShortDate(),
				method: method === "upi" ? "UPI · HDFC" : method === "card" ? "Card · Visa 4021" : "Bank",
				status: "paid"
			};
			add(r);
			setNextDue({
				...nextDue,
				paid: true
			});
			setProcessing(false);
			setPayOpen(false);
			toast.success(`Paid ${r.amount} — receipt saved`);
		}, 900);
	}
	return /* @__PURE__ */ jsxs(DashboardShell, {
		title: "Rent & receipts",
		subtitle: "Manage payments and download receipts",
		navGroups: TENANT_NAV,
		children: [
			/* @__PURE__ */ jsxs("div", {
				className: "grid gap-4 lg:grid-cols-3",
				children: [/* @__PURE__ */ jsx(Card, {
					className: "lg:col-span-2 border-border/70 bg-gradient-to-br from-primary/5 to-transparent",
					children: /* @__PURE__ */ jsxs(CardContent, {
						className: "flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between",
						children: [/* @__PURE__ */ jsxs("div", { children: [
							/* @__PURE__ */ jsx("p", {
								className: "text-xs font-medium uppercase tracking-wider text-muted-foreground",
								children: nextDue.paid ? "Rent paid" : "Next payment due"
							}),
							/* @__PURE__ */ jsxs("p", {
								className: "mt-1 text-3xl font-semibold tracking-tight",
								children: ["₹ ", nextDue.amount.toLocaleString("en-IN")]
							}),
							/* @__PURE__ */ jsxs("p", {
								className: "mt-1 flex items-center gap-1.5 text-sm text-muted-foreground",
								children: [
									/* @__PURE__ */ jsx(Clock, { className: "h-3.5 w-3.5" }),
									" ",
									nextDue.paid ? "Next cycle starts 1 Jan 2027" : `Due on ${nextDue.dueOn}`
								]
							})
						] }), /* @__PURE__ */ jsxs("div", {
							className: "flex flex-col gap-2 sm:flex-row",
							children: [/* @__PURE__ */ jsxs(Button, {
								disabled: nextDue.paid,
								onClick: () => setPayOpen(true),
								children: [
									/* @__PURE__ */ jsx(CreditCard, { className: "mr-1 h-4 w-4" }),
									" ",
									nextDue.paid ? "Paid" : "Pay now"
								]
							}), /* @__PURE__ */ jsx(Button, {
								variant: "outline",
								onClick: () => {
									setAutopay(!autopay);
									toast.success(autopay ? "Auto-pay disabled" : "Auto-pay enabled");
								},
								children: autopay ? "Disable auto-pay" : "Set up auto-pay"
							})]
						})]
					})
				}), /* @__PURE__ */ jsx(Card, {
					className: "border-border/70",
					children: /* @__PURE__ */ jsxs(CardContent, {
						className: "space-y-2 p-6",
						children: [
							/* @__PURE__ */ jsx("p", {
								className: "text-xs font-medium uppercase tracking-wider text-muted-foreground",
								children: "Deposit"
							}),
							/* @__PURE__ */ jsx("p", {
								className: "text-2xl font-semibold",
								children: "₹ 23,000"
							}),
							/* @__PURE__ */ jsx("p", {
								className: "text-xs text-muted-foreground",
								children: "Refundable on move-out. Held since May 2025."
							})
						]
					})
				})]
			}),
			/* @__PURE__ */ jsxs(Card, {
				className: "mt-6 border-border/70",
				children: [/* @__PURE__ */ jsx(CardHeader, { children: /* @__PURE__ */ jsx(CardTitle, {
					className: "text-base",
					children: "Payment history"
				}) }), /* @__PURE__ */ jsx(CardContent, {
					className: "p-0",
					children: /* @__PURE__ */ jsxs(Table, { children: [/* @__PURE__ */ jsx(TableHeader, { children: /* @__PURE__ */ jsxs(TableRow, { children: [
						/* @__PURE__ */ jsx(TableHead, { children: "Receipt" }),
						/* @__PURE__ */ jsx(TableHead, { children: "Month" }),
						/* @__PURE__ */ jsx(TableHead, { children: "Paid on" }),
						/* @__PURE__ */ jsx(TableHead, { children: "Method" }),
						/* @__PURE__ */ jsx(TableHead, { children: "Amount" }),
						/* @__PURE__ */ jsx(TableHead, { children: "Status" }),
						/* @__PURE__ */ jsx(TableHead, {
							className: "text-right",
							children: "Receipt"
						})
					] }) }), /* @__PURE__ */ jsx(TableBody, { children: items.map((r) => /* @__PURE__ */ jsxs(TableRow, { children: [
						/* @__PURE__ */ jsx(TableCell, {
							className: "font-mono text-xs",
							children: r.id
						}),
						/* @__PURE__ */ jsx(TableCell, {
							className: "font-medium",
							children: r.month
						}),
						/* @__PURE__ */ jsx(TableCell, {
							className: "text-muted-foreground",
							children: r.date
						}),
						/* @__PURE__ */ jsx(TableCell, {
							className: "text-muted-foreground",
							children: r.method
						}),
						/* @__PURE__ */ jsx(TableCell, {
							className: "font-semibold",
							children: r.amount
						}),
						/* @__PURE__ */ jsx(TableCell, { children: /* @__PURE__ */ jsxs(Badge, {
							variant: "secondary",
							className: "bg-success/10 text-success",
							children: [/* @__PURE__ */ jsx(CheckCircle2, { className: "mr-1 h-3 w-3" }), " Paid"]
						}) }),
						/* @__PURE__ */ jsx(TableCell, {
							className: "text-right",
							children: /* @__PURE__ */ jsx(Button, {
								variant: "ghost",
								size: "sm",
								onClick: () => download(r),
								children: /* @__PURE__ */ jsx(Download, { className: "h-3.5 w-3.5" })
							})
						})
					] }, r.id)) })] })
				})]
			}),
			/* @__PURE__ */ jsx(Dialog, {
				open: payOpen,
				onOpenChange: setPayOpen,
				children: /* @__PURE__ */ jsxs(DialogContent, { children: [
					/* @__PURE__ */ jsx(DialogHeader, { children: /* @__PURE__ */ jsxs(DialogTitle, { children: ["Pay rent — ₹ ", nextDue.amount.toLocaleString("en-IN")] }) }),
					/* @__PURE__ */ jsxs("div", {
						className: "grid gap-3",
						children: [
							/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx(Label, { children: "Payment method" }), /* @__PURE__ */ jsxs(Select, {
								value: method,
								onValueChange: setMethod,
								children: [/* @__PURE__ */ jsx(SelectTrigger, {
									className: "mt-1.5",
									children: /* @__PURE__ */ jsx(SelectValue, {})
								}), /* @__PURE__ */ jsxs(SelectContent, { children: [
									/* @__PURE__ */ jsx(SelectItem, {
										value: "upi",
										children: "UPI · HDFC"
									}),
									/* @__PURE__ */ jsx(SelectItem, {
										value: "card",
										children: "Card · Visa 4021"
									}),
									/* @__PURE__ */ jsx(SelectItem, {
										value: "bank",
										children: "Net banking"
									})
								] })]
							})] }),
							method === "upi" && /* @__PURE__ */ jsx(Input, {
								placeholder: "you@upi",
								defaultValue: "arjun@hdfc"
							}),
							method === "card" && /* @__PURE__ */ jsx(Input, {
								placeholder: "•••• •••• •••• 4021",
								defaultValue: "4021 •••• •••• 4021"
							})
						]
					}),
					/* @__PURE__ */ jsxs(DialogFooter, { children: [/* @__PURE__ */ jsx(Button, {
						variant: "outline",
						onClick: () => setPayOpen(false),
						disabled: processing,
						children: "Cancel"
					}), /* @__PURE__ */ jsx(Button, {
						onClick: pay,
						disabled: processing,
						children: processing ? "Processing…" : "Confirm payment"
					})] })
				] })
			})
		]
	});
}
//#endregion
export { PaymentsPage as component };
