import { SelectQueryBuilder } from 'typeorm';
import { Expose } from 'class-transformer';

export interface PaginationOptions {
  pageSize?: number;
  pageNumber?: number;
  totalCount?: boolean;
}

export class PaginationResult<T> {
  constructor(partial: Partial<PaginationResult<T>>) {
    Object.assign(this, partial);
  }

  @Expose()
  pageSize?: number;
  @Expose()
  pageNumber?: number;
  @Expose()
  totalCount?: number;
  @Expose()
  data: T[];
}

export async function paginate<T>(options: PaginationOptions = {
  pageNumber: 1,
  pageSize: 10,
  totalCount: true
}, queryBuilder: SelectQueryBuilder<T>): Promise<PaginationResult<T>> {

  const start = (options.pageNumber - 1) * options.pageSize;
  const data = await queryBuilder.limit(options.pageSize).offset(start).getMany();
  return new PaginationResult<T>({
    pageSize: options.pageSize,
    pageNumber: options.pageNumber,
    totalCount: options.totalCount ? await queryBuilder.getCount() : null,
    data
  });
}
