-- ============================================================================
-- IEEE MIT Bengaluru — FULL one-shot database setup
-- Run ONCE on a fresh Supabase project (Supabase Dashboard → SQL Editor → Run).
-- Includes: enums, tables, FKs, indexes, RLS, auth wiring, storage bucket, seed.
-- ============================================================================

-- ─────────────────────────────  ENUMS  ─────────────────────────────────────
CREATE TYPE "public"."announcement_kind" AS ENUM('announcement', 'achievement');
CREATE TYPE "public"."content_status" AS ENUM('draft', 'published', 'archived');
CREATE TYPE "public"."member_type" AS ENUM('student', 'faculty');
CREATE TYPE "public"."message_status" AS ENUM('new', 'read', 'archived');
CREATE TYPE "public"."society_type" AS ENUM('society', 'affinity');
CREATE TYPE "public"."user_role" AS ENUM('admin', 'editor', 'viewer');

-- ─────────────────────────────  TABLES  ────────────────────────────────────
CREATE TABLE "societies" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"slug" varchar(80) NOT NULL,
	"name" varchar(160) NOT NULL,
	"short_name" varchar(32),
	"type" "society_type" DEFAULT 'society' NOT NULL,
	"about" text DEFAULT '' NOT NULL,
	"tagline" varchar(240),
	"logo_url" text,
	"theme_color" varchar(9),
	"email" varchar(160),
	"instagram" text,
	"linkedin" text,
	"display_order" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "societies_slug_unique" UNIQUE("slug")
);

CREATE TABLE "society_members" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"society_id" uuid NOT NULL,
	"member_type" "member_type" NOT NULL,
	"name" varchar(160) NOT NULL,
	"role_title" varchar(120),
	"photo_url" text,
	"email" varchar(160),
	"linkedin" text,
	"display_order" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);

CREATE TABLE "team_members" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(160) NOT NULL,
	"position" varchar(120) NOT NULL,
	"photo_url" text,
	"email" varchar(160),
	"linkedin" text,
	"term" varchar(20),
	"is_current" boolean DEFAULT true NOT NULL,
	"display_order" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);

CREATE TABLE "events" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"slug" varchar(200) NOT NULL,
	"society_id" uuid,
	"title" varchar(240) NOT NULL,
	"description" text DEFAULT '' NOT NULL,
	"start_at" timestamp with time zone NOT NULL,
	"end_at" timestamp with time zone,
	"venue" varchar(240),
	"image_url" text,
	"registration_url" text,
	"event_type" varchar(60),
	"rsvp_count" integer DEFAULT 0 NOT NULL,
	"status" "content_status" DEFAULT 'draft' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "events_slug_unique" UNIQUE("slug")
);

CREATE TABLE "articles" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"slug" varchar(200) NOT NULL,
	"society_id" uuid,
	"title" varchar(240) NOT NULL,
	"author" varchar(160),
	"publication" varchar(200),
	"publication_date" date,
	"external_url" text,
	"image_url" text,
	"excerpt" text,
	"body" text,
	"status" "content_status" DEFAULT 'draft' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "articles_slug_unique" UNIQUE("slug")
);

CREATE TABLE "event_gallery_photos" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"event_id" uuid NOT NULL,
	"image_url" text NOT NULL,
	"caption" varchar(240),
	"display_order" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);

CREATE TABLE "announcements" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"kind" "announcement_kind" DEFAULT 'announcement' NOT NULL,
	"title" varchar(240) NOT NULL,
	"body" text,
	"image_url" text,
	"society_id" uuid,
	"status" "content_status" DEFAULT 'draft' NOT NULL,
	"published_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);

CREATE TABLE "profiles" (
	"id" uuid PRIMARY KEY NOT NULL,
	"email" varchar(160),
	"full_name" varchar(160),
	"role" "user_role" DEFAULT 'viewer' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);

CREATE TABLE "contact_messages" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(160) NOT NULL,
	"email" varchar(160) NOT NULL,
	"subject" varchar(200),
	"message" text NOT NULL,
	"status" "message_status" DEFAULT 'new' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);

CREATE TABLE "newsletter_subscribers" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email" varchar(160) NOT NULL,
	"is_confirmed" boolean DEFAULT false NOT NULL,
	"unsubscribed_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "newsletter_subscribers_email_unique" UNIQUE("email")
);

