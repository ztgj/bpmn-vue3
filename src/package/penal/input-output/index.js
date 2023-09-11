export const createIO = (form, isInput) => {
  const inputOutput =
    window.bpmnInstances.bpmnElement.businessObject?.extensionElements?.values?.filter(
      (ex) => ex.$type === 'camunda:InputOutput',
    )[0] ??
    window.bpmnInstances.moddle.create('camunda:InputOutput', {
      inputParameters: [],
      outputParameters: [],
    });
  if (isInput) {
    if (form.paramType === 'string') {
      inputOutput.inputParameters.push(
        window.bpmnInstances.moddle.create('camunda:InputParameter', {
          name: form.name,
          value: form.string,
        }),
      );
    } else if (form.paramType === 'script') {
      if (form.scriptType === 'inlineScript') {
        inputOutput.inputParameters.push(
          window.bpmnInstances.moddle.create('camunda:InputParameter', {
            name: form.name,
            definition: window.bpmnInstances.moddle.create('camunda:Script', {
              scriptFormat: form.scriptFormat,
              value: form.script,
            }),
          }),
        );
      } else if (form.scriptType === 'externalScript') {
        inputOutput.inputParameters.push(
          window.bpmnInstances.moddle.create('camunda:InputParameter', {
            name: form.name,
            definition: window.bpmnInstances.moddle.create('camunda:Script', {
              scriptFormat: form.scriptFormat,
              resource: form.script,
            }),
          }),
        );
      }
    } else if (form.paramType === 'list') {
      inputOutput.inputParameters.push(
        window.bpmnInstances.moddle.create('camunda:InputParameter', {
          name: form.name,
          definition: window.bpmnInstances.moddle.create('camunda:List', {
            items: [
              window.bpmnInstances.moddle.create('camunda:Value', {
                value: form.list,
              }),
            ],
          }),
        }),
      );
    } else if (form.paramType === 'Map') {
      inputOutput.inputParameters.push(
        window.bpmnInstances.moddle.create('camunda:InputParameter', {
          name: form.name,
          definition: window.bpmnInstances.moddle.create('camunda:Map', {
            entries: [
              window.bpmnInstances.moddle.create('camunda:Entry', {
                key: form.key,
                value: form.value,
              }),
            ],
          }),
        }),
      );
    }
  } else {
    if (form.paramType === 'string') {
      inputOutput.outputParameters.push(
        window.bpmnInstances.moddle.create('camunda:OutputParameter', {
          name: form.name,
          value: form.string,
        }),
      );
    } else if (form.paramType === 'script') {
      if (form.scriptType === 'inlineScript') {
        inputOutput.outputParameters.push(
          window.bpmnInstances.moddle.create('camunda:OutputParameter', {
            name: form.name,
            definition: window.bpmnInstances.moddle.create('camunda:Script', {
              scriptFormat: form.scriptFormat,
              value: form.script,
            }),
          }),
        );
      } else if (form.scriptType === 'externalScript') {
        inputOutput.outputParameters.push(
          window.bpmnInstances.moddle.create('camunda:OutputParameter', {
            name: form.name,
            definition: window.bpmnInstances.moddle.create('camunda:Script', {
              scriptFormat: form.scriptFormat,
              resource: form.script,
            }),
          }),
        );
      }
    } else if (form.paramType === 'list') {
      inputOutput.outputParameters.push(
        window.bpmnInstances.moddle.create('camunda:OutputParameter', {
          name: form.name,
          definition: window.bpmnInstances.moddle.create('camunda:List', {
            items: [
              window.bpmnInstances.moddle.create('camunda:Value', {
                value: form.list,
              }),
            ],
          }),
        }),
      );
    } else if (form.paramType === 'Map') {
      inputOutput.outputParameters.push(
        window.bpmnInstances.moddle.create('camunda:OutputParameter', {
          name: form.name,
          definition: window.bpmnInstances.moddle.create('camunda:Map', {
            entries: [
              window.bpmnInstances.moddle.create('camunda:Entry', {
                key: form.key,
                value: form.value,
              }),
            ],
          }),
        }),
      );
    }
  }
  return inputOutput;
};

