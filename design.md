# Part 1: Design

## Top 7 Metrics

1. **Total Calls**  
   Total number of conversations in the selected period.

2. **Call Success Rate**  
   Percentage of calls whose `status === 'success'`.

3. **Average Call Duration**  
   Mean call duration (in seconds) across all completed calls.

4. **Cost per Minute**  
   Total `cost` divided by total call minutes (`duration / 60`).

5. **Average LLM Latency**  
   Mean of `callInfo.stats.llmLatency` (in milliseconds).

6. **Average TTS Latency**  
   Mean of `callInfo.stats.ttsLatency` (in milliseconds).

7. **Interruptions per Minute**  
   Total `callInfo.stats.interruptions` divided by total call minutes.

---

## Filters

- **Date Range**: “From” and “To” on `startTime`.  
- **Agent**: Multi-select of `agent` names.  
- **Status**: Multi-select of `status` values (`busy`, `success`, `transfer`, `no_answer`, `dropped`).  
- *(Optional extensions)*:  
  - Call type (inbound/outbound)  
  - Duration range slider  
  - Cost range slider  
  - Latency thresholds

---

## Visualization Plan

| Metric                    | Component            |
|---------------------------|----------------------|
| Total Calls               | KPI card             |
| Call Success Rate         | KPI card (percentage)|
| Average Call Duration     | KPI card             |
| Cost per Minute           | KPI card             |
| Average LLM Latency       | KPI card             |
| Average TTS Latency       | KPI card             |
| Interruptions per Minute  | KPI card             |
| Status Distribution       | Pie chart            |
| Cost per Minute by Agent  | Bar chart            |

- **KPI Cards**—display each metric prominently in a responsive grid.  
- **Pie Chart**—visualize status distribution with a legend showing counts.  
- **Bar Chart**—show cost per minute segmented by agent, with rotated X-axis labels for readability.

---

