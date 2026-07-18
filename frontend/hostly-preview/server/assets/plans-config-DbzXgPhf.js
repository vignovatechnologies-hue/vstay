import { n as useLocalState } from "./local-store-DgaIVLg3.js";
//#region src/lib/plans-config.ts
var KEY = "hostly.plans.config";
var DEFAULT_PLANS = { plans: [{
	id: "monthly",
	name: "Monthly",
	price: 999,
	currency: "₹",
	period: "/month",
	tagline: "Flexible month-to-month billing",
	features: [
		"Up to 60 beds",
		"Unlimited staff accounts",
		"Rent, complaints & laundry modules",
		"Email support"
	]
}, {
	id: "yearly",
	name: "Yearly",
	price: 9999,
	currency: "₹",
	period: "/year",
	tagline: "Save 2 months with annual billing",
	features: [
		"Everything in Monthly",
		"Priority support",
		"Advanced reports & exports",
		"Free onboarding session"
	],
	highlighted: true
}] };
function usePlansConfig() {
	return useLocalState(KEY, DEFAULT_PLANS);
}
//#endregion
export { usePlansConfig as n, DEFAULT_PLANS as t };
