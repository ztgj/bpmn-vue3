<template>
  <div class="panel-tab__content">
    <a-form :label-col="{ span: 6 }">
      <component :is="witchTaskComponent" />
    </a-form>
  </div>
</template>

<script setup>
  import UserTask from './task-components/UserTask.vue';
  import ScriptTask from './task-components/ScriptTask.vue';
  import ReceiveTask from './task-components/ReceiveTask.vue';
  import SendTask from './task-components/SendTask.vue';
  import BusinessRuleTask from './task-components/BusinessRuleTask.vue';
  import CallActivityTask from './task-components/CallActivityTask.vue';
  import { watch, reactive, shallowRef } from 'vue';

  const props = defineProps({
    type: String,
  });

  const witchTaskComponent = shallowRef(UserTask);
  const installedComponent = reactive({
    UserTask: shallowRef(UserTask),

    ScriptTask: shallowRef(ScriptTask),

    ReceiveTask: shallowRef(ReceiveTask),
    SendTask: shallowRef(SendTask),
    BusinessRuleTask: shallowRef(BusinessRuleTask),
    CallActivity: shallowRef(CallActivityTask),
  });
  watch(
    () => props.type,
    () => {
      console.log(props.type);
      witchTaskComponent.value = installedComponent[props.type];
      if (props.type === 'ServiceTask') {
        witchTaskComponent.value = installedComponent.SendTask;
      }
    },
    {
      deep: true,
      immediate: true,
    },
  );
</script>
