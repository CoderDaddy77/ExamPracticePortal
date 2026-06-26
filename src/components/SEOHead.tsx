import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

interface SEOHeadProps {
  title?: string;
  description?: string;
  canonicalPath?: string;
}

const BASE_URL = 'https://exam-practice-portal.web.app';
const DEFAULT_TITLE = 'Exam Practice Portal — Free Mock Tests, Study Notes & CUET Preparation';
const DEFAULT_DESCRIPTION =
  'Free online exam practice portal with realistic CUET mock tests, timed assessments, study material, bookmarks, and performance analytics. Practice anytime, anywhere.';

export function SEOHead({ title, description, canonicalPath }: SEOHeadProps) {
  const location = useLocation();

  useEffect(() => {
    const pageTitle = title || DEFAULT_TITLE;
    const pageDescription = description || DEFAULT_DESCRIPTION;
    const pagePath = canonicalPath || location.pathname;
    const canonicalUrl = `${BASE_URL}${pagePath}`;

    // Update document title
    document.title = pageTitle;

    // Helper to set/create a meta tag
    const setMeta = (attr: string, key: string, content: string) => {
      let el = document.querySelector(`meta[${attr}="${key}"]`) as HTMLMetaElement | null;
      if (!el) {
        el = document.createElement('meta');
        el.setAttribute(attr, key);
        document.head.appendChild(el);
      }
      el.setAttribute('content', content);
    };

    // Standard meta
    setMeta('name', 'description', pageDescription);

    // Open Graph
    setMeta('property', 'og:title', pageTitle);
    setMeta('property', 'og:description', pageDescription);
    setMeta('property', 'og:url', canonicalUrl);

    // Twitter
    setMeta('name', 'twitter:title', pageTitle);
    setMeta('name', 'twitter:description', pageDescription);

    // Canonical link
    let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', canonicalUrl);
  }, [title, description, canonicalPath, location.pathname]);

  return null;
}

/**
 * Generates a page-specific SEO title in format:
 * "Physics - CUET | Exam Practice Portal"
 */
export function buildTitle(...parts: (string | undefined | null)[]): string {
  const filtered = parts.filter(Boolean) as string[];
  if (filtered.length === 0) return DEFAULT_TITLE;
  return `${filtered.join(' - ')} | Exam Practice Portal`;
}

/**
 * Generates a page-specific SEO description
 */
export function buildDescription(category?: string, subject?: string, extra?: string): string {
  const parts: string[] = [];
  if (category) parts.push(category);
  if (subject) parts.push(subject);
  const prefix = parts.length > 0 ? `${parts.join(' ')} ` : '';
  return `${prefix}${extra || 'Free online mock tests, study material, and performance analytics'}. Practice anytime on Exam Practice Portal.`;
}
