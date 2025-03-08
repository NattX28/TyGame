import { Endpoint_Gateway } from "@/services/api";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";

const BASE_URL = Endpoint_Gateway;

export const useFindParty = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const findParty = async (maxSlots: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.post(
        `${BASE_URL}/party/find?max_slots=${maxSlots}`
      );
      const { party_id } = response.data;
      router.push(`/party/${party_id}`); // redirect ไปที่หน้าห้อง party นั้น
    } catch (err: any) {
      setError(err.response?.data?.error || "failed to find party");
    } finally {
      setLoading(false);
    }
  };

  return { findParty, loading, error };
};
