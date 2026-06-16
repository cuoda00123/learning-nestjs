import { Inject, Injectable } from '@nestjs/common';
import { ObjectLiteral, Repository } from 'typeorm';
import { PaginationQueryDto } from '../dto/pagination-query.dto';
import { REQUEST } from '@nestjs/core';
import type { Request } from 'express';
import { paginated } from '../interfaces/paginated.interface';
@Injectable()
export class PaginationProvider {
  constructor(
    @Inject(REQUEST)
    private readonly request: Request,
  ) {}
  public async paginateQuery<T extends ObjectLiteral>(
    paginationQuery: PaginationQueryDto,
    repository: Repository<T>,
  ): Promise<paginated<T>> {
    const results = await repository.find({
      skip: ((paginationQuery?.page ?? 0) - 1) * (paginationQuery?.limit ?? 0),
      take: paginationQuery ? paginationQuery.limit : undefined,
    });

    const baseUrl = this.request.protocol + '://' + this.request.headers.host + '/';
    const newUrl = new URL(this.request.url, baseUrl);
    // console.log(newUrl);
    // console.log(baseUrl);

    const totalItems = await repository.count();
    const totalPages = Math.ceil(totalItems / (paginationQuery?.limit ?? 0));
    const nextPage =
      paginationQuery.page && paginationQuery.page < totalPages ? paginationQuery.page + 1 : null;

    const previousPage =
      paginationQuery.page && paginationQuery.page > 1 ? paginationQuery.page - 1 : null;

    const finalResponse: paginated<T> = {
      data: results,
      meta: {
        itemsPerPage: paginationQuery.limit ? paginationQuery.limit : 10,
        totalItems: totalItems,
        currentPage: paginationQuery.page ? paginationQuery.page : 1,
        totalPages: totalPages,
      },
      links: {
        first: `${newUrl}${newUrl.pathname}?limit=${paginationQuery.limit}&page=1`,
        previous: `${newUrl}${newUrl.pathname}?limit=${paginationQuery.limit}&page=${previousPage}`,
        next: `${newUrl}${newUrl.pathname}?limit=${paginationQuery.limit}&page=${nextPage}`,
        last: `${newUrl}${newUrl.pathname}?limit=${paginationQuery.limit}&page=${totalPages}`,
        current: `${newUrl}${newUrl.pathname}?limit=${paginationQuery.limit}&page=${paginationQuery.page}`,
      },
    };
    return finalResponse;
  }
}
