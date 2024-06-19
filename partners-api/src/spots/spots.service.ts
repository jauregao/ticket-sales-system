import { PrismaService } from './../prisma/prisma.service';
import { BadRequestException, Injectable } from '@nestjs/common';
import { UpdateSpotDto } from './dto/update-spot.dto';
import { CreateSpotDto } from './dto/create-spot.dto';
import { CreateMultipleSpotsDto } from './dto/create-multiple-spots.dto';
import { SpotStatus } from '@prisma/client';
import {
  generateSpotNames,
  customSort,
} from './utils/create-multiple-spots.function';

@Injectable()
export class SpotsService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(eventId: string, createSpotDto: CreateSpotDto) {
    const existingSpot = await this.prismaService.spot.findFirst({
      where: {
        eventId,
        name: createSpotDto.name,
      },
    });

    if (existingSpot) {
      throw new BadRequestException('Spot name already exists for this event.');
    }

    return this.prismaService.spot.create({
      data: {
        name: createSpotDto.name,
        eventId,
        status: SpotStatus.avaliable,
      },
    });
  }

  async createMultiple(
    eventId: string,
    createMultipleSpotsDto: CreateMultipleSpotsDto,
  ) {
    const spotNames = generateSpotNames(createMultipleSpotsDto.numberOfSpots);

    const existingSpots = await this.prismaService.spot.findMany({
      where: { eventId },
      select: { name: true },
    });
    const existingNames = existingSpots.map((spot) => spot.name);

    const uniqueSpotNames = spotNames.filter(
      (name) => !existingNames.includes(name),
    );

    if (uniqueSpotNames.length === 0) {
      throw new BadRequestException('All spot names already exist.');
    }

    const spots = uniqueSpotNames.map((name) => ({
      name,
      eventId,
      status: SpotStatus.avaliable,
    }));

    return this.prismaService.spot.createMany({
      data: spots,
      skipDuplicates: true,
    });
  }

  async findAll(eventId: string) {
    const spots = await this.prismaService.spot.findMany({
      where: { eventId },
    });

    return spots.sort((a, b) => customSort(a.name, b.name));
  }

  findOne(spotId: string, eventId: string) {
    return this.prismaService.spot.findFirst({
      where: {
        id: spotId,
        eventId,
      },
    });
  }

  async reserveSpot(spotId: string, eventId: string) {
    const spot = await this.prismaService.spot.findFirst({
      where: {
        id: spotId,
        eventId,
        status: SpotStatus.avaliable,
      },
    });

    if (!spot) {
      throw new Error('Spot not available');
    }

    return this.prismaService.spot.update({
      where: {
        id: spotId,
      },
      data: {
        status: SpotStatus.reserved,
      },
    });
  }

  update(spotId: string, eventId: string, updateSpotDto: UpdateSpotDto) {
    return this.prismaService.spot.update({
      where: {
        eventId,
        id: spotId,
      },
      data: updateSpotDto,
    });
  }

  remove(spotId: string, eventId: string) {
    return this.prismaService.spot.delete({
      where: {
        id: spotId,
        eventId,
      },
    });
  }
}
