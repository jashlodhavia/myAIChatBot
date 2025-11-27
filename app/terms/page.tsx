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
              These terms describe how you may interact with AirIndiaGuide.AI, an
              experimental employee onboarding concierge crafted by {OWNER_NAME}. It is
              trained on replicated, synthetic (FAKE) data that merely imitates
              Air India–style documents, SOPs and codebases – it does not use real
              internal data. Please read carefully before continuing.
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
              (&quot;AI Chatbot&quot;), an AI-powered employee onboarding concierge provided
              by {OWNER_NAME} (&quot;I&quot;, &quot;me&quot;, or &quot;myself&quot;). By engaging with the AI
              Chatbot, you agree to these terms.
            </p>
          </section>

          <div className="mt-8 space-y-6">
            <TermBlock
              title="General Information"
              items={[
                `Provider and Purpose: The AI Chatbot is developed and maintained by ${OWNER_NAME}. It is intended to assist with generic, educational onboarding-style queries (for example, how policies, SOPs, or codebases might work in a typical airline-like setup).`,
                "Not Official Air India Tool: The AI Chatbot is NOT developed by, endorsed by, or affiliated with Air India, the Tata Group, or any of their subsidiaries, regulators, or partners. Any reference to Air India is purely illustrative.",
                "Synthetic / Fake Training Data: The AI Chatbot is trained on replicated FAKE / synthetic data that imitates documents, SOPs and codebases of an airline. It does NOT access or expose real Air India systems, real company documents, or actual employee records.",
                "No Guarantee of Accuracy: All answers are generated and may be incomplete, approximate, outdated, or incorrect. They do not represent official HR, legal, IT, finance, security, or operational guidance. Always verify with your organisation’s official policies, portals and HR/manager before acting.",
              ]}
            />

            <TermBlock
              title="Liability"
              items={[
                "Use at Your Own Risk: The AI Chatbot is provided on an “as-is” and “as-available” basis. All warranties (express or implied), including accuracy, fitness for a particular purpose and non-infringement, are disclaimed to the maximum extent permitted by law.",
                "No Responsibility for Damages: Neither the owner nor any collaborators will be liable for direct, indirect, incidental, consequential, special, or exemplary damages arising out of or in connection with the use of (or inability to use) the AI Chatbot.",
                "No Employment or Contractual Rights: Outputs from the AI Chatbot do not create or modify any employment contract, policy, benefit, entitlement, or right. Your actual employment terms and conditions are governed solely by your employer and its official documentation.",
                "Modification or Discontinuation: Features, access, or the entire service may be changed, suspended, or discontinued at any time without notice.",
                "Future Fees: Paid plans or usage-based fees may be introduced in the future without prior notice. Continued use after such changes will be treated as acceptance of the updated commercial terms.",
              ]}
            />

            <TermBlock
              title="User Responsibilities"
              items={[
                "Eligibility: You must be 18+ to use the AI Chatbot, or the age of majority in your jurisdiction, whichever is higher.",
                "No Confidential or Personal Data: Do NOT enter real confidential business information (e.g., customer data, passenger PNRs, financials, trade secrets), sensitive personal data, or security credentials. Treat the chatbot as a public tool for generic learning only.",
                "Prohibited Conduct: You agree not to upload or generate defamatory, illegal, hateful, or obscene material; attempt to circumvent or probe security; or reverse engineer, scrape, or misuse the service in any way.",
                "Human Oversight: You are responsible for applying judgment and confirming information with your organisation’s official sources (HR, IT, Finance, Legal, etc.) before relying on any output from the AI Chatbot.",
              ]}
            />

            <TermBlock
              title="Data Privacy and Security"
              items={[
                "No Privacy Guarantee: Prompts, feedback and outputs may be logged, stored and reviewed to improve AI quality, safety, and performance. Do not share anything you would not be comfortable treating as non-confidential.",
                "Public / Non-Confidential Treatment: You should assume that anything you type into the AI Chatbot is non-confidential. Do not use it to transmit secrets, proprietary code, or personal employee data.",
                "Third-Party Infrastructure: The service may run on third-party infrastructure, APIs and cloud providers that can be located outside your country or region. While reasonable technical and organisational measures may be used, absolute security cannot be guaranteed.",
              ]}
            />

            <TermBlock
              title="Ownership & Commercial Use"
              items={[
                `Your Inputs: You remain responsible for any content you submit. By using the AI Chatbot, you grant ${OWNER_NAME} a worldwide, non-exclusive, royalty-free licence to use your inputs (and generated outputs) to operate, maintain, improve, research and develop the service.`,
                "AI Outputs: Outputs are generated content and may be reused, analysed, or aggregated for research, product improvement, demos and other projects, subject to applicable law.",
                "No Claim to Gains: You understand and agree that you will not have any claim to profits, products, or commercial gains that may arise, directly or indirectly, from the use of your prompts or the AI outputs.",
              ]}
            />

            <section className="space-y-3">
              <h3 className="text-xl font-semibold text-[#7A141C]">
                Indemnification
              </h3>
              <p>
                By using the AI Chatbot, you agree to indemnify, defend, and hold harmless {OWNER_NAME},
                and any collaborators or partners, from and against all claims, liabilities, damages,
                losses, costs and expenses (including reasonable legal fees) arising out of or related to
                your use of the AI Chatbot, your content, or your violation of these terms.
              </p>
            </section>

            <section className="space-y-3">
              <h3 className="text-xl font-semibold text-[#7A141C]">
                Governing Law
              </h3>
              <p>
                These terms are governed by and construed in accordance with the laws of India, without
                regard to its conflict of law principles. Where permitted, any disputes will be subject to
                the exclusive jurisdiction of the courts in India. If you are accessing the AI Chatbot from
                another country, you are responsible for complying with local laws where applicable.
              </p>
            </section>

            <section className="space-y-3">
              <h3 className="text-xl font-semibold text-[#7A141C]">
                Acceptance of Terms
              </h3>
              <p>
                By continuing to use the AI Chatbot, you confirm that you have read, understood, and agreed
                to these Terms of Use. If you do not agree with any part of these terms, you must stop using
                the AI Chatbot immediately.
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
