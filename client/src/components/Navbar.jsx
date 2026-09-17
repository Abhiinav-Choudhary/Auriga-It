import { Link } from "react-router-dom";

import { useAuth } from "../context/AuthContext";

const Navbar = () => {
    const { user, logout } = useAuth();

    return (
        <nav className="border-b bg-white">

            <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">

                <Link
                    to="/dashboard"
                    className="text-xl font-bold"
                >
                    ☕ CafeRewards
                </Link>

                <div className="flex items-center gap-4">

                    {user && (
                        <>
                            <span className="text-gray-600">
                                {user.name}
                            </span>

                            <button
                                onClick={logout}
                                className="border px-4 py-2 rounded"
                            >
                                Logout
                            </button>
                        </>
                    )}

                </div>

            </div>

        </nav>
    );
};

export default Navbar;