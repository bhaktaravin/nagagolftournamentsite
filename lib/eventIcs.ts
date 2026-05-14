/**
 * Minimal RFC 5545 iCalendar (single VEVENT) for published events.
 */
function escapeIcsText(text: string): string {
  return text
    .replace(/\\/g, "\\\\")
    .replace(/\n/g, "\\n")
    .replace(/;/g, "\\;")
    .replace(/,/g, "\\,");
}

function formatIcsUtc(d: Date): string {
  return d.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}Z$/, "Z");
}

export function buildEventIcs(event: {
  id: string;
  title: string;
  description: string | null;
  date: Date;
  location: string;
  tournamentNotes: string | null;
}): string {
  const dtStamp = formatIcsUtc(new Date());
  const dtStart = formatIcsUtc(event.date);
  const descParts = [event.description, event.tournamentNotes].filter(Boolean);
  const description = escapeIcsText(descParts.join("\n\n"));
  const summary = escapeIcsText(event.title);
  const location = escapeIcsText(event.location);
  const uid = `${event.id}@nagga-event`;

  return [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//NAGGA//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    `UID:${uid}`,
    `DTSTAMP:${dtStamp}`,
    `DTSTART:${dtStart}`,
    `SUMMARY:${summary}`,
    `LOCATION:${location}`,
    `DESCRIPTION:${description}`,
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");
}

export function eventIcsFilename(title: string): string {
  const slug = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 48);
  return `nagga-${slug || "event"}.ics`;
}
