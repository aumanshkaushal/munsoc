"use client";

import { useState, useEffect, useRef } from "react";
import { Reveal } from "@/components/motion";
import { Sparkles, Check, ChevronDown } from "lucide-react";
import QRCode from "qrcode";

// CONFIGURATION: Payment URI
const PAYMENT_URI = "upi://pay?pa=manroopprsnl@oksbi&pn=Manroop&aid=uGICAgKCj2K7eIw&am=100&cu=INR";
const UPI_ID = "manroopprsnl@oksbi";

const memberList = [
  "Narendra Modi (Varanasi)",
  "Rahul Gandhi (Rae Bareli)",
  "Amit Shah (Gandhinagar)",
  "Akhilesh Yadav (Kannauj)",
  "Rajnath Singh (Lucknow)",
  "Nitin Gadkari (Nagpur)",
  "Shashi Tharoor (Thiruvananthapuram)",
  "Supriya Sule (Baramati)",
  "Asaduddin Owaisi (Hyderabad)",
  "Mahua Moitra (Krishnanagar)",
  "Harsimrat Kaur Badal (Bathinda)",
  "Abhishek Banerjee (Diamond Harbour)",
  "Dimple Yadav (Mainpuri)",
  "Gaurav Gogoi (Jorhat)",
  "Kangana Ranaut (Mandi)",
  "Chirag Paswan (Hajipur)",
  "Kanimozhi Karunanidhi (Thoothukkudi)",
  "Anurag Thakur (Hamirpur)",
  "Yusuf Pathan (Baharampur)",
  "Hema Malini (Mathura)",
  "Pappu Yadav (Purnia)",
  "Amritpal Singh (Khadoor Sahib)"
];

// Custom Canvas-based Liquid QR Code Component matching reference design
interface MunsocQrCodeProps {
  value: string;
  size?: number;
}

