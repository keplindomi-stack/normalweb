"use client";

export default function LoadingScreen({ progress }) {
  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        background: "#0a0a0f",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 9999,
        transition: "opacity 0.5s ease",
        opacity: progress >= 100 ? 0 : 1,
        pointerEvents: progress >= 100 ? "none" : "all",
      }}
    >
      <div
        style={{
          width: "200px",
          height: "2px",
          background: "rgba(255, 255, 255, 0.1)",
          borderRadius: "2px",
          overflow: "hidden",
          marginBottom: "20px",
        }}
      >
        <div
          style={{
            width: `${progress}%`,
            height: "100%",
            background: "linear-gradient(90deg, #00ffff, #ff00a0)",
            borderRadius: "2px",
            transition: "width 0.2s ease",
            boxShadow: "0 0 10px rgba(0, 255, 255, 0.5)",
          }}
        />
      </div>
      <p
        style={{
          color: "rgba(255, 255, 255, 0.6)",
          fontFamily: "monospace",
          fontSize: "12px",
          letterSpacing: "2px",
        }}
      >
        {Math.round(progress)}%
      </p>
    </div>
  );
}
