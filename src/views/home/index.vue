<template>
  <div class="home w1230 mx-auto pt100 pb50 <md:(pt84 px15) <xl:(w100% px15)" text="c1 ">
    <div class="fyc justify-between <lg:(pr100) <md:(pr0)">
      <div class="w780 <md:w100%">
        <div
          class="home_title bg-clip-text uppercase font-bold <md:(text-24)"
          text="[transparent] 60"
        >
          {{ $t('Demand Deposit Loan') }}
        </div>
        <div text="22 <md:12">
          {{ $t('Borrowed Assets Can Be Used For Investment To Achieve Higher Returns') }}
        </div>
        <ul class="mt23 flex flex-col gap-17 <md:(mt10 gap5)">
          <li class="fyc">
            <img class="w15 h15" src="@/assets/img/home/repay.png" alt="" />
            <span class="ml8" text="14">{{ $t('Repay at any time') }}</span>
          </li>
          <li class="fyc">
            <img class="w15 h15" src="@/assets/img/home/handling.png" alt="" />
            <span class="ml8" text="14">{{ $t('No handling fees') }}</span>
          </li>
          <li class="fyc">
            <img class="w15 h15" src="@/assets/img/home/simple.png" alt="" />
            <span class="ml8" text="14">{{
              $t('Simple Earn (Flexible) assets can be collateralized in Flexible Loan')
            }}</span>
          </li>
        </ul>

        <div
          class="inline-block p10 mt28 bdr34 bg-to5 border <md:(w100% p0 border-rd-none bg-none)"
        >
          <el-button
            class="w260 h48! bdr24! text-16! font-bold! color-c5! <md:(w100% h39! text-14! bdr-4!)"
            border="none!"
            type="primary"
            @click="loanFunction"
            >{{ account ? $t('Borrow Now') : $t('Connect wallet') }}</el-button
          >
        </div>
      </div>
      <img class="w462 relative z-10 <md:hidden" src="@/assets/img/home/banner_hero.png" alt="" />
    </div>
    <div class="tabs fyc justify-between mt75 <md:(mt25)">
      <div class="fyc gap-38 <md:(gap-10 w100% px10)" text="18 <md:14">
        <div
          :class="acTab === 0 ? 'tab_active' : ''"
          class="cursor-pointer flex flex-col items-center <md:cursor-none font-bold <md:"
          text="c1"
          @click="acTab = 0"
        >
          <span> {{ $t('Ongoing Orders') }} ( {{ dataList.length }} )</span>
          <span class="tab_line block w38 h2 bg-[transparent] mt10"></span>
        </div>
        <!-- <div
          :class="acTab === 1 ? 'tab_active' : ''"
          class="cursor-pointer flex flex-col items-center <md:cursor-none <md:(flex-1)"
          text="c7"
          @click="acTab = 1"
        >
          <span> {{ $t('Asset Overview') }}</span>
          <span class="tab_line block w38 h2 bg-[transparent] mt10"></span>
        </div> -->
      </div>
      <!-- <div class="<md:hidden">
        <el-dropdown class="h100%" trigger="hover" role="navigation">
          <span class="cursor-pointer fyc" text="c1 12">
            {{ sortType.name }}
            <img class="w6 h8 ml8" src="@/assets/img/home/switch.png" alt="" />
          </span>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item
                v-for="item in sortArr"
                :key="item.value"
                @click="setSortType(item)"
                class="home_select_item"
                :class="{ home_select_item_active: sortType.value === item.value }"
              >
                {{ item.name }}
              </el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div> -->
    </div>
    <!-- <div class="w100% h40 bg-bg5 bdr5 hidden px10 mt15 <md:(block)">
      <div
        class="w100% h100% bdr5 flex items-center justify-between whitespace-nowrap overflow-x-auto gap-10"
      >
        <div
          v-for="item in sortArr"
          :key="item.value"
          class="h30 min-w150 fcc bdr5"
          :class="{ 'bg-to1 text-c5 ': sortType.value === item.value }"
          @click="setSortType(item)"
        >
          {{ item.name }}
        </div>
      </div>
    </div> -->
    <div class="data_list">
      <!-- PC列表 -->
      <div
        class="mt15 bg-[rgba(255,255,255,0.1)] bdr15 p15 flex <md:hidden"
        v-for="item in dataList"
        :key="item.id"
      >
        <div class="w100% fyb">
          <div class="h100% min-w-160 mr10 fyc gap-8">
            <img :src="TokenName[item.loanToken].icon" alt="" class="w26 h26" />
            <div class="h100% flex flex-col justify-between">
              <div class="line-height-16" text="12 c13">{{ $t('Total Liabilities') }}</div>
              <div class="line-height-16 font-bold mt10" text="14 c1">
                {{ item.loanAmount }} {{ TokenName[item.loanToken].name }}
              </div>
            </div>
          </div>
          <div class="h100% min-w-300 fyc gap-8 mr10">
            <img :src="TokenName[item.collateralToken].icon" alt="" class="w26 h26" />
            <div class="h100% flex flex-col justify-between">
              <div class="line-height-16" text="12 c13">{{ $t('Pledge amount') }}</div>
              <div class="font-bold line-height-16 mt10" text="12 c1">
                {{ item.collateralAmount }} {{ TokenName[item.collateralToken].name }}
              </div>
            </div>
          </div>
          <div class="h100% min-w-100 mr10">
            <div class="h100% flex flex-col justify-between">
              <div class="line-height-16" text="12 c13">{{ $t('Pledge Rate') }}</div>
              <div class="font-bold line-height-16 mt10" text="12 c10">
                {{ collateralRate * 100 }}%
              </div>
            </div>
          </div>
          <div class="h100% min-w-100 mr10">
            <div class="h100% flex flex-col justify-between">
              <div class="line-height-16" text="12 c13">{{ $t('Annualized interest rate') }}</div>
              <div class="font-bold line-height-16 mt10" text="12 c1">
                {{ item.interestRate * 100 }}%
              </div>
            </div>
          </div>
          <el-button
            class="w98 color-c5! px0 font-bold!"
            border="none!"
            type="primary"
            @click="onRepay(item)"
            >{{ $t('Repayment') }}</el-button
          >
        </div>
        <!-- <div class="h87 flex-1 ml10">
          
        </div> -->
        <!-- <div class="h87 flex-1">
          <div>
            <div class="line-height-16" text="12 c7">{{ $t('Margin Call Pledge Rate') }}</div>
            <div class="font-[OrbitronMedium] line-height-16" text="12 c1">
              {{ item.marginCallPledgeRate }}%
            </div>
          </div>
          <div class="mt20">
            <div class="line-height-16" text="12 c7">{{ $t('Net annualized interest rate') }}</div>
            <div class="font-[OrbitronMedium] line-height-16" text="12 c1">
              {{ item.interestRate * 100 }}%
            </div>
          </div>
        </div> -->
        <!-- <div class="h87 flex-1">
          <div>
            <div class="line-height-16" text="12 c7">{{ $t('Liquidation Pledge Rate') }}</div>
            <div class="font-[OrbitronMedium] line-height-16" text="12 c1">
              {{ item.liquidationPledgeRate }}%
            </div>
          </div>
          <div class="mt20">
            <div class="line-height-16" text="12 c7">{{ $t('Liquidation Price') }}</div>
            <div class="font-[OrbitronMedium] line-height-16" text="12 c1">
              {{ item.liquidationPrice }}
            </div>
          </div>
        </div> -->
        <!-- <div class="h87 w98 fcc">
          <el-button
            class="w-full text_wrap bg-bg1! ml0! mt15 color-c5! font-[OrbitronBold] px0"
            border="none!"
            type=""
            @click="isShowRatio = true"
            >{{ $t('Adjusting the pledge rate') }}</el-button
          >
        </div> -->
      </div>
      <!-- 移动端列表 -->
      <div
        class="mt15 hidden bdr10 bg-bg6 p15 <md:block"
        border="1 solid bc3"
        v-for="item in dataList"
        :key="item.id"
      >
        <div class="fyc">
          <img :src="TokenName[item.loanToken].icon" alt="" class="w24 h24 mr10" />
          <div class="">
            <div text="13 c10">{{ $t('Total Liabilities') }}</div>
            <div class="" text="13 c1">
              {{ item.loanAmount }} {{ TokenName[item.loanToken].name }}
            </div>
          </div>
        </div>
        <div class="fyc mt20">
          <img :src="TokenName[item.collateralToken].icon" alt="" class="w24 h24 mr10" />
          <div class="">
            <div text="13 c10">{{ $t('Pledge amount') }}</div>
            <div class="" text="13 c1">
              {{ item.collateralAmount }} {{ TokenName[item.collateralToken].name }}
            </div>
          </div>
        </div>
        <div class="fyc justify-between mt15">
          <span text="13 c13">{{ $t('Pledge Rate') }}</span>
          <span class="" text="13 c10">{{ collateralRate * 100 }}%</span>
        </div>
        <div class="fyc justify-between mt10">
          <span text="13 c13">{{ $t('Annualized interest rate') }}</span>
          <span class="" text="13 c1">{{ item.interestRate * 100 }}%</span>
        </div>
        <!-- <div class="fyc justify-between mt10">
          <span text="13 c13">{{ $t('Margin Call Pledge Rate') }}</span>
          <span class="font-[OrbitronMedium]" text="13 c1">{{ item.marginCallPledgeRate }}%</span>
        </div>
        <div class="fyc justify-between mt10">
          <span text="13 c13">{{ $t('Net annualized interest rate') }}</span>
          <span class="font-[OrbitronMedium]" text="13 c1"
            >{{ item.NetAnnualizedInterestRate }}%</span
          >
        </div>
        <div class="fyc justify-between mt10">
          <span text="13 c13">{{ $t('Liquidation Pledge Rate') }}</span>
          <span class="font-[OrbitronMedium]" text="13 c1">{{ item.liquidationPledgeRate }}%</span>
        </div>
        <div class="fyc justify-between mt10">
          <span text="13 c13">{{ $t('Liquidation Price') }}</span>
          <span class="font-[OrbitronMedium]" text="13 c1">{{ item.liquidationPrice }}%</span>
        </div> -->
        <div class="fyc justify-between mt15">
          <el-button
            class="w100% h34! color-c5! font-bold!"
            border="none!"
            type="primary"
            @click="onRepay(item)"
            >{{ $t('Repayment') }}</el-button
          >
          <!-- <el-button
            class="w-150 h34! text_wrap bg-bg1! color-c5! font-[OrbitronBold]"
            border="none!"
            type=""
            @click="isShowRatio = true"
            >{{ $t('Adjusting the pledge rate') }}</el-button
          > -->
        </div>
      </div>
    </div>
    <!-- <div class="flex justify-center mt40">
      <el-pagination
        background
        layout="prev, pager, next"
        :total="1000"
        class="novai_pagination flex! <md:hidden!"
        @current-change="handleCurrentChange"
      />
      <el-pagination
        background
        layout="prev, pager, next"
        :total="1000"
        class="novai_pagination hidden! <md:flex!"
        @current-change="handleCurrentChange"
        pager-count="3"
      />
    </div> -->
  </div>
  <img class="home_bg_one <md:hidden" src="@/assets/img/home/home_bg_one.png" alt="" />
  <img class="home_bg_three <md:hidden" src="@/assets/img/home/home_bg_three.png" alt="" />
  <!-- 借 -->
  <Loan v-model="isShowLoan" @submit="closeShowLoan" />
  <!-- 还 -->
  <Pay v-model="isShowPay" @submit="closeShowLoan" :loan="loan" />
  <!-- 调整质押率 -->
  <!-- <Ratio v-model="isShowRatio" /> -->
