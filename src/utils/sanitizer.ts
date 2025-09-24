import DOMPurify from "dompurify";
import validator from "validator";

// Define dangerous patterns that could be used for jailbreaking or injection
const DANGEROUS_PATTERNS = [
  // System command patterns
  /(?:^|\s)(?:sudo|su|rm|del|format|shutdown|reboot|kill|ps|top|chmod|chown|mv|cp|cat|ls|dir|cd|pwd|whoami|id|uname|curl|wget|nc|netcat|ssh|scp|ftp|telnet|ping|nslookup|dig|ifconfig|ipconfig|netstat|route|iptables|firewall-cmd)\s/gi,

  // SQL injection patterns
  /(?:union|select|insert|update|delete|drop|create|alter|exec|execute|sp_|xp_|--|\*|;|'|"|`|\|)/gi,

  // Script injection patterns
  /<script[^>]*>.*?<\/script>/gis,
  /javascript:/gi,
  /on\w+\s*=/gi,

  // LLM jailbreak patterns - improved to catch more variations
  /(?:ignore|forget|disregard)\s+(?:all\s+)?(?:previous|prior|above|earlier)\s+(?:instructions|prompts|rules|guidelines|constraints)/gi,
  /(?:ignore|forget|disregard)\s+(?:your\s+)?(?:instructions|prompts|rules|guidelines|constraints|training)/gi,
  /(?:act|behave|pretend|roleplay)\s+(?:as|like)\s+(?:dan|jailbreak|unrestricted|uncensored|evil|harmful)/gi,
  /(?:system|admin|root|developer|god|sudo)\s+(?:mode|prompt|access|override|command|level)/gi,
  /(?:break|bypass|circumvent|override|escape|hack)\s+(?:safety|security|guidelines|rules|restrictions|filters)/gi,

  // More specific prompt injection patterns
  /\[(?:system|admin|root|override|jailbreak|dev|god|sudo)\]/gi,
  /(?:new|different|alternative|updated|revised)\s+(?:instructions|prompt|system|rules|guidelines)/gi,
  /(?:end|stop|cancel|terminate|disable)\s+(?:previous|current|all)\s+(?:task|instruction|prompt|mode)/gi,
  /(?:you\s+are\s+now|from\s+now\s+on|starting\s+now)\s+(?:a|an|acting|behaving)/gi,

  // Code execution patterns
  /(?:eval|exec|system|shell|cmd|bash|powershell|python|node|php|ruby|perl)\s*\(/gi,
  /`[^`]*`/g, // Backticks for command execution
  /\$\([^)]*\)/g, // Command substitution

  // File system access patterns
  /(?:\.\.\/|\.\.\\|\/etc\/|\/bin\/|\/usr\/|\/var\/|\/tmp\/|C:\\|D:\\)/gi,

  // Network/URL patterns that could be suspicious
  /(?:http|https|ftp|file):\/\/[^\s<>"{}|\\^`[\]]+/gi,
];

// Suspicious keywords that often appear in jailbreak attempts
const JAILBREAK_KEYWORDS = [
  "jailbreak",
  "dan",
  "uncensored",
  "unrestricted",
  "bypass",
  "override",
  "ignore instructions",
  "ignore all instructions",
  "ignore previous instructions",
  "ignore all previous instructions",
  "forget rules",
  "forget your training",
  "disregard guidelines",
  "disregard safety",
  "act as",
  "pretend to be",
  "roleplay as",
  "you are now",
  "from now on",
  "system mode",
  "admin access",
  "admin mode",
  "root access",
  "developer mode",
  "debug mode",
  "maintenance mode",
  "god mode",
  "sudo mode",
  "break character",
  "escape your programming",
  "hack your system",
];

// SQL-specific dangerous keywords
const SQL_KEYWORDS = [
  "union",
  "select",
  "insert",
  "update",
  "delete",
  "drop",
  "create",
  "alter",
  "exec",
  "execute",
  "sp_",
  "xp_",
  "information_schema",
  "sys.",
  "master..",
];

interface SanitizationResult {
  isValid: boolean;
  sanitizedText: string;
  warnings: string[];
  blocked: boolean;
  originalLength: number;
  sanitizedLength: number;
}

