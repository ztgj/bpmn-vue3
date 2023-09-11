<template>
  <div class="panel-tab__content">
    <a-form size="small" :label-col="{ span: 6 }">
      <a-form-item label="表单标识">
        <a-input v-model:value="formKey" allowClear @change="updateElementFormKey" size="small" />
      </a-form-item>
      <a-form-item label="业务标识">
        <a-select v-model="businessKey" @change="updateElementBusinessKey" size="small">
          <a-select-option v-for="i in fieldList" :key="i.id" :value="i.id">{{
            i.label
          }}</a-select-option>
        </a-select>
      </a-form-item>
    </a-form>

    <!--字段列表-->
    <div class="element-property list-property">
      <a-divider> 表单字段</a-divider>
      <a-table :columns="columns" :dataSource="fieldList" size="small">
        <template #bodyCell="{ column, record, index }">
          <template v-if="column.dataIndex === 'index'"> {{ index + 1 }}</template>
          <template v-if="column.dataIndex === 'type'"> {{ fieldType[record.type] }}</template>
          <template v-if="record.typeType === 'custom' && column.dataIndex === 'type'">
            {{ record.type }}</template
          >
          <template v-if="column.dataIndex === 'opertion'">
            <a-button type="link " size="small" @click="openFieldForm(record, index)"
              >编辑</a-button
            >
            <a-divider type="vertical" />
            <a-popconfirm title="确认移除吗" @confirm="removeField(row, index)">
              <a href="#" style="color: #ff4d4f">移除</a>
            </a-popconfirm>
          </template>
        </template>
      </a-table>
    </div>
    <div class="element-drawer__button">
      <a-button size="small" type="primary" @click="openFieldForm(null, -1)">添加字段</a-button>
    </div>

    <!--字段配置侧边栏-->
    <a-drawer
      v-model:visible="fieldModelVisible"
      title="字段配置"
      width="500"
      append-to-body
      destroy-on-close
    >
      <a-form :model="formFieldForm" :label-col="{ span: 6 }" size="small">
        <a-form-item label="字段ID">
          <a-input v-model:value="formFieldForm.id" allowClear size="small" />
        </a-form-item>
        <a-form-item label="类型">
          <a-select
            v-model:value="formFieldForm.typeType"
            placeholder="请选择字段类型"
            allowClear
            size="small"
            @change="changeFieldTypeType"
          >
            <a-select-option v-for="(value, key) of fieldType" :key="key" :value="key">{{
              value
            }}</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item v-if="formFieldForm.typeType === 'custom'" label="类型名称">
          <a-input v-model:value="formFieldForm.type" allowClear size="small" />
        </a-form-item>
        <a-form-item label="名称">
          <a-input v-model:value="formFieldForm.label" allowClear size="small" />
        </a-form-item>
        <a-form-item v-if="formFieldForm.typeType === 'date'" label="时间格式">
          <a-input v-model:value="formFieldForm.datePattern" allowClear size="small" />
        </a-form-item>
        <a-form-item label="默认值">
          <a-input v-model:value="formFieldForm.defaultValue" allowClear size="small" />
        </a-form-item>
      </a-form>

      <!-- 枚举值设置 -->
      <template v-if="formFieldForm.type === 'enum'">
        <a-divider key="enum-divider" />
        <p key="enum-title" class="listener-filed__title">
          <span>枚举值列表：</span>
          <a-button size="small" type="primary" @click="openFieldOptionForm(null, -1, 'enum')"
            >添加枚举值</a-button
          >
        </p>
        <a-table
          key="enum-table"
          :columns="enumCol"
          :dataSource="fieldEnumList"
          size="small"
          max-height="240"
          bordered
          fit
        >
          <template #bodyCell="{ column, record, index }">
            <template v-if="column.dataIndex === 'index'"> {{ index + 1 }}</template>
            <template v-if="column.dataIndex === 'opertion'">
              <a-button
                type="link "
                size="small"
                @click="openFieldOptionForm(record, index, 'enum')"
                >编辑</a-button
              >
              <a-divider type="vertical" />
              <a-popconfirm title="确认移除吗" @confirm="removeFieldOptionItem(row, index, 'enum')">
                <a href="#" style="color: #ff4d4f">移除</a>
              </a-popconfirm>
            </template>
          </template>
        </a-table>
      </template>

      <!-- 校验规则 -->
      <a-divider key="validation-divider" />
      <p key="validation-title" class="listener-filed__title">
        <span>约束条件列表：</span>
        <a-button size="small" type="primary" @click="openFieldOptionForm(null, -1, 'constraint')"
          >添加约束</a-button
        >
      </p>
      <a-table
        key="validation-table"
        :columns="constrCol"
        :dataSource="fieldConstraintsList"
        size="small"
        max-height="240"
        bordered
        fit
      >
        <template #bodyCell="{ column, record, index }">
          <template v-if="column.dataIndex === 'index'"> {{ index + 1 }}</template>
          <template v-if="column.dataIndex === 'opertion'">
            <a-button
              type="link "
              size="small"
              @click="openFieldOptionForm(record, index, 'constraint')"
              >编辑</a-button
            >
            <a-divider type="vertical" />
            <a-popconfirm
              title="确认移除吗"
              @confirm="removeFieldOptionItem(row, index, 'constraint')"
            >
              <a href="#" style="color: #ff4d4f">移除</a>
            </a-popconfirm>
          </template>
        </template>
      </a-table>

      <!-- 表单属性 -->
      <a-divider key="property-divider" />
      <p key="property-title" class="listener-filed__title">
        <span>字段属性列表：</span>
        <a-button size="small" type="primary" @click="openFieldOptionForm(null, -1, 'property')"
          >添加属性</a-button
        >
      </p>
      <a-table
        key="property-table"
        :columns="proPerCol"
        :dataSource="fieldPropertiesList"
        size="small"
        max-height="240"
        bordered
        fit
      >
        <template #bodyCell="{ column, record, index }">
          <template v-if="column.dataIndex === 'index'"> {{ index + 1 }}</template>
          <template v-if="column.dataIndex === 'opertion'">
            <a-button
              type="link "
              size="small"
              @click="openFieldOptionForm(record, index, 'property')"
              >编辑</a-button
            >
            <a-divider type="vertical" />
            <a-popconfirm
              title="确认移除吗"
              @confirm="removeFieldOptionItem(row, index, 'property')"
            >
              <a href="#" style="color: #ff4d4f">移除</a>
            </a-popconfirm>
          </template>
        </template>
      </a-table>

      <!-- 底部按钮 -->
      <div style="margin-top: 16px; display: flex; justify-content: space-around">
        <a-button size="small">取 消</a-button>
        <a-button size="small" type="primary" @click="saveField">保 存</a-button>
      </div>
    </a-drawer>

    <a-modal
      v-model:visible="fieldOptionModelVisible"
      :title="optionModelTitle"
      width="600px"
      append-to-body
      destroy-on-close
    >
      <a-form :model="fieldOptionForm" size="small" :label-col="{ span: 4 }">
        <a-form-item v-if="fieldOptionType !== 'constraint'" key="option-id" label="编号/ID">
          <a-input v-model:value="fieldOptionForm.id" allowClear size="small" />
        </a-form-item>
        <a-form-item v-if="fieldOptionType !== 'property'" key="option-name" label="名称">
          <a-input v-model:value="fieldOptionForm.name" allowClear size="small" />
        </a-form-item>
        <a-form-item v-if="fieldOptionType === 'constraint'" key="option-config" label="配置">
          <a-input v-model:value="fieldOptionForm.config" allowClear size="small" />
        </a-form-item>
        <a-form-item v-if="fieldOptionType === 'property'" key="option-value" label="值">
          <a-input v-model:value="fieldOptionForm.value" allowClear size="small" />
        </a-form-item>
      </a-form>
      <template v-slot:footer>
        <a-button size="small" @click="fieldOptionModelVisible = false">取 消</a-button>
        <a-button size="small" type="primary" @click="saveFieldOption">确 定</a-button>
      </template>
    </a-modal>
  </div>
