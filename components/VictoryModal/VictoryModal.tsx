"use client";

import Image from "next/image";
import "./VictoryModal.css";

interface VictoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  partnerName: string;
  partnerDescription: string;
  partnerImageSrc: string;
}

export default function VictoryModal({
  isOpen,
  onClose,
  partnerName,
  partnerDescription,
  partnerImageSrc,
}: VictoryModalProps) {
  if (!isOpen) return null;

  return (
    <div className="victory-modal-overlay" onClick={onClose}>
      <div className="victory-modal-content pixel-card" onClick={(e) => e.stopPropagation()}>
        <div className="victory-modal-header">
          <h2 className="pixel-font">PARTNER UNLOCKED</h2>
          <button onClick={onClose} className="victory-close-btn">
            &times;
          </button>
        </div>

        <div className="victory-modal-body">
          <div className="victory-partner-showcase">
            <div className="victory-avatar-frame">
              <Image
                src={partnerImageSrc}
                alt={partnerName}
                className="victory-avatar animate-bounce-slow"
                width={140}
                height={140}
                priority
              />
            </div>
            <div className="victory-celebration-text">
              <p className="victory-announcement">
                Kura can now keep up with the <strong>{partnerName}</strong>!
              </p>
              <p className="victory-partner-details">"{partnerDescription}"</p>
            </div>
          </div>
        </div>

        <div className="victory-modal-footer">
          <button onClick={onClose} className="pixel-btn pixel-btn-accent victory-action-btn">
            CONTINUE JOURNEY
          </button>
        </div>
      </div>
    </div>
  );
}
