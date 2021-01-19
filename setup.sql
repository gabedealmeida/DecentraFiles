CREATE DATABASE decentrafiles;
CREATE USER decentrafiles WITH ENCRYPTED PASSWORD 'secretsauce';

CREATE TABLE files (
  id serial PRIMARY KEY,
  name text NOT NULL,
  type text NOT NULL,
  max_download_count integer NOT NULL,
  download_count integer NOT NULL,
  expiration TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE metrics (
  id serial PRIMARY KEY,
  total_upload_count bigint DEFAULT 0,
  total_download_count bigint DEFAULT 0
);

INSERT INTO metrics (total_upload_count, total_download_count) VALUES (0, 0);

CREATE INDEX downloads_idx ON files (download_count DESC);
CREATE INDEX expiration_idx ON files (expiration ASC);

GRANT ALL PRIVILEGES ON DATABASE decentrafiles TO decentrafiles;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO decentrafiles;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO decentrafiles;
