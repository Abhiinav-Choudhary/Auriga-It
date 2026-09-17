import { BrowserRouter, Routes, Route } from "react-router-dom";
import CreateMember from "./pages/CreateMember";
import { AuthProvider } from "./context/AuthContext";

import ProtectedRoute from "./components/ProtectedRoute";

import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import MemberDetails from "./pages/MemberDetails";

function App() {
    return (
        <BrowserRouter>
            <AuthProvider>
                <Routes>

                    <Route
                        path="/"
                        element={<Landing />}
                    />

                    <Route
                        path="/login"
                        element={<Login />}
                    />

                    <Route
                        path="/register"
                        element={<Register />}
                    />

                    <Route
                        path="/dashboard"
                        element={
                            <ProtectedRoute>
                                <Dashboard />
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="/members/:id"
                        element={
                            <ProtectedRoute>
                                <MemberDetails />
                            </ProtectedRoute>
                        }
                    />

                    <Route
    path="/members/new"
    element={
        <ProtectedRoute>
            <CreateMember />
        </ProtectedRoute>
    }
/>

                </Routes>
            </AuthProvider>
        </BrowserRouter>
    );
}

export default App;