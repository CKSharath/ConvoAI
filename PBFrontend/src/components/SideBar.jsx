import React from "react";

export default function Sidebar({ children }) {
    return <aside className="w-64 bg-white p-4 shadow-md rounded-lg">{children}</aside>;
}