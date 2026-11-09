import { createElement } from "react";

// The native date wheel doesn't exist on web, so browser previews get a plain date input.
export function DateWheel({ value, onChange }: { value: Date; onChange: (date: Date) => void }) {
  const pad = (number: number) => String(number).padStart(2, "0");
  return createElement("input", {
    type: "date",
    "aria-label": "Date",
    value: `${value.getFullYear()}-${pad(value.getMonth() + 1)}-${pad(value.getDate())}`,
    style: { margin: "auto", fontSize: 18, colorScheme: "dark" },
    onChange: (event: { target: { value: string } }) => {
      const [year, month, day] = event.target.value.split("-").map(Number);
      if (year) onChange(new Date(year, month - 1, day));
    },
  });
}
