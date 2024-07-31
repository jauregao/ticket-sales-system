package domain

type SpotStatus string

const (
	SpotStatusAvaliable SpotStatus = "avaliable"
	SpotStatusSold 			SpotStatus = "sold"
)

type Spot struct {
	ID 			 string
	EventID  string
	Name		 string
	Status	 SpotStatus
	TicketID string
}
