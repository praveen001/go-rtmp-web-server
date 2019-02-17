package models

// Stream ..
type Stream struct {
	Model
	Name     string    `json:"name"`
	Key      string    `json:"key"`
	UserID   int       `json:"userId"`
	Channels []Channel `json:"channels" gorm:"foreignkey:StreamID"`
}
