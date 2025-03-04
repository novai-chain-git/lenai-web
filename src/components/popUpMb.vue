<template>
  <el-drawer
    v-model="modelValue"
    direction="btt"
    :show-close="false"
    size="auto"
    lock-scroll
    class="bg-bg7! md_drawer"
    style="border-top-left-radius: 10px; border-top-right-radius: 10px"
  >
    <template #header="{ close }">
      <div class="h51 flex items-center py7 px15" :class="headerClass">
        <span class="flex-1 text-[18px] font-bold bg-clip-text bg-lv" text="[transparent] ">{{
          title
        }}</span>
        <el-icon class="cursor-pointer" size="20" v-if="!showClose" @click="close">
          <Close />
        </el-icon>
      </div>
    </template>
    <slot></slot>
    <template #footer>
      <div class="p-[15px]">
        <slot name="footer"></slot>
        <el-button
          v-if="!account"
          class="h39! text-c5! bdr8! border-none! font-bold!"
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
          class="h39! text-c5! bdr8! font-bold! border-none!"
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
  </el-drawer>
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

const { account, chainId } = useActiveWebStateRefs();
const userStore = useUserStore();

const modelValue = defineModel({
  type: Boolean,
  default: false
});
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
    console.log('selectedChain.value', selectedChain.value);
  },
  { immediate: true }
);
</script>

<style scoped lang="scss"></style>
