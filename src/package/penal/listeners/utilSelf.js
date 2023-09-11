// 初始化表单数据
export function initListenerForm(listener) {
  let self = {
    ...listener,
  };
  if (listener.script) {
    self = {
      ...listener,
      ...listener.script,
      scriptType: listener.script.resource ? 'externalScript' : 'inlineScript',
    };
  }
  if (listener.event === 'timeout' && listener.eventDefinitions) {
    if (listener.eventDefinitions.length) {
      let k = '';
      for (let key in listener.eventDefinitions[0]) {
        console.log(listener.eventDefinitions, key);
        if (key.indexOf('time') !== -1) {
          k = key;
          self.eventDefinitionType = key.replace('time', '').toLowerCase();
        }
      }
      console.log(k);
      self.eventTimeDefinitions = listener.eventDefinitions[0][k].body;
    }
  }
  return self;
}

export function initListenerType(listener) {
  let listenerType;
  if (listener.class) listenerType = 'classListener';
  if (listener.expression) listenerType = 'expressionListener';
  if (listener.delegateExpression) listenerType = 'delegateExpressionListener';
  if (listener.script) listenerType = 'scriptListener';
  return {
    ...JSON.parse(JSON.stringify(listener)),
    ...(listener.script ?? {}),
    listenerType: listenerType,
  };
}

export const listenerType = {
  classListener: 'Java 类',
  expressionListener: '表达式',
  delegateExpressionListener: '代理表达式',
  scriptListener: '脚本',
};

export const eventType = {
  create: '创建',
  assignment: '指派',
  complete: '完成',
  delete: '删除',
  update: '更新',
  timeout: '超时',
};

export const fieldType = {
  string: '字符串',
  expression: '表达式',
};

export const detailType = {
  class: 'Java 类',
  expression: '表达式',
  delegateExpression: '代理表达式',
  type: '外部',
  connectorListener: '连接器',
};

export const paramType = {
  string: '字符串或表达式',
  script: '脚本',
  list: 'List',
  Map: 'Map',
};
export const initList = (arr) => {
  arr.forEach((item) => {
    if (!item.definition) {
      item.paramType = 'string';
    } else if (item.definition.$type === 'camunda:List') {
      item.paramType = 'list';
      item.list = item.definition.items[0].value;
    } else if (item.definition.$type === 'camunda:Script') {
      item.paramType = 'script';
      item.script = item.definition.value || item.definition.resource;
    } else if (item.definition.$type === 'camunda:Map') {
      item.paramType = 'Map';
      item.value = item.definition.entries[0].value;
      item.key = item.definition.entries[0].key;
    }
  });
  return arr;
};

export const initField = (arr) => {
  arr.forEach((item) => {
    if (Object.keys(item).includes('string')) {
      item.fieldType = 'string';
    } else {
      item.fieldType = 'expression';
    }
  });
  return arr;
};

export const ruleType = {
  class: 'Java 类',
  expression: '表达式',
  delegateExpression: '代理表达式',
  DMN: 'DMN',
  type: '外部',
  connectorListener: '连接器',
};
export const bindType = {
  latest: 'latest',
  deployment: 'deployment',
  version: 'version',
  versionTag: 'versionTag',
};
export const mapType = {
  singleEntry: 'singleEntry (TypedValue)',
  singleResult: 'singleResult (Map<String, Object)',
  collectEntries: 'collectEntries (List<Object>)',
  resultList: 'resultList (List<Map<String, Object)',
};

export const callType = {
  BPMN: 'BPMN',
  CMMN: 'CMMN',
};

export const delegateType = {
  variableMappingClass: 'variableMappingClass',
  variableMappingDelegateExpression: 'variableMappingDelegateExpression',
};
export const cmmnType = {
  latest: 'latest',
  deployment: 'deployment',
  version: 'version',
};

export const variantType = {
  source: 'source',
  SourceExpression: 'SourceExpression',
  all: 'all',
};
