import React from "react";
import { FaInstagram, FaFacebookF, FaYoutube, FaLinkedinIn } from "react-icons/fa";

function FooterLast() {
  return (
    <footer className="w-full bg-[#383838] py-6 px-6  lg:px-14 flex flex-col items-center gap-5">
      {/* Title with lines */}
      <div className="flex items-center w-full gap-3">
        <span className="flex-grow h-px bg-[#a5a5a5]" />
        <span className="text-[28px] lg:text-[32px] font-bold text-white  tracking-wide">
          events
        </span>
        <span className="flex-grow h-px bg-[#a5a5a5]" />
      </div>

      {/* Social Icons */}
      <div className="flex justify-center items-center gap-6 mt-2">
        <a
          href="https://www.instagram.com"
          target="_blank"
          rel="noopener noreferrer"
          className="text-[#E1306C] hover:text-white text-[22px] md:text-[24px] transition duration-300 ease-in-out"
          aria-label="Instagram"
        >
          <FaInstagram className="text-[#a5a5a5] hover:text-[#ffffff]" />
        </a>
        <a
          href="https://www.facebook.com"
          target="_blank"
          rel="noopener noreferrer"
          className="text-[#1877F2] hover:text-white text-[22px] md:text-[24px] transition duration-300 ease-in-out"
          aria-label="Facebook"
        >
          <FaFacebookF className="text-[#a5a5a5] hover:text-[#ffffff]"/>
        </a>
        <a
          href="https://www.youtube.com"
          target="_blank"
          rel="noopener noreferrer"
          className="text-[#FF0000] hover:text-white text-[22px] md:text-[24px] transition duration-300 ease-in-out"
          aria-label="YouTube"
        >
          <FaYoutube className="text-[#a5a5a5] hover:text-[#ffffff]" />
        </a>
        <a
          href="https://www.linkedin.com"
          target="_blank"
          rel="noopener noreferrer"
          className="text-[#0A66C2] hover:text-white text-[22px] md:text-[24px] transition duration-300 ease-in-out"
          aria-label="LinkedIn"
        >
          <FaLinkedinIn className="text-[#a5a5a5] hover:text-[#ffffff]" />
        </a>
      </div>

      {/* Copyright */}
      <div className="text-[#9f9f9f] text-[12px] md:text-[14px] text-center mt-2">
        © {new Date().getFullYear()} Event.com — All rights reserved.
      </div>
    </footer>
  );
}

export default FooterLast;
