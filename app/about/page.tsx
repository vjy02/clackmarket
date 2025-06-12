export default function About() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex flex-col px-6 py-12 pb-24">
      <div className="max-w-3xl mx-auto text-center">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">
          A Mechanical Keyboard Marketplace & r/mechmarket Alternative
        </h1>
        <p className="text-lg text-gray-600 mb-12">
          Find your keeb needs in a modern consolidated marketplace.
        </p>
      </div>

      <div className="max-w-4xl mx-auto space-y-12 text-gray-800">
        <section>
          <h2 className="text-2xl font-semibold mb-4 text-blue-700">
            What is ClackMarket?
          </h2>
          <p>
            ClackMarket is a modern, community-powered space to buy, sell, and
            discover mechanical keyboards, switches, keycaps, and more. We focus
            on transparency, usability, and keeping things simple — no confusing
            rules or bloated interfaces.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4 text-purple-700">
            Why ClackMarket?
          </h2>
          <ul className="list-none list-inside space-y-2">
            <li>
              🔄 <strong>Peer-to-peer listings</strong> — connect directly with
              buyers and sellers.
            </li>
            <li>
              🔍 <strong>Effortless search</strong> — powerful filters and feed
              to help you find exactly what you want.
            </li>
            <li>
              🎯 <strong>No account creation needed</strong> — list freely through just your Google account.
            </li>
            <li>
              🤝 <strong>Made by keyboard nerds</strong> — we get it, because we
              live it.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4 text-green-700">
            Zero Fees, Always
          </h2>
          <p>
            ClackMarket is free to use —{" "}
            <strong>no listing, selling, or buying fees</strong>. We believe
            your clacks shouldn’t come with a tax.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4 text-pink-700">
            Community Vibes Only
          </h2>
          <ul className="list-none list-inside space-y-2">
            <li>💬 Good communication = great trades.</li>
            <li>
              🤗 Treat each other with respect — we’re all here for the love of
              keebs.
            </li>
            <li>❌ No fake or clone products. Keep it legit.</li>
            <li>🧾 Be clear and accurate in your listings.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">
            Questions? We're Here.
          </h2>
          <p>
            Need help listing an item or reporting something specific? Contact
            us directly at <strong>clackmarket@gmail.com</strong>, we aim to
            reply to any queries within a timely manner.
          </p>
        </section>
      </div>
    </div>
  );
}
