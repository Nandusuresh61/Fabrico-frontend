import API from './api';

export const generateSalesReportApi = (params) => 
  API.get('/reports/sales', { params });

export const downloadReportApi = (format, params) => 
  API.get(`/reports/download/${format}`, { 
    params,
    responseType: 'blob'
  });