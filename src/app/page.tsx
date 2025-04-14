import Hero from "@/components/Home";

export default function Home() {
  return (
    <div className="flex flex-col flex-grow">
      {/* Main Content */}
      <main className="flex-grow">
        <Hero />
        {/* Other sections will be added here */}
      </main>

      {/* Footer */}
      <footer className="py-4 px-6 text-center text-gray-400 text-sm">
        <div className="flex justify-center space-x-6">
          <a href="#" className="hover:text-white">Terms</a>
          <a href="#" className="hover:text-white">Privacy</a>
          <a href="#" className="hover:text-white">Contact</a>
        </div>
        <p className="mt-2">© 2023 AppKit. All rights reserved.</p>
      </footer>
    </div>
  );
}
