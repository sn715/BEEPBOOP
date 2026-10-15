import Image from "next/image";
import SignupForm from "@/components/SignupForm";
import SiteEffects from "@/components/SiteEffects";

// Photos behind the front one in the hero stack, back to front. They're mostly
// covered, so they're decorative (empty alt). To add a card, add a path here.
const heroBackPhotos = ["/images/back-1.jpeg", "/images/back-2.jpg"];

type StepMedia =
  | { kind: "prints"; photos: Array<{ src: string; alt: string }> }
  | { kind: "phone"; src: string; alt: string };

const steps: Array<{ id?: string; title: string; body: string; media?: StepMedia; audience?: boolean }> = [
  {
    title: "collect your favorite photos and videos.",
    body: "Bring all of your favorite concert videos, photos, selfies, and fit checks into one entry for the night.",
    media: {
      kind: "prints",
      photos: [
        { src: "/images/step1.jpg", alt: "A packed crowd at night, one person cheering with both arms up." },
        { src: "/images/step1.2.jpg", alt: "A performer on stage pointing up at the lighting rig, a pink screen behind him." },
        { src: "/images/step1.3.jpg", alt: "A sea of phone flashlights in the dark as the crowd films the show." },
      ],
    },
  },
  {
    title: "remember how it felt.",
    body: "Give it a rating, then write down how the night made you feel: the projections on Lorde's tour, the bass at the Carti show, the crowd at Phoebe Bridgers.",
    media: {
      kind: "phone",
      src: "/images/phone-journal.png",
      alt: "A journal entry on an iPhone for Ryan Beatty at the Greek Theater: concert photos, a four-star rating and a written review.",
    },
  },
  {
    id: "privacy",
    title: "share it, or keep it.",
    body: "Every post can be private, friends only or public. You pick each time.",
    audience: true,
  },
];

const features = [
  {
    title: "rate it, review it",
    body: "Give the show a star rating and write as much or as little as you want. Every review adds to your archive of the nights you were there for.",
  },
  { title: "share card", body: "Turn any entry into a ticket stub for your story or the group chat." },
  { title: "your year in live music", body: "Every December, get your recap: the shows, artists and venues of your year, and the nights you loved most." },
];

