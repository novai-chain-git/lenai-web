# Vue 3 + Vite

This template should help get you started developing with Vue 3 in Vite. The template uses Vue 3 `<script setup>` SFCs, check out the [script setup docs](https://v3.vuejs.org/api/sfc-script-setup.html#sfc-script-setup) to learn more.

## Recommended IDE Setup

- [VS Code](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar)

下面是一些链所支持的钱包：
| 链 | PC | 移动端 |
| ------ | ------ | ------ |
| EVM | metaMask | imtoken tp trustwallet |
| BTC | unisat | tp |
| EVM | metaMask | imtoken tp trustwallet |
| TRX | TronLink | imtoken tp |

目录结构：

```
alphahomebridging
├─ 📁.vscode
├─ 📁public // 静态资源
├─ 📁src
│  ├─ 📁api // 接口请求
│  │  └─ 📄index.js
│  ├─ 📁assets // 静态资源
│  │  ├─ 📁img  // 图片资源
│  ├─ 📁components  // 公共组件
│  ├─ 📁config // 项目配置
│  ├─ 📁hooks // 自定义hooks
│  ├─ 📁lang  // 语言包
│  ├─ 📁router  // 路由
│  ├─ 📁store // Pinia状态管理
│  ├─ 📁style // 样式
│  ├─ 📁utils  // 工具函数
│  ├─ 📁views  // 页面
│  │  └─ 📁home
│  │     ├─ 📁components
│  │     │  ├─ 📄deposit.vue // 存款页面
│  │     │  ├─ 📄record.vue // 交易记录页面
│  │     │  └─ 📄withdrawal.vue // 提现页面
│  │     └─ 📄index.vue
│  ├─ 📁web3-sdk  // web3 sdk
│  │  ├─ 📁abi // abi 文件
│  │  ├─ 📁constants
│  │  │  ├─ 📄contracts.ts // 合约配置文件
│  │  │  └─ 📄index.ts
│  │  ├─ 📁core // 存放各链的信息
│  │  ├─ 📁hooks // 自定义hooks
│  │  ├─ 📁stores // 各链的状态管理
│  │  ├─ 📁tokens
│  │  ├─ 📁utils  // 工具函数
│  │  ├─ 📁wallet // 钱包配置
│  │  ├─ 📄index.ts
│  │  └─ 📄types.ts
│  ├─ 📄App.vue // 根组件
│  └─ 📄main.js // 入口文件
├─ 📄.env.development  // 开发环境变量
├─ 📄.env.prod // 生产环境测试变量
├─ 📄.env.production // 生产环境变量
├─ 📄.env.test // 测试环境变量
├─ 📄.gitignore // git忽略文件
├─ 📄.prettierrc.cjs // 代码格式化配置
├─ 📄index.html // 入口html文件
├─ 📄jsconfig.json // js配置
├─ 📄package.json // 项目依赖
├─ 📄pnpm-lock.yaml // pnpm锁定文件
├─ 📄README.md
├─ 📄uno.config.js // UnoCss配置
└─ 📄vite.config.js // vite配置
```

在 web-sdk/wallet/networks.ts 文件下的配置说明：
ETHEREUM_CHAIN：是所有支持的链的
TokenInfo：是这个链所支持的代币
WalletTypes：TP 钱包切换网络所需要的钱包名称

在 web-sdk/wallet/config.ts 文件下的配置说明：
ChainId: 各链的 ID
DecimalsMap,DecimalsMapProduction: 各代币的精度

在 web-sdk/constants/constants.ts 文件下的配置说明：
addresses: 各链的测试合约地址
addressesProduction：各链的生产合约地址

项目首先需要安装依赖：pnpn install
运行项目：pnpm run dev
打包项目：pnpm run build
