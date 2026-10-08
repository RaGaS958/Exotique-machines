import { SHOWROOM } from '../data/site';
import { useStore } from '../lib/store';
import { Link } from '../lib/router';
import { useTitle } from '../lib/useTitle';
import { PageIntro } from '../components/Chrome';
import Img from '../components/Img';

export default function VisitView() {
  useTitle('Visit the showroom');
  const { openEnquiry } = useStore();

  return (
    <>
      <PageIntro title="Visit the showroom" lead="We are in Gomti Nagar, a few minutes from the Ambedkar Memorial Park. Walk in during opening hours, or book a time and we will have your car ready." />

      <section className="wrap pb-24 md:pb-36">
        <div className="relative aspect-[16/10] overflow-hidden rounded-[3px] bg-carbon md:aspect-[21/9]">
          <Img id="photo-1618642624018-a370cbf3cd80" sizes="100vw" alt="Cars on display behind the showroom glass at night" className="absolute inset-0 h-full w-full object-cover" position="50% 62%" />
        </div>

        <div className="mt-16 grid gap-14 md:mt-24 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-5">
            <h2 className="t-h3">Address</h2>
            <address className="t-lead mt-4 not-italic">
              {SHOWROOM.address.map((l) => (
                <span key={l} className="block">{l}</span>
              ))}
            </address>
            <a href={SHOWROOM.mapsUrl} target="_blank" rel="noreferrer" className="btn btn-ghost mt-8">
              Open in Google Maps
            </a>

            <h2 className="t-h3 mt-16">Opening hours</h2>
            <dl className="mt-4 border-t border-line text-[0.9375rem]">
              {SHOWROOM.hours.map((h) => (
                <div key={h.days} className="flex justify-between gap-4 border-b border-line py-4">
                  <dt className="t-label">{h.days}</dt>
                  <dd className="t-num">{h.time}</dd>
                </div>
              ))}
            </dl>
            <p className="mt-4 t-label">The workshop keeps the same hours. Closed on national holidays.</p>
          </div>

          <div className="lg:col-span-6 lg:col-start-7">
            <h2 className="t-h3">Talk to us</h2>
            <ul className="mt-4 border-t border-line">
              {[
                { label: 'Call', value: SHOWROOM.phoneDisplay, href: SHOWROOM.phoneHref, note: 'Sales and service' },
                { label: 'WhatsApp', value: 'Message the sales team', href: SHOWROOM.whatsappHref, note: 'Usually answered within the hour' },
                { label: 'Email', value: SHOWROOM.email, href: `mailto:${SHOWROOM.email}`, note: 'For documents and quotations' },
              ].map((c) => (
                <li key={c.label} className="border-b border-line">
                  <a href={c.href} target={c.href.startsWith('http') ? '_blank' : undefined} rel="noreferrer" className="group grid grid-cols-3 gap-4 py-5">
                    <span className="t-label">{c.label}</span>
                    <span className="col-span-2">
                      <span className="link-under block w-fit text-[1rem] t-num break-all">{c.value}</span>
                      <span className="mt-1 block t-label">{c.note}</span>
                    </span>
                  </a>
                </li>
              ))}
            </ul>
            <div className="mt-10 flex flex-wrap gap-3">
              <Link to="/viewing" className="btn btn-primary">
                Book a viewing
              </Link>
              <button className="btn btn-ghost" onClick={() => openEnquiry()}>
                Send an enquiry
              </button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
