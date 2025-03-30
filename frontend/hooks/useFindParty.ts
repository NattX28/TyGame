import { Endpoint_Gateway, api } from "@/services/api";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";

const BASE_URL_PARTY = "/party";

export const useFindParty = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const findParty = async (maxSlots: string) => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await api.post(`${BASE_URL_PARTY}/find?max_slots=${maxSlots}`);
      router.push(`/party/${data.party_id}`);
    } catch (err: any) {
      setError(err.response?.data?.error || "Failed to find party");
    } finally {
      setLoading(false);
    }
  };

  return { findParty, loading, error };
};
