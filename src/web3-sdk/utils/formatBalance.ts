import BigNumber from 'bignumber.js';
import { BIG_TEN } from './bigNumber';
import { ethers } from 'ethers';
import { usePrecision } from '@vueuse/math'
type BN = BigNumber | string | number;
/**
 * Take a formatted amount, e.g. 15 BNB and convert it to full decimal value, e.g. 15000000000000000
 * 加精度 0
 */

export const getDecimalAmount = (amount: BN, decimals = 18) => {
  return new BigNumber(amount).times(BIG_TEN.pow(decimals));
};

/**
 * 去掉18个0
 * @param amount
 * @param decimals 精度 默认18
 * @returns
 */
export const getBalanceAmount = (amount: BN, decimals = 18) => {
  return new BigNumber(amount).dividedBy(BIG_TEN.pow(decimals));
};

/**
 * 没用过 不管
 * @param validDecimal
 * @param decimals
 * @returns
 */
export const getValidDecimal = (validDecimal = 3, decimals = 18) => {
  return BIG_TEN.pow(decimals - validDecimal);
};

/**
 * This function is not really necessary but is used throughout the site.
 * 除18个0 返回数字
 */
export const getBalanceNumber = (balance: BN, decimals = 18) => {
  return getBalanceAmount(balance, decimals).toNumber();
};

/**
 * This function is not really necessary but is used throughout the site.
 * 除18个0 返回数字
 */
export const getServerNumber = (balance: number) => {
  return getBalanceAmount(new BigNumber(balance), 4).toNumber();
};

/**
 * 除18个0后 保留三位小数 100000000000000000 => 1.000
 * @param balance
 * @param decimals
 * @param displayDecimals 保留几位小数 默认三位
 * @returns
 */
export const getFullDisplayBalance = (balance: BN, decimals = 18, displayDecimals = 3) => {
  return getBalanceAmount(balance, decimals).toFixed(displayDecimals);
};

/**
 * 本地化显示
 * 10000 => 10,000
 * @param number
 * @param minPrecision
 * @param maxPrecision
 * @returns
 */
export const formatNumber = (number: number, minPrecision = 2, maxPrecision = 2) => {
  const options = {
    minimumFractionDigits: minPrecision,
    maximumFractionDigits: maxPrecision
  };
  return usePrecision(number, 2, { math: 'floor' });
  // return number.toFixed(2).toLocaleString(undefined, options);
};

// 用户界面可用的数据转换成链上数据
export function fromReadableAmount(amount: number | string, decimals: number = 6) {
  return ethers.utils.parseUnits(amount.toString(), decimals);
}
// 链上数据转换成用户界面可用的数据
export function toReadableAmount(rawAmount: number, decimals: number = 18): string {
  return ethers.utils.formatUnits(rawAmount, decimals);
}


// 加法
export function addDecimals(a, b, decimals = 18) {
  const value1 = ethers.utils.parseUnits(a.toString(), decimals);
  const value2 = ethers.utils.parseUnits(b.toString(), decimals);
  return ethers.utils.formatUnits(value1.add(value2), decimals);
}

// 减法
export function subDecimals(a, b, decimals = 18) {
  const value1 = ethers.utils.parseUnits(a.toString(), decimals);
  const value2 = ethers.utils.parseUnits(b.toString(), decimals);
  return ethers.utils.formatUnits(value1.sub(value2), decimals);
}

// 乘法
export function mulDecimals(a, b, decimals = 18) {
  const value1 = ethers.utils.parseUnits(a.toString(), decimals);
  const value2 = ethers.utils.parseUnits(b.toString(), decimals);
  return ethers.utils.formatUnits(
    value1.mul(value2).div(ethers.utils.parseUnits("1", decimals)),
    decimals
  );
}

// 除法
export function divDecimals(a, b, decimals = 18) {
  const value1 = ethers.utils.parseUnits(a.toString(), decimals);
  const value2 = ethers.utils.parseUnits(b.toString(), decimals);
  return ethers.utils.formatUnits(
    value1.mul(ethers.utils.parseUnits("1", decimals)).div(value2),
    decimals
  );
}