-- =============================================================================
-- 0013 — Seed: AI agent defaults and knowledge
-- -----------------------------------------------------------------------------
-- 1. The settings row: greeting, suggested questions and the solar
--    calculator's starting values. REVIEW THESE in /admin/ai-agent/calculator —
--    especially the panel wattage/size GES installs most, the tariffs, and
--    (if you want the agent to quote them) price ranges. Prices are OFF until
--    you switch them on.
-- 2. Knowledge entries with company facts the website's code doesn't already
--    provide. The agent ALSO reads, automatically and always up to date: the
--    solutions, products, maintenance services and FAQ pages, the published
--    projects list and the latest blog articles — no need to copy those here.
--
-- Requires: 0012_ai_agent.sql. Safe to re-run: existing rows are left as they
-- are (knowledge entries are matched by title).
-- =============================================================================


-- -----------------------------------------------------------------------------
-- Settings
-- -----------------------------------------------------------------------------

insert into public.ai_agent_settings (
  id, is_enabled, agent_name, greeting, suggested_questions, instructions,
  panel_watt, panel_length_m, panel_width_m, usable_roof_ratio, monthly_yield_per_kwp,
  tariff_blocks, avg_tariff_domestic, avg_tariff_commercial, export_rate,
  dc_ac_ratio, inverter_sizes_kw, battery_unit_kwh, battery_dod, co2_kg_per_kwh,
  show_prices, pricing
) values (
  1,
  true,
  'GES Solar Assistant',
  'Hi! I''m the GES Solar Assistant. Ask me anything about solar for your home or business — or tell me your roof size or your monthly electricity units and I''ll estimate the system you''d need.',
  array[
    'How many panels fit on a 1,200 sq ft roof?',
    'My bill is about Rs 15,000 a month — what system do I need?',
    'On-grid or hybrid: which is right for me?',
    'How does CEB net metering work?'
  ],
  'Be warm, clear and concise — two to four short sentences unless the visitor asks for detail. Always offer a site assessment with the GES team as the next step. Never criticise competitors.',
  590, 2.278, 1.134, 0.700, 120,
  '[]'::jsonb, 45, 48, null,
  1.10, '{3,5,6,8,10,12,15,20,25,30,40,50}', 5.12, 0.900, 0.700,
  false,
  '{}'::jsonb
)
on conflict (id) do nothing;


-- -----------------------------------------------------------------------------
-- Knowledge base
-- -----------------------------------------------------------------------------

