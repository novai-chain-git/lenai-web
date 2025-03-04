<template>
  <component
    v-model="show"
    :is="currentComponent"
    :title="$t('RepaymentText')"
    :buttonText="$t('Confirm repayment')"
    :disabled="disabled"
    :loading="loading"
    @submit="onSubmit"
    width="300px"
  >
    <div class="px15 text-[#ffffff] text-17">
      <p class="text-16">
        {{ $t('RepaymentTitle') }}
      </p>
      <p class="pb15">{{ calculateData?.totalRepayments }} {{ TokenName[loan.loanToken].name }}</p>
      <img class="w95 mx-auto" src="@/assets/img/tops.svg" />
    </div>
    <!-- <div class="px15">
      <div class="" text="12 c1">{{ $t('Total repayment amount') }}</div>
      <div class="mt8" text="12 c13">
        <el-form :model="state" :rules="rules">
          <el-form-item class="h100% mb0! pay_input h36 fyc mt8 bdr8 px12" border="1 solid bc1">
            <el-input-number
              class="flex-1"
              type="number"
              v-model="state.repayNum"
              :controls="false"
              clearable
            />
            <div class="font-[OrbitronBold] cursor-pointer ml12" text="12 c10">MAX</div>
            <div class="ml12 mr3 line-height-32" text="12 c1">BTC</div>
          </el-form-item>
        </el-form>
        <div class="mt8">
          <span>{{ $t('Available assets') }}</span>
          <span text-c10>0 TRX</span>
        </div>
        <div class="flex gap-7 mt15">
          <div
            class="h24 flex-1 line-height-24 bdr12 cursor-pointer"
            :class="{ 'border-color-bc3 bg-bg8 text-c10': acProportion === item.value }"
            border="1 solid bc1"
            text="c1 center"
            v-for="item in proportion"
            :key="item.value"
            @click="selProportion(item)"
          >
            {{ item.label }}
          </div>
        </div>
        <div class="flex mt15">
          <el-form-item class="pb-[15px] mb-[0]">
            <el-checkbox class="!h-[auto] pay_checkbox" v-model="checked" size="large" />
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
        <div class="fyb items-center h36" border-b="1 solid bc1">
          <span>{{ $t('Total liabilities') }}</span>
          <span class="font-[OrbitronMedium]" text="c1">0215 TRX</span>
        </div>
        <div class="fyb items-center h36" border-b="1 solid bc1">
          <span>{{ $t('Remaining liabilities') }}</span>
          <span class="font-[OrbitronMedium]" text="c1">0215 TRX</span>
        </div>
        <div class="fyb mt10">
          <span>{{ $t('Pledge ratio after repayment') }}</span>
          <span class="font-[OrbitronMedium]">
            <span class="mr5 decoration-line-through" text="c7">0%</span>
            <span text="c1">5%</span>
          </span>
        </div>
        <div class="fyb mt10">
          <span>{{ $t('Quantity of returned collateral') }}</span>
          <span class="font-[OrbitronMedium]" text="c1"> 95% </span>
        </div>
      </div>
    </div> -->
  </component>
</template>

<script setup>
import {
  addresses,
  getAddress,
  fromReadableAmount,
  toReadableAmount,
  useLaunchBridgeContract,
  useApproveToken,
  Decimals,
  divDecimals,
  mulDecimals,
  addDecimals,
  TokenName,
  getERC20Contract,
  getRpcProviderByChain,
  useActiveWebStateRefs
} from '@/web3-sdk';

import popUpPc from '../../popUpPc.vue';
import popUpMb from '../../popUpMb.vue';
import { useI18n } from 'vue-i18n';
import { computed, defineEmits } from 'vue';
import { useUserStore } from '@/store/modules/user.js';
import { ethers } from 'ethers';

const props = defineProps(['loan']);
const { t } = useI18n();
const { account } = useActiveWebStateRefs();

const disabled = ref(false);
const loading = ref(false);
const { approveHandle } = useApproveToken();
const { collateralCurr, borrowCurr, setCollateralCurr, setBorrowCurr } = useUserStore();
const emit = defineEmits(['submit']);

const contractAddress = computed(() =>
  getAddress(addresses.ChainConnect, borrowCurr.chainOriginalId)
);

const LaunchBridgeContract = useLaunchBridgeContract(contractAddress);

const show = defineModel({
  type: Boolean,
  default: false
});

const currentComponent = shallowRef(popUpPc);

const rules = computed(() => {
  return {
    number: [{ required: true, message: t('Please enter the deposit quantity') }],
    symbol: [{ required: true, message: t('please choose') }]
  };
});

// 表单的内容
const state = reactive({
  repayNum: null
});

