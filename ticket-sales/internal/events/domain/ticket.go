package domain

type TicketType string

const (
	TicketTypeHalf TicketType = "half"
	TicketTypeFull TicketType = "full"
)

type Ticket struc {
	ID 					string
	EventID 		string
	Spot 				*Spot //ponteiro, qualquer alteração feita reflete em todo o código
	TicketType  TicketType
	Price				float64
}
