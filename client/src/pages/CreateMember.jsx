import { useState } from "react";
import { useNavigate } from "react-router-dom";

import Navbar from "../components/Navbar";
import api from "../services/api";

const CreateMember = () => {
    const navigate = useNavigate();

    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            setLoading(true);
            setError("");

            await api.post("/members", {
                name,
                phone
            });

            navigate("/dashboard");

        } catch (error) {
            setError(
                error.response?.data?.message ||
                "Failed to create member"
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">

            <Navbar />

            <main className="max-w-xl mx-auto px-6 py-10">

                <div className="bg-white border rounded-xl p-8">

                    <h1 className="text-2xl font-bold">
                        Add Member
                    </h1>

                    <p className="text-gray-500 mt-1 mb-6">
                        Register a new café rewards member
                    </p>

                    {error && (
                        <div className="bg-red-100 text-red-600 p-3 rounded mb-4">
                            {error}
                        </div>
                    )}

                    <form
                        onSubmit={handleSubmit}
                        className="space-y-4"
                    >

                        <input
                            placeholder="Member name"
                            value={name}
                            onChange={(e) =>
                                setName(e.target.value)
                            }
                            className="w-full border p-3 rounded"
                            required
                        />

                        <input
                            placeholder="Phone number"
                            value={phone}
                            onChange={(e) =>
                                setPhone(e.target.value)
                            }
                            className="w-full border p-3 rounded"
                            required
                        />

                        <button
                            disabled={loading}
                            className="w-full bg-black text-white p-3 rounded"
                        >
                            {loading
                                ? "Creating..."
                                : "Create Member"}
                        </button>

                    </form>

                </div>

            </main>

        </div>
    );
};

export default CreateMember;