-- ─────────────────────────────  FOREIGN KEYS  ──────────────────────────────
ALTER TABLE "society_members" ADD CONSTRAINT "society_members_society_id_societies_id_fk" FOREIGN KEY ("society_id") REFERENCES "public"."societies"("id") ON DELETE cascade ON UPDATE no action;
ALTER TABLE "events" ADD CONSTRAINT "events_society_id_societies_id_fk" FOREIGN KEY ("society_id") REFERENCES "public"."societies"("id") ON DELETE set null ON UPDATE no action;
ALTER TABLE "articles" ADD CONSTRAINT "articles_society_id_societies_id_fk" FOREIGN KEY ("society_id") REFERENCES "public"."societies"("id") ON DELETE set null ON UPDATE no action;
ALTER TABLE "event_gallery_photos" ADD CONSTRAINT "event_gallery_photos_event_id_events_id_fk" FOREIGN KEY ("event_id") REFERENCES "public"."events"("id") ON DELETE cascade ON UPDATE no action;
ALTER TABLE "announcements" ADD CONSTRAINT "announcements_society_id_societies_id_fk" FOREIGN KEY ("society_id") REFERENCES "public"."societies"("id") ON DELETE set null ON UPDATE no action;

-- ─────────────────────────────  INDEXES  ───────────────────────────────────
CREATE INDEX "societies_type_order_idx" ON "societies" USING btree ("type","display_order");
CREATE INDEX "society_members_society_type_order_idx" ON "society_members" USING btree ("society_id","member_type","display_order");
CREATE INDEX "team_members_current_order_idx" ON "team_members" USING btree ("is_current","display_order");
CREATE INDEX "events_status_start_idx" ON "events" USING btree ("status","start_at");
CREATE INDEX "events_society_start_idx" ON "events" USING btree ("society_id","start_at");
CREATE INDEX "articles_status_date_idx" ON "articles" USING btree ("status","publication_date");
CREATE INDEX "articles_society_date_idx" ON "articles" USING btree ("society_id","publication_date");
CREATE INDEX "event_gallery_event_order_idx" ON "event_gallery_photos" USING btree ("event_id","display_order");
CREATE INDEX "announcements_status_pub_idx" ON "announcements" USING btree ("status","published_at");
CREATE INDEX "contact_messages_status_idx" ON "contact_messages" USING btree ("status","created_at");

-- ════════════════════════  RLS, AUTH & SECURITY  ═══════════════════════════
-- profiles ↔ auth.users (1:1) + auto-create profile on signup + admin helper.
ALTER TABLE "profiles"
  ADD CONSTRAINT "profiles_id_auth_users_fk"
  FOREIGN KEY ("id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO public.profiles (id, email)
  VALUES (NEW.id, NEW.email)
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean LANGUAGE sql SECURITY DEFINER STABLE SET search_path = public AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'
  );
$$;

-- Enable RLS everywhere.
ALTER TABLE "societies"              ENABLE ROW LEVEL SECURITY;
ALTER TABLE "society_members"        ENABLE ROW LEVEL SECURITY;
ALTER TABLE "team_members"           ENABLE ROW LEVEL SECURITY;
ALTER TABLE "events"                 ENABLE ROW LEVEL SECURITY;
ALTER TABLE "articles"               ENABLE ROW LEVEL SECURITY;
ALTER TABLE "event_gallery_photos"   ENABLE ROW LEVEL SECURITY;
ALTER TABLE "announcements"          ENABLE ROW LEVEL SECURITY;
ALTER TABLE "profiles"               ENABLE ROW LEVEL SECURITY;
ALTER TABLE "contact_messages"       ENABLE ROW LEVEL SECURITY;
ALTER TABLE "newsletter_subscribers" ENABLE ROW LEVEL SECURITY;

-- Public read of published content.
CREATE POLICY "events_public_read" ON "events"
  FOR SELECT USING (status = 'published');
CREATE POLICY "articles_public_read" ON "articles"
  FOR SELECT USING (status = 'published');
CREATE POLICY "announcements_public_read" ON "announcements"
  FOR SELECT USING (status = 'published');
CREATE POLICY "event_gallery_public_read" ON "event_gallery_photos"
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM "events" e WHERE e.id = event_id AND e.status = 'published')
  );

-- Reference data: fully public read.
CREATE POLICY "societies_public_read"       ON "societies"       FOR SELECT USING (true);
CREATE POLICY "society_members_public_read" ON "society_members" FOR SELECT USING (true);
CREATE POLICY "team_members_public_read"    ON "team_members"    FOR SELECT USING (true);

-- Admin full control on content tables.
CREATE POLICY "societies_admin_all" ON "societies"
  FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "society_members_admin_all" ON "society_members"
  FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "team_members_admin_all" ON "team_members"
  FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "events_admin_all" ON "events"
  FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "articles_admin_all" ON "articles"
  FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "event_gallery_admin_all" ON "event_gallery_photos"
  FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "announcements_admin_all" ON "announcements"
  FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());

