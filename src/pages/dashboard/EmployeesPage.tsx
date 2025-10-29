import EmployeeList from "@/components/employee/EmployeeList";
import { Card } from "@/components/ui/card";

const EmployeesPage = () => {
  return (
    <Card className="p-6">
      <EmployeeList />
    </Card>
  );
};

export default EmployeesPage;
