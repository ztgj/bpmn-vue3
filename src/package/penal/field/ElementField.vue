<template>
  <p class="listener-filed__title">
    <span>注入字段：</span>
    <a-button size="small" type="primary" @click="openData(null)">添加字段</a-button>
  </p>
  <a-table
    :dataSource="fieldsListOfListener"
    :columns="fieldCol"
    size="small"
    :scroll="{ x: 500 }"
    bordered
  >
    <template #bodyCell="{ column, record, index }">
      <template v-if="column.dataIndex === 'index'"> {{ index + 1 }}</template>
      <template v-if="column.dataIndex === 'fieldType'">
        {{ fieldTypeObject[record.fieldType] }}</template
      >
      <template v-if="column.dataIndex === 'expression' && record.fieldType === 'expression'">
        {{ record.expression }}</template
      >
      <template v-if="column.dataIndex === 'expression' && record.fieldType === 'string'">
        {{ record.string }}</template
      >
      <template v-if="column.dataIndex === 'opertion'">
        <a-button type="link " size="small" @click="openData(record, index)">编辑</a-button>
        <a-divider type="vertical" />
        <a-popconfirm title="确认移除该字段吗？" @confirm="confirmField(index)">
          <a href="#" style="color: #ff4d4f">移除</a>
        </a-popconfirm>
      </template>
    </template>
  </a-table>
  <a-modal title="字段配置" v-model:visible="visible" width="600px">
    <a-form
      :model="listenerFieldForm"
      size="small"
      :label-col="{ span: 4 }"
      ref="listenerFieldFormRef"
      style="height: 136px"
    >
      <a-form-item
        label="字段名称："
        name="name"
        :rules="{ required: true, trigger: ['blur', 'change'] }"
      >
        <a-input v-model:value="listenerFieldForm.name" allowClear size="small" />
      </a-form-item>
      <a-form-item
        label="字段类型："
        name="fieldType"
        :rules="{ required: true, trigger: ['blur', 'change'] }"
      >
        <a-select v-model:value="listenerFieldForm.fieldType" size="small">
          <a-select-option v-for="i in Object.keys(fieldTypeObject)" :key="i" :value="i">{{
            fieldTypeObject[i]
          }}</a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item
        v-if="listenerFieldForm.fieldType === 'string'"
        label="字段值："
        name="string"
        :rules="{ required: true, trigger: ['blur', 'change'] }"
      >
        <a-input v-model:value="listenerFieldForm.string" allowClear size="small" />
      </a-form-item>
      <a-form-item
        v-if="listenerFieldForm.fieldType === 'expression'"
        label="表达式："
        name="expression"
        :rules="{ required: true, trigger: ['blur', 'change'] }"
      >
        <a-input v-model:value="listenerFieldForm.expression" allowClear size="small" />
      </a-form-item>
    </a-form>
    <template v-slot:footer>
      <a-button size="small" @click="listenerFieldFormModelVisible = false">取 消</a-button>
      <a-button size="small" type="primary" @click="saveListenerFiled">确 定</a-button>
    </template>
  </a-modal>
</template>

<script setup>
  import { toRaw, ref, watch } from 'vue';
  import { fieldType } from '../listeners/utilSelf';
  import { updateElementExtensions } from '../../utils.js';
  import { createFiled, updateFiled } from './index.js';
  import { initField } from '../listeners/utilSelf';
  const listenerFieldForm = ref({});
  const fieldTypeObject = ref(fieldType);
  const fieldCol = ref([
    {
      title: '序号',
      dataIndex: 'index',
      align: 'center',
    },
    {
      title: '字段名称',
      dataIndex: 'name',
      align: 'center',
    },
    {
      title: '字段类型',
      dataIndex: 'fieldType',
      align: 'center',
    },
    {
      title: '字段值/表达式',
      dataIndex: 'expression',
      align: 'center',
    },
    {
      title: '操作',
      dataIndex: 'opertion',
      align: 'center',
    },
  ]);
  const fieldsListOfListener = ref([]);
  const visible = ref(false);
  const openData = (field, index) => {
    visible.value = true;
    listenerFieldForm.value = field ? JSON.parse(JSON.stringify(field)) : {};
    editingListenerFieldIndex.value = field ? index : -1;
  };

  const editingListenerFieldIndex = ref(-1); // 监听器所在下标，-1 为新增
  const listenerFieldFormRef = ref();
  const otherExtensionList = ref([]);
  // 保存注入字段
  const saveListenerFiled = async () => {
    otherExtensionList.value =
      bpmnElement.value.businessObject?.extensionElements?.values?.filter(
        (ex) => ex.$type !== 'camunda:Field',
      ) ?? [];
    const validateStatus = await listenerFieldFormRef.value.validateFields();
    if (validateStatus) {
      if (editingListenerFieldIndex.value === -1) {
        fieldsListOfListener.value.push(listenerFieldForm.value);
        const extObject = createFiled(listenerFieldForm.value);
        updateElementExtensions(
          toRaw(bpmnElement.value),
          otherExtensionList.value.concat(extObject),
        );
      } else {
        fieldsListOfListener.value.splice(
          editingListenerFieldIndex.value,
          1,
          listenerFieldForm.value,
        );
        const extObject = updateFiled(editingListenerFieldIndex.value, listenerFieldForm.value);
        updateElementExtensions(
          toRaw(bpmnElement.value),
          otherExtensionList.value.concat(extObject),
        );
      }
      visible.value = false;
      listenerFieldForm.value = {};
    }
  };
  const confirmField = (index) => {
    fieldsListOfListener.value.splice(index, 1);
    updateElementExtensions(
      toRaw(bpmnElement.value),
      otherExtensionList.value.concat(updateFiled(index, true, 'true')),
    );
  };
  const props = defineProps({
    id: String,
  });
  const bpmnElement = ref();
  const fielfList = ref([]);
  const resetListenersList = () => {
    bpmnElement.value = window.bpmnInstances.bpmnElement;
    fieldsListOfListener.value = [];
    fielfList.value =
      bpmnElement.value.businessObject?.extensionElements?.values?.filter(
        (ex) => ex.$type === 'camunda:Field',
      ) ?? [];
    if (fielfList.value.length) {
      fieldsListOfListener.value = initField(JSON.parse(JSON.stringify(fielfList.value)));
    }
  };
  watch(
    () => props.id,
    () => {
      console.log('字段注入');
      resetListenersList();
    },
    {
      deep: true,
      immediate: true,
    },
  );
</script>
