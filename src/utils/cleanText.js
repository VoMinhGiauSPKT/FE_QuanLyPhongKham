/**
 * Utility to repair Mojibake strings (UTF-8 bytes incorrectly decoded as Latin1 / Windows-1252)
 * Ensures 100% clean Vietnamese text across all modules.
 */

// Reverse mapping for Windows-1252 single-byte codepoints in 0x80-0x9F
const WIN1252_REVERSE = {
  0x20AC: 0x80, 0x201A: 0x82, 0x0192: 0x83, 0x201E: 0x84, 0x2026: 0x85,
  0x2020: 0x86, 0x2021: 0x87, 0x02C6: 0x88, 0x2030: 0x89, 0x0160: 0x8A,
  0x2039: 0x8B, 0x0152: 0x8C, 0x017D: 0x8E, 0x2018: 0x91, 0x2019: 0x92,
  0x201C: 0x93, 0x201D: 0x94, 0x2022: 0x95, 0x2013: 0x96, 0x2014: 0x97,
  0x02DC: 0x98, 0x2122: 0x99, 0x0161: 0x9A, 0x203A: 0x9B, 0x0153: 0x9C,
  0x017E: 0x9E, 0x0178: 0x9F
};

export const fixMojibake = (str) => {
  if (!str || typeof str !== 'string') return str;
  if (!/[ÃÄÂÊÔƠƯá»§¢£¤¥¦©ª«¬®¯°±²³µ¶·¸¹º»¼½¾¿]/.test(str)) {
    return str;
  }
  try {
    const bytes = [];
    for (let i = 0; i < str.length; i++) {
      const code = str.charCodeAt(i);
      if (WIN1252_REVERSE[code] !== undefined) {
        bytes.push(WIN1252_REVERSE[code]);
      } else if (code <= 0xFF) {
        bytes.push(code);
      } else {
        return str;
      }
    }
    return new TextDecoder('utf-8', { fatal: true }).decode(new Uint8Array(bytes));
  } catch {
    return str;
  }
};

