"use client";
import { useFindParty } from "@/hooks/useFindParty";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, Loader2 } from "lucide-react";

const FindPartyButton = ({ communityId }: { communityId: string }) => {
  const { findPartyHook, loading, error } = useFindParty();
  const [maxSlots, setMaxSlots] = useState("4");

  const handleSelectChange = (value: string) => {
    setMaxSlots(value);
  };

  return (
    <div className="flex  items-center gap-2">
      <Select value={maxSlots} onValueChange={handleSelectChange}>
        <SelectTrigger className="w-24 h-9">
          <SelectValue placeholder="Players" />
        </SelectTrigger>
        <SelectContent>
          {[2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
            <SelectItem key={n} value={n.toString()}>
              {n}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Button
        size="sm"
        onClick={() => findPartyHook(maxSlots, communityId)}
        disabled={loading}>
        {loading ? (
          <>
            <Loader2 className="mr-1 h-3 w-3 animate-spin" />
            Finding...
          </>
        ) : (
          <>
            <Search className="mr-1 h-3 w-3" />
            Find Party
          </>
        )}
      </Button>

      {error && <span className="text-xs text-destructive">{error}</span>}
    </div>
  );
};

export default FindPartyButton;
