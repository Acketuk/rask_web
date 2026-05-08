-- +goose Up
CREATE TABLE ads (
    id UUID PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    price INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    attributes JSONB,
    category_id UUID NOT NULL REFERENCES categories(id) ON DELETE RESTRICT
);

-- +goose Down
DROP TABLE ads;