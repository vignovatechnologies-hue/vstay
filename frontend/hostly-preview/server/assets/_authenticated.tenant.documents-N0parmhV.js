import { n as useAuth } from "./auth-provider-ucs5_vFo.js";
import { n as cn, t as Button } from "./button-BpE9Czok.js";
import { a as DashboardShell, i as TENANT_NAV } from "./navigation-BC2JVMIz.js";
import { n as CardContent, t as Card } from "./card-BM637P_-.js";
import { t as Badge } from "./badge-DHlcf1ty.js";
import { t as useLocalCollection } from "./local-store-DgaIVLg3.js";
import { a as shortId, i as pickFile, n as downloadText } from "./actions-BLzNNc_h.js";
import { Navigate } from "@tanstack/react-router";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import { toast } from "sonner";
import { AlertCircle, CheckCircle2, Download, FileText, Trash2, Upload } from "lucide-react";
//#region src/routes/_authenticated.tenant.documents.tsx?tsr-split=component
var SEED = [
	{
		id: "d1",
		name: "Rental Agreement.pdf",
		type: "Agreement",
		size: "412 KB",
		uploaded: "May 09, 2025",
		status: "verified"
	},
	{
		id: "d2",
		name: "Aadhaar Card.pdf",
		type: "ID Proof",
		size: "220 KB",
		uploaded: "May 09, 2025",
		status: "verified"
	},
	{
		id: "d3",
		name: "Employment Letter.pdf",
		type: "Address Proof",
		size: "180 KB",
		uploaded: "May 10, 2025",
		status: "verified"
	},
	{
		id: "d4",
		name: "Police Verification",
		type: "Verification",
		status: "missing"
	}
];
var STATUS = {
	verified: {
		label: "Verified",
		className: "bg-success/10 text-success",
		Icon: CheckCircle2
	},
	pending: {
		label: "Pending review",
		className: "bg-warning/10 text-warning",
		Icon: AlertCircle
	},
	missing: {
		label: "Not uploaded",
		className: "bg-muted text-muted-foreground",
		Icon: AlertCircle
	}
};
function DocumentsPage() {
	const { user } = useAuth();
	const { items, add, update, remove } = useLocalCollection("hostly.tenant.docs", SEED);
	if (!user) return null;
	if (user.role !== "tenant") return /* @__PURE__ */ jsx(Navigate, { to: "/unauthorized" });
	async function upload(existing) {
		const file = await pickFile("application/pdf,image/*");
		if (!file) return;
		const size = `${Math.max(1, Math.round(file.size / 1024))} KB`;
		const uploaded = (/* @__PURE__ */ new Date()).toLocaleDateString("en-IN", {
			month: "short",
			day: "2-digit",
			year: "numeric"
		});
		if (existing) {
			update(existing.id, {
				name: file.name,
				size,
				uploaded,
				status: "pending"
			});
			toast.success(`${file.name} uploaded — pending review`);
		} else {
			add({
				id: shortId("d"),
				name: file.name,
				type: "Other",
				size,
				uploaded,
				status: "pending"
			});
			toast.success(`${file.name} uploaded`);
		}
	}
	function download(d) {
		downloadText(`${d.name}.txt`, `Document: ${d.name}\nType: ${d.type}\nUploaded: ${d.uploaded ?? "—"}\nStatus: ${d.status}`);
		toast.success(`${d.name} downloaded`);
	}
	return /* @__PURE__ */ jsxs(DashboardShell, {
		title: "Documents",
		subtitle: "Your KYC, agreements and verifications",
		navGroups: TENANT_NAV,
		children: [/* @__PURE__ */ jsxs("div", {
			className: "mb-4 flex items-center justify-between",
			children: [/* @__PURE__ */ jsxs("p", {
				className: "text-sm text-muted-foreground",
				children: [
					items.filter((d) => d.status === "verified").length,
					" of ",
					items.length,
					" verified"
				]
			}), /* @__PURE__ */ jsxs(Button, {
				size: "sm",
				onClick: () => upload(),
				children: [/* @__PURE__ */ jsx(Upload, { className: "mr-1 h-4 w-4" }), " Upload document"]
			})]
		}), /* @__PURE__ */ jsx("div", {
			className: "grid gap-3 md:grid-cols-2",
			children: items.map((d) => {
				const s = STATUS[d.status];
				const Icon = s.Icon;
				return /* @__PURE__ */ jsx(Card, {
					className: "border-border/70",
					children: /* @__PURE__ */ jsxs(CardContent, {
						className: "flex items-start gap-3 p-4",
						children: [/* @__PURE__ */ jsx("span", {
							className: "grid h-10 w-10 place-items-center rounded-md bg-primary/10 text-primary",
							children: /* @__PURE__ */ jsx(FileText, { className: "h-5 w-5" })
						}), /* @__PURE__ */ jsxs("div", {
							className: "min-w-0 flex-1",
							children: [/* @__PURE__ */ jsxs("div", {
								className: "flex items-start justify-between gap-2",
								children: [/* @__PURE__ */ jsxs("div", {
									className: "min-w-0",
									children: [/* @__PURE__ */ jsx("p", {
										className: "truncate text-sm font-semibold",
										children: d.name
									}), /* @__PURE__ */ jsxs("p", {
										className: "text-xs text-muted-foreground",
										children: [
											d.type,
											d.uploaded ? ` · Uploaded ${d.uploaded}` : "",
											d.size ? ` · ${d.size}` : ""
										]
									})]
								}), /* @__PURE__ */ jsxs(Badge, {
									variant: "secondary",
									className: cn("shrink-0", s.className),
									children: [
										/* @__PURE__ */ jsx(Icon, { className: "mr-1 h-3 w-3" }),
										" ",
										s.label
									]
								})]
							}), /* @__PURE__ */ jsx("div", {
								className: "mt-3 flex gap-2",
								children: d.status === "missing" ? /* @__PURE__ */ jsxs(Button, {
									size: "sm",
									variant: "outline",
									onClick: () => upload(d),
									children: [/* @__PURE__ */ jsx(Upload, { className: "mr-1 h-3.5 w-3.5" }), " Upload"]
								}) : /* @__PURE__ */ jsxs(Fragment, { children: [
									/* @__PURE__ */ jsxs(Button, {
										size: "sm",
										variant: "outline",
										onClick: () => download(d),
										children: [/* @__PURE__ */ jsx(Download, { className: "mr-1 h-3.5 w-3.5" }), " Download"]
									}),
									/* @__PURE__ */ jsx(Button, {
										size: "sm",
										variant: "ghost",
										onClick: () => upload(d),
										children: "Replace"
									}),
									/* @__PURE__ */ jsx(Button, {
										size: "sm",
										variant: "ghost",
										onClick: () => {
											remove(d.id);
											toast.success(`${d.name} removed`);
										},
										children: /* @__PURE__ */ jsx(Trash2, { className: "h-3.5 w-3.5 text-destructive" })
									})
								] })
							})]
						})]
					})
				}, d.id);
			})
		})]
	});
}
//#endregion
export { DocumentsPage as component };
