<template>
  <el-config-provider :locale="locale" :size="assemblySize" :button="buttonConfig">
    <div class="main">
      <Header></Header>
      <router-view v-slot="{ Component }">
        <keep-alive :include="configInfoData.includeList">
          <component class="view-wrap" :key="$route.fullPath" :is="Component" />
        </keep-alive>
      </router-view>
      <Footer></Footer>
      <img class="bg_img_two" src="@/assets/img/home/home_bg_two.png" alt="" />
      <img class="bg_img_there" src="@/assets/img/home/home_bg_two.png" alt="" />
    </div>
  </el-config-provider>
</template>
<script setup>
import Header from '@/components/Header.vue';
import Footer from '@/components/Footer.vue';

const configInfoData = {
  noNavPageNames: ['layout', 'detailsPage', 'evaluate', 'resources'],
  includeList: []
};
import { useI18n } from 'vue-i18n';
import en from 'element-plus/es/locale/lang/en';
import zhCn from 'element-plus/es/locale/lang/zh-cn';
import { getBrowserLang } from '@/utils/index.js';
// init language
const i18n = useI18n();
const globalStore = useGlobalStore();
i18n.locale.value = globalStore.language;

// element language
const locale = computed(() => {
  console.log('语言改变');
  if (globalStore.language == 'zh') return zhCn;
  if (globalStore.language == 'en') return en;
  return getBrowserLang() == 'zh' ? zhCn : en;
});

// element assemblySize
const assemblySize = computed(() => globalStore.assemblySize);

// element button config
const buttonConfig = reactive({ autoInsertSpace: false });
</script>

<style lang="scss">

@font-face {
  font-family: 'Poppins';
  src: url('./assets/font/poppins/Poppins-Regular.ttf') format('truetype');
  font-style: normal;
  font-weight: normal;
}

@font-face {
  font-family: 'Outfit';
  src: url('./assets/font/outfit/Outfit-Medium.ttf') format('truetype');
  font-style: normal;
  font-weight: normal;
}


* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

@media (max-width: 768px) {
  .el-button--primary:hover {
    -webkit-tap-highlight-color: rgba(0 0 0 / 0);
    background-color: rgb(77 81 210 / var(--un-bg-opacity));
  }

  .el-button--primary:active {
    -webkit-tap-highlight-color: rgba(0 0 0 / 0);
    color: var(--el-button-hover-text-color);
    border-color: var(--el-button-hover-border-color);
    background-color: var(--el-button-hover-bg-color);
    outline: none;
  }
}

body {
  margin: 0;
  font-size: 15px;
  line-height: 1.5;
  color: var(--font-color1);
  background: var(--bg2);
}

#app {
  // font-family: microsoft yahei, Avenir, Helvetica, Arial, sans-serif;
  font-family: "Outfit", Pingfang, Arial, Helvetica, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

p {
  margin: 0;
}

ul,
li {
  list-style: none;
}

#app,
.view-wrap {
  box-sizing: border-box;
  min-height: calc(100vh - 68px);
}

img {
  display: block;
}

a {
  text-decoration: none;
  color: var(--font-color4);
}

//文字渐变色
.bg-lv {
  background-image: linear-gradient(180deg, #5ac27c 0%, #b2e235 100%);
}

:root:root {
  --bg1: #ffffff;
  --bg2: #030b0e;
  --bg3: #808997;
  --bg4: #1f2329;
  --bg5: #181a20;
  --bg6: rgba(31, 35, 41, 0.37);
  --bg7: #131315;
  --bg8: rgba(164, 221, 64, 0.17);
  --bg9: #2D323A;
  --font-color1: #fff;
  --font-color2: #222;
  --font-color3: #000;
  --font-color4: #999;
  --font-color5: #130c0c;
  --font-color6: linear-gradient(180deg, #5ac27c 0%, #b2e235 100%) --font-color7: #808997;
  --font-color8: #9F9F9F;
  --font-color9: #EAECEF;
  --font-color10: #A4DD40;
  --font-color11: #A8DF3D;
  --font-color12: #5AC27C;
  --font-color13: rgba(255, 255, 255, 0.54);
  --border-color1: #484d57;
  --border-color2: #A8DF3D;
  --border-color3: #A4DD40;

}

// 按钮primary默认样式
button.el-button--primary {
  background: linear-gradient(180deg, #5ac27c 0%, #b2e235 100%) !important;

  &:hover {
    opacity: 0.9;
  }

  &:active {
    opacity: 1;
  }
}

// 需要页面底部加 padding 页面。有一个元素 class 为 .pbh
.view-wrap:has(.bottom-wrap) {
  padding-bottom: 180px;
}

body {
  &::-webkit-scrollbar {
    width: 0;
  }
}

// 渐变边框
// .border_gradient {
//   background: linear-gradient(227deg, #19c8ff 0%, #4d8cfe 48%, #913ffb 100%);
//   position: relative;
//   &::after {
//     content: '';
//     inset: 1px;
//     position: absolute;
//     background: var(--bg6);
//     border-radius: 14px;
//     z-index: 0;
//   }
// }

.main {
  position: relative;
  overflow: hidden;
}

.bg_img_two {
  position: absolute;
  width: 671px;
  height: 670px;
  top: 457px;
  left: -520px;
  z-index: -1;
}

.bg_img_there {
  position: absolute;
  width: 671px;
  height: 670px;
  top: 1093px;
  right: -520px;
  z-index: -1;
}


// 分页
.novai_pagination {

  .btn-prev,
  .btn-next {
    border: 1px solid var(--border-color2);
    border-radius: 3px;

    .el-icon {
      color: var(--font-color11)
    }
  }

  .el-pager {
    .is-active {
      background: linear-gradient(180deg, #5AC27C 0%, #B2E235 100%);
      border-radius: 3px;
    }

    .number {
      &:hover {
        color: var(--font-color11)
      }
    }

    .more {
      &:hover {
        color: var(--font-color11)
      }
    }
  }
}

// 弹窗弹出后固定页面宽度
.el-popup-parent--hidden {
  width: 100% !important;
}

.temp_dialog {
  .el-dialog__header {
    padding-bottom: 0;
  }

  .el-dialog__footer {
    padding-top: 0;
  }
}

// 移动端弹窗
.md_drawer {
  .el-drawer__header {
    padding: 0;
    margin: 0;
  }

  .el-drawer__body {
    padding: 0;
    overflow: hidden;
  }

  .el-drawer__footer{
    padding: 0;
  }
}

// 滑块的提示框
.ratio_slider_tooltip {}
</style>
