/**
 * Idempotent database seed.
 *
 * Run with: `npm run db:seed` (after `npm run db:migrate`).
 *
 * Seeds the 11 societies/affinity groups, the current student-branch cabinet,
 * and the one society with real member data (Computational Intelligence).
 * Optionally ETLs events + articles from a legacy Supabase project when
 * `LEGACY_SUPABASE_DB_URL` is set.
 *
 * Sample events/articles/announcements are NOT seeded by default. They are
 * fabricated demo data; set `SEED_DEMO_CONTENT=1` to include them, which only
 * works against a database on localhost.
 *
 * Re-running is safe: societies upsert on `slug`; member/team seeds are guarded
 * by existence checks so admin-entered data is never duplicated or wiped.
 */
import { config } from "dotenv";
config({ path: ".env.local" });

import { drizzle } from "drizzle-orm/postgres-js";
import { eq, sql as dsql } from "drizzle-orm";
import postgres from "postgres";
import * as schema from "./schema";
import { slugify } from "../lib/utils";

const url = process.env.DIRECT_URL || process.env.DATABASE_URL;
if (!url) {
  throw new Error(
    "DIRECT_URL or DATABASE_URL must be set to seed the database.",
  );
}

const client = postgres(url, { prepare: false, max: 1 });
const db = drizzle(client, { schema });

