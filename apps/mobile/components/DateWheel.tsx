import DateTimePicker from "@react-native-community/datetimepicker";

// The real iOS date wheel, which is what the design's picker frame shows.
export function DateWheel({ value, onChange }: { value: Date; onChange: (date: Date) => void }) {
  return (
    <DateTimePicker
      mode="date"
      display="spinner"
      themeVariant="dark"
      textColor="#ffffff"
      value={value}
      onValueChange={(_, date) => onChange(date)}
      style={{ height: 226, width: "100%" }}
    />
  );
}
