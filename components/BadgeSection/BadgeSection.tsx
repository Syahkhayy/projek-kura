"use client";

import Image from "next/image";
import { Badge } from "@/lib/badges";
import "./BadgeSection.css";

interface BadgeSectionProps {
  earnedBadges: Badge[];
}

export default function BadgeSection({ earnedBadges }: BadgeSectionProps) {
  if (!earnedBadges || earnedBadges.length === 0) return null;

  return (
    <div className="badge-section">
      <h3 className="badge-section-title pixel-font">KURA'S HONOURS</h3>
      <div className="badge-grid">
        {earnedBadges.map((badge) => (
          <div key={badge.id} className="badge-item-container">
            <div className="badge-item">
              <div className="badge-image-wrapper">
                <Image
                  src={badge.image_src}
                  alt={badge.name}
                  width={64}
                  height={64}
                  className="badge-image"
                  unoptimized
                />
              </div>
            </div>

            {/* Lore Tooltip in cozy retro game style */}
            <div className="badge-tooltip pixel-card">
              <h4 className="tooltip-title pixel-font">{badge.name}</h4>
              <p className="tooltip-lore">"{badge.lore}"</p>
              {badge.earned_at && (
                <div className="tooltip-date pixel-font">
                  EARNED: {new Date(badge.earned_at).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
