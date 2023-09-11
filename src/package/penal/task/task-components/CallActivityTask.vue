<template>
  <a-form
    size="small"
    :model="listenerForm"
    :label-col="{ span: 8 }"
    ref="listenerFormRef"
    :labelWrap="true"
  >
    <a-form-item label="调用活动类型" name="callType">
      <a-select v-model:value="listenerForm.callType" size="small" @change="changeEle" allowClear>
        <a-select-option
          v-for="i in Object.keys(listenerTypeObject)"
          :key="i"
          :label="listenerTypeObject[i]"
          >{{ listenerTypeObject[i] }}</a-select-option
        >
      </a-select>
    </a-form-item>
    <a-form-item
      v-if="listenerForm.callType === 'BPMN'"
      label="调用元素"
      name="calledElement"
      :rules="{ required: true, trigger: ['blur', 'change'] }"
    >
      <a-input
        v-model:value="listenerForm.calledElement"
        allowClear
        size="small"
        placeholder="必须提供一个值"
        @change="changeListenType"
      />
    </a-form-item>
    <a-form-item
      v-if="listenerForm.callType === 'CMMN'"
      label="Case Ref"
      name="caseRef"
      :rules="{ required: true, trigger: ['blur', 'change'] }"
    >
      <a-input
        v-model:value="listenerForm.caseRef"
        allowClear
        size="small"
        placeholder="必须提供一个值"
        @change="changeListenType"
      />
    </a-form-item>
    <a-form-item
      v-if="listenerForm.callType === 'BPMN'"
      label="结合"
      name="calledElementBinding"
      :rules="{ required: true, trigger: ['blur', 'change'] }"
    >
      <a-select
        v-model:value="listenerForm.calledElementBinding"
        size="small"
        placeholder="必须提供一个值"
        @change="changeListenType"
      >
        <a-select-option
          v-for="i in Object.keys(bindTypeObject)"
          :key="i"
          :label="bindTypeObject[i]"
          >{{ bindTypeObject[i] }}</a-select-option
        >
      </a-select>
    </a-form-item>
    <a-form-item
      v-if="listenerForm.callType === 'CMMN'"
      label="结合"
      name="caseBinding"
      :rules="{ required: true, trigger: ['blur', 'change'] }"
    >
      <a-select
        v-model:value="listenerForm.caseBinding"
        size="small"
        @change="changeListenType"
        placeholder="必须提供一个值"
      >
        <a-select-option
          v-for="i in Object.keys(cmmnTypeObject)"
          :key="i"
          :label="cmmnTypeObject[i]"
          >{{ cmmnTypeObject[i] }}</a-select-option
        >
      </a-select>
    </a-form-item>
    <a-form-item
      v-if="listenerForm.calledElementBinding === 'version'"
      label="版本"
      name="calledElementVersion"
    >
      <a-input
        v-model:value="listenerForm.calledElementVersion"
        allowClear
        size="small"
        @change="changeListenType"
      />
    </a-form-item>
    <a-form-item
      v-if="listenerForm.callType === 'BPMN' && listenerForm.calledElementBinding === 'versionTag'"
      label="版本标签"
      name="calledElementVersionTag"
    >
      <a-input
        v-model:value="listenerForm.calledElementVersionTag"
        allowClear
        size="small"
        @change="changeListenType"
      />
    </a-form-item>
    <a-form-item
      v-if="listenerForm.callType === 'CMMN' && listenerForm.caseBinding === 'version'"
      label="版本"
      name="caseVersion"
    >
      <a-input
        v-model:value="listenerForm.caseVersion"
        allowClear
        size="small"
        @change="changeListenType"
      />
    </a-form-item>
    <a-form-item
      v-if="listenerForm.callType === 'BPMN'"
      label="租户id"
      name="calledElementTenantId"
    >
      <a-input
        v-model:value="listenerForm.calledElementTenantId"
        allowClear
        size="small"
        @change="changeListenType"
      />
    </a-form-item>

    <a-form-item
      v-if="listenerForm.callType === 'CMMN'"
      label="租户id"
      name="caseTenantId"
      :rules="{ required: true, trigger: ['blur', 'change'] }"
    >
      <a-input
        v-model:value="listenerForm.caseTenantId"
        allowClear
        size="small"
        @change="changeListenType"
      />
    </a-form-item>

    <a-form-item label="业务key">
      <a-switch v-model:checked="checked" @change="changeKey" />
    </a-form-item>
    <a-form-item
      v-if="checked"
      label="Business Key Expression"
      name="businessKey"
      :rules="{ required: true, trigger: ['blur', 'change'] }"
    >
      <a-input
        v-model:value="businessKey"
        allowClear
        size="small"
        placeholder="必须提供一个值"
        @change="changeKey"
      />
    </a-form-item>
    <a-form-item v-if="listenerForm.callType === 'BPMN'" label="代理变量映射" name="delegate">
      <a-select v-model:value="delegate" size="small" allowClear @change="changeDele">
        <a-select-option
          v-for="i in Object.keys(delegateTypeObject)"
          :key="i"
          :label="delegateTypeObject[i]"
          >{{ delegateTypeObject[i] }}</a-select-option
        >
      </a-select>
    </a-form-item>
    <a-form-item
      v-if="delegate === 'variableMappingClass' && listenerForm.callType === 'BPMN'"
      label="Class"
      name="variableMappingClass"
      :rules="{ required: true, trigger: ['blur', 'change'] }"
    >
      <a-input
        v-model:value="listenerForm.variableMappingClass"
        allowClear
        size="small"
        placeholder="必须提供一个值"
        @change="changeListenType"
      />
    </a-form-item>
    <a-form-item
      v-if="delegate === 'variableMappingDelegateExpression' && listenerForm.callType === 'BPMN'"
      label="代理表达式"
      name="variableMappingDelegateExpression"
      :rules="{ required: true, trigger: ['blur', 'change'] }"
    >
      <a-input
        v-model:value="listenerForm.variableMappingDelegateExpression"
        allowClear
        size="small"
        placeholder="必须提供一个值"
        @change="changeListenType"
      />
    </a-form-item>
  </a-form>
