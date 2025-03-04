<template>
  <component
    v-model="show"
    :is="currentComponent"
    :title="$t('BorrowFlexibleRateLoan')"
    :buttonText="$t('StartBorrowing')"
    :disabled="disabled"
    :loading="loading"
    @submit="onSubmit(LoanForm)"
    width="390px"
  >
    <div class="px-[15px]">
      <!-- <alert :title="$t('borrowing')" /> -->
      <el-form label-position="top" ref="LoanForm" :model="state" :rules="rules">
        <div class="mt15 fyb" text="c1 12">
          <span>{{ $t('Collateral') }}</span>
          <span>
            <el-icon v-if="CBLoading" class="is-loading" color="#5AC27C">
              <Loading />
            </el-icon>
            {{ $t('Balance') }} <span text="c10">{{ balance.collateralBalance }}</span>
          </span>
        </div>
        <el-form-item
          class="h100% mb0! loan_input h36 fyc mt8 bdr8 px12"
          border="1 solid bc1"
          prop="pledgeNum"
        >
          <el-input
            class="flex-1"
            type="number"
            v-model="state.pledgeNum"
            :controls="false"
            @input="setPledgeNum"
            :disabled="CBLoading"
          />
          <div class="cursor-pointer ml12" text="12 c10" @click="setPledgeMax">MAX</div>
          <div class="fyc mr3 ml12">
            <el-dropdown>
              <span class="fyc cursor-pointer" text="c1">
                <img :src="userStore.collateralCurr.img" class="w18 h18 mr8" alt="" />
                {{ userStore.collateralCurr.name }}
                <div
                  class="w0 h0 transform-translate-y-25% ml8"
                  border="5px solid transparent"
                  border-t="bg3"
                ></div>
              </span>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item
                    v-for="item in tokenList"
                    :key="item.symbol"
                    class="home_select_item"
                    :class="{
                      home_select_item_active: userStore.collateralCurr.symbol === item.symbol
                    }"
                    @click="selectCollateralToken(item)"
                  >
                    <img :src="item.img" class="w18 h18 mr8" alt="" />
                    <span>{{ item.name }}</span>
                  </el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </div>
        </el-form-item>

        <div class="mt15 fyb" text="c1 12">
          <span>{{ $t('IWantToBorrow') }}</span>
          <span>
            <el-icon v-if="BLoading" class="is-loading" color="#5AC27C">
              <Loading />
            </el-icon>
            {{ $t('Balance') }} <span text="c10">{{ balance.borrowBalance }}</span>
          </span>
        </div>
        <el-form-item
          class="h100% mb0! loan_input h36 fyc mt8 bdr8 px12"
          border="1 solid bc1"
          prop="borrowNum"
        >
          <el-input
            class="flex-1"
            type="number"
            v-model="state.borrowNum"
            :controls="false"
            @input="setBorrowNum"
            :disabled="BLoading"
          />
          <div class="cursor-pointer ml12" text="12 c10" @click="setBorrowMax">MAX</div>
          <div class="fyc cursor-pointer">
            <el-dropdown>
              <span class="fyc mr3 ml12" text="c1">
                <img :src="userStore.borrowCurr.img" class="w18 h18 mr8" alt="" />
                {{ userStore.borrowCurr.name }}
                <div
                  class="w0 h0 transform-translate-y-25% ml8"
                  border="5px solid transparent"
                  border-t="bg3"
                ></div>
              </span>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item
                    v-for="item in tokenList"
                    :key="item.symbol"
                    class="home_select_item"
                    :class="{
                      home_select_item_active: userStore.borrowCurr.symbol === item.symbol
                    }"
                    @click="selectBorrowToken(item)"
                  >
                    <img :src="item.img" class="w18 h18 mr8" alt="" />
                    <span>{{ item.name }}</span>
                  </el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </div>
        </el-form-item>
      </el-form>
      <div class="mt15" text="c8 12">
        <div class="flex justify-between items-center h-[30px]">
          <div border-b="1 solid bc1" class="h100% fyc">{{ $t('CurrentLTV') }}</div>
          <div class="">
            <span v-if="state.pledgeNum" class="text-c10">{{ state.pledgeNum }}</span>
            <span v-else>--</span>
          </div>
        </div>
        <div class="flex justify-between items-center h-[30px]">
          <div border-b="1 solid bc1" class="h100% fyc">{{ $t('LiquidationLTV') }}</div>
          <div class="">
            <span v-if="list.liquidationLTV" class="text-c10"
              >{{ list.liquidationLTV * 100 }}%</span
            >
            <span v-else>--</span>
          </div>
        </div>
        <div class="flex justify-between items-center h-[30px]">
          <div border-b="1 solid bc1" class="h100% fyc">{{ $t('AnnualizedInterestRate') }}</div>
          <div class="">
            <span v-if="list.rate" class="text-c10">{{ list.rate }}%</span>
            <span v-else>--</span>
          </div>
        </div>
        <div class="flex justify-between items-center h-[30px]">
          <div border-b="1 solid bc1" class="h100% fyc">{{ $t('EstimatedHourlyInterest') }}</div>
          <div class="">
            <span v-if="list.hourlyRate" class="text-c10">{{ list.hourlyRate }}</span>
            <span v-else>--</span>
          </div>
        </div>
        <!-- <div class="flex justify-between items-center h-[30px]">
          <div class="h100% fyc">{{ $t('LiquidationPrice') }}</div>
          <div class="">
            <span v-if="state.pledgeNum" class="text-c10">{{
              floor(state.pledgeNum * 1.2)
            }}</span>
            <span v-else>--</span>
          </div>
        </div> -->
        <!-- <div class="h1 bg-bc1 mt15 mb10"></div> -->
      </div>
    </div>
    <!-- <template #footer>
      <div class="flex">
        <el-form-item class="pb-[15px] mb-[0]">
          <el-checkbox class="!h-[auto] loan_checkbox" v-model="checked" size="large" />
        </el-form-item>
        <div ml8 text="12 left">
          <span>{{ $t('IHaveReadAndIAgreeTo') }}</span>
          <a href="" target="_blank" class="text-c10">{{ $t('Novai Loan Service Agreement') }}</a>
          <span>{{ $t('and') }}</span>
          <a href="" target="_blank" class="text-c10">{{
            $t('NovaiSimpleEarnServiceAgreement')
          }}</a>
        </div>
      </div>
    </template> -->
  </component>
