import Link from "next/link";

export default function Home() {
  return (
    <section className="min-h-screen flex flex-col justify-center items-center text-center px-6 py-20 bg-background text-foreground">
      <div className="max-w-3xl">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-forest dark:text-green-300">
          Centre for Health, Education and Development Communication (CHEDCOM)
        </h1>
        <p className="mt-6 text-lg text-muted-foreground">
          Promoting health, education, and development through strategic
          communication, community engagement, and impactful projects.
        </p>
        <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/about"
            className="bg-forest text-white px-6 py-3 rounded hover:bg-green-800 transition"
          >
            Learn More
          </Link>
          <Link
            href="/contact"
            className="border border-forest text-forest px-6 py-3 rounded hover:bg-forest hover:text-white transition"
          >
            Contact Us
          </Link>
        </div>
      </div>
    </section>
  );
}
