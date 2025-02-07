import GanttChart from "@/core/gantt.chart";
import { describe, it } from "vitest";

describe("시트 생성 테스트", () => {
  it("시트 생성", () => {
    const gantt = new GanttChart();
    gantt.setup();

    gantt.storageManager.addSheet({
      id: 1,
      name: "test",
      content: { head: [], body: [] },
    });
  });
});
