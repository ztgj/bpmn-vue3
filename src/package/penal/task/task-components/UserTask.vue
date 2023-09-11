<template>
  <a-form style="margin-top: 16px" :label-col="{ span: 6 }">
    <a-form-item label="处理用户">
      <a-input
        v-model:value="userTaskForm.assignee"
        allowClear
        @change="updateElementTask('assignee')"
        size="small"
      />
      <!-- <a-select v-model:value="userTaskForm.assignee" show-search @change="updateElementTask('assignee')" size="small">
        <a-select-option v-for="item in assigneeList" :key="item.value"
      :value="item.value">{{item.label}}</a-select-option>
      </a-select> -->
    </a-form-item>
    <a-form-item label="候选用户">
      <a-input
        v-model:value="userTaskForm.candidateUsers"
        allowClear
        placeholder="如果有多个用户用,分隔开"
        @change="updateElementTask('candidateUsers')"
        size="small"
      />
      <!-- <a-select v-model:value="userTaskForm.candidateUsers" show-search mode="multiple" :options="assigneeList"  @change="updateElementTask('candidateUsers')" size="small">
      </a-select> -->
    </a-form-item>
    <a-form-item label="候选分组">
      <a-input
        v-model:value="userTaskForm.candidateGroups"
        allowClear
        placeholder="如果有多个分组用,分隔开"
        @change="updateElementTask('candidateGroups')"
        size="small"
      />
      <!-- <a-select v-model:value="userTaskForm.candidateGroups" show-search mode="multiple" :options="groupList" @change="updateElementTask('candidateGroups')" size="small"> -->
      <!-- </a-select> -->
    </a-form-item>
    <a-form-item label="到期时间">
      <a-input
        v-model:value="userTaskForm.dueDate"
        allowClear
        @change="updateElementTask('dueDate')"
        size="small"
      />
    </a-form-item>
    <a-form-item label="跟踪时间">
      <a-input
        v-model:value="userTaskForm.followUpDate"
        allowClear
        @change="updateElementTask('followUpDate')"
        size="small"
      />
    </a-form-item>
    <a-form-item label="优先级">
      <a-input
        v-model:value="userTaskForm.priority"
        allowClear
        @change="updateElementTask('priority')"
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
  const userTaskForm = ref({});
  const defaultTaskForm = ref({
    assignee: '',
    candidateUsers: '',
    candidateGroups: '',
    dueDate: '',
    followUpDate: '',
    priority: '',
  });
  const bpmnElement = ref();

  const resetTaskForm = () => {
    for (let key in defaultTaskForm.value) {
      let value;
      // if (key === "candidateUsers" || key === "candidateGroups") {
      //   value = bpmnElement.value?.businessObject[key] ? bpmnElement.value.businessObject[key].split(",") : [];
      // } else {
      //   value = bpmnElement.value?.businessObject[key] || defaultTaskForm.value[key];
      // }
      userTaskForm.value[key] = value;
    }
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
  const updateElementTask = (key) => {
    const taskAttr = Object.create(null);
    taskAttr[key] = userTaskForm.value[key] || null;
    // if (key === "candidateUsers" || key === "candidateGroups") {
    //   taskAttr[key] = userTaskForm.value[key] && userTaskForm.value[key].length ? userTaskForm.value[key].join() : null;
    // } else {
    //   taskAttr[key] = userTaskForm.value[key] || null;
    // }
    window.bpmnInstances.modeling.updateProperties(toRaw(bpmnElement.value), taskAttr);
  };
  onBeforeUnmount(() => {
    bpmnElement.value = null;
  });
</script>