export const updateIO = (index, isInput, isAdd, value) => {
  // data.splice(index, 1);
  const inputOutput =
    window.bpmnInstances.bpmnElement.businessObject?.extensionElements?.values?.filter(
      (ex) => ex.$type === 'camunda:InputOutput',
    )[0] ??
    window.bpmnInstances.moddle.create('camunda:InputOutput', {
      inputParameters: [],
      outputParameters: [],
    });
  if (isAdd) {
    isInput
      ? inputOutput.inputParameters.splice(index, 1)
      : inputOutput.outputParameters.splice(index, 1);
  } else {
    isInput
      ? inputOutput.inputParameters.splice(index, 1, updateType(isInput, value.paramType, value))
      : inputOutput.outputParameters.splice(index, 1, updateType(isInput, value.paramType, value));
  }
  return inputOutput;
};

export const updateType = (isInput, type, value) => {
  let model = '';
  if (isInput) {
    if (type === 'string') {
      model = window.bpmnInstances.moddle.create('camunda:InputParameter', {
        name: value.name,
        value: value.value,
      });
    } else if (type === 'script') {
      if (value.scriptType === 'inlineScript') {
        model = window.bpmnInstances.moddle.create('camunda:InputParameter', {
          name: value.name,
          definition: window.bpmnInstances.moddle.create('camunda:Script', {
            scriptFormat: value.scriptFormat,
            value: value.script,
          }),
        });
      } else if (value.scriptType === 'externalScript') {
        model = window.bpmnInstances.moddle.create('camunda:InputParameter', {
          name: value.name,
          definition: window.bpmnInstances.moddle.create('camunda:Script', {
            scriptFormat: value.scriptFormat,
            resource: value.script,
          }),
        });
      }
    } else if (type === 'list') {
      model = window.bpmnInstances.moddle.create('camunda:InputParameter', {
        name: value.name,
        definition: window.bpmnInstances.moddle.create('camunda:List', {
          items: [
            window.bpmnInstances.moddle.create('camunda:Value', {
              value: value.list,
            }),
          ],
        }),
      });
    } else if (type === 'Map') {
      model = window.bpmnInstances.moddle.create('camunda:InputParameter', {
        name: value.name,
        definition: window.bpmnInstances.moddle.create('camunda:Map', {
          entries: [
            window.bpmnInstances.moddle.create('camunda:Entry', {
              key: value.key,
              value: value.value,
            }),
          ],
        }),
      });
    }
  } else {
    if (type === 'string') {
      model = window.bpmnInstances.moddle.create('camunda:OutputParameter', {
        name: value.name,
        value: value.string,
      });
    } else if (type === 'script') {
      if (value.scriptType === 'inlineScript') {
        model = window.bpmnInstances.moddle.create('camunda:OutputParameter', {
          name: value.name,
          definition: window.bpmnInstances.moddle.create('camunda:Script', {
            scriptFormat: value.scriptFormat,
            value: value.script,
          }),
        });
      } else if (value.scriptType === 'externalScript') {
        model = window.bpmnInstances.moddle.create('camunda:OutputParameter', {
          name: value.name,
          definition: window.bpmnInstances.moddle.create('camunda:Script', {
            scriptFormat: value.scriptFormat,
            resource: value.script,
          }),
        });
      }
    } else if (type === 'list') {
      model = window.bpmnInstances.moddle.create('camunda:OutputParameter', {
        name: value.name,
        definition: window.bpmnInstances.moddle.create('camunda:List', {
          items: [
            window.bpmnInstances.moddle.create('camunda:Value', {
              value: value.list,
            }),
          ],
        }),
      });
    } else if (type === 'Map') {
      model = window.bpmnInstances.moddle.create('camunda:OutputParameter', {
        name: value.name,
        definition: window.bpmnInstances.moddle.create('camunda:Map', {
          entries: [
            window.bpmnInstances.moddle.create('camunda:Entry', {
              key: value.key,
              value: value.value,
            }),
          ],
        }),
      });
    }
  }
  return model;
};
export const changeType = (value) => {
  if (value.paramType === 'string') {
    value.string = value.value;
    return value;
  } else if (value.paramType === 'script') {
    value.scriptFormat = value.definition.scriptFormat;
    if (Object.prototype.hasOwnProperty.call(value.definition, 'value')) {
      value.scriptType = 'inlineScript';
    } else {
      value.scriptType = 'externalScript';
    }
    return value;
  } else return value;
};
