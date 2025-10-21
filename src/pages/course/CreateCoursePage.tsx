import CreateCourseForm from "@/components/course/CreateCourseForm";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const CreateCoursePage = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-full bg-white rounded-md shadow-md p-4">
      <div className="mx-auto p-4 bg-white">
        <div className="flex items-center gap-3 mb-8">
          <Button onClick={()=>navigate("/courses")} variant="ghost" size="sm" className="p-1">
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-2xl font-semibold text-gray-900">Create Course</h1>
        </div>
        <CreateCourseForm />
      </div>
    </div>
  )
}

export default CreateCoursePage;
