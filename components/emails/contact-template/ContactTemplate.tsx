import {
  Html,
  Head,
  Body,
  Container,
  Section,
  Text,
  Link,
  Hr,
  Heading,
  Row,
  Column,
} from '@react-email/components';

type ContactTemplateProps = {
  name: string;
  surname: string;
  email: string;
  phoneNumber: string;
  message: string;
};

export function ContactTemplate({
  name,
  surname,
  email,
  phoneNumber,
  message,
}: ContactTemplateProps) {
  return (
    <Html>
      <Head />
      <Body style={styles.body}>
        <Container style={styles.container}>
          <Heading style={styles.heading}>Neue Kontaktformular-Nachricht</Heading>

          <Section style={styles.infoBox}>
            <Row style={styles.row}>
              <Column style={styles.labelColumn}>
                <Text style={styles.label}>Name</Text>
              </Column>
              <Column style={styles.valueColumn}>
                <Text style={styles.value}>{name}</Text>
              </Column>
            </Row>

            <Row style={styles.row}>
              <Column style={styles.labelColumn}>
                <Text style={styles.label}>Vorname</Text>
              </Column>
              <Column style={styles.valueColumn}>
                <Text style={styles.value}>{surname}</Text>
              </Column>
            </Row>

            <Row style={styles.row}>
              <Column style={styles.labelColumn}>
                <Text style={styles.label}>Email</Text>
              </Column>
              <Column style={styles.valueColumn}>
                <Link href={`mailto:${email}`} style={styles.link}>
                  {email}
                </Link>
              </Column>
            </Row>

            <Row style={styles.row}>
              <Column style={styles.labelColumn}>
                <Text style={styles.label}>Telefon</Text>
              </Column>
              <Column style={styles.valueColumn}>
                <Text style={styles.value}>{phoneNumber}</Text>
              </Column>
            </Row>
          </Section>

          <Section style={styles.messageSection}>
            <Heading as="h3" style={styles.subHeading}>
              Nachricht
            </Heading>
            <Text style={styles.messageText}>{message}</Text>
          </Section>

          <Hr style={styles.hr} />

          <Text style={styles.footer}>
            Diese Nachricht wurde über das Kontaktformular auf My Smart Health gesendet.
          </Text>
        </Container>
      </Body>
    </Html>
  );
}

const styles = {
  body: {
    backgroundColor: '#f4f4f5',
    fontFamily: 'Arial, sans-serif',
    margin: 0,
    padding: '20px 0',
  },
  container: {
    backgroundColor: '#ffffff',
    borderRadius: '8px',
    maxWidth: '600px',
    margin: '0 auto',
    padding: '32px',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
  },
  heading: {
    color: '#2db9bc',
    fontSize: '24px',
    fontWeight: 'bold' as const,
    margin: '0 0 24px 0',
    textAlign: 'center' as const,
  },
  subHeading: {
    color: '#2db9bc',
    fontSize: '18px',
    fontWeight: '600' as const,
    margin: '0 0 12px 0',
  },
  infoBox: {
    backgroundColor: '#f9fafb',
    borderRadius: '8px',
    padding: '20px',
    marginBottom: '24px',
    border: '1px solid #e5e7eb',
  },
  row: {
    marginBottom: '12px',
  },
  labelColumn: {
    width: '120px',
    verticalAlign: 'top' as const,
  },
  valueColumn: {
    verticalAlign: 'top' as const,
  },
  label: {
    color: '#6b7280',
    fontSize: '14px',
    fontWeight: '600' as const,
    margin: 0,
  },
  value: {
    color: '#111827',
    fontSize: '14px',
    margin: 0,
  },
  link: {
    color: '#2db9bc',
    fontSize: '14px',
    textDecoration: 'underline',
  },
  messageSection: {
    marginBottom: '24px',
  },
  messageText: {
    color: '#374151',
    fontSize: '14px',
    lineHeight: '1.6',
    whiteSpace: 'pre-wrap' as const,
    margin: 0,
  },
  hr: {
    borderColor: '#e5e7eb',
    margin: '24px 0',
  },
  footer: {
    color: '#9ca3af',
    fontSize: '12px',
    textAlign: 'center' as const,
    margin: 0,
  },
};