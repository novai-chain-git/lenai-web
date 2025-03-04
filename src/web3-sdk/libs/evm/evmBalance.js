import { useActiveWebStateRefs } from '../../stores/activeWebState';
import { getERC20Contract } from '../../utils/contractHelpers';
import { addresses } from '../../constants/index';
import { useUserStore } from '@/store/modules/user.js';
import { getAddress } from '../../utils/addressHelpers';
import { getRpcProviderByChain } from '../../utils/providers';
import { toReadableAmount } from '../../utils';
import { Decimals } from '../../wallet/config';

// 获取代币余额
export const getEvmBalance = async (symbol) => {
  const { account } = useActiveWebStateRefs();
  const { collateralCurr } = useUserStore();
  const chainOriginalId = collateralCurr.chainOriginalId;
  const res = await getERC20Contract(
    getAddress(addresses[symbol], chainOriginalId),
    getRpcProviderByChain(chainOriginalId)
  ).balanceOf(account.value);

  const number = toReadableAmount(res, Decimals[symbol][chainOriginalId]);
  const dotIndex = number.indexOf('.');
  const val = {
    hex: res.toJSON(),
    value: number,
    max: number.slice(0, dotIndex + 3)
  };
  return val;
};

// 获取主币余额
export const getContractBalance = async () => {
  const { account } = useActiveWebStateRefs();
  const { borrowCurr } = useUserStore();
  const chainOriginalId = borrowCurr.chainOriginalId;
  const res = getRpcProviderByChain(chainOriginalId);
  const balance = await res.getBalance(account.value);
  const number = toReadableAmount(balance);
  const dotIndex = number.indexOf('.');
  const val = {
    hex: balance,
    value: number.slice(0, dotIndex + 7),
    max: number.slice(0, dotIndex + 3)
  };
  return val;
};
