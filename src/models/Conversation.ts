// src/models/Conversation.ts
import { types } from 'mobx-state-tree';

export const Stats = types.model('Stats', {
  llmLatency: types.number,      // ms
  ttsLatency: types.number,      // ms
  interruptions: types.number,    // count
});

export const CallInfo = types.model('CallInfo', {
  caller: types.string,
  callee: types.string,
  type: types.enumeration('CallType', ['inbound', 'outbound']),
  stats: types.maybe(Stats),
});

export const Conversation = types.model('Conversation', {
  id: types.identifier,
  agent: types.string,
  startTime: types.number,  // Unix ms
  duration: types.number,   // seconds
  cost: types.number,       // currency units
  status: types.enumeration('CallStatus', [
    'busy',
    'success',
    'transfer',
    'no_answer',
    'dropped',
  ]),
  callInfo: CallInfo,
});
