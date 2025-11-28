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
    <div 
      className="relative min-h-screen overflow-hidden text-[#2A1B1B]"
      style={{
        background: 'radial-gradient(circle at center, #FFFFFF 0%, #FFE8E8 50%, #FFE5E5 100%)'
      }}
    >
      <div className="relative z-10 flex min-h-screen flex-col items-center justify-center px-6 py-10">
        <div className="flex flex-col items-center gap-6 text-center w-full max-w-2xl">
          <Image
            src="/air-india-2.jpeg"
            alt="Air India logo"
            width={150}
            height={150}
            priority
          />
          
          <p className="text-2xl font-semibold leading-tight text-[#2A1B1B]">
            Employee Onboarding Buddy
          </p>
          
          <p className="max-w-md text-base text-[#2A1B1B]/80">
            A dedicated companion for new hires. Sign in securely to continue
            your onboarding journey with confidence.
          </p>

          <div className="w-full max-w-md mt-8">
            <div className="w-full rounded-[32px] border border-white/50 bg-[#9D0027] p-10 text-white shadow-[0_30px_120px_rgba(157,0,39,0.2)]">
            <div className="space-y-3 text-center">
              <p className="text-xs uppercase tracking-[0.4em] text-white/70">
                Secure Access
              </p>
              <h1 className="text-3xl font-semibold text-white">Enter User Name ID</h1>
              <p className="text-sm text-white/70">
                Use your Air India credentials to continue
              </p>
            </div>

            <form onSubmit={handleSubmit} className="mt-10 space-y-6">
              <div className="space-y-2 text-left">
                <label
                  htmlFor="username"
                  className="text-sm font-medium text-white/80"
                >
                  User Name ID
                </label>
                <Input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="h-12 rounded-2xl border-[#D4AF37] bg-white text-base text-[#2A1B1B] placeholder:text-[#2A1B1B]/40 focus:border-[#D4AF37] focus:ring-[#D4AF37]/50"
                  placeholder="e.g. AI-EMP-0001"
                  required
                  disabled={isLoading}
                />
              </div>

              <div className="space-y-2 text-left">
                <label
                  htmlFor="password"
                  className="text-sm font-medium text-white/80"
                >
                  Access Passcode
                </label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-12 rounded-2xl border-[#D4AF37] bg-white text-base text-[#2A1B1B] placeholder:text-[#2A1B1B]/40 focus:border-[#D4AF37] focus:ring-[#D4AF37]/50"
                  placeholder="Enter passcode"
                  required
                  disabled={isLoading}
                />
              </div>

              {error && (
                <div className="rounded-2xl border border-red-300/40 bg-red-500/20 px-4 py-2 text-center text-sm text-white">
                  {error}
                </div>
              )}

              <div className="rounded-2xl border border-white/30 bg-white px-4 py-3 text-center text-sm text-[#2A1B1B]">
                <p className="font-medium">Use username = employee and password = test</p>
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="h-12 w-full rounded-2xl bg-white border border-white/30 text-[#2A1B1B] hover:bg-white/90 transition-colors text-base font-semibold disabled:opacity-50"
              >
                {isLoading ? "Signing in..." : "Access Workspace"}
              </Button>
            </form>
            </div>
          </div>
        </div>
      </div>

      <div className="pointer-events-none absolute bottom-6 right-6 flex items-center gap-4 text-[#9D0027]/70">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-white/80 bg-white/90 shadow-2xl">
          <Image
            src="/onboarding.png"
            alt="Onboardly logo"
            width={64}
            height={64}
            className="h-14 w-14 object-contain"
            priority
          />
        </div>
      </div>
    </div>
  );
}

