import CompanyList from "@/components/company/CompanyList";
import { Card } from "@/components/ui/card";

const CompaniesPage = () => {
  return (
    <Card className="p-6">
      <CompanyList />
    </Card>
  );
};

export default CompaniesPage;
