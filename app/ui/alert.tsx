import { useEffect, useState } from "react";
import { CircleCheck, TriangleAlert, CircleX, Info, X } from "lucide-react";

interface AlertProps {
  type: "success" | "warning" | "error" | "info";
  message: string;
  duration?: number; // Duration in milliseconds
  onClose?: () => void;
}

const Alert: React.FC<AlertProps> = ({
  type,
  message,
  duration = 3000,
  onClose,
}) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      if (onClose) onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  if (!isVisible) return null;

  const getStyles = () => {
    switch (type) {
      case "success":
        return {
          bg: "bg-green-100",
          text: "text-green-800",
          icon: <CircleCheck className="h-5 w-5 text-green-600" />,
        };
      case "warning":
        return {
          bg: "bg-yellow-100",
          text: "text-yellow-800",
          icon: <TriangleAlert className="h-5 w-5 text-yellow-600" />,
        };
      case "error":
        return {
          bg: "bg-red-100",
          text: "text-red-800",
          icon: <CircleX className="h-5 w-5 text-red-600" />,
        };
      case "info":
        return {
          bg: "bg-blue-100",
          text: "text-blue-800",
          icon: <Info className="h-5 w-5 text-blue-600" />,
        };
      default:
        return {
          bg: "bg-gray-100",
          text: "text-gray-800",
          icon: null,
        };
    }
  };

  const styles = getStyles();

  return (
    <div
      className={`fixed top-5 left-1/2 transform -translate-x-1/2 z-50 px-4 py-3 rounded-lg shadow-lg flex items-center space-x-3 ${styles.bg} ${styles.text}`}
    >
      {styles.icon}
      <span className="text-sm font-medium">{message}</span>
      <button
        onClick={() => setIsVisible(false)}
        className="focus:outline-none"
      >
        <X className="h-5 w-5" />
      </button>
    </div>
  );
};

export default Alert;
