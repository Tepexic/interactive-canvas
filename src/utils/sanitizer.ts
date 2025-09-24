interface SanitizationResult {
  isValid: boolean;
  sanitizedText: string;
  warnings: string[];
  blocked: boolean;
  originalLength: number;
  sanitizedLength: number;
}

export const promptSanitizer = (input: string): SanitizationResult => {
  // Simple validation for now - just check length and return basic result
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

  const warnings: string[] = [];
  let sanitizedText = input.trim();
  
  // Basic length validation
  if (input.length > 10000) {
    warnings.push("Input too long (max 10,000 characters)");
    sanitizedText = input.substring(0, 10000);
  }

  // Simple validation for minimum length (10 characters for AI prompts)
  if (sanitizedText.length < 10) {
    warnings.push("Input too short (minimum 10 characters)");
    return {
      isValid: false,
      sanitizedText,
      warnings,
      blocked: false,
      originalLength: input.length,
      sanitizedLength: sanitizedText.length,
    };
  }

  return {
    isValid: true,
    sanitizedText,
    warnings,
    blocked: false,
    originalLength: input.length,
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
  });

  if (result.blocked) {
    console.warn("Input BLOCKED due to security concerns");
  }
};

// Quick validation function for simple use cases
export const isPromptSafe = (input: string): boolean => {
  const result = promptSanitizer(input);
  return result.isValid && !result.blocked;
};