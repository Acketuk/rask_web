-- name: CreateAd :one
INSERT INTO ads (title, description, price, user_id, attributes, category_id)
VALUES ($1, $2, $3, $4, $5, $6)
RETURNING id, title, description, price, created_at, updated_at, user_id, attributes, category_id;

-- name: GetOneAd :one
SELECT id, title, description, price, created_at, updated_at, user_id, attributes, category_id
FROM ads
WHERE id = $1;

-- name: GetAllAds :many
SELECT id, title, description, price, created_at, user_id, category_id, attributes
FROM ads
ORDER BY updated_at DESC
LIMIT $1 OFFSET $2;

-- name: GetAdsByCategory :many
SELECT id, title, description, price, created_at, user_id, category_id, attributes
FROM ads
WHERE category_id = $1
   OR category_id IN (SELECT id FROM categories WHERE parent_id = $1)
ORDER BY updated_at DESC
LIMIT $2 OFFSET $3;

-- name: UpdateAd :one
UPDATE ads
SET
    title       = COALESCE($2, title),
    description = COALESCE($3, description),
    price       = COALESCE($4, price),
    attributes  = COALESCE($5, attributes),
    category_id = COALESCE($6, category_id),
    updated_at  = NOW()
WHERE id = $1
RETURNING id, title, description, price, updated_at, user_id, attributes, category_id;

-- name: CountAds :one
SELECT COUNT(*) FROM ads;

-- name: GetAdsByUser :many
SELECT id, title, description, price, created_at, user_id, category_id, attributes
FROM ads
WHERE user_id = $1
ORDER BY updated_at DESC
LIMIT $2 OFFSET $3;

-- name: SearchAds :many
SELECT id, title, description, price, created_at, user_id, category_id, attributes
FROM ads
WHERE title ILIKE '%' || $1 || '%' OR description ILIKE '%' || $1 || '%'
ORDER BY updated_at DESC
LIMIT $2 OFFSET $3;

-- name: DeleteAd :exec
DELETE FROM ads
WHERE id = $1;
