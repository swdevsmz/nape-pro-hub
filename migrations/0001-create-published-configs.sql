CREATE TABLE IF NOT EXISTS configs (
  id TEXT PRIMARY KEY NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL CHECK (length(title) BETWEEN 1 AND 80),
  description TEXT,
  author_display_name TEXT,
  usage_tags_json TEXT NOT NULL DEFAULT '[]',
  placement TEXT,
  firmware_version TEXT,
  hub_schema_version TEXT NOT NULL,
  config_snapshot_json TEXT NOT NULL,
  search_text TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'published'
    CHECK (status IN ('published', 'hidden', 'deleted')),
  manage_token_hash TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
  updated_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
);

CREATE INDEX IF NOT EXISTS idx_configs_status_created_at
  ON configs(status, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_configs_search_text
  ON configs(search_text);
