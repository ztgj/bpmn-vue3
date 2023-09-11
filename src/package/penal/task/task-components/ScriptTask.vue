<template>
  <a-form style="margin-top: 16px" :label-col="{ span: 6 }">
    <a-form-item label="脚本格式">
      <a-input
        v-model:value="scriptTaskForm.scriptFormat"
        allowClear
        @input="updateElementTask()"
        @change="updateElementTask()"
        size="small"
      />
    </a-form-item>
    <a-form-item label="脚本类型">
      <a-select v-model:value="scriptTaskForm.scriptType" size="small">
        <a-select-option value="inline">内联脚本</a-select-option>
        <a-select-option value="external">外部资源</a-select-option>
        <!-- <el-option label="内联脚本" value="inline" /> -->
        <!-- <el-option label="外部资源" value="external" /> -->
      </a-select>
    </a-form-item>
    <a-form-item label="脚本" v-show="scriptTaskForm.scriptType === 'inline'">
      <a-textarea
        v-model:value="scriptTaskForm.script"
        allowClear
        @input="updateElementTask()"
        @change="updateElementTask()"
        size="small"
      />
    </a-form-item>
    <a-form-item label="资源地址" v-show="scriptTaskForm.scriptType === 'external'">
      <a-input
        v-model:value="scriptTaskForm.resource"
        allowClear
        @input="updateElementTask()"
        @change="updateElementTask()"
        size="small"
      />
    </a-form-item>
    <a-form-item label="结果变量">
      <a-input
        v-model:value="scriptTaskForm.resultVariable"
        allowClear
        @input="updateElementTask()"
        @change="updateElementTask()"
        size="small"
      />
    </a-form-item>
  </a-form>
</template>

<script setup>
  import { toRaw, ref, watch, onBeforeUnmount } from 'vue';
  const props = defineProps({
    id: String,
    type: String,
  });
  const scriptTaskForm = ref({});
  const defaultTaskForm = ref({
    scriptFormat: '',
    script: '',
    resource: '',
    resultVariable: '',
  });
  const bpmnElement = ref();
  const resetTaskForm = () => {
    for (let key in defaultTaskForm.value) {
      let value = bpmnElement.value?.businessObject[key] || defaultTaskForm.value[key];
      scriptTaskForm.value[key] = value;
    }
    scriptTaskForm.value['scriptType'] = scriptTaskForm.value.script ? 'inline' : 'external';
  };
  watch(
    () => props.id,
    () => {
      bpmnElement.value = window.bpmnInstances.bpmnElement;
      resetTaskForm();
    },
    {
      deep: true,
      immediate: true,
    },
  );
  const updateElementTask = () => {
    let taskAttr = Object.create(null);
    taskAttr.scriptFormat = scriptTaskForm.value.scriptFormat || null;
    taskAttr.resultVariable = scriptTaskForm.value.resultVariable || null;
    if (scriptTaskForm.value.scriptType === 'inline') {
      taskAttr.script = scriptTaskForm.value.script || null;
      taskAttr.resource = null;
    } else {
      taskAttr.resource = scriptTaskForm.value.resource || null;
      taskAttr.script = null;
    }
    window.bpmnInstances.modeling.updateProperties(toRaw(bpmnElement.value), taskAttr);
  };
  onBeforeUnmount(() => {
    bpmnElement.value = null;
  });
</script>