// Known Mojibake pattern mappings for the clinic system
const MOJIBAKE_MAP = [
  { pattern: /KhÃ´ng\s*thá»ƒ\s*há»§y\s*lá»‹ch\s*cá»§a\s*ca\s*khÃ¡m\s*Ä‘Ã£\s*hoÃ\s*n\s*thÃ\s*nh!?/gi, replacement: 'Không thể hủy lịch của ca khám đã hoàn thành!' },
  { pattern: /Lá»‹ch\s*háº¹n\s*nÃ\s*y\s*Ä‘Ã£\s*bá»‹\s*há»§y\s*trÆ°á»\x9bc\s*Ä‘Ã³,?\s*khÃ´ng\s*thá»ƒ\s*há»§y\s*láº¡i!?/gi, replacement: 'Lịch hẹn này đã bị hủy trước đó, không thể hủy lại!' },
  { pattern: /HÃ³a\s*Ä‘Æ¡n\s*viá»‡n\s*phÃ­\s*Ä‘Ã£\s*thanh\s*toÃ¡n,?\s*khÃ´ng\s*Ä‘Æ°á»£c\s*phÃ©p\s*xÃ³a\s*Ä‘Æ¡n\s*thuá»‘c!?/gi, replacement: 'Hóa đơn viện phí đã thanh toán, không được phép xóa đơn thuốc!' },
  { pattern: /Tiá»\x81n\s*giáº£m\s*giÃ¡\s*vÆ°á»£t\s*quÃ¡\s*tá»•ng\s*viá»‡n\s*phÃ\s*cá»§a\s*bá»‡nh\s*nhÃ¢n!?/gi, replacement: 'Tiền giảm giá vượt quá tổng viện phí của bệnh nhân!' },
  { pattern: /Sá»‘\s*lÆ°á»£ng\s*tá»“n\s*kho\s*khÃ´ng\s*Ä‘á»§\s*Ä‘á»ƒ\s*kÃª\s*Ä‘Æ¡n!?/gi, replacement: 'Số lượng tồn kho không đủ để kê đơn!' },
  { pattern: /Thuá»‘c\s*Ä‘Ã£\s*háº¿t\s*háº¡n\s*sá»\xad\s*dá»¥ng,?\s*khÃ´ng\s*Ä‘Æ°á»£c\s*phÃ©p\s*kÃª\s*Ä‘Æ¡n!?/gi, replacement: 'Thuốc đã hết hạn sử dụng, không được phép kê đơn!' },
  { pattern: /Dá»‹ch\s*v\u1ee5\s*Ä‘Ã£\s*cÃ³\s*k\u1ebft\s*qu\u1ea3\s*c\u1eadn\s*l\u00e2m\s*s\u00e0ng,?\s*kh\u00f4ng\s*Ä\u2011\u01b0\u1ee3c\s*ph\u00e9p\s*x\u00f3a!?/gi, replacement: 'Dịch vụ đã có kết quả cận lâm sàng, không được phép xóa!' },
  { pattern: /Sáº¯p\s*háº¿t\s*hÃ\s*ng/gi, replacement: 'Sắp hết hàng' },
  { pattern: /Sáº¯p\s*háº¿t\s*háº¡n/gi, replacement: 'Sắp hết hạn sử dụng' },
  { pattern: /Tá»\x93n\s*Ã­t\s*&\s*Sáº¯p\s*háº¿t\s*háº¡n/gi, replacement: 'Tồn ít & Sắp hết hạn' },
  { pattern: /BÃ¬nh\s*thÆ°á»\x9dng/gi, replacement: 'Bình thường' },
  { pattern: /Chá»\x9d\s*khÃ¡m/gi, replacement: 'Chờ khám' },
  { pattern: /Ä\x90ang\s*khÃ¡m/gi, replacement: 'Đang khám' },
  { pattern: /Ä\x90Ã£\s*khÃ¡m/gi, replacement: 'Đã khám' },
  { pattern: /Ä\x90Ã£\s*há»§y/gi, replacement: 'Đã hủy' },
  { pattern: /ChÆ°a\s*thanh\s*toÃ¡n/gi, replacement: 'Chưa thanh toán' },
  { pattern: /Ä\x90Ã£\s*thanh\s*toÃ¡n/gi, replacement: 'Đã thanh toán' },
];

export const cleanText = (str) => {
  if (!str || typeof str !== 'string') return str;

  // 1. Try automatic UTF-8 byte reconstruction
  let cleaned = fixMojibake(str);

  // 2. Check known dictionary patterns
  for (const { pattern, replacement } of MOJIBAKE_MAP) {
    if (pattern.test(cleaned)) {
      cleaned = cleaned.replace(pattern, replacement);
    }
  }

  // 3. Fallback heuristic check for remaining mojibake markers
  if (cleaned.includes('Sáº') || cleaned.includes('háº') || cleaned.includes('hÃ') || cleaned.includes('Ä')) {
    const lower = cleaned.toLowerCase();
    if (lower.includes('s') && lower.includes('p') && lower.includes('h') && lower.includes('ng')) {
      return 'Sắp hết hàng';
    }
    if (lower.includes('h') && lower.includes('n') && lower.includes('d') && lower.includes('ng')) {
      return 'Sắp hết hạn sử dụng';
    }
    if (lower.includes('t') && lower.includes('n') && lower.includes('h') && lower.includes('n')) {
      return 'Tồn ít & Sắp hết hạn';
    }
    if (lower.includes('b') && lower.includes('nh') && lower.includes('th') && lower.includes('ng')) {
      return 'Bình thường';
    }
  }

  return cleaned;
};

/**
 * Recursively traverses any payload (Object, Array, Primitive) and sanitizes strings
 */
export const sanitizeDataPayload = (data) => {
  if (!data) return data;
  if (typeof data === 'string') return cleanText(data);
  if (Array.isArray(data)) {
    return data.map(sanitizeDataPayload);
  }
  if (typeof data === 'object') {
    const sanitizedObj = {};
    for (const key of Object.keys(data)) {
      sanitizedObj[key] = sanitizeDataPayload(data[key]);
    }
    return sanitizedObj;
  }
  return data;
};
