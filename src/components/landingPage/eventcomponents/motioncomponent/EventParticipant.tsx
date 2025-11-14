"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

export default function EventParticipationSettings({ onChange }: any) {
  const [type, setType] = useState("solo");
  const [minTeamSize, setMinTeamSize] = useState<number | null>(null);
  const [maxTeamSize, setMaxTeamSize] = useState<number | null>(null);

  const updateBackendPayload = (selectedType: string) => {
    if (selectedType === "solo") {
      onChange({
        isTeamEvent: false,
        minTeamSize: null,
        maxTeamSize: null,
      });
    }

    if (selectedType === "team") {
      onChange({
        isTeamEvent: true,
        minTeamSize,
        maxTeamSize,
      });
    }

    if (selectedType === "solo_team") {
      onChange({
        isTeamEvent: true,
        minTeamSize: 1,
        maxTeamSize,
      });
    }
  };

  const handleTypeChange = (value: string) => {
    setType(value);
    updateBackendPayload(value);
  };

  return (
    <div className="space-y-4">
      <Label className="text-[15px] font-semibold">Participation Type</Label>

      {/* ✅ Radio Buttons */}
      <RadioGroup
        defaultValue="solo"
        onValueChange={handleTypeChange}
        className="space-y-3"
      >
        <div className="flex items-center gap-2">
          <RadioGroupItem value="solo" id="solo" />
          <Label htmlFor="solo">Solo Event</Label>
        </div>

        <div className="flex items-center gap-2">
          <RadioGroupItem value="team" id="team" />
          <Label htmlFor="team">Team Event</Label>
        </div>

        <div className="flex items-center gap-2">
          <RadioGroupItem value="solo_team" id="solo_team" />
          <Label htmlFor="solo_team">Solo + Team Event</Label>
        </div>
      </RadioGroup>

      {/* ✅ Team Inputs Logic */}
      {type === "team" && (
        <div className="space-y-3 mt-3">
          <div>
            <Label>Minimum Team Size</Label>
            <Input
              type="number"
              min={2}
              value={minTeamSize || ""}
              onChange={(e) => setMinTeamSize(Number(e.target.value))}
            />
          </div>

          <div>
            <Label>Maximum Team Size</Label>
            <Input
              type="number"
              min={minTeamSize || 2}
              value={maxTeamSize || ""}
              onChange={(e) => setMaxTeamSize(Number(e.target.value))}
            />
          </div>
        </div>
      )}

      {type === "solo_team" && (
        <div className="space-y-3 mt-3">
          <p className="text-sm text-gray-600">Min Team Size is fixed at 1</p>

          <div>
            <Label>Maximum Team Size</Label>
            <Input
              type="number"
              min={2}
              value={maxTeamSize || ""}
              onChange={(e) => setMaxTeamSize(Number(e.target.value))}
            />
          </div>
        </div>
      )}
    </div>
  );
}
