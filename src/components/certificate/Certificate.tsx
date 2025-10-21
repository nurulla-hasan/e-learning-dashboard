import MainCertificate from "./MainCerticate";
import TrainingCertificate from "./TrainingCertificate";

const Certificate = () => {
  return (
    <div className="relative w-full mx-auto">
        {/* Certificate Section */}
        <section>
          <MainCertificate />
        </section>
        <section>
          <TrainingCertificate />
        </section>
    </div>
  )
}
export default Certificate;