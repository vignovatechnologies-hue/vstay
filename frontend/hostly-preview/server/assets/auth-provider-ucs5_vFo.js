import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { jsx } from "react/jsx-runtime";
//#region src/mock/seed/users.ts
var SEED_USERS = [
	{
		id: "u_super_1",
		email: "super@hostly.app",
		fullName: "Aanya Mehta",
		role: "super_admin",
		workspaceIds: [],
		createdAt: "2024-01-04T10:00:00Z"
	},
	{
		id: "u_owner_multi",
		email: "owner@hostly.app",
		fullName: "Rohan Verma",
		phone: "+91 98200 12345",
		role: "owner",
		workspaceIds: [
			"pg_greenhaven",
			"pg_skyline",
			"pg_meridian"
		],
		createdAt: "2024-02-12T08:00:00Z"
	},
	{
		id: "u_owner_single",
		email: "single@hostly.app",
		fullName: "Kavya Iyer",
		phone: "+91 98765 22110",
		role: "owner",
		workspaceIds: ["pg_lotus"],
		createdAt: "2024-03-22T08:00:00Z"
	},
	{
		id: "u_manager_1",
		email: "manager@hostly.app",
		fullName: "Devang Shah",
		role: "manager",
		workspaceIds: ["pg_greenhaven"],
		createdAt: "2024-04-01T08:00:00Z"
	},
	{
		id: "u_reception_1",
		email: "reception@hostly.app",
		fullName: "Pooja Nair",
		role: "reception",
		workspaceIds: ["pg_greenhaven"],
		createdAt: "2024-04-15T08:00:00Z"
	},
	{
		id: "u_tenant_1",
		email: "tenant@hostly.app",
		fullName: "Arjun Kapoor",
		phone: "+91 90000 11122",
		role: "tenant",
		workspaceIds: ["pg_greenhaven"],
		createdAt: "2024-05-09T08:00:00Z"
	}
];
//#endregion
//#region src/mock/seed/workspaces.ts
var SEED_WORKSPACES = [
	{
		id: "pg_greenhaven",
		name: "Greenhaven Residency",
		ownerId: "u_owner_multi",
		city: "Bengaluru",
		address: "12, 5th Cross, Indiranagar, Bengaluru 560038",
		initials: "GR",
		totalBeds: 84,
		occupiedBeds: 71,
		accent: "emerald",
		createdAt: "2024-02-12T08:00:00Z"
	},
	{
		id: "pg_skyline",
		name: "Skyline Stays",
		ownerId: "u_owner_multi",
		city: "Pune",
		address: "Sector 14, Magarpatta, Pune 411028",
		initials: "SS",
		totalBeds: 56,
		occupiedBeds: 49,
		accent: "blue",
		createdAt: "2024-06-04T08:00:00Z"
	},
	{
		id: "pg_meridian",
		name: "Meridian Co-Living",
		ownerId: "u_owner_multi",
		city: "Hyderabad",
		address: "Plot 18, HITEC City, Hyderabad 500081",
		initials: "MC",
		totalBeds: 120,
		occupiedBeds: 98,
		accent: "violet",
		createdAt: "2024-09-21T08:00:00Z"
	},
	{
		id: "pg_lotus",
		name: "Lotus Ladies PG",
		ownerId: "u_owner_single",
		city: "Mumbai",
		address: "21, Linking Road, Bandra West, Mumbai 400050",
		initials: "LP",
		totalBeds: 48,
		occupiedBeds: 44,
		accent: "rose",
		createdAt: "2024-03-22T08:00:00Z"
	}
];
//#endregion
//#region src/mock/db.ts
var isBrowser$1 = typeof window !== "undefined" && typeof window.localStorage !== "undefined";
function readFromStorage(key, fallback) {
	if (!isBrowser$1) return fallback;
	try {
		const raw = window.localStorage.getItem(key);
		return raw ? JSON.parse(raw) : fallback;
	} catch {
		return fallback;
	}
}
function writeToStorage(key, value) {
	if (!isBrowser$1) return;
	try {
		window.localStorage.setItem(key, JSON.stringify(value));
	} catch {}
}
var db = {
	users: readFromStorage("hostly.mockdb.users", SEED_USERS),
	workspaces: readFromStorage("hostly.mockdb.workspaces", SEED_WORKSPACES),
	emails: readFromStorage("hostly.mockdb.emails", []),
	save() {
		writeToStorage("hostly.mockdb.users", this.users);
		writeToStorage("hostly.mockdb.workspaces", this.workspaces);
		writeToStorage("hostly.mockdb.emails", this.emails);
	}
};
//#endregion
//#region src/config/app.ts
var APP_CONFIG = {
	name: "Hostly",
	tagline: "Operate every PG, every bed, every rupee — from one place.",
	shortDescription: "Multi-tenant PG management for owners, staff and tenants.",
	supportEmail: "support@hostly.app",
	mockNetworkDelayMs: 350
};
//#endregion
//#region src/services/http.ts
function delay(value, ms = APP_CONFIG.mockNetworkDelayMs) {
	return new Promise((resolve) => setTimeout(() => resolve(value), ms));
}
var ApiError = class extends Error {
	status;
	code;
	constructor(message, status = 400, code = "BAD_REQUEST") {
		super(message);
		this.status = status;
		this.code = code;
	}
};
//#endregion
//#region src/services/auth.service.ts
var MOCK_PASSWORD = "password";
function createSession(user, workspaceId) {
	return {
		token: `mock_${user.id}_${Date.now()}`,
		userId: user.id,
		workspaceId,
		issuedAt: (/* @__PURE__ */ new Date()).toISOString()
	};
}
var authService = {
	async login(credentials) {
		const user = db.users.find((u) => u.email.toLowerCase() === credentials.email.toLowerCase());
		const expectedPassword = user?.password || MOCK_PASSWORD;
		if (!user || credentials.password !== expectedPassword) {
			await delay(null, 500);
			throw new ApiError("Invalid email or password.", 401, "INVALID_CREDENTIALS");
		}
		const requiresWorkspaceSelection = user.role === "owner" && user.workspaceIds.length > 1;
		return delay({
			session: createSession(user, user.role === "super_admin" ? null : requiresWorkspaceSelection ? null : user.workspaceIds[0] ?? null),
			user,
			requiresWorkspaceSelection
		});
	},
	async signup(data) {
		if (db.users.some((u) => u.email.toLowerCase() === data.email.toLowerCase())) {
			await delay(null, 300);
			throw new ApiError("Email already registered.", 400, "EMAIL_EXISTS");
		}
		const workspaceId = `pg_${data.hostelName.toLowerCase().replace(/\s+/g, "_")}_${Date.now().toString().slice(-4)}`;
		const userId = `u_owner_${Date.now()}`;
		const initials = data.hostelName.split(/\s+/).map((w) => w[0]).join("").toUpperCase().slice(0, 2) || "PG";
		const newWorkspace = {
			id: workspaceId,
			name: data.hostelName,
			ownerId: userId,
			city: "Bengaluru",
			address: "12, MG Road, Bengaluru 560001",
			initials,
			totalBeds: 50,
			occupiedBeds: 0,
			accent: "blue",
			planId: data.planId,
			createdAt: (/* @__PURE__ */ new Date()).toISOString()
		};
		db.workspaces.push(newWorkspace);
		const newUser = {
			id: userId,
			email: data.email,
			fullName: data.fullName,
			phone: data.phone,
			role: "owner",
			workspaceIds: [workspaceId],
			createdAt: (/* @__PURE__ */ new Date()).toISOString()
		};
		db.users.push(newUser);
		db.save();
		return delay({
			session: createSession(newUser, workspaceId),
			user: newUser,
			requiresWorkspaceSelection: false
		});
	},
	async logout() {
		return delay(void 0, 120);
	},
	async me(userId) {
		const user = db.users.find((u) => u.id === userId);
		if (!user) throw new ApiError("User not found", 404, "NOT_FOUND");
		return delay(user, 150);
	}
};
//#endregion
//#region src/lib/session-storage.ts
var KEY = "hostly.session.v1";
function isBrowser() {
	return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}
