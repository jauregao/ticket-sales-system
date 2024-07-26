import {
  Controller,
  Get,
  Body,
  Patch,
  Param,
  Post,
  Delete,
} from '@nestjs/common';
import { SpotsService } from './spots.service';
import { UpdateSpotDto } from './dto/update-spot.dto';
import { CreateMultipleSpotsDto } from './dto/create-multiple-spots.dto';

@Controller('events/:eventId/spots')
export class SpotsController {
  constructor(private readonly spotsService: SpotsService) {}

  @Post()
  create(@Param('eventId') eventId: string, @Body() createSpotDto) {
    return this.spotsService.create(eventId, createSpotDto);
  }

  @Post('multiple')
  createMultipleSpots(
    @Param('eventId') eventId: string,
    @Body() createMultipleSpotsDto: CreateMultipleSpotsDto,
  ) {
    return this.spotsService.createMultiple(eventId, createMultipleSpotsDto);
  }

  @Get()
  findAll(@Param('eventId') eventId: string) {
    return this.spotsService.findAll(eventId);
  }

  @Get(':spotId')
  findOne(@Param('spotId') spotId: string, @Param('eventId') eventId: string) {
    return this.spotsService.findOne(spotId, eventId);
  }

  @Patch(':spotId')
  update(
    @Param('spotId') spotId: string,
    @Param('eventId') eventId: string,
    @Body() updateSpotDto: UpdateSpotDto,
  ) {
    return this.spotsService.update(spotId, eventId, updateSpotDto);
  }

  @Delete(':spotId')
  remove(@Param('spotId') spotId: string, @Param('eventId') eventId: string) {
    return this.spotsService.remove(spotId, eventId);
  }
}
