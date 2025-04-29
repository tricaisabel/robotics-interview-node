import React from "react";
import config from "../config";
import { Label } from "@shared-types/label";

interface LabelCardProps {
  label: Label;
}

const LabelCard: React.FC<LabelCardProps> = ({ label }) => {
  const imgSrc = `data:image/jpeg;base64,${label.image}`;

  return (
    <div className="label-card">
      <div className="label-info">
        <div className="label-card-header">
          <h2>
            Label: <span className="label-id">{label.id}</span>
          </h2>
        </div>
        <div className="label-card-details">
          <p>
            <i className="bi bi-clock"></i> {label.timestamp}
          </p>
          <p>
            <i className="bi bi-arrows-fullscreen"></i>
            <strong>Image:</strong> {label.data?.width} × {label.data?.height}{" "}
            px
          </p>
          <p>
            <i className="bi bi-arrows-move"></i>
            <strong>Position:</strong> X: {label.data?.x}, Y: {label.data?.y}
          </p>
          <p>
            <i className="bi bi-aspect-ratio-fill"></i>
            <strong>Box Size:</strong> W: {label.data?.w}px × H:
            {label.data?.h}px
          </p>
          <p>
            <i className="bi bi-camera-video"></i>
            <strong>Camera index:</strong> {label.data?.cameraIndex}
          </p>
          <p>
            <i className="bi bi-palette"></i>
            <strong>Camera type:</strong> {label.data?.cameraType}
          </p>
        </div>
        <div className="label-card-footer">
          <a href={`${config.apiImageUrl}/${label.id}`} target="_blank">
            <button className="view-picture-link">View picture</button>
          </a>
        </div>
      </div>
      <div className="label-picture">
        <img src={imgSrc} alt="Label Image" />
      </div>
    </div>
  );
};

export default LabelCard;
