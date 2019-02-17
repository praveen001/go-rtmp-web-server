package controllers

import (
	"encoding/json"
	"net/http"

	"github.com/praveen001/go-rtmp-web-server/models"
)

// RegisterUser adds a new user to database
func (c *ApplicationContext) RegisterUser(w http.ResponseWriter, r *http.Request) {
	user := &models.User{}
	if err := json.NewDecoder(r.Body).Decode(user); err != nil {
		c.NewResponse(w).Status(400).SendJSON(Response{
			Error:   true,
			Message: "Unable to parse request",
		})
		return
	}

	if errorMap := user.CanRegister(c.DB); len(errorMap) != 0 {
		c.NewResponse(w).Status(400).SendJSON(Response{
			Error:   true,
			Message: "Validation error",
			Data:    errorMap,
		})
		return
	}

	if err := user.Register(c.DB); err != nil {
		c.NewResponse(w).Status(200).SendJSON(Response{
			Error:   true,
			Message: "Unknown error occured while registering",
		})
		return
	}

	if err := user.SendVerificationEmail(); err != nil {
		// Just Log and Ignore
	}

	token, _ := user.GetJWT()

	c.NewResponse(w).Status(200).SendJSON(Response{
		Message: "Successfully Registered",
		Data: map[string]interface{}{
			"token": token,
			"user":  models.PublicUserData{User: user},
		},
	})
}

// VerifyUser marks an user as verified user
func (c *ApplicationContext) VerifyUser(w http.ResponseWriter, r *http.Request) {
	query := r.URL.Query()
	email := query.Get("email")
	token := query.Get("token")

	if email == "" || token == "" {
		c.NewResponse(w).Status(200).SendJSON(Response{
			Error:   true,
			Message: "Missing email/token",
		})
		return
	}

	user := models.User{
		Email: email,
	}
	user.FindByEmail(c.DB)
	if err := user.VerifyUser(c.DB, token); err != nil {
		c.NewResponse(w).Status(403).SendJSON(Response{
			Error:   true,
			Message: err.Error(),
		})
		return
	}

	c.NewResponse(w).Status(200).SendJSON(Response{
		Message: "Successfully verified",
	})
}

// LoginUser login handler
func (c *ApplicationContext) LoginUser(w http.ResponseWriter, r *http.Request) {
	user := &models.User{}
	if err := json.NewDecoder(r.Body).Decode(user); err != nil {
		c.NewResponse(w).Status(http.StatusBadRequest).SendJSON(Response{
			Error:   true,
			Message: "Unable to parse request",
		})
		return
	}

	if errorMap := user.CanLogin(c.DB); len(errorMap) != 0 {
		c.NewResponse(w).Status(http.StatusOK).SendJSON(Response{
			Error:   true,
			Message: "Validation error",
			Data:    errorMap,
		})
		return
	}

	token, _ := user.GetJWT()

	c.NewResponse(w).Status(200).SendJSON(Response{
		Message: "Successfully logged in",
		Data: map[string]interface{}{
			"token": token,
			"user":  models.PublicUserData{User: user},
		},
	})
}

// TokenInfo returns information about user by decoding the JWT token
func (c *ApplicationContext) TokenInfo(w http.ResponseWriter, r *http.Request) {
	user := &models.User{
		Model: models.Model{
			ID: int(r.Context().Value("id").(float64)),
		},
	}
	c.DB.Find(&user, user)

	c.NewResponse(w).Status(200).SendJSON(Response{
		Data: models.PublicUserData{User: user},
	})
}