</template>

<script setup>
import alert from '../../alert.vue';
import popUpPc from '../../popUpPc.vue';
import popUpMb from '../../popUpMb.vue';
import ListPercentage from '../../ListPercentage.vue';
import { useI18n } from 'vue-i18n';
import { computed, reactive, shallowRef, watch, nextTick } from 'vue';
import { debounce, floor, ceil } from 'lodash-es';
import {
  ChainList,
  borrowList,
  useAllTokenBalance,
  getEvmBalance,
  getContractBalance,
  useActiveWebStateRefs,
  useLaunchBridgeContract,
  useSwapContract,
  getAddress,
  addresses,
  getERC20Contract,
  getRpcProviderByChain,
  fromReadableAmount,
  toReadableAmount,
  Decimals,
  useApproveToken,
  TokenInfo,
  getChainConnectContract
} from '@/web3-sdk';
import { useUserStore } from '@/store/modules/user.js';
import { ElMessage } from 'element-plus';
import { ethers } from 'ethers';

const { t } = useI18n();
const userStore = useUserStore();

const { account } = useActiveWebStateRefs();
const emit = defineEmits(['submit']);

// 获取代币列表
const tokenList = computed(() => {
  return TokenInfo[userStore.collateralCurr.chainOriginalId];
});

const contractAddress = computed(() =>
  getAddress(addresses.ChainConnect, userStore.collateralCurr.chainOriginalId)
);
const LaunchBridgeContract = useLaunchBridgeContract(contractAddress);
const swapContractAddress = ref('0xC4025331019A0EB9BF855F59844E34A8eB4EB1CA');
const SwapContract = useSwapContract(swapContractAddress);

const disabled = ref(false);
const checked = ref(false);
const loading = ref(false);
const CBLoading = ref(false);
const BLoading = ref(false);
const LoanForm = ref(null);

const show = defineModel({
  type: Boolean,
  default: false
});

