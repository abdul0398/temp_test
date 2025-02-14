"use client";

import { useState } from "react";
import { supabase } from "../../lib/supabase";

export default function TestSupabase() {
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");

  const handleWrite = async () => {
    try {
      const { data, error } = await supabase
        .from("test_table")
        .insert([{ name }]);

      if (error) throw error;
      setMessage(`Inserted: ${JSON.stringify(data)}`);
    } catch (err: any) {
      setMessage(`Error: ${err.message}`);
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Supabase Write Test</h1>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Enter name"
        className="border rounded p-2 w-full mb-4"
      />
      <button
        onClick={handleWrite}
        className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
      >
        Write to Supabase
      </button>
      {message && <p className="mt-4 text-green-600">{message}</p>}
    </div>
  );
}
