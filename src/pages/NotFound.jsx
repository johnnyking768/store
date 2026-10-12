import { Helmet } from "react-helmet-async";
import { WifiOff } from "lucide-react";
import { copy } from "../data/content";
import { site } from "../config/site";
import SEO from "../components/SEO";
import { Button } from "../components/ui";
export default function NotFound() {
  return (
    <section className="container empty-state page-empty">
      <Helmet>
        <title>Page not found | {site.name}</title>
        <meta name="robots" content="noindex" />
      </Helmet>
      <SEO title="Page not found" description={copy.notFound.description} /><WifiOff size={48} />
      <p className="eyebrow">{copy.notFound.eyebrow}</p>
      <h1>{copy.notFound.title}</h1>
      <p>{copy.notFound.description}</p>
      <Button to="/">{copy.notFound.action}</Button>
    </section>
  );
}
