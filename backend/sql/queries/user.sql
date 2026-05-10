-- name: CreateUser :one
INSERT INTO users (name, email, password, phone_number)
VALUES ($1, $2, $3, $4)
RETURNING id, name, email, phone_number, created_at;

-- name: GetUserByID :one
SELECT id, name, email, phone_number, created_at
FROM users
WHERE id = $1;

-- name: GetUserByEmail :one
SELECT id, email, password
FROM users
WHERE email = $1;