// ── Societies (slug MUST match legacy route slugs) ───────────────────────────
const SOCIETIES: Array<{
  slug: string;
  name: string;
  type: "society" | "affinity";
  about: string;
  email?: string;
  instagram?: string;
  linkedin?: string;
}> = [
  {
    slug: "antennas-and-propagation",
    name: "Antennas and Propagation Society",
    type: "society",
    about:
      "Founded in 1952, IEEE APS advances the theory, design, and application of antennas and electromagnetic wave propagation. Its scope includes antenna theory, propagation modeling, remote sensing, and radar. Globally, APS connects over 8,000 members, publishes leading journals, and hosts the flagship IEEE International Symposium. The MIT B'luru student chapter inspires research, offers hands-on workshops, design challenges, and connects students to global opportunities, travel grants, and industry experts.",
  },
  {
    slug: "computer-society",
    name: "Computer Society",
    type: "society",
    about:
      "IEEE Computer Society is one of the largest global chapters, uniting computer science professionals across hardware, software, AI/ML, and app development. At MIT B'luru, IEEE CS hosts events on cutting-edge topics, fosters competitive coding, and provides a platform for learning, networking, and innovation in all fields of computing.",
  },
  {
    slug: "computational-intelligence",
    name: "Computational Intelligence Society",
    type: "society",
    about:
      "IEEE CIS focuses on the theory, design, application, and development of biologically and linguistically motivated computational paradigms. This includes neural networks, fuzzy systems, and evolutionary computation. The MIT B'luru chapter encourages research, organizes workshops, and promotes innovation in AI, machine learning, and intelligent systems.",
    instagram:
      "https://www.instagram.com/ieee_cis.mitblr?igsh=emVrbHNudWNxbXdj",
    linkedin: "https://www.linkedin.com/company/ieee-cis-mitblr",
  },
  {
    slug: "engineering-in-medicine-and-biology",
    name: "Engineering in Medicine and Biology Society",
    type: "society",
    about:
      "IEEE EMBS is the world’s largest society for engineering, technology, and computing in medicine and biology. The MIT Bengaluru chapter is a student-led community focused on research, innovation, and practical healthcare technology. We organize guest lectures, workshops, and foster collaboration to inspire students to become future leaders in biomedical engineering and global healthcare advancement.",
  },
  {
    slug: "geoscience-and-remote-sensing",
    name: "Geoscience and Remote Sensing Society",
    type: "society",
    about:
      "IEEE GRSS advances science, engineering, and education in geoscience and remote sensing. The MIT Bengaluru chapter inspires students to explore and protect our planet using satellites, sensors, drones, and AI-powered data analysis. Through hands-on workshops, research, and global partnerships, members turn curiosity into real-world impact—tracking disasters, studying the environment, and shaping the future of Earth observation. Connect with a global network and discover ‘from pixels to possibilities.’",
  },
  {
    slug: "microwave-theory-and-technology",
    name: "Microwave Theory and Technology Society",
    type: "society",
    about:
      "IEEE MTT-S advances microwave theory, RF, millimeter-wave, and terahertz systems. With 11,000+ members globally, it covers circuits, devices, photonics, radar, and biomedical applications. The MITB student chapter builds technical skills in high-frequency design, promotes research, and connects students to industry through expert talks, industry visits, and global competitions.",
  },
  {
    slug: "photonics-society",
    name: "Photonics Society",
    type: "society",
    about:
      "The IEEE Photonics Society at MIT BLR advances photonics and optics through research, innovation, and collaboration. We explore fiber-optic communications, solar energy, and LED tech, offering workshops, seminars, and hands-on projects. Our mission is to inspire students and foster professional growth in the dynamic field of photonics.",
  },
  {
    slug: "robotics-and-automation",
    name: "Robotics and Automation Society",
    type: "society",
    about:
      "IEEE RAS MITB unites students from diverse fields to collaborate on robotics, automation, AI/ML, and electronics. We design impactful solutions, publish research, and explore real-world tech through hands-on projects and technical discussions. RAS provides a vibrant platform to push boundaries, exchange knowledge, and drive the future of intelligent systems.",
  },
  {
    slug: "vehicular-technology",
    name: "Vehicular Technology Society",
    type: "society",
    about:
      "IEEE VTS focuses on the theoretical, experimental, and operational aspects of electrical and electronic engineering in mobile radio, motor vehicles, and land transportation. The MIT B'luru chapter explores connected vehicles, intelligent transport systems, and automotive electronics, offering workshops, research opportunities, and industry engagement.",
  },
  {
    slug: "systems-man-and-cybernetics",
    name: "Systems, Man, and Cybernetics Society",
    type: "society",
    about:
      "IEEE SMC advances the theory, design, and application of systems science and engineering, human-machine systems, and cybernetics — spanning decision support, autonomy, human factors, and intelligent control. Globally, SMC publishes leading journals and hosts the annual IEEE International Conference on Systems, Man, and Cybernetics. The MIT B'luru chapter explores how complex systems and the people who use them interact, through workshops and projects that connect control, computing, and human-centred design.",
  },
  {
    slug: "signal-processing",
    name: "Signal Processing Society",
    type: "society",
    about:
      "IEEE SPS is the Institute's oldest society, founded in 1948, and the home of signal processing research — audio and speech, image and video, sensing, communications, and machine learning for signals. It publishes the IEEE Transactions on Signal Processing and hosts ICASSP, the field's flagship conference. The MIT B'luru chapter turns that theory into practice with hands-on work across audio, computer vision, and applied machine learning.",
  },
  {
    slug: "women-in-engineering",
    name: "Women in Engineering",
    type: "affinity",
    about:
      "WIE is a global network dedicated to advancing women in engineering and science. It provides mentorship, professional development, and a collaborative community, actively accelerating the academic and professional growth of women. Through robust programs and advocacy, WIE dismantles barriers and fosters an environment where women thrive, enriching the scientific landscape with diverse perspectives.",
  },
];

// ── Current student-branch leadership (from legacy Home page) ────────────────
const TEAM: Array<{ name: string; position: string; photoUrl: string }> = [
  {
    name: "Sampreet",
    position: "Chairperson",
    photoUrl: "/sbPhotos/sampreet.jpeg",
  },
  { name: "Harthik", position: "Vice Chair", photoUrl: "/sbPhotos/harik.jpeg" },
  {
    name: "Rosanne",
    position: "General Secretary",
    photoUrl: "/sbPhotos/rosanne.jpeg",
  },
  {
    name: "Siddharth",
    position: "Joint Secretary",
    photoUrl: "/sbPhotos/siddharth.jpeg",
  },
  { name: "Mahika", position: "Treasurer", photoUrl: "/sbPhotos/mahika.jpeg" },
];

