import money from "../../assets/images/dashboard/money.png";
import test from "../../assets/images/dashboard/test.png";
import user from "../../assets/images/dashboard/user.png";
import course from "../../assets/images/dashboard/course.png";
import certificates from "../../assets/images/dashboard/certificates.png";

const StatsSection = () => {
  //const { data, isLoading, isError } = useGetStatsQuery(undefined);
  //const stats = data?.data || {};
  const stats = {
    "totalUsers": 35,
    "totalCourses": 20,
    "completedTests": 6,
    "totalIncome": 1067,
    "totalProducts": 13
  }

  // if (isLoading) {
  //   return <StatsLoading />;
  // }

  // if (!isLoading && isError) {
  //   return <h1 className="text-lg text-red-500">Server Error Occured</h1>;
  // }

  // if (!isLoading && !isError && stats) {
  //   return (
  //     <div className="w-full bg-gray-100">
  //       <div className="w-full mx-auto">
  //         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
  //           <div className="bg-white rounded-lg shadow-sm p-6 flex items-center">
  //             <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mr-4">
  //               <img src={user} alt="job" className="w-6 h-6" />
  //             </div>
  //             <div>
  //               <p className="text-2xl font-bold text-gray-800">{stats?.totalUsers}</p>
  //               <p className="text-sm text-gray-500">Total Users</p>
  //             </div>
  //           </div>

  //           <div className="bg-white rounded-lg shadow-sm p-6 flex items-center">
  //             <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center mr-4">
  //               <img src={order} alt="job" className="w-6 h-6" />
  //             </div>
  //             <div>
  //               <p className="text-2xl font-bold text-gray-800">{stats?.completedOrders}</p>
  //               <p className="text-sm text-gray-500">Order Completed</p>
  //             </div>
  //           </div>
  //           <div className="bg-white rounded-lg shadow-sm p-6 flex items-center">
  //             <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mr-4">
  //               <img src={money} alt="money" className="w-6 h-6" />
  //             </div>
  //             <div>
  //               <p className="text-2xl font-bold text-gray-800">${stats?.totalIncome}</p>
  //               <p className="text-sm text-gray-500">Total Income</p>
  //             </div>
  //           </div>

  //           <div className="bg-white rounded-lg shadow-sm p-6 flex items-center">
  //             <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center mr-4">
  //               <img src={product} alt="job" className="w-6 h-6" />
  //             </div>
  //             <div>
  //               <p className="text-2xl font-bold text-gray-800">${stats?.totalProducts}</p>
  //               <p className="text-sm text-gray-500">Total Products</p>
  //             </div>
  //           </div>
  //         </div>
  //       </div>
  //     </div>
  //   );
  // }

   return (
      <div className="w-full">
        <div className="w-full mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="bg-white rounded-lg shadow-sm p-6 flex items-center">
              <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mr-4">
                <img src={user} alt="job" className="w-6 h-6" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-800">{stats?.totalUsers}</p>
                <p className="text-sm text-gray-500">Total Users</p>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-sm p-6 flex items-center">
              <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mr-4">
                <img src={course} alt="job" className="w-6 h-6" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-800">{stats?.totalCourses}</p>
                <p className="text-sm text-gray-500">Total Courses</p>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6 flex items-center">
              <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center mr-4">
                <img src={test} alt="job" className="w-6 h-6" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-800">{stats?.completedTests}</p>
                <p className="text-sm text-gray-500">Tests Completed</p>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-sm p-6 flex items-center">
              <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mr-4">
                <img src={certificates} alt="certificates" className="w-6 h-6" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-800">${stats?.totalIncome}</p>
                <p className="text-sm text-gray-500">Certificates Issued</p>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-sm p-6 flex items-center">
              <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mr-4">
                <img src={money} alt="money" className="w-6 h-6" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-800">${stats?.totalIncome}</p>
                <p className="text-sm text-gray-500">Total Income</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
};

export default StatsSection;
