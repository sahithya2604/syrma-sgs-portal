import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertCircle, Eye, EyeOff, Lock, User, UserPlus } from "lucide-react";
import { useState } from "react";
import { useAuth } from "../hooks/useAuth";

interface LoginPageProps {
  onSuccess: () => void;
}

type Mode = "login" | "register";

export function LoginPage({ onSuccess }: LoginPageProps) {
  const { login, register } = useAuth();
  const [mode, setMode] = useState<Mode>("login");

  // Shared fields
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // Register-only fields
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showConfirm, setShowConfirm] = useState(false);

  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  function switchMode(next: Mode) {
    setMode(next);
    setError(null);
    setUsername("");
    setPassword("");
    setConfirmPassword("");
    setShowPassword(false);
    setShowConfirm(false);
  }

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    if (!username.trim() || !password.trim()) {
      setError("Please enter both username and password.");
      return;
    }
    setError(null);
    setIsLoading(true);
    try {
      const success = await login(username.trim(), password);
      if (success) {
        onSuccess();
      } else {
        setError("Invalid username or password.");
      }
    } finally {
      setIsLoading(false);
    }
  }

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    const trimmedUser = username.trim();

    if (!trimmedUser || !password || !confirmPassword) {
      setError("Please fill in all fields.");
      return;
    }
    if (trimmedUser.length < 3) {
      setError("Username must be at least 3 characters.");
      return;
    }
    if (password.length < 4) {
      setError("Password must be at least 4 characters.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setError(null);
    setIsLoading(true);
    try {
      const result = await register(trimmedUser, password);
      if (result.success) {
        onSuccess();
      } else {
        setError(result.error ?? "Registration failed. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  }

  const isLoginMode = mode === "login";

  return (
    <div
      className="min-h-screen bg-background flex items-center justify-center p-4"
      data-ocid="login.page"
    >
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 rounded-full bg-primary/5 blur-3xl" />
      </div>

      <div className="relative w-full max-w-md">
        {/* Card */}
        <div className="bg-card border border-border rounded-2xl shadow-lg overflow-hidden">
          {/* Header stripe */}
          <div className="h-1.5 bg-gradient-to-r from-primary via-primary/70 to-accent" />

          <div className="px-8 py-10">
            {/* Logo */}
            <div
              className="flex flex-col items-center gap-4 mb-8"
              data-ocid="login.brand"
            >
              <img
                src="/assets/images/logo.png"
                alt="Syrma SGS Logo"
                className="h-14 w-auto object-contain"
              />
              <div className="text-center space-y-1">
                <h1 className="font-display font-bold text-xl text-foreground tracking-tight">
                  {isLoginMode ? "Welcome back" : "Create an account"}
                </h1>
                <p className="text-sm text-muted-foreground font-body">
                  {isLoginMode
                    ? "Sign in to Syrma SGS Document Intelligence Portal"
                    : "Register to access the Syrma SGS Portal"}
                </p>
              </div>
            </div>

            {/* Mode toggle tabs */}
            <div
              className="flex rounded-lg border border-border bg-muted/40 p-1 mb-7 gap-1"
              data-ocid="login.mode_toggle"
            >
              <button
                type="button"
                onClick={() => switchMode("login")}
                className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-md text-sm font-display font-medium transition-colors duration-200 ${
                  isLoginMode
                    ? "bg-card text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
                data-ocid="login.login_tab"
              >
                <Lock className="w-3.5 h-3.5" />
                Sign In
              </button>
              <button
                type="button"
                onClick={() => switchMode("register")}
                className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-md text-sm font-display font-medium transition-colors duration-200 ${
                  !isLoginMode
                    ? "bg-card text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
                data-ocid="login.register_tab"
              >
                <UserPlus className="w-3.5 h-3.5" />
                Register
              </button>
            </div>

            {/* Login Form */}
            {isLoginMode && (
              <form
                onSubmit={handleLogin}
                className="space-y-5"
                data-ocid="login.form"
              >
                <div className="space-y-1.5">
                  <Label
                    htmlFor="login-username"
                    className="text-sm font-display font-medium"
                  >
                    Username
                  </Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                    <Input
                      id="login-username"
                      type="text"
                      value={username}
                      onChange={(e) => {
                        setUsername(e.target.value);
                        setError(null);
                      }}
                      placeholder="Enter your username"
                      className="pl-9 h-10 font-body bg-background"
                      autoComplete="username"
                      autoFocus
                      disabled={isLoading}
                      data-ocid="login.username_input"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label
                    htmlFor="login-password"
                    className="text-sm font-display font-medium"
                  >
                    Password
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                    <Input
                      id="login-password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value);
                        setError(null);
                      }}
                      placeholder="Enter your password"
                      className="pl-9 pr-10 h-10 font-body bg-background"
                      autoComplete="current-password"
                      disabled={isLoading}
                      data-ocid="login.password_input"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((v) => !v)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors duration-200"
                      aria-label={
                        showPassword ? "Hide password" : "Show password"
                      }
                      tabIndex={-1}
                    >
                      {showPassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>

                {error && (
                  <div
                    className="flex items-center gap-2 px-3 py-2.5 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm font-body"
                    data-ocid="login.error_state"
                    role="alert"
                  >
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{error}</span>
                  </div>
                )}

                <Button
                  type="submit"
                  className="w-full h-10 font-display font-semibold"
                  disabled={isLoading || !username.trim() || !password.trim()}
                  data-ocid="login.submit_button"
                >
                  {isLoading ? (
                    <span className="flex items-center gap-2">
                      <span className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
                      Signing in…
                    </span>
                  ) : (
                    "Sign in"
                  )}
                </Button>
              </form>
            )}

            {/* Register Form */}
            {!isLoginMode && (
              <form
                onSubmit={handleRegister}
                className="space-y-5"
                data-ocid="register.form"
              >
                <div className="space-y-1.5">
                  <Label
                    htmlFor="reg-username"
                    className="text-sm font-display font-medium"
                  >
                    Username
                  </Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                    <Input
                      id="reg-username"
                      type="text"
                      value={username}
                      onChange={(e) => {
                        setUsername(e.target.value);
                        setError(null);
                      }}
                      placeholder="Choose a username"
                      className="pl-9 h-10 font-body bg-background"
                      autoComplete="username"
                      autoFocus
                      disabled={isLoading}
                      data-ocid="register.username_input"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label
                    htmlFor="reg-password"
                    className="text-sm font-display font-medium"
                  >
                    Password
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                    <Input
                      id="reg-password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value);
                        setError(null);
                      }}
                      placeholder="Create a password (min. 4 chars)"
                      className="pl-9 pr-10 h-10 font-body bg-background"
                      autoComplete="new-password"
                      disabled={isLoading}
                      data-ocid="register.password_input"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((v) => !v)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors duration-200"
                      aria-label={
                        showPassword ? "Hide password" : "Show password"
                      }
                      tabIndex={-1}
                    >
                      {showPassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label
                    htmlFor="reg-confirm"
                    className="text-sm font-display font-medium"
                  >
                    Confirm Password
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                    <Input
                      id="reg-confirm"
                      type={showConfirm ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => {
                        setConfirmPassword(e.target.value);
                        setError(null);
                      }}
                      placeholder="Re-enter your password"
                      className="pl-9 pr-10 h-10 font-body bg-background"
                      autoComplete="new-password"
                      disabled={isLoading}
                      data-ocid="register.confirm_input"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirm((v) => !v)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors duration-200"
                      aria-label={
                        showConfirm ? "Hide password" : "Show password"
                      }
                      tabIndex={-1}
                    >
                      {showConfirm ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>

                {error && (
                  <div
                    className="flex items-center gap-2 px-3 py-2.5 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm font-body"
                    data-ocid="register.error_state"
                    role="alert"
                  >
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{error}</span>
                  </div>
                )}

                <Button
                  type="submit"
                  className="w-full h-10 font-display font-semibold"
                  disabled={
                    isLoading ||
                    !username.trim() ||
                    !password.trim() ||
                    !confirmPassword.trim()
                  }
                  data-ocid="register.submit_button"
                >
                  {isLoading ? (
                    <span className="flex items-center gap-2">
                      <span className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
                      Creating account…
                    </span>
                  ) : (
                    "Create Account"
                  )}
                </Button>
              </form>
            )}
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-muted-foreground font-body mt-6">
          © {new Date().getFullYear()}.{" "}
          <a
            href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(typeof window !== "undefined" ? window.location.hostname : "")}`}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-foreground transition-colors duration-200"
          >
            Built with caffeine.ai
          </a>
        </p>
      </div>
    </div>
  );
}
