import Checker from "../components/Checker";
import ShieldLoader from "../components/ShieldLoader";

export default function Home() {
  return (
    <main className="mx-auto w-full max-w-5xl px-4 pb-10">
      <section className="grid items-center gap-6 pt-4 md:grid-cols-2">
        <div className="rise">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-teal-300">For Indian families</p>
          <h1 className="mt-3 text-4xl font-semibold leading-tight tracking-tight sm:text-5xl">
            A cloned voice can sound real.{" "}
            <span className="bg-gradient-to-r from-teal-300 to-sky-400 bg-clip-text text-transparent">The script gives it away.</span>
          </h1>
          <p className="mt-4 max-w-md text-zinc-400">
            Paste a suspicious message or upload a call recording. Get a plain verdict in Hindi or English, the exact lines that look like a scam, and what to do next.
          </p>
          <p className="mt-3 text-xs text-zinc-500">It never says &ldquo;safe&rdquo;. It says what it found and what it did not.</p>
        </div>
        <div className="relative mx-auto aspect-square w-full max-w-sm">
          <div className="absolute inset-[20%] rounded-full bg-teal-400/10 blur-3xl" />
          <div className="absolute inset-0">
            <ShieldLoader />
          </div>
        </div>
      </section>

      <section className="mt-4">
        <Checker />
        <p className="mt-3 rounded-lg border border-amber-400/30 bg-amber-400/10 p-3 text-xs text-amber-100">
          Not legal advice. This is a probability, not proof. Do not paste confidential text: this is a public demo and messages are not stored. Voice deepfake detection is not part of this version.
        </p>
      </section>

      <section className="mt-10 grid gap-4 sm:grid-cols-3">
        {[
          ["Two checks, not one", "A language model reads the script. Separate fixed rules look for known patterns such as digital arrest. The higher risk wins."],
          ["Quoted evidence", "Every flagged trait shows the exact words from your text. A claim the text does not contain is dropped."],
          ["Measured, not claimed", "Accuracy on a labelled test set is published on the Method page, including its limits."],
        ].map(([t, b]) => (
          <div key={t} className="rounded-2xl border border-white/10 bg-white/[0.035] p-5">
            <h2 className="font-semibold">{t}</h2>
            <p className="mt-1 text-sm text-zinc-400">{b}</p>
          </div>
        ))}
      </section>
    </main>
  );
}
