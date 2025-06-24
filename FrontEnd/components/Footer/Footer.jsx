import Image from "next/image";
import Link from "next/link";
import logo from "@/public/logo.png";
import {
  FaGithub,
  FaTwitter,
  FaLinkedin,
  FaDiscord,
  FaHeart,
  FaCode,
  FaBook,
  FaUsers,
} from "react-icons/fa";
import { SiHtml5, SiCss3, SiJavascript, SiReact } from "react-icons/si";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const footerLinks = [
    { name: "Home", href: "/" },
    { name: "About", href: "/about" },
    { name: "Tasks", href: "/tasks" },
    { name: "Create", href: "/create" },
    { name: "Profile", href: "/profile" },
  ];

  const socialLinks = [
    { icon: FaGithub, href: "#", label: "GitHub" },
    { icon: FaTwitter, href: "#", label: "Twitter" },
    { icon: FaLinkedin, href: "#", label: "LinkedIn" },
    { icon: FaDiscord, href: "#", label: "Discord" },
  ];
  const techStack = [
    { icon: SiHtml5, color: "tech-html5", name: "HTML5" },
    { icon: SiCss3, color: "tech-css3", name: "CSS3" },
    { icon: SiJavascript, color: "tech-javascript", name: "JavaScript" },
    { icon: SiReact, color: "tech-react", name: "React" },
  ];

  return (
    <footer className="relative w-full mt-auto">
      {/* Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-t from-[var(--footer-bg-gradient-from)] via-[var(--footer-bg-gradient-via)] to-[var(--footer-bg-gradient-to)]"></div>

      {/* Animated Wave Background */}
      <div className="absolute inset-0 overflow-hidden opacity-30">
        <svg
          className="absolute bottom-0 w-full h-full"
          viewBox="0 0 1200 320"
          preserveAspectRatio="none"
        >
          <path
            fill="url(#wave-gradient)"
            d="M0,96L48,112C96,128,192,160,288,186.7C384,213,480,235,576,213.3C672,192,768,128,864,128C960,128,1056,192,1152,208C1248,224,1344,192,1392,176L1440,160L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
          >
            <animate
              attributeName="d"
              dur="10s"
              repeatCount="indefinite"
              values="M0,96L48,112C96,128,192,160,288,186.7C384,213,480,235,576,213.3C672,192,768,128,864,128C960,128,1056,192,1152,208C1248,224,1344,192,1392,176L1440,160L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z;
                      M0,64L48,80C96,96,192,128,288,128C384,128,480,96,576,112C672,128,768,192,864,208C960,224,1056,192,1152,160C1248,128,1344,96,1392,80L1440,64L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z;
                      M0,96L48,112C96,128,192,160,288,186.7C384,213,480,235,576,213.3C672,192,768,128,864,128C960,128,1056,192,1152,208C1248,224,1344,192,1392,176L1440,160L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
            />
          </path>
          <defs>
            <linearGradient
              id="wave-gradient"
              x1="0%"
              y1="0%"
              x2="100%"
              y2="0%"
            >
              <stop offset="0%" stopColor="var(--footer-wave-stop-1)" />
              <stop offset="50%" stopColor="var(--footer-wave-stop-2)" />
              <stop offset="100%" stopColor="var(--footer-wave-stop-3)" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* Main Footer Content */}
      <div className="relative z-10 backdrop-blur-sm bg-[var(--footer-main-bg)] border-t border-[var(--footer-border)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Top Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            {/* Logo and Description */}
            <div className="lg:col-span-2 space-y-6">
              <div className="flex items-center space-x-3">
                <div className="relative group">
                  <Image
                    src={logo}
                    alt="WebWiz Logo"
                    width={48}
                    height={48}
                    className="transition-transform duration-300 group-hover:scale-110 group-hover:rotate-12 drop-shadow-lg"
                  />{" "}
                  <div className="absolute inset-0 bg-gradient-to-r from-[var(--footer-logo-glow-from)] to-[var(--footer-logo-glow-to)] rounded-full opacity-0 group-hover:opacity-20 transition-opacity duration-300 blur-xl"></div>
                </div>
                <h3 className="text-2xl font-bold bg-gradient-to-r from-[var(--footer-title-gradient-from)] via-[var(--footer-title-gradient-via)] to-[var(--footer-title-gradient-to)] bg-clip-text text-transparent">
                  WebWiz
                </h3>
              </div>
              <p className="text-[var(--footer-description)] max-w-md leading-relaxed">
                Master Frontend Development through interactive challenges and
                hands-on projects. Learn HTML, CSS, JavaScript, and React in a
                fun, engaging way.
              </p>

              {/* Tech Stack Icons */}
              <div className="flex space-x-4">
                {techStack.map((tech, index) => (
                  <div
                    key={index}
                    className="group relative p-2 rounded-lg bg-[var(--footer-tech-bg)] backdrop-blur-sm border border-[var(--footer-tech-border)] hover:scale-110 transition-all duration-300 cursor-pointer"
                    title={tech.name}
                  >
                    <tech.icon
                      className={`w-6 h-6 ${tech.color} group-hover:scale-110 transition-transform duration-300`}
                    />
                    <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-[var(--footer-tech-hover-from)] to-[var(--footer-tech-hover-to)] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>
                ))}
              </div>
            </div>{" "}
            {/* Quick Links */}
            {/* <div className="space-y-6">
              <h4 className="text-lg font-semibold text-[var(--text-on-primary)] flex items-center">
                <FaBook className="mr-2 text-[var(--footer-quick-links-icon)]" />
                Quick Links
              </h4>
              <ul className="space-y-3">
                {footerLinks.map((link, index) => (
                  <li key={index}>
                    <Link
                      href={link.href}
                      className="text-[var(--footer-quick-links-text)] hover:text-[var(--footer-quick-links-hover)] transition-colors duration-300 flex items-center group"
                    >
                      <span className="w-2 h-2 bg-gradient-to-r from-[var(--footer-quick-links-dot-from)] to-[var(--footer-quick-links-dot-to)] rounded-full mr-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div> */}
            {/* Community */}{" "}
            <div className="space-y-6">
              <h4 className="text-lg font-semibold text-[var(--text-on-primary)] flex items-center">
                <FaUsers className="mr-2 text-[var(--footer-community-icon)]" />
                Community
              </h4>
              <div className="space-y-4">
                <p className="text-sm text-[var(--footer-description)]">
                  Join our growing community of developers
                </p>
                <div className="flex space-x-3">
                  {socialLinks.map((social, index) => (
                    <a
                      key={index}
                      href={social.href}
                      aria-label={social.label}
                      className="group p-2 rounded-lg bg-[var(--footer-social-bg)] backdrop-blur-sm border border-[var(--footer-social-border)] hover:bg-gradient-to-r hover:from-[var(--footer-social-hover-from)] hover:to-[var(--footer-social-hover-to)] transition-all duration-300"
                    >
                      <social.icon className="w-5 h-5 text-[var(--footer-social-icon)] group-hover:text-[var(--footer-social-icon-hover)] transition-colors duration-300" />
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>{" "}
          {/* Call to Action */}
          {/* <div className="text-center py-8 border-t border-b border-[var(--footer-cta-border)] mb-8">
            <h3 className="text-2xl font-bold bg-gradient-to-r from-[var(--footer-cta-title-from)] via-[var(--footer-cta-title-via)] to-[var(--footer-cta-title-to)] bg-clip-text text-transparent mb-4">
              Ready to Start Your Journey?
            </h3>
            <p className="text-[var(--footer-cta-description)] mb-6 max-w-2xl mx-auto">
              Join thousands of developers who are already mastering frontend
              development with WebWiz
            </p>
            <Link
              href="/tasks"
              className="inline-flex items-center px-8 py-3 rounded-full bg-gradient-to-r from-[var(--footer-cta-button-from)] to-[var(--footer-cta-button-to)] text-white font-semibold shadow-lg hover:shadow-xl hover:shadow-[var(--footer-cta-button-shadow-hover)] transition-all duration-300 hover:scale-105 group"
            >
              <FaCode className="mr-2 group-hover:rotate-12 transition-transform duration-300" />
              Start Coding Now
            </Link>
          </div> */}
          {/* Bottom Section */}
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex items-center text-sm text-[var(--footer-text)]">
              <span>Made with</span>
              <FaHeart className="mx-2 text-[var(--footer-heart)] animate-pulse" />
              <span>by the WebWiz Team</span>
            </div>
            <div className="text-sm text-[var(--footer-text)]">
              © {currentYear} WebWiz. All rights reserved.
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
