import Link from "next/link";
import Image from "next/image";

/**
 * SiteFooter — shared dark-forest footer + copyright bar used across all
 * routed GES pages. Matches the homepage footer styling exactly.
 */
export default function SiteFooter() {
  return (
    <>
      <footer
        className="w-full text-white pt-[240px] sm:pt-[310px] md:pt-[400px] lg:pt-[470px] xl:pt-[510px] pb-10 px-6 sm:px-12 md:px-16 lg:px-24 border-t border-white/5 relative z-10 font-sans"
        style={{
          backgroundImage: 'url("/footer-1.webp")',
          backgroundSize: '100% auto',
          backgroundPosition: 'center -35%',
          backgroundRepeat: 'no-repeat',
          backgroundColor: '#012716'
        }}
      >
        <div className="max-w-[1360px] mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8">

            {/* Column 1: Brand details & Newsletter Subscription */}
            <div className="lg:col-span-5 flex flex-col items-start">
              <div className="mb-6 flex items-center">
                <Image
                  src="/logo.webp"
                  alt="GES Logo"
                  width={150}
                  height={42}
                  className="h-9 w-auto object-contain brightness-0 invert"
                />
              </div>
              <p className="text-white/70 font-medium text-sm leading-relaxed max-w-sm">
                We are a renewable energy engineering company with a mission to empower communities through reliable, clean solar power.
              </p>

              {/* Premium email subscription input */}
              <div className="mt-8 flex items-center justify-between bg-transparent border border-white/20 rounded-2xl p-1.5 w-full max-w-md focus-within:border-white/50 transition-all duration-300">
                <input
                  type="email"
                  placeholder="Email Address"
                  className="bg-transparent pl-3 pr-2 py-2.5 text-sm text-white placeholder-white/40 focus:outline-none w-full font-semibold"
                />
                <button className="bg-[#e2ff3a] text-[#012716] hover:bg-[#e2ff3a]/90 transition-all duration-300 px-6 py-3 rounded-xl text-xs font-bold uppercase tracking-widest cursor-pointer shrink-0 shadow-sm active:scale-[0.98]">
                  Subscribe
                </button>
              </div>
            </div>

            {/* Column 2: Navigation Links */}
            <div className="lg:col-span-2 lg:col-start-7 flex flex-col">
              <h4 className="font-bold uppercase tracking-widest text-xs mb-6 text-white/50">
                Links
              </h4>
              <ul className="flex flex-col gap-3 font-bold text-sm">
                <li><Link href="/" className="hover:text-[#e2ff3a] text-left transition-colors cursor-pointer">Home</Link></li>
                <li><Link href="/about" className="hover:text-[#e2ff3a] text-left transition-colors cursor-pointer">About Us</Link></li>
                <li><Link href="/solutions" className="hover:text-[#e2ff3a] text-left transition-colors cursor-pointer">Solutions</Link></li>
                <li><Link href="/projects" className="hover:text-[#e2ff3a] text-left transition-colors cursor-pointer">Projects</Link></li>
                <li><Link href="/services" className="hover:text-[#e2ff3a] text-left transition-colors cursor-pointer">Maintenance</Link></li>
                <li><Link href="/products" className="hover:text-[#e2ff3a] text-left transition-colors cursor-pointer">Products</Link></li>
              </ul>
            </div>

            {/* Column 3: Legal/Policies */}
            <div className="lg:col-span-2 flex flex-col">
              <h4 className="font-bold uppercase tracking-widest text-xs mb-6 text-white/50">
                Legal
              </h4>
              <ul className="flex flex-col gap-3 font-bold text-sm">
                <li><a href="#" className="hover:text-[#e2ff3a] transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-[#e2ff3a] transition-colors">Terms & Conditions</a></li>
                <li><a href="#" className="hover:text-[#e2ff3a] transition-colors">Engineering Standards</a></li>
                <li><a href="#" className="hover:text-[#e2ff3a] transition-colors">License Details</a></li>
              </ul>
            </div>

            {/* Column 4: Contact Us Info */}
            <div className="lg:col-span-2 flex flex-col">
              <h4 className="font-bold uppercase tracking-widest text-xs mb-6 text-white/50">
                Contact Us
              </h4>
              <ul className="flex flex-col gap-4 font-bold text-sm text-white/80">
                <li className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-[#e2ff3a] shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span className="leading-relaxed font-semibold">No. 12, Thorana Junction, Kandy Road, Kelaniya 11600, Sri Lanka</span>
                </li>
                <li className="flex items-center gap-3">
                  <svg className="w-5 h-5 text-[#e2ff3a] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <a href="mailto:info@ges.lk" className="hover:text-[#e2ff3a] transition-colors">info@ges.lk</a>
                </li>
                <li className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-[#e2ff3a] shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.94.725l.548 2.2a1 1 0 01-.321.988l-1.305.98a10.582 10.582 0 004.872 4.872l.98-1.305a1 1 0 01.988-.321l2.2.548a1 1 0 01.725.94V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  <div className="flex flex-col">
                    <a href="tel:+94765332332" className="hover:text-[#e2ff3a] transition-colors font-bold">+94 76 533 2332</a>
                    <a href="tel:0765332332" className="hover:text-[#e2ff3a] transition-colors text-xs text-white/50 font-semibold">076 533 2332</a>
                  </div>
                </li>
              </ul>
            </div>

          </div>
        </div>
      </footer>

      {/* COPYRIGHT SECTION: Deep Forest Green Bottom Bar with No Separator */}
      <div className="w-full bg-[#012716] text-white/60 py-8 px-6 sm:px-12 md:px-16 lg:px-24 relative z-10 font-sans">
        <div className="max-w-[1360px] mx-auto grid grid-cols-1 md:grid-cols-3 items-center gap-6 text-center md:text-left">

          {/* Left: Copyright */}
          <div className="text-xs font-bold text-white/50 justify-self-center md:justify-self-start">
            © {new Date().getFullYear()} GES (PVT) LTD. All rights reserved.
          </div>

          {/* Center: Built and Designed by ARC AI */}
          <div className="text-white/80 flex items-center justify-center gap-2 text-xs font-bold justify-self-center">
            <span>Built and Designed by</span>
            <a
              href="https://www.arcai.agency"
              target="_blank"
              rel="noopener"
              className="inline-flex items-center transition-all duration-300 hover:scale-105"
              title="ARC AI - AI Automation and Software Company"
            >
              <Image
                src="/arc-logo.webp"
                alt="ARC AI | AI Automation & Software Company"
                width={110}
                height={32}
                className="h-7.5 w-auto object-contain translate-y-[2px]"
              />
            </a>
          </div>

          {/* Right: Social Links */}
          <div className="flex items-center justify-center md:justify-end gap-5 text-white/70 justify-self-center md:justify-self-end">
            <a href="#" className="hover:text-[#e2ff3a] transition-colors">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z" />
              </svg>
            </a>
            <a href="#" className="hover:text-[#e2ff3a] transition-colors">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
            </a>
            <a href="#" className="hover:text-[#e2ff3a] transition-colors">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
              </svg>
            </a>
            <a href="#" className="hover:text-[#e2ff3a] transition-colors">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0 3.259-.014 3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
              </svg>
            </a>
          </div>
        </div>
      </div>

      {/* Fixed Glassmorphism Blur Bar — bottom of viewport, persistent */}
      <div
        className="fixed bottom-0 left-0 right-0 z-[9999] pointer-events-none select-none"
        style={{ height: '60px' }}
      >
        <div
          className="w-full h-full"
          style={{
            backdropFilter: 'blur(10px)',
            WebkitBackdropFilter: 'blur(10px)',
            maskImage: 'linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.95) 100%)',
            WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.95) 100%)',
          }}
        />
      </div>
    </>
  );
}
