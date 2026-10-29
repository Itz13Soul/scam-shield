import Checker from "../components/Checker";
import ShieldLoader from "../components/ShieldLoader";

const PATTERNS = [
  ["Digital arrest", "A caller says you are under arrest and must stay on a video call."],
  ["Fake authority", "Claims to be police, CBI, customs, TRAI or a bank officer."],
  ["OTP, PIN or CVV", "Asks you to read out a code that only you should ever see."],
  ["Remote access", "Asks you to install an app that lets them control your phone."],
  ["Safe account", "Tells you to move money to a verification or safe account."],
  ["Urgency and threats", "Arrest, blocking or legal action unless you act now."],
  ["Payment demand", "A fine, deposit or transfer you did not expect."],
  ["Secrecy", "Do not tell your family. Do not hang up."],
];

const STEPS = [
  { t: "A model reads the script", b: "It looks at what is being asked and how, in Hindi, Hinglish or English." },
  { t: "Fixed rules look for known patterns", b: "Separate rules catch patterns such as digital arrest, so one weak read cannot hide them." },
  { t: "The higher risk wins", b: "If either check is alarmed, you see the alarm. Every flag quotes the exact words behind it." },
];

export default function Home() {
  return (
    <main className="overflow-x-clip">
      <section className="relative">
        <div className="bg-grid pointer-events-none absolute inset-0" aria-hidden />
        <div className="relative mx-auto grid w-full max-w-6xl items-center gap-8 px-4 pb-10 pt-14 md:grid-cols-[1.2fr_0.8fr] md:pt-20">
          <div>
            <h1 className="font-display hero-in text-4xl font-semibold leading-[1.08] sm:text-5xl lg:text-6xl" style={{ animationDelay: "60ms" }}>
              A cloned voice can sound real. The script gives it away.
            </h1>
            <p className="hero-in mt-6 max-w-xl text-lg text-zinc-300" style={{ animationDelay: "160ms" }}>
              Paste a suspicious message or upload a call recording. Get a plain verdict in Hindi or English, the exact lines that look like a scam, and what to do next.
            </p>
            <div className="hero-in mt-8 flex flex-wrap items-center gap-4" style={{ animationDelay: "260ms" }}>
              <a href="#check" className="rounded-full bg-teal-300 px-6 py-3 font-semibold text-zinc-950 shadow-[0_0_40px_-8px_rgba(94,234,212,0.8)] transition hover:bg-teal-200">
                Check a message
              </a>
              <span className="text-sm text-zinc-400">It never says safe. It says what it found and what it did not.</span>
            </div>
          </div>
          <div className="relative mx-auto aspect-square w-full max-w-sm">
            <div className="absolute inset-[20%] rounded-full bg-teal-400/10 blur-3xl" />
            <div className="absolute inset-0">
              <ShieldLoader />
            </div>
          </div>
        </div>
      </section>

      <section id="check" className="mx-auto w-full max-w-6xl scroll-mt-20 px-4 pb-16">
        <div className="glass rounded-3xl p-4 sm:p-6">
          <Checker />
        </div>
        <p className="mt-4 rounded-xl border border-amber-400/30 bg-amber-400/10 p-3 text-sm text-amber-100">
          Not legal advice. This is a probability, not proof. Do not paste confidential text: this is a public demo and messages are not stored. Voice deepfake detection is not part of this version.
        </p>
      </section>

      <section className="mx-auto w-full max-w-6xl px-4 pb-20">
        <h2 className="font-display max-w-2xl text-3xl font-semibold sm:text-4xl">Eight scam moves it knows by heart</h2>
        <ul className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {PATTERNS.map(([t, b], i) => (
            <li key={t} className={`rounded-2xl border p-5 ${i === 0 ? "border-red-400/40 bg-red-500/10" : "border-white/10 bg-white/[0.03]"}`}>
              <h3 className="font-display text-lg font-semibold">{t}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-zinc-300">{b}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className="mx-auto w-full max-w-6xl px-4 pb-20">
        <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <h2 className="font-display text-3xl font-semibold sm:text-4xl">Two checks, not one</h2>
            <p className="mt-4 text-zinc-300">A single model can be fooled or can miss a pattern. Pairing it with fixed rules makes the result easier to trust and easier to explain.</p>
          </div>
          <ol className="space-y-3">
            {STEPS.map((s, i) => (
              <li key={s.t} className="glass flex gap-4 rounded-2xl p-5">
                <span className="font-display text-3xl font-semibold text-teal-300">{i + 1}</span>
                <div>
                  <h3 className="font-display text-lg font-semibold">{s.t}</h3>
                  <p className="mt-1 text-sm text-zinc-300">{s.b}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-4 pb-20">
        <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-teal-300/10 via-transparent to-red-400/10 p-8 sm:p-12">
          <h2 className="font-display text-3xl font-semibold sm:text-4xl">Measured, with its limits shown</h2>
          <dl className="mt-8 grid gap-6 sm:grid-cols-3">
            <div>
              <dt className="text-sm text-zinc-400">Scam scripts caught</dt>
              <dd className="font-display text-5xl font-semibold">100%</dd>
            </div>
            <div>
              <dt className="text-sm text-zinc-400">Genuine messages wrongly flagged</dt>
              <dd className="font-display text-5xl font-semibold">5%</dd>
            </div>
            <div>
              <dt className="text-sm text-zinc-400">Basis</dt>
              <dd className="mt-2 text-sm text-zinc-300">40 short texts written and labelled by the developer, half scams and half genuine. Small and easy, so treat it as early.</dd>
            </div>
          </dl>
          <a href="/method" className="mt-8 inline-block font-medium text-teal-200 underline-offset-4 hover:underline">
            Read the method and accuracy
          </a>
        </div>
      </section>
    </main>
  );
}
