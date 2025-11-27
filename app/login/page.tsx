"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import type { FormEvent } from "react";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    const normalizedUser = username.trim().toLowerCase();
    const credentials = {
      employee: "test",
      ceo: "test",
    } as const;

    if (credentials[normalizedUser as keyof typeof credentials] === password) {
      if (typeof window !== "undefined") {
        sessionStorage.setItem("isAuthenticated", "true");
        sessionStorage.setItem("username", normalizedUser);
        sessionStorage.setItem("role", normalizedUser === "ceo" ? "ceo" : "employee");
      }
      router.push("/");
    } else {
      setError(
        normalizedUser === "employee" || normalizedUser === "ceo"
          ? "Incorrect password."
          : "Invalid username or password",
      );
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-[#FFF6F6] via-[#FFEAEA] to-[#FFDCDC] text-[#5B0A0E]">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.95),_transparent_45%),_radial-gradient(circle_at_25%_15%,_rgba(205,14,37,0.25),_transparent_40%)] opacity-80"
      />
      <div className="pointer-events-none absolute -bottom-48 right-0 h-[34rem] w-[34rem] rounded-full bg-[#d32a2a33] blur-[220px]" />

      <div className="relative z-10 flex min-h-screen flex-col justify-between px-6 py-10 text-[#5B0A0E] md:flex-row md:items-center md:justify-between md:px-16">
        <div className="flex flex-1 flex-col items-center gap-6 text-center text-[#5B0A0E] md:items-start md:text-left">
          <div className="flex items-center gap-4">
            <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-white/10 p-4 backdrop-blur-xl ring-1 ring-white/40">
              <Image
                src="/air-india-logo.png"
                alt="Air India logo"
                width={72}
                height={72}
                className="object-contain"
                priority
              />
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.6em] text-[#7A141C]/60">
                Air India
              </p>
              <p className="text-2xl font-semibold leading-tight">
                Employee Onboarding Buddy
              </p>
            </div>
          </div>
          <p className="max-w-md text-base text-[#7A141C]/80">
            A dedicated companion for new hires. Sign in securely to continue
            your onboarding journey with confidence.
          </p>
        </div>

        <div className="mt-12 flex flex-1 justify-center md:mt-0">
          <div className="w-full max-w-md rounded-[32px] border border-white/50 bg-white/25 p-10 text-[#5B0A0E] shadow-[0_30px_120px_rgba(91,10,14,0.2)] backdrop-blur-2xl">
            <div className="space-y-3 text-center">
              <p className="text-xs uppercase tracking-[0.4em] text-[#7A141C]/60">
                Secure Access
              </p>
              <h1 className="text-3xl font-semibold">Enter User Name ID</h1>
              <p className="text-sm text-[#7A141C]/70">
                Use your Air India credentials to continue
              </p>
            </div>

            <form onSubmit={handleSubmit} className="mt-10 space-y-6">
              <div className="space-y-2 text-left text-[#7A141C]">
                <label
                  htmlFor="username"
                  className="text-sm font-medium text-[#7A141C]/80"
                >
                  User Name ID
                </label>
                <Input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="h-12 rounded-2xl border-white/60 bg-white/70 text-base text-[#5B0A0E] placeholder:text-[#7A141C]/40 backdrop-blur-2xl focus:border-[#c7222a] focus:bg-white"
                  placeholder="e.g. AI-EMP-0001"
                  required
                  disabled={isLoading}
                />
              </div>

              <div className="space-y-2 text-left text-[#7A141C]">
                <label
                  htmlFor="password"
                  className="text-sm font-medium text-[#7A141C]/80"
                >
                  Access Passcode
                </label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-12 rounded-2xl border-white/60 bg-white/70 text-base text-[#5B0A0E] placeholder:text-[#7A141C]/40 backdrop-blur-2xl focus:border-[#c7222a] focus:bg-white"
                  placeholder="Enter passcode"
                  required
                  disabled={isLoading}
                />
              </div>

              {error && (
                <div className="rounded-2xl border border-red-500/40 bg-red-500/10 px-4 py-2 text-center text-sm text-red-700">
                  {error}
                </div>
              )}

              <Button
                type="submit"
                disabled={isLoading}
                className="h-12 w-full rounded-2xl bg-[#C7222A] text-base font-semibold text-white transition-colors hover:bg-[#A91B20] disabled:opacity-50"
              >
                {isLoading ? "Signing in..." : "Access Workspace"}
              </Button>
            </form>
          </div>
        </div>
      </div>

      <div className="pointer-events-none absolute bottom-6 right-6 flex items-center gap-4 text-[#7A141C]/70">
        <div className="text-right">
          <p className="text-[11px] uppercase tracking-[0.5em] text-[#7A141C]/50">
            Powered by
          </p>
          <p className="text-lg font-semibold text-[#5B0A0E]">Onboardly</p>
        </div>
        <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-white/70 bg-white/80 shadow-lg">
          <Image
            src="/onboarding.png"
            alt="Onboardly logo"
            width={48}
            height={48}
            className="h-10 w-10 object-contain"
            priority
          />
        </div>
      </div>
    </div>
  );
}

