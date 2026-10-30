import Link from "next/link";
import Checker from "../components/Checker";
import ShieldLoader from "../components/ShieldLoader";
import HeroAB from "../components/HeroAB";

export default function Home() {
  return (
    <main>
      <section className="mx-auto grid w-full max-w-6xl items-center gap-8 px-4 pb-8 pt-12 md:grid-cols-[1.4fr_0.6fr] md:pt-16">
        <HeroAB />
        <div className="relative mx-auto hidden aspect-square w-full max-w-[14rem] md:block">
          <ShieldLoader />
        </div>
      </section>

      <section id="check" className="mx-auto w-full max-w-6xl scroll-mt-20 px-4 pb-8">
        <Checker />
        <p className="mt-4 text-sm text-zinc-400">
          Not legal advice. A probability, not proof. This is a public demo and messages are not stored, so do not paste confidential text. It never says a message is safe, only what it found.
        </p>
      </section>

      <section className="mx-auto w-full max-w-6xl px-4 pb-20">
        <p className="max-w-2xl text-zinc-300">
          A model reads the script and separate fixed rules look for known patterns such as digital arrest, OTP requests and safe-account transfers. The higher risk wins, and every flag quotes your own words. On 40 short test texts it caught 100% of the scams and wrongly flagged 5% of genuine messages.{" "}
          <Link href="/method" className="text-teal-200 underline-offset-4 hover:underline">Method and limits</Link>
        </p>
      </section>
    </main>
  );
}
