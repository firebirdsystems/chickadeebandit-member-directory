-- Headshots become app files referenced by id, not by URL.
--
-- `photo_url` held whatever string the form produced — an uploaded file's URL
-- or a hand-typed external URL — which meant the file id behind an upload was
-- only recoverable by parsing our own URL shape, and member removal
-- (member_references on `linked_member_id`) could delete the profile row but
-- never reclaim its headshot bytes. `photo_file_id` is the source of truth for
-- the uploaded object: the `_id` suffix keeps it plaintext (skip-list), and the
-- manifest's member_references now declares it as the row's file_id_column so
-- removal deletes the bytes with the row. The external-URL fallback is dropped
-- from the form; headshots are always our own uploads.
--
-- `photo_url` stays (the migration contract forbids dropping columns — old app
-- versions still read it) and keeps being written alongside, derived from the
-- file id, so display code and legacy rows keep working. Rows written before
-- this migration have photo_file_id NULL; photo_url is encrypted at rest, so no
-- SQL backfill can parse the id out of it — the app back-fills lazily, deriving
-- the id from its own URL shape the next time a profile is saved.
ALTER TABLE app_member_directory__member_profiles ADD COLUMN photo_file_id TEXT;
ALTER TABLE app_member_directory__directory_people ADD COLUMN photo_file_id TEXT;
