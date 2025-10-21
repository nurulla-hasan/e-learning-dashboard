
const FaqNotFoundCard = () => {
  return (
    <div className="flex w-full h-[80%] p-6 bg-red-50 border border-red-200 rounded-2xl shadow-sm flex-col items-center justify-center text-center mx-auto">
      <h2 className="text-xl font-semibold text-red-800 mb-2">
        No FAQs Found
      </h2>
      <p className="text-md text-red-700 mb-4">
        You haven't added any frequently asked questions yet. Click below to add one.
      </p>
    </div>
  );
};

export default FaqNotFoundCard;
