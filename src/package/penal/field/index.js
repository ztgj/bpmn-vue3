export const createFiled = (form) => {
  const fielfList =
    window.bpmnInstances.bpmnElement.businessObject?.extensionElements?.values ?? [];
  if (form.fieldType === 'string') {
    fielfList.push(
      window.bpmnInstances.moddle.create('camunda:Field', {
        name: form.name,
        string: form.string,
      }),
    );
  } else if (form.fieldType === 'expression') {
    fielfList.push(
      window.bpmnInstances.moddle.create('camunda:Field', {
        name: form.name,
        expression: form.expression,
      }),
    );
  }
  return fielfList;
};

export const updateFiled = (index, form, isDel) => {
  const fielfList =
    window.bpmnInstances.bpmnElement.businessObject?.extensionElements?.values.filter(
      (ex) => ex.$type === 'camunda:Field',
    ) ?? [];
  if (isDel) {
    fielfList.splice(index, 1);
  } else {
    fielfList.splice(index, 1, changeType(form.fieldType, form));
  }
  return fielfList;
};

export const changeType = (type, value) => {
  let model = '';
  if (type === 'string') {
    model = window.bpmnInstances.moddle.create('camunda:Field', {
      name: value.name,
      string: value.string,
    });
  } else {
    model = window.bpmnInstances.moddle.create('camunda:Field', {
      name: value.name,
      expression: value.expression,
    });
  }
  return model;
};
