import logoImage from "@/assets/logo.webp";

export function AppBar() {
  return (
    <div className=" bg-gray-900 border-b border-gray-700 px-6 py-3">
      <div className="flex items-center justify-between">
        {/* Left side - Logo and App Name */}
        <div className="flex items-center space-x-3">
          <img
            src={logoImage}
            alt="Interactive Canvas Logo"
            className="h-8 w-8 object-contain"
          />
          <div>
            <h1 className="text-3xl font-bold  dark:text-white">
              Interactive Canvas
            </h1>
          </div>
        </div>
      </div>
    </div>
  );
}
