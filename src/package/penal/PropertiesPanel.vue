<template>
  <div class="process-panel__container" style="width: 45%">
    <a-collapse v-model:activeKey="activeTab" accordion>
      <a-collapse-panel key="base">
        <template #header>
          <div style="font-weight: bold"><info-circle-outlined /><span> 常规</span></div>
        </template>
        <element-base-info :business-object="elementBusinessObject" :type="elementType" />
      </a-collapse-panel>
      <a-collapse-panel v-if="elementType === 'Process'" key="message">
        <template #header>
          <div style="font-weight: bold"><share-alt-outlined /><span> 消息与信号</span> </div>
        </template>
        <signal-and-massage />
      </a-collapse-panel>
      <a-collapse-panel v-if="conditionFormVisible" key="condition">
        <template #header>
          <div style="font-weight: bold"> <span> 流转条件</span> </div>
        </template>
        <flow-condition :business-object="elementBusinessObject" :type="elementType" />
      </a-collapse-panel>
      <a-collapse-panel v-if="formVisible" key="form">
        <template #header>
          <div style="font-weight: bold"><appstore-outlined /> <span> 表单</span> </div>
        </template>
        <element-form :id="elementId" :type="elementType" />
      </a-collapse-panel>
      <a-collapse-panel
        v-if="
          (elementType.indexOf('Task') !== -1 &&
            elementType !== 'Task' &&
            elementType !== 'ManualTask') ||
          elementType === 'CallActivity'
        "
        key="task"
      >
        <template #header>
          <div style="font-weight: bold"> <aim-outlined /><span> 详情</span> </div>
        </template>
        <element-task
          :id="elementId"
          :type="elementType"
          :business-object="elementBusinessObject"
        />
      </a-collapse-panel>
      <a-collapse-panel key="variant" v-if="elementType === 'CallActivity'">
        <template #header>
          <div style="font-weight: bold"><laptop-outlined /><span> 变量</span></div>
        </template>
        <element-variant :id="elementId" :type="elementType" />
      </a-collapse-panel>
      <a-collapse-panel v-if="elementType.indexOf('Task') !== -1" key="multiInstance">
        <template #header>
          <div style="font-weight: bold"><apartment-outlined /><span> 多实例</span> </div>
        </template>
        <element-multi-instance :business-object="elementBusinessObject" :type="elementType" />
      </a-collapse-panel>
      <a-collapse-panel key="listeners">
        <template #header>
          <div style="font-weight: bold"><laptop-outlined /><span> 执行监听器</span></div>
        </template>
        <element-listeners :id="elementId" :type="elementType" />
      </a-collapse-panel>
      <a-collapse-panel key="inputoutput">
        <template #header>
          <div style="font-weight: bold"><laptop-outlined /><span> 输入输出</span></div>
        </template>
        <element-input-output  />
      </a-collapse-panel>
      <a-collapse-panel
        key="field"
        v-if="
          elementType === 'SendTask' ||
          elementType === 'BusinessRuleTask' ||
          elementType === 'ScriptTask' ||
          elementType === 'ServiceTask'
        "
      >
        <template #header>
          <div style="font-weight: bold"><laptop-outlined /><span> 字段注入</span></div>
        </template>
        <element-field :id="elementId" />
      </a-collapse-panel>
      <a-collapse-panel v-if="elementType === 'UserTask'" key="taskListeners">
        <template #header>
          <div style="font-weight: bold"><borderless-table-outlined /><span> 任务监听器</span></div>
        </template>
        <user-task-listeners :id="elementId" :type="elementType" />
      </a-collapse-panel>
      <a-collapse-panel key="extensions">
        <template #header>
          <div style="font-weight: bold"><inbox-outlined /><span> 扩展属性</span></div>
        </template>
        <element-properties :id="elementId" :type="elementType" />
      </a-collapse-panel>
      <a-collapse-panel key="priority" v-if="elementType === 'SendTask'">
        <template #header>
          <div style="font-weight: bold"><folder-outlined /><span> 扩展任务配置</span></div>
        </template>
        <element-task-priority :id="elementId" />
      </a-collapse-panel>
      <a-collapse-panel key="job">
        <template #header>
          <div style="font-weight: bold"><folder-outlined /><span> 异步延续</span></div>
        </template>
        <element-job-config :id="elementId" />
      </a-collapse-panel>
      <a-collapse-panel key="other">
        <template #header>
          <div style="font-weight: bold"><folder-outlined /><span> 元素文档</span></div>
        </template>
        <element-other-config :id="elementId" />
      </a-collapse-panel>
    </a-collapse>
  </div>
</template>
<script>
  export default {
    name: 'MyPropertiesPanel',
  };
