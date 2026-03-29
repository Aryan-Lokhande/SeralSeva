import { Link } from "react-router-dom";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer
      className="
        relative mt-auto bg-gradient-to-tr
        from-[var(--nav)]/90
        via-[var(--nav-hover)]
        to-[var(--nav)] 
        border-t-4 border-[var(--btn)]
        shadow-[0_-10px_40px_rgba(var(--shadow-rgb),0.25)]"
    >
      {/* Glow */}
      <div className="absolute inset-0 bg-gradient-to-r from-[var(--btn)]/15 via-transparent to-[var(--btn)]/15 pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-9">
        {/* Grid */}
        <div
          className="
            grid grid-cols-1 sm:grid-cols-2
            lg:grid-cols-4 gap-8 sm:gap-10"
        >
          {/* About */}
          <div>
            <h3 className="text-xl sm:text-2xl font-bold text-white mb-3 sm:mb-4">
              YojnaSaathi
            </h3>
            <p className="text-white/70 text-sm leading-relaxed">
              Making government schemes and services accessible to every
              citizen. Your gateway to simplified governance.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-base sm:text-lg font-semibold text-white mb-3 sm:mb-4">
              Quick Links
            </h4>
            <ul className="space-y-2">
              {["Home", "Schemes", "Grievances", "Success Stories"].map(
                (item, index) => (
                  <li key={index}>
                    <Link
                      to={
                        item === "Home"
                          ? "/"
                          : `/${item.toLowerCase().replace(" ", "-")}`
                      }
                      className="
                      block py-1 text-white/70
                      hover:text-[var(--btn)]
                      transition-colors duration-200"
                    >
                      {item}
                    </Link>
                  </li>
                ),
              )}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="text-base sm:text-lg font-semibold text-white mb-3 sm:mb-4">
              Resources
            </h4>
            <ul className="space-y-2">
              {["FAQs", "Guidelines", "Help Center"].map((item) => (
                <li key={item}>
                  <a
                    href="#"
                    className="
                    block py-1 text-white/70
                    hover:text-[var(--btn)]
                    transition-colors duration-200"
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-base sm:text-lg font-semibold text-white mb-3 sm:mb-4">
              Contact
            </h4>
            <ul className="space-y-2 text-white/70 text-sm">
              <li>
                <Link
                  to="/contact"
                  className="
                  block py-1 hover:text-[var(--btn)]
                  transition-colors duration-200"
                >
                  Contact Us
                </Link>
              </li>
              <li>Email: support@yojnasaathi.gov.in</li>
              <li>Helpline: 1800-XXX-XXXX</li>
              <li>Timings: 9 AM – 6 PM (Mon–Fri)</li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 sm:mt-10 pt-6 sm:pt-8 border-t border-white/20">
          <div
            className="
            flex flex-col sm:flex-row justify-between
            items-center gap-3 sm:gap-4
            text-center sm:text-left"
          >
            <p className="text-white/60 text-xs sm:text-sm">
              © {currentYear} YojnaSaathi. All rights reserved.
            </p>

            <div className="flex flex-wrap justify-center sm:justify-end gap-4 sm:gap-6">
              {["Privacy Policy", "Terms of Service", "Accessibility"].map(
                (item) => (
                  <a
                    key={item}
                    href="#"
                    className="
                    text-white/60
                    hover:text-[var(--btn)]
                    transition-colors duration-200
                    text-xs sm:text-sm
                  "
                  >
                    {item}
                  </a>
                ),
              )}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