// ── Real members for Computational Intelligence Society ──────────────────────
const CIS_STUDENTS = [
  {
    name: "Ameya Mhatre",
    roleTitle: "Chair",
    linkedin: "https://www.linkedin.com/in/ameya-mhatre-553003307/",
  },
  {
    name: "Rishabh Surana",
    roleTitle: "Vice Chair",
    linkedin: "https://www.linkedin.com/in/rishabh-surana-4a06b02b3",
  },
  {
    name: "Arunabhho Das",
    roleTitle: "General Secretary",
    linkedin: "https://www.linkedin.com/in/arunabhho-das-70685b351",
  },
  {
    name: "Samraksha Nori",
    roleTitle: "Technical Webmaster",
    linkedin: "https://www.linkedin.com/in/samraksha-nori-76401a299",
  },
  {
    name: "Eshani Katiyar",
    roleTitle: "Treasurer",
    linkedin: "https://www.linkedin.com/in/eshani-katiyar-2a7737322",
  },
];
const CIS_FACULTY = [
  {
    name: "Dr. Megha Arakeri",
    roleTitle: "Faculty Advisor",
    linkedin: "https://www.linkedin.com/in/dr-megha-arakeri",
  },
];

async function seedSocieties() {
  for (let i = 0; i < SOCIETIES.length; i++) {
    const s = SOCIETIES[i]!;
    await db
      .insert(schema.societies)
      .values({
        slug: s.slug,
        name: s.name,
        type: s.type,
        about: s.about,
        email: s.email ?? null,
        instagram: s.instagram ?? null,
        linkedin: s.linkedin ?? null,
        logoUrl: null,
        displayOrder: i,
      })
      .onConflictDoNothing({ target: schema.societies.slug });
  }
  console.log(`✓ societies (${SOCIETIES.length})`);
}

async function seedTeam() {
  const teamCount = await db
    .select({ count: dsql<number>`count(*)::int` })
    .from(schema.teamMembers);
  if ((teamCount[0]?.count ?? 0) > 0) {
    console.log("• team_members already present — skipping");
    return;
  }
  await db.insert(schema.teamMembers).values(
    TEAM.map((m, i) => ({
      name: m.name,
      position: m.position,
      photoUrl: m.photoUrl,
      term: "2025-26",
      isCurrent: true,
      displayOrder: i,
    })),
  );
  console.log(`✓ team_members (${TEAM.length})`);
}

async function seedCisMembers() {
  const [cis] = await db
    .select({ id: schema.societies.id })
    .from(schema.societies)
    .where(eq(schema.societies.slug, "computational-intelligence"))
    .limit(1);
  if (!cis) return;

  const memberCount = await db
    .select({ count: dsql<number>`count(*)::int` })
    .from(schema.societyMembers)
    .where(eq(schema.societyMembers.societyId, cis.id));
  if ((memberCount[0]?.count ?? 0) > 0) {
    console.log("• CIS members already present — skipping");
    return;
  }

  await db.insert(schema.societyMembers).values([
    ...CIS_STUDENTS.map((m, i) => ({
      societyId: cis.id,
      memberType: "student" as const,
      name: m.name,
      roleTitle: m.roleTitle,
      linkedin: m.linkedin,
      displayOrder: i,
    })),
    ...CIS_FACULTY.map((m, i) => ({
      societyId: cis.id,
      memberType: "faculty" as const,
      name: m.name,
      roleTitle: m.roleTitle,
      linkedin: m.linkedin,
      displayOrder: i,
    })),
  ]);
  console.log(`✓ CIS members (${CIS_STUDENTS.length + CIS_FACULTY.length})`);
}

