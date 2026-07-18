import { a as getDashboardRouteForRole, c as authService, d as db, n as useAuth } from "./auth-provider-ucs5_vFo.js";
import { n as cn, t as Button } from "./button-BpE9Czok.js";
import { t as Logo } from "./logo-CiKh46W1.js";
import { t as Input } from "./input-NvmijQlt.js";
import { t as Label } from "./label-AutfcB-T.js";
import * as React from "react";
import { useEffect, useState } from "react";
import { Navigate, useNavigate } from "@tanstack/react-router";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import { toast } from "sonner";
import { AlertCircle, Building2, Eye, EyeOff, Loader2, Lock, Mail, Phone, ShieldCheck, Sparkles, User } from "lucide-react";
import { motion } from "framer-motion";
import { cva } from "class-variance-authority";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
//#region src/components/ui/alert.tsx
var alertVariants = cva("relative w-full rounded-lg border px-4 py-3 text-sm [&>svg+div]:translate-y-[-3px] [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg]:text-foreground [&>svg~*]:pl-7", {
	variants: { variant: {
		default: "bg-background text-foreground",
		destructive: "border-destructive/50 text-destructive dark:border-destructive [&>svg]:text-destructive"
	} },
	defaultVariants: { variant: "default" }
});
var Alert = React.forwardRef(({ className, variant, ...props }, ref) => /* @__PURE__ */ jsx("div", {
	ref,
	role: "alert",
	className: cn(alertVariants({ variant }), className),
	...props
}));
Alert.displayName = "Alert";
var AlertTitle = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx("h5", {
	ref,
	className: cn("mb-1 font-medium leading-none tracking-tight", className),
	...props
}));
AlertTitle.displayName = "AlertTitle";
var AlertDescription = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx("div", {
	ref,
	className: cn("text-sm [&_p]:leading-relaxed", className),
	...props
}));
AlertDescription.displayName = "AlertDescription";
//#endregion
//#region src/features/auth/schemas.ts
var loginSchema = z.object({
	email: z.string().trim().min(1, "Email is required").email("Enter a valid email"),
	password: z.string().min(1, "Password is required").max(72)
});
//#endregion
//#region src/features/auth/components/login-form.tsx
var DEMO_ACCOUNTS = [
	{
		label: "Super Admin",
		email: "super@hostly.app"
	},
	{
		label: "Owner (3 PGs)",
		email: "owner@hostly.app"
	},
	{
		label: "Owner (1 PG)",
		email: "single@hostly.app"
	},
	{
		label: "Staff · Manager",
		email: "manager@hostly.app"
	},
	{
		label: "Tenant",
		email: "tenant@hostly.app"
	}
];
function LoginForm() {
	const navigate = useNavigate();
	const { login } = useAuth();
	const [serverError, setServerError] = useState(null);
	const [showPassword, setShowPassword] = useState(false);
	const form = useForm({
		resolver: zodResolver(loginSchema),
		defaultValues: {
			email: "",
			password: "password"
		}
	});
	async function onSubmit(values) {
		setServerError(null);
		try {
			const result = await login(values.email, values.password);
			toast.success(`Welcome back, ${result.user.fullName.split(" ")[0]}`);
			if (result.requiresWorkspaceSelection) {
				navigate({ to: "/workspace-select" });
				return;
			}
			navigate({ to: "/" });
		} catch (err) {
			setServerError(err instanceof Error ? err.message : "Login failed");
		}
	}
	return /* @__PURE__ */ jsxs("form", {
		onSubmit: form.handleSubmit(onSubmit),
		className: "space-y-5",
		noValidate: true,
		children: [
			serverError ? /* @__PURE__ */ jsxs(Alert, {
				variant: "destructive",
				children: [/* @__PURE__ */ jsx(AlertCircle, { className: "h-4 w-4" }), /* @__PURE__ */ jsx(AlertDescription, { children: serverError })]
			}) : null,
			/* @__PURE__ */ jsxs("div", {
				className: "space-y-2",
				children: [
					/* @__PURE__ */ jsx(Label, {
						htmlFor: "email",
						children: "Work email"
					}),
					/* @__PURE__ */ jsxs("div", {
						className: "relative",
						children: [/* @__PURE__ */ jsx(Mail, { className: "pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" }), /* @__PURE__ */ jsx(Input, {
							id: "email",
							type: "email",
							autoComplete: "email",
							placeholder: "you@company.com",
							className: "pl-9",
							"aria-invalid": Boolean(form.formState.errors.email),
							...form.register("email")
						})]
					}),
					form.formState.errors.email ? /* @__PURE__ */ jsx("p", {
						className: "text-xs text-destructive",
						children: form.formState.errors.email.message
					}) : null
				]
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "space-y-2",
				children: [
					/* @__PURE__ */ jsxs("div", {
						className: "flex items-center justify-between",
						children: [/* @__PURE__ */ jsx(Label, {
							htmlFor: "password",
							children: "Password"
						}), /* @__PURE__ */ jsx("a", {
							href: "#",
							className: "text-xs font-medium text-primary hover:underline",
							children: "Forgot password?"
						})]
					}),
					/* @__PURE__ */ jsxs("div", {
						className: "relative",
						children: [
							/* @__PURE__ */ jsx(Lock, { className: "pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" }),
							/* @__PURE__ */ jsx(Input, {
								id: "password",
								type: showPassword ? "text" : "password",
								autoComplete: "current-password",
								placeholder: "Your password",
								className: "pl-9 pr-10",
								"aria-invalid": Boolean(form.formState.errors.password),
								...form.register("password")
							}),
							/* @__PURE__ */ jsx("button", {
								type: "button",
								onClick: () => setShowPassword(!showPassword),
								className: "absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer focus:outline-none",
								"aria-label": showPassword ? "Hide password" : "Show password",
								children: showPassword ? /* @__PURE__ */ jsx(EyeOff, { className: "h-4 w-4" }) : /* @__PURE__ */ jsx(Eye, { className: "h-4 w-4" })
							})
						]
					}),
					form.formState.errors.password ? /* @__PURE__ */ jsx("p", {
						className: "text-xs text-destructive",
						children: form.formState.errors.password.message
					}) : null
				]
			}),
			/* @__PURE__ */ jsx(Button, {
				type: "submit",
				className: "w-full",
				disabled: form.formState.isSubmitting,
				children: form.formState.isSubmitting ? /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsx(Loader2, { className: "mr-2 h-4 w-4 animate-spin" }), " Signing in…"] }) : "Sign in"
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "rounded-md border border-dashed border-border bg-muted/40 p-3",
				children: [/* @__PURE__ */ jsxs("p", {
					className: "text-[11px] font-semibold uppercase tracking-wider text-muted-foreground",
					children: ["Demo accounts · password: ", /* @__PURE__ */ jsx("span", {
						className: "font-mono",
						children: "password"
					})]
				}), /* @__PURE__ */ jsx("div", {
					className: "mt-2 grid grid-cols-1 gap-1 sm:grid-cols-2",
					children: DEMO_ACCOUNTS.map((account) => /* @__PURE__ */ jsxs("button", {
						type: "button",
						onClick: () => {
							form.setValue("email", account.email, { shouldValidate: true });
							form.setValue("password", "password");
						},
						className: "rounded px-2 py-1 text-left text-xs text-foreground/80 transition-colors hover:bg-accent hover:text-accent-foreground",
						children: [/* @__PURE__ */ jsx("span", {
							className: "font-medium",
							children: account.label
						}), /* @__PURE__ */ jsxs("span", {
							className: "ml-1 text-muted-foreground",
							children: ["· ", account.email]
						})]
					}, account.email))
				})]
			})
		]
	});
}
//#endregion
//#region src/routes/login.tsx?tsr-split=component
function LoginPage() {
	const { status, user, session, login } = useAuth();
	const [activeTab, setActiveTab] = useState("owner");
	const [authMode, setAuthMode] = useState("signin");
	const [autoLoginLoading, setAutoLoginLoading] = useState(false);
	useEffect(() => {
		const inviteEmail = new URLSearchParams(window.location.search).get("inviteEmail");
		if (inviteEmail && status === "unauthenticated" && !autoLoginLoading) {
			setAutoLoginLoading(true);
			const loadingToast = toast.loading(`Processing access URL for ${inviteEmail}...`);
			const pass = db.users.find((u) => u.email.toLowerCase() === inviteEmail.toLowerCase())?.password || "password";
			login(inviteEmail, pass).then((result) => {
				toast.dismiss(loadingToast);
				toast.success(`Authenticated! Welcome back, ${result.user.fullName.split(" ")[0]}`);
				window.history.replaceState({}, document.title, window.location.pathname);
			}).catch((err) => {
				toast.dismiss(loadingToast);
				toast.error("Auto-login failed: User profile not found in mock database.");
				setAutoLoginLoading(false);
			});
		}
	}, [
		status,
		login,
		autoLoginLoading
	]);
	if (status === "authenticated" && user && !autoLoginLoading) {
		if (user.role === "owner" && user.workspaceIds.length > 1 && !session?.workspaceId) return /* @__PURE__ */ jsx(Navigate, { to: "/workspace-select" });
		return /* @__PURE__ */ jsx(Navigate, { to: getDashboardRouteForRole(user.role) });
	}
	return /* @__PURE__ */ jsxs("div", {
		className: "grid min-h-dvh grid-cols-1 bg-background lg:grid-cols-[1fr_minmax(480px,560px)]",
		children: [/* @__PURE__ */ jsxs("aside", {
			className: "relative hidden overflow-hidden lg:flex lg:flex-col lg:justify-between lg:bg-gradient-to-br lg:from-primary lg:via-primary lg:to-[oklch(0.42_0.18_265)] lg:p-12 lg:text-primary-foreground",
			children: [
				/* @__PURE__ */ jsx("div", {
					className: "relative z-10",
					children: /* @__PURE__ */ jsx(Logo, { className: "text-primary-foreground [&_span:last-child]:text-primary-foreground" })
				}),
				/* @__PURE__ */ jsxs(motion.div, {
					initial: {
						opacity: 0,
						y: 16
					},
					animate: {
						opacity: 1,
						y: 0
					},
					transition: {
						duration: .5,
						ease: "easeOut"
					},
					className: "relative z-10 max-w-md space-y-6",
					children: [
						/* @__PURE__ */ jsx("h2", {
							className: "text-3xl font-semibold leading-tight tracking-tight",
							children: "Operate every PG, every bed, every rupee — from one place."
						}),
						/* @__PURE__ */ jsx("p", {
							className: "text-sm leading-relaxed text-primary-foreground/80",
							children: "Hostly brings owners, staff and tenants onto one dependable platform. Replace spreadsheets, WhatsApp groups and reminder calls with a system that keeps everyone in sync."
						}),
						/* @__PURE__ */ jsx("ul", {
							className: "space-y-3 text-sm",
							children: [
								{
									icon: Building2,
									label: "Multi-property workspaces & roles"
								},
								{
									icon: ShieldCheck,
									label: "Auditable rent, deposits & receipts"
								},
								{
									icon: Sparkles,
									label: "Tenant-facing app for requests & payments"
								}
							].map((item) => /* @__PURE__ */ jsxs("li", {
								className: "flex items-center gap-3",
								children: [/* @__PURE__ */ jsx("span", {
									className: "grid h-8 w-8 place-items-center rounded-md bg-primary-foreground/10 ring-1 ring-inset ring-primary-foreground/20",
									children: /* @__PURE__ */ jsx(item.icon, { className: "h-4 w-4" })
								}), /* @__PURE__ */ jsx("span", {
									className: "text-primary-foreground/90",
									children: item.label
								})]
							}, item.label))
						})
					]
				}),
				/* @__PURE__ */ jsxs("p", {
					className: "relative z-10 text-xs text-primary-foreground/60",
					children: [
						"© ",
						(/* @__PURE__ */ new Date()).getFullYear(),
						" Hostly. Built for hostel & PG operators."
					]
				}),
				/* @__PURE__ */ jsx("div", {
					"aria-hidden": true,
					className: "absolute -right-32 -top-32 h-96 w-96 rounded-full bg-white/10 blur-3xl"
				}),
				/* @__PURE__ */ jsx("div", {
					"aria-hidden": true,
					className: "absolute -bottom-24 -left-24 h-80 w-80 rounded-full bg-white/5 blur-3xl"
				})
			]
		}), /* @__PURE__ */ jsx("section", {
			className: "flex flex-col justify-between px-6 py-12 sm:px-10",
			children: /* @__PURE__ */ jsxs("div", {
				className: "my-auto w-full mx-auto max-w-md",
				children: [
					/* @__PURE__ */ jsx("div", {
						className: "mb-8 lg:hidden",
						children: /* @__PURE__ */ jsx(Logo, {})
					}),
					/* @__PURE__ */ jsxs("div", {
						className: "mb-8 flex rounded-lg bg-muted p-1 text-sm font-medium",
						children: [/* @__PURE__ */ jsx("button", {
							onClick: () => {
								setActiveTab("owner");
								setAuthMode("signin");
							},
							className: `flex-1 rounded-md py-2.5 text-center transition-all ${activeTab === "owner" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`,
							children: "PG Owner / Admin"
						}), /* @__PURE__ */ jsx("button", {
							onClick: () => {
								setActiveTab("super_admin");
								setAuthMode("signin");
							},
							className: `flex-1 rounded-md py-2.5 text-center transition-all ${activeTab === "super_admin" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`,
							children: "Super Admin"
						})]
					}),
					/* @__PURE__ */ jsxs("div", {
						className: "mb-6",
						children: [/* @__PURE__ */ jsx("h1", {
							className: "text-2xl font-semibold tracking-tight text-foreground",
							children: activeTab === "owner" ? authMode === "signin" ? "Sign in as PG Owner" : "Register your PG / Hostel" : "Super Admin Access"
						}), /* @__PURE__ */ jsx("p", {
							className: "mt-1 text-sm text-muted-foreground",
							children: activeTab === "owner" ? authMode === "signin" ? "Manage tenants, staff, beds, and billing." : "Get started with your custom Hostly PG environment." : "Platform-wide management portal."
						})]
					}),
					autoLoginLoading ? /* @__PURE__ */ jsxs("div", {
						className: "flex flex-col items-center justify-center py-12 space-y-4",
						children: [/* @__PURE__ */ jsx(motion.div, {
							animate: { rotate: 360 },
							transition: {
								repeat: Infinity,
								duration: 1,
								ease: "linear"
							},
							className: "h-8 w-8 border-2 border-primary border-t-transparent rounded-full"
						}), /* @__PURE__ */ jsx("p", {
							className: "text-sm font-medium text-muted-foreground",
							children: "Redirecting to your dashboard..."
						})]
					}) : /* @__PURE__ */ jsxs(Fragment, { children: [activeTab === "owner" && authMode === "signup" ? /* @__PURE__ */ jsx(SignupForm, { onSignupSuccess: () => setAuthMode("signin") }) : /* @__PURE__ */ jsx(LoginForm, {}), activeTab === "owner" && /* @__PURE__ */ jsx("p", {
						className: "mt-6 text-center text-xs text-muted-foreground",
						children: authMode === "signin" ? /* @__PURE__ */ jsxs(Fragment, { children: [
							"Don't have an account?",
							" ",
							/* @__PURE__ */ jsx("button", {
								onClick: () => setAuthMode("signup"),
								className: "font-medium text-primary hover:underline cursor-pointer",
								children: "Sign up now"
							})
						] }) : /* @__PURE__ */ jsxs(Fragment, { children: [
							"Already have an account?",
							" ",
							/* @__PURE__ */ jsx("button", {
								onClick: () => setAuthMode("signin"),
								className: "font-medium text-primary hover:underline cursor-pointer",
								children: "Sign in instead"
							})
						] })
					})] })
				]
			})
		})]
	});
}
function SignupForm({ onSignupSuccess }) {
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);
	const [fullName, setFullName] = useState("");
	const [email, setEmail] = useState("");
	const [phone, setPhone] = useState("");
	const [hostelName, setHostelName] = useState("");
	const [password, setPassword] = useState("password");
	const [showPassword, setShowPassword] = useState(false);
	async function handleSubmit(e) {
		e.preventDefault();
		setError(null);
		if (!fullName.trim() || !email.trim() || !phone.trim() || !hostelName.trim()) {
			setError("Please fill in all details.");
			return;
		}
		setLoading(true);
		try {
			await authService.signup({
				fullName,
				email,
				phone,
				hostelName
			});
			toast.success(`Registration complete! Welcome ${fullName}`);
			window.location.href = "/pricing";
		} catch (err) {
			setError(err instanceof Error ? err.message : "Registration failed");
			setLoading(false);
		}
	}
	return /* @__PURE__ */ jsxs("form", {
		onSubmit: handleSubmit,
		className: "space-y-4",
		noValidate: true,
		children: [
			error && /* @__PURE__ */ jsx(Alert, {
				variant: "destructive",
				children: /* @__PURE__ */ jsx(AlertDescription, { children: error })
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "space-y-1.5",
				children: [/* @__PURE__ */ jsx(Label, {
					htmlFor: "fullName",
					children: "Full name"
				}), /* @__PURE__ */ jsxs("div", {
					className: "relative",
					children: [/* @__PURE__ */ jsx(User, { className: "pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" }), /* @__PURE__ */ jsx(Input, {
						id: "fullName",
						type: "text",
						placeholder: "John Doe",
						className: "pl-9",
						value: fullName,
						onChange: (e) => setFullName(e.target.value),
						required: true
					})]
				})]
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "grid grid-cols-2 gap-3",
				children: [/* @__PURE__ */ jsxs("div", {
					className: "space-y-1.5",
					children: [/* @__PURE__ */ jsx(Label, {
						htmlFor: "signup-email",
						children: "Work email"
					}), /* @__PURE__ */ jsxs("div", {
						className: "relative",
						children: [/* @__PURE__ */ jsx(Mail, { className: "pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" }), /* @__PURE__ */ jsx(Input, {
							id: "signup-email",
							type: "email",
							placeholder: "you@company.com",
							className: "pl-9",
							value: email,
							onChange: (e) => setEmail(e.target.value),
							required: true
						})]
					})]
				}), /* @__PURE__ */ jsxs("div", {
					className: "space-y-1.5",
					children: [/* @__PURE__ */ jsx(Label, {
						htmlFor: "signup-phone",
						children: "Phone number"
					}), /* @__PURE__ */ jsxs("div", {
						className: "relative",
						children: [/* @__PURE__ */ jsx(Phone, { className: "pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" }), /* @__PURE__ */ jsx(Input, {
							id: "signup-phone",
							type: "tel",
							placeholder: "+91 98765 43210",
							className: "pl-9",
							value: phone,
							onChange: (e) => setPhone(e.target.value),
							required: true
						})]
					})]
				})]
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "space-y-1.5",
				children: [/* @__PURE__ */ jsx(Label, {
					htmlFor: "hostelName",
					children: "PG / Hostel Name"
				}), /* @__PURE__ */ jsxs("div", {
					className: "relative",
					children: [/* @__PURE__ */ jsx(Building2, { className: "pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" }), /* @__PURE__ */ jsx(Input, {
						id: "hostelName",
						type: "text",
						placeholder: "e.g. Lotus Residency",
						className: "pl-9",
						value: hostelName,
						onChange: (e) => setHostelName(e.target.value),
						required: true
					})]
				})]
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "space-y-1.5",
				children: [
					/* @__PURE__ */ jsx(Label, {
						htmlFor: "signup-password",
						children: "Password"
					}),
					/* @__PURE__ */ jsxs("div", {
						className: "relative",
						children: [
							/* @__PURE__ */ jsx(Lock, { className: "pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" }),
							/* @__PURE__ */ jsx(Input, {
								id: "signup-password",
								type: showPassword ? "text" : "password",
								className: "pl-9 pr-10",
								value: password,
								onChange: (e) => setPassword(e.target.value),
								required: true,
								disabled: true
							}),
							/* @__PURE__ */ jsx("button", {
								type: "button",
								onClick: () => setShowPassword(!showPassword),
								className: "absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer focus:outline-none",
								"aria-label": showPassword ? "Hide password" : "Show password",
								children: showPassword ? /* @__PURE__ */ jsx(EyeOff, { className: "h-4 w-4" }) : /* @__PURE__ */ jsx(Eye, { className: "h-4 w-4" })
							})
						]
					}),
					/* @__PURE__ */ jsx("p", {
						className: "text-[10px] text-muted-foreground",
						children: "Password is preset to \"password\" for easy mock-auth login."
					})
				]
			}),
			/* @__PURE__ */ jsx(Button, {
				type: "submit",
				className: "w-full mt-4",
				disabled: loading,
				children: loading ? "Registering environment..." : "Complete Signup & Access Workspace"
			})
		]
	});
}
//#endregion
export { LoginPage as component };
