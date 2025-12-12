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
  Button,
} from '@react-email/components';

type ResetPasswordRequestProps = {
  email: string;
  name?: string | null;
  timestamp: string;
  dashboardUrl: string;
};

export function ResetPasswordRequest({
  email,
  name,
  timestamp,
  dashboardUrl,
}: ResetPasswordRequestProps) {
  return (
    <Html>
      <Head />
      <Body style={styles.body}>
        <Container style={styles.container}>
          <Heading style={styles.heading}>
            Neue Passwort-Zurücksetzungsanfrage
          </Heading>

          <Section style={styles.warningBox}>
            <Text style={styles.warningText}>
              ⚠️ Eine neue Anfrage zum Zurücksetzen des Passworts wurde eingereicht.
            </Text>
          </Section>

          <Section style={styles.infoBox}>
            <Text style={styles.infoRow}>
              <span style={styles.label}>Benutzer E-Mail:</span>{' '}
              <Link href={`mailto:${email}`} style={styles.link}>
                {email}
              </Link>
            </Text>
            {name && (
              <Text style={styles.infoRow}>
                <span style={styles.label}>Name:</span> {name}
              </Text>
            )}
            <Text style={styles.infoRow}>
              <span style={styles.label}>Zeitpunkt:</span> {timestamp}
            </Text>
          </Section>

          <Section style={styles.stepsBox}>
            <Heading as="h3" style={styles.subHeading}>
              Nächste Schritte:
            </Heading>
            <ol style={styles.stepsList}>
              <li>Melden Sie sich im Admin-Dashboard an</li>
              <li>Navigieren Sie zu &quot;Passwort-Zurücksetzungsanfragen&quot;</li>
              <li>Überprüfen Sie die Anfrage und setzen Sie das Passwort zurück</li>
              <li>Teilen Sie das neue Passwort dem Benutzer mit</li>
            </ol>
          </Section>

          <Section style={styles.buttonSection}>
            <Button href={dashboardUrl} style={styles.button}>
              Anfragen verwalten
            </Button>
          </Section>

          <Hr style={styles.hr} />

          <Text style={styles.footer}>
            Diese Benachrichtigung wurde automatisch von My Smart Health gesendet.
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
    margin: '0 0 16px 0',
  },
  warningBox: {
    backgroundColor: '#fff3cd',
    borderLeft: '4px solid #ffc107',
    borderRadius: '8px',
    padding: '20px',
    marginBottom: '20px',
  },
  warningText: {
    color: '#856404',
    fontSize: '16px',
    fontWeight: '600' as const,
    margin: 0,
  },
  infoBox: {
    backgroundColor: '#f5f5f5',
    borderRadius: '8px',
    padding: '20px',
    marginBottom: '20px',
  },
  infoRow: {
    color: '#374151',
    fontSize: '14px',
    margin: '0 0 8px 0',
    lineHeight: '1.6',
  },
  label: {
    fontWeight: '600' as const,
    color: '#111827',
  },
  link: {
    color: '#2db9bc',
    textDecoration: 'underline',
  },
  stepsBox: {
    backgroundColor: '#e7f9f9',
    borderRadius: '8px',
    padding: '20px',
    marginBottom: '24px',
  },
  stepsList: {
    color: '#374151',
    fontSize: '14px',
    lineHeight: '1.8',
    margin: 0,
    paddingLeft: '20px',
  },
  buttonSection: {
    textAlign: 'center' as const,
    marginBottom: '24px',
  },
  button: {
    backgroundColor: '#2db9bc',
    borderRadius: '6px',
    color: '#ffffff',
    fontSize: '14px',
    fontWeight: 'bold' as const,
    padding: '12px 24px',
    textDecoration: 'none',
    display: 'inline-block',
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
