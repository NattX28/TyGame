package utils

import (
	"net/http"
	"mime/multipart"

	"github.com/google/uuid"
)

func GenerateUniqueFilename(file multipart.File) string {
	// Read first 512 bytes to detect file type
	buffer := make([]byte, 512)
	_, err := file.Read(buffer)
	if err != nil {
		return ""
	}

	fileType := http.DetectContentType(buffer)

	extMap := map[string]string{
		"image/jpeg": ".jpg",
		"image/png":  ".png",
		"image/gif":  ".gif",
	}

	ext, ok := extMap[fileType]
	if !ok {
		return ""
	}

	filename := uuid.New().String() + ext
	return filename
}