import Image from "next/image";
import wave from "@/public/svgs/wave.svg";
import Link from "next/link";

interface AddressCardProps {
  icon: React.ReactNode;
  title: string;
  company: string;
  trackingNumber: string;
  deliveryDate: string;
}

const DeliveryCard = ({
  icon,
  title,
  company,
  trackingNumber,
  deliveryDate,
}: AddressCardProps) => {
  return (
    <div className="px-6 py-6 rounded-md shadow-md drop-shadow-md border border-white-bg space-y-4 bg-gradient-to-br from-black/10 from-5% to-white to-70% relative overflow-hidden">
      <div className="flex items-center gap-2">
        {icon}
        <h1 className="font-bold text-dark md:text-xl text-lg">{title}</h1>
      </div>

      <div className="flex flex-col gap-2 md:text-sm text-xs text-dark">
        <p>運送会社 : {company == "yamato" ? "ヤマト" : company == "sagawa" ? "佐川" : company == "japanpost" ? "日本郵便" : "-"}</p>
        <p>追跡番号 : {trackingNumber}</p>
        <p>配達日 : {deliveryDate}</p>
        {company == "yamato" && (
          <Link href={`https://jizen.kuronekoyamato.co.jp/jizen/servlet/crjz.b.NQ0010?id=${trackingNumber}`} className="text-blue-600 underline" target="_blank">
            状況を確認
          </Link>
        )}
        {company == "sagawa" && (
          <Link href={`https://k2k.sagawa-exp.co.jp/p/web/okurijosearch.do?okurijoNo=${trackingNumber}`} className="text-blue-600 underline" target="_blank">
            状況を確認
          </Link>
        )}
        {company == "japanpost" && (
          <Link href={`https://trackings.post.japanpost.jp/services/srv/search/direct?searchKind=S003&locale=ja&SVID=023&reqCodeNo1=${trackingNumber}`} className="text-blue-600 underline" target="_blank">
            状況を確認
          </Link>
        )}
        {company == "" && (
          <p>-</p>
        )}
      </div>

      <Image
        src={wave}
        alt="wave"
        className="absolute bottom-0 -right-6 md:w-[250px] w-[200px]"
      />
    </div>
  );
};

export default DeliveryCard;
