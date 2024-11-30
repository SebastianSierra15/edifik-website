"use client";

import { useState, useEffect } from "react";
import {
  FaShareAlt,
  FaWhatsapp,
  FaFacebook,
  FaTwitter,
  FaTelegram,
  FaTimes,
} from "react-icons/fa";

type ShareButtonProps = {
  message: string;
};

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
        shareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(
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
        className="p-2 rounded-full text-[#8B4513] hover:text-[#DAA520] transition duration-300"
        aria-label="Compartir"
      >
        <FaShareAlt size={20} />
      </button>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white relative rounded-lg px-4 pb-4 pt-2 w-64">
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 transition duration-200"
              aria-label="Cerrar modal"
            >
              <FaTimes size={20} />
            </button>
            <h2
              className="text-center text-lg font-semibold mb-4"
              style={{ color: "#8B4513" }}
            >
              Compartir en:
            </h2>
            <div className="flex justify-around items-center">
              <button
                onClick={() => handleShare("whatsapp")}
                className="text-green-500 hover:scale-110 transition duration-200"
                aria-label="Compartir en WhatsApp"
              >
                <FaWhatsapp size={30} />
              </button>
              <button
                onClick={() => handleShare("facebook")}
                className="text-blue-500 hover:scale-110 transition duration-200"
                aria-label="Compartir en Facebook"
              >
                <FaFacebook size={30} />
              </button>
              <button
                onClick={() => handleShare("twitter")}
                className="text-blue-400 hover:scale-110 transition duration-200"
                aria-label="Compartir en Twitter"
              >
                <FaTwitter size={30} />
              </button>
              <button
                onClick={() => handleShare("telegram")}
                className="text-blue-300 hover:scale-110 transition duration-200"
                aria-label="Compartir en Telegram"
              >
                <FaTelegram size={30} />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
