import Image from "next/image";

export default function Header() {
    return (
        <header className="bg-[#131519] py-4 px-6 flex justify-between items-center">
            <div className="flex items-center space-x-6">
                <Image
                    src="/Logo.svg"
                    alt="AppKit Logo"
                    width={87}
                    height={24}
                    priority
                />
                <nav className="hidden md:flex space-x-6">
                    <a href="#" className="text-[#DAEEFE99] hover:text-white">SendAI</a>
                    <a href="#" className="text-[#DAEEFE99] hover:text-white">Send Arcade</a>
                </nav>
            </div>
            <div>
                <button className="bg-white text-black rounded-full px-6 py-2 font-medium">
                    Download the App
                </button>
            </div>
        </header>
    );
}
