import { ApiError } from './ApiError';

export function getPagination(query: Record<string, unknown>) {
  const rawPage = query.page === undefined ? 1 : Number(query.page);
  const rawLimit = query.limit === undefined ? 10 : Number(query.limit);

  if (!Number.isInteger(rawPage) || rawPage < 1) {
    throw new ApiError(400, 'Invalid page value');
  }
  if (!Number.isInteger(rawLimit) || rawLimit < 1) {
    throw new ApiError(400, 'Invalid limit value');
  }

  const page = rawPage;
  const limit = Math.min(rawLimit, 100);
  const skip = (page - 1) * limit;

  return { page, limit, skip };
}

export function buildPagination(total: number, page: number, limit: number) {
  return {
    page,
    limit,
    total,
    totalPages: Math.ceil(total / limit) || 0,
  };
}
