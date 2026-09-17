import { Link } from "react-router-dom";

const Landing = () => {
    return (
        <div className="min-h-screen bg-gray-50">

            <nav className="max-w-7xl mx-auto px-6 py-5 flex justify-between">

                <div className="text-2xl font-bold">
                    ☕ CafeRewards
                </div>

                <div className="flex gap-3">
                    <Link
                        to="/login"
                        className="px-4 py-2"
                    >
                        Login
                    </Link>

                    <Link
                        to="/register"
                        className="bg-black text-white px-4 py-2 rounded"
                    >
                        Get Started
                    </Link>
                </div>

            </nav>

            <main className="max-w-7xl mx-auto px-6 py-24">

                <div className="max-w-3xl">

                    <p className="font-semibold mb-4">
                        SIMPLE CAFÉ LOYALTY MANAGEMENT
                    </p>

                    <h1 className="text-6xl font-bold leading-tight">
                        Every purchase.
                        <br />
                        Every point.
                        <br />
                        Always accurate.
                    </h1>

                    <p className="text-xl text-gray-600 mt-6">
                        CafeRewards helps café staff manage
                        member purchases, loyalty tiers and
                        redemptions with an always up-to-date
                        points balance.
                    </p>

                    <Link
                        to="/register"
                        className="inline-block mt-8 bg-black text-white px-6 py-3 rounded"
                    >
                        Start Managing Rewards
                    </Link>

                </div>

                <div className="grid md:grid-cols-3 gap-6 mt-24">

                    <div className="bg-white p-6 rounded-xl shadow-sm">
                        <h2 className="font-bold text-xl">
                            ⚡ Automatic Points
                        </h2>
                        <p className="text-gray-600 mt-2">
                            Purchases automatically calculate
                            points based on the member's tier.
                        </p>
                    </div>

                    <div className="bg-white p-6 rounded-xl shadow-sm">
                        <h2 className="font-bold text-xl">
                            🏆 Loyalty Tiers
                        </h2>
                        <p className="text-gray-600 mt-2">
                            Members progress through Bronze,
                            Silver and Gold tiers.
                        </p>
                    </div>

                    <div className="bg-white p-6 rounded-xl shadow-sm">
                        <h2 className="font-bold text-xl">
                            🔎 Fast Lookup
                        </h2>
                        <p className="text-gray-600 mt-2">
                            Find members quickly using their
                            phone number or name.
                        </p>
                    </div>

                </div>

                <section className="mt-24">

                    <h2 className="text-3xl font-bold">
                        Built for café teams
                    </h2>

                    <p className="text-gray-600 mt-3">
                        Staff can record purchases, process
                        redemptions and see the live balance
                        from one counter-friendly interface.
                    </p>

                </section>

                <section className="mt-16">

                    <h2 className="text-3xl font-bold">
                        Next features
                    </h2>

                    <div className="grid md:grid-cols-3 gap-6 mt-6">

                        <div>
                            <h3 className="font-bold">
                                Analytics
                            </h3>
                            <p className="text-gray-600">
                                Track customer engagement and
                                reward activity.
                            </p>
                        </div>

                        <div>
                            <h3 className="font-bold">
                                Mobile Counter
                            </h3>
                            <p className="text-gray-600">
                                A dedicated mobile experience
                                for café staff.
                            </p>
                        </div>

                        <div>
                            <h3 className="font-bold">
                                Notifications
                            </h3>
                            <p className="text-gray-600">
                                Notify members about rewards,
                                tier upgrades and offers.
                            </p>
                        </div>

                    </div>

                </section>

            </main>

        </div>
    );
};

export default Landing;