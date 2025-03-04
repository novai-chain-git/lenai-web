import request from '@/utils/request.js';

// 获得交易分页
export const transactionPageApi = (params) => {
  return request.get('/app-api/transaction/page', { params });
};

// 获得收款地址
export const contractReceiveAddressApi = (params) => {
  return request.get('/app-api/contract/receive-address', { params });
};

// 创建交易
export const transactionCreateApi = (data) => {
  return request.post('/app-api/transaction/create', data);
};

// 地址列表
export const transactionAddressListApi = (data) => {
  return request.post('/app-api/transaction/address-list', data);
};


// 获得提现手续费
export const contractWithdrawFeeApi = (params) => {
  return request.get('/app-api/contract/withdraw-fee', { params });
};

