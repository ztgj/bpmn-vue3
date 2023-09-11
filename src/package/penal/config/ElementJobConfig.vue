<template>
  <div class="panel-tab__content">
    <a-form :label-col="{ span: 7 }">
      <a-form-item label="异步延续">
        <a-space :size="4">
          <a-checkbox v-model:checked="taskConfigForm.asyncBefore" @change="changeTaskAsync"
            >异步前</a-checkbox
          >
          <a-checkbox v-model:checked="taskConfigForm.asyncAfter" @change="changeTaskAsync"
            >异步后</a-checkbox
          >
          <a-checkbox
            v-model:checked="taskConfigForm.exclusive"
            @change="changeExclusive"
            v-if="taskConfigForm.asyncBefore || taskConfigForm.asyncAfter"
            >排除</a-checkbox
          ></a-space
        >
      </a-form-item>
      <a-form-item
        label="工作优先级"
        v-if="taskConfigForm.asyncAfter || taskConfigForm.asyncBefore"
      >
        <a-input
          v-model:value="taskConfigForm.jobPriority"
          allowClear
          size="small"
          @change="changeTaskAsync"
        />
      </a-form-item>
      <a-form-item
        label="重试时间周期"
        v-if="taskConfigForm.asyncAfter || taskConfigForm.asyncBefore"
      >
        <a-input v-model:value="timeCycle" @change="updateLoopTimeCycle" allowClear size="small" />
      </a-form-item>
    </a-form>
  </div>
</template>

<script setup>
  import { ref, watch, reactive, toRaw, onBeforeUnmount } from 'vue';
  import { updateElementExtensions } from '../../utils.js';

  const props = defineProps({
    id: String,
  });
  const bpmnElement = ref();
  const taskConfigForm = reactive({
    asyncAfter: false,
    asyncBefore: false,
    exclusive: false,
    jobPriority: '',
  });
  const timeCycle = ref('');
  const otherExtensionList = ref([]);
  watch(
    () => props.id,
    () => {
      bpmnElement.value = window.bpmnInstances.bpmnElement;
      otherExtensionList.value = [];
      taskConfigForm.asyncBefore = bpmnElement.value?.businessObject?.asyncBefore;
      taskConfigForm.asyncAfter = bpmnElement.value?.businessObject?.asyncAfter;
      taskConfigForm.exclusive = bpmnElement.value?.businessObject?.exclusive;
      taskConfigForm.jobPriority = bpmnElement.value?.businessObject?.jobPriority;
      const time =
        bpmnElement.value.businessObject?.extensionElements?.values?.filter(
          (ex) => ex.$type === 'camunda:FailedJobRetryTimeCycle',
        ) ?? [];
      console.log(time);
      time.length === 0 ? (timeCycle.value = '') : (timeCycle.value = time[0].body);
    },
    {
      deep: true,
      immediate: true,
    },
  );

  const changeTaskAsync = () => {
    if (!taskConfigForm.asyncBefore && !taskConfigForm.asyncAfter) {
      taskConfigForm.exclusive = false;
    }
    if (taskConfigForm.asyncBefore || taskConfigForm.asyncAfter) {
      taskConfigForm.exclusive = true;
    }
    window.bpmnInstances.modeling.updateProperties(window.bpmnInstances.bpmnElement, {
      ...taskConfigForm,
    });
  };
  const changeExclusive = () => {
    window.bpmnInstances.modeling.updateProperties(window.bpmnInstances.bpmnElement, {
      ...taskConfigForm,
    });
  };
  // 重试周期
  const updateLoopTimeCycle = (e) => {
    otherExtensionList.value =
      bpmnElement.value.businessObject?.extensionElements?.values?.filter(
        (ex) => ex.$type !== 'camunda:FailedJobRetryTimeCycle',
      ) ?? [];
    let extensionElements =
      window.bpmnInstances.bpmnElement.businessObject?.extensionElements?.values?.filter(
        (ex) => ex.$type === 'camunda:FailedJobRetryTimeCycle',
      )[0] ?? [];
    if (extensionElements.length === 0) {
      extensionElements.push(
        window.bpmnInstances.moddle.create('camunda:FailedJobRetryTimeCycle', {
          body: e.target.value,
        }),
      );
    } else {
      extensionElements =
        window.bpmnInstances.bpmnElement.businessObject?.extensionElements?.values?.filter(
          (ex) => ex.$type === 'camunda:FailedJobRetryTimeCycle',
        )[0];
      extensionElements.body = e.target.value;
    }
    updateElementExtensions(
      toRaw(bpmnElement.value),
      otherExtensionList.value.concat(extensionElements),
    );
  };
  onBeforeUnmount(() => {
    bpmnElement.value = null;
  });
</script>
