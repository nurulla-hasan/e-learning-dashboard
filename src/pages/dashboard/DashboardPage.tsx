import IncomeOverviewChart from "@/components/dashboard/IncomeOverviewChart";
import StatsSection from "../../components/dashboard/StatsSection";
import UserOverviewChart from "@/components/dashboard/UserOverviewChart";
import RecentOrderList from "@/components/order/RecentOrderList";


const DashboardPage = () => {
  return (
    <>
      <div>
        <StatsSection/>
        <div className="grid grid-cols-1 md:grid-cols-2 mt-4 gap-4">
          <IncomeOverviewChart/>
          <UserOverviewChart/>
        </div>
        <RecentOrderList/>
      </div>
    </>
  );
}

export default DashboardPage