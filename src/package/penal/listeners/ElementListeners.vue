<template>
  <div class="panel-tab__content">
    <a-table :dataSource="elementListenersList" :columns="columns" size="small">
      <template #bodyCell="{ column, record, index }">
        <template v-if="column.dataIndex === 'index'"> {{ index + 1 }}</template>
        <template v-if="column.dataIndex === 'listenerType'">
          {{ listenerTypeObject[record.listenerType] }}</template
        >
        <template v-if="column.dataIndex === 'opertion'">
          <a-button type="link " size="small" @click="openListenerForm(record, index)"
            >编辑</a-button
          >
          <a-divider type="vertical" />
          <a-popconfirm title="确认移除该监听器吗" @confirm="confirm(index)">
            <a href="#" style="color: #ff4d4f">移除</a>
          </a-popconfirm>
          <!-- <a-button  type="link " size="small" style="color: #ff4d4f" @click="removeListener(record, index)">移除</a-button> -->
        </template>
      </template>
    </a-table>
    <div class="element-drawer__button">
      <a-button
        size="small"
        type="primary"
        style="top: 4px; width: 100%"
        @click="openListenerForm(null)"
        >添加监听器</a-button
      >
    </div>

    <!-- 监听器 编辑/创建 部分 -->
    <a-drawer v-model:visible="listenerFormModelVisible" title="执行监听器" width="500">
      <a-form size="small" :model="listenerForm" :label-col="{ span: 6 }" ref="listenerFormRef">
        <a-form-item
          label="事件类型"
          name="event"
          :rules="{ required: true, trigger: ['blur', 'change'] }"
        >
          <a-select v-model:value="listenerForm.event" size="small">
            <a-select-option label="start" value="start" />
            <a-select-option label="end" value="end" />
          </a-select>
        </a-form-item>
        <a-form-item
          label="监听器类型"
          name="listenerType"
          :rules="{ required: true, trigger: ['blur', 'change'] }"
        >
          <a-select v-model:value="listenerForm.listenerType" size="small">
            <a-select-option
              v-for="i in Object.keys(listenerTypeObject)"
              :key="i"
              :label="listenerTypeObject[i]"
              >{{ listenerTypeObject[i] }}</a-select-option
            >
          </a-select>
        </a-form-item>
        <a-form-item
          v-if="listenerForm.listenerType === 'classListener'"
          label="Java类"
          name="class"
          key="listener-class"
          :rules="{ required: true, trigger: ['blur', 'change'] }"
        >
          <a-input v-model:value="listenerForm.class" allowClear size="small" />
        </a-form-item>
        <a-form-item
          v-if="listenerForm.listenerType === 'expressionListener'"
          label="表达式"
          name="expression"
          key="listener-expression"
          :rules="{ required: true, trigger: ['blur', 'change'] }"
        >
          <a-input v-model:value="listenerForm.expression" allowClear size="small" />
        </a-form-item>
        <a-form-item
          v-if="listenerForm.listenerType === 'delegateExpressionListener'"
          label="代理表达式"
          name="delegateExpression"
          key="listener-delegate"
          :rules="{ required: true, trigger: ['blur', 'change'] }"
        >
          <a-input v-model:value="listenerForm.delegateExpression" allowClear size="small" />
        </a-form-item>
        <template v-if="listenerForm.listenerType === 'scriptListener'">
          <a-form-item
            label="脚本格式"
            name="scriptFormat"
            key="listener-script-format"
            :rules="{ required: true, trigger: ['blur', 'change'], message: '请填写脚本格式' }"
          >
            <a-input v-model:value="listenerForm.scriptFormat" allowClear size="small" />
          </a-form-item>
          <a-form-item
            label="脚本类型"
            name="scriptType"
            key="listener-script-type"
            :rules="{ required: true, trigger: ['blur', 'change'], message: '请选择脚本类型' }"
          >
            <a-select v-model:value="listenerForm.scriptType" size="small">
              <a-select-option value="inlineScript">内联脚本</a-select-option>
              <a-select-option value="externalScript">外部脚本</a-select-option>
            </a-select>
          </a-form-item>
          <a-form-item
            v-if="listenerForm.scriptType === 'inlineScript'"
            label="脚本内容"
            name="value"
            key="listener-script"
            :rules="{ required: true, trigger: ['blur', 'change'], message: '请填写脚本内容' }"
          >
            <a-input v-model:value="listenerForm.value" allowClear size="small" />
          </a-form-item>
          <a-form-item
            v-if="listenerForm.scriptType === 'externalScript'"
            label="资源地址"
            name="resource"
            key="listener-resource"
            :rules="{ required: true, trigger: ['blur', 'change'], message: '请填写资源地址' }"
          >
            <a-input v-model:value="listenerForm.resource" allowClear size="small" />
          </a-form-item>
        </template>
      </a-form>
      <a-divider />
      <p class="listener-filed__title">
        <span>注入字段：</span>
        <a-button size="small" type="primary" @click="openListenerFieldForm(null)"
          >添加字段</a-button
        >
      </p>
      <a-table
        :dataSource="fieldsListOfListener"
        :columns="fieldCol"
        size="small"
        max-height="240"
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
            <a-button type="link " size="small" @click="openListenerFieldForm(record, index)"
              >编辑</a-button
            >
            <a-divider type="vertical" />
            <a-popconfirm title="确认移除该字段吗？" @confirm="confirmField(index)">
              <a href="#" style="color: #ff4d4f">移除</a>
            </a-popconfirm>
          </template>
        </template>
      </a-table>

      <a-space style="margin-top: 16px; display: flex; justify-content: space-around">
        <a-button size="small" @click="listenerFormModelVisible = false">取 消</a-button>
        <a-button size="small" type="primary" @click="saveListenerConfig">保 存</a-button>
      </a-space>
    </a-drawer>

    <!-- 注入西段 编辑/创建 部分 -->
    <a-modal title="字段配置" v-model:visible="listenerFieldFormModelVisible" width="600px">
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
          key="field-string"
          :rules="{ required: true, trigger: ['blur', 'change'] }"
        >
          <a-input v-model:value="listenerFieldForm.string" allowClear size="small" />
        </a-form-item>
        <a-form-item
          v-if="listenerFieldForm.fieldType === 'expression'"
          label="表达式："
          name="expression"
          key="field-expression"
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
  </div>
