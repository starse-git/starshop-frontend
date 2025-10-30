import * as React from "react";
import { Line, LineChart, CartesianGrid, XAxis, YAxis } from "recharts";
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { ChartData } from "@/types/dashboard";
import { convertToYen } from "@/utils";

const Params = [
  {
    name: "chartData",
    type: "array",
  },
];

interface ChartComponentParams {
  chartData: ChartData[];
}

const chartConfig = {
  thisMonth: {
    label: "今月",
    color: "hsl(var(--chart-1))",
  },
  lastMonth: {
    label: "先月",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig;

const ChartComponent = ({ chartData }: ChartComponentParams) => {
  return (
    <ChartContainer className="h-[400px] w-full" config={chartConfig}>
      <LineChart
        accessibilityLayer
        data={chartData.map((item) => ({
          date: item.date,
          thisMonth: item.this_month,
          lastMonth: item.last_month,
        }))}
        margin={{
          left: 20,
          right: 20,
        }}
      >
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="date"
          tickLine={true}
          axisLine={true}
          tickMargin={10}
          tickFormatter={(value) => {
            const date = new Date(value);
            return `${date.getMonth() + 1}/${date.getDate()}`;
          }}
        />
        <YAxis
          tickLine={true}
          axisLine={true}
          tickMargin={10}
          tickFormatter={(value) => `${convertToYen(value as number)}`}
        />
        <ChartTooltip
          cursor={false}
          content={
            <ChartTooltipContent className="bg-white border-[1px] border-white-bg" />
          }
          // formatter={(value) => `${convertToYen(value as number)}`}
        />
        <Line
          dataKey="thisMonth"
          type="monotone"
          stroke="var(--color-secondary)"
          strokeWidth={2}
          dot={true}
        />
        <Line
          dataKey="lastMonth"
          type="monotone"
          stroke="var(--color-primary)"
          strokeWidth={2}
          dot={true}
        />
        <ChartLegend content={<ChartLegendContent />} />
      </LineChart>
    </ChartContainer>
  );
};

ChartComponent.Params = Params;

export default ChartComponent;
