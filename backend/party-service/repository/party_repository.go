package repository

import (
    "errors"
    "time"
    "party-service/db"
    "party-service/models"
    "github.com/google/uuid"
)

func FindAvailableParty() (*models.Party, error) {
    var party models.Party
    
    result := db.DB.Preload("Members").
        Where("status = ?", models.PartyStatusOpen).
        First(&party)
    
    if result.Error != nil {
        return nil, result.Error
    }
    
    return &party, nil
}

func CreateParty(maxSlots int) (*models.Party, error) {
    party := &models.Party{
        Status:    models.PartyStatusOpen,
        MaxSlots:  maxSlots,
        CreatedAt: time.Now(),
    }
    
    if err := db.DB.Create(party).Error; err != nil {
        return nil, err
    }
    
    return party, nil
}

func JoinParty(partyID uint, userID uuid.UUID) error {
    var party models.Party
    
    tx := db.DB.Begin()
    
    if err := tx.Preload("Members").First(&party, partyID).Error; err != nil {
        tx.Rollback()
        return err
    }
    
    if len(party.Members) >= party.MaxSlots {
        tx.Rollback()
        return errors.New("party is full")
    }
    
    member := models.PartyMember{
        PartyID:  partyID,
        UserID:   userID,
        JoinedAt: time.Now(),
    }
    
    if err := tx.Create(&member).Error; err != nil {
        tx.Rollback()
        return err
    }
    
    if len(party.Members)+1 >= party.MaxSlots {
        party.Status = models.PartyStatusFull
        if err := tx.Save(&party).Error; err != nil {
            tx.Rollback()
            return err
        }
    }
    
    return tx.Commit().Error
}

func GetPartyMembers(partyID uint) ([]models.PartyMember, error) {
    var members []models.PartyMember
    err := db.DB.Where("party_id = ?", partyID).Find(&members).Error
    return members, err
}