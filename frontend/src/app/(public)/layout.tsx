import { Header } from "@/components/layout/header";
import { MobileTabBar } from "@/components/layout/mobile-tab-bar";
import { Footer } from "@/components/layout/footer";
import { PlatformIntro } from "@/components/layout/platform-intro";
import { ProfessionalContent } from "@/components/layout/professional-content";
import { SearchShortcut } from "@/components/layout/search-shortcut";
import { PwaInstallPrompt } from "@/components/layout/pwa-install-prompt";
import { OfflineBanner } from "@/components/layout/offline-banner";
import { ServiceWorkerRegister } from "@/components/layout/service-worker-register";
import { WhatsAppButton } from "@/components/layout/whatsapp-button";

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
      <main className="flex-1 pb-20 lg:pb-0">{children}</main>
      <PlatformIntro />
      <ProfessionalContent />
      <Footer />
      <PwaInstallPrompt />
      <WhatsAppButton />
      <MobileTabBar />
    </div>
  );
}
