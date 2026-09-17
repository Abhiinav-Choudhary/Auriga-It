import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import Navbar from "../components/Navbar";
import api from "../services/api";

const MemberDetails = () => {
    const { id } = useParams();

    const [member, setMember] = useState(null);
    const [transactions, setTransactions] = useState([]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const fetchMember = async () => {
        try {
            setLoading(true);
            setError("");

            const [memberResponse, transactionResponse] =
                await Promise.all([
                    api.get(`/members/${id}`),
                    api.get(`/transactions/${id}`)
                ]);

            setMember(memberResponse.data.member);
            setTransactions(transactionResponse.data.transactions);

        } catch (error) {
            setError(
                error.response?.data?.message ||
                "Failed to load member"
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMember();
    }, [id]);

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50">
                <Navbar />

                <div className="flex justify-center items-center p-20">
                    Loading member...
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-50">
                <Navbar />

                <div className="max-w-3xl mx-auto p-8">
                    <div className="bg-red-100 text-red-600 p-4 rounded">
                        {error}
                    </div>

                    <Link
                        to="/dashboard"
                        className="inline-block mt-4 underline"
                    >
                        ← Back to members
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">

            <Navbar />

            <main className="max-w-5xl mx-auto px-6 py-8">

                <Link
                    to="/dashboard"
                    className="text-gray-600 hover:underline"
                >
                    ← Back to members
                </Link>

                {/* Member Header */}

                <div className="bg-white border rounded-xl p-8 mt-6">

                    <div className="flex justify-between items-start">

                        <div>
                            <h1 className="text-3xl font-bold">
                                {member.name}
                            </h1>

                            <p className="text-gray-500 mt-1">
                                📱 {member.phone}
                            </p>
                        </div>

                        <div className="text-right">

                            <span className="inline-block px-4 py-2 rounded-full bg-yellow-100 font-semibold">
                                {member.tier}
                            </span>

                            <p className="text-4xl font-bold mt-3">
                                {member.points}
                            </p>

                            <p className="text-gray-500">
                                Points
                            </p>

                        </div>

                    </div>

                    {/* Stats */}

                    <div className="grid grid-cols-2 gap-4 mt-8">

                        <div className="border rounded-lg p-5">
                            <p className="text-gray-500">
                                Total Spend
                            </p>

                            <p className="text-2xl font-bold mt-1">
                                ₹{member.totalSpend}
                            </p>
                        </div>

                        <div className="border rounded-lg p-5">
                            <p className="text-gray-500">
                                Current Tier
                            </p>

                            <p className="text-2xl font-bold mt-1">
                                {member.tier}
                            </p>
                        </div>

                    </div>

                </div>

                {/* Transactions */}

                <div className="bg-white border rounded-xl mt-6">

                    <div className="p-6 border-b">

                        <h2 className="text-xl font-bold">
                            Transaction History
                        </h2>

                        <p className="text-gray-500 mt-1">
                            All purchases and redemptions
                        </p>

                    </div>

                    {transactions.length === 0 ? (

                        <div className="p-8 text-center text-gray-500">
                            No transactions yet.
                        </div>

                    ) : (

                        <div>

                            {transactions.map((transaction) => (

                                <div
                                    key={transaction._id}
                                    className="flex justify-between items-center p-5 border-b last:border-b-0"
                                >

                                    <div>

                                        <p className="font-semibold">
                                            {transaction.type === "PURCHASE"
                                                ? "Purchase"
                                                : "Redemption"}
                                        </p>

                                        <p className="text-sm text-gray-500">
                                            {transaction.description || "No description"}
                                        </p>

                                        <p className="text-xs text-gray-400 mt-1">
                                            {new Date(
                                                transaction.createdAt
                                            ).toLocaleString()}
                                        </p>

                                    </div>

                                    <div className="text-right">

                                        <p
                                            className={`font-bold ${
                                                transaction.points > 0
                                                    ? "text-green-600"
                                                    : "text-red-600"
                                            }`}
                                        >
                                            {transaction.points > 0
                                                ? "+"
                                                : ""}
                                            {transaction.points} pts
                                        </p>

                                        {transaction.amount > 0 && (
                                            <p className="text-sm text-gray-500">
                                                ₹{transaction.amount}
                                            </p>
                                        )}

                                    </div>

                                </div>

                            ))}

                        </div>

                    )}

                </div>

            </main>

        </div>
    );
};

export default MemberDetails;