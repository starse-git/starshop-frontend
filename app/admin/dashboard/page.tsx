"use client";

import AdminBadgeComponent from "@/components/admin/AdminBadgeComponent";
import ChartComponent from "@/components/admin/ChartComponent";
import DashboardCardComponent from "@/components/admin/DashboardCardComponent";
import DateRangePickerComponent from "@/components/admin/DateRangePickerComponent";
import ImageCardComponent from "@/components/admin/ImageCardComponent";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableHeader,
} from "@/components/ui/table";
import {
  useChartData,
  useDashboardSummary,
  useTopProducts,
} from "@/hooks/admin/useDashboard";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useGetOrderSummaries } from "@/hooks/admin/useOrder";
import {
  convertToLocaleDateTime,
  convertToYen,
  encryptString,
  getProfileImage,
  getPublicUrl,
} from "@/utils";
import { useRouter } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";
import BarComparisonChartComponent from "@/components/admin/BarComparisonChartComponent";
import { OrderItem, OrderSummaryDetails } from "@/types/orders";
import defaultImage from "@/public/profile/profileDummy.jpg";
import ImageRoundComponent from "@/components/admin/ImageRoundComponent";

const DashboardPage = () => {
  const router = useRouter(); // router
  const today = new Date(); // today
  const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1); // first day of month

  const [dateRange, setDateRange] = useState({
    from: firstDayOfMonth,
    to: today,
  }); // date range

  const [popularDateRange, setPopularDateRange] = useState({
    from: firstDayOfMonth,
    to: today,
  }); // popular date range

  const { data: chartData } = useChartData({
    fromDate: dateRange.from.toLocaleDateString("sv-SE"),
    toDate: dateRange.to.toLocaleDateString("sv-SE"),
  }); // chart data

  const {
    data: dashboardSummary,
    error: dashboardSummaryError,
    isError: dashboardSummaryIsError,
  } = useDashboardSummary(); // dashboard summary

  const {
    data: orderSummaries,
    error: orderSummariesError,
    isError: orderSummariesIsError,
    isLoading: orderSummariesLoading,
  } = useGetOrderSummaries(); // order summaries

  const {
    data: topProducts,
    error: topProductsError,
    isError: topProductsIsError,
  } = useTopProducts({
    fromDate: popularDateRange.from.toLocaleDateString("sv-SE"),
    toDate: popularDateRange.to.toLocaleDateString("sv-SE"),
  }); // top products

  useEffect(() => {
    if (dashboardSummaryError && dashboardSummaryIsError) {
      toast.error(dashboardSummaryError?.message);
    }

    if (orderSummariesError && orderSummariesIsError) {
      toast.error(orderSummariesError?.message);
    }

    if (topProductsError && topProductsIsError) {
      toast.error(topProductsError?.message);
    }
  }, [  // error handling
    dashboardSummaryError,
    dashboardSummaryIsError,
    orderSummariesError,
    orderSummariesIsError,
    topProductsError,
    topProductsIsError,
  ]);

  return (
    <section className="w-full">
      {/* 売上 Cards */}
      <div className="grid grid-cols-2 md:flex md:flex-wrap gap-5 justify-between">
        <DashboardCardComponent
          value={dashboardSummary?.data?.thisMonthSales?.total ?? 0}
          description="今月売上"
          isCurrency
        />
        <DashboardCardComponent
          value={dashboardSummary?.data?.lastYearAnnualSales?.total ?? 0}
          description="年間売上"
          isCurrency
        />
        <DashboardCardComponent
          value={dashboardSummary?.data?.productsOnSale?.count ?? 0}
          description="販売中の商品"
        />
        <DashboardCardComponent
          value={dashboardSummary?.data?.customers?.count ?? 0}
          description="お客様数"
        />
        <DashboardCardComponent
          value={dashboardSummary?.data?.orders?.count ?? 0}
          description="注文数"
        />
      </div>

      {/* 売上Chart */}
      <div className="mt-10 w-full px-4 py-6 md:px-10 md:py-12 space-y-6 border-[0px] rounded-[10px] shadow-[0_0_15px_0_rgba(0,0,0,0.1)] card-border">
        <div className="flex flex-wrap justify-between mb-10 gap-3">
          <div className="text-left">
            <h2>売上</h2>
          </div>
          <div className="justify-items-end">
            <DateRangePickerComponent
              defaultFrom={firstDayOfMonth}
              defaultTo={today}
              onChange={(from, to) => setDateRange({ from, to })}
            />
          </div>
        </div>
        <ChartComponent chartData={chartData?.data ?? []} />
      </div>

      {/* 最近の注文 */}
      <div className="mt-10 w-full px-4 py-6 md:px-10 md:py-12 space-y-6 border-[0px] rounded-[10px] shadow-[0_0_15px_0_rgba(0,0,0,0.1)] card-border">
        <div className="flex justify-between mb-5">
          <div className="grid flex-1 gap-1 text-left">
            <h2>直近の注文</h2>
          </div>
        </div>
        <div className="rounded-[10px] overflow-hidden border border-black/10">
          <Table className="">
            <TableHeader>
              <TableRow className="border-b border-black/10">
                <TableHead className="w-[100px] py-4 px-4 font-bold">注文内容</TableHead>
                <TableHead className="py-4 font-bold">注文日時</TableHead>
                <TableHead className="py-4 font-bold">お客様</TableHead>
                <TableHead className="text-center py-4 font-bold">状況</TableHead>
                <TableHead className="text-right py-4 font-bold">送料</TableHead>
                <TableHead className="text-right py-4 px-4 font-bold">合計金額</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orderSummaries &&
                orderSummaries?.data?.data?.length > 0 &&
                orderSummaries?.data?.data?.map(
                  (order: OrderSummaryDetails) => (
                    <TableRow
                      className="border-b border-black/10 hover:bg-black/2 cursor-pointer"
                      key={order.order_id}
                      onClick={() =>
                        router.push(
                          `/admin/orders/${encryptString(
                            order.order_id.toString()
                          )}`
                        )
                      }
                    >
                      <TableCell className="py-4 px-4">
                        {order.order_items.map(
                          (item: OrderItem, index: number) => (
                            <div
                              className={`flex items-center gap-1 ${order.order_items.length > 1 &&
                                index !== order.order_items.length - 1
                                ? "mb-2"
                                : ""
                                }`}
                              key={item.product_id}
                            >
                              <ImageCardComponent
                                imgURL={getPublicUrl(item.product_images[0])}
                                imgName="product1"
                              />
                              <div className="flex-col pl-2">
                                <p className="truncate w-[200px]">
                                  {item.product_name}
                                </p>
                                <p>
                                  {convertToYen(Math.floor(item.sale_price + (item.sale_price * item.tax / 100)))} *{" "}
                                  {item.product_quantity}
                                </p>
                              </div>
                            </div>
                          )
                        )}
                      </TableCell>
                      <TableCell className="py-4">
                        {convertToLocaleDateTime(order.order_date, "Asia/Tokyo")}
                      </TableCell>
                      <TableCell className="py-4 ">
                        <div className="flex items-center gap-2">
                          <ImageRoundComponent
                            imgURL={
                              order.customer_photo ? getProfileImage(order.customer_photo) : defaultImage.src
                            }
                            className="w-[50px] h-[50px]"
                            imgName="customer1"
                          />
                          {order.customer_name}
                        </div>
                      </TableCell>
                      <TableCell className="text-center py-4">
                        <AdminBadgeComponent
                          label={order.order_status}
                          isLink={false}
                        />
                      </TableCell>
                      <TableCell className="text-right">
                        {convertToYen(order.shipping_cost)}
                      </TableCell>
                      <TableCell className="text-right px-4">
                        {convertToYen(order.order_total)}
                      </TableCell>
                    </TableRow>
                  )
                )}
              {orderSummariesLoading && (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center">
                    <Skeleton className="w-full h-full bg-black/10" />
                  </TableCell>
                </TableRow>
              )}
              {orderSummaries && orderSummaries?.data?.data?.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center">
                    <p className="text-center">注文履歴がありません</p>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* 商品販売レポート */}
      <div className="mt-10 w-full px-4 py-6 md:px-10 md:py-12 space-y-6 border-[0px] rounded-[10px] shadow-[0_0_15px_0_rgba(0,0,0,0.1)] card-border">
        <div className="flex flex-wrap justify-between mb-10 gap-3">
          <div className="text-left">
            <h2>商品販売レポート</h2>
          </div>
          <div className="justify-items-end">
            <DateRangePickerComponent
              defaultFrom={popularDateRange.from}
              defaultTo={popularDateRange.to}
              onChange={(from, to) => setPopularDateRange({ from, to })}
            />
          </div>
        </div>
        {topProducts && topProducts?.data?.length > 0 && (
          <BarComparisonChartComponent salesData={topProducts?.data ?? []} />
        )}
        {topProducts && topProducts?.data?.length === 0 && (
          <p className="text-center">商品販売レポートがありません</p>
        )}
      </div>
    </section>
  );
};

export default DashboardPage;
