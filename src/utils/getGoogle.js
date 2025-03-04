import { Loader } from '@googlemaps/js-api-loader';

// 谷歌地图配置
export const loader = new Loader({
  // apiKey: 'AIzaSyCJnUxHpbC9vvPfvO52gK4ePAGcC-EOSiY',
  apiKey: 'AIzaSyBzdOTdw0HZScUmjp03S0gb3Sub_lCrIfE',
  version: 'weekly',
  libraries: ['places']
});
