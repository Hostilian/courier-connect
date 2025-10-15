// Root layout
import './globals.css';
import SimpleHeader from '@/components/SimpleHeader';
import SimpleFooter from '@/components/SimpleFooter';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <meta name="description" content="Courier Connect — local couriers connecting people. Request pickups or become a courier. Fast, friendly service." />
      </head>
      <body className="bg-white text-slate-900 antialiased min-h-screen flex flex-col">
        <SimpleHeader />

        <main className="flex-1 w-full">
          {children}
        </main>

        <SimpleFooter />

        {/* Optional background audio control for human-friendly sound */}
        <div className="fixed bottom-4 right-4 z-50">
          <audio id="cc-bg-audio" src="/audio/ambient.mp3" loop preload="none" />
          <button
            onClick={() => {
              const a = document.getElementById('cc-bg-audio') as HTMLAudioElement | null;
              if (!a) return;
              if (a.paused) a.play();
              else a.pause();
            }}
            className="px-3 py-2 bg-white border rounded-md shadow"
            aria-label="Toggle ambient sound"
          >
            🔊
          </button>
        </div>
      </body>
    </html>
  );
}
