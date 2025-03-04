<template>
  <div class="font-['Poppins']" border-t="1 solid [rgba(255,255,255,0.16)]">
    <div>
      <div class="max-w-[1240px] mx-auto pb-[20px] pt-[41px] md:px-[0px]">
        <div class="flex justify-end pb-[6px] pr-[10px] md:pr-[0px]">
          <img class="w-[11px] cursor-pointer" @click="scrollToTop" src="@/assets/svg/sticky.svg" />
        </div>
        <div class="md:flex md:justify-between md:!text-left text-center">
          <div>
            <img
              class="w-[92px] h-[42px] inline-block md:!block"
              src="@/assets/img/home/logo_dark.svg"
              alt=""
            />
            <div class="mt-[14px]">{{ $t('footer.footer_subtitle') }}</div>
            <ul
              class="flex mt-[20px] justify-center mb-[5px] md:!justify-start md:mt-[76px] md:!mb-[0]"
            >
              <li class="mr-[27px]">
                <a href="mailto:marketing@novaichain.co" target="_blank">
                  <img class="w-[16px]" src="@/assets/svg/8804.svg"
                /></a>
              </li>
              <li class="mr-[27px]">
                <a href="https://t.me/Novai_Community" target="_blank">
                  <img class="w-[16px]" src="@/assets/svg/8805.svg"
                /></a>
              </li>
              <li class="mr-[27px]">
                <a href="https://x.com/NovaiChain_" target="_blank">
                  <img class="w-[16px]" src="@/assets/svg/8806.svg"
                /></a>
              </li>
              <li class="mr-[27px]">
                <a href="https://medium.com/@novaidao" target="_blank">
                  <img class="w-[16px]" src="@/assets/svg/8808.svg"
                /></a>
              </li>
              <li class="">
                <a href="https://t.me/novarchain1" target="_blank">
                  <img class="w-[16px]" src="@/assets/svg/8809.svg" />
                </a>
              </li>
            </ul>
          </div>
          <div class="md:flex">
            <ul class="md:pr-[97px] mt-[10px] md:mt-[0px]">
              <li class="text-c12 text-[14px] font-bold">
                {{ $t('footer.About_Us') }}
              </li>
              <li class="text-[#999999] hover:translate-x-[10px] transition text-[14px] mt-[10px]">
                <a
                  class="text-[#999999]"
                  href="https://scan.novaichain.com/novaichain/aboutUs/privacyPolicy"
                  target="_blank"
                >
                  {{ $t('footer.Privacy_Policy') }}
                </a>
              </li>
              <li class="text-[#999999] hover:translate-x-[10px] transition text-[14px] mt-[10px]">
                <a
                  class="text-[#999999]"
                  href="https://scan.novaichain.com/novaichain/aboutUs/termsOfService"
                  target="_blank"
                >
                  {{ $t('footer.Terms_of_Service') }}
                </a>
              </li>
            </ul>
            <ul class="md:pr-[97px] mt-[10px] md:mt-[0px]">
              <li class="text-c12 text-[14px] font-bold">
                {{ $t('footer.Services_&_Support') }}
              </li>
              <li class="text-[#999999] hover:translate-x-[10px] transition text-[14px] mt-[10px]">
                <a class="text-[#999999]" href="https://medium.com/@novaidao" target="_blank">{{
                  $t('footer.Medium')
                }}</a>
              </li>
              <li class="text-[#999999] hover:translate-x-[10px] transition text-[14px] mt-[10px]">
                <a class="text-[#999999]" href="mailto:marketing@novaichain.co" target="_blank">{{
                  $t('footer.Contact_Us')
                }}</a>
              </li>
            </ul>
            <ul class="md:pr-[30px] mt-[10px] md:mt-[0px]">
              <li class="text-c12 text-[14px] font-bold">
                {{ $t('footer.Resources') }}
              </li>
              <li class="text-[#999999] hover:translate-x-[10px] transition text-[14px] mt-[10px]">
                <a
                  class="text-[#999999]"
                  href="https://scan.novaichain.com/novai_chain_intro.pdf"
                  target="_blank"
                  >{{ $t('footer.Introduce') }}</a
                >
              </li>
              <li class="text-[#999999] hover:translate-x-[10px] transition text-[14px] mt-[10px]">
                <a
                  class="text-[#999999]"
                  href="https://scan.novaichain.com/novai_chain_white_paper.pdf"
                  target="_blank"
                  >{{ $t('footer.Whitepaper') }}</a
                >
              </li>
            </ul>
          </div>
        </div>
        <div class="md:mt-[20px] mt-[10px] text-[14px] md:!text-left text-center">
          Copyright© 2017-2024 novaichain.com
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
function scrollToTop() {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
}
</script>
