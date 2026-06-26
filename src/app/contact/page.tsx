import type { Metadata } from "next";
import ContactClient from "./ContactClient";

export const metadata: Metadata = {
  title: "Contact Us | Green Engineering Systems (Pvt) Ltd",
  description:
    "Get in touch with Green Engineering Systems. Offices in Kelaniya, Sri Lanka. Email info@ges.lk, call 076 533 2332, or send us a message.",
};

export default function ContactPage() {
  return <ContactClient />;
}
