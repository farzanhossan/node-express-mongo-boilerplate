/* eslint-disable no-param-reassign */
/* eslint-disable import/prefer-default-export */
import { Response } from 'express';

export const resSend = (response: any, status: number, res: Response, message?: string) => {
  const orgResponse: any = {
    data: null,
    message: message || 'Success',
    isSuccess: true,
    status,
  };
  if (response?.results) {
    orgResponse.data = response.results;
    orgResponse.totalPages = response.totalPages;
    orgResponse.totalResults = response.totalResults;
    orgResponse.page = response.page;
    orgResponse.limit = response.limit;
  } else {
    orgResponse.data = response;
  }
  res.status(status);
  res.json(orgResponse);
  return res.end();
};
