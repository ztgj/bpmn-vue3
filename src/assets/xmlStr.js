export var xmlStr = `"<?xml version="1.0" encoding="UTF-8"?>
<bpmn:definitions xmlns:bpmn="http://www.omg.org/spec/BPMN/20100524/MODEL" xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI" xmlns:dc="http://www.omg.org/spec/DD/20100524/DC" xmlns:camunda="http://camunda.org/schema/1.0/bpmn" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:di="http://www.omg.org/spec/DD/20100524/DI" xmlns:modeler="http://camunda.org/schema/modeler/1.0" id="Definitions_1kyrvel" targetNamespace="http://bpmn.io/schema/bpmn" exporter="Camunda Modeler" exporterVersion="4.11.0" modeler:executionPlatform="Camunda Platform" modeler:executionPlatformVersion="7.15.0">
  <bpmn:process id="Process_Alarm" name="告警流程" isExecutable="true">
    <bpmn:sequenceFlow id="Flow_1nbytd4" sourceRef="Activity_1cbpdlr" targetRef="Activity_1u1nirs" />
    <bpmn:userTask id="Activity_1cbpdlr" name="运维单位检查" >
      <bpmn:incoming>Flow_0kph1d8</bpmn:incoming>
      <bpmn:outgoing>Flow_1nbytd4</bpmn:outgoing>
    </bpmn:userTask>
    <bpmn:userTask id="Activity_1u1nirs" name="审核" >
      <bpmn:incoming>Flow_1nbytd4</bpmn:incoming>
      <bpmn:outgoing>Flow_1joyasv</bpmn:outgoing>
    </bpmn:userTask>
    <bpmn:exclusiveGateway id="Gateway_0c3a6nv" default="Flow_1wt3a6g">
      <bpmn:incoming>Flow_11m1x6e</bpmn:incoming>
      <bpmn:outgoing>Flow_090p213</bpmn:outgoing>
      <bpmn:outgoing>Flow_0kph1d8</bpmn:outgoing>
      <bpmn:outgoing>Flow_1wt3a6g</bpmn:outgoing>
    </bpmn:exclusiveGateway>
    <bpmn:sequenceFlow id="Flow_090p213" name="轻微" sourceRef="Gateway_0c3a6nv" targetRef="Activity_07sjkyw">
      <bpmn:conditionExpression xsi:type="bpmn:tFormalExpression"></bpmn:conditionExpression>
    </bpmn:sequenceFlow>
    <bpmn:sequenceFlow id="Flow_0kph1d8" name="一般/严重" sourceRef="Gateway_0c3a6nv" targetRef="Activity_1cbpdlr">
      <bpmn:conditionExpression xsi:type="bpmn:tFormalExpression"></bpmn:conditionExpression>
    </bpmn:sequenceFlow>
    <bpmn:sequenceFlow id="Flow_11m1x6e" sourceRef="Event_0z9wxpz" targetRef="Gateway_0c3a6nv" />
    <bpmn:serviceTask id="Activity_0tgb9lh" name="情报中心" camunda:class="com.example.workflow.alarm.intelligenceCenter">
      <bpmn:incoming>Flow_0rvf5vr</bpmn:incoming>
      <bpmn:outgoing>Flow_150wjvv</bpmn:outgoing>
    </bpmn:serviceTask>
    <bpmn:serviceTask id="Activity_07sjkyw" name="短信通知" camunda:class="com.example.workflow.alarm.notice">
      <bpmn:incoming>Flow_090p213</bpmn:incoming>
      <bpmn:outgoing>Flow_0lrxycx</bpmn:outgoing>
    </bpmn:serviceTask>
    <bpmn:exclusiveGateway id="Gateway_1rkuzwd" default="Flow_09vfizs">
      <bpmn:incoming>Flow_1joyasv</bpmn:incoming>
      <bpmn:outgoing>Flow_0rvf5vr</bpmn:outgoing>
      <bpmn:outgoing>Flow_09vfizs</bpmn:outgoing>
    </bpmn:exclusiveGateway>
    <bpmn:sequenceFlow id="Flow_1joyasv" sourceRef="Activity_1u1nirs" targetRef="Gateway_1rkuzwd" />
    <bpmn:sequenceFlow id="Flow_0rvf5vr" name="严重且有效" sourceRef="Gateway_1rkuzwd" targetRef="Activity_0tgb9lh">
      <bpmn:conditionExpression xsi:type="bpmn:tFormalExpression"></bpmn:conditionExpression>
    </bpmn:sequenceFlow>
    <bpmn:sequenceFlow id="Flow_09vfizs" name="一般/严重且无效" sourceRef="Gateway_1rkuzwd" targetRef="Gateway_1e300xn" />
    <bpmn:exclusiveGateway id="Gateway_1e300xn">
      <bpmn:incoming>Flow_09vfizs</bpmn:incoming>
      <bpmn:incoming>Flow_0lrxycx</bpmn:incoming>
      <bpmn:incoming>Flow_1wt3a6g</bpmn:incoming>
      <bpmn:incoming>Flow_1la1lks</bpmn:incoming>
      <bpmn:outgoing>Flow_055icp9</bpmn:outgoing>
    </bpmn:exclusiveGateway>
    <bpmn:sequenceFlow id="Flow_0lrxycx" sourceRef="Activity_07sjkyw" targetRef="Gateway_1e300xn" />
    <bpmn:sequenceFlow id="Flow_1wt3a6g" name="else" sourceRef="Gateway_0c3a6nv" targetRef="Gateway_1e300xn" />
    <bpmn:endEvent id="Event_1gl1zhe" name="告警结束">
      <bpmn:incoming>Flow_055icp9</bpmn:incoming>
    </bpmn:endEvent>
    <bpmn:sequenceFlow id="Flow_055icp9" sourceRef="Gateway_1e300xn" targetRef="Event_1gl1zhe" />
    <bpmn:sequenceFlow id="Flow_150wjvv" sourceRef="Activity_0tgb9lh" targetRef="Activity_0j2j0k2" />
    <bpmn:userTask id="Activity_0j2j0k2" name="是否拉到数据？" camunda:assignee="procedure">
      <bpmn:incoming>Flow_150wjvv</bpmn:incoming>
      <bpmn:outgoing>Flow_1la1lks</bpmn:outgoing>
    </bpmn:userTask>
    <bpmn:sequenceFlow id="Flow_1la1lks" sourceRef="Activity_0j2j0k2" targetRef="Gateway_1e300xn" />
    <bpmn:startEvent id="Event_0z9wxpz" name="告警开始">
      <bpmn:extensionElements>
        <camunda:formData>
          <camunda:formField id="type" label="告警类型" type="long" />
        </camunda:formData>
      </bpmn:extensionElements>
      <bpmn:outgoing>Flow_11m1x6e</bpmn:outgoing>
    </bpmn:startEvent>
  </bpmn:process>
  <bpmndi:BPMNDiagram id="BPMNDiagram_1">
    <bpmndi:BPMNPlane id="BPMNPlane_1" bpmnElement="Process_Alarm">
      <bpmndi:BPMNEdge id="Flow_1la1lks_di" bpmnElement="Flow_1la1lks">
        <di:waypoint x="1100" y="160" />
        <di:waypoint x="1100" y="275" />
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNEdge id="Flow_150wjvv_di" bpmnElement="Flow_150wjvv">
        <di:waypoint x="970" y="120" />
        <di:waypoint x="1050" y="120" />
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNEdge id="Flow_055icp9_di" bpmnElement="Flow_055icp9">
        <di:waypoint x="1125" y="300" />
        <di:waypoint x="1182" y="300" />
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNEdge id="Flow_1wt3a6g_di" bpmnElement="Flow_1wt3a6g">
        <di:waypoint x="310" y="325" />
        <di:waypoint x="310" y="410" />
        <di:waypoint x="1100" y="410" />
        <di:waypoint x="1100" y="330" />
        <bpmndi:BPMNLabel>
          <dc:Bounds x="695" y="392" width="21" height="14" />
        </bpmndi:BPMNLabel>
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNEdge id="Flow_0lrxycx_di" bpmnElement="Flow_0lrxycx">
        <di:waypoint x="610" y="300" />
        <di:waypoint x="1075" y="300" />
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNEdge id="Flow_09vfizs_di" bpmnElement="Flow_09vfizs">
        <di:waypoint x="750" y="145" />
        <di:waypoint x="750" y="300" />
        <di:waypoint x="1075" y="300" />
        <bpmndi:BPMNLabel>
          <dc:Bounds x="669" y="216" width="81" height="14" />
        </bpmndi:BPMNLabel>
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNEdge id="Flow_0rvf5vr_di" bpmnElement="Flow_0rvf5vr">
        <di:waypoint x="775" y="120" />
        <di:waypoint x="870" y="120" />
        <bpmndi:BPMNLabel>
          <dc:Bounds x="799" y="102" width="55" height="14" />
        </bpmndi:BPMNLabel>
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNEdge id="Flow_1joyasv_di" bpmnElement="Flow_1joyasv">
        <di:waypoint x="670" y="120" />
        <di:waypoint x="725" y="120" />
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNEdge id="Flow_11m1x6e_di" bpmnElement="Flow_11m1x6e">
        <di:waypoint x="198" y="300" />
        <di:waypoint x="285" y="300" />
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNEdge id="Flow_0kph1d8_di" bpmnElement="Flow_0kph1d8">
        <di:waypoint x="310" y="275" />
        <di:waypoint x="310" y="120" />
        <di:waypoint x="400" y="120" />
        <bpmndi:BPMNLabel>
          <dc:Bounds x="275" y="189" width="48" height="14" />
        </bpmndi:BPMNLabel>
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNEdge id="Flow_090p213_di" bpmnElement="Flow_090p213">
        <di:waypoint x="335" y="300" />
        <di:waypoint x="510" y="300" />
        <bpmndi:BPMNLabel>
          <dc:Bounds x="364" y="283" width="22" height="14" />
        </bpmndi:BPMNLabel>
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNEdge id="Flow_1nbytd4_di" bpmnElement="Flow_1nbytd4">
        <di:waypoint x="500" y="120" />
        <di:waypoint x="570" y="120" />
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNShape id="Activity_10iruoo_di" bpmnElement="Activity_1cbpdlr">
        <dc:Bounds x="400" y="80" width="100" height="80" />
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="Activity_0vbkabr_di" bpmnElement="Activity_1u1nirs">
        <dc:Bounds x="570" y="80" width="100" height="80" />
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="Gateway_0c3a6nv_di" bpmnElement="Gateway_0c3a6nv" isMarkerVisible="true">
        <dc:Bounds x="285" y="275" width="50" height="50" />
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="Activity_1458gvj_di" bpmnElement="Activity_0tgb9lh">
        <dc:Bounds x="870" y="80" width="100" height="80" />
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="Activity_10j4r0r_di" bpmnElement="Activity_07sjkyw">
        <dc:Bounds x="510" y="260" width="100" height="80" />
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="Gateway_0o8hbfc_di" bpmnElement="Gateway_1rkuzwd" isMarkerVisible="true">
        <dc:Bounds x="725" y="95" width="50" height="50" />
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="Gateway_1e300xn_di" bpmnElement="Gateway_1e300xn" isMarkerVisible="true">
        <dc:Bounds x="1075" y="275" width="50" height="50" />
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="Event_1gl1zhe_di" bpmnElement="Event_1gl1zhe">
        <dc:Bounds x="1182" y="282" width="36" height="36" />
        <bpmndi:BPMNLabel>
          <dc:Bounds x="1178" y="325" width="45" height="14" />
        </bpmndi:BPMNLabel>
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="Activity_1ovg8z4_di" bpmnElement="Activity_0j2j0k2">
        <dc:Bounds x="1050" y="80" width="100" height="80" />
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="Event_1t1u83o_di" bpmnElement="Event_0z9wxpz">
        <dc:Bounds x="162" y="282" width="36" height="36" />
        <bpmndi:BPMNLabel>
          <dc:Bounds x="159" y="325" width="45" height="14" />
        </bpmndi:BPMNLabel>
      </bpmndi:BPMNShape>
    </bpmndi:BPMNPlane>
  </bpmndi:BPMNDiagram>
</bpmn:definitions>
"
`;
