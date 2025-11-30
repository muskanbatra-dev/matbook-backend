import React from "react";
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import DynamicFormPage from "./Pages/DynamicFormPage";
import SubmissionsPage from "./Pages/SubmissionsPage";

export default function App() {
  const navigate = useNavigate();
  const location = useLocation();

  const isForm = location.pathname === "/";
  const isSubmissions = location.pathname === "/submissions";

  return (
    <div className="min-h-screen bg-slate-50">

      <header className="border-b bg-white">
        <div className="max-w-4xl mx-auto flex items-center justify-between px-4 py-3">
          <h1 className="text-xl font-semibold">MatBook Dynamic Form</h1>

          <div className="space-x-2">
            <button
              onClick={() => navigate("/")}
              className={`px-3 py-1 rounded text-sm ${
                isForm
                  ? "bg-slate-900 text-white"
                  : "bg-slate-100 hover:bg-slate-200"
              }`}
            >
              Form
            </button>

            <button
              onClick={() => navigate("/submissions")}
              className={`px-3 py-1 rounded text-sm ${
                isSubmissions
                  ? "bg-slate-900 text-white"
                  : "bg-slate-100 hover:bg-slate-200"
              }`}
            >
              Submissions
            </button>
          </div>
        </div>
      </header>

 
      <main className="max-w-4xl mx-auto px-4 py-6">
        <Routes>
          <Route
            path="/"
            element={
              <DynamicFormPage onSubmitted={() => navigate("/submissions")} />
            }
          />
          <Route path="/submissions" element={<SubmissionsPage />} />
        </Routes>
      </main>
    </div>
  );
}
