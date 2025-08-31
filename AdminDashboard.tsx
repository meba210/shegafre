import { ReactNode, useState } from "react";
import StatCard from "../components/cards/stat-card/StatCard";
import { ProductOutlined, ShopOutlined } from "@ant-design/icons";
import { useOrderList } from "../api/order";
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

function AdminDashboard() {
  const { user } = useAuth() as AuthContextValue;
  const [tableIndex, setTableIndex] = useState<number>(0);
  const [searchText, setSearchText] = useState<string>("");
  const navigate = useNavigate();
  const { data: dashboardValues, isLoading: offTakersIsLoading } =
    useAdminDashboard();

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
      <div className="hidden md:block rounded-xl px-[50px] mt-[25px] pt-[22px] bg-transparent md:bg-white">
        <div
          style={{
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
    </div>
  );
}

export default WithAuth(AdminDashboard);
