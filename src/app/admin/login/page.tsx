import { Suspense } from "react";
import Link from "next/link";
import { Cpu, ShieldCheck } from "lucide-react";
import { LoginForm } from "./login-form";

export const metadata = {
  title: "Admin Login",
};

export default function AdminLoginPage() {
  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-gradient-to-br from-emerald-700 via-emerald-800 to-emerald-950 px-4 py-10 text-emerald-50">
      {/* Decorative glow accents */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-24 -left-24 h-72 w-72 rounded-full bg-emerald-400/20 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-32 -right-24 h-80 w-80 rounded-full bg-amber-400/10 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.07] bg-[linear-gradient(to_right,white_1px,transparent_1px),linear-gradient(to_bottom,white_1px,transparent_1px)] bg-[size:32px_32px]"
      />

      <div className="relative z-10 w-full max-w-md">
        {/* Brand */}
        <div className="mb-6 flex flex-col items-center text-center">
          <div className="mb-3 flex size-14 items-center justify-center rounded-2xl bg-white/10 ring-1 ring-white/20 backdrop-blur">
            <Cpu className="size-7 text-emerald-200" />
          </div>
          <h1 className="text-2xl font-semibold tracking-tight text-white">
            Tongdam Admin
          </h1>
          <p className="mt-1 text-sm text-emerald-200/80">
            Sign in to manage your website.
          </p>
        </div>

        <Suspense fallback={null}>
          <LoginForm />
        </Suspense>

        {/* Trust strip */}
        <div className="mt-5 flex items-center justify-center gap-2 text-xs text-emerald-200/70">
          <ShieldCheck className="size-3.5" />
          <span>Authorized staff access only · All actions are logged</span>
        </div>

        {/* Back to site */}
        <div className="mt-6 text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-emerald-100 transition hover:text-white"
          >
            <span aria-hidden>←</span> Back to website
          </Link>
        </div>
      </div>
    </main>
  );
}
