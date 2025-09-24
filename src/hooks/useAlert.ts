import { useState, useCallback } from "react";
import type { AlertType } from "@/components/modals/AlertDialog";

interface AlertState {
  isOpen: boolean;
  title: string;
  message: string;
  type: AlertType;
  confirmText: string;
  cancelText: string;
  showCancel: boolean;
  onConfirm: () => void;
  onCancel?: () => void;
}

const defaultAlertState: AlertState = {
  isOpen: false,
  title: "",
  message: "",
  type: "info",
  confirmText: "OK",
  cancelText: "Cancel",
  showCancel: false,
  onConfirm: () => {},
};

export function useAlert() {
  const [alertState, setAlertState] = useState<AlertState>(defaultAlertState);

  const showAlert = useCallback(
    (options: {
      title: string;
      message: string;
      type?: AlertType;
      confirmText?: string;
      cancelText?: string;
      showCancel?: boolean;
      onConfirm?: () => void;
      onCancel?: () => void;
    }) => {
      setAlertState({
        isOpen: true,
        title: options.title,
        message: options.message,
        type: options.type || "info",
        confirmText: options.confirmText || "OK",
        cancelText: options.cancelText || "Cancel",
        showCancel: options.showCancel || false,
        onConfirm: () => {
          options.onConfirm?.();
          closeAlert();
        },
        onCancel: options.onCancel
          ? () => {
              options.onCancel?.();
              closeAlert();
            }
          : undefined,
      });
    },
    []
  );

  const closeAlert = useCallback(() => {
    setAlertState(defaultAlertState);
  }, []);

  // Convenience methods for different alert types
  const showSuccess = useCallback(
    (title: string, message: string, onConfirm?: () => void) => {
      showAlert({ title, message, type: "success", onConfirm });
    },
    [showAlert]
  );

  const showError = useCallback(
    (title: string, message: string, onConfirm?: () => void) => {
      showAlert({ title, message, type: "error", onConfirm });
    },
    [showAlert]
  );

  const showWarning = useCallback(
    (title: string, message: string, onConfirm?: () => void) => {
      showAlert({ title, message, type: "warning", onConfirm });
    },
    [showAlert]
  );

  const showInfo = useCallback(
    (title: string, message: string, onConfirm?: () => void) => {
      showAlert({ title, message, type: "info", onConfirm });
    },
    [showAlert]
  );

  const showConfirmation = useCallback(
    (
      title: string,
      message: string,
      onConfirm: () => void,
      onCancel?: () => void,
      options?: {
        confirmText?: string;
        cancelText?: string;
        type?: AlertType;
      }
    ) => {
      showAlert({
        title,
        message,
        type: options?.type || "warning",
        confirmText: options?.confirmText || "Confirm",
        cancelText: options?.cancelText || "Cancel",
        showCancel: true,
        onConfirm,
        onCancel,
      });
    },
    [showAlert]
  );

  return {
    alertState,
    showAlert,
    showSuccess,
    showError,
    showWarning,
    showInfo,
    showConfirmation,
    closeAlert,
  };
}
