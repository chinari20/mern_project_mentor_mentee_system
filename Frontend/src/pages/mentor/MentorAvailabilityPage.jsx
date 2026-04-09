import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Button } from "../../components/common/Button";
import { EmptyState } from "../../components/common/EmptyState";
import { Input } from "../../components/common/Input";
import { SectionHeading } from "../../components/common/SectionHeading";
import { Select } from "../../components/common/Select";
import { useAuth } from "../../hooks/useAuth";
import { dataService } from "../../services/dataService";
import { formatTimeRange } from "../../utils/formatters";

const dayOptions = [
  { value: "Monday", label: "Monday" },
  { value: "Tuesday", label: "Tuesday" },
  { value: "Wednesday", label: "Wednesday" },
  { value: "Thursday", label: "Thursday" },
  { value: "Friday", label: "Friday" },
  { value: "Saturday", label: "Saturday" },
  { value: "Sunday", label: "Sunday" },
];

const timezoneOptions = [
  { value: "Asia/Calcutta", label: "Asia/Calcutta (IST)" },
  { value: "UTC", label: "UTC" },
  { value: "Europe/London", label: "Europe/London" },
  { value: "America/New_York", label: "America/New_York" },
  { value: "America/Los_Angeles", label: "America/Los_Angeles" },
];

const emptySlot = {
  day: "Monday",
  startTime: "09:00",
  endTime: "10:00",
  timezone: "Asia/Calcutta",
};

export default function MentorAvailabilityPage() {
  const { profile, refresh } = useAuth();
  const [slots, setSlots] = useState([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setSlots(profile?.availability?.length ? profile.availability : [emptySlot]);
  }, [profile]);

  const updateSlot = (index, key, value) => {
    setSlots((current) =>
      current.map((slot, slotIndex) =>
        slotIndex === index ? { ...slot, [key]: value } : slot,
      ),
    );
  };

  const addSlot = () => {
    setSlots((current) => [...current, emptySlot]);
  };

  const removeSlot = (index) => {
    setSlots((current) => current.filter((_, slotIndex) => slotIndex !== index));
  };

  const handleSave = async () => {
    const normalizedSlots = slots
      .map((slot) => ({
        day: slot.day,
        startTime: slot.startTime,
        endTime: slot.endTime,
        timezone: slot.timezone,
      }))
      .filter((slot) => slot.day && slot.startTime && slot.endTime);

    const hasInvalidSlot = normalizedSlots.some((slot) => slot.startTime >= slot.endTime);
    if (hasInvalidSlot) {
      toast.error("End time must be after start time");
      return;
    }

    try {
      setSaving(true);
      await dataService.updateProfile({ availability: normalizedSlots });
      await refresh();
      toast.success("Availability updated");
    } catch (error) {
      toast.error(error.message || "Unable to save availability");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-8">
      <SectionHeading
        title="Availability Settings"
        description="Define weekly mentoring windows so mentees can coordinate sessions without back-and-forth."
      />

      <div className="space-y-4">
        {slots.length ? (
          slots.map((slot, index) => (
            <div key={`${slot.day}-${index}`} className="card grid gap-4 p-6 md:grid-cols-4">
              <Select
                label="Day"
                options={dayOptions}
                value={slot.day}
                onChange={(event) => updateSlot(index, "day", event.target.value)}
              />
              <Input
                label="Start Time"
                type="time"
                value={slot.startTime}
                onChange={(event) => updateSlot(index, "startTime", event.target.value)}
              />
              <Input
                label="End Time"
                type="time"
                value={slot.endTime}
                onChange={(event) => updateSlot(index, "endTime", event.target.value)}
              />
              <Select
                label="Timezone"
                options={timezoneOptions}
                value={slot.timezone}
                onChange={(event) => updateSlot(index, "timezone", event.target.value)}
              />
              <div className="md:col-span-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <p className="text-sm text-slate-500">
                  {slot.day}: {formatTimeRange(slot.startTime, slot.endTime)} ({slot.timezone})
                </p>
                <Button variant="secondary" type="button" onClick={() => removeSlot(index)}>
                  Remove Slot
                </Button>
              </div>
            </div>
          ))
        ) : (
          <EmptyState
            title="No availability added"
            description="Add at least one time window so mentees know when you usually mentor."
          />
        )}
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <Button type="button" variant="secondary" onClick={addSlot}>
          Add Slot
        </Button>
        <Button type="button" onClick={handleSave} disabled={saving}>
          {saving ? "Saving..." : "Save Availability"}
        </Button>
      </div>
    </div>
  );
}