</template>

<script setup>
  import { toRaw, ref, watch, inject, reactive } from 'vue';

  const props = defineProps({
    id: String,
    type: String,
  });

  const prefix = inject('prefix');
  //表单列表
  const columns = ref([
    {
      title: '序号',
      dataIndex: 'index',
      align: 'center',
    },
    {
      title: '字段名称',
      dataIndex: 'label',
      align: 'center',
    },
    {
      title: '字段类型',
      dataIndex: 'type',
      align: 'center',
    },
    {
      title: '默认值',
      dataIndex: 'defaultValue',
      align: 'center',
    },
    {
      title: '操作',
      dataIndex: 'opertion',
      align: 'center',
    },
  ]);
  const fieldList = ref([]);
  //枚举列表
  const enumCol = ref([
    {
      title: '序号',
      dataIndex: 'index',
      align: 'center',
    },
    {
      title: '枚举值编号',
      dataIndex: 'id',
      align: 'center',
    },
    {
      title: '枚举值名称',
      dataIndex: 'name',
      align: 'center',
    },
    {
      title: '操作',
      dataIndex: 'opertion',
      align: 'center',
    },
  ]);
  const fieldEnumList = ref([]);
  //约束条件列表
  const constrCol = ref([
    {
      title: '序号',
      dataIndex: 'index',
      align: 'center',
    },
    {
      title: '约束名称',
      dataIndex: 'name',
      align: 'center',
    },
    {
      title: '约束配置',
      dataIndex: 'config',
      align: 'center',
    },
    {
      title: '操作',
      dataIndex: 'opertion',
      align: 'center',
    },
  ]);
  const fieldConstraintsList = ref([]);
  //字段属性列表
  const proPerCol = ref([
    {
      title: '序号',
      dataIndex: 'index',
      align: 'center',
    },
    {
      title: '属性编号',
      dataIndex: 'id',
      align: 'center',
    },
    {
      title: '属性值',
      dataIndex: 'value',
      align: 'center',
    },
    {
      title: '操作',
      dataIndex: 'opertion',
      align: 'center',
    },
  ]);
  const fieldPropertiesList = ref([]);

  const bpmnElement = ref();
  const formKey = ref();
  const businessKey = ref();
  const elExtensionElements = ref();
  const formData = ref({});
  const otherExtensions = ref([]);
  const resetFormList = () => {
    bpmnElement.value = window.bpmnInstances.bpmnElement;
    formKey.value = bpmnElement.value.businessObject.formKey;
    // 获取元素扩展属性 或者 创建扩展属性
    elExtensionElements.value =
      bpmnElement.value.businessObject.get('extensionElements') ||
      window.bpmnInstances.moddle.create('bpmn:ExtensionElements', { values: [] });
    // 获取元素表单配置 或者 创建新的表单配置
    try {
      formData.value =
        elExtensionElements.value.values.filter((ex) => ex.$type === `${prefix}:FormData`)[0] ||
        window.bpmnInstances.moddle.create(`${prefix}:FormData`, { fields: [] });
    } catch (error) {
      formData.value = {};
      console.log(error);
    }

    // 业务标识 businessKey， 绑定在 formData 中
    businessKey.value = formData.value.businessKey;

    // 保留剩余扩展元素，便于后面更新该元素对应属性
    otherExtensions.value = elExtensionElements.value.values.filter(
      (ex) => ex.$type !== `${prefix}:FormData`,
    );

    // 复制原始值，填充表格
    fieldList.value = JSON.parse(JSON.stringify(formData.value.fields || []));

    // 更新元素扩展属性，避免后续报错
    updateElementExtensions();
  };
  const updateElementExtensions = () => {
    // 更新回扩展元素
    const newElExtensionElements = window.bpmnInstances.moddle.create(
      `bpmn:ExtensionElements`,

      {
        values: otherExtensions.value.concat(formData.value),
      },
    );
    // 更新到元素上
    window.bpmnInstances.modeling.updateProperties(toRaw(bpmnElement.value), {
      extensionElements: newElExtensionElements,
    });
  };

  watch(
    () => props.id,
    () => {
      resetFormList();
    },
    {
      deep: true,
      immediate: true,
    },
  );
  const updateElementFormKey = () => {
    window.bpmnInstances.modeling.updateProperties(toRaw(bpmnElement.value), {
      formKey: formKey.value,
    });
  };
  const updateElementBusinessKey = () => {
    window.bpmnInstances.modeling.updateModdleProperties(toRaw(bpmnElement.value), formData.value, {
      businessKey: businessKey.value,
    });
  };

  const fieldModelVisible = ref(false);
  const formFieldIndex = ref(-1);
  const formFieldForm = ref({});
  const fieldType = reactive({
    long: '长整型',
    string: '字符串',
    boolean: '布尔类',
    date: '日期类',
    enum: '枚举类',
    custom: '自定义类型',
  });
  // 打开字段详情侧边栏
  const openFieldForm = (field, index) => {
    formFieldIndex.value = index;
    if (index !== -1) {
      const FieldObject = formData.value.fields[index];
      formFieldForm.value = JSON.parse(JSON.stringify(field));
      // 设置自定义类型
      formFieldForm.value['typeType'] = !fieldType[field.type] ? 'custom' : field.type;
      // 初始化枚举值列表
      field.type === 'enum' &&
        (fieldEnumList.value = JSON.parse(JSON.stringify(FieldObject?.values || [])));
      // 初始化约束条件列表
      fieldConstraintsList.value = JSON.parse(
        JSON.stringify(FieldObject?.validation?.constraints || []),
      );
      // 初始化自定义属性列表
      fieldPropertiesList.value = JSON.parse(JSON.stringify(FieldObject?.properties?.values || []));
    } else {
      formFieldForm.value = {};
      // 初始化枚举值列表
      fieldEnumList.value = [];
      // 初始化约束条件列表
      fieldConstraintsList.value = [];
      // 初始化自定义属性列表
      fieldPropertiesList.value = [];
    }
    fieldModelVisible.value = true;
  };

  // 根据类型调整字段type
  const changeFieldTypeType = (type) => {
    formFieldForm.value['type'] = type === 'custom' ? '' : type;
  };
  const fieldOptionModelVisible = ref(false);
  const formFieldOptionIndex = ref(-1);
  const fieldOptionType = ref();
  const optionModelTitle = ref();
  const fieldOptionForm = ref({});
  // 打开字段 某个 配置项 弹窗
  const openFieldOptionForm = (option, index, type) => {
    fieldOptionModelVisible.value = true;
    fieldOptionType.value = type;
    formFieldOptionIndex.value = index;
    if (type === 'property') {
      fieldOptionForm.value = option ? JSON.parse(JSON.stringify(option)) : {};
      return (optionModelTitle.value = '属性配置');
    }
    if (type === 'enum') {
      fieldOptionForm.value = option ? JSON.parse(JSON.stringify(option)) : {};
      return (optionModelTitle.value = '枚举值配置');
    }
    fieldOptionForm.value = option ? JSON.parse(JSON.stringify(option)) : {};
    return (optionModelTitle.value = '约束条件配置');
  };

  // 保存字段 某个 配置项
  const saveFieldOption = () => {
    if (formFieldOptionIndex.value === -1) {
      if (fieldOptionType.value === 'property') {
        fieldPropertiesList.value.push(fieldOptionForm.value);
      }
      if (fieldOptionType.value === 'constraint') {
        fieldConstraintsList.value.push(fieldOptionForm.value);
      }
      if (fieldOptionType.value === 'enum') {
        fieldEnumList.value.push(fieldOptionForm.value);
      }
    } else {
      fieldOptionType.value === 'property' &&
        fieldPropertiesList.value.splice(formFieldOptionIndex.value, 1, fieldOptionForm.value);
      fieldOptionType.value === 'constraint' &&
        fieldConstraintsList.value.splice(formFieldOptionIndex.value, 1, fieldOptionForm.value);
      fieldOptionType.value === 'enum' &&
        fieldEnumList.value.splice(formFieldOptionIndex.value, 1, fieldOptionForm.value);
    }
    fieldOptionModelVisible.value = false;
    fieldOptionForm.value = {};
  };

  // 移除某个 字段的 配置项
  const removeFieldOptionItem = (option, index, type) => {
    if (type === 'property') {
      fieldPropertiesList.value.splice(index, 1);
      return;
    }
    if (type === 'enum') {
      fieldEnumList.value.splice(index, 1);
      return;
    }
    fieldConstraintsList.value.splice(index, 1);
  };
  // 移除 字段
  const removeField = (field, index) => {
    fieldList.value.splice(index, 1);
    formData.value.fields.splice(index, 1);
    updateElementExtensions();
  };

  // 保存字段配置
  const saveField = () => {
    const { id, type, label, defaultValue, datePattern } = formFieldForm.value;
    const Field = window.bpmnInstances.moddle.create(`${prefix}:FormField`, { id, type, label });
    defaultValue && (Field.defaultValue = defaultValue);
    datePattern && (Field.datePattern = datePattern);
    // 构建属性
    if (fieldPropertiesList.value && fieldPropertiesList.value.length) {
      const fieldPropertyList = fieldPropertiesList.value.map((fp) => {
        return window.bpmnInstances.moddle.create(`${prefix}:Property`, {
          id: fp.id,
          value: fp.value,
        });
      });
      Field.properties = window.bpmnInstances.moddle.create(`${prefix}:Properties`, {
        values: fieldPropertyList,
      });
    }
    // 构建校验规则
    if (fieldConstraintsList.value && fieldConstraintsList.value.length) {
      const fieldConstraintList = fieldConstraintsList.value.map((fc) => {
        return window.bpmnInstances.moddle.create(`${prefix}:Constraint`, {
          name: fc.name,
          config: fc.config,
        });
      });
      Field.validation = window.bpmnInstances.moddle.create(`${prefix}:Validation`, {
        constraints: fieldConstraintList,
      });
    }
    // 构建枚举值
    if (fieldEnumList.value && fieldEnumList.value.length) {
      Field.values = fieldEnumList.value.map((fe) => {
        return window.bpmnInstances.moddle.create(`${prefix}:Value`, { name: fe.name, id: fe.id });
      });
    }
    // 更新数组 与 表单配置实例
    if (formFieldIndex.value === -1) {
      fieldList.value.push(formFieldForm.value);
      formData.value.fields && formData.value.fields.push(Field);
    } else {
      fieldList.value.splice(formFieldIndex.value, 1, formFieldForm.value);
      formData.value.fields.splice(formFieldIndex.value, 1, Field);
    }
    updateElementExtensions();
    fieldModelVisible.value = false;
  };
</script>
