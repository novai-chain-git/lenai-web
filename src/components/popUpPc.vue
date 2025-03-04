<template>
  <el-dialog
    v-model="modelValue"
    :show-close="showClose"
    :align-center="true"
    class="temp_dialog bg-bg7! bdr15! p0! <md:(w-90%!)"
    :width="width"
    :isFooter="false"
  >
    <template #header="{ close }">
      <div class="h51 flex relative items-center py7 px15" :class="headerClass">
        <span class="flex-1 text-[20px] font-bold bg-clip-text bg-lv" text="[transparent] ">{{
          title
        }}</span>

        <div class="absolute h100% right-15 top-0 flex items-center">
          <el-icon class="cursor-pointer" size="20" v-if="!showClose" @click="close">
            <Close />
          </el-icon>
        </div>
      </div>
    </template>
    <slot></slot>
    <template #footer>
      <div class="p-[15px]">
        <slot name="footer"></slot>
        <el-button
          v-if="!account"
          class="h40! font-bold! text-16! text-c5! bdr8! border-none!"
          :class="[disabled ? 'bg-bg5!' : 'bg-to1!']"
          w="100%"
          @click="connectWalletHandle"
          type="primary"
          :disabled="disabled"
          :loading="loginLoading"
        >
          {{ $t('Connect wallet') }}
        </el-button>
        <el-button
          v-else
          class="h40! font-bold! text-16! text-c5! bdr8! border-none!"
          :class="[disabled ? 'bg-bg5!' : 'bg-to1!']"
          w="100%"
          @click="submit"
          type="primary"
          :disabled="disabled"
          :loading="loading"
        >
          {{
            selectedChain.chainOriginalId !== chainId
              ? $t('connect to', {
                  chainName: selectedChain.chainName.replace(/Mainnet|Testnet/, $t('and confirm'))
                })
              : buttonText
          }}
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup>
import {
  useActiveWebStateRefs,
  useActiveWebState,
  connectWallet,
  walletSwitchChain,
  ETHEREUM_CHAIN
} from '@/web3-sdk';
import tp from 'tp-js-sdk';
import { useUserStore } from '@/store/modules/user.js';
import { watch } from 'vue';

const { account, chainId } = useActiveWebStateRefs();

const userStore = useUserStore();

const props = defineProps({
  width: {
    type: [String, Number],
    default: '50%'
  },
  showClose: {
    type: Boolean,
    default: false
  },
  title: {
    type: String,
    default: ''
  },
  buttonText: {
    type: String,
    default: ''
  },
  headerClass: {
    type: String,
    default: ''
  },
  disabled: {
    type: Boolean,
    default: false
  },
  loading: {
    type: Boolean,
    default: false
  }
});
const modelValue = defineModel({
  type: Boolean,
  default: false
});

const loginLoading = ref(false);

// 选中的链
const selectedChain = ref();

// 切换钱包
const switchChain = async () => {
  const chainOriginalId = userStore.collateralCurr.chainOriginalId;
  await walletSwitchChain(chainOriginalId);
};

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
    loginLoading.value = false;
  }
};

const emit = defineEmits(['submit']);
const submit = (vl) => {
  if (userStore.collateralCurr.chainOriginalId !== chainId.value) {
    switchChain();
  } else {
    emit('submit', vl);
  }
};

watch(
  () => userStore.collateralCurr,
  (newCurr) => {
    selectedChain.value = ETHEREUM_CHAIN[newCurr.chainOriginalId];
  },
  { immediate: true }
);
</script>

<style scoped lang="scss">
:deep(.el-dialog__header) {
  padding-bottom: 0px !important;
}

::v-deep .el-dialog {
  padding: 0px !important;
}
::v-deep .el-button.is-disabled {
  background-color: #2c3139 !important;
  background-image: none !important;
  color: #808997;
}
::v-deep .el-dialog__footer {
  padding-top: 0px !important;
}
</style>
