import Link from "next/link";
import SiteNav from "@/app/components/SiteNav";
import SiteFooter from "@/app/components/SiteFooter";
import JsonLd from "@/components/seo/JsonLd";
import { pageMetadata } from "@/lib/seo/metadata";
import { breadcrumbSchema, jsonLdGraph } from "@/lib/seo/schema";
import { site } from "@/lib/site";

export const metadata = pageMetadata({
  title: "Privacy Policy",
  description:
    "How Green Engineering Systems (GES) collects, uses and protects the information you share through ges.lk — the contact form, the AI chat assistant and your rights under Sri Lanka's Personal Data Protection Act.",
  path: "/privacy-policy",
});

const UPDATED = "6 October 2026";

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-10">
      <h2 className="font-display text-xl sm:text-2xl font-black tracking-tight text-stone-900">{title}</h2>
      <div className="mt-3 flex flex-col gap-3 text-sm sm:text-base font-medium leading-relaxed text-stone-600">{children}</div>
    </section>
  );
}

export default function PrivacyPolicyPage() {
  return (
    <div className="w-full min-h-screen bg-[#f8f9fa] flex flex-col">
      <JsonLd data={jsonLdGraph(breadcrumbSchema([{ name: "Privacy Policy", path: "/privacy-policy" }]))} />
      <SiteNav />

      <main className="flex-1 w-full max-w-[820px] mx-auto px-6 py-14 sm:py-20">
        <p className="font-mono text-xs font-black tracking-[0.25em] text-[#00AC4E] uppercase">Legal</p>
        <h1 className="mt-3 font-display text-4xl sm:text-5xl font-black tracking-tight text-stone-900">Privacy Policy</h1>
        <p className="mt-4 text-sm font-semibold text-stone-400">Last updated: {UPDATED}</p>

        <p className="mt-8 text-base font-medium leading-relaxed text-stone-600">
          This policy explains what information {site.legalName} (&ldquo;GES&rdquo;, &ldquo;we&rdquo;) collects when you use{" "}
          <Link href="/" className="font-semibold text-[#00AC4E] underline">www.ges.lk</Link>, why we collect it, and the choices you
          have. We handle personal data in line with Sri Lanka&apos;s Personal Data Protection Act, No. 9 of 2022.
        </p>

        <Section title="Who we are">
          <p>
            {site.legalName}, {site.address.display}. You can reach us at{" "}
            <a href={`mailto:${site.email}`} className="font-semibold text-[#00AC4E] underline">{site.email}</a> or{" "}
            <a href={`tel:${site.phone.tel}`} className="font-semibold text-[#00AC4E] underline">{site.phone.display}</a>.
          </p>
        </Section>

        <Section title="What we collect">
          <ul className="list-disc pl-5 flex flex-col gap-2">
            <li>
              <strong className="text-stone-800">Contact form:</strong> your name, email address, phone number, subject and message.
            </li>
            <li>
              <strong className="text-stone-800">AI chat assistant:</strong> the messages you send and the replies you receive, the page you
              started the chat on, your browser type, a scrambled (hashed) version of your IP address that we use to prevent abuse, any
              solar estimates the assistant gives you, and any contact details you choose to share. <strong className="text-stone-800">All
              chat conversations are saved</strong> so our team can follow up and improve the service.
            </li>
            <li>
              <strong className="text-stone-800">Your browser:</strong> the chat stores a conversation identifier in your browser&apos;s local
              storage so you can continue a conversation when you come back. We don&apos;t use advertising or tracking cookies.
            </li>
            <li>
              <strong className="text-stone-800">Service requests:</strong> the maintenance request form opens your own email app; we receive
              what you send us by email.
            </li>
          </ul>
        </Section>

        <Section title="How we use it">
          <ul className="list-disc pl-5 flex flex-col gap-2">
            <li>To answer your questions and enquiries, and to prepare estimates, site assessments and quotations.</li>
            <li>To contact you when you&apos;ve asked us to — for example after you share your details with the chat assistant.</li>
            <li>To improve our website, our assistant&apos;s answers and our service.</li>
            <li>To keep the website secure and prevent misuse.</li>
          </ul>
          <p>We do not sell your personal data.</p>
        </Section>

        <Section title="The AI chat assistant">
          <p>
            The assistant is an automated program. Your messages are sent to our AI provider, OpenAI, to generate replies; we ask OpenAI not
            to store them after processing, and OpenAI&apos;s own policies also apply. The assistant&apos;s estimates are approximate and for
            guidance only — our engineers confirm the details with you.
          </p>
          <p>Please don&apos;t share sensitive information in the chat, such as your NIC number or bank or card details.</p>
        </Section>

        <Section title="Who we share it with">
          <p>
            Only with the service providers that run this website for us, under their data-protection terms: Supabase (database hosting),
            Netlify (website hosting) and OpenAI (AI chat replies). We may also disclose information where the law requires it.
          </p>
        </Section>

        <Section title="How long we keep it">
          <p>
            We keep enquiries, chat conversations and customer records for as long as we need them to deal with your enquiry, provide our
            services and keep proper business records. You can ask us to delete your information at any time.
          </p>
        </Section>

        <Section title="Your rights">
          <p>
            You can ask to see the personal data we hold about you, to correct it, to have it deleted, or to withdraw your consent to being
            contacted. To do so, email{" "}
            <a href={`mailto:${site.email}`} className="font-semibold text-[#00AC4E] underline">{site.email}</a> and we&apos;ll respond as
            required by the Personal Data Protection Act.
          </p>
        </Section>

        <Section title="Security">
          <p>
            Information is sent over encrypted connections and stored with access limited to authorised GES staff. No system is perfectly
            secure, but we take reasonable steps to protect what you share with us.
          </p>
        </Section>

        <Section title="Changes to this policy">
          <p>We may update this policy from time to time. The date at the top shows when it last changed.</p>
        </Section>
      </main>

      <SiteFooter />
    </div>
  );
}
