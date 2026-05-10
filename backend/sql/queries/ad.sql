-- name: CreateAd :one
INSERT INTO ads (title, description, price, user_id, attributes, category_id)
VALUES ($1, $2, $3, $4, $5, $6)
RETURNING id, title, description, price, created_at, updated_at, user_id, attributes, category_id;

-- name: GetOneAd :one
SELECT id, title, description, price, created_at, updated_at, user_id, attributes, category_id
FROM ads
WHERE id = $1;

-- name: GetAllAds :many
SELECT id, title, price, created_at, user_id, category_id
FROM ads
ORDER BY updated_at DESC
LIMIT $1 OFFSET $2;

-- name: GetAdsByCategory :many
SELECT id, title, price, created_at, user_id, category_id
FROM ads
WHERE category_id = $1
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

-- name: DeleteAd :exec
DELETE FROM ads
WHERE id = $1;
