export const eventKeys = {
  all: ["events"] as const,
  active: () => [...eventKeys.all, "active"] as const,
};

export const orderKeys = {
  all: ["orders"] as const,
  list: (eventId: string | undefined) =>
    [...orderKeys.all, "list", eventId] as const,
};
