import { useState } from "react";

interface FormFieldProps {
  name: string;
  value: unknown;
  blockType: "amazon" | "gmail" | "ai" | "slack";
  onChange: (value: string | number) => void;
}

// Define dropdown options for different fields
const DROPDOWN_OPTIONS = {
  amazon: {
    metric: ["Units Sold", "Revenue", "Orders"],
    timeframe: [7, 14, 30, 90],
  },
  slack: {
    channel: ["#general", "#random", "#news", "custom"],
  },
} as const;

export function FormField({
  name,
  value,
  blockType,
  onChange,
}: FormFieldProps) {
  const [error, setError] = useState<string>("");

  // Determine field type based on the field name and block type
  const getFieldType = (): "text" | "email" | "textarea" | "dropdown" => {
    if (name === "recipient") return "email";
    if (name === "message" || name === "prompt") return "textarea";
    if (blockType === "amazon" && (name === "metric" || name === "timeframe"))
      return "dropdown";
    if (blockType === "slack" && name === "channel") return "dropdown";
    return "text";
  };

  // Get dropdown options for this field
  const getDropdownOptions = (): readonly (string | number)[] => {
    if (blockType === "amazon" && name === "metric")
      return DROPDOWN_OPTIONS.amazon.metric;
    if (blockType === "amazon" && name === "timeframe")
      return DROPDOWN_OPTIONS.amazon.timeframe;
    if (blockType === "slack" && name === "channel")
      return DROPDOWN_OPTIONS.slack.channel;
    return [];
  };

  // Validate field value
  const validateField = (fieldValue: string | number): string => {
    const strValue = String(fieldValue);

    if (!strValue || strValue.trim().length === 0) {
      return `${formatLabel(name)} is required`;
    }

    if (getFieldType() === "email") {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(strValue)) {
        return "Please enter a valid email address";
      }
    }

    if (name === "prompt" && strValue.length < 10) {
      return "Prompt must be at least 10 characters long";
    }

    if ((name === "message" || name === "subject") && strValue.length < 1) {
      return `${formatLabel(name)} must not be empty`;
    }

    return "";
  };

  // Format field name for display
  const formatLabel = (fieldName: string): string => {
    return fieldName.charAt(0).toUpperCase() + fieldName.slice(1);
  };

  // Handle value changes
  const handleChange = (newValue: string | number) => {
    const validationError = validateField(newValue);
    setError(validationError);
    onChange(newValue);
  };

  const fieldType = getFieldType();
  const dropdownOptions = getDropdownOptions();
  const stringValue = String(value || "");
  const isRequired = true; // All fields are required based on the requirements

  const inputClasses = `mt-1 block w-full px-3 py-2 border border-gray-300  rounded-md shadow-sm bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
    error ? "border-red-500" : ""
  }`;

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 ">
        {formatLabel(name)}
        {isRequired && <span className="text-red-500 ml-1">*</span>}
      </label>

      {fieldType === "dropdown" ? (
        <select
          value={stringValue}
          onChange={(e) => {
            const newValue =
              name === "timeframe" ? Number(e.target.value) : e.target.value;
            handleChange(newValue);
          }}
          className={inputClasses}
          required={isRequired}
        >
          <option value="">Select {formatLabel(name)}</option>
          {dropdownOptions.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
          {blockType === "slack" && name === "channel" && (
            <option value="custom">Custom Channel</option>
          )}
        </select>
      ) : fieldType === "textarea" ? (
        <textarea
          value={stringValue}
          onChange={(e) => handleChange(e.target.value)}
          className={inputClasses}
          rows={3}
          placeholder={`Enter ${formatLabel(name).toLowerCase()}...`}
          required={isRequired}
        />
      ) : (
        <input
          type={fieldType}
          value={stringValue}
          onChange={(e) => handleChange(e.target.value)}
          className={inputClasses}
          placeholder={`Enter ${formatLabel(name).toLowerCase()}...`}
          required={isRequired}
        />
      )}

      {error && <p className="mt-1 text-sm text-red-600 ">{error}</p>}
    </div>
  );
}