/** Optional one-off ETL from the legacy Supabase Postgres project. */
async function etlFromLegacy() {
  const legacyUrl = process.env.LEGACY_SUPABASE_DB_URL;
  if (!legacyUrl) {
    console.log(
      "• LEGACY_SUPABASE_DB_URL not set — skipping events/articles ETL",
    );
    return;
  }

  const legacy = postgres(legacyUrl, { prepare: false, max: 1 });
  try {
    const socs = await db
      .select({ id: schema.societies.id, name: schema.societies.name })
      .from(schema.societies);
    const byName = new Map(socs.map((s) => [s.name, s.id]));
    const usedSlugs = new Set<string>();
    const uniqueSlug = (title: string) => {
      const base = slugify(title) || "item";
      let slug = base;
      let n = 2;
      while (usedSlugs.has(slug)) slug = `${base}-${n++}`;
      usedSlugs.add(slug);
      return slug;
    };

    type LegacyEvent = {
      title: string;
      description: string | null;
      date: string | null;
      venue: string | null;
      image_url: string | null;
      society: string | null;
      link: string | null;
    };
    const oldEvents = await legacy<LegacyEvent[]>`
      SELECT title, description, date, venue, image_url, society, link FROM events
    `;
    for (const e of oldEvents) {
      if (!e.title || !e.date) continue;
      await db
        .insert(schema.events)
        .values({
          slug: uniqueSlug(e.title),
          societyId: e.society ? (byName.get(e.society) ?? null) : null,
          title: e.title,
          description: e.description ?? "",
          startAt: new Date(e.date),
          venue: e.venue,
          imageUrl: e.image_url,
          registrationUrl: e.link,
          status: "published",
        })
        .onConflictDoNothing({ target: schema.events.slug });
    }
    console.log(`✓ ETL events (${oldEvents.length})`);

    type LegacyArticle = {
      title: string;
      author: string | null;
      publication: string | null;
      publication_date: string | null;
      article_url: string | null;
      image_url: string | null;
      society: string | null;
      short_description: string | null;
    };
    const oldArticles = await legacy<LegacyArticle[]>`
      SELECT title, author, publication, publication_date, article_url, image_url, society, short_description FROM articles
    `;
    for (const a of oldArticles) {
      if (!a.title) continue;
      await db
        .insert(schema.articles)
        .values({
          slug: uniqueSlug(a.title),
          societyId: a.society ? (byName.get(a.society) ?? null) : null,
          title: a.title,
          author: a.author,
          publication: a.publication,
          publicationDate: a.publication_date,
          externalUrl: a.article_url,
          imageUrl: a.image_url,
          excerpt: a.short_description,
          status: "published",
        })
        .onConflictDoNothing({ target: schema.articles.slug });
    }
    console.log(`✓ ETL articles (${oldArticles.length})`);
  } finally {
    await legacy.end();
  }
}

/** The branch's technical account — the single mailbox that owns the Supabase
 *  project, Vercel and the domain. Override with SEED_ADMIN_EMAIL when working
 *  against a database that should grant someone else instead. */
const DEFAULT_ADMIN_EMAIL = "ieee.mitblr.admin@gmail.com";

/**
 * Grant dashboard access by adding the address to the `app_admins` allowlist.
 *
 * The allowlist is the single source of truth: a trigger promotes a matching
 * profile to `admin` and demotes it when the row is removed. Writing
 * `profiles.role` directly is NOT equivalent — the prevent_role_escalation
 * trigger guards that column, and the next allowlist sync would undo it.
 *
 * Runs before the user exists, which is fine: the signup trigger reads the
 * allowlist when the account is created.
 */
