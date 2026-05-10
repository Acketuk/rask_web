-- name: CreateCategory :one
INSERT INTO categories(name, level, parent_id)
VALUES(
    $1,
    $2,
    $3
)
RETURNING id, name, level, parent_id, created_at;

-- name: GetCategory :one
SELECT id, name, level, parent_id
FROM categories
WHERE id = $1;

-- name: GetSubcategories :many
SELECT id, name, level, parent_id
FROM categories
WHERE parent_id = $1
ORDER BY name;

-- name: GetCategories :many
SELECT 
    id,
    name,
    level,
    parent_id
FROM categories
ORDER BY level ASC; 

-- name: UpdateCategory :one
UPDATE categories
SET
    name = COALESCE($2, name),
    level = COALESCE($3, level),
    parent_id = COALESCE($4, parent_id)
WHERE id = $1
RETURNING id, name, level, parent_id;

-- name: DeleteCategory :exec
DELETE FROM categories
WHERE id = $1;