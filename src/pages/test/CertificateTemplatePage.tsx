import { ArrowLeft, Upload } from "lucide-react"
import { Button } from "@/components/ui/button"
import Certificate from "@/components/certificate/Certificate";
import { useNavigate } from "react-router-dom";

const CertificateTemplatePage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-full bg-white">
      {/* Header */}
      <header className="flex items-center gap-4 p-4 md:p-6 border-b border-accent/20">
        <Button onClick={()=>navigate("/certificate-issued")} variant="ghost" size="sm" className="text-foreground hover:bg-muted">
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-lg font-semibold text-foreground">Certificate Template</h1>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 md:py-12 max-w-4xl">
        <div className="space-y-8">
          {/* Certificate Display */}
          <div className="flex justify-center">
            <Certificate />
          </div>

          {/* Upload Section */}
          <div className="flex flex-col items-center space-y-4">
            <Button className="bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-3 rounded-lg font-medium transition-colors">
              <Upload className="h-4 w-4 mr-2" />
              Upload Template
            </Button>
          </div>
        </div>
      </main>
    </div>
  )
}


export default CertificateTemplatePage;