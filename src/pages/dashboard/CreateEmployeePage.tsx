import { Card } from "@/components/ui/card";
import CreateEmployeeForm from "@/components/employee/CreateEmployeeForm";

const CreateEmployeePage = () => {
  return (
    <Card className="p-6">
      <CreateEmployeeForm />
    </Card>
  );
};

export default CreateEmployeePage;
