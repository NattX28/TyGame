package main_test

import (
	"testing"
	"user-service"
)

func TestDownloadImage(t *testing.T) {
	tests := []struct {
		name string // description of this test case
		// Named input parameters for target function.
		url      string
		filepath string
		wantErr  bool
	}{
		// TODO: Add test cases.
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			gotErr := main.DownloadImage(tt.url, tt.filepath)
			if gotErr != nil {
				if !tt.wantErr {
					t.Errorf("DownloadImage() failed: %v", gotErr)
				}
				return
			}
			if tt.wantErr {
				t.Fatal("DownloadImage() succeeded unexpectedly")
			}
		})
	}
}

func TestDownloadImage(t *testing.T) {
	tests := []struct {
		name string // description of this test case
		// Named input parameters for target function.
		url      string
		filepath string
		wantErr  bool
	}{
		// TODO: Add test cases.
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			gotErr := main.DownloadImage(tt.url, tt.filepath)
			if gotErr != nil {
				if !tt.wantErr {
					t.Errorf("DownloadImage() failed: %v", gotErr)
				}
				return
			}
			if tt.wantErr {
				t.Fatal("DownloadImage() succeeded unexpectedly")
			}
		})
	}
}

func TestDownloadImage(t *testing.T) {
	tests := []struct {
		name string // description of this test case
		// Named input parameters for target function.
		url      string
		filepath string
		wantErr  bool
	}{
		// TODO: Add test cases.
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			gotErr := main.DownloadImage(tt.url, tt.filepath)
			if gotErr != nil {
				if !tt.wantErr {
					t.Errorf("DownloadImage() failed: %v", gotErr)
				}
				return
			}
			if tt.wantErr {
				t.Fatal("DownloadImage() succeeded unexpectedly")
			}
		})
	}
}

func TestDownloadImage(t *testing.T) {
	tests := []struct {
		name string // description of this test case
		// Named input parameters for target function.
		url      string
		filepath string
		wantErr  bool
	}{
		// TODO: Add test cases.
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			gotErr := main.DownloadImage(tt.url, tt.filepath)
			if gotErr != nil {
				if !tt.wantErr {
					t.Errorf("DownloadImage() failed: %v", gotErr)
				}
				return
			}
			if tt.wantErr {
				t.Fatal("DownloadImage() succeeded unexpectedly")
			}
		})
	}
}
