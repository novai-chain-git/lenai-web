<template>
  <div
    class="header w100% h74 px23 absolute backdrop-blur-10px top-0 left-0 fyc z-100 <md:(h54 px15)"
    position="fixed top-0 left-0"
  >
    <a href="/">
      <img src="@/assets/svg/logo.svg" alt="" class="h36 <md:(wauto h24)" />
    </a>
    <img
      src="@/assets/img/home/more.png"
      alt=""
      class="ml10 w20 hidden <md:block"
      @click.stop="isShowMenu = !isShowMenu"
    />
    <div class="ml34 fyc <md:hidden">
      <div v-for="item in menuList" class="mr20">
        <a
          :href="item.link"
          :key="item.name"
          :target="item.isBlank ? '_blank' : ''"
          class="text-c1 text-16"
        >
          {{ item.name }}
        </a>
      </div>
    </div>

    <!-- 切换语言 -->
    <div
      class="h100% relative mlauto mr40 fyc <md:(mr10 static )"
      @mouseenter="isShowLang = true"
      @mouseleave="isShowLang = false"
    >
      <img
        src="@/assets/svg/icon4.svg"
        alt=""
        class="w20 h20 <md:(w16 h16)"
        @click="isShowLang = true"
      />

      <div
        class="lang_list bg-to1 p1 bdr-10 z-10 shadow4 w120"
        :class="[isShowLang ? 'dropdown_item' : 'dropdown_items']"
      >
        <ul class="bdr-10 bg-[#131315] py10">
          <li
            v-for="(lang, index) in langList"
            :key="index"
            class="h40 px20 fyc cursor-pointer <md:(px10 text-13)"
            text="14 c9"
            :class="{ '': lang.value === language.value }"
            @click="setLang(lang.value)"
          >
            {{ lang.name }}
            <img
              v-if="lang.value === language.value"
              src="@/assets/img/home/choose.svg"
              alt=""
              class="mlauto w12"
            />
          </li>
        </ul>
      </div>
    </div>
    <!-- <el-dropdown @command="setLang">
      <span
        class="px16 h50 bdr14 shadow3 bg-[#F3EFEE] mr30 fyc font-bold cursor-pointer border-none outline-none <md:(px20 h30 text-12 bdr-15 mr10 font-normal)"
        text="16 c11"
      >
        {{ language.alias }}
        <el-icon class="ml10">
          <arrow-down />
        </el-icon>
      </span>
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item
            v-for="(lang, index) in langList"
            :key="index"
            :command="lang.value"
            class="px30 <md:(px15)"
            :disabled="lang.value === language.value"
            >{{ lang.alias }}</el-dropdown-item
          >
        </el-dropdown-menu>
      </template>
    </el-dropdown> -->
    <!-- 链接钱包 -->
    <div v-if="shortAccount" class="h100% fyc h36 bg-to1 bdr8 p1">
      <div class="fyc bdr8 h34 bg-bg5 px15 <md:text-12 <md:px6" text="14 c9">
        <div v-if="commonStore.novaiBalance">{{ commonStore.novaiBalance }} NOV</div>
        <div
          class="w0 h0 ml16 <md:ml6"
          border="5 solid transparent"
          border-t="#959698"
          border-b="none"
          v-if="commonStore.novaiBalance"
        ></div>
        <div class="w1 h18 bg-[#959698] mx16 <md:mx6" v-if="commonStore.novaiBalance"></div>
        <div
          class="h100% fyc cursor-pointer relative"
          @mouseenter="isShowQuit = true"
          @mouseleave="isShowQuit = false"
        >
          <div class="h100% fyc">
            <span class="line-height-17" border-b="1 solid #fff">
              <span class="<md:hidden">{{ against(account) }}</span>
              <span class="hidden <md:inline-block">{{ againstLater(account) }}</span>
            </span>
            <div v-html="iconDom" class="ml10 w16 h16"></div>
          </div>
          <div
            class="dropdown_quit_box p1 bg-to1 h40 bdr10 mt14 cursor-pointer"
            :class="[isShowQuit ? 'dropdown_quit' : 'dropdown_quits']"
            @click="accountMenu('Disconnect')"
          >
            <div class="px16 fyc bg-[#131315] h100% bdr10 <md:(text-13 px10 )" text="14 c4">
              <img src="@/assets/img/home/quit.png" alt="" class="h15" />
              <p class="whitespace-nowrap ml4 mr8 text-16 text-[#FFF]">
                {{ $t('Disconnect') }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
    <img
      v-else
      @click="connectWalletHandle"
      src="@/assets/svg/wallet.svg"
      alt=""
      class="w20 h20 cursor-pointer <md:(w16 h16)"
    />
  </div>
  <!-- 移动端菜单栏 -->
  <div class="menu_model hidden <md:block" v-if="isShowMenu">
    <div class="menu_mobile hidden <md:block">
      <div v-for="item in menuList" class="mt30 pl24">
        <a
          :href="item.link"
          :key="item.name"
          :target="item.isBlank ? '_blank' : ''"
          class="text-c1 text-16"
        >
          {{ item.name }}
        </a>
      </div>
    </div>
  </div>
</template>

<script setup>
import {
  connectWallet,
  useActiveWebStateRefs,
  disconnectWallet,
  getActiveLibrary,
  Decimals,
  toReadableAmount,
  BASE_CHAIN_ID,
  getRpcProviderByChain,
  useActiveWebState
} from '@/web3-sdk';
import { useCommonStore } from '@/store/modules/common.js';
import { langList } from '@/lang/index.js';
import { useI18n } from 'vue-i18n';
import Jazzicon from 'jazzicon';
import { watch, ref, onMounted, onUnmounted } from 'vue';
import BigNumber from 'bignumber.js';
import lodash from 'lodash-es';
import tp from 'tp-js-sdk';

const { shortAccount, account } = useActiveWebStateRefs();
const commonStore = useCommonStore();
const userStore = useUserStore();
const globalStore = useGlobalStore();
const i18n = useI18n();
const route = useRoute();
const isBack = !!route.query.source;
const router = useRouter();

const isShowMenu = ref(false);

const language = computed(
  () => langList.find((d) => d.value === globalStore.language) ?? langList[0]
);

// 菜单连接
const menuList = [
  {
    name: 'Home',
    link: '/',
    isBlank: false
  },
  {
    name: 'Finance',
    link: 'https://www.novai.finance/#/',
    isBlank: true
  },
  {
    name: 'SWAP',
    link: 'https://swap.novaichain.com/#/swap',
    isBlank: true
  },
  {
    name: 'Novai Chain',
    link: 'https://www.novaichain.com/#/',
    isBlank: true
  }
];

const iconDom = ref('');
const setLang = (lang) => {
  i18n.locale.value = lang;
  globalStore.setGlobalState('language', lang);
  isShowLang.value = false;
  switchPageTitleAndDesc(lang);
};

const connectWalletHandle = async () => {
  const { setAccount } = useActiveWebState();
  const isTp = tp.isConnected();
  if (isTp) {
    const wallet = await tp.getWallet({ walletTypes: ['eth'] });
    setAccount(wallet.data.address);
  } else {
    await connectWallet();
  }
};

const accountMenu = (val) => {
  switch (val) {
    case 'Disconnect':
      disconnectWallet();
      userStore.logout();
      window.location.reload();
      break;

    default:
      break;
  }
};

const isShowLang = ref(false);

const isShowQuit = ref(false);

const against = (t) => {
  if (!t) return '';
  if (t.length <= 10) {
    return t;
  }
  return t.substring(0, 6) + '...' + t.substring(t.length - 4, t.length);
};

const againstLater = (t) => {
  if (!t) return '';
  if (t.length <= 5) {
    return t;
  }
  return '...' + t.substring(t.length - 4, t.length);
};
watch(
  () => account.value,
  async (newAccount) => {
    const rpcProvider = getRpcProviderByChain(BASE_CHAIN_ID);
    const balance = await rpcProvider.getBalance(newAccount);
    // const num = Number(toReadableAmount(balance, Decimals.USDT[BASE_CHAIN_ID])).toFixed(
    //   6,
    //   BigNumber.ROUND_DOWN
    // );
    const num = Number(toReadableAmount(balance, 18)).toFixed(4);

    commonStore.setNovaiBalance(num);
    if (newAccount) {
      iconDom.value = Jazzicon(16, parseInt(newAccount.slice(2, 10), 16)).outerHTML;
    }
  },
  {
    immediate: true
  }
);

const closeMenu = () => {
  isShowMenu.value = false;
};

onMounted(() => {
  switchPageTitleAndDesc(globalStore.language);
  window.addEventListener('click', closeMenu);
});

onUnmounted(() => {
  window.removeEventListener('click', closeMenu);
});

const switchPageTitleAndDesc = (acLang) => {
  switch (acLang) {
    case 'zh':
      document.querySelector('#lenai-page-title').innerText =
        'LenAI：一个由人工智能驱动的创新型去中心化借贷平台';
      document.querySelector('#lenai-desc-meta').content =
        'LenAI 是一个由区块链技术和人工智能驱动的创新型去中心化借贷平台，为全球用户提供安全、高效、智能的借贷服务。LenAI 支持主流加密资产作为抵押品，并通过智能合约实现全自动化操作，确保透明性和合规性。平台独特的 AI 信用评估系统能够根据用户的链上行为生成个性化信用评分，从而提供更优的贷款利率和额度。无论是满足数字资产的流动性需求，还是高效管理抵押品，LenAI 致力于成为 Web3 时代用户首选的借贷解决方案。';
      break;
    default:
      document.querySelector('#lenai-page-title').innerText =
        'LenAI: An innovative decentralized lending platform powered by AI';
      document.querySelector('#lenai-desc-meta').content =
        "LenAI is an innovative decentralized lending platform powered by blockchain technology and artificial intelligence, offering secure, efficient, and intelligent lending services to users worldwide. LenAI supports mainstream crypto assets as collateral and uses smart contracts to ensure fully automated operations, guaranteeing transparency and compliance. The platform features a unique AI-based credit evaluation system that generates personalized credit scores based on users' on-chain behavior, providing better loan rates and limits. Whether it's meeting liquidity needs for digital assets or managing collateral efficiently, LenAI aims to be the preferred lending solution for users in the Web3 era.";
      break;
  }
};
</script>

<style scoped lang="scss">
.header {
  .triangle {
    width: 0;
    height: 0;
    border-left: 5px solid transparent;
    border-right: 5px solid transparent;
    border-top: 5px solid var(--bg3);
    border-bottom: 5px solid transparent;
  }
}
.lang_list {
  position: absolute;
  top: 60px;
  left: 50%;
  transition: all 0.3s;
}
.dropdown_item {
  transform: translateX(-50%) scale(1);
}
.dropdown_items {
  transform: translateX(-50%) scale(0);
}
.dropdown_quit_box {
  position: absolute;
  top: 20px;
  left: 50%;
  transition: all 0.3s;
}
.dropdown_quit {
  transform: translateX(-50%) scale(1);
}
.dropdown_quits {
  transform: translateX(-50%) scale(0);
}
@media (max-width: 768px) {
  .lang_list {
    top: 45px;
    left: auto;
    right: 15px;
  }
  .dropdown_item {
    transform: translateX(0) scale(1);
  }
  .dropdown_items {
    transform: translateX(0) scale(0);
  }
  .dropdown_quit {
    transform: translateX(0) scale(1);
  }
  .dropdown_quits {
    transform: translateX(0) scale(0);
  }
  .dropdown_quit_box {
    position: absolute;
    top: 20px;
    left: 0;
    transition: all 0.3s;
  }
  .menu_model {
    width: 100%;
    height: calc(100% - 54px);
    position: fixed;
    top: 54px;
    left: 0;
    z-index: 999;
  }
  .menu_mobile {
    width: 50%;
    height: 100%;
    background: #000;
    position: absolute;
    top: 0;
    left: 0;
  }
}
</style>
