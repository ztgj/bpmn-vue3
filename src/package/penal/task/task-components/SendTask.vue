<template>
  <a-form size="small" :model="listenerForm" :label-col="{ span: 8 }" ref="listenerFormRef">
    <a-form-item label="监听器类型" name="detailType">
      <a-select v-model:value="listenerForm.detailType" size="small" @change="changeEle" allowClear>
        <a-select-option
          v-for="i in Object.keys(listenerTypeObject)"
          :key="i"
          :label="listenerTypeObject[i]"
          >{{ listenerTypeObject[i] }}</a-select-option
        >
      </a-select>
    </a-form-item>
    <a-form-item
      v-if="listenerForm.detailType === 'class'"
      label="Java类"
      name="class"
      key="listener-class"
      :rules="{ required: true, trigger: ['blur', 'change'] }"
    >
      <a-input
        v-model:value="listenerForm.class"
        allowClear
        size="small"
        @change="changeListenType"
      />
    </a-form-item>
    <a-form-item
      v-if="listenerForm.detailType === 'expression'"
      label="表达式"
      name="expression"
      :rules="{ required: true, trigger: ['blur', 'change'] }"
    >
      <a-input
        v-model:value="listenerForm.expression"
        allowClear
        size="small"
        @change="changeListenType"
      />
    </a-form-item>
    <a-form-item
      v-if="listenerForm.detailType === 'expression'"
      label="结果变量"
      name="resultVariable"
      :rules="{ required: true, trigger: ['blur', 'change'] }"
    >
      <a-input
        v-model:value="listenerForm.resultVariable"
        allowClear
        size="small"
        @change="changeListenType"
      />
    </a-form-item>
    <a-form-item
      v-if="listenerForm.detailType === 'delegateExpression'"
      label="代理表达式"
      name="delegateExpression"
      :rules="{ required: true, trigger: ['blur', 'change'] }"
    >
      <a-input
        v-model:value="listenerForm.delegateExpression"
        allowClear
        size="small"
        @change="changeListenType"
      />
    </a-form-item>
    <a-form-item
      v-if="listenerForm.detailType === 'type'"
      label="外部"
      name="topic"
      :rules="{ required: true, trigger: ['blur', 'change'] }"
    >
      <a-input
        v-model:value="listenerForm.topic"
        allowClear
        size="small"
        @change="changeListenType"
      />
    </a-form-item>
    <a-form-item v-if="listenerForm.detailType === 'type'" label="工作优先级">
      <a-input v-model:value="taskPriority" allowClear size="small" @change="changeTaskAsync" />
    </a-form-item>
  </a-form>

  <div class="element-drawer__button" v-if="listenerForm.detailType === 'connectorListener'">
    <div style="color: red; text-align: center" v-if="!connectForm.connectorId"
      ><warning-outlined />必须配置连接器</div
    >
    <a-button
      size="small"
      type="primary"
      style="top: 4px; width: 100%"
      @click="openConnectForm(null)"
      >添加连接器</a-button
    >
  </div>

  <a-drawer v-model:visible="visible" title="配置连接器" width="500">
    <a-form size="small" :model="connectForm" :label-col="{ span: 6 }" ref="connectFormRef">
      <a-form-item
        v-if="listenerForm.detailType === 'connectorListener'"
        label="连接器编号"
        name="connectorId"
        :rules="{ required: true, trigger: ['blur', 'change'] }"
      >
        <a-input v-model:value="connectForm.connectorId" allowClear size="small" />
      </a-form-item>
    </a-form>
    <div v-if="listenerForm.detailType === 'connectorListener'">
      <a-divider />
      <p class="listener-filed__title">
        <span>输入参数：</span>
        <a-button size="small" type="primary" @click="addParam(), (isInput = true)"
          >添加参数</a-button
        >
      </p>
      <a-table
        :dataSource="inputList"
        :columns="inputCol"
        size="small"
        bordered
        :pagination="false"
        :scroll="{ x: 500 }"
      >
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
            <a-popconfirm title="确认删除该参数吗？" @confirm="(isInput = true), delParam(index)">
              <a href="#" style="color: #ff4d4f">移除</a>
            </a-popconfirm>
          </template>
        </template>
      </a-table>
      <a-divider />
      <p class="listener-filed__title">
        <span>输出参数：</span>
        <a-button size="small" type="primary" @click="(isInput = false), addParam()"
          >添加参数</a-button
        >
      </p>
      <a-table
        :dataSource="outputList"
        :columns="outputCol"
        size="small"
        :pagination="false"
        bordered
        :scroll="{ x: 500 }"
      >
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
            <a-popconfirm title="确认删除该参数吗？" @confirm="(isInput = false), delParam(index)">
              <a href="#" style="color: #ff4d4f">移除</a>
            </a-popconfirm>
          </template>
        </template></a-table
      >
      <a-space style="margin-top: 16px; display: flex; justify-content: space-around">
        <a-button size="small" @click="visible = false">取 消</a-button>
        <a-button size="small" type="primary" @click="saveConnectConfig">保 存</a-button>
      </a-space>
    </div></a-drawer
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
        placeholder="以${}开始创建表达式"
        :rules="{ required: true, trigger: ['blur', 'change'] }"
      >
        <a-input v-model:value="paramForm.string" allowClear size="small" />
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
  import { detailType, paramType, initList } from '../../listeners/utilSelf';
  import { updateElementExtensions } from '../../../utils.js';
  import { createTask, changeType } from './index.js';

  const listenerForm = ref({});
  const connectForm = ref({});
  const listenerTypeObject = ref(detailType);
  const taskPriority = ref('');

  const visible = ref(false);
  const bpmnElement = ref();
  const bpmnElementListeners = ref([]);
  const openConnectForm = () => {
    visible.value = true;
  };
  const showModal = ref(false);
  const resetConnectList = () => {
    bpmnElement.value = window.bpmnInstances.bpmnElement;
    bpmnElementListeners.value = [];
    Object.keys(detailType).forEach((key) => {
      Object.keys(bpmnElement.value.businessObject).forEach((ele) => {
        if (key === ele) {
          listenerForm.value.detailType = key;
        }
      });
    });
    listenerForm.value.class = bpmnElement.value?.businessObject?.class;
    listenerForm.value.expression = bpmnElement.value?.businessObject?.expression;
    listenerForm.value.resultVariable = bpmnElement.value?.businessObject?.resultVariable;
    listenerForm.value.delegateExpression = bpmnElement.value?.businessObject?.delegateExpression;
    listenerForm.value.type = bpmnElement.value?.businessObject?.type;
    listenerForm.value.topic = bpmnElement.value?.businessObject?.topic;
    taskPriority.value = bpmnElement.value?.businessObject?.taskPriority;
    bpmnElement.value.businessObject.extensionElements
      ? (bpmnElementListeners.value =
          bpmnElement.value.businessObject?.extensionElements?.values?.filter(
            (ex) => ex.$type === 'camunda:Connector',
          ) ?? [])
      : '';
    bpmnElementListeners.value.length ? (listenerForm.value.detailType = 'connectorListener') : '';
    bpmnElementListeners.value.length
      ? (connectForm.value.connectorId = bpmnElementListeners.value[0].connectorId)
      : '';
    inputList.value = [];

    bpmnElementListeners.value.length
      ? bpmnElementListeners.value[0].inputOutput.inputParameters
        ? (inputList.value = initList(
            JSON.parse(JSON.stringify(bpmnElementListeners.value[0].inputOutput.inputParameters)),
          ))
        : ''
      : '';
    outputList.value = [];
    bpmnElementListeners.value.length
      ? bpmnElementListeners.value[0].inputOutput.outputParameters
        ? (outputList.value = initList(
            JSON.parse(JSON.stringify(bpmnElementListeners.value[0].inputOutput.outputParameters)),
          ))
        : ''
      : '';
  };

  const paramForm = ref({});
  const paramTypeObject = ref(paramType);
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

  const isInput = ref(false);
  const isAdd = ref(false);
  const addParam = () => {
    paramForm.value = {};
    showModal.value = true;
    isAdd.value = true;
  };
  const paramFormRef = ref();
  const saveParam = async () => {
    otherExtensionList.value =
      bpmnElement.value.businessObject?.extensionElements?.values?.filter(
        (ex) => ex.$type !== 'camunda:Connector',
      ) ?? [];
    const validateStatus = await paramFormRef.value.validateFields();
    if (validateStatus) {
      if (isAdd.value) {
        isInput.value
          ? inputList.value.push(paramForm.value)
          : outputList.value.push(paramForm.value);
      } else {
        isInput.value
          ? inputList.value.splice(editingIndex.value, 1, paramForm.value)
          : outputList.value.splice(editingIndex.value, 1, paramForm.value);
      }
      showModal.value = false;
    }
  };
  const editingIndex = ref(0);
  const editParam = (value, index) => {
    isAdd.value = false;
    showModal.value = true;
    editingIndex.value = index;
    paramForm.value = JSON.parse(JSON.stringify(changeType(value)));
  };
  const delParam = (index) => {
    isInput.value ? inputList.value.splice(index, 1) : outputList.value.splice(index, 1);
    const IOObject = createTask(inputList.value, outputList.value, connectForm.value.connectorId);
    updateElementExtensions(toRaw(bpmnElement.value), otherExtensionList.value.concat(IOObject));
  };

  const otherExtensionList = ref([]);
  //保存连接器配置
  const saveConnectConfig = () => {
    const IOObject = createTask(inputList.value, outputList.value, connectForm.value.connectorId);
    updateElementExtensions(toRaw(bpmnElement.value), otherExtensionList.value.concat(IOObject));
    visible.value = false;
  };

  const elementId = inject('id');
  watch(
    () => elementId,
    () => {
      console.log('详情');
      resetConnectList();
    },
    {
      deep: true,
      immediate: true,
    },
  );
  const changeEle = (e) => {
    Object.keys(listenerForm.value).forEach((key) => {
      Object.keys(bpmnElement.value.businessObject).forEach((ele) => {
        if (key === ele) {
          delete bpmnElement.value.businessObject[ele];
          delete listenerForm.value[key];
        }
      });
    });
    if (e === 'type') {
      listenerForm.value.type = 'external';
      // window.bpmnInstances.modeling.updateProperties(toRaw(bpmnElement.value), {
      //   type: 'external',
      // });
    }
  };
  const eleForm = ref();
  const changeListenType = () => {
    eleForm.value = JSON.parse(JSON.stringify(listenerForm.value));
    // delete bpmnElement.value.businessObject.detailType;
    delete eleForm.value.detailType;
    window.bpmnInstances.modeling.updateProperties(toRaw(bpmnElement.value), {
      ...eleForm.value,
    });
  };
  const changeTaskAsync = () => {
    window.bpmnInstances.modeling.updateProperties(toRaw(bpmnElement.value), {
      taskPriority: taskPriority.value,
    });
  };
</script>
