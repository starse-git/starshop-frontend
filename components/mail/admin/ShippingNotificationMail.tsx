import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Link,
  Preview,
  Section,
  Text,
  Row,
  Column,
  Hr,
  Img,
} from "@react-email/components";

interface ProductItem {
  product_name: string;
  quantity: number;
  price: number;
  tax_amount: number;
}

export interface ShippingNotificationMailProps {
  orderId: number;
  userName: string;
  userEmail: string;
  products: ProductItem[];
  trackingNumber: string;
  carrier: string;
  shippingDate: string;
  shippingAddress?: string;
}

export const ShippingNotificationMail = ({
  orderId,
  userName,
  products,
  trackingNumber,
  carrier,
  shippingDate,
  shippingAddress,
}: ShippingNotificationMailProps) => (
  <Html>
    <Head />
    <Preview>商品を発送いたしました - STAR SHOP</Preview>
    <Body style={main}>
      <Container style={container}>
        {/* Header */}
        <Section style={header}>
          <Img
            src="https://oyoazrgseubztzqrrrbu.supabase.co/storage/v1/object/public/profile-images//logo.png"
            width="60"
            height="60"
            alt="STAR SHOP"
            style={logo}
          />
        </Section>

        {/* Shipping Banner */}
        <Section style={shippingBanner}>
          <Text style={shippingBannerText}>📦 商品を発送いたしました</Text>
        </Section>

        {/* Main Content */}
        <Section style={content}>
          <Heading style={h1}>発送完了のお知らせ</Heading>

          <Text style={greeting}>{userName} 様</Text>

          <Text style={text}>
            ご注文いただいた商品を発送いたしました。
            <br />
            以下の配送情報をご確認ください。
          </Text>

          {/* Shipping Details */}
          <Section style={shippingDetailsSection}>
            <Heading style={h2}>配送情報</Heading>

            <Row style={detailRow}>
              <Column style={labelColumn}>
                <Text style={label}>注文番号:</Text>
              </Column>
              <Column style={valueColumn}>
                <Text style={value}>#{orderId}</Text>
              </Column>
            </Row>

            <Row style={detailRow}>
              <Column style={labelColumn}>
                <Text style={label}>発送日:</Text>
              </Column>
              <Column style={valueColumn}>
                <Text style={value}>{shippingDate}</Text>
              </Column>
            </Row>

            <Row style={detailRow}>
              <Column style={labelColumn}>
                <Text style={label}>配送業者:</Text>
              </Column>
              <Column style={valueColumn}>
                <Text style={value}>{carrier}</Text>
              </Column>
            </Row>

            <Row style={detailRow}>
              <Column style={labelColumn}>
                <Text style={label}>追跡番号:</Text>
              </Column>
              <Column style={valueColumn}>
                <Text style={trackingNumberStyle}>{trackingNumber}</Text>
              </Column>
            </Row>

            {shippingAddress && (
              <Row style={detailRow}>
                <Column style={labelColumn}>
                  <Text style={label}>お届け先:</Text>
                </Column>
                <Column style={valueColumn}>
                  <Text style={value}>{shippingAddress}</Text>
                </Column>
              </Row>
            )}
          </Section>

          {/* Tracking Button */}
          {/* <Section style={trackingSection}>
            <Button
              href={`https://trackingurl.com/${trackingNumber}`}
              style={trackingButton}
            >
              📍 配送状況を確認する
            </Button>
            <Text style={trackingNote}>
              ※上記ボタンから配送状況をリアルタイムで確認できます
            </Text>
          </Section> */}

          <Hr style={divider} />

          {/* Shipped Products */}
          <Section style={productsSection}>
            <Heading style={h2}>発送商品一覧</Heading>

            {products.map((product, index) => (
              <Section key={index} style={productItem}>
                <Row>
                  <Column style={productInfoColumn}>
                    <Text style={productName}>{product.product_name}</Text>
                    <Text style={productDetails}>
                      数量: {product.quantity} | 価格: ¥
                      {product.price.toLocaleString()}
                    </Text>
                  </Column>
                  <Column style={productStatusColumn}>
                    <Text style={productStatus}>✅ 発送済み</Text>
                  </Column>
                </Row>
                {index < products.length - 1 && <Hr style={productDivider} />}
              </Section>
            ))}
          </Section>

          <Hr style={divider} />

          {/* Delivery Instructions */}
          <Section style={deliverySection}>
            <Row>
              <Column style={deliveryIconColumn}>
                <Text style={deliveryIcon}>🚚</Text>
              </Column>
              <Column style={deliveryContentColumn}>
                <Text style={deliveryTitle}>お受け取りについて</Text>
                <Text style={deliveryText}>
                  • 配達時にご不在の場合は、不在票が投函されます
                  <br />• 再配達のご依頼は配送業者まで直接ご連絡ください
                  <br />• 商品到着後は速やかに内容をご確認ください
                  <br />• 破損や不備がございましたら、すぐにご連絡ください
                </Text>
              </Column>
            </Row>
          </Section>

          <Hr style={divider} />

          {/* Support Information */}
          <Section style={supportSection}>
            <Text style={supportTitle}>📞 お困りの際は</Text>
            <Text style={supportText}>
              配送に関するご質問やお困りのことがございましたら、
              <br />
              お気軽にカスタマーサポートまでお問い合わせください。
            </Text>
          </Section>

          {/* Thank You Message */}
          <Section style={thankYouSection}>
            <Text style={thankYouText}>
              この度は STAR SHOP をご利用いただき、誠にありがとうございました。
              <br />
              商品がお手元に届くまで、もうしばらくお待ちください。
            </Text>
          </Section>
        </Section>

        {/* Footer */}
        <Section style={footer}>
          <Text style={footerText}>
            <strong>STAR SHOP（スターショップ）</strong>
            <br />
            URL:{" "}
            <Link href="https://www.starshop.co" style={link}>
              https://www.starshop.co
            </Link>
            <br />
            メール:{" "}
            <Link href="mailto:starshop@startech.co.jp" style={link}>
              starshop@startech.co.jp
            </Link>
            <br />
            営業時間: 平日09:00～18:00（土日祝除く）
          </Text>

          <Text style={disclaimer}>※このメールは自動送信です。</Text>
        </Section>
      </Container>
    </Body>
  </Html>
);

