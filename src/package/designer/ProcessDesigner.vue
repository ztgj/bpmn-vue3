<template>
  <div class="my-process-designer">
    <div class="my-process-designer__header">
      <div class="a_flex" style="justify-content: space-between">
        <a-space style="margin-right: 5px">
          <a-button type="primary" @click="$refs.files.click()">导入</a-button>
          <a-button type="primary" @click="saveBpmn()">导出</a-button>
        </a-space>
        <input type="file" @change="inputfile()" id="fileItem" ref="files" style="display: none" />
      </div>
    </div>
    <div class="my-process-designer__container">
      <div class="my-process-designer__canvas" ref="bpmnCanvas"></div>
    </div>
    <a-modal v-model:visible="visible">
      <a-form
        :model="formState"
        ref="formRef"
        :label-col="{ span: 6 }"
        :wrapper-col="{ span: 14 }"
        autocomplete="off"
      >
        <a-form-item
          label="部署名称"
          name="deploymentName"
          :rules="[{ required: true }]"
        >
          <a-input v-model:value="formState.deploymentName" />
        </a-form-item>
        <a-form-item label="文件名" name="fileName" :rules="[{ required: true }]">
          <a-input v-model:value="formState.fileName" /> </a-form-item
      ></a-form>
    </a-modal>
  </div>
</template>

<script>
  export default {
    name: 'MyProcessDesigner',
  };
</script>

<script setup>
  import BpmnModeler from 'bpmn-js/lib/Modeler';
  import DefaultEmptyXML from './plugins/defaultEmpty';
  // 翻译方法
  import customTranslate from './plugins/translate/customTranslate';
  import translationsCN from './plugins/translate/zh';
  // 标签解析 Moddle
  import camundaModdleDescriptor from './plugins/descriptor/camundaDescriptor.json';
  // 标签解析 Extension
  import camundaModdleExtension from './plugins/extension-moddle/camunda';
  // 模拟流转流程
  import tokenSimulation from 'bpmn-js-token-simulation';

  import { computed, ref, onBeforeUnmount, onMounted, inject, reactive } from 'vue';
  import { xmlStr } from '../../assets/xmlStr';
  // import { getDictData } from '@/api/system-manage/code.js';
  const props = defineProps({
    prefix: {
      type: String,
      default: 'camunda',
    },
    keyboard: {
      type: Boolean,
      default: true,
    },
    onlyCustomizeAddi: {
      type: Boolean,
      default: false,
    },
    options: {
      type: Object,
      default: () => ({}),
    }, // 自定义的翻译文件
    onlyCustomizeModdle: {
      type: Boolean,
      default: false,
    },
    events: {
      type: Array,
      default: () => ['element.click'],
    },
    simulation: {
      type: Boolean,
      default: true,
    },
    additionalModel: [Object, Array], // 自定义model
    moddleExtension: Object, // 自定义moddle
    translations: Object, // 自定义的翻译文件
    processId: String,
    processName: String,
  });
  const additionalModules = computed(() => {
    const Modules = [];
    // 仅保留用户自定义扩展模块
    if (props.onlyCustomizeAddi) {
      if (Object.prototype.toString.call(props.additionalModel) === '[object Array]') {
        return props.additionalModel || [];
      }
      return [props.additionalModel];
    }

    // 插入用户自定义扩展模块
    if (Object.prototype.toString.call(props.additionalModel) === '[object Array]') {
      Modules.push(...props.additionalModel);
    } else {
      props.additionalModel && Modules.push(props.additionalModel);
    }

    // 翻译模块
    const TranslateModule = {
      translate: ['value', customTranslate(props.translations || translationsCN)],
    };
    Modules.push(TranslateModule);
    // 模拟流转模块
    if (props.simulation) {
      Modules.push(tokenSimulation);
    }

    // 根据需要的流程类型设置扩展元素构建模块
    if (props.prefix === 'camunda') {
      Modules.push(camundaModdleExtension);
    }

    return Modules;
  });
  const moddleExtensions = computed(() => {
    const Extensions = {};
    // 仅使用用户自定义模块
    if (props.onlyCustomizeModdle) {
      return props.moddleExtension || null;
    }

    // 插入用户自定义模块
    if (props.moddleExtension) {
      for (let key in props.moddleExtension) {
        Extensions[key] = props.moddleExtension[key];
      }
    }

    // 根据需要的 "流程类型" 设置 对应的解析文件
    if (props.prefix === 'camunda') {
      Extensions.camunda = camundaModdleDescriptor;
    }

    return Extensions;
  });

  const initModelListeners = () => {
    const EventBus = bpmnModeler.value.get('eventBus');
    // 注册需要的监听事件, 将. 替换为 - , 避免解析异常
    props.events.forEach((event) => {
      EventBus.on(event, function (eventObj) {
        let eventName = event.replace(/\./g, '-');
        let element = eventObj ? eventObj.element : null;
        emits(eventName, element, eventObj);
      });
    });
  };
  const createNewDiagram = async (xml) => {
    // 将字符串转换成图显示出来
    let newId = props.processId || `Process_${new Date().getTime()}`;
    let newName = props.processName || `业务流程_${new Date().getTime()}`;
    let xmlString = xml || DefaultEmptyXML(newId, newName, props.prefix);
    try {
      let { warnings } = await bpmnModeler.value.importXML(xmlString);
      if (warnings && warnings.length) {
        warnings.forEach((warn) => console.warn(warn));
      }
    } catch (e) {
      console.error(`[Process Designer Warn]: ${e?.message || e}`);
    }
  };
  const emits = defineEmits(['init-finished']);
  const bpmnModeler = ref(null);
  const bpmnCanvas = ref('');
  const initBpmnModeler = () => {
    bpmnModeler.value = new BpmnModeler({
      container: bpmnCanvas.value,
      keyboard: props.keyboard ? { bindTo: document } : null,
      additionalModules: additionalModules.value,
      moddleExtensions: moddleExtensions.value,
      ...props.options,
    });
    emits('init-finished', bpmnModeler.value);
    initModelListeners();
  };


  const formState = reactive({
    fileName: null,
  });
  const visible = ref(false);
  const formRef = ref();

  //保存方法
  const saveData = (suffix, data) => {
    const dataTrack = `${suffix}`;
    const a = document.createElement('a');
    const name = formState.fileName ? `${formState.fileName}.${dataTrack}` : `diagram.${dataTrack}`;
    a.setAttribute('href', `data:application/bpmn20-xml;charset=UTF-8,${encodeURIComponent(data)}`);
    a.setAttribute('target', '_blank');
    a.setAttribute('dataTrack', `diagram:download-${dataTrack}`);
    a.setAttribute('download', name);
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };
  //以bpmn形式保存
  const saveBpmn = () => {
    bpmnModeler.value.saveXML({ format: true }, (err, data) => {
      saveData('bpmn', data);
    });
  };
  const inputfile = () => {
    const file = document.getElementById('fileItem').files[0];
    const reader = new FileReader();
    reader.readAsText(file);
    formState.fileName = file.name;
    reader.onload = function () {
      createNewDiagram(reader.result);
    };
  };

  
  onMounted(async () => {
    initBpmnModeler();
   
      createNewDiagram(xmlStr)

  });
  onBeforeUnmount(() => {
    if (bpmnModeler.value) bpmnModeler.value.destroy();
    emits('destroy', bpmnModeler.value);
    bpmnModeler.value = null;
  });
  
</script>
