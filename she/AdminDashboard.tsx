import { ReactNode, useEffect, useState } from "react";
import StatCard from "../components/cards/stat-card/StatCard";
import { ProductOutlined, ShopOutlined } from "@ant-design/icons";
//import { useOrderList } from "../api/order";
// import { useOffTakersList } from '../api/offTaker';
// import { useCustomerList } from '../api/customer';
// import { useContractList } from '../api/contract';
// import OffTakersTable from '../components/tables/OffTakersTable';
// import ContractsTable from '../components/tables/ContractsTable';
// import CustomersTable from '../components/tables/CustomersTable';
import TableAction from "../components/TableAction";
import WithAuth from "../hoc/WithAuth";
import { useAdminDashboard } from "../api/admin";
import OffTakersTable from "../components/tables/OffTakersTable";
import OrdersTable from "../components/tables/order/OrdersTable";
import ContractsTable from "../components/tables/ContractsTable";
import CustomersTable from "../components/tables/CustomersTable";
import { AuthContextValue, useAuth } from "../providers/AuthProvider";
import { useNavigate } from "react-router-dom";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  ComposedChart,
  Area,
  AreaChart,
} from "recharts";
import { Select } from "antd";
import Card from "antd/es/card/Card";
import { useGetOffTakerDashboardValues, useOrderList } from "../api/order";
import { useOffTakersList } from "../api/offTaker";
import { useCustomerList } from "../api/customer";
import { useContractList } from "../api/contract";
import LoadingScreen from "../components/LoadingScreen";
import { useGetVouchers } from "../api/voucher";
const { Option } = Select;
    interface Order {
  id: number;
  orgName: string;
  product: string;
  orderAmount: number;
  dueDate: string;
  startingDate: string;
  tags: string;
  status:
    | "ACCEPTED"
    | "DELIVERED"
    | "INPROGRESS"
    | "PENDING"
    | "REJECTED"
    | "COMPLETED";
  createdDate: string;
}
function AdminDashboard() {
   const { data: orders, isLoading } = useOrderList();
    const { data: dashboardValues } = useGetOffTakerDashboardValues();
     const { data: vouchers, isLoading: vouchersLoading } = useGetVouchers();
  const { user } = useAuth() as AuthContextValue;
  const [tableIndex, setTableIndex] = useState<number>(0);
    const ordersArray = Array.isArray(orders?.data)
    ? (orders?.data as any[])
    : [];
  const [searchText, setSearchText] = useState<string>("");
  const navigate = useNavigate();
    const { data: offTakers, isLoading: loadingOffTakers } = useOffTakersList();
//  const { data: orders, isLoading: loadingOrders } = useOrderList();
  //const { data: customers, isLoading: loadingCustomers } = useCustomerList();
  //const { data: contracts, isLoading: loadingContracts } = useContractList();
//  const { data: dashboardValues, isLoading: offTakersIsLoading } =useAdminDashboard();
    
  console.log("Dashboard Values:", dashboardValues);
const [selectedStatus, setSelectedStatus] = useState<
    | "ACCEPTED"
    | "DELIVERED"
    | "INPROGRESS"
    | "PENDING"
    | "REJECTED"
    | "COMPLETED"
    | "All"
    | undefined
  >("All");
  const [selectedOrgName, setSelectedOrgName] = useState<string | "All">("All");
  const [selectedProduct, setSelectedProduct] = useState<string | "All">("All");
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
 const [voucherChartData, setVoucherChartData] = useState<any[]>([]);
 

   useEffect(() => {
    if (vouchers) {
      // Safely access voucher data with proper fallbacks
      const voucherData = Array.isArray(vouchers.data) 
        ? vouchers.data 
        : vouchers.data?.data || [];
      
      // Create data for the chart showing counts of issued vs redeemed
      const issuedCount = voucherData.filter((v: { voucherStatus: undefined; }) => v.voucherStatus !== undefined).length;
      const redeemedCount = voucherData.filter((v: { voucherStatus: number; }) => v.voucherStatus === 3).length;
      
      // Create chart data with the correct structure for the existing chart
      const chartData = [
        { name: "Vouchers", issued: issuedCount, redeemed: redeemedCount },
      ];
      
      setVoucherChartData(chartData);
    }
  }, [vouchers]);
// Define the Order interface
 if (isLoading)
    return (
      <div>
        <LoadingScreen />
      </div>
    );
  if (ordersArray && ordersArray.length === 0)
    return <div>No order data available</div>;
 const uniqueStatuses = [
    "All" as const,
    ...Array.from(new Set(ordersArray.map((o) => o.status))),
  ];
  const uniqueOrgNames = [
    "All" as const,
    ...Array.from(new Set(ordersArray.map((o) => o.orgName))),
  ];
  const uniqueProducts = [
    "All" as const,
    ...Array.from(new Set(ordersArray.map((o) => o.product))),
  ];
 const filteredOrders = ordersArray?.filter(
    (o) =>
      (selectedStatus === "All" || o.status === selectedStatus) &&
      (selectedProduct === "All" || o.product === selectedProduct) &&
      (!selectedDate || o.createdDate === selectedDate),
  );
const topOrders = filteredOrders.slice(0, 20);

  const composedData = topOrders.map((o) => ({
    name: o.id.toString(),
    orderAmount: o.orderAmount,
    cumulativeAmount: topOrders
      .slice(0, topOrders.indexOf(o) + 1)
      .reduce((sum, order) => sum + order.orderAmount, 0),
  }));
   
   

  const statusDistribution = topOrders.reduce(
    (acc, o) => {acc[o.status] = (acc[o.status] || 0) + o.orderAmount;
      return acc;
    },
    {
      ACCEPTED: 0,
      DELIVERED: 0,
      INPROGRESS: 0,
      PENDING: 0,
      REJECTED: 0,
      COMPLETED: 0,
    } as Record<Order["status"], number>,
  );

  const pieData = Object.entries(statusDistribution).map(([name, value]) => ({
    name,
    value,
  }));

  const CustomLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    percent,
    name,
  }: {
    cx: number;
    cy: number;
    midAngle: number;
    innerRadius: number;
    outerRadius: number;
    percent: number;
    name: string;
  }) => {
    const radius = outerRadius * 1.2; // Adjust this multiplier to move the label further out
    const x = cx + radius * Math.cos(-midAngle * (Math.PI / 180));
    const y = cy + radius * Math.sin(-midAngle * (Math.PI / 180));

    // Only show label if percent is greater than 0 to avoid clutter
    if (percent === 0) return null;

    return (
      <text
        x={x}
        y={y}
        fill="#666"
        textAnchor={x > cx ? "start" : "end"}
        dominantBaseline="central"
        fontSize={12}
      >
        {`${name} ${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  const COLORS = [
    "#F59E0B",
    "#4F46E5",
    "#10B981",
    "#EF4444",
    "#8B5CF6",
    "#EC4899",
  ];

  const formatNumber = (value: number) => new Intl.NumberFormat().format(value);


  const renderTable = (): ReactNode => {
    switch (tableIndex) {
      case 0:
        return <OffTakersTable searchText={searchText} />;
        break;
      case 1:
        return <OrdersTable searchText={searchText} />;
        break;
      case 2:
        return (
          <ContractsTable
            searchText={searchText}
            setSelectedFilterIndex={() => {}}
          />
        );
        break;
      case 3:
        return <CustomersTable searchText={searchText} />;
        break;
      default:
        return <OffTakersTable searchText={searchText} />;
        break;
    }
  };

  return (
    <div>
      <div
        className="grid grid-cols-1 gap-y-2 gap-x-2 md:grid-cols-2 lg:grid-cols-4 w-full mt-4"
        style={{}}
      >
        {user && user.roleName === "ROLE_KFT_SUPER_ADMIN" && (
          <div
            onClick={() => {
              setTableIndex(0);
              navigate("/offtakers");
            }}
            style={{ cursor: "pointer" }}
          >
            <StatCard
              title="Number of Off takers"
              value={dashboardValues?.data.data.data.numberOffTakers || 0}
              bgColor="#6E6CB3"
              icon={<ShopOutlined style={{ color: "white", fontSize: 24 }} />}
            />
          </div>
        )}
        {user && user.roleName === "ROLE_KFT_SP_ADMIN" && (
          <div onClick={() => setTableIndex(0)} style={{ cursor: "pointer" }}>
            <StatCard
              title="Number of Vouchers"
              value={dashboardValues?.data.data.data.numberOfVouchers || 0}
              bgColor="#6E6CB3"
              icon={<ShopOutlined style={{ color: "white", fontSize: 24 }} />}
            />
          </div>
        )}
        <div onClick={() => setTableIndex(0)} style={{ cursor: "pointer" }}>
          <StatCard
            title="Number of Ordres"
            value={dashboardValues?.data.data.data.numberOffOrders || 0}
            bgColor="#CE7270"
            icon={<ProductOutlined style={{ color: "white", fontSize: 24 }} />}
          />
        </div>
        <div onClick={() => setTableIndex(0)} style={{ cursor: "pointer" }}>
          <StatCard
            title="Number of Customers"
            value={dashboardValues?.data.data.data.numberOffCustomers || 0}
            bgColor="#49B896"
            icon={
              <svg
                width="33"
                height="32"
                viewBox="0 0 33 32"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M16.3819 0.0732422C13.2798 0.0732422 10.2473 0.993132 7.66801 2.71659C5.08868 4.44004 3.07833 6.88965 1.8912 9.75565C0.704062 12.6216 0.393453 15.7753 0.998649 18.8178C1.60385 21.8604 3.09767 24.6551 5.29121 26.8487C7.48475 29.0422 10.2795 30.536 13.322 31.1412C16.3645 31.7464 19.5182 31.4358 22.3842 30.2487C25.2502 29.0615 27.6998 27.0512 29.4233 24.4718C31.1467 21.8925 32.0666 18.86 32.0666 15.7579C32.062 11.5995 30.408 7.61272 27.4676 4.67227C24.5271 1.73182 20.5404 0.077855 16.3819 0.0732422ZM9.34853 25.7162C10.1576 24.61 11.2161 23.7102 12.4382 23.09C13.6603 22.4697 15.0115 22.1464 16.3819 22.1464C17.7524 22.1464 19.1036 22.4697 20.3257 23.09C21.5478 23.7102 22.6063 24.61 23.4154 25.7162C21.3598 27.174 18.902 27.957 16.3819 27.957C13.8619 27.957 11.4041 27.174 9.34853 25.7162ZM12.3155 14.5961C12.3155 13.7918 12.554 13.0056 13.0009 12.3369C13.4477 11.6682 14.0828 11.147 14.8258 10.8392C15.5688 10.5314 16.3865 10.4509 17.1753 10.6078C17.9641 10.7647 18.6886 11.152 19.2573 11.7207C19.826 12.2894 20.2133 13.014 20.3702 13.8028C20.5271 14.5916 20.4466 15.4092 20.1388 16.1522C19.831 16.8953 19.3098 17.5303 18.6411 17.9772C17.9724 18.424 17.1862 18.6625 16.3819 18.6625C15.3035 18.6625 14.2692 18.2341 13.5066 17.4715C12.744 16.7089 12.3155 15.6746 12.3155 14.5961ZM25.967 23.3011C24.8374 21.8644 23.3977 20.7016 21.7554 19.8998C22.802 18.8399 23.5119 17.4942 23.7956 16.0319C24.0793 14.5696 23.9242 13.056 23.3498 11.6816C22.7755 10.3072 21.8075 9.1334 20.5677 8.30778C19.3278 7.48216 17.8715 7.04164 16.3819 7.04164C14.8924 7.04164 13.4361 7.48216 12.1962 8.30778C10.9564 9.1334 9.9884 10.3072 9.41404 11.6816C8.83968 13.056 8.6846 14.5696 8.96831 16.0319C9.25202 17.4942 9.96184 18.8399 11.0085 19.8998C9.3662 20.7016 7.92644 21.8644 6.79687 23.3011C5.37805 21.5025 4.49433 19.3408 4.24688 17.0633C3.99942 14.7859 4.39822 12.4848 5.39763 10.4235C6.39704 8.36215 7.95668 6.62388 9.89799 5.40765C11.8393 4.19142 14.0838 3.54638 16.3747 3.54638C18.6655 3.54638 20.9101 4.19142 22.8514 5.40765C24.7927 6.62388 26.3523 8.36215 27.3517 10.4235C28.3511 12.4848 28.7499 14.7859 28.5025 17.0633C28.255 19.3408 27.3713 21.5025 25.9525 23.3011H25.967Z"
                  fill="white"
                />
              </svg>
            }
          />
        </div>
        <div
          onClick={() => {
            setTableIndex(2);
            navigate("/contracts");
          }}
          style={{ cursor: "pointer" }}
        >
          <StatCard
            title="Number of Contracts"
            value={dashboardValues?.data.data.data.numberOffContracts || 0}
            bgColor="#CE7270"
            icon={
              <svg
                width="30"
                height="31"
                viewBox="0 0 30 31"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M21.079 9.46606H16.1219V11.9446H21.079C23.1238 11.9446 24.7968 13.6177 24.7968 15.6625C24.7968 17.7073 23.1238 19.3803 21.079 19.3803H16.1219V21.8589H21.079C24.4994 21.8589 27.2754 19.0829 27.2754 15.6625C27.2754 12.2421 24.4994 9.46606 21.079 9.46606ZM13.6433 19.3803H8.68616C6.64134 19.3803 4.96831 17.7073 4.96831 15.6625C4.96831 13.6177 6.64134 11.9446 8.68616 11.9446H13.6433V9.46606H8.68616C5.26574 9.46606 2.48975 12.2421 2.48975 15.6625C2.48975 19.0829 5.26574 21.8589 8.68616 21.8589H13.6433V19.3803ZM9.92544 14.4232H19.8397V16.9018H9.92544V14.4232ZM21.079 9.46606H16.1219V11.9446H21.079C23.1238 11.9446 24.7968 13.6177 24.7968 15.6625C24.7968 17.7073 23.1238 19.3803 21.079 19.3803H16.1219V21.8589H21.079C24.4994 21.8589 27.2754 19.0829 27.2754 15.6625C27.2754 12.2421 24.4994 9.46606 21.079 9.46606ZM13.6433 19.3803H8.68616C6.64134 19.3803 4.96831 17.7073 4.96831 15.6625C4.96831 13.6177 6.64134 11.9446 8.68616 11.9446H13.6433V9.46606H8.68616C5.26574 9.46606 2.48975 12.2421 2.48975 15.6625C2.48975 19.0829 5.26574 21.8589 8.68616 21.8589H13.6433V19.3803ZM9.92544 14.4232H19.8397V16.9018H9.92544V14.4232Z"
                  fill="white"
                />
              </svg>
            }
          />
        </div>
      </div>
     <div >
        <div
          /*style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: 80,
            backgroundColor: "#EEF3F8",
            borderRadius: 8.4,
            marginBottom: 22,
            fontFamily: "Poppins",
            fontSize: 22,
          }}
        >
          Off Takers
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            height: 80,
            backgroundColor: "#EEF3F8",
            borderRadius: 8.4,
            marginBottom: 12,
          }}
        >
          <TableAction setSearchText={setSearchText} />
        </div>
        {renderTable()}
      </div>
      <div className="block md:hidden">{renderTable()}</div>
       <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
         */
        ></div></div>
        <div className="mt-8">
          <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
             <Card className="bg-gray-50">
          <h3 className="text-gray-500 mb-4 text-lg font-semibold">
            Voucher Amount
          </h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart
                data={voucherChartData}
                margin={{ top: 10, right: 20, bottom: 20, left: 10 }}
              >
                <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.5} />
                <XAxis
                  dataKey="name"
                  label={{
                 
                    position: "insideBottom",
                    offset: -10,
                  }}
                />
                <YAxis
                  tickFormatter={formatNumber}
                  label={{
                    value: "Amount",
                    angle: -90,
                    position: "insideLeft",
                  }}
                />
                <Tooltip formatter={formatNumber} />
                <Legend wrapperStyle={{ paddingTop: 20 }} className="text-sm" />
                 <Bar
                    dataKey="redeemed"
                    fill="#10B981"
                    name="Redeemed"
                  />
               
               <Line
                    type="monotone"
                    dataKey="issued"
                    stroke="#EC4899"
                    strokeWidth={2}
                    name="Issued"
                  />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </Card>
      <Card className="bg-gray-50 p-4">
          <h3 className="text-gray-500 mb-4 text-lg font-semibold px-4 pt-2">
            Order Performance Analysis
          </h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart
                data={composedData}
                margin={{ top: 15, right: 20, bottom: 25, left: 10 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="name"
                  label={{
                    value: "Order ID",
                    position: "insideBottom",
                    offset: -10,
                  }}
                />
                <YAxis
                  tickFormatter={formatNumber}
                  label={{
                    value: "Amount",
                    angle: -90,
                    position: "insideLeft",
                  }}
                />
                <Tooltip formatter={formatNumber} />
                <Legend
                  layout="horizontal"
                  verticalAlign="bottom"
                  align="center"
                  wrapperStyle={{ paddingTop: 24 }}
                  className="text-sm"
                />
                <Area
                  type="monotone"
                  dataKey="cumulativeAmount"
                  fill="#8884d8"
                  fillOpacity={0.3}
                  stroke="#8884d8"
                  name="Cumulative Amount"
                />
                <Bar
                  dataKey="orderAmount"
                  fill="#F59E0B"
                  name="Individual Amount"
                />
                <Line
                  type="monotone"
                  dataKey="orderAmount"
                  stroke="#EF4444"
                  strokeWidth={2}
                  name="Amount Trend"
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="bg-gray-50 p-4">
          <h3 className="text-gray-500 mb-4 text-lg font-semibold">
            Status Distribution
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                outerRadius={80}
                dataKey="value"
                labelLine={false} // Optional: remove if lines are too long
                label={(props) => <CustomLabel {...props} />}
              >
                {pieData.map((_, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={formatNumber} />
              <Legend
                layout="horizontal"
                verticalAlign="bottom"
                align="center"
                wrapperStyle={{ paddingTop: 24 }}
                className="text-sm"
              />
            </PieChart>
          </ResponsiveContainer>
        </Card>

        <Card className="bg-gray-50">
          <h3 className="text-gray-500 mb-4 text-lg font-semibold">
            Order Amount Composition
          </h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart
                data={composedData}
                margin={{ top: 10, right: 20, bottom: 20, left: 10 }}
              >
                <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.5} />
                <XAxis
                  dataKey="name"
                  label={{
                    value: "Order ID",
                    position: "insideBottom",
                    offset: -10,
                  }}
                />
                <YAxis
                  tickFormatter={formatNumber}
                  label={{
                    value: "Amount",
                    angle: -90,
                    position: "insideLeft",
                  }}
                />
                <Tooltip formatter={formatNumber} />
                <Legend wrapperStyle={{ paddingTop: 20 }} className="text-sm" />
                <Bar
                  dataKey="orderAmount"
                  fill="#10B981"
                  stackId="a"
                  name="Base Amount"
                />
                <Area
                  type="monotone"
                  dataKey="orderAmount"
                  stackId="a"
                  fill="#4F46E5"
                  fillOpacity={0.4}
                  stroke="#4F46E5"
                  name="Amount Overlay"
                />
                <Line
                  type="monotone"
                  dataKey="cumulativeAmount"
                  stroke="#EC4899"
                  strokeWidth={2}
                  name="Cumulative Trend"
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </Card>
       
       </section>
    </div>
     </div>
  );

}

export default WithAuth(AdminDashboard);
function setVoucherChartData(voucherData: any) {
  throw new Error("Function not implemented.");
}

