import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import Enter from "./Enter";
import Nav from "./Nav";
import math from "../assets/math.mp4";
import physics from "../assets/physics.mp4";
import generate from "../assets/generate.mp4";
import canvas from "../assets/canvas.png";

import {
  MdArrowDownward,
  MdBrush,
  MdAutoAwesome,
  MdLightbulb,
  MdGesture,
  MdPalette,
  MdSmartToy,
  MdCreate,
} from "react-icons/md";
import { useNavigate } from "react-router-dom";

gsap.registerPlugin(ScrollTrigger);

const Home = () => {
  const navigate = useNavigate();
  const canvasRef = useRef(null);
  const heroRef = useRef(null);

  // Interactive canvas drawing effect
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles = [];
    const colors = ["#14b8a6", "#06b6d4", "#8b5cf6", "#ec4899", "#f59e0b"];

    class Particle {
      constructor(x, y) {
        this.x = x;
        this.y = y;
        this.size = Math.random() * 3 + 1;
        this.speedX = Math.random() * 3 - 1.5;
        this.speedY = Math.random() * 3 - 1.5;
        this.color = colors[Math.floor(Math.random() * colors.length)];
        this.life = 1;
        this.decay = Math.random() * 0.02 + 0.005;
      }

      update() {
        this.x += this.speedX;
        this.y += this.speedY;
        this.life -= this.decay;
        this.size = Math.max(0, this.size - 0.02);
      }

      draw() {
        ctx.save();
        ctx.globalAlpha = this.life;
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
    }

    const handleMouseMove = (e) => {
      for (let i = 0; i < 3; i++) {
        particles.push(new Particle(e.clientX, e.clientY));
      }
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (let i = particles.length - 1; i >= 0; i--) {
        particles[i].update();
        particles[i].draw();

        if (particles[i].life <= 0 || particles[i].size <= 0) {
          particles.splice(i, 1);
        }
      }

      requestAnimationFrame(animate);
    };

    document.addEventListener("mousemove", handleMouseMove);
    animate();

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  useGSAP(() => {
    // Hero animations
    const tl = gsap.timeline();

    tl.from(".hero-title", {
      y: 100,
      opacity: 0,
      duration: 1.2,
      ease: "power3.out",
    })
      .from(
        ".hero-subtitle",
        {
          y: 50,
          opacity: 0,
          duration: 0.8,
          ease: "power2.out",
        },
        "-=0.6"
      )
      .from(
        ".hero-buttons",
        {
          y: 30,
          opacity: 0,
          duration: 0.6,
          ease: "power2.out",
        },
        "-=0.4"
      )
      .from(
        ".floating-elements > *",
        {
          scale: 0,
          rotation: 180,
          opacity: 0,
          duration: 0.8,
          stagger: 0.1,
          ease: "back.out(1.7)",
        },
        "-=0.8"
      );

    // Feature cards animation
    gsap.from(".feature-card", {
      y: 80,
      opacity: 0,
      duration: 0.8,
      stagger: 0.15,
      ease: "power2.out",
      scrollTrigger: {
        trigger: ".features-grid",
        start: "top 80%",
      },
    });

    // Process steps animation
    gsap.from(".process-step", {
      x: -100,
      opacity: 0,
      duration: 0.8,
      stagger: 0.2,
      ease: "power2.out",
      scrollTrigger: {
        trigger: ".process-section",
        start: "top 70%",
      },
    });

    // Floating animation for decorative elements
    gsap.to(".float-slow", {
      y: -20,
      duration: 3,
      ease: "sine.inOut",
      yoyo: true,
      repeat: -1,
    });

    gsap.to(".float-fast", {
      y: -15,
      rotation: 5,
      duration: 2,
      ease: "sine.inOut",
      yoyo: true,
      repeat: -1,
    });
  }, []);

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-900 relative overflow-hidden">
      {/* Interactive Canvas Background */}
      <canvas
        ref={canvasRef}
        className="fixed inset-0 pointer-events-none z-50"
        style={{ mixBlendMode: "screen" }}
      />

      <Nav />

      {/* Hero Section */}
      <div
        ref={heroRef}
        className="relative z-10 min-h-screen h-screen flex flex-col justify-center items-center px-4 sm:px-6 lg:px-8"
      >
        {/* Floating Background Elements - Responsive positioning */}
        <div className="floating-elements absolute inset-0 overflow-hidden pointer-events-none">
          {/* Desktop floating elements */}
          <div className="hidden lg:block absolute top-20 left-20 w-2 h-16 bg-gradient-to-b from-teal-400 to-transparent rotate-12 float-slow"></div>
          <div className="hidden lg:block absolute top-32 right-32 w-16 h-2 bg-gradient-to-r from-purple-400 to-transparent -rotate-12 float-fast"></div>
          <div className="hidden md:block absolute bottom-40 left-40 w-8 h-8 border-2 border-cyan-400 rounded-full float-slow lg:left-40 md:left-20"></div>

          {/* Tablet floating elements */}
          <div className="hidden md:block lg:hidden absolute top-24 right-16 w-12 h-1.5 bg-gradient-to-r from-purple-400 to-transparent -rotate-12 float-fast"></div>
          <div className="hidden md:block lg:hidden absolute top-16 left-12 w-1.5 h-12 bg-gradient-to-b from-teal-400 to-transparent rotate-12 float-slow"></div>

          {/* Mobile floating elements */}
          <div className="block md:hidden absolute top-16 right-8 w-8 h-1 bg-gradient-to-r from-purple-400 to-transparent -rotate-12 float-fast"></div>
          <div className="block md:hidden absolute top-12 left-8 w-1 h-8 bg-gradient-to-b from-teal-400 to-transparent rotate-12 float-slow"></div>
          <div className="block sm:hidden absolute bottom-32 right-12 w-4 h-4 border border-cyan-400 rounded-full float-slow"></div>

          {/* Icon elements with responsive sizing */}
          <div className="absolute top-1/3 right-4 sm:right-8 md:right-16 lg:right-20">
            <MdPalette className="text-pink-400 text-2xl sm:text-3xl lg:text-4xl opacity-60 float-fast" />
          </div>
          <div className="absolute bottom-1/3 left-4 sm:left-8 md:left-12 lg:left-16">
            <MdBrush className="text-teal-400 text-xl sm:text-2xl lg:text-3xl opacity-50 float-slow" />
          </div>
          <div className="absolute top-1/2 right-1/4 sm:right-1/3">
            <div className="w-2 h-2 sm:w-3 sm:h-3 bg-yellow-400 rounded-full opacity-70 float-fast"></div>
          </div>
        </div>

        <div className="text-center w-full max-w-7xl mx-auto relative z-10">
          {/* Responsive Typography */}
          <h1 className="hero-title text-4xl xs:text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-black mb-4 sm:mb-6 leading-none tracking-tight">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-300 via-purple-400 to-pink-400">
              Doodle
            </span>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-blue-400 to-purple-500">
              Sense
            </span>
          </h1>

          <div className="hero-subtitle relative px-2 sm:px-4">
            <p className="text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl text-gray-200 mb-8 sm:mb-10 lg:mb-12 font-light max-w-xs sm:max-w-lg md:max-w-2xl lg:max-w-4xl mx-auto leading-relaxed">
              Transform your imagination into reality with
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-purple-400 font-semibold">
                {" "}
                AI-powered drawing magic
              </span>
            </p>
          </div>

          {/* Responsive Button */}
          <div className="hero-buttons flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-center">
            <button
              className="group relative w-full sm:w-auto px-6 sm:px-8 lg:px-10 py-3 sm:py-4 lg:py-5 bg-gradient-to-r from-teal-500 to-cyan-500 text-white rounded-xl sm:rounded-2xl shadow-2xl hover:shadow-teal-500/25 transform hover:scale-105 transition-all duration-300 font-bold text-base sm:text-lg overflow-hidden max-w-xs sm:max-w-none"
              onClick={() => navigate("/playground")}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-teal-400 to-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <span className="relative flex items-center justify-center gap-2 sm:gap-3">
                <MdCreate className="text-xl sm:text-2xl" />
                <span className="whitespace-nowrap">Start Creating</span>
              </span>
            </button>
          </div>
        </div>

        {/* Enhanced Responsive Scroll Indicator */}
        <div className="absolute bottom-6 sm:bottom-8 flex flex-col items-center">
          <div className="animate-bounce">
            <div className="w-5 h-8 sm:w-6 sm:h-10 border-2 border-teal-400 rounded-full flex justify-center">
              <div className="w-0.5 sm:w-1 h-2 sm:h-3 bg-teal-400 rounded-full mt-1.5 sm:mt-2 animate-pulse"></div>
            </div>
          </div>
          <span className="text-teal-400 text-xs sm:text-sm mt-2 sm:mt-3 font-medium tracking-wider">
            EXPLORE
          </span>
        </div>
      </div>

      <div className="w-[95%] sm:w-[90%] md:w-[85%] lg:w-[80%] xl:w-[80%] 2xl:w-[90%] h-[60vh] xs:h-[65vh] sm:h-[70vh] md:h-[75vh] lg:h-[80vh] xl:h-[95vh] bg-slate-300 mx-auto rounded-lg sm:rounded-xl flex justify-center items-center border-4 sm:border-6 lg:border-8 border-white shadow-lg sm:shadow-3xl shadow-black">
        <img
          src={canvas}
          alt="Canvas"
          className="w-[98%] h-[96%] object-cover rounded-md sm:rounded-lg lg:rounded-xl"
        />
      </div>

      {/* Features Section */}
      <div className="relative z-10 py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-5xl md:text-6xl font-black mb-6">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
                Creative Powers
              </span>
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Unleash your creativity with intelligent tools that understand
              your vision
            </p>
          </div>

          <div className="features-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="feature-card group">
              <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-md border border-white/10 rounded-3xl p-8 h-full hover:bg-gradient-to-br hover:from-teal-900/30 hover:to-cyan-900/30 transition-all duration-500 hover:border-teal-400/30 hover:shadow-2xl hover:shadow-teal-500/10">
                <div className="w-16 h-16 bg-gradient-to-br from-teal-400 to-cyan-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <MdGesture className="text-white text-3xl" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">
                  Smart Drawing
                </h3>
                <p className="text-gray-300 leading-relaxed">
                  Draw naturally and watch AI understand your sketches in
                  real-time
                </p>
              </div>
            </div>

            <div className="feature-card group">
              <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-md border border-white/10 rounded-3xl p-8 h-full hover:bg-gradient-to-br hover:from-purple-900/30 hover:to-pink-900/30 transition-all duration-500 hover:border-purple-400/30 hover:shadow-2xl hover:shadow-purple-500/10">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <MdSmartToy className="text-white text-3xl" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">
                  AI Analysis
                </h3>
                <p className="text-gray-300 leading-relaxed">
                  Get instant feedback and intelligent responses to your
                  drawings
                </p>
              </div>
            </div>

            <div className="feature-card group">
              <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-md border border-white/10 rounded-3xl p-8 h-full hover:bg-gradient-to-br hover:from-blue-900/30 hover:to-indigo-900/30 transition-all duration-500 hover:border-blue-400/30 hover:shadow-2xl hover:shadow-blue-500/10">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <MdAutoAwesome className="text-white text-3xl" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">
                  Auto Generation
                </h3>
                <p className="text-gray-300 leading-relaxed">
                  Transform text prompts into beautiful drawings automatically
                </p>
              </div>
            </div>

            <div className="feature-card group">
              <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-md border border-white/10 rounded-3xl p-8 h-full hover:bg-gradient-to-br hover:from-orange-900/30 hover:to-yellow-900/30 transition-all duration-500 hover:border-orange-400/30 hover:shadow-2xl hover:shadow-orange-500/10">
                <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-yellow-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <MdLightbulb className="text-white text-3xl" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">
                  Creative Ideas
                </h3>
                <p className="text-gray-300 leading-relaxed">
                  Discover new possibilities and expand your creative horizons
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Video Showcase Section */}
      <div className="relative z-10 py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-5xl md:text-6xl font-black mb-6">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-purple-400">
                See It In Action
              </span>
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Watch how DoodleSense transforms your ideas into reality
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="group">
              <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-md border border-white/10 rounded-3xl p-6 hover:border-teal-400/30 hover:shadow-2xl hover:shadow-teal-500/10 transition-all duration-500">
                <h3 className="text-2xl font-bold text-white mb-4 text-center">
                  Math Problem Solving
                </h3>
                <div className="relative rounded-2xl overflow-hidden aspect-video">
                  <video
                    src={math}
                    className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                    muted
                    playsInline
                    autoPlay
                    loop
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
                <p className="text-gray-300 mt-4 text-center">
                  Draw math problems and get instant solutions
                </p>
              </div>
            </div>

            <div className="group">
              <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-md border border-white/10 rounded-3xl p-6 hover:border-purple-400/30 hover:shadow-2xl hover:shadow-purple-500/10 transition-all duration-500">
                <h3 className="text-2xl font-bold text-white mb-4 text-center">
                  Physics Visualization
                </h3>
                <div className="relative rounded-2xl overflow-hidden aspect-video">
                  <video
                    src={physics}
                    className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                    muted
                    playsInline
                    autoPlay
                    loop
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
                <p className="text-gray-300 mt-4 text-center">
                  Visualize and understand complex physics concepts
                </p>
              </div>
            </div>

            <div className="group">
              <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-md border border-white/10 rounded-3xl p-6 hover:border-blue-400/30 hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-500">
                <h3 className="text-2xl font-bold text-white mb-4 text-center">
                  AI Generation
                </h3>
                <div className="relative rounded-2xl overflow-hidden aspect-video">
                  <video
                    src={generate}
                    className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                    muted
                    playsInline
                    autoPlay
                    loop
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
                <p className="text-gray-300 mt-4 text-center">
                  Generate amazing drawings with AI assistance
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="hero-buttons flex flex-col sm:flex-row gap-6 justify-center items-center">
        <button
          className="group relative px-10 py-5 bg-gradient-to-r from-teal-500 to-cyan-500 text-white rounded-2xl shadow-2xl hover:shadow-teal-500/25 transform hover:scale-105 transition-all duration-300 font-bold text-lg overflow-hidden"
          onClick={() => navigate("/playground")}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-teal-400 to-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <span className="relative flex items-center gap-3">
            <MdCreate className="text-2xl" />
            Start Creating
          </span>
        </button>
      </div>

      {/* Enhanced Footer */}
      <footer className="relative z-10 w-full bg-black text-white py-8 sm:py-12 lg:py-16 mt-8 sm:mt-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {/* Brand Section */}
            <div className="text-center sm:text-left lg:col-span-1">
              <h3 className="text-2xl sm:text-3xl lg:text-4xl font-black mb-3 sm:mb-4">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-purple-400">
                  DoodleSense
                </span>
              </h3>
              <p className="text-gray-300 text-sm sm:text-base lg:text-lg leading-relaxed">
                Where creativity meets AI. Transform ideas into reality.
              </p>
            </div>

            {/* Quick Links */}
            <div className="text-center sm:text-left">
              <h4 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4 text-purple-300">
                Features
              </h4>
              <ul className="space-y-2 sm:space-y-3">
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-teal-400 transition-colors duration-300 text-sm sm:text-base"
                  >
                    Smart Canvas
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-teal-400 transition-colors duration-300 text-sm sm:text-base"
                  >
                    AI Analysis
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-teal-400 transition-colors duration-300 text-sm sm:text-base"
                  >
                    Creative Tools
                  </a>
                </li>
              </ul>
            </div>

            {/* Contact/Info */}
            <div className="text-center sm:text-left sm:col-span-2 lg:col-span-1">
              <h4 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4 text-purple-300">
                Connect
              </h4>
              <p className="text-gray-300 mb-3 sm:mb-4 text-sm sm:text-base">
                Join the creative revolution.
              </p>
              <div className="flex items-center justify-center sm:justify-start gap-2">
                <span className="text-gray-400 text-sm sm:text-base">
                  Made with
                </span>
                <span className="text-red-500 text-lg sm:text-xl">❤</span>
                <span className="text-gray-400 text-sm sm:text-base">
                  for creators
                </span>
              </div>
            </div>
          </div>

          {/* Copyright */}
          <div className="border-t border-gray-700 mt-8 sm:mt-10 lg:mt-12 pt-6 sm:pt-8 text-center">
            <p className="text-gray-400 text-xs sm:text-sm lg:text-base">
              © 2024 DoodleSense. Empowering creativity through AI.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
