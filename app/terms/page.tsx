import { ArrowLeftIcon } from "lucide-react";
import Link from "next/link";
import { OWNER_NAME } from "@/config";

export default function Terms() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-[#FFF6F6] via-[#FFE5E5] to-[#FFDCDC] text-[#5B0A0E]">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.9),_transparent_45%),radial-gradient(circle_at_25%_15%,rgba(199,34,42,0.2),transparent_45%)] opacity-80"
      />
      <div className="pointer-events-none absolute -bottom-48 right-0 h-[32rem] w-[32rem] rounded-full bg-[#c7222a29] blur-[200px]" />

      <main className="relative z-10 mx-auto flex min-h-screen w-full max-w-6xl flex-col gap-10 px-6 py-14 md:flex-row md:items-start md:gap-16 md:px-12">
        <div className="flex w-full max-w-sm flex-col gap-6 text-center md:text-left">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 text-sm font-semibold uppercase tracking-[0.4em] text-[#7A141C]/70 transition hover:text-[#5B0A0E] md:justify-start"
          >
            <ArrowLeftIcon className="h-4 w-4" />
            Back to Chatbot
          </Link>
          <div className="rounded-[32px] border border-white/50 bg-white/30 p-8 text-left shadow-[0_20px_80px_rgba(91,10,14,0.15)] backdrop-blur-2xl">
            <p className="text-xs uppercase tracking-[0.5em] text-[#7A141C]/60">
              Legal
            </p>
            <h1 className="mt-3 text-3xl font-semibold">MyAI3 Terms</h1>
            <p className="mt-4 text-sm leading-relaxed text-[#7A141C]/80">
              These terms describe how you may interact with AirIndiaGuide.AI, a
              secure onboarding buddy crafted by {OWNER_NAME}. Please read carefully before
              continuing.
            </p>
            <div className="mt-6 rounded-2xl border border-white/70 bg-white/70 px-5 py-4 text-sm font-semibold text-[#A2131A] shadow-inner">
              Last updated: November 17, 2025
            </div>
          </div>
        </div>

        <div className="w-full rounded-[32px] border border-white/60 bg-white/85 p-8 text-base leading-relaxed text-[#3D0C12] shadow-[0_40px_120px_rgba(199,34,42,0.2)] backdrop-blur-2xl md:p-10">
          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-[#7A141C]">
              Terms of Use / Disclaimer
            </h2>
            <p>
              The following terms govern access to and use of the MyAI3 Assistant
              (&quot;AI Chatbot&quot;), an AI tool provided by {OWNER_NAME} (&quot;I&quot;, &quot;me&quot;, or
              &quot;myself&quot;). By engaging with the AI Chatbot, you agree to these terms.
            </p>
          </section>

          <div className="mt-8 space-y-6">
            <TermBlock
              title="General Information"
              items={[
                `Provider and Purpose: The AI Chatbot is developed and maintained by ${OWNER_NAME}. It assists with onboarding and enablement queries and is not affiliated with any airline regulator.`,
                "Third-Party Involvement: Responses may leverage third-party infrastructure outside your region; confidentiality and privacy cannot be guaranteed.",
                "No Guarantee of Accuracy: Answers may be incomplete or outdated. Verify before making decisions.",
              ]}
            />

            <TermBlock
              title="Liability"
              items={[
                "Use at Your Own Risk: Provided “as-is” and “as-available.” All warranties are disclaimed to the fullest extent allowed.",
                "No Responsibility for Damages: Neither the owner nor collaborators are liable for direct or indirect damages stemming from usage.",
                "Modification or Discontinuation: Features may change or be withdrawn at any time without notice.",
                "Future Fees: Paid plans may be introduced in the future without prior notice.",
              ]}
            />

            <TermBlock
              title="User Responsibilities"
              items={[
                "Eligibility: You must be 18+ to use the AI Chatbot.",
                "Prohibited Conduct: Do not post defamatory, illegal, hateful, or obscene material, tamper with system security, or reverse engineer the service.",
              ]}
            />

            <TermBlock
              title="Data Privacy and Security"
              items={[
                "No Privacy Guarantee: Inputs and outputs may be reviewed to improve AI quality and training.",
                "Public Information: Treat your prompts as non-confidential.",
                "Data Transmission: Content may transit through external vendors and APIs.",
              ]}
            />

            <TermBlock
              title="Ownership & Commercial Use"
              items={[
                `Surrender of Rights: All inputs and outputs become the property of ${OWNER_NAME}.`,
                "Commercial / Research Use: Content may be reused for research, onboarding improvements, or other initiatives.",
                "No Claim to Gains: Users waive rights to profits derived from submitted content.",
              ]}
            />

            <section className="space-y-3">
              <h3 className="text-xl font-semibold text-[#7A141C]">
                Indemnification
              </h3>
              <p>
                By using the AI Chatbot, you agree to indemnify and hold harmless {OWNER_NAME},
                collaborators, and partners from claims arising from your use or violation of these terms.
              </p>
            </section>

            <section className="space-y-3">
              <h3 className="text-xl font-semibold text-[#7A141C]">
                Governing Law
              </h3>
              <p>
                These terms follow the laws of North Carolina, USA. Additional jurisdictions may apply for
                international users, but any disputes will be heard in North Carolina courts where permitted.
              </p>
            </section>

            <section className="space-y-3">
              <h3 className="text-xl font-semibold text-[#7A141C]">
                Acceptance of Terms
              </h3>
              <p>
                Continuing to use the AI Chatbot confirms you have read and agreed to these Terms of Use. If
                you disagree with any section, discontinue use immediately.
              </p>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}

type TermBlockProps = {
  title: string;
  items: string[];
};

function TermBlock({ title, items }: TermBlockProps) {
  return (
    <section className="space-y-4 rounded-3xl border border-[#f7b6b4] bg-white/75 px-6 py-5 shadow-inner">
      <h3 className="text-xl font-semibold text-[#7A141C]">{title}</h3>
      <ol className="list-decimal space-y-4 pl-5 text-sm leading-relaxed text-[#3D0C12]">
        {items.map((item, index) => (
          <li key={`${title}-${index}`} className="pl-2">
            {item}
          </li>
        ))}
      </ol>
    </section>
  );
}