async function promoteAdmin() {
  const email = (process.env.SEED_ADMIN_EMAIL || DEFAULT_ADMIN_EMAIL)
    .trim()
    .toLowerCase();
  if (!email) return;
  await db.execute(
    dsql`INSERT INTO public.app_admins (email, note)
         VALUES (${email}, 'seeded')
         ON CONFLICT (email) DO NOTHING`,
  );
  console.log(`✓ admin allowlist: ${email}`);
}

// ── Representative content (events / articles / announcements) ───────────────
// Realistic sample content so every section + the filters/pagination are
// populated. Admins replace/extend via the dashboard. Dates are relative to the
// seed run so the upcoming/past split always demonstrates correctly.
const DAY = 24 * 60 * 60 * 1000;
const at = (offsetDays: number, hour = 10, minute = 0) => {
  const d = new Date(Date.now() + offsetDays * DAY);
  d.setHours(hour, minute, 0, 0);
  return d;
};

type SeedEvent = {
  title: string;
  society: string | null;
  type: string;
  venue: string;
  when: Date;
  reg?: string | null;
  desc: string;
};

const EVENTS: SeedEvent[] = [
  // ── Upcoming ──
  {
    title: "IEEE Day 2026 Celebration",
    society: null,
    type: "Flagship",
    venue: "MIT Bengaluru Auditorium",
    when: at(106, 17),
    desc: "An evening celebrating IEEE's global community with talks, demos, and awards across all MIT Bengaluru societies.",
  },
  {
    title: "CodeSprint 24-Hour Hackathon",
    society: "computer-society",
    type: "Hackathon",
    venue: "Innovation Lab",
    when: at(61, 9),
    reg: "https://www.ieee.org",
    desc: "Build, ship, and pitch a working product in 24 hours. Open to all years; teams of up to four.",
  },
  {
    title: "Hands-on RF & Antenna Design Workshop",
    society: "antennas-and-propagation",
    type: "Workshop",
    venue: "RF Lab",
    when: at(27, 10),
    desc: "A practical introduction to antenna design and measurement, from theory to bench testing.",
  },
  {
    title: "Intro to Neural Networks Bootcamp",
    society: "computational-intelligence",
    type: "Bootcamp",
    venue: "Seminar Hall A",
    when: at(34, 10),
    reg: "https://www.ieee.org",
    desc: "Two-day bootcamp covering the fundamentals of neural networks with hands-on PyTorch labs.",
  },
  {
    title: "WIE Women in Tech Leadership Panel",
    society: "women-in-engineering",
    type: "Panel",
    venue: "MIT Bengaluru Auditorium",
    when: at(48, 16),
    desc: "Industry leaders share their journeys and mentorship advice for women in engineering.",
  },
  {
    title: "Biomedical Signal Processing Seminar",
    society: "engineering-in-medicine-and-biology",
    type: "Talk",
    venue: "Seminar Hall B",
    when: at(75, 15),
    desc: "How modern DSP turns raw physiological signals into clinical insight.",
  },
  {
    title: "Satellite Image Analysis with Python",
    society: "geoscience-and-remote-sensing",
    type: "Workshop",
    venue: "Computer Lab 2",
    when: at(89, 10),
    desc: "Work with real Sentinel-2 imagery to map land cover and detect change.",
  },
  {
    title: "Autonomous Robotics Challenge",
    society: "robotics-and-automation",
    type: "Competition",
    venue: "Robotics Lab",
    when: at(117, 9),
    reg: "https://www.ieee.org",
    desc: "Design and program a robot to navigate an unknown arena autonomously.",
  },

  // ── Past ──
  {
    title: "Photonics & Fiber Optics Demo Day",
    society: "photonics-society",
    type: "Workshop",
    venue: "Photonics Lab",
    when: at(-30, 11),
    desc: "Live demonstrations of fiber-optic communication and LED/laser fundamentals.",
  },
  {
    title: "5G & Millimeter-Wave Tech Talk",
    society: "microwave-theory-and-technology",
    type: "Talk",
    venue: "Seminar Hall A",
    when: at(-58, 15),
    desc: "An overview of mmWave systems powering 5G and the road to 6G.",
  },
  {
    title: "Electric Vehicles: Powertrains & Beyond",
    society: "vehicular-technology",
    type: "Talk",
    venue: "MIT Bengaluru Auditorium",
    when: at(-92, 16),
    desc: "From battery chemistry to motor control — the engineering behind modern EVs.",
  },
  {
    title: "Competitive Programming Bootcamp",
    society: "computer-society",
    type: "Bootcamp",
    venue: "Computer Lab 1",
    when: at(-140, 10),
    desc: "Sharpen your DSA and contest skills with hands-on problem solving.",
  },
  {
    title: "Intro to Machine Learning Workshop",
    society: "computational-intelligence",
    type: "Workshop",
    venue: "Seminar Hall A",
    when: at(-180, 10),
    desc: "A gentle, hands-on introduction to supervised learning.",
  },
  {
    title: "Antenna Measurement Lab Visit",
    society: "antennas-and-propagation",
    type: "Industry Visit",
    venue: "External Facility",
    when: at(-210, 9),
    desc: "A guided visit to a professional antenna measurement and anechoic chamber facility.",
  },
  {
    title: "Healthcare Wearables Hackathon",
    society: "engineering-in-medicine-and-biology",
    type: "Hackathon",
    venue: "Innovation Lab",
    when: at(-240, 9),
    desc: "Prototype a wearable health-monitoring solution over a weekend.",
  },
  {
    title: "Remote Sensing for Disaster Management",
    society: "geoscience-and-remote-sensing",
    type: "Talk",
    venue: "Online (Zoom)",
    when: at(-275, 17),
    desc: "Using satellite data to predict, track, and respond to natural disasters.",
  },
  {
    title: "ROS 2 Fundamentals Workshop",
    society: "robotics-and-automation",
    type: "Workshop",
    venue: "Robotics Lab",
    when: at(-300, 10),
    desc: "Get started with the Robot Operating System 2 through guided exercises.",
  },
  {
    title: "WIE Coding for Beginners",
    society: "women-in-engineering",
    type: "Workshop",
    venue: "Computer Lab 2",
    when: at(-330, 10),
    desc: "A welcoming first-steps coding workshop for newcomers to programming.",
  },
  {
    title: "Microwave Circuit Design Webinar",
    society: "microwave-theory-and-technology",
    type: "Webinar",
    venue: "Online (Zoom)",
    when: at(-365, 18),
    desc: "Design considerations for high-frequency microwave circuits.",
  },
  {
    title: "Smart Mobility & ITS Symposium",
    society: "vehicular-technology",
    type: "Conference",
    venue: "MIT Bengaluru Auditorium",
    when: at(-400, 10),
    desc: "Talks on intelligent transport systems and connected vehicles.",
  },
  {
    title: "Open Source Contribution Drive",
    society: "computer-society",
    type: "Workshop",
    venue: "Computer Lab 1",
    when: at(-430, 10),
    desc: "Make your first open-source pull request with mentor guidance.",
  },
  {
    title: "Deep Learning for Computer Vision",
    society: "computational-intelligence",
    type: "Talk",
    venue: "Seminar Hall B",
    when: at(-470, 15),
    desc: "From CNNs to vision transformers — a tour of modern computer vision.",
  },
];

