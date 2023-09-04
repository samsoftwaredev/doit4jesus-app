import React, { createContext, useContext, useState } from "react";
import { Alert, Button, Snackbar, Stack } from "@mui/material";

interface ToastContextType {
  /** Unique id of the item */
  setToast: Function;
}

interface Props {
  children: JSX.Element | JSX.Element[];
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

const defaultToastInfo = { open: false, message: "", type: undefined };

const ToastContextProvider = ({ children }: Props) => {
  const [toast, setToast] = useState<{
    open: boolean;
    message: string;
    type?: "info" | "warning" | "success" | "error";
  }>(defaultToastInfo);

  const handleClose = (
    event: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return;
    }

    setToast(defaultToastInfo);
  };

  return (
    <ToastContext.Provider
      value={{
        setToast,
      }}
    >
      {children}
      <Stack spacing={2} sx={{ width: "100%" }}>
        <Snackbar
          open={toast.open}
          autoHideDuration={6000}
          onClose={handleClose}
        >
          <Alert
            onClose={handleClose}
            severity={toast.type}
            sx={{ width: "100%" }}
          >
            {toast.message}
          </Alert>
        </Snackbar>
      </Stack>
    </ToastContext.Provider>
  );
};

const useToastContext = () => {
  const context = useContext(ToastContext);
  if (context === undefined) {
    throw new Error("useToastContext must be used within a ContextProvider");
  }
  return context;
};

export { ToastContextProvider, useToastContext };
