
import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-[calc(100vh-64px)] bg-gradient-to-bg from-white via-zinc-50 to-zinc-100">
      {/* Hero Section */}
      <section className="mx-auto flex min-h-[calc(100vh-64px)] max-w-6xl items-center px-6 py-20">
        <div className="grid w-full items-center gap-16 md:grid-cols-2">

          {/* Left Content */}
          <div>
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-white px-4 py-2 text-sm text-zinc-600 shadow-sm">
              <span className="h-2 w-2 rounded-full bg-green-500"></span>
              Simple. Fast. Private.
            </div>

            <h1 className="max-w-xl text-5xl font-bold leading-tight tracking-tight text-zinc-900 sm:text-6xl">
              Connect with people,
              <span className="block text-zinc-500">
                anywhere, anytime.
              </span>
            </h1>

            <p className="mt-6 max-w-lg text-lg leading-8 text-zinc-600">
              ChatApp makes it easy to stay connected with your friends,
              family, and team. Send messages, share moments, and keep every
              conversation in one place.
            </p>

            {/* Buttons */}
            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              <Link
                href="/signup"
                className="flex h-12 items-center justify-center rounded-xl bg-zinc-900 px-7 font-medium text-white transition hover:bg-zinc-700"
              >
                Get Started
              </Link>

              <Link
                href="/login"
                className="flex h-12 items-center justify-center rounded-xl border border-zinc-300 bg-white px-7 font-medium text-zinc-900 transition hover:bg-zinc-100"
              >
                Sign In
              </Link>
            </div>

            <p className="mt-6 text-sm text-zinc-500">
              No complicated setup. Start chatting in seconds.
            </p>
          </div>

          {/* Chat Preview */}
          <div className="relative">
            <div className="rounded-3xl border border-zinc-200 bg-white p-4 shadow-2xl shadow-zinc-200/60">

              {/* Chat Header */}
              <div className="flex items-center gap-3 border-b border-zinc-100 px-3 pb-4">
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-zinc-900 font-semibold text-white">
                  JD
                </div>

                <div>
                  <h3 className="font-semibold text-zinc-900">
                    John Doe
                  </h3>

                  <div className="flex items-center gap-1.5 text-xs text-green-600">
                    <span className="h-1.5 w-1.5 rounded-full bg-green-500"></span>
                    Online
                  </div>
                </div>
              </div>

              {/* Messages */}
              <div className="flex min-h-[360px] flex-col justify-end gap-4 p-4">

                <div className="max-w-[75%] self-start rounded-2xl rounded-bl-md bg-zinc-100 px-4 py-3">
                  <p className="text-sm text-zinc-700">
                    Hey! How are you doing?
                  </p>
                  <span className="mt-1 block text-[10px] text-zinc-400">
                    10:24 AM
                  </span>
                </div>

                <div className="max-w-[75%] self-end rounded-2xl rounded-br-md bg-zinc-900 px-4 py-3">
                  <p className="text-sm text-white">
                    I'm doing great! Just checking out ChatApp.
                  </p>
                  <span className="mt-1 block text-[10px] text-zinc-400">
                    10:25 AM
                  </span>
                </div>

                <div className="max-w-[75%] self-start rounded-2xl rounded-bl-md bg-zinc-100 px-4 py-3">
                  <p className="text-sm text-zinc-700">
                    Nice! Let's chat later 🚀
                  </p>
                  <span className="mt-1 block text-[10px] text-zinc-400">
                    10:26 AM
                  </span>
                </div>

              </div>

              {/* Message Input */}
              <div className="flex items-center gap-2 border-t border-zinc-100 pt-4">
                <div className="flex-1 rounded-xl bg-zinc-100 px-4 py-3 text-sm text-zinc-400">
                  Type a message...
                </div>

                <button
                  className="flex h-11 w-11 items-center justify-center rounded-xl bg-zinc-900 text-white transition hover:bg-zinc-700"
                  aria-label="Send message"
                >
                  →
                </button>
              </div>
            </div>

            {/* Decorative element */}
            <div className="absolute -bottom-5 -left-5 -z-10 h-32 w-32 rounded-full bg-zinc-200 blur-2xl"></div>
            <div className="absolute -right-5 -top-5 -z-10 h-32 w-32 rounded-full bg-zinc-200 blur-2xl"></div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="border-t border-zinc-200 bg-white">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-semibold uppercase tracking-wider text-zinc-500">
              Everything you need
            </p>

            <h2 className="mt-3 text-3xl font-bold tracking-tight text-zinc-900 sm:text-4xl">
              A better way to stay connected
            </h2>

            <p className="mt-4 text-zinc-600">
              Simple tools designed to make your conversations easier and
              more enjoyable.
            </p>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-3">

            {/* Feature 1 */}
            <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-7 transition hover:-translate-y-1 hover:shadow-lg">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-zinc-900 text-xl text-white">
                💬
              </div>

              <h3 className="mt-5 text-xl font-semibold text-zinc-900">
                Real-time Chat
              </h3>

              <p className="mt-3 leading-7 text-zinc-600">
                Send and receive messages instantly with a smooth,
                real-time chatting experience.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-7 transition hover:-translate-y-1 hover:shadow-lg">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-zinc-900 text-xl text-white">
                🔒
              </div>

              <h3 className="mt-5 text-xl font-semibold text-zinc-900">
                Private Conversations
              </h3>

              <p className="mt-3 leading-7 text-zinc-600">
                Keep your conversations organized and accessible only to
                the people who matter.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-7 transition hover:-translate-y-1 hover:shadow-lg">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-zinc-900 text-xl text-white">
                ⚡
              </div>

              <h3 className="mt-5 text-xl font-semibold text-zinc-900">
                Fast & Simple
              </h3>

              <p className="mt-3 leading-7 text-zinc-600">
                No unnecessary complexity. Open ChatApp and get straight
                to your conversations.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-zinc-900">
        <div className="mx-auto max-w-4xl px-6 py-20 text-center">
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Ready to start chatting?
          </h2>

          <p className="mx-auto mt-4 max-w-xl text-zinc-400">
            Create your account and start connecting with your friends
            today.
          </p>

          <Link
            href="/signup"
            className="mt-8 inline-flex h-12 items-center justify-center rounded-xl bg-white px-8 font-medium text-zinc-900 transition hover:bg-zinc-200"
          >
            Create Your Account
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-zinc-800 bg-zinc-900 px-6 py-8">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 sm:flex-row">
          <p className="text-sm text-zinc-500">
            © 2026 ChatApp. All rights reserved.
          </p>

          <div className="flex gap-6 text-sm text-zinc-500">
            <Link href="/privacy" className="hover:text-white">
              Privacy
            </Link>

            <Link href="/terms" className="hover:text-white">
              Terms
            </Link>
          </div>
        </div>
      </footer>
    </main>
  );
}
