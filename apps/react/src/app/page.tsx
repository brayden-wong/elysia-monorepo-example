"use client";

import { api } from "libs";

export default function Page() {
  // api.get() api request
  return (
    <main className="space-y-2 px-4 py-2 m-8">
      <header className="border border-yellow-400">
        <h1>DRUNKEN DUCK LEVEL EDITOR</h1>
      </header>
      <h2 className="border bg-yellow-400 border-black">Level Overview</h2>
      <div className="flex items-center gap-x-2">
        {/*  api request levels */}
        <select>
          <option>1</option>
          <option>2</option>
          <option>3</option>
          <option>4</option>
          <option>5</option>
        </select>
        <button
          className="bg-emerald-400 text-blue-400 font-bold px-4 py-2 border-red-400 border"
          onClick={async () => {
            console.log("save level");
            await api.save.post({ level: "1" });
          }}
        >
          save
        </button>
      </div>
    </main>
  );
}
