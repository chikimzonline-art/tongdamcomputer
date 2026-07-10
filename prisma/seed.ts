import { db } from "@/lib/db";
import { hashPassword } from "@/lib/auth-crypto";

/**
 * Seed the database with an initial admin user and default CMS content.
 * Safe to run multiple times - it skips items that already exist.
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

  // 3. Site content defaults
  const contentDefaults: { key: string; value: string; category: string }[] = [
    {
      key: "hero.title",
      value: "From a Local Startup to a Multi-Department Hub",
      category: "home",
    },
    {
      key: "hero.subtitle",
      value:
        "Founded in 2020 by Mr. P Soiminthang Zou, Tongdam Computers delivers elite vocational training, essential public services, and lifestyle amenities — all under one trusted roof.",
      category: "home",
    },
    {
      key: "about.founder",
      value: "Mr. P Soiminthang Zou",
      category: "about",
    },
    {
      key: "about.foundedYear",
      value: "2020",
      category: "about",
    },
    {
      key: "about.story",
      value:
        "Tongdam Computers began as a modest in-house initiative with a singular mission: to uplift the local community by providing robust digital access. Guided by a strict customer-first philosophy, the enterprise has rapidly scaled over the years. Today, Tongdam Computers stands as a multi-sector anchor in the town, delivering elite vocational training, essential public services, and lifestyle amenities.",
      category: "about",
    },
    {
      key: "contact.phone1",
      value: "+91 98765 43210",
      category: "contact",
    },
    {
      key: "contact.phone2",
      value: "+91 91234 56789",
      category: "contact",
    },
    {
      key: "contact.email",
      value: "info@tongdamcomputers.com",
      category: "contact",
    },
    {
      key: "contact.address",
      value:
        "Tongdam Computers, Main Market Road, Churachandpur, Manipur 795128, India",
      category: "contact",
    },
    {
      key: "training.emaxBadge",
      value: "Affiliated to E-Max India | Recognized by Govt. of India",
      category: "education",
    },
    {
      key: "training.topRank",
      value: "Top 1 Institute under E-Max India nationwide",
      category: "education",
    },
    {
      key: "hotel.placement",
      value:
        "Diploma in Hotel Management (1-Year Course) | 100% Placement Guarantee at 5-Star Hotels Pan-India.",
      category: "education",
    },
  ];
  for (const item of contentDefaults) {
    const exists = await db.siteContent.findUnique({ where: { key: item.key } });
    if (!exists) {
      await db.siteContent.create({ data: item });
    }
  }
  console.log("✓ Seeded site content");

  // 4. Courses
  const courseCount = await db.course.count();
  if (courseCount === 0) {
    const courses = [
      {
        code: "DCA",
        title: "Diploma in Computer Applications",
        institute: "computer-training",
        description:
          "Foundational diploma covering MS Office, internet basics, typing, and computer fundamentals.",
        duration: "6 Months",
        fee: "₹4,500",
        syllabus:
          "Computer Fundamentals, Windows OS, MS Word, MS Excel, MS PowerPoint, Internet & Email, Typing Practice",
        sortOrder: 1,
      },
      {
        code: "ADCA",
        title: "Advanced Diploma in Computer Applications",
        institute: "computer-training",
        description:
          "Advanced diploma adding Tally, accounting software, and advanced office automation to the DCA syllabus.",
        duration: "12 Months",
        fee: "₹7,500",
        syllabus:
          "All DCA topics + Tally Prime, Accounting Basics, Internet Security, HTML Basics, Data Entry Projects",
        sortOrder: 2,
      },
      {
        code: "TALLY",
        title: "Tally Prime with GST",
        institute: "computer-training",
        description:
          "Industry-focused Tally Prime training covering accounting, inventory, taxation, and GST filing.",
        duration: "3 Months",
        fee: "₹3,500",
        syllabus:
          "Accounting Basics, Company Creation, Ledgers & Groups, Vouchers, Inventory, GST Setup, GST Returns, Reports",
        sortOrder: 3,
      },
      {
        code: "WEB",
        title: "Web Development Essentials",
        institute: "computer-training",
        description:
          "Hands-on training in HTML, CSS, JavaScript, and an introduction to modern frameworks.",
        duration: "4 Months",
        fee: "₹6,000",
        syllabus:
          "HTML5, CSS3, JavaScript, Responsive Design, Bootstrap, Intro to React, Project Deployment",
        sortOrder: 4,
      },
      {
        code: "TAILOR-BASIC",
        title: "Certificate in Tailoring & Fashion Design (Basic)",
        institute: "tailoring",
        description:
          "Beginner-friendly tailoring course covering hand stitching, machine operation, and basic garments.",
        duration: "3 Months",
        fee: "₹3,000",
        syllabus:
          "Introduction to Fabrics, Hand Stitches, Sewing Machine Operation, Measurements, Basic Blouse & Petticoat",
        sortOrder: 1,
      },
      {
        code: "TAILOR-ADV",
        title: "Diploma in Fashion Design & Tailoring (Advanced)",
        institute: "tailoring",
        description:
          "Advanced diploma covering pattern making, garment construction, embroidery, and boutique management.",
        duration: "9 Months",
        fee: "₹6,500",
        syllabus:
          "Pattern Making, Draping, Advanced Garment Construction, Embroidery, Fashion Illustration, Boutique Management",
        sortOrder: 2,
      },
      {
        code: "HM-DIPLOMA",
        title: "Diploma in Hotel Management (1-Year)",
        institute: "hotel-management",
        description:
          "Comprehensive 1-year diploma with 100% placement guarantee at 5-star hotels across India.",
        duration: "12 Months",
        fee: "₹25,000",
        syllabus:
          "Food Production, Bakery & Confectionery, Food & Beverage Service, Front Office, Housekeeping, Communication & Soft Skills, Industrial Training",
        sortOrder: 1,
      },
      {
        code: "MOBILE-REPAIR",
        title: "Mobile Hardware Repair & Servicing",
        institute: "mobile-hub",
        description:
          "Practical training in smartphone hardware diagnosis, chip-level repair, and servicing.",
        duration: "2 Months",
        fee: "₹4,000",
        syllabus:
          "Mobile Hardware Basics, Soldering & Desoldering, Chip-Level Repair, Software Flashing, Battery & Display Replacement",
        sortOrder: 1,
      },
    ];
    for (const c of courses) {
      await db.course.create({ data: c });
    }
    console.log("✓ Seeded courses");
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
    console.log("✓ Seeded restaurant menu");
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
