"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { X } from "lucide-react";
import WhatsAppIcon from "../../icons/whatsAppIcon";
import FacebookIcon from "../../icons/facebookIcon";
import XIcon from "../../icons/xIcon";
import TelegramIcon from "../../icons/telegramIcon";

const Share2 = dynamic(() => import("lucide-react").then((mod) => mod.Share2));

interface ShareButtonProps {
  message: string;
}

export default function ShareButton({ message }: ShareButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [url, setUrl] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      setUrl(window.location.href);
    }
  }, []);

  const handleShare = (platform: string) => {
    let shareUrl = "";
    const encodedMessage = encodeURIComponent(`${message} ${url}`);

    switch (platform) {
      case "whatsapp":
        shareUrl = `https://api.whatsapp.com/send?text=${encodedMessage}`;
        break;
      case "facebook":
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
          url
        )}`;
        break;
      case "twitter":
        shareUrl = `https://x.com/intent/tweet?url=${encodeURIComponent(
          url
        )}&text=${encodeURIComponent(message)}`;
        break;
      case "telegram":
        shareUrl = `https://t.me/share/url?url=${encodeURIComponent(
          url
        )}&text=${encodedMessage}`;
        break;
      default:
        return;
    }

    window.open(
      shareUrl,
      "_blank",
      "width=600,height=400,scrollbars=no,toolbar=no,location=no,status=no,menubar=no"
    );
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(true)}
        className="rounded-full p-2 text-[#8B4513] transition duration-300 hover:text-[#DAA520]"
        aria-label="Compartir"
      >
        <Share2 size={20} />
      </button>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="relative w-64 rounded-lg bg-white px-4 pb-4 pt-2">
            <button
              onClick={() => setIsOpen(false)}
              className="absolute right-3 top-3 text-gray-500 transition duration-200 hover:text-gray-700"
              aria-label="Cerrar modal"
            >
              <X size={20} />
            </button>
            <h2
              className="mb-4 text-center text-lg font-semibold"
              style={{ color: "#8B4513" }}
            >
              Compartir en:
            </h2>
            <div className="flex items-center justify-around">
              <button
                onClick={() => handleShare("whatsapp")}
                className="text-green-500 transition duration-200 hover:scale-110"
                aria-label="Compartir en WhatsApp"
              >
                <WhatsAppIcon className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleShare("facebook")}
                className="text-blue-500 transition duration-200 hover:scale-110"
                aria-label="Compartir en Facebook"
              >
                <FacebookIcon className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleShare("twitter")}
                className="text-blue-400 transition duration-200 hover:scale-110"
                aria-label="Compartir en Twitter"
              >
                <XIcon className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleShare("telegram")}
                className="text-blue-300 transition duration-200 hover:scale-110"
                aria-label="Compartir en Telegram"
              >
                <TelegramIcon className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
