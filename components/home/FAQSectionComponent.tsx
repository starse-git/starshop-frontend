import SectionLayout from "@/components/layouts/SectionLayout";
import QuestionCardComponent from "@/components/app/public/QuestionCardComponent";
import { useFaqs } from "@/hooks/user/useFaqs";
import { Faqs } from "@/types/faqs";

const FAQSectionComponent = () => {
  const { data: faqData } = useFaqs();

  return (
    <>
    <SectionLayout className="pb-20 md:pb-40 h-auto">
      <div className="container mx-auto px-4 md:px-6 lg:px-8 gap-6">
        <div className="w-full">
          <h1 className="text-5xl font-cormorant text-[#786464] text-center my-4">Q&A</h1>
        </div>

        <div className="w-full space-y-6 px-0 md:px-16">
          {faqData?.data?.map((faq: Faqs) => (
            <QuestionCardComponent
              key={faq.faqs_id}
              question={faq.question}
              answer={faq.answer}
            />
          ))}
        </div>
      </div>
    </SectionLayout>
    </>
  );
};

export default FAQSectionComponent;
