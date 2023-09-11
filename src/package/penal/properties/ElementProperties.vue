<template>
  <div class="panel-tab__content">
    <a-table :columns="columns" :dataSource="elementPropertyList" size="small">
      <template #bodyCell="{ column, record, index }">
        <template v-if="column.dataIndex === 'index'"> {{ index + 1 }}</template>
        <template v-if="column.dataIndex === 'opertion'">
          <a-button type="link " size="small" @click="openAttributesForm(record, index)"
            >编辑</a-button
          >
          <a-divider type="vertical" />
          <a-popconfirm title="确认移除该属性吗" @confirm="removeAttributes(row, index)">
            <a href="#" style="color: #ff4d4f">移除</a>
          </a-popconfirm>
        </template>
      </template>
    </a-table>
    <div class="element-drawer__button">
      <a-button
        size="small"
        type="primary"
        style="top: 4px; width: 100%"
        @click="openAttributesForm(null, -1)"
        >添加属性</a-button
      >
    </div>

    <a-modal
      title="属性配置"
      v-model:visible="propertyFormModelVisible"
      width="600px"
      @ok="saveAttribute"
    >
      <a-form
        :model="propertyForm"
        size="small"
        label-width="96px"
        ref="attributeFormRef"
        style="height: 136px"
        @submit.prevent
      >
        <a-form-item label="属性名" name="name">
          <a-input v-model:value="propertyForm.name" allowClear size="small" />
        </a-form-item>
        <a-form-item label="属性值" name="value">
          <a-input v-model:value="propertyForm.value" allowClear size="small" />
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script setup>
  import { toRaw, ref, watch, inject } from 'vue';
  const props = defineProps({
    id: String,
    type: String,
  });

  const columns = ref([
    {
      title: '序号',
      dataIndex: 'index',
      align: 'center',
    },
    {
      title: '属性',
      dataIndex: 'name',
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

  const elementPropertyList = ref([]);
  const otherExtensionList = ref([]);
  const bpmnElementPropertyList = ref([]);
  const bpmnElement = ref();
  const propertyFormModelVisible = ref(false);
  const editingPropertyIndex = ref();
  const propertyForm = ref({});
  const openAttributesForm = (attr, index) => {
    propertyForm.value = index === -1 ? {} : JSON.parse(JSON.stringify(attr));
    editingPropertyIndex.value = index;
    propertyFormModelVisible.value = true;
  };
  const saveAttribute = () => {
    const { name, value } = propertyForm.value;
    if (editingPropertyIndex.value !== -1) {
      window.bpmnInstances.modeling.updateModdleProperties(
        toRaw(bpmnElement.value),
        bpmnElementPropertyList.value[editingPropertyIndex.value],
        {
          name,
          value,
        },
      );
    } else {
      // 新建属性字段
      const newPropertyObject = window.bpmnInstances.moddle.create(`${prefix}:Property`, {
        name,
        value,
      });
      // 新建一个属性字段的保存列表
      const propertiesObject = window.bpmnInstances.moddle.create(`${prefix}:Properties`, {
        values: bpmnElementPropertyList.value.concat([newPropertyObject]),
      });
      updateElementExtensions(propertiesObject);
    }
    propertyFormModelVisible.value = false;
    resetAttributesList();
  };

  const bpmnElementProperties = ref();
  const prefix = inject('prefix');
  const resetAttributesList = () => {
    bpmnElement.value = window.bpmnInstances.bpmnElement;
    otherExtensionList.value = []; // 其他扩展配置
    bpmnElementProperties.value =
      bpmnElement.value.businessObject?.extensionElements?.values?.filter((ex) => {
        if (ex.$type !== `${prefix}:Properties`) {
          otherExtensionList.value.push(ex);
        }
        return ex.$type === `${prefix}:Properties`;
      }) ?? [];
    // 保存所有的 扩展属性字段
    bpmnElementPropertyList.value = bpmnElementProperties.value.reduce(
      (pre, current) => pre.concat(current.values),
      [],
    );
    // 复制 显示
    elementPropertyList.value = JSON.parse(JSON.stringify(bpmnElementPropertyList.value ?? []));
  };
  const updateElementExtensions = (properties) => {
    const extensions = window.bpmnInstances.moddle.create('bpmn:ExtensionElements', {
      values: otherExtensionList.value.concat([properties]),
    });
    window.bpmnInstances.modeling.updateProperties(toRaw(bpmnElement.value), {
      extensionElements: extensions,
    });
  };
  watch(
    () => props.id, // 建议这种写法
    () => {
      console.log('扩展属性');
      resetAttributesList();
    },
    {
      deep: true,
      immediate: true,
    },
  );
  const removeAttributes = (attr, index) => {
    elementPropertyList.value.splice(index, 1);
    bpmnElementPropertyList.value.splice(index, 1);
    // 新建一个属性字段的保存列表
    const propertiesObject = window.bpmnInstances.moddle.create(`${prefix}:Properties`, {
      values: bpmnElementPropertyList.value,
    });
    updateElementExtensions(propertiesObject);
    resetAttributesList();
  };
</script>
