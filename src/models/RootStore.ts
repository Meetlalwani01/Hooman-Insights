// src/models/RootStore.ts
import { types, flow } from 'mobx-state-tree';
import { Conversation } from './Conversation';

export const RootStore = types
  .model('RootStore', {
    conversations: types.array(Conversation),
    dateFrom: types.maybe(types.Date),
    dateTo: types.maybe(types.Date),
    selectedAgents: types.array(types.string),
    statuses: types.array(types.string),
    types: types.array(types.string),
    durationRange: types.array(types.number), // [min, max]
    costRange: types.array(types.number),     // [min, max]
  })
  .actions((self) => ({
    loadConversations: flow(function* () {
      try {
        const res = yield fetch('/api/conversations');
        const data = yield res.json();
        self.conversations = data;
      } catch (err) {
        console.error('Failed to load conversations', err);
      }
    }),
    setDateFrom(date: Date | undefined) { self.dateFrom = date; },
    setDateTo(date: Date | undefined)   { self.dateTo = date; },
    setSelectedAgents(list: string[])    { self.selectedAgents = list; },
    setStatuses(list: string[])          { self.statuses = list; },
    setTypes(list: string[])             { self.types = list; },
    setDurationRange(range: number[])    { self.durationRange = range; },
    setCostRange(range: number[])        { self.costRange = range; },
  }))
  .views((self) => ({
    get filtered() {
      return self.conversations.filter((c) => {
        if (self.dateFrom && c.startTime < self.dateFrom.getTime()) return false;
        if (self.dateTo   && c.startTime > self.dateTo.getTime())   return false;
        if (self.selectedAgents.length > 0 && !self.selectedAgents.includes(c.agent)) return false;
        if (self.statuses.length > 0 && !self.statuses.includes(c.status))          return false;
        return true;
      });
    },
    get totalCalls() {
      return this.filtered.length;
    },
    get successRate() {
      const total = this.filtered.length;
      const ok    = this.filtered.filter(c => c.status === 'success').length;
      return total ? ok / total : 0;
    },
    get avgDuration() {
      const durs = this.filtered.map(c => c.duration).filter(d => d > 0);
      const sum  = durs.reduce((a, b) => a + b, 0);
      return durs.length ? sum / durs.length : 0;
    },
    get costPerMinute() {
      const calls     = this.filtered.filter(c => c.duration > 0);
      const totalCost = calls.reduce((sum, c) => sum + c.cost, 0);
      const totalMin  = calls.reduce((sum, c) => sum + c.duration / 60, 0);
      return totalMin ? totalCost / totalMin : 0;
    },
    get avgLlmLatency() {
      const lat = this.filtered
        .map(c => c.callInfo.stats?.llmLatency)
        .filter((v): v is number => typeof v === 'number');
      return lat.length ? lat.reduce((a, b) => a + b, 0) / lat.length : 0;
    },
    get avgTtsLatency() {
      const lat = this.filtered
        .map(c => c.callInfo.stats?.ttsLatency)
        .filter((v): v is number => typeof v === 'number');
      return lat.length ? lat.reduce((a, b) => a + b, 0) / lat.length : 0;
    },
    get interruptionRate() {
      const totalInts = this.filtered
        .map(c => c.callInfo.stats?.interruptions || 0)
        .reduce((a, b) => a + b, 0);
      const totalMin = this.filtered
        .map(c => c.duration / 60)
        .reduce((a, b) => a + b, 0);
      return totalMin ? totalInts / totalMin : 0;
    },
    get statusDistribution() {
      const dist: Record<string, number> = {};
      this.filtered.forEach(c => {
        dist[c.status] = (dist[c.status] || 0) + 1;
      });
      return dist;
    },
  }));
