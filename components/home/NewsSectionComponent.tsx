import SectionLayout from "@/components/layouts/SectionLayout";
import TitleText from "@/components/app/TitleText";
import { useNews } from "@/hooks/user/useNews";
import { News } from "@/types/news";
import { useRouter } from "next/navigation";
import { encryptString } from "@/utils";
import ButtonLink from "@/components/app/ButtonLink";

const NewsSectionComponent = () => {
  const { data: newsData } = useNews();

  const router = useRouter();

  // const handleToClick = () => {
  //   router.push("/news");
  // };

  return (
    <SectionLayout className="my-14 md:my-28 h-auto">
      <div className="container mx-auto px-4 md:px-6 lg:px-8">
        <div className="relative">
          <TitleText title="NEWS" subtitle="お知らせ" className="text-[#786464]" />
          <div className="absolute top-3 right-0 hidden md:block">
            <ButtonLink href="/news" className="">もっと見る</ButtonLink>
          </div>
        </div>
        <div className="max-w-[800px] mx-auto px-0 md:px-16">
          <div className="flex flex-col space-y-4">
            {newsData?.data?.map((news: News) => (
              <div key={news.news_id} className="flex flex-row gap-4 md:gap-6 lg:gap-10 font-noto">
                <p className="w-[100px] text-base text-[#786464]">{news.news_date}</p>
                <p className="w-[calc(100%-100px)] text-base text-[#786464] cursor-pointer hover:underline" onClick={() =>
                  router.push(`/news/${encryptString(news.news_id.toString())}`)
                }>{news.title}</p>
              </div>
            ))}
          </div>
          <div className="block md:hidden text-right mt-5">
            <ButtonLink href="/news" className="">もっと見る</ButtonLink>
          </div>
        </div>
      
        {/* <div className="flex md:my-10 my-2 gap-6 overflow-x-auto scrollbar-hide">
          {newsData?.data?.map((news: News) => (
            <div key={news.news_id} className="flex-shrink-0">
              <NewsCardComponent
                date={news.news_date}
                title={news.title}
                handleClick={() =>
                  router.push(`/news/${encryptString(news.news_id.toString())}`)
                }
              />
            </div>
          ))}
        </div> */}
      </div>
    </SectionLayout>
  );
};

export default NewsSectionComponent;
