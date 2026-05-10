-- +goose Up
CREATE TABLE ads (
    id UUID PRIMARY KEY DEFAULT uuidv7(),
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    price INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    attributes JSONB,
    category_id UUID NOT NULL REFERENCES categories(id) ON DELETE RESTRICT
);

CREATE INDEX idx_ads_user_id     ON ads(user_id);
CREATE INDEX idx_ads_category_id ON ads(category_id);
CREATE INDEX idx_ads_updated_at  ON ads(updated_at DESC);
CREATE INDEX idx_ads_attributes  ON ads USING GIN(attributes);

-- +goose Down
DROP TABLE ads;