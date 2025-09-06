'use client';

import * as React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { useEventModalStore } from '@/store/modal-slice';
import useCreateEvent from '@/hooks/useCreateEvent';
import { debounce } from '@/utils/debouncing';
import axios from 'axios';
import { CheckCircle, XCircle } from 'lucide-react';

// ✅ Zod schema
const createEventSchema = z.object({
  name: z.string().min(3, 'Event name must be at least 3 characters'),
  isOnline: z.boolean().default(false),
});

type CreateEventFormValues = z.infer<typeof createEventSchema>;

interface EventCreateModalProps {
  workspaceSlug: any;
}

export const EventCreateModal: React.FC<EventCreateModalProps> = ({
  workspaceSlug,
}) => {
  const [isAvailable, setIsAvailable] = React.useState<null | boolean>(null);
  const { isOpen, closeModal } = useEventModalStore();
  const { mutate: createEvent } = useCreateEvent();

  const {
    register,
    handleSubmit,
    watch,
    control,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<CreateEventFormValues>({
    resolver: zodResolver(createEventSchema),
    defaultValues: { name: '', isOnline: false },
  });

  const checkAvailability = React.useCallback(
    debounce(async (name: any) => {
      if (name.length >= 3) {
        const res = await axios.get(`/api/event/checkbyDebounceName`, {
        params: { name, workspaceSlug }, // ✅ pass as query params
      });
        setIsAvailable(!res.data.exists);
      } else {
        setIsAvailable(null);
      }
    }, 500),
    []
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    checkAvailability(e.target.value);
  };

  const onSubmit = (data: CreateEventFormValues) => {
    createEvent(
      { workspaceSlug, name: data.name, isOnline: data.isOnline },
      {
        onSuccess: () => {
          reset(); // reset after submit
           setIsAvailable(null);
          closeModal();
        },
      }
    );
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) {
          reset(); // ✅ reset form when closing dialog
          setIsAvailable(null);
          closeModal();
        }
      }}
    >
      <DialogContent className="sm:max-w-lg h-[300px]">
        <DialogHeader>
          <DialogTitle className="text-[20px] text-center text-[#535353] font-semibold">
            Create Events
          </DialogTitle>
        </DialogHeader>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col space-y-[80px]"
        >
          {/* ✅ Event Name */}
          <div className="relative">
        <input
  type="text"
  {...register("name")}
  onInput={handleInputChange} // ✅ use input instead of change for live typing
  onKeyDown={(e) => {
    if (e.key === "Enter") {
      e.preventDefault(); // prevent default form submit
      handleSubmit(onSubmit)(); // ✅ manually trigger validation + submit
    }
  }}
  placeholder="Enter event name"
  className={`w-full border active:border-gray-500 text-[15px] bg-[#f3f1f1] rounded-md px-3 py-2 focus:outline-none ${
    errors.name
      ? "border-red-500"
      : isAvailable === false
      ? "border-red-500"
      : isAvailable === true
      ? "border-green-500"
      : "border-gray-300"
  }`}
/>


            {/* ✅ Icon inside input */}
            {isAvailable !== null && (
              <span className="absolute right-2 top-1/4 -translate-y-1/2">
                {isAvailable ? (
                  <CheckCircle className="text-green-400 w-4 h-4" />
                ) : (
                  <XCircle className="text-red-400 w-4 h-4" />
                )}
              </span>
            )}

            {/* ✅ Error only when < 3 */}
            {errors.name && (
              <p className="text-red-500 text-xs mt-1">
                {errors.name.message}
              </p>
            )}

            {/* ✅ Toggle */}
            <div className="flex items-center justify-between mt-4 px-1">
              <span className="text-[12px] text-[#535353]">
                Allow this workspace members to access this event
              </span>

              <Controller
                name="isOnline"
                control={control}
                render={({ field }) => (
                  <Switch
                    checked={field.value}
                    onCheckedChange={(checked) => field.onChange(checked)}
                  />
                )}
              />
            </div>
          </div>

          {/* ✅ Footer */}
          <DialogFooter>
            <div className="flex items-center justify-center w-full">
              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full hover:bg-[#E63939] bg-[#FF4242] text-[16px] font-medium"
              >
                {isSubmitting ? 'Please wait...' : 'Continue'}
              </Button>
            </div>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
