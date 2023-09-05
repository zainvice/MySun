import { useState } from "react";

export function useModal() {
  const [isOpen, setOpen] = useState(false);
  
  const onOpen = () => setOpen(true);
  const onClose = () => setOpen(false);
  const onToggle = () => setOpen((prev) => !prev);
  return {
    isOpen,
    onOpen,
    onClose,
    onToggle,
  };
}
