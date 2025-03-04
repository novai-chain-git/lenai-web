import { balanceTokens } from '../tokens';
import { useActiveWebStateRefs } from '../stores/activeWebState';
import { getERC20Contract } from '../utils/contractHelpers';
import { getRpcProviderByChain } from '../utils/providers';
import BigNumber from 'bignumber.js';
import { reactive, watch, ref } from 'vue';
import { maxUint256 } from '../utils/bigNumber';
import { toReadableAmount } from '../utils';
import { addresses, BASE_CHAIN_ID } from '../constants/index';
import { getAddress } from '../utils/addressHelpers';
import { useUserStore } from '@/store/modules/user.js';
import { Decimals } from '../wallet/config';

export const initTokenValue = (_default) => {
  const _init_value = {};
  balanceTokens.forEach((item) => {
    _init_value[item.symbol] = _default;
    _init_value[item.address] = _default;
  });
  return _init_value;
};

// 获取代币某个链余额
export const useAllTokenBalance = (key) => {
  const { account } = useActiveWebStateRefs();
  const tokenBalanceLoading = ref(false);
  const userStore = useUserStore();
  console.log('key', userStore[key]);
  const allBalance = reactive({
    hex: new BigNumber(0),
    value: 0,
    max: 0
  });
  console.log('allBalance：', allBalance);
  const fetchHandle = async (symbol = 'USDT') => {
    if (tokenBalanceLoading.value) return;
    try {
      tokenBalanceLoading.value = true;
      const res = await getERC20Contract(
        getAddress(addresses[symbol], userStore[key].chainOriginalId),
        getRpcProviderByChain(userStore[key].chainOriginalId)
      ).balanceOf(account.value);
      const number = toReadableAmount(res, Decimals[symbol][userStore[key].chainOriginalId]);
      const dotIndex = number.indexOf('.');
      const val = {
        hex: res.toJSON(),
        value: number,
        max: number.slice(0, dotIndex + 3)
      };
      Object.assign(allBalance, val);
      console.log('allBalance：', allBalance);
      console.log('获取代币余额', res, val);
    } catch (error) {
      console.log('获取余额出错：', error);
    } finally {
      tokenBalanceLoading.value = false;
    }
  };

  watch(
    [account, () => userStore[key].nativeCurrency.symbol],
    ([account, currency]) => {
      console.log('currency', currency);

      if (account) {
        fetchHandle();
      }
    },
    {
      immediate: true
    }
  );
  return {
    tokenBalanceLoading,
    allBalance,
    fetchHandle
  };
};

// 从合约查询余额
export const useTokenAllowance = (address: string) => {
  const { account } = useActiveWebStateRefs();

  const allowance = reactive<{ [symbol: string]: BigNumber }>(initTokenValue(new BigNumber(0)));
  const fetchHandle = async () => {
    const res = await Promise.all(
      balanceTokens.map((item) => {
        if (item.isETHER()) {
          return new BigNumber(maxUint256.toString());
        }
        return getERC20Contract(item.address).allowance(account.value, address);
      })
    );
    balanceTokens.forEach((item, index) => {
      allowance[item.symbol] = BigNumber(res[index].toJSON().hex);
      allowance[item.address] = BigNumber(res[index].toJSON().hex);
    });
  };

  watch(
    account,
    (value) => {
      if (value) {
        fetchHandle();
      }
    },
    {
      immediate: true
    }
  );

  return {
    allowance,
    fetchHandle
  };
};

// 授权代币
export const useApproveToken = () => {
  const approveHandle = async (
    address: string,
    sender: string,
    number: string = maxUint256.toString(),
    gasLimit: any = undefined // 根据需要设置 Gas Limit
  ) => {
    const { library, account } = useActiveWebStateRefs();
    if (!account.value) return;
    const signer = library.value?.getSigner();
    const contract = getERC20Contract(address, signer);
    const tx = await contract.approve(sender, number, {
      // 根据需要设置 Gas Limit
      gasLimit
    });
    const receipt = await tx.wait(); // 等待链上确认
    return receipt;
  };

  return {
    approveHandle
  };
};

// 查询提现余额
export const useAllTokenLaunchBridgeBalance = () => {
  const { account } = useActiveWebStateRefs();
  const tokenBalanceLoading = ref(false);
  const userStore = useUserStore();
  const allBalance = reactive({
    hex: new BigNumber(0),
    value: 0,
    max: 0
  });
  const fetchHandle = async (symbol = 'BTC') => {
    if (tokenBalanceLoading.value) return;
    try {
      tokenBalanceLoading.value = true;
      const res = await getERC20Contract(
        getAddress(addresses[symbol], BASE_CHAIN_ID),
        getRpcProviderByChain(BASE_CHAIN_ID)
      ).balanceOf(account.value);
      console.log('res1111', res, symbol);

      const number = toReadableAmount(res, Decimals[symbol][BASE_CHAIN_ID]);
      const dotIndex = number.indexOf('.');
      // max值在btc上的需要多保留几位小数
      const val = {
        hex: res.toJSON(),
        value: number,
        max: number.slice(0, dotIndex + (symbol === 'BTC' ? Decimals[symbol][BASE_CHAIN_ID] : 3))
      };
      Object.assign(allBalance, val);
      console.log('allBalance：', allBalance);
      console.log('获取代币余额', res, val);
    } catch (error) {
      console.log('获取余额出错：', error);
    } finally {
      tokenBalanceLoading.value = false;
    }
  };

  watch(
    account,
    (value) => {
      if (value) {
        fetchHandle();
      }
    },
    {
      immediate: true
    }
  );
  return {
    tokenBalanceLoading,
    allBalance,
    fetchHandle
  };
};
