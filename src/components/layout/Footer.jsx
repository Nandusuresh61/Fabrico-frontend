
import { Link } from 'react-router-dom';
import { Facebook, Instagram, Mail, MapPin, Twitter } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  // Footer link sections
  const sections = [
    {
      title: 'Shop',
      links: [
        { name: 'New Arrivals', path: '/products?category=new-arrivals' },
        { name: 'Bestsellers', path: '/products?category=bestsellers' },
        { name: 'Baseball Caps', path: '/products?category=baseball-caps' },
        { name: 'Trucker Caps', path: '/products?category=trucker-caps' },
        { name: 'Snapback', path: '/products?category=snapback' },
      ],
    },
    {
      title: 'Support',
      links: [
        { name: 'Contact Us', path: '/contact' },
        { name: 'FAQs', path: '/faqs' },
        { name: 'Shipping & Returns', path: '/shipping-returns' },
        { name: 'Size Guide', path: '/size-guide' },
        { name: 'Track Order', path: '/track-order' },
      ],
    },
    {
      title: 'Company',
      links: [
        { name: 'About Us', path: '/about' },
        { name: 'Our Story', path: '/our-story' },
        { name: 'Privacy Policy', path: '/privacy-policy' },
        { name: 'Terms of Service', path: '/terms' },
        { name: 'Careers', path: '/careers' },
      ],
    },
  ];

  return (
    <footer className="border-t border-gray-200 bg-white">
      <div className="container px-4 py-12 md:px-6">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-5">
          {/* Brand Column */}
          <div className="lg:col-span-2">
            <Link to="/" className="inline-block">
              <span className="mb-6 inline-flex text-2xl font-semibold">
                <span className="text-primary">FAB</span>
                <span className="text-gray-500">RICO</span>
              </span>
            </Link>
            <p className="mb-6 max-w-md text-sm text-gray-600">
              Premium, high-quality caps for every style. Discover our collection of timeless designs crafted with exceptional materials and attention to detail.
            </p>
            <div className="flex flex-col space-y-3">
              <div className="flex items-center text-sm text-gray-600">
                <MapPin className="mr-3 h-4 w-4 text-gray-500" />
                <span>New Fashion Street, India, KL 670702</span>
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <Mail className="mr-3 h-4 w-4 text-gray-500" />
                <a href="mailto:hello@capshaven.com" className="hover:text-primary">
                  hello@Fabrico.com
                </a>
              </div>
            </div>
          </div>

          {/* Link Sections */}
          {sections.map((section) => (
            <div key={section.title}>
              <h3 className="mb-6 text-sm font-semibold uppercase tracking-wider text-gray-900">
                {section.title}
              </h3>
              <ul className="space-y-4">
                {section.links.map((link) => (
                  <li key={link.name}>
                    <Link
                      to={link.path}
                      className="text-sm text-gray-600 transition-colors hover:text-primary"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Section */}
        <div className="mt-12 border-t border-gray-200 pt-8">
          <div className="flex flex-col items-center justify-between space-y-6 md:flex-row md:space-y-0">
            {/* Copyright */}
            <p className="text-sm text-gray-600">
              © {currentYear} FABRICO. All rights reserved.
            </p>

            {/* Social Links */}
            <div className="flex space-x-4">
              <a
                href="#"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 text-gray-600 transition-colors hover:bg-primary hover:text-white"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 text-gray-600 transition-colors hover:bg-primary hover:text-white"
              >
                <Twitter className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 text-gray-600 transition-colors hover:bg-primary hover:text-white"
              >
                <Facebook className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
