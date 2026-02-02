import { Link } from "react-router-dom";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer
      className="
      bg-[var(--bg-sec)]
      mt-auto
      border-t border-[var(--bg-ter)]
    "
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* About Section */}
          <div>
            <h3 className="text-xl font-bold text-[var(--txt)] mb-4">
              SaralSeva
            </h3>
            <p className="text-[var(--txt-dim)] text-sm leading-relaxed">
              Making government schemes and services accessible to every
              citizen. Your gateway to simplified governance.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold text-[var(--txt)] mb-4">
              Quick Links
            </h4>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/"
                  className="
                  text-[var(--txt-dim)]
                  hover:text-[var(--btn)]
                  transition-colors duration-200"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to="/schemes"
                  className="
                  text-[var(--txt-dim)]
                  hover:text-[var(--btn)]
                  transition-colors duration-200"
                >
                  Schemes
                </Link>
              </li>
              <li>
                <Link
                  to="/grievances"
                  className="
                  text-[var(--txt-dim)]
                  hover:text-[var(--btn)]
                  transition-colors duration-200"
                >
                  Grievances
                </Link>
              </li>
              <li>
                <Link
                  to="/success-stories"
                  className="
                  text-[var(--txt-dim)] hover:text-[var(--btn)]
                  transition-colors duration-200"
                >
                  Success Stories
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="text-lg font-semibold text-[var(--txt)] mb-4">
              Resources
            </h4>
            <ul className="space-y-2">
              {["FAQs", "Guidelines", "Help Center"].map((item) => (
                <li key={item}>
                  <a
                    href="#"
                    className="
                    text-[var(--txt-dim)]
                    hover:text-[var(--btn)]
                    transition-colors duration-200
                  "
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-lg font-semibold text-[var(--txt)] mb-4">
              Contact
            </h4>
            <ul className="space-y-2 text-[var(--txt-dim)] text-sm">
              <li>
                <Link
                  to="/contact"
                  className="
                  text-[var(--txt-dim)] hover:text-[var(--btn)]
                  transition-colors duration-200 text-base"
                >
                  Contact
                </Link>
              </li>
              <li>Email: support@saralseva.gov.in</li>
              <li>Helpline: 1800-XXX-XXXX</li>
              <li>Timings: 9 AM – 6 PM (Mon–Fri)</li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 pt-8 border-t border-[var(--bg-ter)]">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-[var(--txt-dim)] text-sm">
              © {currentYear} SaralSeva. All rights reserved.
            </p>

            <div className="flex space-x-6 mt-4 md:mt-0">
              {["Privacy Policy", "Terms of Service", "Accessibility"].map(
                (item) => (
                  <a
                    key={item}
                    href="#"
                    className="
                    text-[var(--txt-dim)]
                    hover:text-[var(--btn)]
                    transition-colors duration-200
                    text-sm
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
