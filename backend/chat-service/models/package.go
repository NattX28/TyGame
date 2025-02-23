package models

import (
	"github.com/google/uuid"
)

type Package struct {
	Cmd     	string    	`json:"cmd"`
	Content 	string    	`json:"content"`
	Sender  	uuid.UUID 	`json:"sender"`
}	