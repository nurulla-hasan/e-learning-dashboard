import money from "../../assets/images/dashboard/money.png";
import test from "../../assets/images/dashboard/test.png";
import user from "../../assets/images/dashboard/user.png";
import course from "../../assets/images/dashboard/course.png";
import certificates from "../../assets/images/dashboard/certificates.png";
import { useGetDashboardDataQuery } from "@/redux/features/dashboard/dashboardApi";
import { useTranslation } from "react-i18next";

type DashboardStats = {
  totalUsers?: number;
  totalCompanies?: number;
  totalCourses?: number;
  totalTests?: number;
  totalIncome?: number;
};

const StatsSection = () => {
  const { t } = useTranslation("common");
  const { data, isLoading, isError } = useGetDashboardDataQuery(undefined);
  const stats: DashboardStats = (data?.data ?? {}) as DashboardStats;

  if (isLoading) {
    return (
      <div className="w-full">
        <div className="w-full mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="bg-white rounded-lg shadow-sm p-6 h-24 animate-pulse" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!isLoading && isError) {
    return <h1 className="text-lg text-red-500">{t("dashboard.stats.error")}</h1>;
  }

  return (
    <div className="w-full">
      <div className="w-full mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="bg-white rounded-lg shadow-sm p-6 flex items-center">
            <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mr-4">
              <img src={user} alt="user" className="w-6 h-6" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800">{stats?.totalUsers ?? 0}</p>
              <p className="text-sm text-gray-500">{t("dashboard.stats.totalUsers")}</p>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6 flex items-center">
            <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center mr-4">
              <img src={certificates} alt="companies" className="w-6 h-6" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800">{stats?.totalCompanies ?? 0}</p>
              <p className="text-sm text-gray-500">{t("dashboard.stats.totalCompanies")}</p>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6 flex items-center">
            <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mr-4">
              <img src={course} alt="course" className="w-6 h-6" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800">{stats?.totalCourses ?? 0}</p>
              <p className="text-sm text-gray-500">{t("dashboard.stats.totalCourses")}</p>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6 flex items-center">
            <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center mr-4">
              <img src={test} alt="test" className="w-6 h-6" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800">{stats?.totalTests ?? 0}</p>
              <p className="text-sm text-gray-500">{t("dashboard.stats.totalTests")}</p>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6 flex items-center">
            <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mr-4">
              <img src={money} alt="money" className="w-6 h-6" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800">
                {t("dashboard.stats.totalIncomeValue", { value: stats?.totalIncome ?? 0 })}
              </p>
              <p className="text-sm text-gray-500">{t("dashboard.stats.totalIncome")}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatsSection;
