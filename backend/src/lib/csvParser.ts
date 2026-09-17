export interface CsvFeedbackRow {
  content: string;
  channel: string;
  customerLabel?: string;
  createdAt?: Date;
  sentiment?: string;
  status?: string;
}

export interface CsvParseResult {
  validRows: CsvFeedbackRow[];
  failedRows: { rowNumber: number; reason: string; rawRow: string }[];
  totalRows: number;
}

/**
 * Robust CSV parser handling quotes, linebreaks, and header validation.
 */
export function parseFeedbackCsv(csvContent: string): CsvParseResult {
  const lines = parseCsvLines(csvContent);
  if (lines.length === 0) {
    throw new Error("CSV file is empty");
  }

  const headers = lines[0].map((h) => h.trim().toLowerCase());

  const contentIdx = headers.findIndex((h) => h === "content" || h === "feedback" || h === "text");
  const channelIdx = headers.findIndex((h) => h === "channel" || h === "source");
  const customerIdx = headers.findIndex((h) => h === "customer_label" || h === "customer" || h === "user");
  const createdAtIdx = headers.findIndex((h) => h === "created_at" || h === "date" || h === "timestamp");

  if (contentIdx === -1) {
    throw new Error("Missing required column 'content' in CSV header");
  }

  const validRows: CsvFeedbackRow[] = [];
  const failedRows: { rowNumber: number; reason: string; rawRow: string }[] = [];

  for (let i = 1; i < lines.length; i++) {
    const row = lines[i];
    if (row.length === 0 || (row.length === 1 && row[0].trim() === "")) {
      continue; // Skip empty trailing lines
    }

    const rowNum = i + 1;
    const rawRow = row.join(",");

    const content = row[contentIdx]?.trim();
    if (!content) {
      failedRows.push({
        rowNumber: rowNum,
        reason: "Content field is blank or missing",
        rawRow,
      });
      continue;
    }

    const channel = channelIdx !== -1 && row[channelIdx]?.trim() ? row[channelIdx].trim() : "CSV Import";
    const customerLabel = customerIdx !== -1 && row[customerIdx]?.trim() ? row[customerIdx].trim() : undefined;
    
    let createdAt: Date | undefined = undefined;
    if (createdAtIdx !== -1 && row[createdAtIdx]?.trim()) {
      const dateStr = row[createdAtIdx].trim();
      const parsedDate = new Date(dateStr);
      if (!isNaN(parsedDate.getTime())) {
        createdAt = parsedDate;
      } else {
        createdAt = new Date();
      }
    }

    validRows.push({
      content,
      channel,
      customerLabel,
      createdAt,
      sentiment: "Neutral",
      status: "NEW",
    });
  }

  return {
    validRows,
    failedRows,
    totalRows: lines.length - 1,
  };
}

function parseCsvLines(text: string): string[][] {
  const result: string[][] = [];
  let row: string[] = [];
  let curr = "";
  let inQuotes = false;

  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    const nextChar = text[i + 1];

    if (char === '"') {
      if (inQuotes && nextChar === '"') {
        curr += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === "," && !inQuotes) {
      row.push(curr);
      curr = "";
    } else if ((char === "\r" || char === "\n") && !inQuotes) {
      if (char === "\r" && nextChar === "\n") {
        i++;
      }
      row.push(curr);
      curr = "";
      if (row.some((cell) => cell.trim().length > 0)) {
        result.push(row);
      }
      row = [];
    } else {
      curr += char;
    }
  }

  if (curr.length > 0 || row.length > 0) {
    row.push(curr);
    if (row.some((cell) => cell.trim().length > 0)) {
      result.push(row);
    }
  }

  return result;
}
