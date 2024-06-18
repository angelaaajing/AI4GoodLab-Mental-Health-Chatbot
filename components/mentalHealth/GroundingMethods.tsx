import React from 'react'

export function GroundingMethods() {
  return (
    <div className="grounding-container">
      <strong>Deep Breathing Exercise:</strong><br/>
        <iframe
        width="550"
        height="350"
        src={`https://www.youtube.com/embed/sJ04nsiz_M0`}
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        title="YouTube video"
      ></iframe> <br/>
        <strong>5-4-3-2-1 Technique:</strong><br/>
        <iframe
        width="550"
        height="350"
        src={`https://www.youtube.com/embed/30VMIEmA114`}
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        title="YouTube video"
      ></iframe> <br/>
      <strong>Focus Reset Exercise:</strong><br/>
        <iframe
        width="550"
        height="350"
        src={`https://www.youtube.com/embed/QtE00VP4W3Y`}
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        title="YouTube video"
      ></iframe> <br/>
    </div>
  )
}
