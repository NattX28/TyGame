package repository

import (
	"party-service/db"
	"party-service/models"

	"github.com/google/uuid"
)

// create party
func CreateParty(partyID uint) error {
	party := models.Party{
		ID:partyID,
	}

	return db.DB.Create(&party).Error
}

// Add User To Party
func AddUserToParty(userID uuid.UUID, partyID uint) error {
	member := models.PartyMember{UserID:userID, PartyID:partyID}
	return db.DB.Create(&member).Error
}

// Remove User From Party
func removeUserFromParty(userID uuid.UUID,partyID uint) error {
	if err := db.DB.Where("user_id = ? AND party_id = ?",userID,partyID).Delete(&models.PartyMember{}).Error; err != nil {
		return err
	}

	var count int64
	db.DB.Model(&models.PartyMember{}).Where("party_id = ?",partyID).Count(&count)
	if count == 0 {
		db.DB.Delete(&models.Party{}, "id = ?",partyID)
	}
	return nil
}