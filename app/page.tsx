import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-dvh flex flex-col items-center justify-center px-6 text-center">
      <h1 className="font-display text-display-xl text-warm-white mb-4">
        Gamekaleido
      </h1>
      <p className="font-body text-warm-muted text-lg mb-12 max-w-md">
        Personalised board games. Endlessly unique. Entirely yours.
      </p>
      <div className="flex flex-col sm:flex-row gap-4">
        <Link
          href="/create/property-trading"
          className="btn-primary text-center"
        >
          Create a Property Trading Game
        </Link>
        <Link
          href="/create/trivia"
          className="btn-primary text-center"
        >
          Create a Trivia Game
        </Link>
      </div>
    </main>
  );
}
