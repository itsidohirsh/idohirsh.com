// Pages Function middleware: 301 www.idohirsh.com -> idohirsh.com (bare canonical),
// preserving path + query. All other requests pass through to static assets.
// (Cloudflare Pages _redirects can't do domain-level redirects, so this does it.)
export async function onRequest(context) {
  const url = new URL(context.request.url);
  if (url.hostname === "www.idohirsh.com") {
    url.hostname = "idohirsh.com";
    return Response.redirect(url.toString(), 301);
  }
  return context.next();
}