</template>
<script setup>
  import { createListenerObject, updateElementExtensions } from '../../utils';
  import { initListenerType, initListenerForm, listenerType, fieldType } from './utilSelf';
  import { toRaw, ref, watch, inject } from 'vue';

  const props = defineProps({
    id: String,
    type: String,
    businessObject: Object,
  });

  const prefix = inject('prefix');
  const elementListenersList = ref([]);
  const columns = ref([
    {
      title: '序号',
      dataIndex: 'index',
      align: 'center',
    },
    {
      title: '事件类型',
      dataIndex: 'event',
      align: 'center',
    },
    {
      title: '监听器类型',
      dataIndex: 'listenerType',
      align: 'center',
    },
    {
      title: '操作',
      dataIndex: 'opertion',
      align: 'center',
    },
  ]);
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

  const listenerForm = ref({}); // 监听器详情表单
  const listenerFormModelVisible = ref(false); // 监听器 编辑 侧边栏显示状态
  const fieldsListOfListener = ref([]);
  const listenerFieldForm = ref({}); // 监听器 注入字段 详情表单
  const listenerFieldFormModelVisible = ref(false); // 监听器 注入字段表单弹窗 显示状态
  const editingListenerIndex = ref(-1); // 监听器所在下标，-1 为新增
  const editingListenerFieldIndex = ref(-1); // 监听器所在下标，-1 为新增
  const listenerTypeObject = ref(listenerType);
  const fieldTypeObject = ref(fieldType);

  const bpmnElement = ref();
  const bpmnElementListeners = ref([]);
  const otherExtensionList = ref([]);
  const resetListenersList = () => {
    bpmnElement.value = window.bpmnInstances.bpmnElement;
    otherExtensionList.value = [];
    bpmnElementListeners.value =
      bpmnElement.value.businessObject?.extensionElements?.values?.filter(
        (ex) => ex.$type === 'camunda:ExecutionListener',
      ) ?? [];
    elementListenersList.value = bpmnElementListeners.value.map((listener) =>
      initListenerType(listener),
    );
  };
  watch(
    () => props.id, // 建议这种写法
    () => {
      console.log('执行监听器');
      resetListenersList();
    },
    {
      deep: true,
      immediate: true,
    },
  );
  // 打开 监听器详情 侧边栏
  const openListenerForm = (listener, index) => {
    if (listener) {
      listenerForm.value = initListenerForm(listener);
      editingListenerIndex.value = index;
    } else {
      listenerForm.value = {};
      editingListenerIndex.value = -1; // 标记为新增
    }
    if (listener && listener.fields) {
      fieldsListOfListener.value = listener.fields.map((field) => ({
        ...field,
        fieldType: field.string ? 'string' : 'expression',
      }));
    } else {
      fieldsListOfListener.value = [];
      listenerForm.value['fields'] = [];
    }
    // 打开侧边栏并清楚验证状态
    listenerFormModelVisible.value = true;
  };
  // 打开监听器字段编辑弹窗
  const openListenerFieldForm = (field, index) => {
    listenerFieldForm.value = field ? JSON.parse(JSON.stringify(field)) : {};
    editingListenerFieldIndex.value = field ? index : -1;
    listenerFieldFormModelVisible.value = true;
  };
  const listenerFieldFormRef = ref();
  // 保存监听器注入字段
  const saveListenerFiled = async () => {
    const validateStatus = await listenerFieldFormRef.value.validateFields();
    if (!validateStatus) return; // 验证不通过直接返回
    if (editingListenerFieldIndex.value === -1) {
      fieldsListOfListener.value.push(listenerFieldForm.value);
      listenerForm.value.fields.push(listenerFieldForm.value);
    } else {
      fieldsListOfListener.value.splice(
        editingListenerFieldIndex.value,
        1,
        listenerFieldForm.value,
      );
      listenerForm.value.fields.splice(editingListenerFieldIndex.value, 1, listenerFieldForm.value);
    }
    listenerFieldFormModelVisible.value = false;
    listenerFieldForm.value = {};
  };

  const confirm = (index) => {
    bpmnElementListeners.value.splice(index, 1);
    elementListenersList.value.splice(index, 1);
    updateElementExtensions(
      toRaw(bpmnElement.value),
      otherExtensionList.value.concat(bpmnElementListeners.value),
    );
  };
  const confirmField = (index) => {
    fieldsListOfListener.value.splice(index, 1);
    listenerForm.value.fields.splice(index, 1);
  };

  // 保存监听器配置
  const listenerFormRef = ref();
  const saveListenerConfig = async () => {
    const validateStatus = await listenerFormRef.value.validateFields();
    if (!validateStatus) return; // 验证不通过直接返回
    // listenerForm.value={}
    const listenerObject = createListenerObject(listenerForm.value, false, prefix);
    if (editingListenerIndex.value === -1) {
      bpmnElementListeners.value.push(listenerObject);
      elementListenersList.value.push(listenerForm.value);
    } else {
      bpmnElementListeners.value.splice(editingListenerIndex.value, 1, listenerObject);
      elementListenersList.value.splice(editingListenerIndex.value, 1, listenerForm.value);
    }
    // 保存其他配置
    otherExtensionList.value =
      bpmnElement.value.businessObject?.extensionElements?.values?.filter(
        (ex) => ex.$type !== `${prefix}:ExecutionListener`,
      ) ?? [];
    updateElementExtensions(
      toRaw(bpmnElement.value),
      otherExtensionList.value.concat(bpmnElementListeners.value),
    );
    // 4. 隐藏侧边栏
    listenerFormModelVisible.value = false;
    listenerForm.value = {};
  };
  //   onBeforeUnmount(()=> {
  //     bpmnElement.value= null;
  // })
</script>
