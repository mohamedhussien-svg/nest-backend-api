import {
  ClassSerializerInterceptor,
  Controller, DefaultValuePipe,
  Get,
  Param, ParseIntPipe,
  Query,
  SerializeOptions, UseGuards,
  UseInterceptors
} from '@nestjs/common';
import { AttendeeService } from './attendee.service';
import { Attendee } from './attendee';
import { PaginationResult } from '../pagination/paginator';
import { AuthGuardJwt } from '../auth/auth.guard.jwt';

@Controller('/attendee')
@SerializeOptions({ strategy: 'excludeAll' })
export class AttendeeController {

  constructor(private readonly attendeeService: AttendeeService) {
  }


  @Get('/:userId')
  @UseInterceptors(ClassSerializerInterceptor)
  @UseGuards(AuthGuardJwt)
  public async getAttendeeBuUser(@Param('userId', ParseIntPipe) userId: number,
                                 @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number = 1,
                                 @Query('size', new DefaultValuePipe(1), ParseIntPipe) size: number = 5
  ): Promise<PaginationResult<Attendee>> {
    return await this.attendeeService.findAttendeeByUser(userId, {
      pageNumber: page,
      pageSize: size,
      totalCount: true
    });
  }
}