const currentComponent = shallowRef(popUpPc);

// 表单的内容
const state = reactive({
  pledgeNum: null,
  borrowNum: null
});

const rules = reactive({
  pledgeNum: [{ required: true, message: t('Please enter the deposit quantity') }],
  borrowNum: [{ required: true, message: t('Please enter the correct loan amount') }]
});

const list = reactive({
  rate: 10, // 年利率
  hourlyRate: '', // 每小时利
  liquidationLTV: 0.8333 // 清算LTV
});

// 余额
const balance = reactive({
  collateralBalance: 0,
  borrowBalance: 0
});

// 选择抵押币种
const selectCollateralToken = (item) => {
  state.pledgeNum = null;
  state.borrowNum = null;
  userStore.setCollateralCurr(item);
};

// 选择借款币种
const selectBorrowToken = (item) => {
  state.borrowNum = null;
  state.pledgeNum = null;
  userStore.setBorrowCurr(item);
};

// 抵押率
const collateralRate = ref(0);
// 获取抵押率
const getCollateralRate = async () => {
  const rate = await LaunchBridgeContract.value.collateralRate();
  const val = toReadableAmount(rate, 2);
  collateralRate.value = val;
};

// 获取比例值
const WNOVAIAddress = '0x4aC2abdDF928C3D01a208e880E101a1423dB6C73';
const getRateValue = async (amount, symbol, symbolTwo, chainOriginalId) => {
  if (Number(amount) <= 0) return 0;
  if (symbol === 'USDT') {
    const num = fromReadableAmount(amount, Decimals[symbol][chainOriginalId]);
    const USDTAddress = addresses[symbol][chainOriginalId];
    const src = await SwapContract.value.getAmountsOut(num, [USDTAddress, WNOVAIAddress]);
    const val = floor(toReadableAmount(src[1], Decimals[symbolTwo][chainOriginalId]), 6);
    return val;
  }
  if (symbol === 'NOVAI') {
    const num = fromReadableAmount(amount, Decimals[symbol][chainOriginalId]);
    const USDTAddress = addresses[symbolTwo][chainOriginalId];
    const src = await SwapContract.value.getAmountsOut(num, [WNOVAIAddress, USDTAddress]);
    const val = floor(toReadableAmount(src[1], Decimals[symbolTwo][chainOriginalId]), 6);
    return val;
  }
};

const setPledgeNum = debounce(async (val) => {
  let num = val;
  let n = null;
  if (Number(val) < 0) {
    num = 0;
  } else if (Number(val) > Number(balance.collateralBalance)) {
    num = Number(balance.collateralBalance);
  }
  const m = await getRateValue(
    num,
    userStore.collateralCurr.symbol,
    userStore.borrowCurr.symbol,
    userStore.collateralCurr.chainOriginalId
  );
  n = floor(m / collateralRate.value, 6);
  state.pledgeNum = num;
  state.borrowNum = n;
}, 500);

const setBorrowNum = debounce(async (val) => {
  let num = val;
  let n = null;
  const m = await getRateValue(
    val,
    userStore.borrowCurr.symbol,
    userStore.collateralCurr.symbol,
    userStore.borrowCurr.chainOriginalId
  );
  n = ceil(m * collateralRate.value, 6);
  if (n > balance.collateralBalance) {
    n = balance.collateralBalance;
    const l = await getRateValue(
      n,
      userStore.collateralCurr.symbol,
      userStore.borrowCurr.symbol,
      userStore.collateralCurr.chainOriginalId
    );
    num = floor(l / collateralRate.value, 6);
  }
  state.pledgeNum = n;
  state.borrowNum = num;
}, 500);

const setPledgeMax = async () => {
  const num = balance.collateralBalance;
  const m = await getRateValue(
    num,
    userStore.collateralCurr.symbol,
    userStore.borrowCurr.symbol,
    userStore.collateralCurr.chainOriginalId
  );
  const n = floor(m / collateralRate.value, 6);
  state.pledgeNum = num;
  state.borrowNum = n;
};

