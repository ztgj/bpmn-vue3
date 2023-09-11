<template>
  <div style="display: flex;height: 100%;">
    <my-process-designer :key="`designer-${reloadIndex}`" :options="{
      taskResizingEnabled: true,
      eventResizingEnabled: true,
      minimap: {
        open: true
      }
    }" v-model="xmlString" v-bind="controlForm" ref="processDesigner" @init-finished="initModeler" />
    <my-properties-panel :key="`penal-${reloadIndex}`" :bpmn-modeler="modeler" :prefix="controlForm.prefix"
      class="process-panel" />

  </div>
</template>

<script setup>
// 自定义渲染（隐藏了 label 标签）
import Log from '../package/Log';
// 任务resize

import 'bpmn-js/dist/assets/diagram-js.css';
import 'bpmn-js/dist/assets/bpmn-font/css/bpmn.css';
import 'bpmn-js/dist/assets/bpmn-font/css/bpmn-codes.css';
import { onBeforeUnmount, toRaw, ref, watch, reactive, shallowRef } from 'vue'

import myProcessDesigner from '../package/designer/ProcessDesigner.vue'
import myPropertiesPanel from '../package/penal/PropertiesPanel.vue'
const controlForm = reactive({
  processId: '',
  processName: '',
  simulation: true,
  labelEditing: false,
  labelVisible: false,
  prefix: 'camunda',
  headerButtonSize: 'small',
  events: ['element.click', 'element.contextmenu'],
})
const modeler = ref(null)
const initModeler = (modelValue) => {
  setTimeout(() => {
    modeler.value = modelValue
    const canvas = modelValue.get('canvas');
    const rootElement = canvas.getRootElement();
    Log.prettyPrimary('Process Id:', rootElement.id);
    Log.prettyPrimary('Process Name:', rootElement.businessObject.name);
  }, 10);
}

const xmlString = ref('')
const reloadIndex = ref(0)

</script>

<style lang="scss" scoped>
body {
  //   overflow: hidden;
  margin: 0;
  //   box-sizing: border-box;
}

#app {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: row;
  //   box-sizing: border-box;
  //   display: inline-grid;
  //   grid-template-columns: 100px auto max-content;
}

.demo-info-bar {
  position: fixed;
  right: 8px;
  bottom: 108px;
  z-index: 1;
}

.demo-control-bar {
  position: fixed;
  right: 8px;
  bottom: 48px;
  z-index: 1;
}

.open-model-button {
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  font-size: 32px;
  background: rgba(64, 158, 255, 1);
  color: #ffffff;
  cursor: pointer;
}

.zoom-in-right-enter-active,
.zoom-in-right-leave-active {
  opacity: 1;
  transform: scaleY(1) translateY(-48px);
  transition: all 300ms cubic-bezier(0.23, 1, 0.32, 1);
  transform-origin: right center;
}

.zoom-in-right-enter,
.zoom-in-right-leave-active {
  opacity: 0;
  transform: scaleX(0) translateY(-48px);
}

.info-tip {
  position: absolute;
  width: 480px;
  top: 0;
  right: 64px;
  z-index: 10;
  box-sizing: border-box;
  padding: 0 16px;
  color: #333333;
  background: #f2f6fc;
  transform: translateY(-48px);
  border: 1px solid #ebeef5;
  border-radius: 4px;

  &::before,
  &::after {
    content: "";
    width: 0;
    height: 0;
    border-width: 8px;
    border-style: solid;
    position: absolute;
    right: -15px;
    top: 50%;
  }

  &::before {
    border-color: transparent transparent transparent #f2f6fc;
    z-index: 10;
  }

  &::after {
    right: -16px;
    border-color: transparent transparent transparent #ebeef5;
    z-index: 1;
  }
}

.control-form {
  .el-radio {
    width: 100%;
    line-height: 32px;
  }
}

.element-overlays {
  box-sizing: border-box;
  padding: 8px;
  background: rgba(0, 0, 0, 0.6);
  border-radius: 4px;
  color: #fafafa;
}

body,
body * {

  /* 滚动条 */
  &::-webkit-scrollbar-track-piece {
    background-color: #fff;
    /*滚动条的背景颜色*/
    -webkit-border-radius: 0;
    /*滚动条的圆角宽度*/
  }

  &::-webkit-scrollbar {
    width: 10px;
    /*滚动条的宽度*/
    height: 8px;
    /*滚动条的高度*/
  }

  &::-webkit-scrollbar-thumb:vertical {
    /*垂直滚动条的样式*/
    height: 50px;
    background-color: rgba(153, 153, 153, 0.5);
    -webkit-border-radius: 4px;
    outline: 2px solid #fff;
    outline-offset: -2px;
    border: 2px solid #fff;
  }

  &::-webkit-scrollbar-thumb {
    /*滚动条的hover样式*/
    background-color: rgba(159, 159, 159, 0.3);
    -webkit-border-radius: 4px;
  }

  &::-webkit-scrollbar-thumb:hover {
    /*滚动条的hover样式*/
    background-color: rgba(159, 159, 159, 0.5);
    -webkit-border-radius: 4px;
  }
}
</style>
