export function Footer() {
  return (
    <footer className="bg-white border-t py-6">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          {/* N Logo */}
          <div className="flex items-center">
            <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center mr-3">
              <span className="text-white font-bold text-sm">N</span>
            </div>
          </div>
          
          {/* Copyright */}
          <div className="text-center flex-1">
            <p className="text-sm text-gray-600">
              © 2025 ALX Polly. All rights reserved.
            </p>
          </div>
          
          {/* Right side - empty for balance */}
          <div className="w-8"></div>
        </div>
      </div>
    </footer>
  )
} 