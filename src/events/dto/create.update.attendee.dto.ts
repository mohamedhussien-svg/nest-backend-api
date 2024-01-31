import { AttendeeStatus } from '../attendee.status.enum';
import { IsEnum } from 'class-validator';

export class CreateUpdateAttendeeDto {

  @IsEnum(AttendeeStatus)
  status: AttendeeStatus;
}