type SeedArticle = {
  title: string;
  society: string;
  author: string;
  publication: string;
  date: string;
  url: string;
  excerpt: string;
};

const ARTICLES: SeedArticle[] = [
  {
    title: "Understanding Transformer Architectures",
    society: "computational-intelligence",
    author: "IEEE CIS MITB Editorial",
    publication: "IEEE Computer Society",
    date: "2026-05-20",
    url: "https://www.computer.org",
    excerpt:
      "A clear walkthrough of attention, self-attention, and why transformers reshaped modern AI.",
  },
  {
    title: "A Beginner's Guide to Antenna Arrays",
    society: "antennas-and-propagation",
    author: "APS Student Chapter",
    publication: "IEEE Antennas & Propagation Society",
    date: "2026-04-10",
    url: "https://www.ieee.org",
    excerpt:
      "How combining multiple antennas enables beamforming, higher gain, and directionality.",
  },
  {
    title: "Edge AI on Microcontrollers",
    society: "computer-society",
    author: "IEEE CS MITB",
    publication: "IEEE Spectrum",
    date: "2026-03-02",
    url: "https://spectrum.ieee.org",
    excerpt:
      "Running real neural networks on tiny, power-constrained devices at the edge.",
  },
  {
    title: "Wearable ECG: From Sensor to Insight",
    society: "engineering-in-medicine-and-biology",
    author: "EMBS Student Chapter",
    publication: "IEEE EMBS",
    date: "2026-02-18",
    url: "https://www.embs.org",
    excerpt:
      "The signal-processing pipeline that turns a noisy ECG into actionable health data.",
  },
  {
    title: "Mapping Floods with Sentinel-2",
    society: "geoscience-and-remote-sensing",
    author: "GRSS Student Chapter",
    publication: "IEEE GRSS",
    date: "2026-01-12",
    url: "https://www.grss-ieee.org",
    excerpt:
      "Using free satellite imagery and simple indices to detect and map flooding.",
  },
  {
    title: "RF Front-Ends for 5G NR",
    society: "microwave-theory-and-technology",
    author: "MTT-S Student Chapter",
    publication: "IEEE MTT-S",
    date: "2025-12-01",
    url: "https://www.ieee.org",
    excerpt: "Design trade-offs in the radio front-ends powering 5G New Radio.",
  },
  {
    title: "Silicon Photonics, Explained",
    society: "photonics-society",
    author: "Photonics Student Chapter",
    publication: "IEEE Photonics Society",
    date: "2025-11-09",
    url: "https://www.ieee.org",
    excerpt:
      "Why integrating optics onto silicon could transform data centers and sensing.",
  },
  {
    title: "SLAM for Mobile Robots",
    society: "robotics-and-automation",
    author: "RAS Student Chapter",
    publication: "IEEE RAS",
    date: "2025-10-15",
    url: "https://www.ieee-ras.org",
    excerpt: "How robots build a map and localize within it at the same time.",
  },
  {
    title: "The Road to Autonomous Vehicles",
    society: "vehicular-technology",
    author: "VTS Student Chapter",
    publication: "IEEE VTS",
    date: "2025-09-21",
    url: "https://www.ieee.org",
    excerpt:
      "The sensing, perception, and control stack behind self-driving cars.",
  },
  {
    title: "Closing the Gender Gap in STEM",
    society: "women-in-engineering",
    author: "WIE Affinity Group",
    publication: "IEEE Women in Engineering",
    date: "2025-08-30",
    url: "https://wie.ieee.org",
    excerpt:
      "Programs and mentorship that are moving the needle on representation in engineering.",
  },
];

