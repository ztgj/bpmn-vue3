<template>
  <div class="panel-tab__content">
    <div class="element-property input-property">
      <div class="element-property__label">元素文档：</div>
      <div class="element-property__value">
        <a-textarea
          v-model:value="documentation"
          size="small"
          @change="updateDocumentation"
          @pressEnter="updateDocumentation"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
  import { onBeforeUnmount, toRaw, ref, watch } from 'vue';

  const props = defineProps({
    id: String,
  });
  watch(
    () => props.id, // 建议这种写法
    () => {
      if (props.id) {
        const documentations = window.bpmnInstances.bpmnElement.businessObject?.documentation;
        documentation.value = documentations && documentations.length ? documentations[0].text : '';
      } else {
        documentation.value = '';
      }
    },
    {
      deep: true,
    },
  );
  const documentation = ref('');
  const bpmnElement = ref('');
  const doc = ref();
  const updateDocumentation = () => {
    (bpmnElement.value && bpmnElement.value.id === props.id) ||
      (bpmnElement.value = window.bpmnInstances.elementRegistry.get(props.id));
    doc.value = window.bpmnInstances.bpmnFactory.create('bpmn:Documentation', {
      text: documentation.value,
    });
    window.bpmnInstances.modeling.updateProperties(toRaw(bpmnElement.value), {
      documentation: [toRaw(doc.value)],
    });
  };
  onBeforeUnmount(() => {
    bpmnElement.value = null;
  });
</script>
