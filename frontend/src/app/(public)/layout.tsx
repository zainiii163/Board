import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { PlatformIntro } from "@/components/layout/platform-intro";
import { SearchShortcut } from "@/components/layout/search-shortcut";
import { PwaInstallPrompt } from "@/components/layout/pwa-install-prompt";
import { OfflineBanner } from "@/components/layout/offline-banner";
import { ServiceWorkerRegister } from "@/components/layout/service-worker-register";
import { WhatsAppButton } from "@/components/layout/whatsapp-button";
import { FloatingDarkToggle } from "@/components/layout/floating-dark-toggle";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col bg-background font-sans text-foreground">
      <ServiceWorkerRegister />
      <SearchShortcut />
      <Header />
      <OfflineBanner />
      <main className="flex-1">{children}</main>
      <PlatformIntro />
      <Footer />
      <PwaInstallPrompt />
      <WhatsAppButton />
      <FloatingDarkToggle />
    </div>
  );
}
