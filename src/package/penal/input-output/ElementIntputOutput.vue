<template>
  <p class="listener-filed__title">
    <span>输入参数：</span>
    <a-button size="small" type="primary" @click="addParam(), (isInput = true)">添加参数</a-button>
  </p>
  <a-table :dataSource="inputList" :columns="inputCol" size="small" :scroll="{ x: 400 }" bordered>
    <template #bodyCell="{ column, record, index }">
      <template v-if="column.dataIndex === 'index'"> {{ index + 1 }}</template>

      <template v-if="column.dataIndex === 'type'">
        {{ paramTypeObject[record.paramType] }}</template
      >
      <template v-if="column.dataIndex === 'value' && record.paramType === 'string'">
        {{ record.string || record.value }}</template
      >
      <template v-if="column.dataIndex === 'value' && record.paramType === 'script'">
        {{ record.script }}</template
      >
      <template v-if="column.dataIndex === 'value' && record.paramType === 'list'">
        {{ record.list }}</template
      >
      <template v-if="column.dataIndex === 'value' && record.paramType === 'Map'">
        {{ record.value }}</template
      >
      <template v-if="column.dataIndex === 'opertion'">
        <a-button type="link " size="small" @click="editParam(record, index), (isInput = true)"
          >编辑</a-button
        >
        <a-divider type="vertical" />
        <a-popconfirm
          title="确认删除该参数吗？"
          @confirm="(isInput = true), delParam(record, index)"
        >
          <a href="#" style="color: #ff4d4f">移除</a>
        </a-popconfirm>
      </template>
    </template>
  </a-table>
  <a-divider />
  <p class="listener-filed__title">
    <span>输出参数：</span>
    <a-button size="small" type="primary" @click="(isInput = false), addParam()">添加参数</a-button>
  </p>
  <a-table :dataSource="outputList" :columns="outputCol" size="small" :scroll="{ x: 400 }" bordered>
    <template #bodyCell="{ column, record, index }">
      <template v-if="column.dataIndex === 'index'"> {{ index + 1 }}</template>

      <template v-if="column.dataIndex === 'type'">
        {{ paramTypeObject[record.paramType] }}</template
      >
      <template v-if="column.dataIndex === 'value' && record.paramType === 'string'">
        {{ record.string || record.value }}</template
      >
      <template v-if="column.dataIndex === 'value' && record.paramType === 'script'">
        {{ record.script }}</template
      >
      <template v-if="column.dataIndex === 'value' && record.paramType === 'list'">
        {{ record.list }}</template
      >
      <template v-if="column.dataIndex === 'value' && record.paramType === 'Map'">
        {{ record.value }}</template
      >
      <template v-if="column.dataIndex === 'opertion'">
        <a-button type="link " size="small" @click="editParam(record, index), (isInput = false)"
          >编辑</a-button
        >
        <a-divider type="vertical" />
        <a-popconfirm
          title="确认删除该参数吗？"
          @confirm="(isInput = false), delParam(record, index)"
        >
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
    <a-form :model="paramForm" size="small" :label-col="{ span: 4 }" ref="paramFormRef">
      <a-form-item
        label="参数名称："
        name="name"
        :rules="{ required: true, trigger: ['blur', 'change'] }"
      >
        <a-input v-model:value="paramForm.name" allowClear size="small" />
      </a-form-item>
      <a-form-item
        label="参数类型："
        name="paramType"
        :rules="{ required: true, trigger: ['blur', 'change'] }"
      >
        <a-select v-model:value="paramForm.paramType" size="small">
          <a-select-option v-for="i in Object.keys(paramTypeObject)" :key="i" :value="i">{{
            paramTypeObject[i]
          }}</a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item
        v-if="paramForm.paramType === 'string'"
        label="参数值："
        name="string"
        palceholder="以${}开始创建表达式"
        :rules="{ required: true, trigger: ['blur', 'change'] }"
      >
        <a-input
          v-model:value="paramForm.string"
          placeholder="以'${}'开始创建表达式"
          allowClear
          size="small"
        />
      </a-form-item>
      <template v-if="paramForm.paramType === 'script'">
        <a-form-item
          label="脚本格式"
          name="scriptFormat"
          :rules="{ required: true, trigger: ['blur', 'change'], message: '请填写脚本格式' }"
        >
          <a-input v-model:value="paramForm.scriptFormat" allowClear size="small" />
        </a-form-item>
        <a-form-item
          label="脚本类型"
          name="scriptType"
          :rules="{ required: true, trigger: ['blur', 'change'], message: '请选择脚本类型' }"
        >
          <a-select v-model:value="paramForm.scriptType" size="small">
            <a-select-option value="inlineScript">内联脚本</a-select-option>
            <a-select-option value="externalScript">外部脚本</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item
          v-if="paramForm.scriptType === 'inlineScript'"
          label="脚本内容"
          name="script"
          :rules="{ required: true, trigger: ['blur', 'change'], message: '请填写脚本内容' }"
        >
          <a-input v-model:value="paramForm.script" allowClear size="small" />
        </a-form-item>
        <a-form-item
          v-if="paramForm.scriptType === 'externalScript'"
          label="资源地址"
          name="script"
          :rules="{ required: true, trigger: ['blur', 'change'], message: '请填写资源地址' }"
        >
          <a-input v-model:value="paramForm.script" allowClear size="small" />
        </a-form-item>
      </template>
      <a-form-item
        v-if="paramForm.paramType === 'list'"
        label="参数值："
        name="list"
        :rules="{ required: true, trigger: ['blur', 'change'] }"
      >
        <a-input v-model:value="paramForm.list" allowClear size="small" />
      </a-form-item>
      <a-form-item
        v-if="paramForm.paramType === 'Map'"
        label="建值："
        name="key"
        :rules="{ required: true, trigger: ['blur', 'change'] }"
      >
        <a-input v-model:value="paramForm.key" allowClear size="small" />
      </a-form-item>
      <a-form-item
        v-if="paramForm.paramType === 'Map'"
        label="数值："
        name="value"
        :rules="{ required: true, trigger: ['blur', 'change'] }"
      >
        <a-input v-model:value="paramForm.value" allowClear size="small" />
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script setup>
  import { toRaw, ref, watch, inject } from 'vue';
  import { initList, paramType } from '../listeners/utilSelf';
  import { updateElementExtensions } from '../../utils.js';
  import { createIO, updateIO, changeType } from './index.js';
  //输入参数
  const inputList = ref([]);
  const inputCol = ref([
    {
      title: '序号',
      dataIndex: 'index',
      align: 'center',
    },
    {
      title: '参数名称',
      dataIndex: 'name',
      align: 'center',
    },
    {
      title: '参数类型',
      dataIndex: 'type',
      align: 'center',
    },
    {
      title: '值',
      dataIndex: 'value',
      align: 'center',
    },
    {
      title: '操作',
      dataIndex: 'opertion',
      align: 'center',
      width: 120,
    },
  ]);

  //输出参数
  const outputList = ref([]);
  const outputCol = ref([
    {
      title: '序号',
      dataIndex: 'index',
      align: 'center',
    },
    {
      title: '参数名称',
      dataIndex: 'name',
      align: 'center',
    },
    {
      title: '参数类型',
      dataIndex: 'type',
      align: 'center',
    },
    {
      title: '值',
      dataIndex: 'value',
      align: 'center',
    },
    {
      title: '操作',
      dataIndex: 'opertion',
      align: 'center',
      width: 120,
    },
  ]);

  const paramTypeObject = ref(paramType);

  const isInput = ref(false);
  const isAdd = ref(false);
  const showModal = ref(false);
  const paramForm = ref({});
  const addParam = () => {
    paramForm.value = {};
    showModal.value = true;
    isAdd.value = true;
  };

  const paramFormRef = ref();
  const editingIndex = ref(0);
  const inputOutput = ref([]);
  const otherExtensionList = ref([]);
  const saveParam = async () => {
    otherExtensionList.value =
      bpmnElement.value.businessObject?.extensionElements?.values?.filter(
        (ex) => ex.$type !== 'camunda:InputOutput',
      ) ?? [];
    const validateStatus = await paramFormRef.value.validateFields();
    if (validateStatus) {
      if (isAdd.value) {
        isInput.value
          ? inputList.value.push(paramForm.value)
          : outputList.value.push(paramForm.value);
        const IOObject = createIO(paramForm.value, isInput.value);
        updateElementExtensions(
          toRaw(bpmnElement.value),
          otherExtensionList.value.concat(IOObject),
        );
      } else {
        isInput.value
          ? inputList.value.splice(editingIndex.value, 1, paramForm.value)
          : outputList.value.splice(editingIndex.value, 1, paramForm.value);
        const IOObject = updateIO(editingIndex.value, isInput.value, isAdd.value, paramForm.value);
        updateElementExtensions(
          toRaw(bpmnElement.value),
          otherExtensionList.value.concat(IOObject),
        );
      }
      showModal.value = false;
    }
  };
  const editParam = (value, index) => {
    isAdd.value = false;
    showModal.value = true;
    editingIndex.value = index;
    paramForm.value = JSON.parse(JSON.stringify(changeType(value)));
  };
  const delParam = (record, index) => {
    isInput.value ? inputList.value.splice(index, 1) : outputList.value.splice(index, 1);
    updateElementExtensions(
      toRaw(bpmnElement.value),
      otherExtensionList.value.concat(updateIO(index, isInput.value, 'true')),
    );
  };

  const bpmnElement = ref();
  const resetConnectList = () => {
    inputList.value = [];
    outputList.value = [];
    bpmnElement.value = window.bpmnInstances.bpmnElement;
    otherExtensionList.value = [];
    inputOutput.value =
      bpmnElement.value.businessObject?.extensionElements?.values?.filter(
        (ex) => ex.$type === 'camunda:InputOutput',
      ) ?? [];
    if (inputOutput.value.length) {
      inputOutput.value[0].inputParameters
        ? (inputList.value = initList(
            JSON.parse(JSON.stringify(inputOutput.value[0].inputParameters)),
          ))
        : '';
      inputOutput.value[0].outputParameters
        ? (outputList.value = initList(
            JSON.parse(JSON.stringify(inputOutput.value[0].outputParameters)),
          ))
        : '';
    }
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