// Styles
const main = {
  backgroundColor: "#f6f9fc",
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
};

const container = {
  backgroundColor: "#ffffff",
  margin: "0 auto",
  padding: "20px 0 48px",
  marginBottom: "64px",
  maxWidth: "600px",
};

const header = {
  padding: "20px 30px",
  backgroundColor: "#000",
  textAlign: "center" as const,
};

const logo = {
  margin: "0 auto",
};

const shippingBanner = {
  backgroundColor: "#f0f9ff",
  padding: "15px 30px",
};

const shippingBannerText = {
  color: "#0ea5e9",
  fontSize: "16px",
  fontWeight: "bold",
  margin: "0",
  textAlign: "center" as const,
};

const content = {
  padding: "30px",
};

const h1 = {
  color: "#1a1a1a",
  fontSize: "28px",
  fontWeight: "bold",
  margin: "0 0 30px",
  textAlign: "center" as const,
};

const h2 = {
  color: "#1a1a1a",
  fontSize: "20px",
  fontWeight: "bold",
  margin: "0 0 16px",
};

const greeting = {
  color: "#1a1a1a",
  fontSize: "16px",
  margin: "0 0 16px",
  fontWeight: "bold",
};

const text = {
  color: "#525f7f",
  fontSize: "16px",
  lineHeight: "24px",
  margin: "0 0 16px",
};

const shippingDetailsSection = {
  backgroundColor: "#f0f9ff",
  padding: "20px",
  borderRadius: "8px",
  border: "1px solid #bae6fd",
  margin: "20px 0",
};

const detailRow = {
  marginBottom: "12px",
};

const labelColumn = {
  width: "35%",
  verticalAlign: "top" as const,
};