export function MunsocQrCode({ value, size = 260 }: MunsocQrCodeProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Render in high DPI
    canvas.width = size * 2;
    canvas.height = size * 2;
    canvas.style.width = `${size}px`;
    canvas.style.height = `${size}px`;
    ctx.scale(2, 2);

    // Clear Canvas
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, size, size);

    // Generate QR code data matrix using qrcode library
    const qr = QRCode.create(value, { errorCorrectionLevel: "H" });
    const { modules } = qr;
    const moduleCount = modules.size;
    const cellSize = size / moduleCount;

    // Check if cell is in a finder pattern corner (size: 7x7)
    const isFinderPattern = (r: number, c: number) => {
      if (r < 7 && c < 7) return true;
      if (r < 7 && c >= moduleCount - 7) return true;
      if (r >= moduleCount - 7 && c < 7) return true;
      return false;
    };

    // Center cutout for the logo (size: 8x8)
    const centerStart = Math.floor(moduleCount / 2) - 4;
    const centerEnd = Math.floor(moduleCount / 2) + 4;
    const isCenterLogo = (r: number, c: number) => {
      return r >= centerStart && r <= centerEnd && c >= centerStart && c <= centerEnd;
    };

    const isFilled = (r: number, c: number) => {
      if (r < 0 || r >= moduleCount || c < 0 || c >= moduleCount) return false;
      if (isFinderPattern(r, c) || isCenterLogo(r, c)) return false;
      return modules.get(c, r) === 1;
    };

    // Draw Body Liquid dots
    const gradient = ctx.createLinearGradient(0, 0, 0, size);
    gradient.addColorStop(0, "#000000"); // Top black
    gradient.addColorStop(1, "#0284c7"); // Bottom blue

    ctx.fillStyle = gradient;

    for (let r = 0; r < moduleCount; r++) {
      for (let c = 0; c < moduleCount; c++) {
        if (isFilled(r, c)) {
          const x = c * cellSize;
          const y = r * cellSize;
          
          const left = isFilled(r, c - 1);
          const right = isFilled(r, c + 1);
          const radius = cellSize / 2.2;

          ctx.beginPath();
          if (!left && !right) {
            ctx.arc(x + cellSize / 2, y + cellSize / 2, radius, 0, 2 * Math.PI);
          } else if (left && !right) {
            ctx.moveTo(x, y + cellSize / 2 - radius);
            ctx.lineTo(x + cellSize / 2, y + cellSize / 2 - radius);
            ctx.arc(x + cellSize / 2, y + cellSize / 2, radius, -Math.PI / 2, Math.PI / 2);
            ctx.lineTo(x, y + cellSize / 2 + radius);
            ctx.closePath();
          } else if (!left && right) {
            ctx.moveTo(x + cellSize, y + cellSize / 2 + radius);
            ctx.lineTo(x + cellSize / 2, y + cellSize / 2 + radius);
            ctx.arc(x + cellSize / 2, y + cellSize / 2, radius, Math.PI / 2, -Math.PI / 2);
            ctx.lineTo(x + cellSize, y + cellSize / 2 - radius);
            ctx.closePath();
          } else {
            ctx.rect(x, y + cellSize / 2 - radius, cellSize, radius * 2);
          }
          ctx.fill();
        }
      }
    }

    const roundRectPath = (c2d: CanvasRenderingContext2D, rx: number, ry: number, rw: number, rh: number, rr: number) => {
      c2d.moveTo(rx + rr, ry);
      c2d.arcTo(rx + rw, ry, rx + rw, ry + rh, rr);
      c2d.arcTo(rx + rw, ry + rh, rx, ry + rh, rr);
      c2d.arcTo(rx, ry + rh, rx, ry, rr);
      c2d.arcTo(rx, ry, rx + rw, ry, rr);
      c2d.closePath();
    };

    // Draw Custom Liquid Finder Patterns (Outer round border, inner rounded bars)
    const drawFinderPattern = (px: number, py: number, sizePx: number) => {
      const borderThickness = sizePx / 7;
      const radius = sizePx / 3.5;
      
      ctx.lineWidth = borderThickness;
      // Style color matching gradient: Top corners are black, bottom corner is blue
      ctx.strokeStyle = py > size / 2 ? "#0284c7" : "#000000";
      
      ctx.beginPath();
      roundRectPath(ctx, px + borderThickness/2, py + borderThickness/2, sizePx - borderThickness, sizePx - borderThickness, radius);
      ctx.stroke();

      const innerX = px + borderThickness * 2;
      const innerY = py + borderThickness * 2;
      const innerSize = borderThickness * 3;
      const barHeight = innerSize / 5;
      const barSpacing = innerSize / 5;
      const barRadius = barHeight / 2;

      ctx.fillStyle = ctx.strokeStyle;
      for (let i = 0; i < 3; i++) {
        const by = innerY + i * (barHeight + barSpacing);
        ctx.beginPath();
        roundRectPath(ctx, innerX, by, innerSize, barHeight, barRadius);
        ctx.fill();
      }
    };

    const finderSize = 7 * cellSize;
    drawFinderPattern(0, 0, finderSize);
    drawFinderPattern(size - finderSize, 0, finderSize);
    drawFinderPattern(0, size - finderSize, finderSize);

    // Draw Logo Cutout and Logo Image in Center
    const logoImg = new Image();
    logoImg.src = "/munsoc-black-blue.svg";
    logoImg.onload = () => {
      const logoSize = 8 * cellSize;
      const lx = (size - logoSize) / 2;
      const ly = (size - logoSize) / 2;
      
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(lx - 2, ly - 2, logoSize + 4, logoSize + 4);
      ctx.drawImage(logoImg, lx, ly, logoSize, logoSize);
    };
  }, [value, size]);

  return (
    <div className="bg-white p-4 rounded-3xl border-4 border-[#38bdf8]/35 shadow-lg shadow-[#38bdf8]/10 select-none">
      <canvas ref={canvasRef} />
    </div>
  );
}

// Custom dropdown component styled to match munsoc theme
interface CustomDropdownProps {
  label: string;
  value: string;
  onChange: (val: string) => void;
  options: string[];
  required?: boolean;
  disabledOptions?: string[];
}