const setBorrowMax = async () => {
  let num = balance.borrowBalance;
  let n = null;
  const m = await getRateValue(
    balance.borrowBalance,
    userStore.borrowCurr.symbol,
    userStore.collateralCurr.symbol,
    userStore.borrowCurr.chainOriginalId
  );
  n = ceil(m * collateralRate.value, 6);
  if (n > balance.collateralBalance) {
    n = balance.collateralBalance;
    const l = await getRateValue(
      n,
      userStore.collateralCurr.symbol,
      userStore.borrowCurr.symbol,
      userStore.collateralCurr.chainOriginalId
    );
    num = floor(l / collateralRate.value, 6);
  }
  state.pledgeNum = n;
  state.borrowNum = num;
};

// 借款
const { approveHandle } = useApproveToken();
const loanHandler = async () => {
  if (!state.borrowNum || !state.pledgeNum || loading.value) return;
  loading.value = true;
  const symbol = userStore.collateralCurr.symbol;
  const borrowSymbol = userStore.borrowCurr.symbol;
  const pledgeChainOriginalId = userStore.collateralCurr.chainOriginalId;
  const borrowChainOriginalId = userStore.borrowCurr.chainOriginalId;
  const pledgeVal = state.pledgeNum;
  const borrowVal = state.borrowNum;
  const userInputValue = fromReadableAmount(pledgeVal, Decimals[symbol][pledgeChainOriginalId]);
  const borrowInputVal = fromReadableAmount(
    borrowVal,
    Decimals[borrowSymbol][borrowChainOriginalId]
  );
  const approve = async (approveValue) => {
    await approveHandle(
      getAddress(addresses[symbol], pledgeChainOriginalId),
      getAddress(addresses.ChainConnect, pledgeChainOriginalId),
      approveValue,
      100000
    );
  };

  try {
    if (symbol === 'USDT') {
      try {
        const contract = getERC20Contract(
          getAddress(addresses[symbol], pledgeChainOriginalId),
          getRpcProviderByChain(pledgeChainOriginalId)
        );
        const allowanceRes = await contract.allowance(
          account.value,
          getAddress(addresses.ChainConnect, pledgeChainOriginalId)
        );
        // 已授权代币小于要操作的数量，并且大于0，就需要先取消授权
        // 否则就是没授权代币，直接走下面的授权就行
        // 大于等于需要操作的数量，直接进行转账就行
        if (allowanceRes.gte(userInputValue)) {
          console.log('已授权代币足够使用');
        } else if (allowanceRes.lte(0)) {
          // 小于等于0，没有授权代币数量，就直接授权
          await approve(userInputValue);
        } else {
          // 已授权代币小于要操作的数量，并且大于0，就需要先取消授权
          // 撤销授权，方法是授权0个代币
          await approve(0);
          await approve(userInputValue);
        }
      } catch (error) {
        console.log('授权失败', error);
      }
    }
    const toAddress = '0x0000000000000000000000000000000000000000';

    let res = null;
    if (symbol === 'USDT') {
      res = await LaunchBridgeContract.value.borrow(
        borrowInputVal,
        toAddress,
        getAddress(addresses[symbol], pledgeChainOriginalId)
      );
    }
    if (symbol === 'NOVAI') {
      // NOVAI需要上浮0.1%才能交易成功
      const val = floor(pledgeVal * 1.001, 6);
      const value = fromReadableAmount(val, Decimals[symbol][pledgeChainOriginalId]);
      res = await LaunchBridgeContract.value.borrow(
        borrowInputVal,
        getAddress(addresses[borrowSymbol], borrowChainOriginalId),
        toAddress,
        {
          value: value,
          gasLimit: 300000
        }
      );
    }
    const tx = await res.wait();
    ElMessage({
      message: t('Loan successful'),
      type: 'success'
    });
    emit('submit');
    if (symbol === 'USDT') {
      await getPledgeBalance(symbol, CBLoading, 'collateralBalance');
      await getBorrowBalance(BLoading, 'borrowBalance');
    }
    if (symbol === 'NOVAI') {
      await getPledgeBalance(borrowSymbol, BLoading, 'borrowBalance');
      await getBorrowBalance(CBLoading, 'collateralBalance');
    }
    state.pledgeNum = null;
    state.borrowNum = null;
  } catch (error) {
    console.log('借款失败', error);
    ElMessage({
      message: t('Loan Failure'),
      type: 'error'
    });
  } finally {
    loading.value = false;
  }
};

