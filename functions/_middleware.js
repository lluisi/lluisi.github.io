export async function onRequest(context) {
  const request = context.request;
  const url = new URL(request.url);
  
  // Skip middleware for assets
  if (url.pathname.startsWith('/assets/')) {
    return context.next();
  }

  // Check for preferred language header
  const preferredLang = request.headers.get('X-Preferred-Language');
  if (preferredLang) {
    if (preferredLang === 'ca' && !url.pathname.startsWith('/ca/')) {
      return Response.redirect(`${url.origin}/ca/`, 302);
    }
    if (preferredLang === 'en' && url.pathname.startsWith('/ca/')) {
      return Response.redirect(`${url.origin}/`, 302);
    }
    return context.next();
  }

  // Get user's preferred languages from the Accept-Language header
  const acceptLanguage = request.headers.get('Accept-Language') || '';
  const preferredLanguages = acceptLanguage
    .split(',')
    .map(lang => lang.split(';')[0].trim().toLowerCase());

  // Check if user is explicitly requesting Catalan version
  if (url.pathname.startsWith('/ca/')) {
    return context.next();
  }

  // Check if user is on the root path and prefers Catalan
  if (url.pathname === '/' && (
    preferredLanguages.includes('ca') ||
    preferredLanguages.includes('ca-es')
  )) {
    // Redirect to Catalan version
    return Response.redirect(`${url.origin}/ca/`, 302);
  }

  // Otherwise, continue to the English version
  return context.next();
} 