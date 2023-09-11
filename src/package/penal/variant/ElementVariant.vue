<template>
  <p class="listener-filed__title">
    <span>输入变量：</span>
    <a-button size="small" type="primary" @click="addParam(), (isInput = true)">添加变量</a-button>
  </p>
  <a-table :dataSource="inputList" :columns="inputCol" size="small" max-height="240" bordered>
    <template #bodyCell="{ column, record, index }">
      <template v-if="column.dataIndex === 'index'"> {{ index + 1 }}</template>
      <template v-if="column.dataIndex === 'value' && record.variantType === 'source'">
        {{ record.source || record.value }}</template
      >
      <template v-if="column.dataIndex === 'value' && record.variantType === 'SourceExpression'">
        {{ record.sourceExpression || record.value }}</template
      >
      <template v-if="column.dataIndex === 'opertion'">
        <a-button type="link " size="small" @click="editParam(record, index)">编辑</a-button>
        <a-divider type="vertical" />
        <a-popconfirm title="确认删除该变量吗？" @confirm="(isInput = true), delParam(index)">
          <a href="#" style="color: #ff4d4f">移除</a>
        </a-popconfirm>
      </template>
    </template>
  </a-table>
  <a-divider />
  <p class="listener-filed__title">
    <span>输出变量：</span>
    <a-button size="small" type="primary" @click="(isInput = false), addParam()">添加变量</a-button>
  </p>
  <a-table :dataSource="outputList" :columns="outputCol" size="small" bordered>
    <template #bodyCell="{ column, record, index }">
      <template v-if="column.dataIndex === 'index'"> {{ index + 1 }}</template>
      <template v-if="column.dataIndex === 'value' && record.variantType === 'source'">
        {{ record.source || record.value }}</template
      >
      <template v-if="column.dataIndex === 'value' && record.variantType === 'SourceExpression'">
        {{ record.sourceExpression || record.value }}</template
      >
      <template v-if="column.dataIndex === 'target' && record.variantType === 'all'">
        {{ '' }}</template
      >
      <template v-if="column.dataIndex === 'opertion'">
        <a-button type="link " size="small" @click="editParam(record, index)">编辑</a-button>
        <a-divider type="vertical" />
        <a-popconfirm title="确认删除该变量吗？" @confirm="(isInput = false), delParam(index)">
          <a href="#" style="color: #ff4d4f">移除</a>
        </a-popconfirm>
      </template>
    </template></a-table
  >

  <a-modal
    :title="isInput ? '输入参数配置' : '输出参数配置'"
    v-model:visible="showModal"
    width="600px"
    @ok="saveParam"
  >
    <a-form :model="variantForm" size="small" :label-col="{ span: 6 }" ref="variantFormRef">
      <a-form-item
        label="参数类型："
        name="variantType"
        :rules="{ required: true, trigger: ['blur', 'change'] }"
      >
        <a-select v-model:value="variantForm.variantType" size="small">
          <a-select-option v-for="i in Object.keys(variantTypeObject)" :key="i" :value="i">{{
            variantTypeObject[i]
          }}</a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item
        v-if="variantForm.variantType === 'source'"
        label="Source："
        name="source"
        :rules="{ required: true, trigger: ['blur', 'change'] }"
      >
        <a-input v-model:value="variantForm.source" allowClear size="small" />
      </a-form-item>
      <a-form-item
        v-if="variantForm.variantType === 'SourceExpression'"
        label="SourceExpression"
        name="sourceExpression"
        :rules="{ required: true, trigger: ['blur', 'change'] }"
      >
        <a-input v-model:value="variantForm.sourceExpression" allowClear size="small" />
      </a-form-item>
      <a-form-item
        v-if="variantForm.variantType !== 'all' && variantForm.variantType"
        label="Target"
        name="target"
        :rules="{ required: true, trigger: ['blur', 'change'] }"
      >
        <a-input v-model:value="variantForm.target" allowClear size="small" />
      </a-form-item>
      <a-form-item label="Local">
        <a-switch v-model:checked="variantForm.local" />
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script setup>
  import { toRaw, ref, watch, inject } from 'vue';
  import { variantType } from '../listeners/utilSelf';

  const inputList = ref([]);
  const inputCol = ref([
    {
      title: '序号',
      dataIndex: 'index',
      align: 'center',
    },
    {
      title: '变量类型',
      dataIndex: 'variantType',
      align: 'center',
    },

    {
      title: '值',
      dataIndex: 'value',
      align: 'center',
    },
    {
      title: 'target',
      dataIndex: 'target',
      align: 'center',
    },
    {
      title: '操作',
      dataIndex: 'opertion',
      align: 'center',
    },
  ]);
  //输出变量
  const outputList = ref([]);
  const outputCol = ref([
    {
      title: '序号',
      dataIndex: 'index',
      align: 'center',
    },
    {
      title: '变量类型',
      dataIndex: 'variantType',
      align: 'center',
    },

    {
      title: '值',
      dataIndex: 'value',
      align: 'center',
    },
    {
      title: 'target',
      dataIndex: 'target',
      align: 'center',
    },
    {
      title: '操作',
      dataIndex: 'opertion',
      align: 'center',
    },
  ]);

  const isInput = ref(false);
  const showModal = ref(false);
  const variantForm = ref({});
  const variantTypeObject = ref(variantType);
  const isAdd = ref(false);

  const addParam = () => {
    variantForm.value = {};
    showModal.value = true;
    isAdd.value = true;
  };
  const editParam = (value, index) => {
    isAdd.value = false;
    showModal.value = true;
    editingIndex.value = index;
    variantForm.value = JSON.parse(JSON.stringify(value));
    console.log(value);
  };
  const delParam = (index) => {
    isInput.value ? inputList.value.splice(index, 1) : outputList.value.splice(index, 1);
  };
  const variantFormRef = ref();
  const editingIndex = ref(0);
  const saveParam = async () => {
    const validateStatus = await variantFormRef.value.validateFields();
    if (validateStatus) {
      if (isAdd.value) {
        isInput.value
          ? inputList.value.push(variantForm.value)
          : outputList.value.push(variantForm.value);
      } else {
        isInput.value
          ? inputList.value.splice(editingIndex.value, 1, variantForm.value)
          : outputList.value.splice(editingIndex.value, 1, variantForm.value);
      }
      showModal.value = false;
      console.log(inputList.value);
      const extensionElements = window.bpmnInstances.moddle.create('bpmn:ExtensionElements', {
        values: [],
      });
      if (inputList.value) {
        inputList.value.forEach((item) => {
          if (item.variantType === 'source') {
            extensionElements.values.push(
              window.bpmnInstances.moddle.create('camunda:In', {
                local: item.local ? item.local : '',
                source: item.source,
                target: item.target,
              }),
            );
          } else if (item.variantType === 'SourceExpression') {
            extensionElements.values.push(
              window.bpmnInstances.moddle.create('camunda:In', {
                local: item.local ? item.local : '',
                sourceExpression: item.sourceExpression,
                target: item.target,
              }),
            );
          } else if (item.variantType === 'all') {
            extensionElements.values.push(
              window.bpmnInstances.moddle.create('camunda:In', {
                local: item.local ? item.local : '',
                variables: 'all',
              }),
            );
          }
        });
      }
      if (outputList.value) {
        outputList.value.forEach((item) => {
          if (item.variantType === 'source') {
            extensionElements.values.push(
              window.bpmnInstances.moddle.create('camunda:Out', {
                local: item.local ? item.local : '',
                source: item.source,
                target: item.target,
              }),
            );
          } else if (item.variantType === 'SourceExpression') {
            extensionElements.values.push(
              window.bpmnInstances.moddle.create('camunda:Out', {
                local: item.local ? item.local : '',
                sourceExpression: item.sourceExpression,
                target: item.target,
              }),
            );
          } else if (item.variantType === 'all') {
            extensionElements.values.push(
              window.bpmnInstances.moddle.create('camunda:Out', {
                local: item.local ? item.local : '',
                variables: 'all',
              }),
            );
          }
        });
      }
      window.bpmnInstances.modeling.updateModdleProperties(
        toRaw(bpmnElement.value),
        window.bpmnInstances.bpmnElement.businessObject,
        {
          extensionElements,
        },
      );
    }
  };
  const bpmnElement = ref();
  const resetConnectList = () => {
    bpmnElement.value = window.bpmnInstances.bpmnElement;
    inputList.value = [];
    bpmnElement.value.businessObject.extensionElements
      ? bpmnElement.value.businessObject.extensionElements.values.forEach((item) => {
          if (item.$type === 'camunda:In') {
            item.variantType = item.source
              ? (item.variantType = 'source')
              : item.sourceExpression
              ? (item.variantType = 'SourceExpression')
              : (item.variantType = 'all');
            inputList.value.push(item);
          }
        })
      : '';
    outputList.value = [];
    bpmnElement.value.businessObject.extensionElements
      ? bpmnElement.value.businessObject.extensionElements.values.forEach((item) => {
          if (item.$type === 'camunda:Out') {
            item.variantType = item.source
              ? (item.variantType = 'source')
              : item.sourceExpression
              ? (item.variantType = 'SourceExpression')
              : (item.variantType = 'all');
            outputList.value.push(item);
          }
        })
      : '';
  };
  const elementId = inject('id');
  watch(
    () => elementId,
    () => {
      console.log('输入输出');
      resetConnectList();
    },
    {
      deep: true,
      immediate: true,
    },
  );
</script>
