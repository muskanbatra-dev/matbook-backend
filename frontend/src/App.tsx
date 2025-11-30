import React, { useState } from "react";
import DynamicFormPage from "./Pages/DynamicFormPage";
import SubmissionsPage from "./Pages/SubmissionsPage";

const App: React.FC = () => {
  const [view, setView] = useState<"form" | "submissions">("form");

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b bg-white">
        <div className="max-w-4xl mx-auto flex items-center justify-between px-4 py-3">
          <h1 className="text-xl font-semibold">MatBook Dynamic Form</h1>
          <div className="space-x-2">
            <button
              onClick={() => setView("form")}
              className={`px-3 py-1 rounded text-sm ${
                view === "form"
                  ? "bg-slate-900 text-white"
                  : "bg-slate-100 hover:bg-slate-200"
              }`}
            >
              Form
            </button>
            <button
              onClick={() => setView("submissions")}
              className={`px-3 py-1 rounded text-sm ${
                view === "submissions"
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
        {view === "form" ? (
          <DynamicFormPage onSubmitted={() => setView("submissions")} />
        ) : (
          <SubmissionsPage />
        )}
      </main>
    </div>
  );
};

export default App;