const onSubmit = (LoanFormData) => {
  if (!LoanFormData) return;
  LoanFormData.validate((valid) => {
    if (valid) {
      // 确认借款
      loanHandler();
    } else {
      return false;
    }
  });
};

const handleResize = () => {
  const isMb = window.innerWidth < 768;
  if (isMb) {
    currentComponent.value = popUpMb;
  } else {
    currentComponent.value = popUpPc;
  }
};

onMounted(() => {
  handleResize();
  const list = TokenInfo['7256'];
  userStore.setCollateralCurr(list[1]);
  userStore.setBorrowCurr(list[0]);
  getCollateralRate();
  window.addEventListener('resize', handleResize);
});

onUnmounted(() => {
  window.removeEventListener('resize', handleResize);
});

// 获取代币余额
const getPledgeBalance = async (symbol, loading, balanceVal) => {
  if (loading.value || !account.value) return;
  loading.value = true;
  const res = await getEvmBalance(symbol);
  balance[balanceVal] = res.value;
  loading.value = false;
};

// 获取主币余额
const getBorrowBalance = async (loading, balanceVal) => {
  if (loading.value || !account.value) return;
  loading.value = true;
  const res = await getContractBalance();
  balance[balanceVal] = res.value;
  loading.value = false;
};

// 监听抵押的余额
watch(
  () => [userStore.collateralCurr, account.value],
  async ([newCurr, newAddress]) => {
    const symbol = newCurr.symbol;
    if (symbol === 'USDT') {
      await getPledgeBalance(symbol, CBLoading, 'collateralBalance');
    }
    if (symbol === 'NOVAI') {
      await getBorrowBalance(CBLoading, 'collateralBalance');
    }
  },
  {
    immediate: true
  }
);

// 监听借款的余额
watch(
  () => [userStore.borrowCurr, account.value],
  async ([newCurr]) => {
    const symbol = newCurr.symbol;
    if (symbol === 'USDT') {
      await getPledgeBalance(symbol, BLoading, 'borrowBalance');
    }
    if (symbol === 'NOVAI') {
      await getBorrowBalance(BLoading, 'borrowBalance');
    }
  },
  {
    immediate: true
  }
);

watch(
  () => show.value,
  (newVal) => {
    if (newVal) {
      getCollateralRate();
    }
  }
);

watch(
  () => state.pledgeNum,
  (newVal) => {
    if (newVal) {
      const hourlNum = state.borrowNum * (list.rate / 912500);
      if (hourlNum < 0.000001) {
        list.hourlyRate = '<0.000001';
      } else {
        list.hourlyRate = floor(hourlNum);
      }
    }
  }
);
</script>

<style scoped lang="scss">
:deep(.loan_input) {
  .el-form-item__content {
    height: 100%;
    .el-input {
      height: 100%;
      .el-input__wrapper {
        background: transparent;
        padding: 0;
        box-shadow: none;

        .el-input__inner {
          border: none;
          color: var(--font-color1);
          font-family: 'OrbitronMedium';
          text-align: left;
          font-size: 14px;
          &::placeholder {
            font-family: 'Poppins';
          }
          &::-webkit-inner-spin-button {
            display: none !important;
            -webkit-appearance: none;
          }
        }
      }
    }
  }
  .el-form-item__error {
    margin-left: -12px;
    margin-top: 2px;
  }
}

:deep(.loan_checkbox) {
  .el-checkbox__inner {
    background: transparent;
    border: 1px solid var(--border-color1);
    border-radius: 2px;
    &::after {
      border-color: var(--border-color3);
    }
  }
  .is-checked {
    .el-checkbox__inner {
      border-color: var(--border-color3);
      background: var(--bg8);
    }
  }
}

:deep(.home_select_item) {
  &:hover {
    background: rgba(94, 196, 121, 0.2) !important;
    color: #5ec479 !important;
  }
}
:deep(.home_select_item_active) {
  background: rgba(94, 196, 121, 0.2) !important;
  color: #5ec479 !important;
}
</style>