insert into public.ai_knowledge (title, category, content, position)
select v.title, v.category, v.content, v.position
from (values
  (
    'Company profile',
    'Company',
    $k$Green Engineering Systems (Pvt) Ltd — known as GES — is a Sri Lankan renewable-energy engineering company based in Kelaniya. For more than a decade GES has designed, supplied, installed and maintained solar power systems for homes, businesses, institutions and industry, with more than 1,200 installations completed.

GES handles the whole project end to end: feasibility study and site assessment, system design, supply of equipment, installation, the CEB or LECO grid-connection application, commissioning, monitoring and ongoing maintenance.

Taglines used by the company: "Powering a sustainable future, engineered to last." and "Global expertise, local excellence."$k$,
    10
  ),
  (
    'Contact details and opening hours',
    'Contact',
    $k$Office: No 12, Thorana Junction, Kandy Rd, Kelaniya 11600, Sri Lanka.
Registered office: B/255, Wedamulla Lane, Waragoda, Kelaniya 11600.
Phone: 076 533 2332 (+94 76 533 2332) — also on WhatsApp: https://wa.me/94765332332
Email: info@ges.lk
Opening hours: Monday to Friday 8:30 AM – 5:00 PM, Saturday 8:30 AM – 1:30 PM, closed on Sundays.
Contact page with a message form: /contact$k$,
    20
  ),
  (
    'Certifications and awards',
    'Company',
    $k$GES is registered with the Sri Lanka Sustainable Energy Authority (SLSEA) and certified to ISO 9001:2015 for quality management.

Awards from the Institution of Engineers, Sri Lanka (IESL):
- 2025 Silver Award — Best Display of Engineering Services (techno Sri Lanka 2025)
- 2023 Bronze Award — Best Display & Demonstration of Engineering Products (techno Sri Lanka 2023)
- 2015 Bronze Award — Best Display of Imported Product (National Engineering and Technology Exhibition 2015)$k$,
    30
  ),
  (
    'Mission, vision and values',
    'Company',
    $k$Mission: by providing unparalleled value, accelerate the adoption of solar energy — giving customers, communities and the nation clean, abundant, cost-effective, distributed and renewable energy.
Vision: to provide affordable energy solutions to communities across the country, working alongside stakeholders to uplift the future of sustainable energy.
Values: sustainable business practices, disciplined entrepreneurship, a customer-centric approach, business efficiency, value for money and accountability.$k$,
    40
  ),
  (
    'Warranties',
    'Products',
    $k$Typical warranty coverage on GES installations: a 25-year linear performance warranty on solar PV modules, a 5- to 10-year warranty on grid-tied or hybrid inverters, and up to a 10-year warranty on lithium (LFP) battery cells. Exact terms vary by product — the quote states the warranty for each component. All products are supplied with genuine manufacturer warranties.$k$,
    50
  ),
  (
    'How a GES installation works',
    'Process',
    $k$1. Home / site assessment — a virtual or in-person evaluation of the roof and electricity use, followed by a customised design and savings analysis.
2. Personalised quote — full specifications and pricing; flexible financing options are explained at this stage; permits and paperwork are handled by GES.
3. Expert installation — certified technicians; a standard residential installation takes about 2 to 3 days on site, followed by a quality inspection.
4. System activation — utility connection and testing, plus monitoring set-up.

Grid approvals (feasibility study, agreement and the bi-directional meter from the CEB or LECO) typically take 3 to 6 weeks, and GES manages that whole workflow for the customer.$k$,
    60
  ),
  (
    'Selling solar power to the grid (Net Metering, Net Accounting, Net Plus)',
    'Grid connection',
    $k$Sri Lanka's CEB and LECO offer three connection schemes for rooftop solar:
- Net Metering — units you export offset the units you import; unused credit carries forward. You are not paid in cash; the benefit is a lower bill. Best when yearly generation is close to yearly usage.
- Net Accounting — import and export are measured separately: you pay the normal tariff for what you use and are paid a set rate for what you export. Best for sites that regularly generate more than they use.
- Net Plus — the whole output of the system is sold to the utility at an agreed rate, while consumption is billed separately. For owners treating the roof purely as an income-earning asset.

Export rates and eligibility are set by the utility and the regulator (PUCSL) and are revised from time to time. Do NOT quote a per-unit export rate unless the calculator settings provide one; say the team confirms the current terms, and that GES handles the CEB or LECO application as part of every installation.$k$,
    70
  ),
  (
    'Maintenance and repair services',
    'Services',
    $k$GES provides service and maintenance islandwide — for systems GES installed and for other companies' installations — covering solar power systems and generators.

The solar "11-point check" covers: grid voltage and current; panel damage and cleanliness; inverter status and error logs; AC/DC wiring; AC/DC breakers; AC/DC surge protection; roof shading; earthing; MC4 connectors; all other components; and historical production data.
Generator servicing covers engine oil replacement, air-filter and spark-plug cleaning, and wiring and output-voltage inspection.

Panels should be cleaned every 3 to 6 months (soft washing with low-TDS water, early morning or late afternoon, no harsh chemicals). Service requests can be made on the Maintenance page (/services) or by phone.$k$,
    80
  ),
  (
    'Buying products',
    'Products',
    $k$Besides complete installations, GES products (SAJ inverters, Haitai Solar panels, Solen cables, switchgear, enclosures and aluminium mounting accessories) are available for direct retail purchase at competitive prices, with genuine warranties. For product prices or stock, the team will confirm — take the customer's details or point them to /contact.$k$,
    90
  ),
  (
    'Pricing and quotes',
    'Sales',
    $k$System prices depend on the roof, the equipment chosen, the system type (on-grid, hybrid or off-grid) and any battery storage, so GES gives an exact price after a site assessment. Only mention a price range when the estimate tool returns one. Typical simple payback for solar in Sri Lanka is around 2.5 to 4 years, and most owners cut their electricity bill by 70% to 100%, depending on usage and system size.$k$,
    100
  ),
  (
    'Service area and solutions',
    'Company',
    $k$GES works islandwide across Sri Lanka, for homes, businesses, institutions and industry. Besides solar (on-grid, hybrid, off-grid and battery energy storage), GES also offers micro turbine generators (MTG), hydrogen fuel cells (SFC), composting machines for organic waste and Moreday EV chargers for homes, businesses and public charging.$k$,
    110
  ),
  (
    'Careers',
    'Company',
    $k$GES hires across engineering and design, installation and technical work, sales and business development, project management, service and maintenance, and operations (procurement, finance, HR). There are no specific openings listed online; candidates can email a CV to info@ges.lk with the subject "Career Application — GES". More on /careers.$k$,
    120
  )
) as v(title, category, content, position)
where not exists (select 1 from public.ai_knowledge k where k.title = v.title);
