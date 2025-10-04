import { Heart } from "lucide-react";

export const Footer = () => {
  return (
    <footer className="bg-primary text-white py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Heart className="h-6 w-6 text-secondary" fill="currentColor" />
              <span className="text-xl font-bold font-['Poppins']">Care Conneqt</span>
            </div>
            <p className="text-white/80 text-sm">
              Connected Health. Human Care.
            </p>
            <p className="text-white/60 text-xs">
              Operating in Spain, UK, and Netherlands
            </p>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Solutions</h3>
            <ul className="space-y-2 text-sm text-white/80">
              <li><a href="/dashboard" className="hover:text-secondary transition-colors">Member Dashboard</a></li>
              <li><a href="#" className="hover:text-secondary transition-colors">For Families</a></li>
              <li><a href="#" className="hover:text-secondary transition-colors">For Care Homes</a></li>
              <li><a href="#" className="hover:text-secondary transition-colors">For Insurers</a></li>
              <li><a href="#" className="hover:text-secondary transition-colors">For Municipalities</a></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Resources</h3>
            <ul className="space-y-2 text-sm text-white/80">
              <li><a href="#" className="hover:text-secondary transition-colors">Documentation</a></li>
              <li><a href="#" className="hover:text-secondary transition-colors">Support Center</a></li>
              <li><a href="#" className="hover:text-secondary transition-colors">Device Guides</a></li>
              <li><a href="#" className="hover:text-secondary transition-colors">API Docs</a></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Company</h3>
            <ul className="space-y-2 text-sm text-white/80">
              <li><a href="#" className="hover:text-secondary transition-colors">About Us</a></li>
              <li><a href="#" className="hover:text-secondary transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-secondary transition-colors">Terms of Service</a></li>
              <li><a href="#" className="hover:text-secondary transition-colors">GDPR Compliance</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-white/60">
          <div>© 2025 Care Conneqt. All rights reserved.</div>
          <div className="flex gap-4">
            <span>English</span>
            <span>Español</span>
            <span>Nederlands</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