export const promptSanitizer = (input: string): SanitizationResult => {
  const warnings: string[] = [];
  let sanitizedText = input;
  let blocked = false;

  // Basic validation
  if (!input || typeof input !== "string") {
    return {
      isValid: false,
      sanitizedText: "",
      warnings: ["Invalid input: must be a non-empty string"],
      blocked: true,
      originalLength: 0,
      sanitizedLength: 0,
    };
  }

  const originalLength = input.length;
  // Length validation
  if (input.length > 10000) {
    warnings.push("Input too long (max 10,000 characters)");
    sanitizedText = input.substring(0, 10000);
  }

  // HTML sanitization using DOMPurify
  const htmlSanitized = DOMPurify.sanitize(sanitizedText, {
    ALLOWED_TAGS: [], // Strip all HTML tags
    ALLOWED_ATTR: [],
    KEEP_CONTENT: true,
  });

  if (htmlSanitized !== sanitizedText) {
    warnings.push("HTML content detected and removed");
    sanitizedText = htmlSanitized;
  }

  // Basic string escaping
  sanitizedText = validator.escape(sanitizedText);
  // Check for dangerous patterns
  for (const pattern of DANGEROUS_PATTERNS) {
    if (pattern.test(sanitizedText)) {
      warnings.push(`Potentially dangerous pattern detected.`);
      // For high-risk patterns, block the entire request
      if (
        pattern.source.includes("system|admin|root") ||
        pattern.source.includes("union|select|insert") ||
        pattern.source.includes("script")
      ) {
        blocked = true;
        break;
      }
    }
  }
  // Check for jailbreak keywords
  const lowerInput = sanitizedText.toLowerCase();
  const foundJailbreakKeywords = JAILBREAK_KEYWORDS.filter((keyword) =>
    lowerInput.includes(keyword.toLowerCase())
  );

  if (foundJailbreakKeywords.length > 0) {
    warnings.push(
      `Potential jailbreak attempt detected: ${foundJailbreakKeywords.join(
        ", "
      )}`
    );

    // Block immediately for high-risk jailbreak patterns
    const highRiskPatterns = [
      "ignore all previous instructions",
      "ignore previous instructions",
      "ignore instructions",
      "forget your training",
      "disregard safety",
      "break character",
      "escape your programming",
      "hack your system",
    ];

    const hasHighRiskPattern = foundJailbreakKeywords.some((keyword) =>
      highRiskPatterns.some((pattern) => keyword.includes(pattern))
    );

    if (hasHighRiskPattern || foundJailbreakKeywords.length >= 2) {
      blocked = true; // Block if high-risk pattern or multiple indicators
    }
  }

  // Check for SQL injection keywords
  const foundSqlKeywords = SQL_KEYWORDS.filter((keyword) =>
    lowerInput.includes(keyword.toLowerCase())
  );

  if (foundSqlKeywords.length > 0) {
    warnings.push(
      `SQL injection attempt detected` //${foundSqlKeywords.join(", ")}
    );
    if (foundSqlKeywords.length >= 2) {
      blocked = true;
    }
  }

  // Advanced pattern checks
  // Check for excessive special characters (potential obfuscation)
  const specialCharCount = (
    sanitizedText.match(/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~`]/g) || []
  ).length;
  const specialCharRatio = specialCharCount / sanitizedText.length;

  if (specialCharRatio > 0.3) {
    warnings.push("High concentration of special characters detected");
  }

  // Check for leetspeak/obfuscation attempts in jailbreak patterns
  const obfuscatedPatterns = [
    /1gn0r3|1gn04e|ign04e/gi, // "ignore" in leetspeak
    /f0rg3t|f04g3t/gi, // "forget" in leetspeak
    /pr3v10us|pr3v1ous/gi, // "previous" in leetspeak
    /1nstruct10ns|1nstruct1ons/gi, // "instructions" in leetspeak
    /\b(i|1).{0,3}(g|9).{0,3}(n|4).{0,3}(o|0).{0,3}(r|4).{0,3}(e|3)\b/gi, // scattered "ignore"
  ];

  for (const pattern of obfuscatedPatterns) {
    if (pattern.test(sanitizedText)) {
      warnings.push("Potential obfuscated jailbreak attempt detected");
      blocked = true;
      break;
    }
  }

  // Check for repeated patterns (potential injection attempt)
  const repeatedPatterns = sanitizedText.match(/(.{3,})\\1{3,}/g);
  if (repeatedPatterns) {
    warnings.push("Repeated patterns detected (possible injection attempt)");
  }

  // Check for base64 encoded content (could hide malicious payloads)
  const base64Pattern = /^[A-Za-z0-9+/]*={0,2}$/;
  const words = sanitizedText.split(/\s+/);
  const suspiciousBase64 = words.filter(
    (word) => word.length > 20 && base64Pattern.test(word)
  );

  if (suspiciousBase64.length > 0) {
    warnings.push("Possible base64 encoded content detected");
  }

  // Check for unicode normalization attacks
  const normalized = sanitizedText.normalize("NFC");
  if (normalized !== sanitizedText) {
    warnings.push("Unicode normalization applied");
    sanitizedText = normalized;
  }

  // Final sanitization - remove null bytes and control characters
  // eslint-disable-next-line no-control-regex
  sanitizedText = sanitizedText.replace(
    /[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g,
    ""
  );

  // Trim whitespace
  sanitizedText = sanitizedText.trim();

  return {
    isValid: !blocked && sanitizedText.length > 0,
    sanitizedText: blocked ? "" : sanitizedText,
    warnings,
    blocked,
    originalLength,
    sanitizedLength: sanitizedText.length,
  };
};

// Helper function for logging sanitization results
export const logSanitizationResult = (result: SanitizationResult) => {
  console.log("Prompt Sanitization Result:", {
    isValid: result.isValid,
    blocked: result.blocked,
    warnings: result.warnings,
    lengthChange: result.originalLength + " -> " + result.sanitizedLength,
    reductionPercent:
      result.originalLength > 0
        ? Math.round(
            (1 - result.sanitizedLength / result.originalLength) * 100
          ) + "%"
        : "0%",
  });

  if (result.blocked) {
    console.warn("Input BLOCKED due to security concerns");
  }
};

// Quick validation function for simple use cases
export const isPromptSafe = (input: string): boolean => {
  const result = promptSanitizer(input);
  logSanitizationResult(result);
  return result.isValid && !result.blocked;
};

// Get detailed safety information for user feedback
export const getPromptSafetyInfo = (
  input: string
): {
  isSafe: boolean;
  reason?: string;
  suggestions?: string[];
} => {
  const result = promptSanitizer(input);

  if (result.blocked) {
    const mainReason =
      result.warnings[0] || "Input contains potentially dangerous content";
    return {
      isSafe: false,
      reason: mainReason,
      suggestions: [
        "Try rephrasing your request without command-like language",
        "Avoid using terms like 'ignore', 'forget', 'override', or similar",
        "Focus on describing what you want the AI to help you create",
      ],
    };
  }

  if (!result.isValid) {
    return {
      isSafe: false,
      reason: "Input is invalid or empty",
      suggestions: ["Please provide a valid text input"],
    };
  }

  return { isSafe: true };
};
