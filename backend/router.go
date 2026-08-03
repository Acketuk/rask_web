package main

import (
	"github.com/Acketuk/rask_web.git/handler"
	"github.com/Acketuk/rask_web.git/middleware"
	"github.com/go-chi/chi/v5"
)

func initRouter(r *chi.Mux, u *handler.UserHandler, c *handler.CategoryHandler, a *handler.AdHandler, ch *handler.ChatHandler, jwtSecret string) {
	r.Use(middleware.CORS)

	r.Get("/health", handler.CheckHealth)

	r.Route("/api/v1", func(r chi.Router) {
		r.Route("/auth", func(r chi.Router) {
			r.Post("/refresh", u.RefreshToken)
			r.Post("/logout", u.Logout)
		})

		r.Route("/users", func(r chi.Router) {
			r.Post("/", u.RegisterUser)
			r.Post("/login", u.LoginUser)
			r.Get("/{id}", u.GetUser)
			r.Group(func(r chi.Router) {
				r.Use(middleware.RequireAuth(jwtSecret))
				r.Get("/me", u.GetMe)
				r.Put("/{id}", u.UpdateUser)
				r.Delete("/{id}", u.DeleteUser)
			})
		})

		r.Route("/categories", func(r chi.Router) {
			r.Get("/", c.GetCategories)
			r.Get("/{id}", c.GetCategory)
			r.Group(func(r chi.Router) {
				r.Use(middleware.RequireAuth(jwtSecret))
				r.Post("/", c.CreateCategory)
				r.Put("/{id}", c.UpdateCategory)
				r.Delete("/{id}", c.DeleteCategory)
			})
		})

		r.Get("/ws", ch.ServeWS)

		r.Route("/conversations", func(r chi.Router) {
			r.Use(middleware.RequireAuth(jwtSecret))
			r.Get("/", ch.ListConversations)
			r.Post("/", ch.StartConversation)
			r.Get("/{id}", ch.GetConversation)
		})

		r.Route("/ads", func(r chi.Router) {
			r.Get("/", a.GetAds)
			r.Get("/count", a.GetAdCount)
			r.Get("/search", a.SearchAds)
			r.Get("/user/{userId}", a.GetAdsByUser)
			r.Get("/{id}", a.GetAd)
			r.Get("/category/{categoryId}", a.GetAdsByCategory)
			r.Group(func(r chi.Router) {
				r.Use(middleware.RequireAuth(jwtSecret))
				r.Post("/", a.CreateAd)
				r.Put("/{id}", a.UpdateAd)
				r.Delete("/{id}", a.DeleteAd)
			})
		})
	})
}