function CustomDropdown({
  label,
  value,
  onChange,
  options,
  required,
  disabledOptions = [],
}: CustomDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  return (
    <div className="relative flex-1" ref={dropdownRef}>
      <label className="text-[10px] font-heading font-bold tracking-widest text-[#38bdf8] uppercase block mb-1.5">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      
      {/* Selector Box */}
      <div
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full bg-[#121212] border rounded-lg px-4 py-2.5 text-xs text-white transition-all cursor-pointer flex justify-between items-center select-none ${
          isOpen ? "border-[#38bdf8] shadow-sm shadow-[#38bdf8]/15" : "border-white/8 hover:border-white/20"
        }`}
      >
        <span className={value ? "text-white font-medium" : "text-white/30"}>
          {value || "Select Member"}
        </span>
        <ChevronDown size={14} className={`text-white/40 transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </div>

      {/* Options Dropdown */}
      {isOpen && (
        <ul className="absolute left-0 right-0 mt-1 max-h-48 overflow-y-auto bg-[#1c1c1e] border border-white/10 rounded-lg shadow-xl z-50 py-1 scrollbar-thin scrollbar-thumb-white/10">
          {options.map((opt) => {
            const isDisabled = disabledOptions.includes(opt);
            return (
              <li
                key={opt}
                onClick={() => {
                  if (!isDisabled) {
                    onChange(opt);
                    setIsOpen(false);
                  }
                }}
                className={`px-4 py-2 text-xs transition-colors select-none ${
                  isDisabled
                    ? "text-white/20 cursor-not-allowed bg-black/10"
                    : "text-white/80 hover:bg-[#38bdf8]/10 hover:text-white cursor-pointer"
                } ${value === opt ? "bg-[#38bdf8]/20 text-white font-semibold" : ""}`}
              >
                <div className="flex items-center justify-between">
                  <span>{opt}</span>
                  {value === opt && <Check size={12} className="text-[#38bdf8]" />}
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

export default function AippmClient() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    institute: "",
    pref1: "",
    pref2: "",
    pref3: "",
    experience: "",
    transactionId: "",
  });

  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleDropdownChange = (name: string) => (value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !formData.name ||
      !formData.email ||
      !formData.pref1 ||
      !formData.pref2 ||
      !formData.pref3 ||
      !formData.transactionId
    ) {
      alert("Please fill in all required fields.");
      return;
    }

    setSubmitting(true);
    try {
      const response = await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setSubmitted(true);
      } else {
        alert(data.error || "Something went wrong. Please try again.");
      }
    } catch (err) {
      console.error(err);
      alert("Network error. Please check your internet connection.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-16">
      
      {/* Detail Sections (Lorem Ipsum Boilerplates with 1 Topic) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20">
        <Reveal>
          <h2 className="font-display text-white text-2xl tracking-wider mb-4 uppercase">
            About the Committee
          </h2>
          <p className="text-white/60 text-xs sm:text-sm leading-relaxed mb-4 text-pretty">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
          </p>
          <p className="text-white/60 text-xs sm:text-sm leading-relaxed text-pretty">
            Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
          </p>
        </Reveal>

        <Reveal delay={0.1}>
          <h2 className="font-display text-white text-2xl tracking-wider mb-4 uppercase">
            Agenda &amp; Core Topic
          </h2>
          <div className="space-y-4">
            <div className="bg-[#1c1c1e] border border-[#38bdf8]/30 rounded-xl p-6 hover:border-[#38bdf8]/50 transition-all duration-300 shadow-md shadow-[#38bdf8]/2">
              <span className="text-[#38bdf8] text-[10px] font-heading tracking-widest font-bold block mb-1">
                TOPIC
              </span>
              <h3 className="text-white font-heading font-bold text-sm tracking-wide mb-2">
                Lorem Ipsum Dolor Sit Amet
              </h3>
              <p className="text-white/50 text-xs leading-relaxed">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur vitae egestas ante. Cras vel erat convallis, gravida tortor non, pulvinar lectus. Duis pulvinar, nunc non tristique tempus.
              </p>
            </div>
          </div>
        </Reveal>
      </div>

      {/* Application Form & Pay Section */}
      <div id="apply-now" className="scroll-mt-24">
        <Reveal className="text-center mb-12">
          <div className="inline-block border border-[#38bdf8]/30 text-[#38bdf8] text-[10px] font-heading tracking-[0.2em] px-3 py-1 rounded-sm mb-4">
            REGISTRATION FORM
          </div>
          <h2 className="font-display text-white text-3xl tracking-wide">
            APPLY FOR AIPPM
          </h2>
          <p className="mt-3 text-white/50 text-xs sm:text-sm max-w-lg mx-auto leading-relaxed">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
          </p>
        </Reveal>

        {submitted ? (
          <Reveal className="max-w-xl mx-auto bg-[#1c1c1e] border border-[#38bdf8]/30 rounded-2xl p-8 text-center shadow-lg shadow-[#38bdf8]/5">
            <div className="w-16 h-16 bg-[#38bdf8]/10 rounded-full flex items-center justify-center mx-auto mb-6 text-[#38bdf8]">
              <Sparkles size={32} />
            </div>
            <h3 className="font-heading font-bold text-white text-xl mb-3 uppercase tracking-wide">
              Application Submitted!
            </h3>
            <p className="text-white/70 text-xs sm:text-sm leading-relaxed mb-6">
              Thank you, <span className="text-[#38bdf8] font-bold">{formData.name}</span>. Your application for AIPPM has been received. Our secretariat team will review your portfolio preferences and email you with confirmation details.
            </p>
            <div className="bg-[#0a0a0a]/50 p-4 rounded-xl text-left border border-white/5 text-xs text-white/60 font-mono space-y-1">
              <div><span className="text-white/40">Email:</span> {formData.email}</div>
              <div><span className="text-white/40">Pref 1:</span> {formData.pref1}</div>
              <div><span className="text-white/40">Pref 2:</span> {formData.pref2}</div>
              <div><span className="text-white/40">Pref 3:</span> {formData.pref3}</div>
              <div><span className="text-white/40">Txn ID:</span> {formData.transactionId}</div>
            </div>
            <button
              onClick={() => {
                setSubmitted(false);
                setFormData({
                  name: "",
                  email: "",
                  institute: "",
                  pref1: "",
                  pref2: "",
                  pref3: "",
                  experience: "",
                  transactionId: "",
                });
              }}
              className="mt-8 bg-[#38bdf8] text-[#0a0a0a] font-heading font-bold text-xs tracking-widest px-8 py-3 rounded hover:bg-[#7dd3fc] transition-colors"
            >
              SUBMIT ANOTHER APPLICATION
            </button>
          </Reveal>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-8 items-start">
            
            {/* Form Fields */}
            <Reveal className="bg-[#1c1c1e] border border-white/5 rounded-2xl p-6 sm:p-8">
              <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                
                {/* Name */}
                <div>
                  <label className="text-[10px] font-heading font-bold tracking-widest text-[#38bdf8] uppercase block mb-1.5">
                    Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Enter your full name"
                    className="w-full bg-[#121212] border border-white/8 rounded-lg px-4 py-2.5 text-xs text-white placeholder-white/20 focus:outline-none focus:border-[#38bdf8] transition-all"
                    required
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="text-[10px] font-heading font-bold tracking-widest text-[#38bdf8] uppercase block mb-1.5">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="Enter your email address"
                    className="w-full bg-[#121212] border border-white/8 rounded-lg px-4 py-2.5 text-xs text-white placeholder-white/20 focus:outline-none focus:border-[#38bdf8] transition-all"
                    required
                  />
                </div>

                {/* Institute Name */}
                <div>
                  <label className="text-[10px] font-heading font-bold tracking-widest text-[#38bdf8] uppercase block mb-1.5">
                    Institute Name (if any)
                  </label>
                  <input
                    type="text"
                    name="institute"
                    value={formData.institute}
                    onChange={handleInputChange}
                    placeholder="Enter school/university name"
                    className="w-full bg-[#121212] border border-white/8 rounded-lg px-4 py-2.5 text-xs text-white placeholder-white/20 focus:outline-none focus:border-[#38bdf8] transition-all"
                  />
                </div>

                {/* Three Side-by-Side Member/Portfolio Preferences */}
                <div className="flex flex-col md:flex-row gap-4">
                  <CustomDropdown
                    label="1st Preference"
                    value={formData.pref1}
                    onChange={handleDropdownChange("pref1")}
                    options={memberList}
                    required
                    disabledOptions={[formData.pref2, formData.pref3]}
                  />

                  <CustomDropdown
                    label="2nd Preference"
                    value={formData.pref2}
                    onChange={handleDropdownChange("pref2")}
                    options={memberList}
                    required
                    disabledOptions={[formData.pref1, formData.pref3]}
                  />

                  <CustomDropdown
                    label="3rd Preference"
                    value={formData.pref3}
                    onChange={handleDropdownChange("pref3")}
                    options={memberList}
                    required
                    disabledOptions={[formData.pref1, formData.pref2]}
                  />
                </div>

                {/* MUN Experience Input */}
                <div>
                  <label className="text-[10px] font-heading font-bold tracking-widest text-[#38bdf8] uppercase block mb-1.5">
                    Any previous MUN experience? (if any)
                  </label>
                  <textarea
                    name="experience"
                    value={formData.experience}
                    onChange={handleInputChange}
                    rows={3}
                    placeholder="List your previous MUN participation, portfolios, or awards..."
                    className="w-full bg-[#121212] border border-white/8 rounded-lg px-4 py-2.5 text-xs text-white placeholder-white/20 focus:outline-none focus:border-[#38bdf8] transition-all resize-none"
                  />
                </div>

                {/* Transaction ID */}
                <div>
                  <label className="text-[10px] font-heading font-bold tracking-widest text-[#38bdf8] uppercase block mb-1.5">
                    Transaction ID <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="transactionId"
                    value={formData.transactionId}
                    onChange={handleInputChange}
                    placeholder="Enter the transaction reference number"
                    className="w-full bg-[#121212] border border-white/8 rounded-lg px-4 py-2.5 text-xs text-white placeholder-white/20 focus:outline-none focus:border-[#38bdf8] transition-all"
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-[#38bdf8] text-[#0a0a0a] font-heading font-bold text-xs tracking-widest py-3.5 rounded-lg hover:bg-[#7dd3fc] transition-all duration-300 shadow-md shadow-[#38bdf8]/10 mt-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting ? "SUBMITTING..." : "SUBMIT APPLICATION"}
                </button>
              </form>
            </Reveal>

            {/* Pay Now Section */}
            <Reveal delay={0.1} className="bg-[#1c1c1e] border border-white/5 rounded-2xl p-6 flex flex-col items-center text-center relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#38bdf8]/5 blur-[40px] -mr-16 -mt-16 rounded-full pointer-events-none" />
              
              <h3 className="font-heading font-bold text-white text-base tracking-wide mb-4 uppercase">
                Pay Now
              </h3>

              {/* Styled liquid QR code matching munsoc theme */}
              <MunsocQrCode value={PAYMENT_URI} size={240} />

              {/* Action Details */}
              <div className="w-full border-t border-white/5 pt-5 mt-5 flex flex-col gap-3">
                <div>
                  <span className="text-[9px] font-heading font-bold tracking-widest text-white/40 uppercase block">
                    Amount Due
                  </span>
                  <span className="text-white font-heading font-extrabold text-lg tracking-wide">
                    INR 100.00
                  </span>
                </div>
                <div>
                  <span className="text-[9px] font-heading font-bold tracking-widest text-[#38bdf8] uppercase block mb-1">
                    UPI Address
                  </span>
                  <span className="text-white font-mono text-xs font-semibold select-all block bg-[#121212] border border-white/5 rounded-lg py-2 px-3 tracking-wide">
                    {UPI_ID}
                  </span>
                </div>
              </div>
            </Reveal>

          </div>
        )}
      </div>

    </div>
  );
}
