// OCR utilities using Tesseract.js
// This will be used client-side, so we export types and helper functions

export interface OCRResult {
  text: string;
  confidence: number;
  extractedFields: {
    name?: string;
    address?: string;
    dob?: string;
    documentNumber?: string;
  };
}

export function extractFieldsFromOCR(text: string): OCRResult["extractedFields"] {
  const lines = text.split("\n").map((line) => line.trim());
  const fields: OCRResult["extractedFields"] = {};

  // Simple pattern matching for common ID fields
  // This is a demo implementation - real OCR would be more sophisticated

  // Look for name (usually at the top of IDs)
  const namePatterns = [
    /(?:name|nombre)[\s:]*([A-Z][a-z]+ [A-Z][a-z]+)/i,
    /^([A-Z][a-z]+ [A-Z][a-z]+)$/,
  ];

  for (const pattern of namePatterns) {
    for (const line of lines) {
      const match = line.match(pattern);
      if (match) {
        fields.name = match[1];
        break;
      }
    }
    if (fields.name) break;
  }

  // Look for date of birth
  const dobPatterns = [
    /(?:DOB|date of birth|birth date)[\s:]*(\d{2}\/\d{2}\/\d{4})/i,
    /(\d{2}\/\d{2}\/\d{4})/,
  ];

  for (const pattern of dobPatterns) {
    for (const line of lines) {
      const match = line.match(pattern);
      if (match) {
        fields.dob = match[1];
        break;
      }
    }
    if (fields.dob) break;
  }

  // Look for address
  const addressPattern = /(\d+\s+[A-Za-z\s]+(?:Street|St|Avenue|Ave|Road|Rd|Boulevard|Blvd))/i;
  for (const line of lines) {
    const match = line.match(addressPattern);
    if (match) {
      fields.address = match[1];
      break;
    }
  }

  // Look for document number
  const docNumberPattern = /(?:DL|ID|No|Number)[\s:]*([A-Z0-9-]+)/i;
  for (const line of lines) {
    const match = line.match(docNumberPattern);
    if (match && match[1].length >= 6) {
      fields.documentNumber = match[1];
      break;
    }
  }

  return fields;
}

export function calculateMatchScore(
  ocrFields: OCRResult["extractedFields"],
  userFields: { name?: string; dob?: string; address?: string }
): { score: number; matches: string[]; mismatches: string[] } {
  const matches: string[] = [];
  const mismatches: string[] = [];
  let score = 0;
  let totalFields = 0;

  // Compare name
  if (ocrFields.name && userFields.name) {
    totalFields++;
    const ocrName = ocrFields.name.toLowerCase().replace(/[^a-z\s]/g, "");
    const userName = userFields.name.toLowerCase().replace(/[^a-z\s]/g, "");

    if (ocrName.includes(userName) || userName.includes(ocrName)) {
      score++;
      matches.push("Name");
    } else {
      mismatches.push("Name");
    }
  }

  // Compare DOB
  if (ocrFields.dob && userFields.dob) {
    totalFields++;
    const ocrDob = ocrFields.dob.replace(/[^0-9]/g, "");
    const userDob = userFields.dob.replace(/[^0-9]/g, "");

    if (ocrDob === userDob) {
      score++;
      matches.push("Date of Birth");
    } else {
      mismatches.push("Date of Birth");
    }
  }

  // Compare address (partial match acceptable)
  if (ocrFields.address && userFields.address) {
    totalFields++;
    const ocrAddr = ocrFields.address.toLowerCase().replace(/[^a-z0-9\s]/g, "");
    const userAddr = userFields.address.toLowerCase().replace(/[^a-z0-9\s]/g, "");

    if (ocrAddr.includes(userAddr) || userAddr.includes(ocrAddr)) {
      score++;
      matches.push("Address");
    } else {
      mismatches.push("Address");
    }
  }

  const finalScore = totalFields > 0 ? (score / totalFields) * 100 : 0;

  return {
    score: Math.round(finalScore),
    matches,
    mismatches,
  };
}


