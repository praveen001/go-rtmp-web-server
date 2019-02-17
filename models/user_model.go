package models

import (
	"errors"
	"regexp"
	"time"

	jwt "github.com/dgrijalva/jwt-go"
	"github.com/jinzhu/gorm"
)

// Model base
type Model struct {
	ID        int        `json:"id" gorm:"primary_key"`
	CreatedAt time.Time  `json:"-"`
	UpdatedAt time.Time  `json:"-"`
	DeletedAt *time.Time `json:"-" sql:"index"`
}

// User ..
type User struct {
	Model
	Name              string   `json:"name"`
	Email             string   `json:"email" gorm:"unique"`
	Password          string   `json:"password"`
	IsVerified        bool     `json:"isVerified"`
	VerificationToken string   `json:"-"`
	Streams           []Stream `json:"streams" gorm:"foreignkey:UserID"`
}

// PublicUserData has the public information of an user
type PublicUserData struct {
	*User
	Password string `json:"password,omitempty"`
}

// CanRegister validates the user for registration
func (u User) CanRegister(db *gorm.DB) (errorMap map[string]string) {
	errorMap = make(map[string]string)
	if u.Name == "" {
		errorMap["name"] = "Name cannot be blank"
	}

	var c int

	if u.Email == "" {
		errorMap["email"] = "Email cannot be blank"
	} else if re := regexp.MustCompile("^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$"); !re.MatchString(u.Email) {
		errorMap["email"] = "Given email is not valid"
	} else if db.Model(&User{}).Where(&User{Email: u.Email}).Count(&c); c != 0 {
		errorMap["email"] = "Email address already in use"
	}

	if u.Password == "" {
		errorMap["password"] = "Password cannot be blank"
	} else if len(u.Password) < 6 {
		errorMap["password"] = "Password must be atleast 6 characters long"
	}

	return
}

// Register creates a new user in database
func (u *User) Register(db *gorm.DB) error {
	u.VerificationToken = "12345"
	return db.Create(u).Error
}

// SendVerificationEmail sends the verification link in email
func (u User) SendVerificationEmail() error {
	return nil
}

// VerifyUser marks the user as verified
func (u *User) VerifyUser(db *gorm.DB, token string) error {
	if u.VerificationToken != token {
		return errors.New("Invalid token")
	}

	u.IsVerified = true
	u.VerificationToken = ""

	return db.Save(u).Error
}

// GetJWT generates a JWT token for the user
func (u User) GetJWT() (string, error) {
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"email": u.Email,
		"id":    u.ID,
	})
	return token.SignedString([]byte("Secret"))
}

// CanLogin checks validates user for login
func (u *User) CanLogin(db *gorm.DB) (errorMap map[string]string) {
	errorMap = make(map[string]string)
	if u.Email == "" {
		errorMap["email"] = "Email is required"
	}

	if u.Password == "" {
		errorMap["password"] = "Password is required"
	}

	db.Where(u).First(u)
	if u.ID == 0 {
		errorMap["login"] = "Invalid username/password"
	}

	return
}

// FindByEmail returns a user for an given email
func (u *User) FindByEmail(db *gorm.DB) error {
	return db.Where("email = ?", u.Email).First(u).Error
}
