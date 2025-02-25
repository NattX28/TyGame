package repository

import (
	"errors"
	"party-service/db"
	"party-service/models"
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

func FindAvailableParty(maxSlots int) (*models.Party, error) {
	var party models.Party
	// หาห้องที่ว่างและกำหนดจำนวนคนที่ผู้ใช้อยากเข้าด้วย
	result := db.DB.Preload("Members").
		Where("status = ? AND MaxSlots = ?", models.PartyStatusOpen, maxSlots).
		First(&party)

	// ถ้าไม่เจอข้อมูล ให้ return nil, nil แทน
	if result.Error != nil {
		if errors.Is(result.Error, gorm.ErrRecordNotFound) {
			return nil, nil
		}
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

func LeaveParty(userID uuid.UUID) error {
	var member models.PartyMember
	tx := db.DB.Begin()

	// ค้นหาว่า User อยู่ห้องไหน
	if err := tx.Where("user_id = ?", userID).First(&member).Error; err != nil {
		tx.Rollback()
		return errors.New("user is not in any party")
	}

	// ดึงข้อมูลห้องที่ User อยู่ออกมา
	var party models.Party
	if err := tx.First(&party, member.PartyID).Error; err != nil {
		tx.Rollback()
		return errors.New("party not found")
	}

	// ลบ User ออกจากห้อง
	if err := tx.Delete(&member).Error; err != nil {
		tx.Rollback()
		return err
	}

	// เช็คว่าห้องยังมีสมาชิกเหลือไหม
	var remainingMembers int64
	tx.Model(&models.PartyMember{}).Where("party_id = ?", party.ID).Count(&remainingMembers)

	if remainingMembers == 0 {
		// ถ้าไม่มีสมาชิกเหลือ → ลบห้อง
		if err := tx.Delete(&party).Error; err != nil {
			tx.Rollback()
			return err
		}
	} else {
		// ถ้ายังมีสมาชิกอยู่ → เปลี่ยน status กลับเป็น Open
		if party.Status == models.PartyStatusFull {
			party.Status = models.PartyStatusOpen
			if err := tx.Save(&party).Error; err != nil {
				tx.Rollback()
				return err
			}
		}
	}

	return tx.Commit().Error
}
