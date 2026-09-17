import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import Navbar from "../components/Navbar";
import Pagination from "../components/Pagination";

import api from "../services/api";

const Dashboard = () => {
    const [members, setMembers] = useState([]);

    const [search, setSearch] = useState("");

    const [page, setPage] = useState(1);

    const [pagination, setPagination] = useState({
        total: 0,
        totalPages: 1
    });

    const [sortBy, setSortBy] = useState("createdAt");

    const [order, setOrder] = useState("desc");

    const [loading, setLoading] = useState(false);

    const fetchMembers = async () => {
        try {
            setLoading(true);

            const response = await api.get("/members", {
                params: {
                    search,
                    page,
                    limit: 10,
                    sortBy,
                    order
                }
            });

            setMembers(response.data.members);

            setPagination(response.data.pagination);

        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMembers();
    }, [page, sortBy, order]);

    useEffect(() => {
        const timer = setTimeout(() => {
            setPage(1);
            fetchMembers();
        }, 400);

        return () => clearTimeout(timer);
    }, [search]);

    return (
        <div className="min-h-screen bg-gray-50">

            <Navbar />

            <main className="max-w-7xl mx-auto px-6 py-8">

                <div className="flex justify-between items-center mb-8">

                    <div>
                        <h1 className="text-3xl font-bold">
                            Members
                        </h1>

                        <p className="text-gray-500">
                            Manage café loyalty members
                        </p>
                    </div>

                    <Link
                        to="/members/new"
                        className="bg-black text-white px-5 py-3 rounded"
                    >
                        + Add Member
                    </Link>

                </div>

                <div className="bg-white p-4 rounded-xl border mb-6">

                    <input
                        type="text"
                        placeholder="Search by name or phone number..."
                        value={search}
                        onChange={(e) =>
                            setSearch(e.target.value)
                        }
                        className="w-full border p-3 rounded"
                    />

                    <div className="flex gap-4 mt-4">

                        <select
                            value={sortBy}
                            onChange={(e) => {
                                setSortBy(e.target.value);
                                setPage(1);
                            }}
                            className="border p-2 rounded"
                        >
                            <option value="createdAt">
                                Newest
                            </option>

                            <option value="name">
                                Name
                            </option>

                            <option value="points">
                                Points
                            </option>

                            <option value="totalSpend">
                                Total Spend
                            </option>
                        </select>

                        <button
                            onClick={() => {
                                setOrder(
                                    order === "asc"
                                        ? "desc"
                                        : "asc"
                                );
                            }}
                            className="border px-4 rounded"
                        >
                            {order === "asc"
                                ? "↑ Ascending"
                                : "↓ Descending"}
                        </button>

                    </div>

                </div>

                <div className="bg-white rounded-xl border overflow-hidden">

                    <div className="grid grid-cols-5 p-4 border-b font-semibold">
                        <span>Member</span>
                        <span>Phone</span>
                        <span>Tier</span>
                        <span>Points</span>
                        <span>Action</span>
                    </div>

                    {loading ? (
                        <div className="p-8 text-center">
                            Loading members...
                        </div>
                    ) : members.length === 0 ? (
                        <div className="p-8 text-center text-gray-500">
                            No members found
                        </div>
                    ) : (
                        members.map((member) => (
                            <div
                                key={member._id}
                                className="grid grid-cols-5 p-4 border-b items-center"
                            >

                                <span className="font-medium">
                                    {member.name}
                                </span>

                                <span>
                                    {member.phone}
                                </span>

                                <span>
                                    {member.tier}
                                </span>

                                <span className="font-bold">
                                    {member.points}
                                </span>

                                <Link
                                    to={`/members/${member._id}`}
                                    className="underline"
                                >
                                    View
                                </Link>

                            </div>
                        ))
                    )}

                </div>

                <Pagination
                    page={page}
                    totalPages={pagination.totalPages}
                    setPage={setPage}
                />

            </main>

        </div>
    );
};

export default Dashboard;