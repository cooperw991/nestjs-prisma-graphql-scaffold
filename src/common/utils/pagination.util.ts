import { PagingInfo } from '@Dto/paging-info.dto';

interface PrismaPagination {
  skip: number;
  take: number;
}

export const maxTakeLimit = 500;

export function prismaPaging(paging: PrismaPagination): PrismaPagination {
  if (!paging) {
    return {
      skip: 0,
      take: maxTakeLimit,
    };
  }
  return paging;
}

export function pagingResponse(
  paging: PrismaPagination,
  totalCount: number,
): PagingInfo {
  if (!paging) {
    return {
      totalCount,
      currentOffset: 0,
      take: maxTakeLimit,
    };
  }
  return {
    totalCount,
    currentOffset: paging.skip,
    take: paging.take,
  };
}
