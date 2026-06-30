CREATE TABLE IF NOT EXISTS app_member_directory__md_settings (
  key        TEXT NOT NULL,
  value      TEXT NOT NULL DEFAULT '',
  updated_at TEXT NOT NULL DEFAULT '',
  PRIMARY KEY (key)
);

CREATE TABLE IF NOT EXISTS app_member_directory__member_profiles (
  id               TEXT NOT NULL,
  linked_member_id TEXT NOT NULL,
  visibility       TEXT NOT NULL DEFAULT 'everyone',
  status           TEXT NOT NULL DEFAULT 'active',
  org_role         TEXT NOT NULL DEFAULT '',
  cohort           TEXT NOT NULL DEFAULT '',
  email            TEXT NOT NULL DEFAULT '',
  phone            TEXT NOT NULL DEFAULT '',
  photo_url        TEXT NOT NULL DEFAULT '',
  bio              TEXT NOT NULL DEFAULT '',
  updated_by       TEXT,
  created_at       TEXT NOT NULL,
  updated_at       TEXT NOT NULL,
  PRIMARY KEY (id),
  UNIQUE (linked_member_id),
  CONSTRAINT member_profiles_visibility_check CHECK (visibility IN ('everyone')),
  CONSTRAINT member_profiles_status_check CHECK (status IN ('active','alumni','inactive'))
);

CREATE TABLE IF NOT EXISTS app_member_directory__directory_people (
  id         TEXT NOT NULL,
  name       TEXT NOT NULL,
  kind       TEXT NOT NULL DEFAULT 'other',
  visibility TEXT NOT NULL DEFAULT 'everyone',
  status     TEXT NOT NULL DEFAULT 'active',
  org_role   TEXT NOT NULL DEFAULT '',
  cohort     TEXT NOT NULL DEFAULT '',
  email      TEXT NOT NULL DEFAULT '',
  phone      TEXT NOT NULL DEFAULT '',
  photo_url  TEXT NOT NULL DEFAULT '',
  bio        TEXT NOT NULL DEFAULT '',
  created_by TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  PRIMARY KEY (id),
  CONSTRAINT directory_people_visibility_check CHECK (visibility IN ('everyone')),
  CONSTRAINT directory_people_status_check CHECK (status IN ('active','alumni','inactive')),
  CONSTRAINT directory_people_kind_check CHECK (kind IN ('alumni','advisor','partner','guest','other'))
);

CREATE INDEX IF NOT EXISTS member_profiles_linked_member_idx ON app_member_directory__member_profiles (linked_member_id);
CREATE INDEX IF NOT EXISTS directory_people_status_idx ON app_member_directory__directory_people (status);
