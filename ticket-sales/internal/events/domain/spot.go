package domain

import (
	"errors"

	"github.com/google/uuid"
)

var (
	ErrInvalidSpotNumber   = errors.New("invalid spot number")
	ErrSpotNotFound        = errors.New("spot not foound")
	ErrSpotAlreadyReserved = errors.New("spot is already reserved")
	ErrSpotNameRequired    = errors.New("spot name is required")
	ErrSpotNameMinLen      = errors.New("spot name must be 2 characters long")
	ErrSpotNameStartChar   = errors.New("spot name must start with a letter")
	ErrSpotNameEndChar     = errors.New("spot name must end with a number")
)

type SpotStatus string

const (
	SpotStatusAvaliable SpotStatus = "avaliable"
	SpotStatusSold      SpotStatus = "sold"
)

type Spot struct {
	ID       string
	EventID  string
	Name     string
	Status   SpotStatus
	TicketID string
}

func NewSpot(event *Event, name string) (*Spot, error) {
	//creates a address in memmory and alocate data
	spot := &Spot{
		ID:      uuid.New().String(),
		EventID: event.ID,
		Name:    name,
		Status:  SpotStatusAvaliable,
	}

	if err := spot.Validate(); err != nil {
		return nil, err
	}

	return spot, nil
}

// checks if the spot data is valid.
func (s *Spot) Validate() error {
	if s.Name == "" {
		return ErrEventNameRequired
	}

	if len(s.Name) < 2 {
		return ErrEventNameRequired
	}

	if s.Name[0] < 'A' || s.Name[0] > 'z' {
		return ErrEventNameRequired
	}

	if s.Name[len(s.Name)-1] < '0' || s.Name[len(s.Name)-1] > '9' {
		return ErrEventNameRequired
	}

	return nil
}
