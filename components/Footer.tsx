"use client";

import {
    FaFacebookF,
    FaTwitter,
    FaLinkedinIn,
    FaInstagram,
    FaPhone,
    FaEnvelope,
    FaComments,
} from "react-icons/fa";

export default function Footer() {
    return (
        <footer className="w-full bg-[#0c1e2e] text-gray-300 border-t border-[#123047] mt-10">
            <div className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-1 md:grid-cols-4 gap-12">

                {/* Contact column */}
                <div className="space-y-3">
                    <div className="flex items-center gap-2">
                        <FaComments className="text-gray-400" />
                        <span>Chat With Sales</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <FaPhone className="text-gray-400" />
                        <span>1 (888) 602-6756</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <FaEnvelope className="text-gray-400" />
                        <span>sales@example.com</span>
                    </div>
                </div>

                {/* Solutions */}
                <div>
                    <h3 className="text-teal-400 font-semibold mb-4">Solutions</h3>
                    <ul className="space-y-2 text-sm">
                        <li>Managed Hosting</li>
                        <li>Agencies</li>
                        <li>SMBs</li>
                        <li>Freelancers</li>
                        <li>High-Traffic Websites</li>
                        <li>Platforms</li>
                    </ul>
                </div>

                {/* Company */}
                <div>
                    <h3 className="text-teal-400 font-semibold mb-4">Company</h3>
                    <ul className="space-y-2 text-sm">
                        <li>About Us</li>
                        <li>Careers</li>
                        <li>Press Kit</li>
                        <li>Legal</li>
                        <li>Contact</li>
                    </ul>
                </div>

                {/* Resources */}
                <div>
                    <h3 className="text-teal-400 font-semibold mb-4">Resources</h3>
                    <ul className="space-y-2 text-sm mb-4">
                        <li>Blog</li>
                        <li>eBooks</li>
                        <li>Knowledge Base</li>
                        <li>Reviews</li>
                        <li>Affiliate Program</li>
                        <li>Partners</li>
                    </ul>

                    {/* Social icons */}
                    <div className="flex gap-4 text-lg">
                        <FaFacebookF className="hover:text-white cursor-pointer" />
                        <FaLinkedinIn className="hover:text-white cursor-pointer" />
                        <FaInstagram className="hover:text-white cursor-pointer" />
                        <FaTwitter className="hover:text-white cursor-pointer" />
                    </div>
                </div>
            </div>
        </footer>
    );
}
