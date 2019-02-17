package models

import (
	"github.com/jinzhu/gorm"
)

// Channel ..
type Channel struct {
	Model
	Name     string `json:"name"`
	URL      string `json:"url"`
	Key      string `json:"key"`
	Enabled  bool   `json:"enabled"`
	StreamID int    `json:"streamId"`
}

// AddChannel to database
func (c Channel) AddChannel(db *gorm.DB) {

}
