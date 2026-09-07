import { Platform } from 'react-native';
import Head from 'expo-router/head';

interface SeoHeadProps {
  title?: string;
  description?: string;
  canonicalUrl?: string;
  keywords?: string;
  ogImage?: string;
  ogType?: string;
  noIndex?: boolean;
}

const DEFAULT_TITLE =
  'DuoBalance — Finanzas Compartidas para Parejas y Grupos';
const DEFAULT_DESCRIPTION =
  'Gestiona y divide los gastos de pareja y grupos fácilmente. Balances transparentes en tiempo real, liquidación de saldos y control financiero sin estrés.';
const DEFAULT_KEYWORDS =
  'finanzas en pareja, dividir gastos, cuentas claras pareja, gastos compartidos, splitwise alternativa, control de gastos en grupo, liquidacion de saldos';
const SITE_URL = 'https://duobalance-app.pages.dev';
const DEFAULT_OG_IMAGE = `${SITE_URL}/favicon.png`;

export function SeoHead({
  title = DEFAULT_TITLE,
  description = DEFAULT_DESCRIPTION,
  canonicalUrl = SITE_URL,
  keywords = DEFAULT_KEYWORDS,
  ogImage = DEFAULT_OG_IMAGE,
  ogType = 'website',
  noIndex = false,
}: SeoHeadProps) {
  // En móviles nativos, no inyectamos etiquetas HTML en el DOM
  if (Platform.OS !== 'web') {
    return null;
  }

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'DuoBalance',
    url: SITE_URL,
    description: DEFAULT_DESCRIPTION,
    applicationCategory: 'FinanceApplication',
    operatingSystem: 'Web, Android, iOS',
    inLanguage: 'es',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
  };

  return (
    <Head>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="author" content="DuoBalance" />
      <meta
        name="robots"
        content={noIndex ? 'noindex, nofollow' : 'index, follow'}
      />
      <link rel="canonical" href={canonicalUrl} />

      {/* Open Graph (Facebook, WhatsApp, LinkedIn) */}
      <meta property="og:site_name" content="DuoBalance" />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={ogType} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:locale" content="es_ES" />

      {/* Twitter Cards */}
      <meta name="twitter:card" content="summary" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />

      {/* Structured Data (Schema.org) */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
    </Head>
  );
}
