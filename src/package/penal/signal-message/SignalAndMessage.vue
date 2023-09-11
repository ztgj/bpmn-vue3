<template>
  <div class="panel-tab__content">
    <div class="panel-tab__content--title">
      <span><appstore-outlined />消息列表</span>
      <a-button size="small" type="primary" @click="openModel('message')">创建新消息</a-button>
    </div>
    <a-table :columns="messageCol" :dataSource="messageList" size="small" bordered>
      <template #bodyCell="{ column, index }">
        <template v-if="column.dataIndex === 'index'"> {{ index + 1 }}</template>
      </template>
    </a-table>
    <div
      class="panel-tab__content--title"
      style="padding-top: 8px; margin-top: 8px; border-top: 1px solid #eeeeee"
    >
      <span><appstore-outlined />信号列表</span>
      <a-button size="small" type="primary" @click="openModel('signal')">创建新信号</a-button>
    </div>

    <a-table :columns="signalCol" :data-source="signalList" size="small">
      <template #bodyCell="{ column, index }">
        <template v-if="column.dataIndex === 'index'"> {{ index + 1 }}</template>
      </template>
    </a-table>
    <a-modal v-model:visible="modelVisible" :title="modelConfig.title" width="400px">
      <a-form
        :model="modelObjectForm"
        size="small"
        label-width="90px"
        @submit.prevent
        :labelCol="{
          span: 4,
        }"
      >
        <a-form-item :label="modelConfig.idLabel">
          <a-input v-model:value="modelObjectForm.id" allowClear size="small" />
        </a-form-item>
        <a-form-item :label="modelConfig.nameLabel">
          <a-input v-model:value="modelObjectForm.name" allowClear size="small" />
        </a-form-item>
      </a-form>
      <template v-slot:footer>
        <a-button size="small" @click="modelVisible = false">取 消</a-button>
        <a-button size="small" type="primary" @click="addNewObject">保 存</a-button>
      </template>
    </a-modal>
  </div>
</template>
<script setup>
  import { computed, onMounted, ref } from 'vue';
  import { message } from 'ant-design-vue';

  const signalList = ref([]);

  const messageCol = ref([
    {
      title: '序号',
      dataIndex: 'index',
      align: 'center',
    },
    {
      title: '消息ID',
      dataIndex: 'id',
      align: 'center',
    },
    {
      title: '消息名称',
      dataIndex: 'name',
      align: 'center',
    },
  ]);
  const signalCol = ref([
    {
      title: '序号',
      dataIndex: 'index',
      align: 'center',
    },
    {
      title: '消息ID',
      dataIndex: 'id',
      align: 'center',
    },
    {
      title: '消息名称',
      dataIndex: 'name',
      align: 'center',
    },
  ]);
  const messageList = ref([]);
  const modelType = ref();
  const modelConfig = computed(() => {
    if (modelType.value === 'message') {
      return { title: '创建消息', idLabel: '消息ID', nameLabel: '消息名称' };
    } else {
      return { title: '创建信号', idLabel: '信号ID', nameLabel: '信号名称' };
    }
  });

  const modelVisible = ref(false);
  const modelObjectForm = ref({});
  const openModel = (type) => {
    modelType.value = type;
    modelObjectForm.value = {};
    modelVisible.value = true;
  };

  const addNewObject = () => {
    if (modelType.value === 'message') {
      if (messageIdMap[modelObjectForm.value.id]) {
        return message.error('该消息已存在，请修改id后重新保存');
      }
      const messageRef = window.bpmnInstances.moddle.create('bpmn:Message', modelObjectForm.value);
      rootElements.value.push(messageRef);
    } else {
      if (signalIdMap[modelObjectForm.value.id]) {
        return message.error('该信号已存在，请修改id后重新保存');
      }
      const signalRef = window.bpmnInstances.moddle.create('bpmn:Signal', modelObjectForm.value);
      rootElements.value.push(signalRef);
    }
    modelVisible.value = false;
    initDataList();
  };
  const rootElements = ref();
  const messageIdMap = ref({});
  const signalIdMap = ref({});
  const initDataList = () => {
    messageList.value = [];
    signalList.value = [];
    rootElements.value = window.bpmnInstances.modeler.getDefinitions().rootElements;
    rootElements.value.forEach((el) => {
      if (el.$type === 'bpmn:Message') {
        messageIdMap[el.id] = true;
        messageList.value.push({ ...el });
      }
      if (el.$type === 'bpmn:Signal') {
        signalIdMap[el.id] = true;
        signalList.value.push({ ...el });
      }
    });
  };

  onMounted(() => {
    initDataList();
  });
</script>
