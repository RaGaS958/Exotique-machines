import { Link } from '../lib/router';
import { useTitle } from '../lib/useTitle';

export default function NotFound() {
  useTitle('Page not found');
  return (
    <section className="wrap flex min-h-[80svh] flex-col justify-end pb-24 pt-[calc(var(--header-h)+80px)]">
      <h1 className="t-h1 max-w-[16ch] text-balance">This page has been sold, or never existed.</h1>
      <p className="t-lead mt-6 text-ash max-w-[44ch]">The link may be out of date. Everything currently for sale is in the collection.</p>
      <div className="mt-10 flex flex-wrap gap-3">
        <Link to="/collection" className="btn btn-primary">
          See the collection
        </Link>
        <Link to="/" className="btn btn-ghost">
          Go to the home page
        </Link>
      </div>
    </section>
  );
}
