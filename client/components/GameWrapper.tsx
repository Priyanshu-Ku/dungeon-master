import { ReactNode } from "react";

export function GameWrapper({ children }: { children: ReactNode }) {
  return (
    <div className="relative w-screen h-screen overflow-hidden bg-[#07060F] select-none text-[#9D93C0] font-sans" style={{ fontFamily: "'Inter', sans-serif" }}>
      {/* Background Image Layer */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-40"
        style={{ 
          backgroundImage: "url('https://images.unsplash.com/photo-1767963710970-68cc2191c19e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkYXJrJTIwZmFudGFzeSUyMGR1bmdlb24lMjBzdG9uZSUyMHJ1aW5zJTIwbW9vZHl8ZW58MXx8fHwxNzc4MjQxNTUyfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral')",
          filter: "grayscale(20%) sepia(10%) hue-rotate(-10deg)"
        }}
      />
      
      {/* Atmospheric Fog/Vignette Overlay */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(circle at center, transparent 20%, #07060F 95%)"
        }}
      />
      
      {/* Particle Effect Overlay (Subtle) */}
      <div 
        className="absolute inset-0 bg-cover bg-center opacity-10 pointer-events-none mix-blend-screen"
        style={{ 
          backgroundImage: "url('https://images.unsplash.com/photo-1719885160996-0fad9d744cf5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhYnN0cmFjdCUyMGRhcmslMjBtYWdpYyUyMGdsb3dpbmclMjBwdXJwbGUlMjBwYXJ0aWNsZXN8ZW58MXx8fHwxNzc4MjQxNTU1fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral')",
        }}
      />

      {/* Game Content */}
      <div className="relative w-full h-full z-10">
        {children}
      </div>
    </div>
  );
}
