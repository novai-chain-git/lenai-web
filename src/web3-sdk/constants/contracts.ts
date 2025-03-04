import { ChainId } from '../wallet/config';

// 看注释 看注释 看注释
// BSC_MAINNET是正式链 对应的链ID为56
// BSC_TESTNET是正式链 对应的链ID为97
// 这是合约地址配置文件
// 合约的地址请务必在这个地添加 请务必在这个地方添加 请务必在这地方添加

/**
 * @请认真阅读上面注释
 */
const addresses = {
  USDT: {
    [ChainId.NOVAI_TESTNET]: '0xE623AED6b4dAf04553B8fEe8daECCF1cfaAece37'
  },
  // 跨链合约
  ChainConnect: {
    [ChainId.NOVAI_TESTNET]: '0x790D48CB969020F5Da91B39ddd83F693016b4Ee7'
  }
};
const addressesProduction = {
  USDT: {
    [ChainId.NOVAI_MAINNET]: '0xE623AED6b4dAf04553B8fEe8daECCF1cfaAece37'
  },
  // 跨链合约
  ChainConnect: {
    [ChainId.NOVAI_MAINNET]: '0x790D48CB969020F5Da91B39ddd83F693016b4Ee7'
  }
};
export default import.meta.env.VITE_APP_NODE_ENV === 'development'
  ? addresses
  : addressesProduction;
