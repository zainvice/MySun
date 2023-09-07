import { useEffect, useState } from "react";

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

export function useDimensions() {
  const [dimension, setDimension] = useState(window.screen.width);
  const getDimension = () => {
    setDimension(window.screen.width);
  }
  useEffect(() => {
    window.addEventListener("resize", getDimension);

    return () => {
      window.removeEventListener("resize", getDimension);
    };
  }, []);
  
  return dimension
}
