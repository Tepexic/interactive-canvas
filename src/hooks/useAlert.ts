import { useState, useCallback } from "react";

interface AlertState {
  isOpen: boolean;
  title: string;
  message: string;
  onClose: () => void;
}

const defaultAlertState: AlertState = {
  isOpen: false,
  title: "",
  message: "",
  onClose: () => {},
};

export function useAlert() {
  const [alertState, setAlertState] = useState<AlertState>(defaultAlertState);

  const showAlert = useCallback(
    (options: { title: string; message: string; onClose?: () => void }) => {
      setAlertState({
        isOpen: true,
        title: options.title,
        message: options.message,
        onClose: () => {
          options.onClose?.();
          closeAlert();
        },
      });
    },
    []
  );

  const closeAlert = useCallback(() => {
    setAlertState(defaultAlertState);
  }, []);

  const showError = useCallback(
    (title: string, message: string, onClose?: () => void) => {
      showAlert({ title, message, onClose });
    },
    [showAlert]
  );

  return {
    alertState,
    showAlert,
    showError,
    closeAlert,
  };
}
