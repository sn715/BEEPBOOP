import Image from "next/image";
import SignupForm from "@/components/SignupForm";
import Tilt from "@/components/Tilt";
import ScrollWords from "@/components/ScrollWords";
import SiteEffects from "@/components/SiteEffects";
import { siteConfig } from "@/lib/config";

const marqueeItems = ["log the show", "rate it", "rank it", "times seen", "the fit", "view from my seat", "tour lore", "the recap"];

const steps = [
  { title: "Log the show", body: "Search the artist and we'll find the date and venue for you." },
  {
    title: "Rate it, then rank it",
    body: 'Give it stars and write a line. Then answer "which was better?" against shows you\'ve already logged, and your all-time ranking builds itself.',
  },
  { title: "Add the night", body: "Photos, clips, the setlist, your fit, your notes. Keep whatever you want to remember." },
  { title: "Share it, or don't", body: "Every post can be private, friends only or public. You pick each time." },
];

const features = [
  {
    title: "Your ranking, not just a rating",
    body: "Stars are easy. Picking between two nights you loved is harder, and more honest. beep boop asks, and your top shows sort themselves.",
  },
  { title: "Times seen", body: "Fourth time seeing them? Every entry and artist page keeps count." },
  { title: "View from my seat", body: "Check the view before you buy. Fans post photos by venue and section." },
  { title: "Tour lore", body: "Know the bit before you go: the chant, the sign, the thing everyone's wearing to this tour." },
  { title: "Fits", body: "Post your concert outfit to the entry and get ideas for the next one." },
  { title: "Friends going", body: "See who's going, who's there tonight, and who just logged the show you missed." },
  { title: "Share card", body: "Turn any entry into a ticket stub for your story or the group chat." },
  { title: "Your year in live music", body: "Every December, get your recap: shows, artists, venues and your number one night." },
];

const privacyLabels = [
  { icon: "●", title: "Private", body: "Only you." },
  { icon: "●●", title: "Friends", body: "People you both follow." },
  { icon: "○", title: "Public", body: "Anyone, and it helps other fans pick seats.", open: true },
];

const faqs: Array<{ q: string; a: React.ReactNode }> = [
  {
    q: "Can I add shows I went to years ago?",
    a: "Yes. Search the artist and date, and the show goes on your shelf like any other. Most people start by logging their past shows.",
  },
  {
    q: "Does it work for any concert?",
    a: "Any artist, any venue, from stadium tours to a friend's band at a bar. If we can't find a show, you can add it yourself.",
  },
  { q: "Who can see my journal?", a: "You decide on every post: private, friends only or public. Friends only is the default." },
  { q: "Do I have to film the show?", a: "No. Log it with a rating and a few words. Photos and clips are there if you want them." },
  { q: "How much does it cost?", a: <span className="tbc">tbc: free / price. update before launch.</span> },
  { q: "When can I get it?", a: "We're letting people in from the waitlist soon." },
];

