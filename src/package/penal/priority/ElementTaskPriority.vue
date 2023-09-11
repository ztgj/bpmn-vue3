<template>
  <div class="panel-tab__content">
    <a-form :label-col="{ span: 6 }">
      <a-form-item label="工作优先级">
        <a-input v-model:value="taskPriority" allowClear size="small" @change="changeTaskAsync" />
      </a-form-item>
    </a-form>
  </div>
</template>

<script setup>
  import { ref, watch, onBeforeUnmount, toRaw } from 'vue';

  const props = defineProps({
    id: String,
  });
  const bpmnElement = ref();
  const taskPriority = ref('');
  watch(
    () => props.id,
    () => {
      bpmnElement.value = window.bpmnInstances.bpmnElement;
      taskPriority.value = bpmnElement.value?.businessObject?.taskPriority;
    },
    {
      deep: true,
      immediate: true,
    },
  );
  const changeTaskAsync = () => {
    window.bpmnInstances.modeling.updateProperties(toRaw(bpmnElement.value), {
      taskPriority: taskPriority.value,
    });
  };
  onBeforeUnmount(() => {
    bpmnElement.value = null;
  });
</script>
