export const metadata = {
  title: "Quantum Vortex Experience",
  description: "Awwwards-winning 3D scroll experience",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, padding: 0, background: "#0a0a0f", overflowX: "hidden" }}>
        {children}
      </body>
    </html>
  );
}
