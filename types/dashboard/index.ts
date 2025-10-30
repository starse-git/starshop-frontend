export interface ChartData {
  date: string;
  this_month: number;
  last_month: number;
}

export interface DashboardSummary {
  lastYearAnnualSales: {
    total: number;
    year: number;
  };
  thisMonthSales: {
    total: number;
    month: number;
  };
  productsOnSale: {
    count: number;
  };
  customers: {
    count: number;
  };
  orders: {
    count: number;
  };
}

export interface TopProducts {
  product_id: number;
  product_name: string;
  product_images: string[];
  sale_count: number;
  sale_price: number;
}

