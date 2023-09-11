<template>
  <a-form style="margin-top: 16px" :label-col="{ span: 6 }">
    <a-form-item label="消息实例">
      <div
        style="
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: nowrap;
        "
      >
        <a-select v-model:value="bindMessageId" @change="updateTaskMessage" size="small">
          <a-select-option v-for="id in Object.keys(messageMap)" :key="id" :value="id">{{
            messageMap[id]
          }}</a-select-option>
          <!-- <a-select-option v-for="id in Object.keys(messageMap)" :value="id" :label="messageMap[id]" :key="id" /> -->
        </a-select>
        <a-button size="small" type="primary" style="margin-left: 8px" @click="openMessageModel"
          >新增</a-button
        >
      </div>
    </a-form-item>
    <a-modal
      v-model:visible="messageModelVisible"
      :maskClosable="false"
      title="创建新消息"
      width="400px"
      @ok="createNewMessage"
    >
      <a-form :model="newMessageForm" size="small" :label-col="{ span: 6 }">
        <a-form-item label="消息ID">
          <a-input v-model:value="newMessageForm.id" allowClear size="small" />
        </a-form-item>
        <a-form-item label="消息名称">
          <a-input v-model:value="newMessageForm.name" allowClear size="small" />
        </a-form-item>
      </a-form>
    </a-modal>
  </a-form>
</template>

<script setup>
  import { toRaw, ref, watch, onBeforeUnmount } from 'vue';
  import { message } from 'ant-design-vue';
  const props = defineProps({
    id: String,
    type: String,
  });
  const bpmnElement = ref();
  const bindMessageId = ref('');
  const messageMap = ref({});
  const bpmnMessageRefsMap = ref([]);
  const bpmnRootElements = ref([]);

  watch(
    () => props.id,
    () => {
      bpmnElement.value = window.bpmnInstances.bpmnElement;
      bindMessageId.value = bpmnElement.value.businessObject?.messageRef?.id || '-1';
    },
    {
      deep: true,
      immediate: true,
    },
  );
  const getBpmn = () => {
    bpmnMessageRefsMap.value = Object.create(null);
    bpmnRootElements.value = window.bpmnInstances.modeler.getDefinitions().rootElements;
    bpmnRootElements.value
      .filter((el) => el.$type === 'bpmn:Message')
      .forEach((m) => {
        bpmnMessageRefsMap.value[m.id] = m;
        messageMap.value[m.id] = m.name;
      });
    messageMap.value['-1'] = '无';
  };
  getBpmn();
  onBeforeUnmount(() => {
    bpmnElement.value = null;
  });
  const messageModelVisible = ref(false);
  const newMessageForm = ref({});
  const openMessageModel = () => {
    messageModelVisible.value = true;
    newMessageForm.value = {};
  };
  const createNewMessage = () => {
    if (messageMap.value[newMessageForm.value.id]) {
      message.warning('该消息已存在，请修改id后重新保存');
      return;
    }
    const newMessage = window.bpmnInstances.moddle.create('bpmn:Message', newMessageForm.value);
    bpmnRootElements.value.push(newMessage);
    messageMap.value[newMessageForm.value.id] = newMessageForm.value.name;
    bpmnMessageRefsMap.value[newMessageForm.value.id] = newMessage;

    messageModelVisible.value = false;
  };
  const updateTaskMessage = (messageId) => {
    if (messageId === '-1') {
      window.bpmnInstances.modeling.updateProperties(toRaw(bpmnElement.value), {
        messageRef: null,
      });
    } else {
      window.bpmnInstances.modeling.updateProperties(toRaw(bpmnElement.value), {
        messageRef: toRaw(bpmnMessageRefsMap.value[messageId]),
      });
    }
  };
</script>
