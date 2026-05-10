package main

import (
	"github.com/Acketuk/rask_web.git/handler"
	"github.com/go-chi/chi/v5"
)

func initRouter(r *chi.Mux, u *handler.UserHandler, c *handler.CategoryHandler, a *handler.AdHandler) {

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
			r.Put("/{id}", u.UpdateUser)
			r.Delete("/{id}", u.DeleteUser)
		})

		r.Route("/categories", func(r chi.Router) {
			r.Post("/", c.CreateCategory)
			r.Get("/", c.GetCategories)
			r.Get("/{id}", c.GetCategory)
			r.Put("/{id}", c.UpdateCategory)
			r.Delete("/{id}", c.DeleteCategory)
		})

		r.Route("/ads", func(r chi.Router) {
			r.Post("/", a.CreateAd)
			r.Get("/", a.GetAds)
			r.Get("/{id}", a.GetAd)
			r.Get("/category/{categoryId}", a.GetAdsByCategory)
			r.Put("/{id}", a.UpdateAd)
			r.Delete("/{id}", a.DeleteAd)
		})
	})
}
