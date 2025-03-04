
import BigNumber from 'bignumber.js';

// 1 个BTC 等于 1 亿个 sats
const satsValue = 100000000;
// 总价值转成 BTC
export const totalAmout = (totalNum:any) => {
  const total = new BigNumber(totalNum).dividedBy(satsValue);
  return total.toNumber();
};
