import {
    Body,
    Container,
    Head,
    Heading,
    Html,
    Preview,
    Section,
    Text,
    Row,
    Column,
    Hr,
    Img,
  } from "@react-email/components"
  
  interface ProductItem {
    product_name: string
    quantity: number
    price: number
    tax_amount: number
  }
  
  interface AdminCancelOrderMailProps {
    orderId: number
    userName: string
    userEmail: string
    products: ProductItem[]
    total: number
    eightPercentTotal: number
    tenPercentTotal: number
    cancelReason?: string
    cancelDate: string
  }
  
  export const CancelOrderMail = ({
    orderId,
    userName,
    userEmail,
    products,
    total,
    eightPercentTotal,
    tenPercentTotal,
    cancelReason,
    cancelDate,
  }: AdminCancelOrderMailProps) => (
    <Html>
      <Head />
      <Preview>注文キャンセル通知 - STAR SHOP</Preview>
      <Body style={main}>
        <Container style={container}>
          {/* Header */}
          <Section style={header}>
            <Img src="/placeholder.svg?height=40&width=150" width="150" height="40" alt="STAR SHOP Admin" style={logo} />
            <Text style={headerText}>管理者通知システム</Text>
          </Section>
  
          {/* Cancel Alert Banner */}
          <Section style={cancelBanner}>
            <Text style={cancelText}>⚠️ 注文がキャンセルされました</Text>
          </Section>
  
          {/* Main Content */}
          <Section style={content}>
            <Heading style={h1}>注文キャンセル通知</Heading>
  
            <Text style={adminGreeting}>管理者様</Text>
  
            <Text style={text}>以下の注文がキャンセルされました。返金処理等の対応をお願いいたします。</Text>
  
            {/* Cancel Summary */}
            <Section style={cancelSummary}>
              <Row style={summaryRow}>
                <Column style={summaryIconColumn}>
                  <Text style={summaryIcon}>📋</Text>
                </Column>
                <Column style={summaryContentColumn}>
                  <Text style={summaryTitle}>注文番号</Text>
                  <Text style={summaryValue}>#{orderId}</Text>
                </Column>
              </Row>
  
              <Row style={summaryRow}>
                <Column style={summaryIconColumn}>
                  <Text style={summaryIcon}>👤</Text>
                </Column>
                <Column style={summaryContentColumn}>
                  <Text style={summaryTitle}>お客様名</Text>
                  <Text style={summaryValue}>{userName}</Text>
                </Column>
              </Row>
  
              <Row style={summaryRow}>
                <Column style={summaryIconColumn}>
                  <Text style={summaryIcon}>📧</Text>
                </Column>
                <Column style={summaryContentColumn}>
                  <Text style={summaryTitle}>メールアドレス</Text>
                  <Text style={summaryValue}>{userEmail}</Text>
                </Column>
              </Row>
  
              <Row style={summaryRow}>
                <Column style={summaryIconColumn}>
                  <Text style={summaryIcon}>🕒</Text>
                </Column>
                <Column style={summaryContentColumn}>
                  <Text style={summaryTitle}>キャンセル日時</Text>
                  <Text style={summaryValue}>{cancelDate}</Text>
                </Column>
              </Row>
  
              {cancelReason && (
                <Row style={summaryRow}>
                  <Column style={summaryIconColumn}>
                    <Text style={summaryIcon}>📝</Text>
                  </Column>
                  <Column style={summaryContentColumn}>
                    <Text style={summaryTitle}>キャンセル理由</Text>
                    <Text style={summaryValue}>{cancelReason}</Text>
                  </Column>
                </Row>
              )}

              <Row style={summaryRow}>
                <Column style={summaryIconColumn}>
                  <Text style={summaryIcon}>8%</Text>
                </Column>
                <Column style={summaryContentColumn}>
                  <Text style={summaryTitle}>8%税率</Text>
                  <Text style={summaryValueHighlight}>¥{eightPercentTotal?.toLocaleString()}</Text>
                </Column>
              </Row>

              <Row style={summaryRow}>
                <Column style={summaryIconColumn}>
                  <Text style={summaryIcon}>10%</Text>
                </Column>
                <Column style={summaryContentColumn}>
                  <Text style={summaryTitle}>10%税率</Text>
                  <Text style={summaryValueHighlight}>¥{tenPercentTotal?.toLocaleString()}</Text>
                </Column>
              </Row>
  
              <Row style={summaryRow}>
                <Column style={summaryIconColumn}>
                  <Text style={summaryIcon}>💰</Text>
                </Column>
                <Column style={summaryContentColumn}>
                  <Text style={summaryTitle}>返金予定金額</Text>
                  <Text style={summaryValueHighlight}>¥{total?.toLocaleString()}</Text>
                </Column>
              </Row>
            </Section>
  
            <Hr style={divider} />
  
            {/* Products Table */}
            <Section style={productsSection}>
              <Heading style={h2}>キャンセルされた商品詳細</Heading>
  
              <Section style={tableHeader}>
                <Row>
                  <Column style={tableHeaderColumn}>
                    <Text style={tableHeaderText}>商品名</Text>
                  </Column>
                  <Column style={tableHeaderColumnSmall}>
                    <Text style={tableHeaderText}>数量</Text>
                  </Column>
                  <Column style={tableHeaderColumnSmall}>
                    <Text style={tableHeaderText}>価格</Text>
                  </Column>
                  <Column style={tableHeaderColumnSmall}>
                    <Text style={tableHeaderText}>税金</Text>
                  </Column>
                </Row>
              </Section>
  
              {products.map((product, index) => (
                <Section key={index} style={tableRow}>
                  <Row>
                    <Column style={tableColumn}>
                      <Text style={tableCellText}>{product.product_name}</Text>
                    </Column>
                    <Column style={tableColumnSmall}>
                      <Text style={tableCellText}>{product.quantity}</Text>
                    </Column>
                    <Column style={tableColumnSmall}>
                      <Text style={tableCellText}>¥{Math.floor(product.price)}</Text>
                    </Column>
                    <Column style={tableColumnSmall}>
                      <Text style={tableCellText}>¥{Math.floor(product.tax_amount)}</Text>
                    </Column>
                  </Row>
                </Section>
              ))}
            </Section>
  
            <Hr style={divider} />
  
            {/* Action Required */}
            <Section style={actionSection}>
              <Text style={actionTitle}>🔄 必要なアクション</Text>
              <Text style={actionText}>
                • 返金処理の実行
                <br />• 在庫の復元確認
                <br />• 発送済みの場合は回収手配
                <br />• お客様への返金完了通知
              </Text>
            </Section>
  
            {/* Urgent Notice */}
            <Section style={urgentSection}>
              <Text style={urgentTitle}>⚡ 緊急対応事項</Text>
              <Text style={urgentText}>
                返金処理は3〜7営業日以内に完了してください。
                <br />
                お客様からの問い合わせに備えて、キャンセル理由を記録しておいてください。
              </Text>
            </Section>
          </Section>
  
          {/* Footer */}
          <Section style={footer}>
            <Text style={footerText}>
              <strong>STAR SHOP 管理通知システム</strong>
              <br />
              自動送信日時: {cancelDate}
            </Text>
  
            <Text style={disclaimer}>※このメールは自動送信です。</Text>
          </Section>
        </Container>
      </Body>
    </Html>
  )
  
  // Styles
  const main = {
    backgroundColor: "#f3f4f6",
    fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
  }
  
  const container = {
    backgroundColor: "#ffffff",
    margin: "0 auto",
    padding: "20px 0 48px",
    marginBottom: "64px",
    maxWidth: "600px",
    border: "1px solid #e5e7eb",
  }
  
  const header = {
    padding: "20px 30px",
    backgroundColor: "#dc2626",
    textAlign: "center" as const,
  }
  
  const logo = {
    margin: "0 auto 10px",
  }
  
  const headerText = {
    color: "#ffffff",
    fontSize: "14px",
    fontWeight: "bold",
    margin: "0",
  }
  
  const cancelBanner = {
    backgroundColor: "#fef2f2",
    padding: "15px 30px",
    borderLeft: "4px solid #dc2626",
  }
  
  const cancelText = {
    color: "#dc2626",
    fontSize: "16px",
    fontWeight: "bold",
    margin: "0",
    textAlign: "center" as const,
  }
  
  const content = {
    padding: "30px",
  }
  
  const h1 = {
    color: "#1f2937",
    fontSize: "24px",
    fontWeight: "bold",
    margin: "0 0 20px",
    textAlign: "center" as const,
  }
  
  const h2 = {
    color: "#1f2937",
    fontSize: "18px",
    fontWeight: "bold",
    margin: "0 0 16px",
  }
  
  const adminGreeting = {
    color: "#1f2937",
    fontSize: "16px",
    margin: "0 0 16px",
    fontWeight: "bold",
  }
  
  const text = {
    color: "#4b5563",
    fontSize: "16px",
    lineHeight: "24px",
    margin: "0 0 20px",
  }
  
  const cancelSummary = {
    backgroundColor: "#fef2f2",
    padding: "20px",
    borderRadius: "8px",
    border: "1px solid #fecaca",
    margin: "20px 0",
  }
  
  const summaryRow = {
    marginBottom: "16px",
  }
  
  const summaryIconColumn = {
    width: "40px",
    verticalAlign: "top" as const,
  }
  
  const summaryContentColumn = {
    verticalAlign: "top" as const,
  }
  
  const summaryIcon = {
    fontSize: "20px",
    margin: "0",
  }
  
  const summaryTitle = {
    color: "#6b7280",
    fontSize: "14px",
    margin: "0 0 4px",
    fontWeight: "500",
  }
  
  const summaryValue = {
    color: "#1f2937",
    fontSize: "16px",
    margin: "0",
    fontWeight: "bold",
  }
  
  const summaryValueHighlight = {
    color: "#dc2626",
    fontSize: "18px",
    margin: "0",
    fontWeight: "bold",
  }
  
  const divider = {
    borderColor: "#e5e7eb",
    margin: "30px 0",
  }
  
  const productsSection = {
    margin: "20px 0",
  }
  
  const tableHeader = {
    backgroundColor: "#f3f4f6",
    padding: "12px 16px",
    borderRadius: "6px 6px 0 0",
  }
  
  const tableHeaderColumn = {
    width: "40%",
  }
  
  const tableHeaderColumnSmall = {
    width: "20%",
    textAlign: "center" as const,
  }
  
  const tableHeaderText = {
    color: "#374151",
    fontSize: "14px",
    fontWeight: "bold",
    margin: "0",
  }
  
  const tableRow = {
    padding: "12px 16px",
    borderBottom: "1px solid #f3f4f6",
  }
  
  const tableColumn = {
    width: "40%",
    verticalAlign: "top" as const,
  }
  
  const tableColumnSmall = {
    width: "20%",
    textAlign: "center" as const,
    verticalAlign: "top" as const,
  }
  
  const tableCellText = {
    color: "#4b5563",
    fontSize: "14px",
    margin: "0",
  }
  
  const actionSection = {
    backgroundColor: "#eff6ff",
    padding: "20px",
    borderRadius: "8px",
    border: "1px solid #bfdbfe",
    margin: "20px 0",
  }
  
  const actionTitle = {
    color: "#1e40af",
    fontSize: "16px",
    fontWeight: "bold",
    margin: "0 0 12px",
  }
  
  const actionText = {
    color: "#1e40af",
    fontSize: "14px",
    lineHeight: "20px",
    margin: "0",
  }
  
  const urgentSection = {
    backgroundColor: "#fef3c7",
    padding: "20px",
    borderRadius: "8px",
    border: "1px solid #fbbf24",
    margin: "20px 0",
  }
  
  const urgentTitle = {
    color: "#92400e",
    fontSize: "16px",
    fontWeight: "bold",
    margin: "0 0 12px",
  }
  
  const urgentText = {
    color: "#92400e",
    fontSize: "14px",
    lineHeight: "20px",
    margin: "0",
  }
  
  const footer = {
    padding: "30px",
    backgroundColor: "#f9fafb",
    textAlign: "center" as const,
    borderTop: "1px solid #e5e7eb",
  }
  
  const footerText = {
    color: "#6b7280",
    fontSize: "14px",
    lineHeight: "20px",
    margin: "0 0 12px",
  }
  
  const disclaimer = {
    color: "#9ca3af",
    fontSize: "12px",
    margin: "0",
  }
  
  export default CancelOrderMail
  