export default function Home() {
  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>

      {/* ===== Header ===== */}
      <header className="site-header">
        <div className="container site-header__inner">
          <a href="#top" className="wordmark">
            {siteConfig.name}
          </a>
          <nav className="site-header__nav" aria-label="Page">
            <a href="#how" className="link">How it works</a>
            <a href="#features" className="link">Features</a>
            <a href="#questions" className="link">Questions</a>
            <a href="#waitlist" className="btn btn--sm" data-cta="header">Join the waitlist</a>
          </nav>
        </div>
      </header>

      <main id="main" className="page">
        {/* ===== Hero ===== */}
        <section className="hero" id="top" aria-labelledby="hero-title">
          <div className="container hero__grid">
            <div className="hero__copy">
              <h1 id="hero-title" className="hero__title">
                Every show you&apos;ve ever been to, in one <span className="accent">place.</span>
              </h1>
              <p className="hero__lead">
                beep boop is a concert journal for fans. Log every show, rate it, rank it against the rest, and keep your photos, clips and notes from the night together. Share it with friends, or keep it just for you.
              </p>

              <div className="hero__cta">
                <SignupForm location="hero" />
                <a className="btn btn--ghost" href="#how">See how it works</a>
              </div>
              <p className="hero__note">Coming soon to iPhone.</p>
            </div>

            <Tilt className="hero__media">
              <div className="phones">
                <div className="phone phone--back">
                  <Image
                    src="/images/phone-diary.png"
                    width={500}
                    height={877}
                    alt="The diary screen on an iPhone: shows grouped by month, including Ryan Beatty, Kali Uchis, Playboi Carti, Sabrina Carpenter, Djo, Lorde and Tate McRae, each with the venue, date and a photo."
                    priority
                  />
                </div>
                <div className="phone phone--front">
                  <Image
                    src="/images/phone-journal.png"
                    width={500}
                    height={877}
                    alt="A journal entry on an iPhone for Ryan Beatty at the Greek Theater: concert photos, a four-star rating and a written review."
                    priority
                  />
                </div>
              </div>
              <figcaption className="caption">your next show, already on the shelf.</figcaption>
            </Tilt>
          </div>
        </section>

        <div className="marquee" aria-hidden="true">
          <div className="marquee__track">
            {[...marqueeItems, ...marqueeItems].map((item, i) => (
              <span key={i}>{item}</span>
            ))}
          </div>
        </div>

        {/* ===== Problem ===== */}
        <section className="section tradeoff" id="problem" aria-labelledby="problem-title">
          <div className="container">
            <h2 id="problem-title" className="tradeoff__heading">
              Your best nights are scattered across five apps.
            </h2>
            <ScrollWords
              className="tradeoff__text"
              text="The clips are in your camera roll. The ticket's buried in your email. The setlist is on some website, and the story lives in a group chat you'll never scroll back through. beep boop puts the whole night in one place, and keeps every night after it."
            />
          </div>
        </section>

        <figure className="photo-band reveal">
          <div className="placeholder placeholder--bleed" role="img" aria-label="Image placeholder">
            <span className="placeholder__label">photo: a crowd from behind, warm low light, phones down, eyes on the stage</span>
          </div>
        </figure>

        {/* ===== How it works ===== */}
        <section className="section section--paper how" id="how" aria-labelledby="how-title">
          <div className="container">
            <h2 id="how-title" className="how__title reveal">Log it in under a minute.</h2>
            <ol className="how__steps">
              {steps.map((step, i) => (
                <li className="reveal" key={step.title}>
                  <span className="how__num">{i + 1}</span>
                  <div>
                    <h3>{step.title}</h3>
                    <p>{step.body}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* ===== Feature cards ===== */}
        <section className="section features" id="features" aria-labelledby="features-title">
          <div className="container">
            <h2 id="features-title" className="features__title reveal">
              Built for fans who plan the fit three weeks out.
            </h2>
            <div className="features__grid">
              {features.map((feature) => (
                <article className="feature-card reveal" key={feature.title}>
                  <h3>{feature.title}</h3>
                  <p>{feature.body}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* ===== Privacy ===== */}
        <section className="section section--night privacy" id="privacy" aria-labelledby="privacy-title">
          <div className="container privacy__grid">
            <div className="privacy__copy reveal">
              <h2 id="privacy-title">Mostly for you.</h2>
              <p>
                Your journal is yours first. Posts go to friends only unless you say otherwise, and anything can be kept private. Make a review public and keep your notes to yourself, on the same entry.
              </p>
            </div>
            <ul className="privacy-labels">
              {privacyLabels.map((label) => (
                <li className="reveal" key={label.title}>
                  <span className={`privacy-labels__icon${label.open ? " privacy-labels__icon--open" : ""}`} aria-hidden="true">
                    {label.icon}
                  </span>
                  <strong>{label.title}</strong>
                  <p>{label.body}</p>
                </li>
              ))}
            </ul>
            <p className="privacy__fine reveal">
              We never share your live location. &quot;At the show&quot; status is off until you turn it on.
            </p>
          </div>
        </section>

        {/* ===== FAQ ===== */}
        <section className="section faq-section" id="questions" aria-labelledby="faq-title">
          <div className="container faq-grid">
            <h2 id="faq-title" className="faq-grid__title reveal">Questions</h2>
            <div className="faq reveal">
              {faqs.map((faq) => (
                <details key={faq.q}>
                  <summary>{faq.q}</summary>
                  <p>{faq.a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* ===== Waitlist ===== */}
        <section className="section section--night reserve" id="waitlist" aria-labelledby="waitlist-title">
          <div className="container reserve__grid">
            <div className="placeholder placeholder--night reserve__image reveal" role="img" aria-label="Image placeholder">
              <span className="placeholder__label">photo: a year of shows as a journal, recap card in the foreground</span>
            </div>
            <div className="reserve__copy reveal">
              <h2 id="waitlist-title" className="reserve__title">
                Your next show is coming up. Start the <span className="accent">diary now.</span>
              </h2>
              <p>Join the waitlist and we&apos;ll let you know the day beep boop opens.</p>
              <SignupForm location="waitlist" night />
            </div>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <div className="container">
          <div className="site-footer__row">
            <p className="site-footer__tagline">beep boop. A concert journal for fans.</p>
            <nav className="site-footer__links" aria-label="Footer">
              <a href="#" className="link">contact</a>
              <a href="#privacy" className="link">privacy</a>
              <a href="#" className="link">terms</a>
            </nav>
            <p>© {new Date().getFullYear()} beep boop</p>
          </div>
          <p className="site-footer__mark" aria-hidden="true">beep boop</p>
        </div>
      </footer>

      <div className="sticky-cta" data-sticky-cta>
        <a href="#waitlist" className="btn btn--block" data-cta="sticky">Join the waitlist</a>
      </div>

      <SiteEffects />
    </>
  );
}
