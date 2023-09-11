<template>
  <div class="panel-tab__content">
    <a-form size="small" :label-col="{ span: 6 }">
      <a-form-item label="回路特性">
        <a-select
          v-model:value="loopCharacteristics"
          @change="changeLoopCharacteristicsType"
          size="small"
        >
          <!--bpmn:MultiInstanceLoopCharacteristics-->
          <a-select-option value="ParallelMultiInstance">并行多重事件</a-select-option>
          <a-select-option value="SequentialMultiInstance">时序多重事件</a-select-option>
          <!--bpmn:StandardLoopCharacteristics-->
          <a-select-option value="StandardLoop">循环事件</a-select-option>
          <a-select-option value="Null">无</a-select-option>
        </a-select>
      </a-form-item>
      <template
        v-if="
          loopCharacteristics === 'ParallelMultiInstance' ||
          loopCharacteristics === 'SequentialMultiInstance'
        "
      >
        <a-form-item label="实例数量">
          <a-input
            v-model:value="loopInstanceForm.loopCardinality"
            allowClear
            @change="updateLoopCardinality(loopInstanceForm.loopCardinality)"
            size="small"
          />
        </a-form-item>
        <a-form-item label="任务参与人列表">
          <a-input
            v-model:value="loopInstanceForm.collection"
            allowClear
            @change="updateLoopBase"
            size="small"
          />
        </a-form-item>
        <a-form-item label="元素变量">
          <a-input
            v-model:value="loopInstanceForm.elementVariable"
            allowClear
            @change="updateLoopBase"
            size="small"
          />
        </a-form-item>
        <a-form-item label="完成条件">
          <a-input
            v-model:value="loopInstanceForm.completionCondition"
            allowClear
            @change="updateLoopCondition(loopInstanceForm.completionCondition)"
            size="small"
          />
        </a-form-item>
        <a-form-item label="异步状态">
          <a-space :size="4">
            <a-checkbox
              v-model:checked="loopInstanceForm.asyncBefore"
              @change="updateLoopAsync('asyncBefore')"
              >异步前</a-checkbox
            >
            <a-checkbox
              v-model:checked="loopInstanceForm.asyncAfter"
              @change="updateLoopAsync('asyncAfter')"
              >异步后</a-checkbox
            >
            <a-checkbox
              v-model:checked="exclusive"
              v-if="loopInstanceForm.asyncAfter || loopInstanceForm.asyncBefore"
              @change="updateLoopAsync('exclusive')"
              >排除</a-checkbox
            ></a-space
          >
        </a-form-item>
        <a-form-item
          label="重试周期"
          v-if="loopInstanceForm.asyncAfter || loopInstanceForm.asyncBefore"
        >
          <a-input
            v-model:value="loopInstanceForm.timeCycle"
            allowClear
            @change="updateLoopTimeCycle"
            size="small"
          />
        </a-form-item>
      </template>
    </a-form>
  </div>
</template>

