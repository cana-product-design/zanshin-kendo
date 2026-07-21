import React from 'react';

interface LayoutProps {
  children: React.ReactNode;
}

const ZanshinLogo = () => (
  <svg width="40" height="40" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="mr-3 opacity-90">
    <circle cx="24" cy="24" r="23" stroke="white" strokeOpacity="0.1" strokeWidth="2" />
    <path d="M24 8V40" stroke="#7F1D1D" strokeWidth="4" strokeLinecap="round" />
    <path d="M14 24H34" stroke="white" strokeWidth="2" strokeLinecap="round" />
    <circle cx="24" cy="24" r="8" fill="#7F1D1D" className="animate-pulse" />
  </svg>
);

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col relative bg-[#050811] text-white overflow-x-hidden">
      {/* Immersive Background Gradient/Texture */}
      <div className="fixed inset-0 z-0">
        <div className="absolute top-[-20%] left-[-20%] w-[80%] h-[60%] bg-[#1E2945] rounded-full mix-blend-screen filter blur-[100px] opacity-20"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-[#7F1D1D] rounded-full mix-blend-screen filter blur-[120px] opacity-10"></div>
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-5"></div>
      </div>
      
      {/* Header */}
      <header className="z-20 sticky top-0 backdrop-blur-md bg-[#050811]/50 border-b border-white/5 safe-top">
        <div className="max-w-md mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center">
            <ZanshinLogo />
            <div>
              <h1 className="text-xl font-semibold tracking-wide">
                ZANSHIN
              </h1>
            </div>
          </div>
          {/* Status Indicator */}
          <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]"></div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow z-10 w-full max-w-md mx-auto px-6 py-8 pb-32">
        {children}
      </main>

      {/* Bottom fade for scroll content */}
      <div className="fixed bottom-0 left-0 w-full h-24 bg-gradient-to-t from-[#050811] to-transparent pointer-events-none z-10 safe-bottom"></div>
    </div>
  );
};

export default Layout;