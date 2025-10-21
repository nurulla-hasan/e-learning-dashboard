import { useState } from "react";
import FaqNotFoundCard from "../card/FaqNotFoundCard";
import FaqItem from "./FaqItem";
import FaqLoading from "../loader/FaqLoading";
import { useGetFaqsQuery } from "@/redux/features/faq/faqApi";
import type { IFaq } from "@/types/faq.type";
import ServerErrorCard from "../card/ServerErrorCard";

const FaqList = () => {
  const [currentPage] = useState(1);
  const [pageSize] = useState(10);
  const { data, isLoading, isFetching, isError } = useGetFaqsQuery([
      { name: "page", value: currentPage },
      { name: "limit", value: pageSize },
    ]);
  const faqs: IFaq[] = data?.data || [];
 
  if (isLoading || isFetching) {
    return <FaqLoading />
  }

  if (!isLoading && faqs?.length > 0) {
    return (
      <>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 min-h-[75%] overflow-y-scroll content-start">
          {faqs?.map((faq, index) => (
            <FaqItem faq={faq} key={index} serial={Number(index + 1) + (currentPage - 1) * pageSize} />
          ))}
        </div>
      </>
    )
  }

  if (!isLoading && isError) {
    return <ServerErrorCard />
  }

  if (!isLoading && faqs.length === 0) {
    return (
      <>
          <FaqNotFoundCard />
      </>
    );
  }

}

export default FaqList;