// Who can see a post, shown as boxes in step 3
const privacyLabels = [
  { dots: "private", title: "private", body: "Only you." },
  { dots: "friends", title: "friends", body: "People you both follow." },
  { dots: "public", title: "public", body: "Anyone, and it helps other fans pick seats." },
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

// Step 01's prints are shown whole (film edges and all); step 02 shows a phone mockup.
function StepMediaView({ media }: { media: StepMedia }) {
  if (media.kind === "prints") {
    return (
      <div className="prints">
        {media.photos.map((photo) => (
          <Image
            className="prints__photo"
            key={photo.src}
            src={photo.src}
            alt={photo.alt}
            width={1400}
            height={950}
            sizes="(min-width: 1024px) 700px, 55vw"
          />
        ))}
      </div>
    );
  }
  return (
    <Image className="phone step__phone" src={media.src} alt={media.alt} width={500} height={877} sizes="(min-width: 1024px) 340px, 70vw" />
  );
}

function Logo() {
  return (
    <a href="#top" className="logo" aria-label="beep boop, back to top">
      <span className="logo__dots" aria-hidden="true">
        <span />
        <span />
      </span>
      <span className="logo__word">beep boop</span>
    </a>
  );
}

export default function Home() {
  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>

      {/* ===== Header ===== */}
      <header className="site-header">
        <div className="container site-header__inner">
          <Logo />
          <nav className="site-header__nav" aria-label="Page">
            {/* In page order. The last one is the action, so it's the only one that stands out. */}
            <a href="#how" className="link">how it works</a>
            {/* <a href="#features" className="link">features</a> (section hidden for now) */}
            <a href="#waitlist" className="link link--cta" data-cta="header">join waitlist</a>
          </nav>
        </div>
      </header>

      <main id="main">
        {/* ===== Hero: photos fall onto the stack, then the headline fades in ===== */}
        <section className="hero" id="top" aria-labelledby="hero-title">
          <div className="container">
            <div className="hero__stack">
              {heroBackPhotos.map((src) => (
                <div className="hero__card" key={src}>
                  <Image className="hero__photo" src={src} alt="" fill priority sizes="(min-width: 1140px) 1100px, 100vw" />
                </div>
              ))}
              <div className="hero__card hero__card--front">
                <Image
                  className="hero__photo"
                  src="/images/front.jpg"
                  alt="A packed crowd at a show, people singing, pointing at the stage and holding their phones up to film."
                  fill
                  priority
                  sizes="(min-width: 1140px) 1100px, 100vw"
                />
                <div className="hero__text">
                  <h1 id="hero-title" className="hero__title">All your concert memories in one place.</h1>
                  <p className="hero__sub">the concert scrapbook to keep your photos, videos, and feelings.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ===== Intro + first signup ===== */}
        <section className="intro" aria-labelledby="intro-title">
          <div className="container">
            <div className="intro__grid">
              <div className="intro__copy reveal">
                <h2 id="intro-title" className="intro__statement">
                  Beep Boop is your personal concert journal to help you document your musical memories.
                </h2>
                <div className="intro__signup">
    
                  <SignupForm location="hero" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ===== How it works: numbered steps ===== */}
        <section className="steps" id="how" aria-label="How it works">
          <div className="container">
            {steps.map((step, i) => (
              <article className={`step step--${step.media?.kind ?? "text"} reveal`} id={step.id} key={step.title}>
                <div className="step__copy">
                  <h3 className="step__title">
                    <span className="step__num">{String(i + 1).padStart(2, "0")}</span> {step.title}
                  </h3>
                  <p className="step__body">{step.body}</p>
                </div>
                {step.media && <StepMediaView media={step.media} />}
                {step.audience && (
                  <>
                    <ul className="privacy__labels">
                      {privacyLabels.map((label) => (
                        <li key={label.title}>
                          <span className={`privacy__dots privacy__dots--${label.dots}`} aria-hidden="true">
                            <span />
                            <span />
                          </span>
                          <strong>{label.title}</strong>
                          <p>{label.body}</p>
                        </li>
                      ))}
                    </ul>
              
                  </>
                )}
              </article>
            ))}
          </div>
        </section>

        {/* ===== The app ===== */}
        <section className="section app" id="app" aria-labelledby="app-title">
          <div className="container app__grid">
            <div className="app__copy reveal">
              <h2 id="app-title" className="section-title">your diary, every show.</h2>
              <p className="mono-body">
                Every show you log lands in your diary, sorted by month. Open one to see the photos, your rating and what you wrote.
              </p>
            </div>
            <figure className="app__media reveal">
              <Image
                className="phone"
                src="/images/phone-diary.png"
                width={500}
                height={877}
                sizes="(min-width: 1024px) 380px, 70vw"
                alt="The diary screen on an iPhone: shows grouped by month, including Ryan Beatty, Kali Uchis, Playboi Carti, Sabrina Carpenter, Djo, Lorde and Tate McRae, each with the venue, date and a photo."
              />
            </figure>
          </div>
        </section>

        {/* Features and FAQ sections, hidden for now. Uncomment to bring them back.
        ===== Features =====
        <section className="section features" id="features" aria-labelledby="features-title">
          <div className="container">
            <h2 id="features-title" className="section-title reveal">made for fans who plan the fit three weeks out.</h2>
            <div className="features__grid">
              {features.map((feature) => (
                <article className="feature reveal" key={feature.title}>
                  <h3>{feature.title}</h3>
                  <p>{feature.body}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        ===== FAQ =====
        <section className="section" id="questions" aria-labelledby="faq-title">
          <div className="container faq-grid">
            <h2 id="faq-title" className="section-title reveal">questions</h2>
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
        */}

        {/* ===== Waitlist ===== */}
        <section className="section waitlist" id="waitlist" aria-labelledby="waitlist-title">
          <div className="container waitlist__grid">
            <div className="waitlist__photo reveal">
              <Image
                src="/images/step3.jpeg"
                alt="Two friends posing together on the grass at a daytime festival."
                fill
                sizes="(min-width: 1024px) 560px, 100vw"
              />
            </div>
            <div className="waitlist__copy reveal">
              <h2 id="waitlist-title" className="waitlist__title">Your next show is coming up. Start the diary now.</h2>
              <p className="mono-body">Join the waitlist and we&apos;ll let you know the day beep boop opens.</p>
              <SignupForm location="waitlist" />
            </div>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <div className="container">
          <div className="site-footer__row">
            <Logo />
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
        <a href="#waitlist" className="btn btn--block" data-cta="sticky">join the waitlist</a>
      </div>

      <SiteEffects />
    </>
  );
}
