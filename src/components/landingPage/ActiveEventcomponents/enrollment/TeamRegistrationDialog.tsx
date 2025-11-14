"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useTeamDialogStore } from "@/store/modal-slice";
import { toast } from "sonner";
import { useTeamEnrollment } from "@/hooks/useTeamenrollment";

export default function TeamRegistrationDialog() {
  const { isOpen, closeDialog, minSize, maxSize, eventId } = useTeamDialogStore();

  const [teamName, setTeamName] = useState("");
  const [leaderId, setLeaderId] = useState("");
  const [memberIds, setMemberIds] = useState<string[]>([""]);

  const mutation = useTeamEnrollment();

  const addMemberField = () => {
    if (memberIds.length < maxSize! - 1) {
      setMemberIds([...memberIds, ""]);
    }
  };

  const updateMember = (index: number, value: string) => {
    const updated = [...memberIds];
    updated[index] = value;
    setMemberIds(updated);
  };

  const removeMember = (index: number) => {
    const updated = memberIds.filter((_, i) => i !== index);
    setMemberIds(updated);
  };

  const handleSubmit = async () => {
    if (!teamName.trim()) {
      toast.error("Team name is required");
      return;
    }

    if (!leaderId.trim()) {
      toast.error("Leader university ID is required");
      return;
    }

    // Total members = leader + memberIds
    const totalMembers = 1 + memberIds.filter(Boolean).length;

    if (totalMembers < minSize!) {
      toast.error(`Team must have at least ${minSize} members`);
      return;
    }

    if (totalMembers > maxSize!) {
      toast.error(`Team cannot exceed ${maxSize} members`);
      return;
    }

    mutation.mutate(
      {
        eventId,
        teamName,
        leaderUniversityId: leaderId,
        memberUniversityIds: memberIds.filter(Boolean),
      },
      {
        onSuccess: () => {
          setLeaderId("");
          setTeamName("");
          setMemberIds([""]);
          
          closeDialog();
        },
      }
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={closeDialog}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-lg lg:text-[18px] text-[#1a1a1a] font-medium">
            Register as Team
          </DialogTitle>
          <p className="text-sm text-[#404040]">
            Team size must be between <b>{minSize}</b> and <b>{maxSize}</b>.
          </p>
        </DialogHeader>

        <div className="space-y-4">
          <Input
            placeholder="Team Name"
            value={teamName}
            onChange={(e) => setTeamName(e.target.value)}
            className="border"
          />

          <Input
            placeholder="Leader University ID"
            value={leaderId}
            onChange={(e) => setLeaderId(e.target.value)}
            className="border"
          />

          <div className="space-y-3">
            {memberIds.map((m, index) => (
              <div key={index} className="flex gap-2">
                <Input
                  placeholder={`Member ${index + 1} University ID`}
                  value={m}
                  onChange={(e) => updateMember(index, e.target.value)}
                  className="border"
                />
                {index > 0 && (
                  <button
                    onClick={() => removeMember(index)}
                    className="text-red-600"
                  >
                    ✕
                  </button>
                )}
              </div>
            ))}

            {memberIds.length < maxSize! - 1 && (
              <Button
                variant="outline"
                className="w-full border-dashed font-medium text-[#1a1a1a]"
                onClick={addMemberField}
              >
                + Add Member
              </Button>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button
            onClick={handleSubmit}
            disabled={mutation.isPending}
            className="bg-transparent text-[#d1410c] hover:bg-[#b7370a] rounded font-medium hover:text-white border border-[#d1410c]"
          >
            {mutation.isPending ? "Submitting..." : "Submit Team Registration"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
