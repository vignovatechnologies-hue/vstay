import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "@tanstack/react-router";
import { Loader2, Mail, Lock, AlertCircle, Eye, EyeOff, ArrowRight, User, Phone, Building2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useAuth } from "@/providers/auth-provider";

interface SignupFormValues {
  fullName: string;
  email: string;
  phone: string;
  hostelName: string;
  password: string;
}

export function SignupForm() {
  const navigate = useNavigate();
  const { signup } = useAuth();
  const [serverError, setServerError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignupFormValues>({
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      hostelName: "",
      password: "password",
    },
  });

  async function onSubmit(values: SignupFormValues) {
    setServerError(null);
    try {
      const result = await signup({
        fullName: values.fullName,
        email: values.email,
        phone: values.phone,
        hostelName: values.hostelName,
        password: values.password,
      });

      toast.success(`Registration complete! Welcome, ${result.user.fullName.split(" ")[0]}`);
      
      if (result.requiresWorkspaceSelection) {
        navigate({ to: "/workspace-select" });
      } else {
        navigate({ to: "/owner/dashboard" });
      }
    } catch (err: any) {
      const msg = err?.message ? String(err.message) : "Registration failed. Please check your details and try again.";
      setServerError(msg);
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
      {serverError ? (
        <Alert variant="destructive" className="py-2.5 rounded-xl border-red-200 dark:border-red-900 bg-red-50/80 dark:bg-red-950/50 text-red-700 dark:text-red-300">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="text-xs font-semibold">{serverError}</AlertDescription>
        </Alert>
      ) : null}

      {/* Full Name */}
      <div className="space-y-1.5">
        <Label htmlFor="fullName" className="text-xs font-bold text-gray-700 dark:text-gray-300">
          Full Name
        </Label>
        <div className="relative">
          <User className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <Input
            id="fullName"
            type="text"
            placeholder="e.g. Rohan Verma"
            className="pl-9 h-11 text-sm bg-white dark:bg-slate-900 border-gray-200 dark:border-gray-800 rounded-lg shadow-sm focus-visible:ring-1 focus-visible:ring-blue-500"
            aria-invalid={Boolean(errors.fullName)}
            {...register("fullName", { required: "Full name is required" })}
          />
        </div>
        {errors.fullName ? (
          <p className="text-xs text-destructive">{errors.fullName.message}</p>
        ) : null}
      </div>

      {/* Email & Phone Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {/* Email */}
        <div className="space-y-1.5">
          <Label htmlFor="signup-email" className="text-xs font-bold text-gray-700 dark:text-gray-300">
            Work Email
          </Label>
          <div className="relative">
            <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input
              id="signup-email"
              type="email"
              placeholder="you@pg.com"
              className="pl-9 h-11 text-sm bg-white dark:bg-slate-900 border-gray-200 dark:border-gray-800 rounded-lg shadow-sm focus-visible:ring-1 focus-visible:ring-blue-500"
              aria-invalid={Boolean(errors.email)}
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: "Invalid email address",
                },
              })}
            />
          </div>
          {errors.email ? (
            <p className="text-xs text-destructive">{errors.email.message}</p>
          ) : null}
        </div>

        {/* Phone */}
        <div className="space-y-1.5">
          <Label htmlFor="signup-phone" className="text-xs font-bold text-gray-700 dark:text-gray-300">
            Phone Number
          </Label>
          <div className="relative">
            <Phone className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input
              id="signup-phone"
              type="tel"
              placeholder="+91 98200 12345"
              className="pl-9 h-11 text-sm bg-white dark:bg-slate-900 border-gray-200 dark:border-gray-800 rounded-lg shadow-sm focus-visible:ring-1 focus-visible:ring-blue-500"
              aria-invalid={Boolean(errors.phone)}
              {...register("phone", { required: "Phone number is required" })}
            />
          </div>
          {errors.phone ? (
            <p className="text-xs text-destructive">{errors.phone.message}</p>
          ) : null}
        </div>
      </div>

      {/* PG / Hostel Name */}
      <div className="space-y-1.5">
        <Label htmlFor="hostelName" className="text-xs font-bold text-gray-700 dark:text-gray-300">
          PG / Hostel Name
        </Label>
        <div className="relative">
          <Building2 className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <Input
            id="hostelName"
            type="text"
            placeholder="e.g. Greenhaven Stays"
            className="pl-9 h-11 text-sm bg-white dark:bg-slate-900 border-gray-200 dark:border-gray-800 rounded-lg shadow-sm focus-visible:ring-1 focus-visible:ring-blue-500"
            aria-invalid={Boolean(errors.hostelName)}
            {...register("hostelName", { required: "PG / Hostel Name is required" })}
          />
        </div>
        {errors.hostelName ? (
          <p className="text-xs text-destructive">{errors.hostelName.message}</p>
        ) : null}
      </div>

      {/* Password */}
      <div className="space-y-1.5">
        <Label htmlFor="signup-password" className="text-xs font-bold text-gray-700 dark:text-gray-300">
          Password
        </Label>
        <div className="relative">
          <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <Input
            id="signup-password"
            type={showPassword ? "text" : "password"}
            placeholder="Create password"
            className="pl-9 pr-10 h-11 text-sm bg-white dark:bg-slate-900 border-gray-200 dark:border-gray-800 rounded-lg shadow-sm focus-visible:ring-1 focus-visible:ring-blue-500"
            aria-invalid={Boolean(errors.password)}
            {...register("password", { required: "Password is required" })}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer focus:outline-none"
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
        {errors.password ? (
          <p className="text-xs text-destructive">{errors.password.message}</p>
        ) : null}
      </div>

      {/* Submit Button */}
      <Button
        type="submit"
        className="w-full h-11 bg-[#1D61F2] hover:bg-blue-700 text-white font-bold flex items-center justify-center gap-2 text-sm rounded-lg shadow-sm transition-all mt-2"
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" /> Registering PG…
          </>
        ) : (
          <>
            Create PG Owner Account <ArrowRight className="h-4 w-4" />
          </>
        )}
      </Button>
    </form>
  );
}
