import { IntersectionType } from '@nestjs/swagger';
import { IsDate, IsOptional } from 'class-validator';
import { PaginationQueryDto } from '../../common/pagination/dto/pagination-query.dto';

class getPostsBaseDto  {
  @IsDate()
  @IsOptional()
  startDate?: Date;

  @IsDate()
  @IsOptional()
  endDate?: Date;
}

export class getPostsDto extends IntersectionType(getPostsBaseDto , PaginationQueryDto) {}