-- Inbox: admin-only read/manage (inserts go through the trusted server layer).
CREATE POLICY "contact_messages_admin_read" ON "contact_messages"
  FOR SELECT USING (public.is_admin());
CREATE POLICY "contact_messages_admin_manage" ON "contact_messages"
  FOR UPDATE USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "newsletter_admin_read" ON "newsletter_subscribers"
  FOR SELECT USING (public.is_admin());
CREATE POLICY "newsletter_admin_manage" ON "newsletter_subscribers"
  FOR UPDATE USING (public.is_admin()) WITH CHECK (public.is_admin());

-- profiles: self-access + admin oversight.
CREATE POLICY "profiles_self_or_admin_read" ON "profiles"
  FOR SELECT USING (id = auth.uid() OR public.is_admin());
CREATE POLICY "profiles_self_update" ON "profiles"
  FOR UPDATE USING (id = auth.uid()) WITH CHECK (id = auth.uid());
CREATE POLICY "profiles_admin_manage" ON "profiles"
  FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());

-- ════════════════════════  STORAGE (image uploads)  ════════════════════════
-- Public bucket for uploaded media. Uploads go through the service role
-- (bypasses storage RLS); public=true allows anonymous read of the URLs.
INSERT INTO storage.buckets (id, name, public)
VALUES ('media', 'media', true)
ON CONFLICT (id) DO NOTHING;

