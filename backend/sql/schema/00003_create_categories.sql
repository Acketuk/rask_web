-- +goose Up
CREATE TABLE categories (
    id UUID PRIMARY KEY DEFAULT uuidv7(),
    name TEXT NOT NULL UNIQUE,
    level SMALLINT NOT NULL DEFAULT 0,
    parent_id UUID REFERENCES categories(id) ON DELETE RESTRICT,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_categories_parent_id ON categories(parent_id);

-- +goose Down
DROP TABLE categories;