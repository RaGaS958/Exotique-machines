import { useEffect, useState, type ReactNode } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { useRoute, type Route } from './lib/router';
import { useStore } from './lib/store';
import { initSmoothScroll, prefersReducedMotion, scrollToTop } from './lib/smooth';
import Header from './components/Header';
import Footer from './components/Footer';
import Intro from './components/Intro';
import SavedDrawer from './components/SavedDrawer';
import EnquiryDialog from './components/EnquiryDialog';
import { MobileBar, Toast } from './components/Chrome';
import HomeView from './views/HomeView';
import { heroFirstSrc } from './views/home/Hero';
import CollectionView from './views/CollectionView';
import CarView from './views/CarView';
import AtelierView from './views/AtelierView';
import FinanceView from './views/FinanceView';
import TradeInView from './views/TradeInView';
import ServiceView from './views/ServiceView';
import ViewingView from './views/ViewingView';
import VisitView from './views/VisitView';
import NotFound from './views/NotFound';

const INTRO_KEY = 'exotique.intro-seen';

function shouldPlayIntro() {
  try {
    if (prefersReducedMotion()) return false;
    const onHome = (window.location.hash.replace(/^#/, '') || '/').split('?')[0].replace(/\/+$/, '') === '';
    return onHome && !sessionStorage.getItem(INTRO_KEY);
  } catch {
    return false;
  }
}

function page(route: Route, ready: boolean): ReactNode {
  const [first, second] = route.segments;
  switch (first) {
    case undefined:
      return <HomeView ready={ready} />;
    case 'collection':
      return <CollectionView query={route.query} />;
    case 'car':
      return <CarView id={second} />;
    case 'atelier':
      return <AtelierView />;
    case 'finance':
      return <FinanceView query={route.query} />;
    case 'trade-in':
      return <TradeInView />;
    case 'service':
      return <ServiceView />;
    case 'viewing':
      return <ViewingView query={route.query} />;
    case 'visit':
      return <VisitView />;
    default:
      return <NotFound />;
  }
}

export default function App() {
  const route = useRoute();
  const [playIntro] = useState(shouldPlayIntro);
  const [ready, setReady] = useState(!playIntro);

  const { setDrawerOpen, closeEnquiry } = useStore();

  useEffect(() => {
    initSmoothScroll();
  }, []);

  // Back/forward should never leave a panel hanging over the next page.
  useEffect(() => {
    setDrawerOpen(false);
    closeEnquiry();
  }, [route.path]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <>
      {playIntro && (
        <Intro
          heroSrc={heroFirstSrc()}
          onReveal={() => {
            setReady(true);
            try {
              sessionStorage.setItem(INTRO_KEY, '1');
            } catch {
              /* private mode */
            }
          }}
        />
      )}

      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[120] focus:rounded-full focus:bg-bone focus:px-4 focus:py-2 focus:text-ink">
        Skip to content
      </a>

      <Header path={route.path} />

      <AnimatePresence mode="wait" onExitComplete={() => scrollToTop()}>
        <motion.div
          key={route.path}
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } }}
          exit={{ opacity: 0, transition: { duration: 0.28, ease: [0.4, 0, 1, 1] } }}
        >
          <main id="main" tabIndex={-1} className="outline-none">
            {page(route, ready)}
          </main>
          <Footer />
        </motion.div>
      </AnimatePresence>

      <MobileBar />
      <SavedDrawer />
      <EnquiryDialog />
      <Toast />
    </>
  );
}