const valueColumn = {
  width: "65%",
  verticalAlign: "top" as const,
};

const label = {
  color: "#6b7280",
  fontSize: "14px",
  margin: "0",
  fontWeight: "500",
};

const value = {
  color: "#1a1a1a",
  fontSize: "14px",
  margin: "0",
  fontWeight: "bold",
};

const trackingNumberStyle = {
  color: "#0ea5e9",
  fontSize: "16px",
  margin: "0",
  fontWeight: "bold",
  fontFamily: "monospace",
};

// const trackingSection = {
//   textAlign: "center" as const,
//   margin: "30px 0",
// };

// const trackingButton = {
//   backgroundColor: "#0ea5e9",
//   borderRadius: "8px",
//   color: "#ffffff",
//   fontSize: "16px",
//   fontWeight: "bold",
//   textDecoration: "none",
//   textAlign: "center" as const,
//   display: "inline-block",
//   padding: "12px 24px",
//   margin: "0 0 12px",
// };

// const trackingNote = {
//   color: "#6b7280",
//   fontSize: "12px",
//   margin: "0",
// };

const divider = {
  borderColor: "#e6ebf1",
  margin: "30px 0",
};

const productsSection = {
  margin: "20px 0",
};

const productItem = {
  padding: "16px 0",
};

const productInfoColumn = {
  verticalAlign: "top" as const,
  paddingLeft: "16px",
};

const productStatusColumn = {
  width: "100px",
  verticalAlign: "top" as const,
  textAlign: "right" as const,
};

const productName = {
  color: "#1a1a1a",
  fontSize: "16px",
  fontWeight: "bold",
  margin: "0 0 8px",
};

const productDetails = {
  color: "#525f7f",
  fontSize: "14px",
  margin: "0",
};

const productStatus = {
  color: "#059669",
  fontSize: "14px",
  fontWeight: "bold",
  margin: "0",
};

const productDivider = {
  borderColor: "#f1f5f9",
  margin: "16px 0",
};

const deliverySection = {
  backgroundColor: "#fffbeb",
  padding: "20px",
  borderRadius: "8px",
  border: "1px solid #fed7aa",
  margin: "20px 0",
};

const deliveryIconColumn = {
  width: "40px",
  verticalAlign: "top" as const,
};

const deliveryContentColumn = {
  verticalAlign: "top" as const,
};

const deliveryIcon = {
  fontSize: "24px",
  margin: "0",
};

const deliveryTitle = {
  color: "#92400e",
  fontSize: "18px",
  fontWeight: "bold",
  margin: "0 0 12px",
};

const deliveryText = {
  color: "#92400e",
  fontSize: "14px",
  lineHeight: "20px",
  margin: "0",
};

const supportSection = {
  backgroundColor: "#f3f4f6",
  padding: "20px",
  borderRadius: "8px",
  margin: "20px 0",
};

const supportTitle = {
  color: "#374151",
  fontSize: "16px",
  fontWeight: "bold",
  margin: "0 0 12px",
};

const supportText = {
  color: "#4b5563",
  fontSize: "14px",
  lineHeight: "20px",
  margin: "0",
};

const thankYouSection = {
  backgroundColor: "#f0fdf4",
  padding: "20px",
  borderRadius: "8px",
  border: "1px solid #bbf7d0",
  margin: "20px 0",
  textAlign: "center" as const,
};

const thankYouText = {
  color: "#166534",
  fontSize: "16px",
  lineHeight: "24px",
  margin: "0",
  fontWeight: "500",
};

const footer = {
  padding: "30px",
  backgroundColor: "#f8f9fa",
  textAlign: "center" as const,
};

const footerText = {
  color: "#525f7f",
  fontSize: "14px",
  lineHeight: "20px",
  margin: "0 0 16px",
};

const link = {
  color: "#2563eb",
  textDecoration: "underline",
};

const disclaimer = {
  color: "#9ca3af",
  fontSize: "12px",
  margin: "0",
};

export default ShippingNotificationMail;
