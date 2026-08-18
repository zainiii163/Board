import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";

import PublicHomePage from "./(public)/page";

export default function RootHomePage() {
    return (
        <>
            <Header />
            <main className="flex-1">
                <PublicHomePage />
            </main>
            <Footer />
        </>
    );
}
