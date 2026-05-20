"use client";

import Image from "next/image";
import { getNextMilestone, getCurrentMilestone, getMilestoneProgress } from "@/lib/milestones";
import "./MilestoneTracker.css";

interface MilestoneTrackerProps {
  currentEndurance: number;
}

export default function MilestoneTracker({ currentEndurance }: MilestoneTrackerProps) {
  const nextMilestone = getNextMilestone(currentEndurance);
  const currentMilestone = getCurrentMilestone(currentEndurance);
  const progressData = getMilestoneProgress(currentEndurance);

  // If all milestones are unlocked (endurance >= 8.0 km)
  if (!nextMilestone) {
    return (
      <div className="milestone-tracker-card pixel-card all-unlocked">
        <h3 className="tracker-title">CURRENT TRAINING PARTNER</h3>
        <div className="partner-display">
          <div className="partner-avatar-frame">
            <Image
              src="/forest_runner.png"
              alt="Forest Runner"
              className="partner-avatar"
              width={80}
              height={80}
            />
          </div>
          <div className="partner-info">
            <h4 className="partner-name">Forest Runner</h4>
            <p className="partner-desc">
              A seasoned guardian of the Balak Forest. Kura is finally strong enough to train by their side.
            </p>
          </div>
        </div>
        <div className="tracker-progress-container">
          <div className="tracker-progress-labels">
            <span>Peak Stamina</span>
            <span>42.0 km Limit</span>
          </div>
          <div className="tracker-progress-track">
            <div className="tracker-progress-fill full"></div>
          </div>
          <div className="tracker-progress-status">
            {currentEndurance.toFixed(1)} / 42.0 km
          </div>
        </div>
      </div>
    );
  }

  // Regular progression state
  const { percentage, nextThreshold, currentValue } = progressData!;
  const partnerName = currentMilestone ? currentMilestone.name : "None (Training Alone)";
  const partnerImage = currentMilestone ? currentMilestone.imageSrc : "/kura-weak.png";
  const partnerDesc = currentMilestone
    ? currentMilestone.description
    : "Kura is still building his base stamina. Keep running to unlock the first partner!";

  return (
    <div className="milestone-tracker-card pixel-card">
      <h3 className="tracker-title">CURRENT TRAINING PARTNER</h3>
      <div className="partner-display">
        <div className="partner-avatar-frame">
          <Image
            src={partnerImage}
            alt={partnerName}
            className="partner-avatar"
            width={80}
            height={80}
          />
        </div>
        <div className="partner-info">
          <h4 className="partner-name">{partnerName}</h4>
          <p className="partner-desc">{partnerDesc}</p>
        </div>
      </div>

      <div className="tracker-progress-container">
        <div className="tracker-progress-labels">
          <span>
            Current: <strong>{currentValue.toFixed(1)} km</strong>
          </span>
          <span>
            Goal: <strong>{nextThreshold.toFixed(1)} km</strong>
          </span>
        </div>
        <div className="tracker-progress-track">
          <div
            className="tracker-progress-fill"
            style={{ "--tracker-progress": `${percentage}%` } as React.CSSProperties}
          ></div>
        </div>
        <div className="tracker-progress-status">
          {percentage}% towards training with {nextMilestone.name}
        </div>
      </div>
    </div>
  );
}
