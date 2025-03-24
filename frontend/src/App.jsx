import { Navigate, Route, Routes } from "react-router-dom";
import HomePage from "./pages/home/HomePage";
import SignUpPage from "./pages/auth/signup/SignUpPage";
import LoginPage from "./pages/auth/login/LoginPage";
import { useQuery } from "@tanstack/react-query";

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

    console.log(authUser);

    if (isLoading) {
        return (
            <div>
                <h1>Is Loading...</h1>
            </div>
        );
    }

    return (
        <div>
            {authUser && <h1>Logged In</h1>}
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
            </Routes>
        </div>
    );
}

export default App;
