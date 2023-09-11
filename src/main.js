import { createApp } from 'vue'
import App from './App.vue'
import './package/theme/index.scss';
import '@purge-icons/generated';

const app = createApp(App)


import Antd from 'ant-design-vue';
import 'ant-design-vue/dist/antd.css';
import * as antdVueIcons from '@ant-design/icons-vue';
app.use(Antd);
/**
 * 注册icon组件
 */
function registerIconComponent(app) {
    Object.keys(antdVueIcons).forEach((key) => {
      app.component(key, antdVueIcons[key]);
    });
    app.config.globalProperties.$antdVueIcons = antdVueIcons;
  }

    registerIconComponent(app);
app.mount('#app')