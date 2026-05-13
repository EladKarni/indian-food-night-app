import { useCallback, useMemo, useState } from "react";
import { getNextWednesday } from "@/util/dateUtils";
import { calculateCutoffTimeString } from "@/util/timeUtils";

export interface CreateEventFormValues {
  event_date: string;
  time: string;
  restaurant: string;
  location: string;
  cutoff_minutes_before: number;
}

interface UseCreateEventFormParams {
  defaultLocation?: string;
}

const buildInitialValues = (
  defaultLocation: string | undefined
): CreateEventFormValues => ({
  event_date: new Date(getNextWednesday()).toISOString().split("T")[0],
  time: "18:30",
  restaurant: "Coriander Indian Grill",
  location: defaultLocation ?? "",
  cutoff_minutes_before: 60,
});

export const useCreateEventForm = ({
  defaultLocation,
}: UseCreateEventFormParams) => {
  const [values, setValues] = useState<CreateEventFormValues>(() =>
    buildInitialValues(defaultLocation)
  );

  const handleChange = useCallback(
    (
      e: React.ChangeEvent<
        HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
      >
    ) => {
      const { name, value } = e.target;
      setValues((prev) => ({
        ...prev,
        [name]:
          name === "cutoff_minutes_before" ? parseInt(value, 10) : value,
      }));
    },
    []
  );

  const cutoffPreview = useMemo(
    () =>
      values.time && values.event_date
        ? calculateCutoffTimeString(
            values.event_date,
            values.time,
            values.cutoff_minutes_before
          )
        : null,
    [values.event_date, values.time, values.cutoff_minutes_before]
  );

  return { values, handleChange, cutoffPreview };
};
