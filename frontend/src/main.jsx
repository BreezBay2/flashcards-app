import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const defaultQueryFn = async () => {
    try {
        const res = await fetch("/api/auth/user");
        const data = await res.json();
        if (data.error) {
            return null;
        }

        if (!res.ok) {
            throw new Error(data.error || "Something went wrong.");
        }

        return data;
    } catch (error) {
        throw new Error(error);
    }
};

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            refetchOnWindowFocus: false,
            queryFn: defaultQueryFn,
        },
    },
});

createRoot(document.getElementById("root")).render(
    // <StrictMode>
    <BrowserRouter>
        <QueryClientProvider client={queryClient}>
            <App />
        </QueryClientProvider>
    </BrowserRouter>
    // </StrictMode>
);
