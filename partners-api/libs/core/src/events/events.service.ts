import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma, SpotStatus, TicketStatus } from '@prisma/client';
import { ReserveSpotDto } from './dto/reserve-spot.dto';

@Injectable()
export class EventsService {
  constructor(private readonly prismaService: PrismaService) {}

  create(createEventDto: CreateEventDto) {
    return this.prismaService.event.create({
      data: {
        ...createEventDto,
        date: new Date(createEventDto.date),
      },
    });
  }

  findAll() {
    return this.prismaService.event.findMany();
  }

  findOne(id: string) {
    return this.prismaService.event.findFirst({
      where: { id },
    });
  }

  update(id: string, updateEventDto: UpdateEventDto) {
    return this.prismaService.event.update({
      data: {
        ...updateEventDto,
        date: new Date(updateEventDto.date),
      },
      where: { id },
    });
  }

  remove(id: string) {
    return this.prismaService.event.delete({
      where: { id },
    });
  }

  async reserveSpot(dto: ReserveSpotDto & { eventId: string }) {
    const event = await this.prismaService.event.findUnique({
      where: { id: dto.eventId },
    });

    if (!event) {
      throw new BadRequestException('Event does not exist.');
    }

    const spots = await this.prismaService.spot.findMany({
      where: {
        eventId: dto.eventId,
        name: {
          in: dto.spots,
        },
      },
    });

    if (spots.length !== dto.spots.length) {
      const foundSpotsName = spots.map((spot) => spot.name);
      const notFoundSpotsNames = dto.spots.filter(
        (spotName) => !foundSpotsName.includes(spotName),
      );

      throw new BadRequestException(
        `Spot(s) ${notFoundSpotsNames.join(', ')} not available`,
      );
    }
    try {
      return await this.prismaService.$transaction(async (prisma) => {
        await prisma.reservationHistory.createMany({
          data: spots.map((spot) => ({
            spotId: spot.id,
            ticketKind: dto.ticket_kind,
            email: dto.email,
            status: TicketStatus.reserved,
          })),
        });

        await prisma.spot.updateMany({
          where: {
            id: {
              in: spots.map((spot) => spot.id),
            },
          },
          data: {
            status: SpotStatus.reserved,
          },
        });

        const tickets = await Promise.all(
          spots.map((spot) =>
            prisma.ticket.create({
              data: {
                spotId: spot.id,
                ticketKind: dto.ticket_kind,
                email: dto.email,
              },
            }),
          ),
        );

        return tickets;
      }, {isolationLevel: Prisma.TransactionIsolationLevel.ReadCommitted});
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        switch (e.code) {
          case 'P2002': //unique constraint violation
          case 'P2034': //transaction conflict
            throw new Error('Some spots are already reserved.');
        }
      }
      throw e;
    }
  }
}
