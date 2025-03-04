<template>
  <component
    v-model="show"
    :is="currentComponent"
    :title="$t('Adjust the pledge ratio')"
    :buttonText="$t('Increase the collateral')"
    :disabled="disabled"
    :loading="loading"
    @submit="onSubmit"
    width="390px"
  >
    <div class="px15" text="12 c1">
      <div class="flex">
        <div class="flex-1">
          <div text="c13">{{ $t('Total liabilities') }}</div>
          <div class="font-[OrbitronMedium] mt5">45151 TRX</div>
        </div>
        <div class="flex-1">
          <div text="c13">{{ $t('Mortgage amount') }}</div>
          <div class="font-[OrbitronMedium] mt5">2 USDT</div>
        </div>
      </div>
      <div class="h100 bg-bg9 mt15 flex relative">
        <div class="flex-1 flex">
          <div class="flex-1 flex flex-col justify-end items-end">
            <div class="font-[OrbitronMedium] pr5" text="right">78%</div>
            <div class="w90 pr5" text="c13 right">{{ $t('Initial Pledge Rate') }}</div>
            <div class="w100% h38 bg-to2 line-height-38 pr5" text="[#40C982] right">
              {{ $t('Low Risk') }}
            </div>
          </div>
          <div class="h100% flex flex-col items-center pt8">
            <div class="w2 h2 bg-[rgba(164,221,64,0.18)] bdr1"></div>
            <div class="w1 h100% mt2 bg-[#40C982]"></div>
          </div>
        </div>
        <div class="flex-1 flex">
          <div class="flex-1 flex flex-col justify-end items-end">
            <div class="font-[OrbitronMedium] pr5" text="right">85%</div>
            <div class="w90 pr5" text="c13 right">{{ $t('Margin Call Pledge Rate') }}</div>
            <div class="w100% h38 bg-to3 line-height-38 pr5" text="[#F68426] right">
              {{ $t('Medium Risk') }}
            </div>
          </div>
          <div class="h100% flex flex-col items-center pt8">
            <div class="w2 h2 bg-[rgba(246,132,38,0.45)] bdr1"></div>
            <div class="w1 h100% mt2 bg-[#F68426]"></div>
          </div>
        </div>
        <div class="flex-1 flex">
          <div class="flex-1 flex flex-col justify-end items-end">
            <div class="font-[OrbitronMedium] pr5" text="right">78%</div>
            <div class="w90 pr5" text="c13 right">{{ $t('Liquidation Pledge Rate') }}</div>
            <div class="w100% h38 bg-to4 line-height-38 pr5" text="[#C73C4D] right">
              {{ $t('High Risk') }}
            </div>
          </div>
          <div class="h100% flex flex-col items-center pt8">
            <div class="w2 h2 bg-[rgba(199,60,77,0.42)] bdr1"></div>
            <div class="w1 h100% mt2 bg-[#C73C4D]"></div>
          </div>
        </div>
        <div class="w100%" position="absolute bottom-0 left-0">
          <div class="fyc relative">
            <div class="h3 flex-1 bg-[#40C982]"></div>
            <div class="h3 flex-1 bg-[#F68426]"></div>
            <div class="h3 flex-1 bg-[#C73C4D]"></div>
            <div
              class="w9 h9 bg-bg1 bdr5 transform-translate-x--50% transform-translate-y-3"
              border="1 solid [#808997]"
              position="absolute bottom-0 left-0"
            ></div>
            <div
              class="w9 h9 bg-bg1 bdr5 transform-translate-x-50% transform-translate-y-3"
              border="1 solid [#808997]"
              position="absolute bottom-0 right-0"
            ></div>
          </div>
          <el-slider
            class="ratio_slider"
            tooltip-class="ratio_slider_tooltip"
            v-model="sliderValue"
            placement="bottom"
          >
          </el-slider>
        </div>
      </div>

      <div class="mt15" text="12 c1 ">{{ $t('Total repayment amount') }}</div>
      <div class="">
        <el-form :model="state" :rules="rules">
          <el-form-item class="h100% mb0! ratio_input h36 fyc mt8 bdr8 px12" border="1 solid bc1">
            <div class="fyc">
              <el-dropdown>
                <span class="fyc cursor-pointer" text="c1">
                  Increase
                  <div
                    class="w0 h0 ml8 transform-translate-y-25%"
                    border="5px solid transparent"
                    border-t="bg3"
                  ></div>
                </span>
                <template #dropdown>
                  <el-dropdown-menu>
                    <el-dropdown-item>Action 1</el-dropdown-item>
                    <el-dropdown-item>Action 2</el-dropdown-item>
                    <el-dropdown-item>Action 3</el-dropdown-item>
                    <el-dropdown-item disabled>Action 4</el-dropdown-item>
                    <el-dropdown-item divided>Action 5</el-dropdown-item>
                  </el-dropdown-menu>
                </template>
              </el-dropdown>
            </div>
            <div class="w1 h24 bg-bc1 mx8"></div>
            <el-input-number
              class="flex-1"
              type="number"
              :placeholder="$t('Enter Amount')"
              v-model="state.repayNum"
              :controls="false"
              clearable
            />
            <div class="font-[OrbitronBold] cursor-pointer ml12" text="12 c10">MAX</div>
            <div class="ml12 mr3 line-height-32" text="12 c1">BTC</div>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </component>
</template>

<script setup>
import popUpPc from '../../popUpPc.vue';
import popUpMb from '../../popUpMb.vue';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
const disabled = ref(false);
const loading = ref(false);

const show = defineModel({
  type: Boolean,
  default: false
});

const currentComponent = shallowRef(popUpPc);

const handleResize = () => {
  const isMb = window.innerWidth < 768;
  if (isMb) {
    currentComponent.value = popUpMb;
  } else {
    currentComponent.value = popUpPc;
  }
};

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

// 滑块的值
const sliderValue = ref(0);

const onSubmit = (vl) => {
  console.log(vl, '');
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
:deep(.ratio_slider) {
  height: auto;
  .el-slider__runway {
    height: 0px;
    .el-slider__bar {
      height: 0px;
    }
    .el-slider__button-wrapper {
      top: -19px;
      .el-slider__button {
        width: 18px;
        height: 12px;
        border-radius: 3px;
        border: none;
        position: relative;
        &::after {
          content: '';
          display: inline-block;
          width: 5px;
          height: 5px;
          background-image: url('@/assets/img/home/vertical.png');
          background-size: 100% 100%;
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
        }
      }
    }
  }
}

:deep(.ratio_input) {
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
</style>