</template>

<script setup>
import { onMounted, ref, computed, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import Loan from '@/components/dialog/loan/index.vue';
import Pay from '@/components/dialog/pay/index.vue';
// import Ratio from '@/components/dialog/ratio/index.vue';
import { useUserStore } from '@/store/modules/user.js';
import {
  useLaunchBridgeContract,
  getAddress,
  useActiveWebStateRefs,
  addresses,
  toReadableAmount,
  TokenName,
  useActiveWebState,
  connectWallet,
  walletSwitchChain
} from '@/web3-sdk';
import tp from 'tp-js-sdk';
import { ceil } from 'lodash-es';

import usdt from '@/assets/tokens/USDT.svg';
import bnb from '@/assets/svg/bnb.svg';

const { t } = useI18n();
const { collateralCurr } = useUserStore();
const { account } = useActiveWebStateRefs();

const isShowLoan = ref(false);
const isShowPay = ref(false);
const isShowRatio = ref(false);

const contractAddress = computed(() =>
  getAddress(addresses.ChainConnect, collateralCurr.chainOriginalId)
);
const LaunchBridgeContract = useLaunchBridgeContract(contractAddress);

const loan = ref({});
// 0为ongoing orders, 1为asset overview
const acTab = ref(0);

// 排序
const sortArr = [
  { name: t('Sort by LTV'), value: 0 },
  { name: t('Sort by time'), value: 1 }
];

// 选中的排序方式
const sortType = ref(sortArr[0]);
const setSortType = (item) => {
  sortType.value = item;
};

const closeShowLoan = () => {
  isShowLoan.value = false;
  isShowPay.value = false;
  getDataList();
};

// 数据列表
const dataList = ref([]);

// 分页变化
const handleCurrentChange = (page) => {
  console.log(page);
};

// 抵押率
const collateralRate = ref(0);
// 获取抵押率
const getCollateralRate = async () => {
  const rate = await LaunchBridgeContract.value.collateralRate();
  const val = toReadableAmount(rate, 2);
  collateralRate.value = val;
};

// 获取列表
const getDataList = async () => {
  if (!account.value) return;
  const arr = await LaunchBridgeContract.value.getLoansByAddress(account.value);
  const newArr = arr.map((item) => {
    /* 
    loanId:借款ID，用于唯一标识每笔借款
    loanAmount:借款金额（以借款代币计）
    collateralAmount:抵押金额（以抵押代币计）
    interestRate:利率（年利率）
    startTime:借款开始时间
    collateralToken:抵押的ERC20代币
    loanToken:借款的ERC20代币
    */
    const obj = {
      loanId: toReadableAmount(item.loanId, 0),
      loanAmount:
        TokenName[item.loanToken].symbol === 'USDT'
          ? toReadableAmount(item.loanAmount, 6)
          : toReadableAmount(item.loanAmount, 18),
      collateralAmount:
        TokenName[item.collateralToken].symbol === 'USDT'
          ? ceil(toReadableAmount(item.collateralAmount, 6), 6)
          : ceil(toReadableAmount(item.collateralAmount, 18), 6),
      interestRate: toReadableAmount(item.interestRate, 2),
      startTime: toReadableAmount(item.startTime, 0),
      collateralToken: item.collateralToken,
      loanToken: item.loanToken
    };
    return obj;
  });
  newArr.sort((a, b) => new Date(b.startTime * 1000) - new Date(a.startTime * 1000));
  dataList.value = newArr;
};

const loanFunction = () => {
  if (account.value) {
    isShowLoan.value = true;
  } else {
    connectWalletHandle();
  }
};

const loginLoading = ref(false);
// 连接钱包
const connectWalletHandle = async () => {
  if (loginLoading.value) return;
  loginLoading.value = true;
  const { setAccount } = useActiveWebState();
  const isTp = tp.isConnected();
  if (isTp) {
    const wallet = await tp.getWallet({ walletTypes: ['eth'] });
    setAccount(wallet.data.address);
    loginLoading.value = false;
  } else {
    await connectWallet();
    //await switchChain();
    loginLoading.value = false;
  }
};

// 切换钱包
const switchChain = async () => {
  const chainOriginalId = collateralCurr.chainOriginalId;
  await walletSwitchChain(chainOriginalId);
};

const onRepay = (item) => {
  isShowPay.value = true;
  loan.value = item;
  // id.value = item.loanId;
};

watch(
  () => [account.value, LaunchBridgeContract],
  ([newAccount]) => {
    getDataList();
    getCollateralRate();
  },
  {
    immediate: true
  }
);
</script>

<style scoped lang="scss">
.home {
  min-height: calc(100vh - 120px);
  position: relative;
  .home_title {
    background-image: linear-gradient(180deg, #5ac27c 0%, #b2e235 100%);
  }

  .tabs {
    .tab_active {
      color: var(--font-color1);
      .tab_line {
        background: linear-gradient(180deg, #5ac27c 0%, #b2e235 100%);
      }
    }
  }
  .data_list {
    :deep(.text_wrap) {
      span {
        display: flex;
        flex-flow: wrap;
      }
    }
  }
}

.home_bg_one {
  position: absolute;
  width: 100%;
  height: 600px;
  max-width: 1920px;
  top: 0;
  left: 0;
  transform: translateX(0);
  z-index: -1;
}
.home_bg_three {
  width: 1088px;
  height: 241px;
  position: absolute;
  top: 360px;
  left: 36%;
  z-index: -1;
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
