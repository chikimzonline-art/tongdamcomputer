import { db } from "@/lib/db";
import { hashPassword } from "@/lib/auth-crypto";

/**
 * Seed the database with an initial admin user and ALL default content.
 * Safe to run multiple times - it skips items that already exist.
 *
 * Covers: admin user, alert banner, all site content keys, courses,
 * restaurant menu, ventures, affiliations, milestones, core values,
 * stats, quick actions, and essential services.
 */
export async function seedDatabase() {
  // 1. Admin user
  const existingAdmin = await db.adminUser.findUnique({
    where: { email: "admin@tongdam.com" },
  });
  if (!existingAdmin) {
    await db.adminUser.create({
      data: {
        email: "admin@tongdam.com",
        name: "Tongdam Admin",
        passwordHash: hashPassword("tongdam123"),
        role: "ADMIN",
      },
    });
    console.log("✓ Seeded admin user: admin@tongdam.com / tongdam123");
  }

  // 2. Alert banner
  const bannerCount = await db.alertBanner.count();
  if (bannerCount === 0) {
    await db.alertBanner.create({
      data: {
        message:
          "Admissions open for 2024-25 batch at Tongdam Computer Training Center — Top 1 Institute under E-Max India nationwide.",
        isActive: true,
        link: "/education/computer-training",
      },
    });
    console.log("✓ Seeded alert banner");
  }

  // 3. Site content defaults — all categories
  const contentDefaults: { key: string; value: string; category: string }[] = [
    // ---- HOME (hero + section headings) ----
    {
      key: "hero.title",
      value: "Building Skills. Serving Communities.",
      category: "home",
    },
    {
      key: "hero.subtitle",
      value:
        "A growing family of institutes and service centers dedicated to digital empowerment, quality education, and essential citizen services — all under one trusted roof.",
      category: "home",
    },
    { key: "home.venturesLabel", value: "Our Ventures", category: "home" },
    { key: "home.venturesHeading", value: "A Family of Institutes & Services", category: "home" },
    { key: "home.venturesSubtitle", value: "From certified computer training to hotel management, tailoring, mobile repair, and essential citizen services — Tongdam Computers serves the community across multiple disciplines.", category: "home" },
    { key: "home.essentialLabel", value: "Computer Works", category: "home" },
    { key: "home.essentialHeading", value: "Essential |Citizen & Digital Services", category: "home" },
    { key: "home.essentialSubtitle", value: "Your trusted center for banking services, Aadhaar, PAN, voter ID, birth certificates, DTP & printing — all in one place.", category: "home" },
    { key: "home.quickActionsHeading", value: "What would you like to do today?", category: "home" },
    { key: "home.quickActionsSubtitle", value: "Pick a quick action and we will take you straight to the right desk.", category: "home" },
    { key: "home.storyHeading", value: "Built on a customer-first philosophy", category: "home" },
    { key: "home.ctaHeading", value: "Ready to get started? Visit us or call today.", category: "home" },
    { key: "home.ctaDescription", value: "Whether you want to enroll in a course, book a table, or apply for an Aadhaar / PAN — our team is here to help.", category: "home" },

    // ---- ABOUT ----
    { key: "about.founder", value: "Mr. P Soiminthang Zou", category: "about" },
    { key: "about.foundedYear", value: "2020", category: "about" },
    { key: "about.story", value: "Tongdam Computers began as a modest in-house initiative with a singular mission: to uplift the local community by providing robust digital access. Guided by a strict customer-first philosophy, the enterprise has rapidly scaled over the years. Today, Tongdam Computers stands as a multi-sector anchor in the town, delivering elite vocational training, essential public services, and lifestyle amenities.", category: "about" },
    { key: "about.heroTitle", value: "About Tongdam Computers", category: "about" },
    { key: "about.heroSubtitle", value: "A local initiative that became a multi-sector anchor.", category: "about" },
    { key: "about.storyP1", value: "Tongdam Computers was founded in the year 2020 by Mr. P Soiminthang Zou with a singular vision — to uplift the local community by providing proper digital access and quality skill-based education. What began as a small in-house venture has grown steadily over the years into a multi-faceted organization serving the community across several disciplines.", category: "about" },
    { key: "about.storyP2", value: "From its very first day, Tongdam Computers has embraced a customer-first approach. Helping the community is not just our mission — it is the very foundation upon which every decision is made. We believe that when you equip people with the right skills and bring essential digital and financial services to their doorstep, you transform not just individuals but entire neighborhoods.", category: "about" },
    { key: "about.storyP3", value: "Today, Tongdam Computers operates multiple institutes and service centers, each dedicated to a specific area of empowerment — from computer education and hotel management to tailoring, mobile repairing, and essential citizen services. Every venture under the Tongdam umbrella shares the same commitment: quality training, genuine service, and a deep sense of responsibility toward the community we serve.", category: "about" },
    { key: "about.tagline", value: "Serving the community with dedication since 2020.", category: "about" },
    { key: "about.founderQuote", value: "We started with a simple belief — that digital access and quality skills can transform lives. Today, that belief drives every venture under the Tongdam umbrella.", category: "about" },
    { key: "about.mission", value: "To uplift the local community by providing accessible digital services, quality skill-based training, and genuine customer-first support — ensuring that no one is left behind in the journey toward progress.", category: "about" },
    { key: "about.vision", value: "To be the most trusted and impactful community empowerment hub in the region, where every individual has the opportunity to learn, grow, and build a better livelihood through digital access and skill development.", category: "about" },
    { key: "about.founderImageUrl", value: "", category: "about" },
    { key: "about.timelineHeading", value: "Growth timeline", category: "about" },
    { key: "about.timelineSubtitle", value: "Five years, five milestones — each one adding more value to the community we serve.", category: "about" },
    { key: "about.valuesHeading", value: "Core values we live by", category: "about" },
    { key: "about.valuesSubtitle", value: "The non-negotiables that shape how we work, train, and serve.", category: "about" },
    { key: "about.ctaTitle", value: "Want to be part of our journey?", category: "about" },
    { key: "about.ctaDescription", value: "Whether you want to enroll in a course, apply for a public service, or simply visit our campus — we'd love to hear from you.", category: "about" },

    // ---- CONTACT ----
    { key: "contact.phone1", value: "+91 98765 43210", category: "contact" },
    { key: "contact.phone2", value: "+91 91234 56789", category: "contact" },
    { key: "contact.email", value: "info@tongdamcomputers.com", category: "contact" },
    { key: "contact.address", value: "Tongdam Computers, Main Market Road, Churachandpur, Manipur 795128, India", category: "contact" },
    { key: "contact.workingHours", value: "Mon – Sat · 9:00 AM – 6:00 PM", category: "contact" },
    { key: "contact.workingHoursHint", value: "Closed on Sundays & public holidays", category: "contact" },
    { key: "contact.mapEmbedUrl", value: "https://www.google.com/maps?q=Churachandpur,Manipur,India&output=embed", category: "contact" },
    { key: "contact.heroTitle", value: "Contact Us", category: "contact" },
    { key: "contact.heroSubtitle", value: "Visit our office, call, or send us a query — we are here to help.", category: "contact" },
    { key: "contact.infoHeading", value: "Get in touch", category: "contact" },
    { key: "contact.infoSubtitle", value: "Call, email, or simply walk in — our team is ready to assist with admissions, services, and queries.", category: "contact" },
    { key: "contact.mapHeading", value: "On the map", category: "contact" },
    { key: "contact.mapSubtitle", value: "We are located in the heart of Churachandpur, Manipur.", category: "contact" },

    // ---- EDUCATION ----
    { key: "training.emaxBadge", value: "Affiliated to E-Max India | Recognized by Govt. of India", category: "education" },
    { key: "training.topRank", value: "Top 1 Institute under E-Max India nationwide", category: "education" },
    { key: "hotel.placement", value: "Diploma in Hotel Management (1-Year Course) | 100% Placement Guarantee at 5-Star Hotels Pan-India.", category: "education" },

    // ---- ASSETS (logo + favicon — empty = use defaults) ----
    { key: "site.logoUrl", value: "", category: "assets" },
    { key: "site.faviconUrl", value: "", category: "assets" },
  ];

  for (const item of contentDefaults) {
    const exists = await db.siteContent.findUnique({ where: { key: item.key } });
    if (!exists) {
      await db.siteContent.create({ data: item });
    }
  }
  console.log(`✓ Seeded ${contentDefaults.length} site content keys`);

  // 4. Courses
  const courseCount = await db.course.count();
  if (courseCount === 0) {
    const courses = [
      { code: "DCA", title: "Diploma in Computer Applications", institute: "computer-training", description: "Foundational diploma covering MS Office, internet basics, typing, and computer fundamentals.", duration: "6 Months", fee: "₹4,500", syllabus: "Computer Fundamentals, Windows OS, MS Word, MS Excel, MS PowerPoint, Internet & Email, Typing Practice", sortOrder: 1 },
      { code: "ADCA", title: "Advanced Diploma in Computer Applications", institute: "computer-training", description: "Advanced diploma adding Tally, accounting software, and advanced office automation to the DCA syllabus.", duration: "12 Months", fee: "₹7,500", syllabus: "All DCA topics + Tally Prime, Accounting Basics, Internet Security, HTML Basics, Data Entry Projects", sortOrder: 2 },
      { code: "TALLY", title: "Tally Prime with GST", institute: "computer-training", description: "Industry-focused Tally Prime training covering accounting, inventory, taxation, and GST filing.", duration: "3 Months", fee: "₹3,500", syllabus: "Accounting Basics, Company Creation, Ledgers & Groups, Vouchers, Inventory, GST Setup, GST Returns, Reports", sortOrder: 3 },
      { code: "WEB", title: "Web Development Essentials", institute: "computer-training", description: "Hands-on training in HTML, CSS, JavaScript, and an introduction to modern frameworks.", duration: "4 Months", fee: "₹6,000", syllabus: "HTML5, CSS3, JavaScript, Responsive Design, Bootstrap, Intro to React, Project Deployment", sortOrder: 4 },
      { code: "TAILOR-BASIC", title: "Certificate in Tailoring & Fashion Design (Basic)", institute: "tailoring", description: "Beginner-friendly tailoring course covering hand stitching, machine operation, and basic garments.", duration: "3 Months", fee: "₹3,000", syllabus: "Introduction to Fabrics, Hand Stitches, Sewing Machine Operation, Measurements, Basic Blouse & Petticoat", sortOrder: 1 },
      { code: "TAILOR-ADV", title: "Diploma in Fashion Design & Tailoring (Advanced)", institute: "tailoring", description: "Advanced diploma covering pattern making, garment construction, embroidery, and boutique management.", duration: "9 Months", fee: "₹6,500", syllabus: "Pattern Making, Draping, Advanced Garment Construction, Embroidery, Fashion Illustration, Boutique Management", sortOrder: 2 },
      { code: "HM-DIPLOMA", title: "Diploma in Hotel Management (1-Year)", institute: "hotel-management", description: "Comprehensive 1-year diploma with 100% placement guarantee at 5-star hotels across India.", duration: "12 Months", fee: "₹25,000", syllabus: "Food Production, Bakery & Confectionery, Food & Beverage Service, Front Office, Housekeeping, Communication & Soft Skills, Industrial Training", sortOrder: 1 },
      { code: "MOBILE-REPAIR", title: "Mobile Hardware Repair & Servicing", institute: "mobile-hub", description: "Practical training in smartphone hardware diagnosis, chip-level repair, and servicing.", duration: "2 Months", fee: "₹4,000", syllabus: "Mobile Hardware Basics, Soldering & Desoldering, Chip-Level Repair, Software Flashing, Battery & Display Replacement", sortOrder: 1 },
    ];
    for (const c of courses) {
      await db.course.create({ data: c });
    }
    console.log(`✓ Seeded ${courses.length} courses`);
  }

  // 5. Restaurant menu
  const menuCount = await db.menuItem.count();
  if (menuCount === 0) {
    const menu = [
      // Appetizers
      { name: "Veg Spring Rolls", description: "Crispy rolls stuffed with seasoned vegetables", price: "₹120", category: "Appetizers", isVeg: true, sortOrder: 1 },
      { name: "Chicken 65", description: "Spicy deep-fried chicken bites, South Indian style", price: "₹180", category: "Appetizers", isVeg: false, sortOrder: 2 },
      { name: "Paneer Tikka", description: "Char-grilled marinated cottage cheese skewers", price: "₹160", category: "Appetizers", isVeg: true, sortOrder: 3 },
      { name: "Fish Fingers", description: "Crispy breaded fish strips with tartar dip", price: "₹220", category: "Appetizers", isVeg: false, sortOrder: 4 },
      // Mains
      { name: "Veg Thali", description: "Assorted seasonal curries, rice, roti, salad & dessert", price: "₹150", category: "Mains", isVeg: true, sortOrder: 1 },
      { name: "Chicken Curry", description: "Slow-cooked chicken in aromatic homestyle gravy", price: "₹220", category: "Mains", isVeg: false, sortOrder: 2 },
      { name: "Paneer Butter Masala", description: "Creamy tomato gravy with cottage cheese cubes", price: "₹180", category: "Mains", isVeg: true, sortOrder: 3 },
      { name: "Fish Curry", description: "Fresh catch simmered in tangy tamarind gravy", price: "₹260", category: "Mains", isVeg: false, sortOrder: 4 },
      { name: "Veg Fried Rice", description: "Wok-tossed rice with crunchy vegetables & soy", price: "₹130", category: "Mains", isVeg: true, sortOrder: 5 },
      { name: "Chilli Chicken", description: "Indo-Chinese style chicken in spicy soy glaze", price: "₹210", category: "Mains", isVeg: false, sortOrder: 6 },
      // Drinks
      { name: "Masala Chai", description: "Spiced Indian tea brewed with milk", price: "₹30", category: "Drinks", isVeg: true, sortOrder: 1 },
      { name: "Fresh Lime Soda", description: "Sweet & salt lime soda, choice of still or sparkling", price: "₹60", category: "Drinks", isVeg: true, sortOrder: 2 },
      { name: "Mango Lassi", description: "Thick yogurt smoothie blended with ripe mango", price: "₹80", category: "Drinks", isVeg: true, sortOrder: 3 },
      { name: "Cold Coffee", description: "Chilled coffee blended with milk & ice cream", price: "₹90", category: "Drinks", isVeg: true, sortOrder: 4 },
    ];
    for (const m of menu) {
      await db.menuItem.create({ data: m });
    }
    console.log(`✓ Seeded ${menu.length} menu items`);
  }

  // 6. Ventures (Our Ventures cards on the home page)
  const ventureCount = await db.venture.count();
  if (ventureCount === 0) {
    const ventures = [
      { title: "Computer Works", description: "Your trusted center for banking services, Aadhaar, PAN, voter ID, birth certificates, DTP & printing — all in one place.", href: "/services/computer-works", icon: "Computer", badge: "Authorized CSP • UCO Bank", features: JSON.stringify(["UCO Bank CSP (Authorized)", "Aadhaar Enrolment & Updates", "PAN Card Services"]), accent: "emerald", sortOrder: 1 },
      { title: "Tongdam Computer Training Center", description: "Top 1 Institute under E-Max India all over India — providing certified computer education with placement support.", href: "/education/computer-training", icon: "GraduationCap", badge: "Top 1 in India • E-Max India", features: JSON.stringify(["Govt. Recognized Certifications", "Top 1 Ranked Institute", "Experienced Faculty"]), accent: "emerald", sortOrder: 2 },
      { title: "Tongdam Tailoring Training Center", description: "Professional tailoring training programs designed to empower individuals with a lifelong, income-generating skill.", href: "/education/tailoring", icon: "Scissors", badge: "Skill Development Program", features: JSON.stringify(["Basic to Advanced Tailoring", "Pattern Making & Design", "Professional Machine Training"]), accent: "pink", sortOrder: 3 },
      { title: "Tongdam Institute of Hotel Management", description: "One-year diploma program with guaranteed 100% placement across 5-star hotels all over India.", href: "/education/hotel-management", icon: "Hotel", badge: "100% Placement • 5-Star Hotels", features: JSON.stringify(["1-Year Diploma Program", "Front Office Training", "Housekeeping & F&B Service"]), accent: "amber", sortOrder: 4 },
      { title: "Tongdam Restaurant", description: "A warm, welcoming dining destination serving delicious local and multi-cuisine dishes made with fresh ingredients.", href: "/lifestyle/restaurant", icon: "Utensils", badge: "Fresh • Local • Welcoming", features: JSON.stringify(["Local & Multi-Cuisine Menu", "Fresh Ingredients Daily", "Family-Friendly Atmosphere"]), accent: "amber", sortOrder: 5 },
      { title: "Tongdam Mobile Repairing Center", description: "A service center cum training institute for mobile phone repair — learn a high-demand skill or get your device fixed.", href: "/services/mobile-hub", icon: "Wrench", badge: "Repair + Training Center", features: JSON.stringify(["All-Brand Mobile Repair", "Chip-Level Repair Training", "Genuine Parts Used"]), accent: "violet", sortOrder: 6 },
    ];
    for (const v of ventures) {
      await db.venture.create({ data: v });
    }
    console.log(`✓ Seeded ${ventures.length} ventures`);
  }

  // 7. Affiliations (carousel on the home page)
  const affiliationCount = await db.affiliation.count();
  if (affiliationCount === 0) {
    const affiliations = [
      { name: "E-Max India", category: "Education Affiliation", description: "Govt. of India recognized vocational education body — Tongdam is the Top 1 ranked institute nationwide.", icon: "BadgeCheck", accent: "emerald", sortOrder: 1 },
      { name: "Govt. of India", category: "Government Recognition", description: "All E-Max certifications issued at Tongdam are recognized by the Government of India and valid nationwide.", icon: "Landmark", accent: "emerald", sortOrder: 2 },
      { name: "UCO Bank CSP", category: "Banking Partner", description: "Authorized Customer Service Point for UCO Bank — delivering banking services to the local community.", icon: "Building2", accent: "violet", sortOrder: 3 },
      { name: "5-Star Hotel Network", category: "Hotel Management Placement", description: "Pan-India placement network across leading 5-star hotels — 100% placement guarantee for HM diploma graduates.", icon: "Hotel", accent: "amber", sortOrder: 4 },
      { name: "Hospitality Partners", category: "Industry Collaboration", description: "Resort chains, cruise lines, and fine-dining restaurants actively recruit from our Hotel Management batches.", icon: "UtensilsCrossed", accent: "rose", sortOrder: 5 },
      { name: "Taj Group", category: "Premier Placement Partner", description: "Our graduates have been placed at Taj properties across India — a testament to our training quality.", icon: "Star", accent: "amber", sortOrder: 6 },
      { name: "ITC Hotels", category: "Premier Placement Partner", description: "ITC Hotels welcomes our trained hotel management students into front office, F&B, and housekeeping roles.", icon: "Building2", accent: "emerald", sortOrder: 7 },
      { name: "Oberoi Group", category: "Premier Placement Partner", description: "The Oberoi Group partners with us to hire skilled hospitality professionals from our diploma program.", icon: "Briefcase", accent: "violet", sortOrder: 8 },
    ];
    for (const a of affiliations) {
      await db.affiliation.create({ data: a });
    }
    console.log(`✓ Seeded ${affiliations.length} affiliations`);
  }

  // 8. Milestones (growth timeline — shared by home + about pages)
  const milestoneCount = await db.milestone.count();
  if (milestoneCount === 0) {
    const milestones = [
      { year: "2020", title: "Founded", detail: "Founded by Mr. P Soiminthang Zou as an in-house digital-access initiative in Churachandpur, Manipur.", sortOrder: 1 },
      { year: "2021", title: "Public Services Launch", detail: "Expanded into CSP (UCO Bank) and Aadhaar public services to serve the local community.", sortOrder: 2 },
      { year: "2022", title: "Tongdam Computer Training Center", detail: "Launched the Tongdam Computer Training Center, affiliated to E-Max India.", sortOrder: 3 },
      { year: "2023", title: "Vocational Expansion", detail: "Added the Tailoring Training Center and Hotel Management Institute to the campus.", sortOrder: 4 },
      { year: "2024", title: "Multi-Department Hub", detail: "Now a multi-department hub — Restaurant, Mobile Hub, and 6 departments serving the community.", sortOrder: 5 },
    ];
    for (const m of milestones) {
      await db.milestone.create({ data: m });
    }
    console.log(`✓ Seeded ${milestones.length} milestones`);
  }

  // 9. Core values (about page)
  const valueCount = await db.coreValue.count();
  if (valueCount === 0) {
    const values = [
      { title: "Customer-First Philosophy", description: "Every decision starts with what serves our community best — not what is easiest for us.", icon: "HandHeart", sortOrder: 1 },
      { title: "Integrity & Trust", description: "Transparent pricing, honest advice, and dependable services that locals can rely on.", icon: "ShieldCheck", sortOrder: 2 },
      { title: "Community Upliftment", description: "We exist to lift Churachandpur — through skills, services, and steady employment.", icon: "Sprout", sortOrder: 3 },
      { title: "Excellence in Training", description: "Top 1 E-Max institute nationwide. Our students don't just enrol — they graduate job-ready.", icon: "Award", sortOrder: 4 },
    ];
    for (const v of values) {
      await db.coreValue.create({ data: v });
    }
    console.log(`✓ Seeded ${values.length} core values`);
  }

  // 10. Stats (home page stats bar)
  const statCount = await db.stat.count();
  if (statCount === 0) {
    const stats = [
      { label: "Business Ventures", value: "6+", icon: "Briefcase", sortOrder: 1 },
      { label: "Students Trained", value: "1000+", icon: "Users", sortOrder: 2 },
      { label: "Courses Offered", value: "17+", icon: "BookOpen", sortOrder: 3 },
      { label: "Rank in India (E-Max)", value: "Top 1", icon: "Trophy", sortOrder: 4 },
    ];
    for (const s of stats) {
      await db.stat.create({ data: s });
    }
    console.log(`✓ Seeded ${stats.length} stats`);
  }

  // 11. Quick actions (home page)
  const qaCount = await db.quickAction.count();
  if (qaCount === 0) {
    const actions = [
      { title: "Book a Table", description: "Reserve your spot at our multi-cuisine restaurant for lunch or dinner.", href: "/lifestyle/restaurant", cta: "View menu & book", icon: "CalendarCheck", sortOrder: 1 },
      { title: "Enroll in a Course", description: "Admissions open for DCA, ADCA, Tally, Web Dev, Tailoring & Hotel Management.", href: "/education/computer-training", cta: "Explore courses", icon: "BookOpen", sortOrder: 2 },
      { title: "Apply for Aadhaar / PAN", description: "Walk-in Aadhaar enrolment, PAN card application and CSP banking services.", href: "/services/computer-works", cta: "Service details", icon: "IdCard", sortOrder: 3 },
    ];
    for (const a of actions) {
      await db.quickAction.create({ data: a });
    }
    console.log(`✓ Seeded ${actions.length} quick actions`);
  }

  // 12. Essential services (home page)
  const esCount = await db.essentialService.count();
  if (esCount === 0) {
    const services = [
      { title: "CSP UCO Bank Services", description: "As an authorized Customer Service Point (CSP) for UCO Bank, we bring essential banking services closer to your doorstep.", icon: "Landmark", services: JSON.stringify(["Account Opening (Savings/Current)", "Cash Deposit & Withdrawal", "Money Transfer (NEFT/RTGS/IMPS)", "Social Security Schemes (PMJJBY, PMSBY, APY)"]), extraCount: 2, accent: "emerald", sortOrder: 1 },
      { title: "Aadhaar Services", description: "Comprehensive Aadhaar related services to ensure your identification documents are always up to date.", icon: "Fingerprint", services: JSON.stringify(["PVC Card Printing (Smart Card)", "Biometric Updates (Photo, Fingerprint, Iris)", "Demographic Updates (Name, Address, DOB)", "New Enrolment Assistance"]), extraCount: 2, accent: "amber", sortOrder: 2 },
      { title: "DTP & Printing Works", description: "Professional desktop publishing and high-quality printing services for all your personal and business needs.", icon: "Printer", services: JSON.stringify(["Resume / CV Creation", "English, Hindi & Local Language Typing", "High Speed Xerox (B&W / Color)", "Passport Size Photos (Urgent)"]), extraCount: 2, accent: "pink", sortOrder: 3 },
      { title: "PAN Card Services", description: "Hassle-free PAN card services for individuals and businesses with quick processing and support.", icon: "FileText", services: JSON.stringify(["New PAN Card Application", "Correction in Existing PAN", "Lost PAN Card Recovery", "Link PAN with Aadhaar"]), extraCount: 2, accent: "violet", sortOrder: 4 },
      { title: "Voter Card Services", description: "Get your Voter ID card updated or apply for a new one with our complete assistance.", icon: "IdCard", services: JSON.stringify(["New Voter Registration", "Correction of Name/Address", "Constituency Transposition", "Digital Voter ID Download"]), extraCount: 2, accent: "emerald", sortOrder: 5 },
      { title: "Birth Certificate", description: "Assistance with Birth Certificate applications and corrections with complete documentation support.", icon: "FileCheck", services: JSON.stringify(["New Birth Certificate Application", "Delayed Registration Assistance", "Corrections and Updates", "Death Certificate Services"]), extraCount: 2, accent: "amber", sortOrder: 6 },
    ];
    for (const s of services) {
      await db.essentialService.create({ data: s });
    }
    console.log(`✓ Seeded ${services.length} essential services`);
  }

  console.log("Seed complete.");
}

// Allow direct execution
if (require.main === module) {
  seedDatabase()
    .catch((e) => {
      console.error(e);
      process.exit(1);
    })
    .finally(async () => {
      await db.$disconnect();
    });
}
