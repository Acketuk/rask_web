-- +goose Up
CREATE TABLE categories (
    id UUID PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    level SMALLINT NOT NULL DEFAULT 0,
    parent_id UUID REFERENCES categories(id) ON DELETE RESTRICT
);

-- +goose Down
DROP TABLE categories;