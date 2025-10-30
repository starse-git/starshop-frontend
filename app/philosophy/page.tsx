"use client";

import Image from 'next/image';
import BannerImagePC from '@/public/philosophy/BannerPC.png'
import BannerImageSP from '@/public/philosophy/BannerSP.png'
import Bg from '@/public/philosophy/Bg.png'

const PhilosophyPage = () => {
  return (
    <div className="mt-[80px]">
      <div className="w-screen h-full">
        <Image src={BannerImagePC} alt="Banner" className="hidden md:block w-full h-full object-cover" />
        <Image src={BannerImageSP} alt="Banner" className="block md:hidden w-full h-full object-cover" />
      </div>
      <div className="container mx-auto px-4 md:px-6 text-center tracking-wider">
        <div className="flex items-center justify-center w-full py-8">
          <h2 className="text-xl md:text-2xl font-medium font-cormorant text-center text-[#786464] whitespace-nowrap px-1">
            年齢に負けない
          </h2>
          <div className="flex items-center flex-1 max-w-[40px]">
            <div className="flex-1 h-0.5 bg-[#6d5c3c]"></div>
          </div>
        </div>
        <p className="max-sm:text-base md:text-xl font-medium font-cormorant text-center text-[#786464] leading-10">
          日々のケアで、あなたはもっと美しくなれる。
          <br />
          あなたに寄り添う“本気のエイジングケア”
        </p>
        <div className="my-6 md:my-10 space-y-8 md:space-y-12">
          <h3 className="philo-title font-cormorant">
            「年齢のせい」とあきらめたくない、すべての女性へ
            <br />
            未来の肌は、今日の選択で変わります。
          </h3>
          <p className="philo-para font-noto">
            ｢たくさん試してきたのに、どれも似たような使用感。｣
            <br />
            「まぁどれも同じだろう」と、半ばあきらめていませんか？
          </p>
          <p className="philo-para font-noto">
            実はまだ出会っていない、“本当に良いもの”があります。
            <br />
            違いを知った瞬間、あなたの肌は
            <br className="md:hidden" />
            きっと新しい未来を手に入れられる。
          </p>

          <p className="philo-para font-noto">
            私たちが届けたいのは、“本気のエイジングケア”です。
            <br />
            時間を重ねるほど、素肌が楽しみになるような変化を、
            <br />
            毎日のケアで実感してほしい ——
          </p>

          <p className="philo-para font-noto">
            肌の力を信じ、これからも自分らしく輝き続けるために。
            <br />
            その想いを込めて、日々のスキンケアに「確かな実感」と
            <br />
            「続けたくなる心地よさ」をお届けします。
          </p>
        </div>
        <div className="my-8 md:my-10">
          <h3 className="philo-title2 mb-8 md:mb-10">
            <span
              className="
                relative 
                before:content-[''] 
                before:absolute 
                before:-bottom-[12px]
                before:left-[50%]
                before:translate-x-[-50%]
                before:block 
                before:h-[12px] 
                before:w-full 
                before:bg-[url('/philo-arrow.png')] 
                before:bg-[length:488px_12px] 
                before:bg-center 
                before:bg-no-repeat 
                before:mt-2
              "
            >
              自然と共に生きる美しさ
            </span>
          </h3>
          <p className="philo-para font-noto">
            美容効果だけでなく、自然への優しさも大切に。
            <br />
            オーガニックの理念を軸に、動物も、植物も、人も、
            <br />
            すべてが健やかでいられることを願い、
            <br />
            開発から販売まで一貫して誠実さを大切にしています。
          </p>
        </div>
        <div className="my-8 md:my-10">
          <h3 className="philo-title2 mb-8 md:mb-10">
            <span
              className="
                relative 
                before:content-[''] 
                before:absolute 
                before:-bottom-[12px]
                before:left-[50%]
                before:translate-x-[-50%]
                before:block 
                before:h-[12px] 
                before:w-full 
                before:bg-[url('/philo-arrow.png')] 
                before:bg-[length:488px_12px] 
                before:bg-center 
                before:bg-no-repeat 
                before:mt-2
              "
            >
              “確かな実感”と“心地よさ”を両立
            </span>
          </h3>
          <p className="philo-para font-noto">
            肌に触れるたび、心も満たされるように。
            <br />
            香り、テクスチャー、使い心地、
            <br className="md:hidden" />
            すべてにこだわったアイテムをお届けします。
            <br />
            毎日のケアを、あなたの未来を育む特別なひとときに。
          </p>
        </div>
        <div className="my-8 md:my-10">
          <h3 className="philo-title2 mb-8 md:mb-10">
            <span
              className="
                relative 
                before:content-[''] 
                before:absolute 
                before:-bottom-[12px]
                before:left-[50%]
                before:translate-x-[-50%]
                before:block 
                before:h-[12px] 
                before:w-full 
                before:bg-[url('/philo-arrow.png')] 
                before:bg-[length:488px_12px] 
                before:bg-center 
                before:bg-no-repeat 
                before:mt-2
              "
            >
              あなたらしい輝きを、これからもー
            </span>
          </h3>
          <p className="philo-para font-noto">
            毎日のケアが、自信と笑顔を育み、明日をもっと自由に彩っていく。
            <br />
            私たちはコスメを通し、年齢を理由にあきらめない美しさを、
            <br />
            あなたと共につくります。
            <br />
            あなたの毎日に寄り添う、信じられるパートナーとして。
          </p>
        </div>
      </div>
      <div className="w-screen -mt-10 md:-mt-[18%]">
        <Image src={Bg} alt="Banner" className="w-full h-full object-cover" />
      </div>
    </div>
  );
}

export default PhilosophyPage;