var sessionStorage = {
	read() {
		if (!isBrowser()) return null;
		try {
			const raw = window.localStorage.getItem(KEY);
			return raw ? JSON.parse(raw) : null;
		} catch {
			return null;
		}
	},
	write(session) {
		if (!isBrowser()) return;
		window.localStorage.setItem(KEY, JSON.stringify(session));
	},
	clear() {
		if (!isBrowser()) return;
		window.localStorage.removeItem(KEY);
	},
	setActiveWorkspace(workspaceId) {
		const current = this.read();
		if (!current) return;
		this.write({
			...current,
			workspaceId
		});
	}
};
//#endregion
//#region src/config/roles.ts
var ROLE_PERMISSIONS = {
	super_admin: [
		"platform:manage",
		"workspace:view",
		"workspace:manage",
		"reports:view",
		"reports:export"
	],
	owner: [
		"workspace:view",
		"workspace:manage",
		"tenants:view",
		"tenants:manage",
		"rooms:view",
		"rooms:manage",
		"payments:view",
		"payments:manage",
		"staff:view",
		"staff:manage",
		"complaints:view",
		"complaints:manage",
		"reports:view",
		"reports:export"
	],
	manager: [
		"workspace:view",
		"tenants:view",
		"tenants:manage",
		"rooms:view",
		"rooms:manage",
		"payments:view",
		"staff:view",
		"complaints:view",
		"complaints:manage",
		"reports:view"
	],
	reception: [
		"workspace:view",
		"tenants:view",
		"tenants:manage",
		"rooms:view",
		"complaints:view"
	],
	accountant: [
		"workspace:view",
		"payments:view",
		"payments:manage",
		"reports:view",
		"reports:export"
	],
	warden: [
		"workspace:view",
		"tenants:view",
		"rooms:view",
		"complaints:view",
		"complaints:manage"
	],
	housekeeping: ["workspace:view", "rooms:view"],
	security: ["workspace:view", "tenants:view"],
	maintenance: [
		"workspace:view",
		"complaints:view",
		"complaints:manage"
	],
	laundry: ["workspace:view"],
	cook: ["workspace:view"],
	tenant: ["tenant:self"]
};
var ROLE_LABEL = {
	super_admin: "Super Admin",
	owner: "PG Owner",
	manager: "Manager",
	reception: "Reception",
	accountant: "Accountant",
	warden: "Warden",
	housekeeping: "Housekeeping",
	security: "Security",
	maintenance: "Maintenance",
	laundry: "Laundry",
	cook: "Cook",
	tenant: "Tenant"
};
var ROLE_HOME = {
	super_admin: "/super-admin/dashboard",
	owner: "/owner/dashboard",
	manager: "/staff/dashboard",
	reception: "/staff/dashboard",
	accountant: "/staff/dashboard",
	warden: "/staff/dashboard",
	housekeeping: "/staff/dashboard",
	security: "/staff/dashboard",
	maintenance: "/staff/dashboard",
	laundry: "/staff/dashboard",
	cook: "/staff/dashboard",
	tenant: "/tenant/dashboard"
};
function isStaffRole(role) {
	return [
		"manager",
		"reception",
		"accountant",
		"warden",
		"housekeeping",
		"security",
		"maintenance",
		"laundry",
		"cook"
	].includes(role);
}
function getDashboardRouteForRole(role) {
	if (!role) return "/unauthorized";
	if (role === "super_admin") return "/super-admin/dashboard";
	if (role === "owner") return "/owner/dashboard";
	if (role === "tenant") return "/tenant/dashboard";
	if (isStaffRole(role)) return "/staff/dashboard";
	return "/unauthorized";
}
//#endregion
//#region src/providers/auth-provider.tsx
var AuthContext = createContext(null);
function AuthProvider({ children }) {
	const [session, setSession] = useState(null);
	const [user, setUser] = useState(null);
	const [status, setStatus] = useState("loading");
	useEffect(() => {
		const stored = sessionStorage.read();
		if (!stored) {
			setStatus("unauthenticated");
			return;
		}
		authService.me(stored.userId).then((u) => {
			setSession(stored);
			setUser(u);
			setStatus("authenticated");
		}).catch(() => {
			sessionStorage.clear();
			setStatus("unauthenticated");
		});
	}, []);
	const login = useCallback(async (email, password) => {
		const result = await authService.login({
			email,
			password
		});
		sessionStorage.write(result.session);
		setSession(result.session);
		setUser(result.user);
		setStatus("authenticated");
		return result;
	}, []);
	const logout = useCallback(async () => {
		await authService.logout();
		sessionStorage.clear();
		setSession(null);
		setUser(null);
		setStatus("unauthenticated");
	}, []);
	const setActiveWorkspace = useCallback((workspaceId) => {
		sessionStorage.setActiveWorkspace(workspaceId);
		setSession((prev) => prev ? {
			...prev,
			workspaceId
		} : prev);
	}, []);
	const hasRole = useCallback((role) => {
		if (!user) return false;
		return (Array.isArray(role) ? role : [role]).includes(user.role);
	}, [user]);
	const hasPermission = useCallback((permission) => {
		if (!user) return false;
		return ROLE_PERMISSIONS[user.role].includes(permission);
	}, [user]);
	const value = useMemo(() => ({
		user,
		session,
		status,
		login,
		logout,
		setActiveWorkspace,
		hasRole,
		hasPermission
	}), [
		user,
		session,
		status,
		login,
		logout,
		setActiveWorkspace,
		hasRole,
		hasPermission
	]);
	return /* @__PURE__ */ jsx(AuthContext.Provider, {
		value,
		children
	});
}
function useAuth() {
	const ctx = useContext(AuthContext);
	if (!ctx) throw new Error("useAuth must be used within <AuthProvider>");
	return ctx;
}
//#endregion
export { getDashboardRouteForRole as a, authService as c, db as d, ROLE_LABEL as i, ApiError as l, useAuth as n, isStaffRole as o, ROLE_HOME as r, sessionStorage as s, AuthProvider as t, delay as u };