<script setup>
  import { ref, watch, onBeforeUnmount, toRaw } from 'vue';
  const props = defineProps({
    businessObject: Object,
    type: String,
  });
  const loopCharacteristics = ref('');
  const loopInstanceForm = ref({});
  const defaultLoopInstanceForm = ref({
    completionCondition: '',
    loopCardinality: '',
    extensionElements: [],
    asyncAfter: false,
    asyncBefore: false,
  });
  const multiLoopInstance = ref();
  const getElementLoop = (businessObject) => {
    if (!businessObject.loopCharacteristics) {
      loopCharacteristics.value = 'Null';
      loopInstanceForm.value = {};
      return;
    }
    if (businessObject.loopCharacteristics.$type === 'bpmn:StandardLoopCharacteristics') {
      loopCharacteristics.value = 'StandardLoop';
      loopInstanceForm.value = {};
      return;
    }
    if (businessObject.loopCharacteristics.isSequential) {
      loopCharacteristics.value = 'SequentialMultiInstance';
    } else {
      loopCharacteristics.value = 'ParallelMultiInstance';
    }
    // 合并配置
    loopInstanceForm.value = {
      ...defaultLoopInstanceForm.value,
      ...businessObject.loopCharacteristics,
      completionCondition: businessObject.loopCharacteristics?.completionCondition?.body ?? '',
      loopCardinality: businessObject.loopCharacteristics?.loopCardinality?.body ?? '',
    };
    // 保留当前元素 businessObject 上的 loopCharacteristics 实例
    multiLoopInstance.value = window.bpmnInstances.bpmnElement.businessObject.loopCharacteristics;
    // 更新表单
    if (
      businessObject.loopCharacteristics.extensionElements &&
      businessObject.loopCharacteristics.extensionElements.values &&
      businessObject.loopCharacteristics.extensionElements.values.length
    ) {
      loopInstanceForm.value['timeCycle'] =
        businessObject.loopCharacteristics.extensionElements.values[0].body;
    }
  };
  const bpmnElement = ref('');
  watch(
    () => props.businessObject,
    () => {
      console.log('多实例');
      bpmnElement.value = window.bpmnInstances.bpmnElement;
      getElementLoop(props.businessObject);
    },
    {
      deep: true,
      immediate: true,
    },
  );

  const changeLoopCharacteristicsType = (type) => {
    // loopInstanceForm.value = { ...defaultLoopInstanceForm.value }; // 切换类型取消原表单配置
    // 取消多实例配置
    if (type === 'Null') {
      window.bpmnInstances.modeling.updateProperties(toRaw(bpmnElement.value), {
        loopCharacteristics: null,
      });
      return;
    }
    // 配置循环
    if (type === 'StandardLoop') {
      const loopCharacteristicsObject = window.bpmnInstances.moddle.create(
        'bpmn:StandardLoopCharacteristics',
      );
      window.bpmnInstances.modeling.updateProperties(toRaw(bpmnElement.value), {
        loopCharacteristics: toRaw(loopCharacteristicsObject),
      });
      multiLoopInstance.value = null;
      return;
    }
    // 时序
    if (type === 'SequentialMultiInstance') {
      multiLoopInstance.value = window.bpmnInstances.moddle.create(
        'bpmn:MultiInstanceLoopCharacteristics',
        {
          isSequential: true,
        },
      );
    } else {
      multiLoopInstance.value = window.bpmnInstances.moddle.create(
        'bpmn:MultiInstanceLoopCharacteristics',
      );
    }
    window.bpmnInstances.modeling.updateProperties(toRaw(bpmnElement.value), {
      loopCharacteristics: toRaw(multiLoopInstance.value),
    });
  };

  // 循环基数
  const updateLoopCardinality = (cardinality) => {
    let loopCardinality = null;
    if (cardinality && cardinality.length) {
      loopCardinality = window.bpmnInstances.moddle.create('bpmn:FormalExpression', {
        body: cardinality,
      });
    }
    window.bpmnInstances.modeling.updateModdleProperties(
      toRaw(bpmnElement.value),
      multiLoopInstance.value,
      {
        loopCardinality,
      },
    );
  };
  // 完成条件
  const updateLoopCondition = (condition) => {
    let completionCondition = null;
    if (condition && condition.length) {
      completionCondition = window.bpmnInstances.moddle.create('bpmn:FormalExpression', {
        body: condition,
      });
    }
    window.bpmnInstances.modeling.updateModdleProperties(
      toRaw(bpmnElement.value),
      multiLoopInstance.value,
      {
        completionCondition,
      },
    );
  };
  // 重试周期
  const updateLoopTimeCycle = (timeCycle) => {
    const extensionElements = window.bpmnInstances.moddle.create('bpmn:ExtensionElements', {
      values: [
        window.bpmnInstances.moddle.create('camunda:FailedJobRetryTimeCycle', {
          body: timeCycle.target.value,
        }),
      ],
    });
    window.bpmnInstances.modeling.updateModdleProperties(
      toRaw(bpmnElement.value),
      multiLoopInstance.value,
      {
        extensionElements,
      },
    );
  };
  // 直接更新的基础信息
  const updateLoopBase = () => {
    window.bpmnInstances.modeling.updateModdleProperties(
      toRaw(bpmnElement.value),
      multiLoopInstance.value,
      {
        collection: loopInstanceForm.value.collection || null,
        elementVariable: loopInstanceForm.value.elementVariable || null,
      },
    );
  };
  const exclusive = ref(false);
  // 各异步状态
  const updateLoopAsync = (key) => {
    const { asyncBefore, asyncAfter } = loopInstanceForm.value;
    let asyncAttr = Object.create(null);
    if (!asyncBefore && !asyncAfter) {
      loopInstanceForm.value['exclusive'] = false;
      asyncAttr = {
        asyncBefore: false,
        asyncAfter: false,
        exclusive: false,
        extensionElements: null,
      };
    } else {
      if (key !== 'exclusive') {
        if (asyncBefore || asyncAfter) {
          exclusive.value = true;
        }
      }
      asyncAttr.exclusive = exclusive.value;
      loopInstanceForm.value.exclusive = exclusive.value;
      asyncAttr[key] = loopInstanceForm.value[key];
    }
    window.bpmnInstances.modeling.updateModdleProperties(
      toRaw(bpmnElement.value),
      multiLoopInstance.value,
      asyncAttr,
    );
  };
  onBeforeUnmount(() => {
    multiLoopInstance.value = null;
    bpmnElement.value = null;
  });
</script>
