-- +goose Up
CREATE EXTENSION IF NOT EXISTS pg_uuidv7;

-- +goose Down
DROP EXTENSION IF EXISTS pg_uuidv7;
