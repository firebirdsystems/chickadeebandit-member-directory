-- Index the manifest `preload` read, which the hub runs server-side while
-- rendering this app's document — on every launch, for every household.
--
-- Both preload reads sort a whole table under a 1,000-row cap. Both keys are
-- *_at columns, plaintext at rest.
CREATE INDEX IF NOT EXISTS app_member_directory__member_profiles_updated_idx
  ON app_member_directory__member_profiles (updated_at DESC);
CREATE INDEX IF NOT EXISTS app_member_directory__directory_people_created_idx
  ON app_member_directory__directory_people (created_at DESC);
