"use client";

import { useFindParty } from "@/hooks/useFindParty";
import { useState } from "react";

const FindPartyButton = () => {
  const { findParty, loading, error } = useFindParty();
  const [maxSlots, setMaxSlots] = useState(4); // ค่า default
  const userId = "user-id123";

  return (
    <div>
      <label>Max Slots:</label>
      <select
        value={maxSlots}
        onChange={(e) => setMaxSlots(Number(e.target.value))}>
        {[2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
          <option key={n} value={n}>
            {n}
          </option>
        ))}
      </select>

      <button onClick={() => findParty(maxSlots.toString())} disabled={loading}>
        {loading ? "Finding..." : "Find Party"}
      </button>

      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
};

export default FindPartyButton;
