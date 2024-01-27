import { SelectQueryBuilder } from 'typeorm';

export interface PaginationOptions {
  pageSize?: number;
  pageNumber?: number;
  totalCount?: boolean;
}

export interface PaginationResult<T> {
  pageSize?: number;
  pageNumber?: number;
  totalCount?: number;
  data: T[];
}

export async function paginate<T>(options: PaginationOptions = {
  pageNumber: 1,
  pageSize: 10,
  totalCount: true
}, queryBuilder: SelectQueryBuilder<T>): Promise<PaginationResult<T>> {

  const start = (options.pageNumber - 1 )* options.pageSize;
  const data = await queryBuilder.limit(options.pageSize).offset(start).getMany();
  return {
    pageSize: options.pageSize,
    pageNumber: options.pageNumber,
    totalCount: options.totalCount ? await queryBuilder.getCount() : null,
    data
  };
}
