import Demo from "@/components/Demo";
import Features from "@/components/Features";
import Footer from "@/components/Footer";
import Hero from "@/components/Home";

export default function Home() {
  return (
    <div className="w-full flex flex-col flex-grow">
      {/* Main Content */}
      <main className="flex-grow">
        <Hero />
        {/* Other sections will be added here */}
        <Demo />
        <Features />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
