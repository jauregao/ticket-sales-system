import {
  Controller,
  Get,
  Body,
  Patch,
  Param,
  Post,
  Delete,
} from '@nestjs/common';
import { SpotsService } from '@app/core/spots/spots.service';
import { UpdateSpotRequest } from './request/update-spot.request';
import { CreateMultipleSpotsRequest } from './request/create-multiple-spots.request';

@Controller('events/:eventId/spots')
export class SpotsController {
  constructor(private readonly spotsService: SpotsService) {}

  @Post()
  create(@Param('eventId') eventId: string, @Body() createSpotRequest) {
    return this.spotsService.create(eventId, createSpotRequest);
  }

  @Post('multiple')
  createMultipleSpots(
    @Param('eventId') eventId: string,
    @Body() createMultipleSpotsRequest: CreateMultipleSpotsRequest,
  ) {
    return this.spotsService.createMultiple(eventId, createMultipleSpotsRequest);
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
    @Body() updateSpotRequest: UpdateSpotRequest,
  ) {
    return this.spotsService.update(spotId, eventId, updateSpotRequest);
  }

  @Delete(':spotId')
  remove(@Param('spotId') spotId: string, @Param('eventId') eventId: string) {
    return this.spotsService.remove(spotId, eventId);
  }
}