type SeedAnnouncement = {
  kind: "announcement" | "achievement";
  title: string;
  body: string;
  when: Date;
};

const ANNOUNCEMENTS: SeedAnnouncement[] = [
  {
    kind: "announcement",
    title: "Recruitment Drive 2026 is Open",
    body: "Applications for the 2026–27 student committees across all IEEE MIT Bengaluru societies are now open. Reach out to any society to get involved.",
    when: at(-12),
  },
  {
    kind: "achievement",
    title: "MITB Team Reaches Smart India Hackathon Finals",
    body: "Congratulations to our student team for advancing to the national finals of the Smart India Hackathon.",
    when: at(-50),
  },
  {
    kind: "announcement",
    title: "IEEE Xplore Access for All Student Members",
    body: "Active student members now have full access to IEEE Xplore. Activate your membership to start reading.",
    when: at(-68),
  },
  {
    kind: "achievement",
    title: "Computer Society Named Outstanding Student Branch Chapter",
    body: "Our IEEE Computer Society chapter was recognized for outstanding activities over the past year.",
    when: at(-95),
  },
];

async function seedContent() {
  const socs = await db
    .select({ id: schema.societies.id, slug: schema.societies.slug })
    .from(schema.societies);
  const idBySlug = new Map(socs.map((s) => [s.slug, s.id]));
  const sid = (slug: string | null) =>
    slug ? (idBySlug.get(slug) ?? null) : null;

  const used = new Set<string>();
  const uniq = (title: string) => {
    const base = slugify(title) || "item";
    let slug = base;
    let n = 2;
    while (used.has(slug)) slug = `${base}-${n++}`;
    used.add(slug);
    return slug;
  };

  for (const e of EVENTS) {
    await db
      .insert(schema.events)
      .values({
        slug: uniq(e.title),
        societyId: sid(e.society),
        title: e.title,
        description: e.desc,
        startAt: e.when,
        venue: e.venue,
        registrationUrl: e.reg ?? null,
        eventType: e.type,
        status: "published",
      })
      .onConflictDoNothing({ target: schema.events.slug });
  }
  console.log(`✓ events (${EVENTS.length})`);

  for (const a of ARTICLES) {
    await db
      .insert(schema.articles)
      .values({
        slug: uniq(a.title),
        societyId: sid(a.society),
        title: a.title,
        author: a.author,
        publication: a.publication,
        publicationDate: a.date,
        externalUrl: a.url,
        excerpt: a.excerpt,
        status: "published",
      })
      .onConflictDoNothing({ target: schema.articles.slug });
  }
  console.log(`✓ articles (${ARTICLES.length})`);

  const annCount = await db
    .select({ count: dsql<number>`count(*)::int` })
    .from(schema.announcements);
  if ((annCount[0]?.count ?? 0) > 0) {
    console.log("• announcements already present — skipping");
  } else {
    await db.insert(schema.announcements).values(
      ANNOUNCEMENTS.map((a) => ({
        kind: a.kind,
        title: a.title,
        body: a.body,
        status: "published" as const,
        publishedAt: a.when,
      })),
    );
    console.log(`✓ announcements (${ANNOUNCEMENTS.length})`);
  }
}

