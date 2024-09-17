import {
  Body,
  Column,
  Container,
  Head,
  Hr,
  Html,
  Link,
  Preview,
  Row,
  Section,
  Text,
} from "@react-email/components";

export const PurchaseConfirmationEmail = ({
  email = "alan.turing@gmail.com",
  cardVariant = "basic",
  shippingAddress = "Av. Paula, São Paulo, SP, Brazil",
}: {
  email: string;
  cardVariant: "basic" | "custom" | "metallic";
  shippingAddress: string;
}) => (
  <Html>
    <Head />
    <Preview>NFC {cardVariant.toLocaleUpperCase()} Edition | Receipt</Preview>

    <Body style={main}>
      <Container style={container}>
        <Row>
          <Text
            style={{
              fontSize: "24px",
              fontWeight: "bold",
            }}
          >
            Thank you for your purchase! 🎉
          </Text>

          <Text>
            We truly appreciate the support and trust given and are excited to offer you the
            following card:
          </Text>

          <Text
            style={{
              fontWeight: "bold",
              paddingBlock: "10px",
              border: "1px solid #000000",
              borderRight: "none",
              borderLeft: "none",
            }}
          >
            NFC Business | {cardVariant.toLocaleUpperCase()} Edition
          </Text>

          <Text>
            It contains all the features you decided to include in the onboarding process.
          </Text>

          <Text>
            Your card will be delivered as soon as possible to the address below. Contact us for any
            questions!{" "}
            <Link href="mailto:support@stackkstudios.com" style={{ textDecoration: "underline" }}>
              support@stackkstudios.com
            </Link>
          </Text>
        </Row>

        <Section>
          <Row>
            <Column>
              <Text>OUR LOGO</Text>
            </Column>

            <Column align="right" style={tableCell}>
              <Text style={heading}>Confirmation</Text>
            </Column>
          </Row>
        </Section>

        <Section style={informationTable}>
          <Row style={informationTableRow}>
            <Column colSpan={2}>
              <Section>
                <Row>
                  <Column style={informationTableColumn}>
                    <Text style={informationTableLabel}>Email</Text>
                    <Link
                      style={{
                        ...informationTableValue,
                        color: "#15c",
                        textDecoration: "underline",
                      }}
                    >
                      {email}
                    </Link>
                  </Column>
                </Row>

                <Row>
                  <Column style={informationTableColumn}>
                    <Text style={informationTableLabel}>DATE</Text>
                    <Text style={informationTableValue}>{new Date().toLocaleDateString()}</Text>
                  </Column>
                </Row>
              </Section>
            </Column>

            <Column style={informationTableColumn} colSpan={2}>
              <Text style={informationTableLabel}>BILLED TO</Text>
              <Text style={informationTableValue}>{shippingAddress}</Text>
            </Column>
          </Row>
        </Section>

        <Hr style={walletBottomLine} />

        <Text style={footerCopyright}>
          Copyright © 2024 StackkStudios <br /> <span>All rights reserved</span>
        </Text>
      </Container>
    </Body>
  </Html>
);

export default PurchaseConfirmationEmail;

const main = {
  fontFamily: '"Helvetica Neue",Helvetica,Arial,sans-serif',
  backgroundColor: "#ffffff",
};

const resetText = {
  margin: "0",
  padding: "0",
  lineHeight: 1.4,
};

const container = {
  margin: "0 auto",
  padding: "20px 0 48px",
  width: "660px",
  maxWidth: "100%",
};

const tableCell = { display: "table-cell" };

const heading = {
  fontSize: "32px",
  fontWeight: "300",
  color: "#888888",
};

const informationTable = {
  borderCollapse: "collapse" as const,
  borderSpacing: "0px",
  color: "rgb(51,51,51)",
  backgroundColor: "rgb(250,250,250)",
  borderRadius: "3px",
  fontSize: "12px",
};

const informationTableRow = {
  height: "46px",
};

const informationTableColumn = {
  paddingLeft: "20px",
  borderStyle: "solid",
  borderColor: "white",
  borderWidth: "0px 1px 1px 0px",
  height: "44px",
};

const informationTableLabel = {
  ...resetText,
  color: "rgb(102,102,102)",
  fontSize: "10px",
};

const informationTableValue = {
  fontSize: "12px",
  margin: "0",
  padding: "0",
  lineHeight: 1.4,
};

const walletBottomLine = { margin: "65px 0 20px 0" };

const footerCopyright = {
  margin: "25px 0 0 0",
  textAlign: "center" as const,
  fontSize: "12px",
  color: "rgb(102,102,102)",
};