</template>

<script setup>
  import { toRaw, ref, watch, inject } from 'vue';
  import { callType, bindType, delegateType, cmmnType } from '../../listeners/utilSelf';

  const checked = ref(false);
  const listenerTypeObject = ref(callType);
  const bindTypeObject = ref(bindType);
  const cmmnTypeObject = ref(cmmnType);
  const delegateTypeObject = ref(delegateType);
  const delegate = ref('');
  const listenerForm = ref({});
  const businessKey = ref('#{execution.processBusinessKey}');
  const bpmnElement = ref();
  const resetConnectList = () => {
    bpmnElement.value = window.bpmnInstances.bpmnElement;
    if (bpmnElement.value.businessObject) {
      if (bpmnElement.value.businessObject.calledElement) {
        listenerForm.value.callType = 'BPMN';
      } else if (bpmnElement.value.businessObject.caseRef) {
        listenerForm.value.callType = 'CMMN';
      } else {
        listenerForm.value.callType = '';
      }
    }
    listenerForm.value.calledElement = bpmnElement.value?.businessObject?.calledElement;
    listenerForm.value.calledElementTenantId =
      bpmnElement.value?.businessObject?.calledElementTenantId;
    listenerForm.value.variableMappingClass =
      bpmnElement.value?.businessObject?.variableMappingClass;
    listenerForm.value.calledElementBinding =
      bpmnElement.value?.businessObject?.calledElementBinding;
    listenerForm.value.variableMappingDelegateExpression =
      bpmnElement.value?.businessObject?.variableMappingDelegateExpression;
    listenerForm.value.calledElementVersion =
      bpmnElement.value?.businessObject?.calledElementVersion;
    listenerForm.value.calledElementVersionTag =
      bpmnElement.value?.businessObject?.calledElementVersionTag;

    listenerForm.value.caseRef = bpmnElement.value?.businessObject?.caseRef;
    listenerForm.value.caseTenantId = bpmnElement.value?.businessObject?.caseTenantId;
    listenerForm.value.caseBinding = bpmnElement.value?.businessObject?.caseBinding;
    listenerForm.value.caseVersion = bpmnElement.value?.businessObject?.caseVersion;

    bpmnElement.value?.businessObject?.extensionElements?.values[0].businessKey
      ? (checked.value = true)
      : (checked.value = false);
    delegate.value = bpmnElement.value?.businessObject?.variableMappingClass
      ? 'variableMappingClass'
      : bpmnElement.value?.businessObject?.variableMappingDelegateExpression
      ? 'variableMappingDelegateExpression'
      : '';
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
  const changeEle = () => {
    Object.keys(listenerForm.value).forEach((key) => {
      Object.keys(bpmnElement.value.businessObject).forEach((ele) => {
        if (key === ele) {
          delete bpmnElement.value.businessObject[ele];
          delete listenerForm.value[key];
        }
      });
    });
  };

  const eleForm = ref();
  const changeListenType = () => {
    eleForm.value = JSON.parse(JSON.stringify(listenerForm.value));
    delete eleForm.value.callType;
    window.bpmnInstances.modeling.updateProperties(toRaw(bpmnElement.value), {
      ...eleForm.value,
    });
  };

  const changeKey = (e) => {
    if (e) {
      const extensionElements = window.bpmnInstances.moddle.create('bpmn:ExtensionElements', {
        values: [
          window.bpmnInstances.moddle.create('camunda:In', {
            businessKey: businessKey.value,
          }),
        ],
      });
      window.bpmnInstances.modeling.updateModdleProperties(
        toRaw(bpmnElement.value),
        window.bpmnInstances.bpmnElement.businessObject,
        {
          extensionElements,
        },
      );
    } else {
      delete window.bpmnInstances.bpmnElement.businessObject.extensionElements;
    }
  };

  const changeDele = (value) => {
    if (value === 'variableMappingClass') {
      listenerForm.value.variableMappingDelegateExpression
        ? delete listenerForm.value.variableMappingDelegateExpression
        : '';
      delete window.bpmnInstances.bpmnElement.businessObject.variableMappingDelegateExpression;
    } else {
      listenerForm.value.variableMappingClass ? delete listenerForm.value.variableMappingClass : '';
      delete window.bpmnInstances.bpmnElement.businessObject.variableMappingClass;
    }
  };
</script>