/**
 * Hard stop against seeding demo content into a real deployment. A local
 * Supabase stack is reachable on localhost/127.0.0.1; anything else is
 * treated as production and refused.
 */
function assertLocalDatabase() {
  const host = new URL(url!).hostname;
  if (host !== "localhost" && host !== "127.0.0.1") {
    throw new Error(
      `Refusing to seed demo content into a non-local database (${host}). ` +
        "The sample events and articles are fabricated and would appear on " +
        "the public site as genuine. Add real content through /admin instead.",
    );
  }
}

async function main() {
  console.log("Seeding database…");
  await seedSocieties();
  await seedTeam();
  await seedCisMembers();

  // EVENTS/ARTICLES/ANNOUNCEMENTS below are invented demo content, inserted as
  // `status: "published"`. They exist so a local database has something in
  // every section and the filters/pagination can be exercised. They must never
  // reach the public site: people would try to register for events that do not
  // exist. Opt in explicitly, and only against a local database.
  if (process.env.SEED_DEMO_CONTENT === "1") {
    assertLocalDatabase();
    await seedContent();
  } else {
    console.log(
      "• demo content skipped (set SEED_DEMO_CONTENT=1 for local dev)",
    );
  }

  await etlFromLegacy();
  await promoteAdmin();
  console.log("Done.");
}

main()
  .catch((err) => {
    console.error(err);
    process.exitCode = 1;
  })
  .finally(() => client.end());