const proportion = ref([
  {
    value: 25,
    label: '25%'
  },
  {
    value: 50,
    label: '50%'
  },
  {
    value: 75,
    label: '75%'
  },
  {
    value: 100,
    label: '100%'
  }
]);

const acProportion = ref(proportion.value[0].value);
const selProportion = (item) => {
  acProportion.value = item.value;
};

const handleResize = () => {
  const isMb = window.innerWidth < 768;
  if (isMb) {
    currentComponent.value = popUpMb;
  } else {
    currentComponent.value = popUpPc;
  }
};

function calculateRepayment(loanAmount, interestRate, startTime, decimals = 18) {
  const now = Math.floor(Date.now() / 1000);
  const loanDuration = now - startTime; // 借贷时长（秒）
  const Divisor = mulDecimals(
    mulDecimals(loanAmount, interestRate, decimals),
    loanDuration,
    decimals
  );
  let date = 24 * 60 * 60 * 365 * 100;

  let interest = divDecimals(Divisor, date, decimals);
  let totalRepayment = addDecimals(interest, loanAmount, decimals);
  totalRepayment = mulDecimals(totalRepayment, 1.2, decimals);
  //数量可能太小导致无法计算

  return {
    loanDuration: loanDuration, // 借贷时长
    interest: interest, // 计算出的利息
    totalRepayment: totalRepayment, // 总还款金额
    totalRepayments: parseFloat(totalRepayment).toFixed(6)
  };
}

const calculateData = computed(() => {
  const symbol = TokenName[props.loan.loanToken].symbol;
  let obj = {};
  if (symbol === 'NOVAI') {
    obj = calculateRepayment(
      props.loan.loanAmount,
      props.loan.interestRate,
      props.loan.startTime,
      Decimals[symbol][7256]
    );
  }
  if (symbol === 'USDT') {
    obj = calculateRepayment(
      props.loan.loanAmount,
      props.loan.interestRate,
      props.loan.startTime,
      Decimals[symbol][7256]
    );
  }

  return obj;
});

const onSubmit = async (vl) => {
  if (loading.value) return;
  loading.value = true;
  console.log('props.loan', props.loan);
  let loanId = fromReadableAmount(props.loan.loanId, 0);
  const symbol = TokenName[props.loan.loanToken].symbol;
  console.log('symbol', symbol);

  //TODO: 此处的CahinId在noavi链可以暂时写死为 7256，如果以后会增加其他链，可以通过 networks文件里的 TokenInfo 还获取对应的 chainId,上面的也一样
  const pledgeChainOriginalId = 7256;
  try {
    let res = null;
    if (symbol === 'NOVAI') {
      let totalRepayment = ethers.utils.parseUnits(
        calculateData.value.totalRepayment,
        Decimals[symbol][pledgeChainOriginalId]
      );
      const gasLimit = await LaunchBridgeContract.value.estimateGas.repay(loanId, {
        value: totalRepayment
      });
      res = await LaunchBridgeContract.value.repay(loanId, {
        value: totalRepayment, // 转换为 wei 单位
        gasLimit: gasLimit // 根据实际需求调整 gas 限制
      });
    }
    if (symbol === 'USDT') {
      let totalRepayment = ethers.utils.parseUnits(
        calculateData.value.totalRepayment,
        Decimals[symbol][pledgeChainOriginalId]
      );
      const approve = async (approveValue) => {
        await approveHandle(
          getAddress(addresses[symbol], pledgeChainOriginalId),
          getAddress(addresses.ChainConnect, pledgeChainOriginalId),
          approveValue,
          100000
        );
      };
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
      if (allowanceRes.gte(totalRepayment)) {
        console.log('已授权代币足够使用');
      } else if (allowanceRes.lte(0)) {
        // 小于等于0，没有授权代币数量，就直接授权
        await approve(totalRepayment);
      } else {
        // 已授权代币小于要操作的数量，并且大于0，就需要先取消授权
        // 撤销授权，方法是授权0个代币
        await approve(0);
        await approve(totalRepayment);
      }
      res = await LaunchBridgeContract.value.repay(loanId);
    }
    const tx = await res.wait();
    ElMessage({
      message: t('Repayment successful'),
      type: 'success'
    });
    emit('submit');
  } catch (e) {
    console.log('error', e);
    ElMessage({
      message: t('Repayment Failure'),
      type: 'error'
    });
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  handleResize();
  window.addEventListener('resize', handleResize);
});

onUnmounted(() => {
  window.removeEventListener('resize', handleResize);
});
</script>

<style scoped lang="scss">
:deep(.pay_input) {
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
        }
      }
    }
  }

  .el-form-item__error {
    margin-left: -12px;
    margin-top: 2px;
  }
}

:deep(.pay_checkbox) {
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
</style>
