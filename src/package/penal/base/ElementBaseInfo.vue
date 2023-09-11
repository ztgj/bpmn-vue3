<template>
  <div class="panel-tab__content">
    <a-form
      :model="elementBaseInfo"
      name="basic"
      :label-col="{ span: 6 }"
      :wrapper-col="{ span: 18 }"
      autocomplete="off"
    >
      <a-form-item label="ID" name="ID" :rules="[{ required: true }]">
        <a-input
          v-model:value="elementBaseInfo.id"
          allowClear
          @change="updateBaseInfo('id')"
          size="small"
        />
      </a-form-item>

      <a-form-item label="name" name="流程名称" :rules="[{ required: true }]">
        <a-input
          v-model:value="elementBaseInfo.name"
          allowClear
          @change="updateBaseInfo('name')"
          size="small"
        />
      </a-form-item>
      <template v-if="elementBaseInfo.$type === 'bpmn:Process'">
        <a-form-item label="版本标签" name="versionTag">
          <a-input
            v-model:value="elementBaseInfo.versionTag"
            allowClear
            @change="updateBaseInfo('versionTag')"
            size="small"
          />
        </a-form-item>
        <a-form-item label="可执行" name="isExecutable">
          <a-switch
            v-model:checked="elementBaseInfo.isExecutable"
            checked-children="是"
            un-checked-children="否"
            @change="updateBaseInfo('isExecutable')"
          />
        </a-form-item>
      </template>
      <a-form-item
        v-if="elementBaseInfo.$type === 'bpmn:SubProcess'"
        label="状态"
        name="isExpanded"
      >
        <a-switch
          v-model:checked="elementBaseInfo.isExpanded"
          checked-children="展开"
          un-checked-children="折叠"
          @change="updateBaseInfo('isExpanded')"
        />
      </a-form-item>
    </a-form>
  </div>
</template>
<script setup>
  import { onBeforeUnmount, ref, watch, inject, onMounted, toRaw } from 'vue';
  const props = defineProps({
    businessObject: Object,
    type: String,
  });
  const elementBaseInfo = ref([]);
  const bpmnElement = ref();

  const resetBaseInfo = () => {
    bpmnElement.value = window.bpmnInstances.bpmnElement || {};
    elementBaseInfo.value = JSON.parse(JSON.stringify(props.businessObject));
    if (elementBaseInfo.value && elementBaseInfo.value.$type === 'bpmn:SubProcess') {
      elementBaseInfo.value['isExpanded'] = elementBaseInfo.value.di?.isExpanded;
    }
  };

  watch(
    () => props.businessObject, // 建议这种写法
    () => {
      console.log('常规');
      resetBaseInfo();
    },
    {
      deep: true,
    },
  );
  const updateBaseInfo = (key) => {
    if (key === 'id') {
      window.bpmnInstances.modeling.updateProperties(toRaw(bpmnElement.value), {
        id: toRaw(elementBaseInfo.value[key]),
        di: { id: `${toRaw(elementBaseInfo.value[key])}_di` },
      });
      return;
    }
    if (key === 'isExpanded') {
      window?.bpmnInstances?.modeling.toggleCollapse(toRaw(bpmnElement.value));
      return;
    }
    const attrObj = Object.create(null);
    attrObj[key] = toRaw(elementBaseInfo.value[key]);
    window.bpmnInstances.modeling.updateProperties(toRaw(bpmnElement.value), attrObj);
  };
  onBeforeUnmount(() => {
    bpmnElement.value = null;
  });

</script>
