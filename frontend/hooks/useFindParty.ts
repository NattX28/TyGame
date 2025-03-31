import { findparty } from "@/services/party/party";
import { useRouter } from "next/navigation";
import { useState } from "react";

export const useFindParty = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const findPartyHook = async (maxSlots: string, communityId: string) => {
    setLoading(true);
    setError(null);
    try {
      const data = await findparty(maxSlots, communityId);
      router.push(`/party/${data.party_id}`);
    } catch (err: any) {
      setError(err.response?.data?.error || "Failed to find party");
    } finally {
      setLoading(false);
    }
  };

  return { findPartyHook, loading, error };
};
