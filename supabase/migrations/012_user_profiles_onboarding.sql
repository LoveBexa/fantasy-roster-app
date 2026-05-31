-- Track dashboard onboarding completion (first-time welcome modal)

alter table public.user_profiles
  add column if not exists onboarding_completed_at timestamptz;

comment on column public.user_profiles.onboarding_completed_at is
  'When set, the dashboard welcome onboarding modal is not shown.';

-- Existing users should not see onboarding after this migration ships
update public.user_profiles
set onboarding_completed_at = coalesce(onboarding_completed_at, now())
where onboarding_completed_at is null;
