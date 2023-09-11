export const createTask = (inputList, outputList, connectorId) => {
  const inputOutput = window.bpmnInstances.moddle.create('camunda:InputOutput', {
    inputParameters: [],
    outputParameters: [],
  });
  if (inputList) {
    inputList.forEach((item) => {
      if (item.paramType === 'string') {
        inputOutput.inputParameters.push(
          window.bpmnInstances.moddle.create('camunda:InputParameter', {
            name: item.name,
            value: item.string,
          }),
        );
      } else if (item.paramType === 'script') {
        if (item.scriptType === 'inlineScript' || item.definition?.$type === 'camunda:Script') {
          inputOutput.inputParameters.push(
            window.bpmnInstances.moddle.create('camunda:InputParameter', {
              name: item.name,
              definition: window.bpmnInstances.moddle.create('camunda:Script', {
                scriptFormat: item.scriptFormat,
                value: item.script,
              }),
            }),
          );
        } else if (
          item.scriptType === 'externalScript' ||
          item.definition?.type === 'camunda:Script'
        ) {
          inputOutput.inputParameters.push(
            window.bpmnInstances.moddle.create('camunda:InputParameter', {
              name: item.name,
              definition: window.bpmnInstances.moddle.create('camunda:Script', {
                scriptFormat: item.scriptFormat,
                resource: item.script,
              }),
            }),
          );
        }
      } else if (item.paramType === 'list') {
        inputOutput.inputParameters.push(
          window.bpmnInstances.moddle.create('camunda:InputParameter', {
            name: item.name,
            definition: window.bpmnInstances.moddle.create('camunda:List', {
              items: [
                window.bpmnInstances.moddle.create('camunda:Value', {
                  value: item.list,
                }),
              ],
            }),
          }),
        );
      } else if (item.paramType === 'Map') {
        inputOutput.inputParameters.push(
          window.bpmnInstances.moddle.create('camunda:InputParameter', {
            name: item.name,
            definition: window.bpmnInstances.moddle.create('camunda:Map', {
              entries: [
                window.bpmnInstances.moddle.create('camunda:Entry', {
                  key: item.key,
                  value: item.value,
                }),
              ],
            }),
          }),
        );
      }
    });
  }
  if (outputList) {
    outputList.forEach((item) => {
      if (item.paramType === 'string') {
        inputOutput.outputParameters.push(
          window.bpmnInstances.moddle.create('camunda:OutputParameter', {
            name: item.name,
            value: item.string,
          }),
        );
      } else if (item.paramType === 'script') {
        if (item.scriptType === 'inlineScript') {
          inputOutput.outputParameters.push(
            window.bpmnInstances.moddle.create('camunda:OutputParameter', {
              name: item.name,
              definition: window.bpmnInstances.moddle.create('camunda:Script', {
                scriptFormat: item.scriptFormat,
                value: item.script,
              }),
            }),
          );
        } else if (item.scriptType === 'externalScript') {
          inputOutput.outputParameters.push(
            window.bpmnInstances.moddle.create('camunda:OutputParameter', {
              name: item.name,
              definition: window.bpmnInstances.moddle.create('camunda:Script', {
                scriptFormat: item.scriptFormat,
                resource: item.script,
              }),
            }),
          );
        }
      } else if (item.paramType === 'list') {
        inputOutput.outputParameters.push(
          window.bpmnInstances.moddle.create('camunda:OutputParameter', {
            name: item.name,
            definition: window.bpmnInstances.moddle.create('camunda:List', {
              items: [
                window.bpmnInstances.moddle.create('camunda:Value', {
                  value: item.list,
                }),
              ],
            }),
          }),
        );
      } else if (item.paramType === 'Map') {
        inputOutput.outputParameters.push(
          window.bpmnInstances.moddle.create('camunda:OutputParameter', {
            name: item.name,
            definition: window.bpmnInstances.moddle.create('camunda:Map', {
              entries: [
                window.bpmnInstances.moddle.create('camunda:Entry', {
                  key: item.key,
                  value: item.value,
                }),
              ],
            }),
          }),
        );
      }
    });
  }
  let Connector =
    window.bpmnInstances.bpmnElement.businessObject?.extensionElements?.values?.filter(
      (ex) => ex.$type === 'camunda:Connector',
    )[0];
  Connector = window.bpmnInstances.moddle.create('camunda:Connector', {
    connectorId: connectorId,
    inputOutput: inputOutput,
  });
  return Connector;
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
