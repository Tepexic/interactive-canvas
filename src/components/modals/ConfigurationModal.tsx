import { Fragment, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import type { CustomNodeData } from "@/types/canvas";
import { FormField } from "./FormField";

interface ConfigurationModalProps {
  isOpen: boolean;
  blockData: CustomNodeData | null;
  onSave: (config: Record<string, unknown>) => void;
  onClose: () => void;
}

export function ConfigurationModal({
  isOpen,
  blockData,
  onSave,
  onClose,
}: ConfigurationModalProps) {
  const [formData, setFormData] = useState<Record<string, unknown>>({});
  const [fieldValidations, setFieldValidations] = useState<
    Record<string, { isValid: boolean; error: string }>
  >({});

  if (!blockData) return null;

  // Initialize form data when modal opens
  if (isOpen && Object.keys(formData).length === 0) {
    setFormData({ ...blockData.config });
  }

  const handleFieldChange = (name: string, value: string | number) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleValidationChange = (
    fieldName: string,
    isValid: boolean,
    error: string
  ) => {
    setFieldValidations((prev) => ({
      ...prev,
      [fieldName]: { isValid, error },
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Check for empty fields
    const hasEmptyFields = Object.values(formData).some(
      (value) =>
        !value || (typeof value === "string" && value.trim().length === 0)
    );

    if (hasEmptyFields) {
      return;
    }

    // Check for field validation errors
    const hasValidationErrors = Object.values(fieldValidations).some(
      (validation) => !validation.isValid
    );

    if (hasValidationErrors) {
      return;
    }

    onSave(formData);
    setFormData({});
    setFieldValidations({});
  };

  const handleClose = () => {
    onClose();
    setFormData({});
    setFieldValidations({});
  };
  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={handleClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/25 backdrop-blur-sm" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <div className="flex items-center justify-between mb-4">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 text-gray-900 "
                  >
                    Configure {blockData.label}
                  </Dialog.Title>
                  <button
                    type="button"
                    onClick={handleClose}
                    className="rounded-md p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100  focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <XMarkIcon className="h-5 w-5" />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Form fields will be rendered here dynamically */}
                  <div className="space-y-4">
                    {Object.entries(blockData.config).map(([key, value]) => (
                      <FormField
                        key={key}
                        name={key}
                        value={
                          formData[key] !== undefined ? formData[key] : value
                        }
                        blockType={blockData.type}
                        onChange={(newValue) =>
                          handleFieldChange(key, newValue)
                        }
                        onValidationChange={handleValidationChange}
                      />
                    ))}
                  </div>

                  <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200 ">
                    <button
                      type="button"
                      onClick={handleClose}
                      className="px-4 py-2 text-sm font-medium text-gray-700  bg-white border border-gray-300  rounded-md hover:bg-gray-50  focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      Save
                    </button>
                  </div>
                </form>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