</script>
<script setup>
  import ElementBaseInfo from './base/ElementBaseInfo.vue';
  import ElementOtherConfig from './other/ElementOtherConfig.vue';
  import ElementTask from './task/ElementTask.vue';
  import ElementMultiInstance from './multi-instance/ElementMultiInstance.vue';
  import FlowCondition from './flow-condition/FlowCondition.vue';
  import SignalAndMassage from './signal-message/SignalAndMessage.vue';
  import ElementListeners from './listeners/ElementListeners.vue';
  import ElementProperties from './properties/ElementProperties.vue';
  import ElementForm from './form/ElementForm.vue';
  import UserTaskListeners from './listeners/UserTaskListeners.vue';
  import ElementJobConfig from './config/ElementJobConfig.vue';
  import ElementTaskPriority from './priority/ElementTaskPriority.vue';
  import ElementInputOutput from './input-output/ElementIntputOutput.vue';
  import ElementField from './field/ElementField.vue';
  import ElementVariant from './variant/ElementVariant.vue';
  import Log from '../Log';

  import { provide, ref, watch, onBeforeUnmount } from 'vue';
  const props = defineProps({
    bpmnModeler: Object,
    prefix: {
      type: String,
      default: 'camunda',
    },
    width: {
      type: Number,
      default: 520,
    },
  });
  provide('prefix', props.prefix);
  provide('width', props.width);

  const activeTab = ref(['base', 'condition', 'form', 'task']);
  const elementId = ref('');
  watch(
    () => elementId.value,
    () => {
      activeTab.value = ['base', 'condition', 'form', 'task'];
    },
    {
      deep: true,
    },
  );
  provide('id', elementId);
  const bpmnElement = ref('');
  const elementType = ref('');
  const conditionFormVisible = ref(false);
  const formVisible = ref(false);
  const elementBusinessObject = ref({});
  // 初始化数据
  const initFormOnChanged = (element) => {
    let activatedElement = element;
    if (!activatedElement) {
      activatedElement =
        window.bpmnInstances.elementRegistry.find((el) => el.type === 'bpmn:Process') ??
        window.bpmnInstances.elementRegistry.find((el) => el.type === 'bpmn:Collaboration');
    }
    if (!activatedElement) return;
    Log.printBack(
      `select element changed: id: ${activatedElement.id} , type: ${activatedElement.businessObject.$type}`,
    );
    Log.prettyInfo('businessObject', activatedElement.businessObject);
    window.bpmnInstances.bpmnElement = activatedElement;
    bpmnElement.value = activatedElement;
    elementId.value = activatedElement.id;
    elementType.value = activatedElement.type.split(':')[1] || '';
    elementBusinessObject.value = JSON.parse(JSON.stringify(activatedElement.businessObject));
    conditionFormVisible.value = !!(
      elementType.value === 'SequenceFlow' &&
      activatedElement.source &&
      activatedElement.source.type.indexOf('StartEvent') === -1
    );
    formVisible.value = elementType.value === 'UserTask' || elementType.value === 'StartEvent';
  };
  const getActiveElement = () => {
    // 初始第一个选中元素 bpmn:Process
    initFormOnChanged(null);
    props.bpmnModeler.on('import.done', (e) => {
      console.log(e);
      initFormOnChanged(null);
    });
    // 监听选择事件，修改当前激活的元素以及表单
    props.bpmnModeler.on('selection.changed', ({ newSelection }) => {
      initFormOnChanged(newSelection[0] || null);
    });
    props.bpmnModeler.on('element.changed', ({ element }) => {
      // 保证修改 "默认流转路径" 类似需要修改多个元素的事件发生的时候，更新表单的元素与原选中元素不一致。
      if (element && element.id === elementId.value) {
        initFormOnChanged(element);
      }
    });
  };
  const timer = ref();
  const initModels = () => {
    // 初始化 modeler 以及其他 moddle
    if (!props.bpmnModeler) {
      // 避免加载时 流程图 并未加载完成
      timer.value = setTimeout(() => initModels(), 10);
      return;
    }
    if (timer.value) clearTimeout(timer.value);
    window.bpmnInstances = {
      modeler: props.bpmnModeler,
      modeling: props.bpmnModeler.get('modeling'),
      moddle: props.bpmnModeler.get('moddle'),
      eventBus: props.bpmnModeler.get('eventBus'),
      bpmnFactory: props.bpmnModeler.get('bpmnFactory'),
      elementFactory: props.bpmnModeler.get('elementFactory'),
      elementRegistry: props.bpmnModeler.get('elementRegistry'),
      replace: props.bpmnModeler.get('replace'),
      selection: props.bpmnModeler.get('selection'),
    };
    getActiveElement();
  };
  initModels();
  onBeforeUnmount(() => {
    window.bpmnInstances = null;
  });
</script>
