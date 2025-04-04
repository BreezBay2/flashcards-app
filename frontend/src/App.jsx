import { Navigate, Route, Routes } from "react-router-dom";
import HomePage from "./pages/home/HomePage";
import SignUpPage from "./pages/auth/signup/SignUpPage";
import LoginPage from "./pages/auth/login/LoginPage";
import { useQuery } from "@tanstack/react-query";
import DeckPage from "./pages/deck/DeckPage";
import Navbar from "./components/Navbar";
import "./App.css";
import StudyPage from "./pages/study/StudyPage";

function App() {
    const { data: authUser, isLoading } = useQuery({
        queryKey: ["authUser"],
        queryFn: async () => {
            try {
                const res = await fetch("/api/auth/user");
                const data = res.json();

                if (data.error) {
                    return null;
                }

                if (!res.ok) {
                    throw new Error(data.error || "Something went wrong");
                }

                console.log("User: ", data);
                return data;
            } catch (error) {
                throw new Error(error);
            }
        },
        retry: false,
    });

    if (isLoading) {
        return (
            <div className="loading">
                <h1>Is Loading...</h1>
            </div>
        );
    }

    return (
        <div className="App">
            {authUser && <Navbar />}
            <Routes>
                <Route
                    path="/"
                    element={authUser ? <HomePage /> : <Navigate to="/login" />}
                />
                <Route
                    path="/signup"
                    element={!authUser ? <SignUpPage /> : <Navigate to="/" />}
                />
                <Route
                    path="/login"
                    element={!authUser ? <LoginPage /> : <Navigate to="/" />}
                />
                <Route
                    path="/deck/:id"
                    element={authUser ? <DeckPage /> : <Navigate to="/login" />}
                />
                <Route
                    path="/study"
                    element={
                        authUser ? <StudyPage /> : <Navigate to="/login" />
                    }
                />
            </Routes>
        </div>
    );
}

export default App;