-- ════════════════════════════  SEED DATA  ══════════════════════════════════
-- Societies: 11 chapters + Women in Engineering (affinity), listed and
-- numbered alphabetically. Re-runnable via ON CONFLICT.
INSERT INTO societies (slug, name, type, about, logo_url, display_order, instagram, linkedin) VALUES
('antennas-and-propagation', 'Antennas and Propagation Society', 'society', $$Founded in 1952, IEEE APS advances the theory, design, and application of antennas and electromagnetic wave propagation. Its scope includes antenna theory, propagation modeling, remote sensing, and radar. Globally, APS connects over 8,000 members, publishes leading journals, and hosts the flagship IEEE International Symposium. The MIT B'luru student chapter inspires research, offers hands-on workshops, design challenges, and connects students to global opportunities, travel grants, and industry experts.$$, '/logo.png', 0, NULL, NULL),
('computational-intelligence', 'Computational Intelligence Society', 'society', $$IEEE CIS focuses on the theory, design, application, and development of biologically and linguistically motivated computational paradigms. This includes neural networks, fuzzy systems, and evolutionary computation. The MIT B'luru chapter encourages research, organizes workshops, and promotes innovation in AI, machine learning, and intelligent systems.$$, '/logo.png', 1, 'https://www.instagram.com/ieee_cis.mitblr?igsh=emVrbHNudWNxbXdj', 'https://www.linkedin.com/company/ieee-cis-mitblr'),
('computer-society', 'Computer Society', 'society', $$IEEE Computer Society is one of the largest global chapters, uniting computer science professionals across hardware, software, AI/ML, and app development. At MIT B'luru, IEEE CS hosts events on cutting-edge topics, fosters competitive coding, and provides a platform for learning, networking, and innovation in all fields of computing.$$, '/logo.png', 2, NULL, NULL),
('engineering-in-medicine-and-biology', 'Engineering in Medicine and Biology Society', 'society', $$IEEE EMBS is the world’s largest society for engineering, technology, and computing in medicine and biology. The MIT Bengaluru chapter is a student-led community focused on research, innovation, and practical healthcare technology. We organize guest lectures, workshops, and foster collaboration to inspire students to become future leaders in biomedical engineering and global healthcare advancement.$$, '/logo.png', 3, NULL, NULL),
('geoscience-and-remote-sensing', 'Geoscience and Remote Sensing Society', 'society', $$IEEE GRSS advances science, engineering, and education in geoscience and remote sensing. The MIT Bengaluru chapter inspires students to explore and protect our planet using satellites, sensors, drones, and AI-powered data analysis. Through hands-on workshops, research, and global partnerships, members turn curiosity into real-world impact—tracking disasters, studying the environment, and shaping the future of Earth observation. Connect with a global network and discover ‘from pixels to possibilities.’$$, '/logo.png', 4, NULL, NULL),
('microwave-theory-and-technology', 'Microwave Theory and Technology Society', 'society', $$IEEE MTT-S advances microwave theory, RF, millimeter-wave, and terahertz systems. With 11,000+ members globally, it covers circuits, devices, photonics, radar, and biomedical applications. The MITB student chapter builds technical skills in high-frequency design, promotes research, and connects students to industry through expert talks, industry visits, and global competitions.$$, '/logo.png', 5, NULL, NULL),
('photonics-society', 'Photonics Society', 'society', $$The IEEE Photonics Society at MIT BLR advances photonics and optics through research, innovation, and collaboration. We explore fiber-optic communications, solar energy, and LED tech, offering workshops, seminars, and hands-on projects. Our mission is to inspire students and foster professional growth in the dynamic field of photonics.$$, '/logo.png', 6, NULL, NULL),
('robotics-and-automation', 'Robotics and Automation Society', 'society', $$IEEE RAS MITB unites students from diverse fields to collaborate on robotics, automation, AI/ML, and electronics. We design impactful solutions, publish research, and explore real-world tech through hands-on projects and technical discussions. RAS provides a vibrant platform to push boundaries, exchange knowledge, and drive the future of intelligent systems.$$, '/logo.png', 7, NULL, NULL),
('signal-processing', 'Signal Processing Society', 'society', $$IEEE SPS is the Institute's oldest society, founded in 1948, and the home of signal processing research — audio and speech, image and video, sensing, communications, and machine learning for signals. It publishes the IEEE Transactions on Signal Processing and hosts ICASSP, the field's flagship conference. The MIT B'luru chapter turns that theory into practice with hands-on work across audio, computer vision, and applied machine learning.$$, '/logo.png', 8, NULL, NULL),
('systems-man-and-cybernetics', 'Systems, Man, and Cybernetics Society', 'society', $$IEEE SMC advances the theory, design, and application of systems science and engineering, human-machine systems, and cybernetics — spanning decision support, autonomy, human factors, and intelligent control. Globally, SMC publishes leading journals and hosts the annual IEEE International Conference on Systems, Man, and Cybernetics. The MIT B'luru chapter explores how complex systems and the people who use them interact, through workshops and projects that connect control, computing, and human-centred design.$$, '/logo.png', 9, NULL, NULL),
('vehicular-technology', 'Vehicular Technology Society', 'society', $$IEEE VTS focuses on the theoretical, experimental, and operational aspects of electrical and electronic engineering in mobile radio, motor vehicles, and land transportation. The MIT B'luru chapter explores connected vehicles, intelligent transport systems, and automotive electronics, offering workshops, research opportunities, and industry engagement.$$, '/logo.png', 10, NULL, NULL),
('women-in-engineering', 'Women in Engineering', 'affinity', $$WIE is a global network dedicated to advancing women in engineering and science. It provides mentorship, professional development, and a collaborative community, actively accelerating the academic and professional growth of women. Through robust programs and advocacy, WIE dismantles barriers and fosters an environment where women thrive, enriching the scientific landscape with diverse perspectives.$$, '/logo.png', 11, NULL, NULL)
ON CONFLICT (slug) DO NOTHING;

-- Current student-branch leadership (only if the table is empty).
INSERT INTO team_members (name, position, photo_url, term, is_current, display_order)
SELECT v.name, v.position, v.photo_url, '2025-26', true, v.display_order
FROM (VALUES
  ('Sampreet',  'Chairperson',       '/sbPhotos/sampreet.jpeg',  0),
  ('Harthik',   'Vice Chair',        '/sbPhotos/harik.jpeg',     1),
  ('Rosanne',   'General Secretary', '/sbPhotos/rosanne.jpeg',   2),
  ('Siddharth', 'Joint Secretary',   '/sbPhotos/siddharth.jpeg', 3),
  ('Mahika',    'Treasurer',         '/sbPhotos/mahika.jpeg',    4)
) AS v(name, position, photo_url, display_order)
WHERE NOT EXISTS (SELECT 1 FROM team_members);

-- Computational Intelligence Society members (real data), linked by slug.
INSERT INTO society_members (society_id, member_type, name, role_title, linkedin, display_order)
SELECT s.id, v.member_type::member_type, v.name, v.role_title, v.linkedin, v.display_order
FROM societies s
JOIN (VALUES
  ('student', 'Ameya Mhatre',   'Chair',               'https://www.linkedin.com/in/ameya-mhatre-553003307/',   0),
  ('student', 'Rishabh Surana', 'Vice Chair',          'https://www.linkedin.com/in/rishabh-surana-4a06b02b3',  1),
  ('student', 'Arunabhho Das',  'General Secretary',   'https://www.linkedin.com/in/arunabhho-das-70685b351',   2),
  ('student', 'Samraksha Nori', 'Technical Webmaster', 'https://www.linkedin.com/in/samraksha-nori-76401a299',  3),
  ('student', 'Eshani Katiyar', 'Treasurer',           'https://www.linkedin.com/in/eshani-katiyar-2a7737322',  4),
  ('faculty', 'Dr. Megha Arakeri', 'Faculty Advisor',  'https://www.linkedin.com/in/dr-megha-arakeri',          0)
) AS v(member_type, name, role_title, linkedin, display_order) ON TRUE
WHERE s.slug = 'computational-intelligence'
  AND NOT EXISTS (SELECT 1 FROM society_members sm WHERE sm.society_id = s.id);

-- ════════════════════════════  FIRST ADMIN  ════════════════════════════════
-- Admin rights come from the `app_admins` allowlist seeded at the end of this
-- script — NOT from editing `profiles.role`, which the prevent_role_escalation
-- trigger blocks. To grant access: add the address to app_admins, then create
-- the user in Supabase Dashboard → Authentication → Add user (tick Auto
-- Confirm). The signup trigger reads the allowlist and assigns the role.

-- ════════════════════════════════════════════════════════════════════════
-- WRITE LOCKDOWN — the only writer is the trusted server (service role /
-- direct postgres connection). No public key (anon/authenticated) may write.
-- ════════════════════════════════════════════════════════════════════════
REVOKE INSERT, UPDATE, DELETE, TRUNCATE ON ALL TABLES IN SCHEMA public
  FROM anon, authenticated;
ALTER DEFAULT PRIVILEGES IN SCHEMA public
  REVOKE INSERT, UPDATE, DELETE, TRUNCATE ON TABLES FROM anon, authenticated;

DROP POLICY IF EXISTS "profiles_self_update" ON public.profiles;

CREATE OR REPLACE FUNCTION public.prevent_role_escalation()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF NEW.role IS DISTINCT FROM OLD.role
     AND current_user NOT IN ('postgres', 'supabase_admin', 'service_role')
     AND NOT public.is_admin() THEN
    RAISE EXCEPTION 'Not authorized to change role';
  END IF;
  RETURN NEW;
END;
$$;
DROP TRIGGER IF EXISTS profiles_prevent_role_escalation ON public.profiles;
CREATE TRIGGER profiles_prevent_role_escalation
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.prevent_role_escalation();

-- ════════════════════════════════════════════════════════════════════════
-- ADMIN ALLOWLIST — a user can write ONLY if their email is on this list.
-- Master-controlled. `insert into app_admins(email) values('x@y.com')` grants;
-- `delete from app_admins where email='x@y.com'` revokes (auto-demotes).
-- ════════════════════════════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS public.app_admins (
  email      text PRIMARY KEY,
  note       text,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.app_admins ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.app_admins FROM anon, authenticated;

CREATE OR REPLACE FUNCTION public.app_admins_normalize_email()
RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN NEW.email = lower(trim(NEW.email)); RETURN NEW; END;
$$;
DROP TRIGGER IF EXISTS app_admins_normalize ON public.app_admins;
CREATE TRIGGER app_admins_normalize
  BEFORE INSERT OR UPDATE ON public.app_admins
  FOR EACH ROW EXECUTE FUNCTION public.app_admins_normalize_email();

-- New users: admin IFF allowlisted, else viewer (replaces the earlier version).
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO public.profiles (id, email, role)
  VALUES (
    NEW.id, NEW.email,
    CASE WHEN EXISTS (SELECT 1 FROM public.app_admins a WHERE a.email = lower(NEW.email))
         THEN 'admin'::public.user_role ELSE 'viewer'::public.user_role END
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.sync_admin_from_allowlist()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE public.profiles SET role = 'admin' WHERE email = NEW.email;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE public.profiles SET role = 'viewer' WHERE email = OLD.email;
  END IF;
  RETURN NULL;
END;
$$;
DROP TRIGGER IF EXISTS app_admins_sync_ins ON public.app_admins;
CREATE TRIGGER app_admins_sync_ins AFTER INSERT ON public.app_admins
  FOR EACH ROW EXECUTE FUNCTION public.sync_admin_from_allowlist();
DROP TRIGGER IF EXISTS app_admins_sync_del ON public.app_admins;
CREATE TRIGGER app_admins_sync_del AFTER DELETE ON public.app_admins
  FOR EACH ROW EXECUTE FUNCTION public.sync_admin_from_allowlist();

-- The branch's technical account — the single mailbox that owns the Supabase
-- project, Vercel and the domain, and the only address granted dashboard
-- write access by default. Add or remove rows here to grant or revoke:
-- a removed address drops to a read-only viewer immediately.
INSERT INTO public.app_admins (email, note)
VALUES ('ieee.mitblr.admin@gmail.com', 'branch technical admin')
ON CONFLICT (email) DO NOTHING;
