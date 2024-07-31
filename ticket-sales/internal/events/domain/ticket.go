package domain

import "errors"

type TicketType string

var (
	ErrInvalidTicketType  = errors.New("ticket type  is invalid")
	ErrInvalidTicketPrice = errors.New("ticket price must be greater than 0")
)

const (
	TicketTypeHalf TicketType = "half"
	TicketTypeFull TicketType = "full"
)

type Ticket struct {
	ID         string
	EventID    string
	Spot       *Spot //ponteiro, qualquer alteração feita reflete em todo o código
	TicketType TicketType
	Price      float64
}

func IsValidTicketType(ticketType TicketType) bool {
	return ticketType == TicketTypeFull || ticketType == TicketTypeHalf
}

func (t *Ticket) CalculatePrice() {
	if t.TicketType == TicketTypeHalf {
		t.Price /= 2
	}
}

func (t *Ticket) Validate() error {
	if t.Price < 0 {
		return ErrInvalidTicketPrice
	}
	return nil
}
