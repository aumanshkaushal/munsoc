import Link from "next/link";

export default function NotFound() {
  return (
    <main className="site-container page-flow">
      <p className="editorial-label">Error 404</p>
      <h1 className="editorial-title page-title">Page not found</h1>
      <p className="page-description">If you were looking for a past event, try the archive.</p>
      <Link href="/events" className="outline-link mt-6">Browse the archive</Link>
    </main>
  );
}
