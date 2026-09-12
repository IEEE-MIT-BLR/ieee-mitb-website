-- ════════════════════════════════════════════════════════════════════════
-- Admin allowlist: a user can write to the DB ONLY if their email is on this
-- list. Master-controlled. Add an email → that account becomes admin (writer);
-- remove it → it drops to read-only viewer. Having an account is NOT enough.
-- Combined with the write-lockdown (0002), the anon key stays strictly
-- read-only and nothing can change data except an allowlisted admin via the
-- trusted server.
-- ════════════════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS public.app_admins (
  email      text PRIMARY KEY,
  note       text,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- No client (anon/authenticated) may read or write the allowlist; only the
-- trusted server roles (postgres / service_role) can. RLS on + zero grants.
ALTER TABLE public.app_admins ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.app_admins FROM anon, authenticated;

-- Always store emails normalized (lowercased/trimmed).
CREATE OR REPLACE FUNCTION public.app_admins_normalize_email()
RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  NEW.email = lower(trim(NEW.email));
  RETURN NEW;
END;
$$;
DROP TRIGGER IF EXISTS app_admins_normalize ON public.app_admins;
CREATE TRIGGER app_admins_normalize
  BEFORE INSERT OR UPDATE ON public.app_admins
  FOR EACH ROW EXECUTE FUNCTION public.app_admins_normalize_email();

-- New signups/created users: admin IFF allowlisted, otherwise viewer.
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO public.profiles (id, email, role)
  VALUES (
    NEW.id,
    NEW.email,
    CASE
      WHEN EXISTS (SELECT 1 FROM public.app_admins a WHERE a.email = lower(NEW.email))
      THEN 'admin'::public.user_role
      ELSE 'viewer'::public.user_role
    END
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

-- Keep existing profiles in sync when the allowlist changes (promote on add,
-- demote on remove). Runs as the (postgres-owned) definer, so it is permitted
-- by the prevent_role_escalation guard.
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
CREATE TRIGGER app_admins_sync_ins
  AFTER INSERT ON public.app_admins
  FOR EACH ROW EXECUTE FUNCTION public.sync_admin_from_allowlist();
DROP TRIGGER IF EXISTS app_admins_sync_del ON public.app_admins;
CREATE TRIGGER app_admins_sync_del
  AFTER DELETE ON public.app_admins
  FOR EACH ROW EXECUTE FUNCTION public.sync_admin_from_allowlist();

-- NOTE: no admin is seeded here on purpose. The allowlist starts EMPTY so that
-- no address is hardcoded in the repo. Grant access explicitly after migrating:
--
--   INSERT INTO public.app_admins (email, note)
--   VALUES ('admin@your-domain.org', 'who they are');
--
-- See "Grant admin access" in README.md.
