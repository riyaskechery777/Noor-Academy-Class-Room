import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  GraduationCap, BookOpen, Users, Video, Award, ChevronRight,
  Star, ArrowRight, CheckCircle, Clock, Shield, Zap,
  MessageCircle, BarChart2, BookMarked, Play, TrendingUp, Globe
} from 'lucide-react';

const stats = [
  { label: 'Active Students', value: '2,500+', icon: Users, color: '#059669' },
  { label: 'Expert Teachers', value: '80+', icon: GraduationCap, color: '#f59e0b' },
  { label: 'Courses Available', value: '120+', icon: BookOpen, color: '#3b82f6' },
  { label: 'Certificates Issued', value: '5,000+', icon: Award, color: '#ef4444' },
];

const features = [
  {
    icon: Video,
    title: 'Live & Recorded Classes',
    description: 'Join interactive live sessions or watch recorded lessons at your own pace, anytime anywhere.',
    accent: '#059669',
    bg: 'rgba(5,150,105,0.08)',
  },
  {
    icon: BookMarked,
    title: 'Study Notes & Materials',
    description: 'Access downloadable notes, PDFs, and resources for all subjects curated by scholars.',
    accent: '#3b82f6',
    bg: 'rgba(59,130,246,0.08)',
  },
  {
    icon: BarChart2,
    title: 'Progress Tracking',
    description: 'Monitor your learning journey with detailed analytics and personalised reports.',
    accent: '#f59e0b',
    bg: 'rgba(245,158,11,0.08)',
  },
  {
    icon: MessageCircle,
    title: 'Direct Communication',
    description: 'Chat with teachers and classmates in real-time for better understanding and support.',
    accent: '#ec4899',
    bg: 'rgba(236,72,153,0.08)',
  },
  {
    icon: Shield,
    title: 'Safe Learning Environment',
    description: 'A secure, moderated platform following Islamic ethical guidelines at every level.',
    accent: '#14b8a6',
    bg: 'rgba(20,184,166,0.08)',
  },
  {
    icon: Award,
    title: 'Certificates & Recognition',
    description: 'Earn verified certificates upon course completion and share your achievements.',
    accent: '#8b5cf6',
    bg: 'rgba(139,92,246,0.08)',
  },
];

const courses = [
  {
    title: 'Quran & Tajweed',
    level: 'All Levels',
    students: 450,
    rating: 4.9,
    duration: '40 hrs',
    image: 'https://images.pexels.com/photos/1340185/pexels-photo-1340185.jpeg?auto=compress&cs=tinysrgb&w=500',
    category: 'Quran',
    isFree: false,
    price: 49,
    instructor: 'Sheikh Abdullah',
  },
  {
    title: 'Islamic Studies',
    level: 'Beginner',
    students: 380,
    rating: 4.8,
    duration: '30 hrs',
    image: 'https://images.pexels.com/photos/3771074/pexels-photo-3771074.jpeg?auto=compress&cs=tinysrgb&w=500',
    category: 'Islamic Studies',
    isFree: true,
    price: 0,
    instructor: 'Dr. Fatima Hassan',
  },
  {
    title: 'Arabic Language',
    level: 'Intermediate',
    students: 290,
    rating: 4.7,
    duration: '50 hrs',
    image: 'https://images.pexels.com/photos/3184611/pexels-photo-3184611.jpeg?auto=compress&cs=tinysrgb&w=500',
    category: 'Language',
    isFree: false,
    price: 39,
    instructor: 'Ustadh Yusuf',
  },
];

const testimonials = [
  {
    name: 'Aisha Rahman',
    role: 'Student',
    avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=100',
    text: 'Hiraa has completely transformed my Islamic education journey. The teachers are incredibly knowledgeable and the platform is beautifully designed.',
    rating: 5,
    course: 'Quran & Tajweed',
  },
  {
    name: 'Omar Abdullah',
    role: 'Parent',
    avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=100',
    text: 'My children love learning here. The combination of modern technology with authentic Islamic values is exactly what we were looking for.',
    rating: 5,
    course: 'Islamic Studies',
  },
  {
    name: 'Fatima Al-Sayed',
    role: 'Teacher',
    avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=100',
    text: 'As an educator, the platform gives me all the tools I need to deliver world-class Islamic education effectively and meaningfully.',
    rating: 5,
    course: 'Arabic Language',
  },
];

function CountUp({ end, duration = 1500 }: { end: string; duration?: number }) {
  const [display, setDisplay] = useState('0');
  const ref = useRef(false);

  useEffect(() => {
    if (ref.current) return;
    ref.current = true;
    const num = parseInt(end.replace(/\D/g, ''));
    const suffix = end.replace(/[\d,]/g, '');
    const start = Date.now();
    const tick = () => {
      const elapsed = Date.now() - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.round(eased * num).toLocaleString() + suffix);
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [end, duration]);

  return <>{display}</>;
}

export default function HomePage() {
  const [statsVisible, setStatsVisible] = useState(false);
  const statsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setStatsVisible(true); },
      { threshold: 0.3 }
    );
    if (statsRef.current) observer.observe(statsRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 overflow-x-hidden">
      {/* ─── HERO ─────────────────────────────────────────────── */}
      <section className="relative gradient-hero pattern-overlay overflow-hidden pt-24 pb-20 lg:pt-32 lg:pb-36">
        {/* Ambient blobs */}
        <div className="absolute top-0 left-0 right-0 bottom-0 overflow-hidden pointer-events-none">
          <div
            className="absolute top-1/4 right-1/6 w-[500px] h-[500px] rounded-full blur-3xl opacity-15"
            style={{ background: 'radial-gradient(circle, #34d399, transparent)' }}
          />
          <div
            className="absolute bottom-1/4 left-1/6 w-[400px] h-[400px] rounded-full blur-3xl opacity-10"
            style={{ background: 'radial-gradient(circle, #fbbf24, transparent)' }}
          />
          <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full blur-3xl opacity-5"
            style={{ background: 'radial-gradient(circle, #10b981, transparent)' }}
          />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-14 items-center">
            {/* Left: Text content */}
            <div className="animate-fade-in">
              {/* Announcement pill */}
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium mb-8"
                style={{
                  background: 'rgba(255,255,255,0.1)',
                  border: '1px solid rgba(255,255,255,0.2)',
                  backdropFilter: 'blur(8px)',
                }}>
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
                </span>
                <span className="text-white/90">Enrolment Open for 2024–25</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-[1.1] tracking-tight mb-6">
                Discover{' '}
                <span className="gold-shimmer">Islamic</span>
                <br />
                Excellence in
                <br />
                Education
              </h1>

              <p className="text-lg text-white/75 leading-relaxed mb-10 max-w-lg">
                Join Hiraa Moral School — where modern learning technology meets authentic Islamic values and timeless moral teachings.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 mb-12">
                <Link to="/signup" className="btn-secondary text-base px-8 py-3.5 group">
                  Start Learning Free
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  to="/courses"
                  className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl text-base font-semibold text-white transition-all duration-200 hover:-translate-y-0.5"
                  style={{
                    background: 'rgba(255,255,255,0.1)',
                    border: '1.5px solid rgba(255,255,255,0.25)',
                    backdropFilter: 'blur(8px)',
                  }}
                >
                  <Play className="w-4 h-4 fill-white" />
                  Explore Courses
                </Link>
              </div>

              {/* Social proof */}
              <div className="flex items-center gap-5">
                <div className="flex -space-x-2.5">
                  {[
                    'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=60',
                    'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=60',
                    'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=60',
                    'https://images.pexels.com/photos/1181391/pexels-photo-1181391.jpeg?auto=compress&cs=tinysrgb&w=60',
                  ].map((src, i) => (
                    <img
                      key={i}
                      src={src}
                      alt=""
                      className="w-9 h-9 rounded-full object-cover ring-2 ring-emerald-800"
                    />
                  ))}
                </div>
                <div>
                  <div className="flex items-center gap-1 mb-0.5">
                    {[1,2,3,4,5].map(s => <Star key={s} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />)}
                    <span className="text-white/80 text-sm font-medium ml-1">4.9</span>
                  </div>
                  <p className="text-white/60 text-xs">Trusted by 2,500+ students worldwide</p>
                </div>
              </div>
            </div>

            {/* Right: Visual card stack */}
            <div className="relative hidden lg:block animate-slide-up">
              {/* Main image */}
              <div className="relative rounded-3xl overflow-hidden shadow-float">
                <img
                  src="https://images.pexels.com/photos/4145153/pexels-photo-4145153.jpeg?auto=compress&cs=tinysrgb&w=700"
                  alt="Students learning at Hiraa School"
                  className="w-full h-[520px] object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-emerald-950/70 via-transparent to-transparent" />

                {/* Bottom overlay text */}
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <div className="glass rounded-2xl p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-white font-semibold text-sm">Currently Learning</p>
                        <p className="text-white/70 text-xs mt-0.5">Quran & Tajweed — Session 12</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-red-400 animate-pulse" />
                        <span className="text-red-300 text-xs font-bold">LIVE</span>
                      </div>
                    </div>
                    <div className="mt-3 w-full bg-white/20 rounded-full h-1.5">
                      <div className="bg-emerald-400 h-1.5 rounded-full w-3/5" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating card: courses */}
              <div
                className="absolute -left-10 top-16 animate-float glass rounded-2xl px-4 py-3 shadow-float"
                style={{ animationDelay: '0s', minWidth: '160px' }}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center shadow-md">
                    <BookOpen className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-white font-bold text-lg leading-none">120+</p>
                    <p className="text-white/65 text-xs mt-0.5">Live Courses</p>
                  </div>
                </div>
              </div>

              {/* Floating card: certificates */}
              <div
                className="absolute -right-8 bottom-24 animate-float glass rounded-2xl px-4 py-3 shadow-float"
                style={{ animationDelay: '2s', minWidth: '160px' }}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-amber-500 rounded-xl flex items-center justify-center shadow-md">
                    <Award className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-white font-bold text-lg leading-none">5,000+</p>
                    <p className="text-white/65 text-xs mt-0.5">Certificates</p>
                  </div>
                </div>
              </div>

              {/* Floating card: rating */}
              <div
                className="absolute right-4 top-10 animate-float glass-sm rounded-xl px-3 py-2 shadow-md"
                style={{ animationDelay: '1s' }}
              >
                <div className="flex items-center gap-2">
                  <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                  <span className="text-white font-bold text-sm">4.9/5</span>
                  <span className="text-white/60 text-xs">Rating</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom wave */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 60" className="w-full text-white dark:text-gray-950 fill-current" preserveAspectRatio="none">
            <path d="M0,60 L0,30 C360,60 720,0 1080,30 C1260,45 1380,35 1440,30 L1440,60 Z" />
          </svg>
        </div>
      </section>

      {/* ─── STATS ────────────────────────────────────────────── */}
      <section ref={statsRef} className="py-16 bg-white dark:bg-gray-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, i) => (
              <div
                key={i}
                className="text-center group"
                style={{ animationDelay: `${i * 100}ms` }}
              >
                <div
                  className="inline-flex items-center justify-center w-14 h-14 rounded-2xl mb-4 transition-all duration-300 group-hover:scale-110"
                  style={{ background: `${stat.color}15` }}
                >
                  <stat.icon className="w-7 h-7" style={{ color: stat.color }} />
                </div>
                <p className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-1">
                  {statsVisible ? <CountUp end={stat.value} /> : '0'}
                </p>
                <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── FEATURES ─────────────────────────────────────────── */}
      <section className="py-20 lg:py-28"
        style={{
          background: 'linear-gradient(180deg, #f0fdf4 0%, #ffffff 100%)',
        }}>
        <div className="dark:hidden absolute inset-0 pointer-events-none"
          style={{
            background: 'linear-gradient(180deg, #f0fdf4 0%, #ffffff 100%)',
          }} />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative"
          style={{ background: 'inherit' }}>
          <div className="text-center mb-16">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300 mb-4">
              <Zap className="w-3 h-3" />
              Why Choose Hiraa
            </span>
            <h2 className="section-title">Everything You Need to Excel</h2>
            <p className="section-subtitle mx-auto text-center">
              Our platform provides a comprehensive suite of Islamic learning tools, built for the modern student.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f, i) => (
              <div
                key={i}
                className="group relative card p-7 hover:shadow-[0_20px_40px_-12px_rgba(0,0,0,0.1)] hover:-translate-y-1.5 dark:hover:shadow-[0_20px_40px_-12px_rgba(0,0,0,0.4)] transition-all duration-300 overflow-hidden"
              >
                <div
                  className="absolute top-0 right-0 w-32 h-32 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                  style={{ background: f.accent, transform: 'translate(40%, -40%)' }}
                />
                <div
                  className="w-12 h-12 rounded-2xl flex items-center justify-center mb-5 transition-all duration-300 group-hover:scale-110"
                  style={{ background: f.bg, color: f.accent }}
                >
                  <f.icon className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-gray-900 dark:text-white text-lg mb-2.5">{f.title}</h3>
                <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">{f.description}</p>
                <div className="mt-5 flex items-center gap-1.5 text-sm font-semibold transition-colors duration-200"
                  style={{ color: f.accent }}>
                  Learn more <ChevronRight className="w-4 h-4" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── COURSES ──────────────────────────────────────────── */}
      <section className="py-20 lg:py-28 bg-white dark:bg-gray-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-12">
            <div>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300 mb-4">
                <TrendingUp className="w-3 h-3" />
                Featured Courses
              </span>
              <h2 className="section-title">Start Your Learning Journey</h2>
              <p className="text-gray-500 dark:text-gray-400 mt-2 text-base">
                Handpicked courses taught by certified scholars and educators.
              </p>
            </div>
            <Link
              to="/courses"
              className="hidden sm:inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-emerald-600 dark:text-emerald-400 border-2 border-emerald-200 dark:border-emerald-800 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 hover:border-emerald-400 dark:hover:border-emerald-600 transition-all duration-200"
            >
              Browse All <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-7">
            {courses.map((course, i) => (
              <div key={i} className="group relative card overflow-hidden hover:shadow-[0_24px_48px_-12px_rgba(0,0,0,0.14)] hover:-translate-y-2 dark:hover:shadow-[0_24px_48px_-12px_rgba(0,0,0,0.45)] transition-all duration-400">
                {/* Image */}
                <div className="relative h-52 overflow-hidden">
                  <img
                    src={course.image}
                    alt={course.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
                  <div className="absolute top-3 left-3">
                    <span className={`px-2.5 py-1 rounded-lg text-xs font-bold ${
                      course.isFree
                        ? 'bg-emerald-500 text-white'
                        : 'bg-white text-gray-900'
                    }`}>
                      {course.isFree ? 'Free' : `$${course.price}`}
                    </span>
                  </div>
                  <div className="absolute top-3 right-3">
                    <span className="px-2.5 py-1 rounded-lg text-xs font-medium bg-black/40 text-white backdrop-blur-sm">
                      {course.category}
                    </span>
                  </div>
                  {/* Play button overlay */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="w-12 h-12 bg-white/90 rounded-full flex items-center justify-center shadow-xl">
                      <Play className="w-5 h-5 text-emerald-700 fill-emerald-700 ml-0.5" />
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="p-5">
                  <div className="flex items-center gap-1 mb-2">
                    {[1,2,3,4,5].map(s => (
                      <Star key={s} className="w-3 h-3 fill-amber-400 text-amber-400" />
                    ))}
                    <span className="text-gray-600 dark:text-gray-400 text-xs ml-1 font-medium">{course.rating}</span>
                  </div>
                  <h3 className="font-bold text-gray-900 dark:text-white text-lg mb-1 leading-tight">{course.title}</h3>
                  <p className="text-gray-500 dark:text-gray-400 text-xs mb-4">by {course.instructor}</p>
                  <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400 mb-5">
                    <span className="flex items-center gap-1.5">
                      <Users className="w-3.5 h-3.5" />
                      {course.students.toLocaleString()} students
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5" />
                      {course.duration}
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 font-medium">
                      {course.level}
                    </span>
                  </div>
                  <Link
                    to="/signup"
                    className="btn-primary w-full text-sm py-2.5"
                  >
                    Enrol Now
                  </Link>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-8 sm:hidden">
            <Link to="/courses" className="btn-outline">Browse All Courses</Link>
          </div>
        </div>
      </section>

      {/* ─── HOW IT WORKS ─────────────────────────────────────── */}
      <section className="py-20 lg:py-28"
        style={{ background: 'linear-gradient(180deg, #f8fafc 0%, #f0fdf4 100%)' }}>
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300 mb-4">
              <CheckCircle className="w-3 h-3" />
              Simple Process
            </span>
            <h2 className="section-title">Begin in 3 Easy Steps</h2>
            <p className="section-subtitle mx-auto text-center">
              Getting started at Hiraa Moral School takes just minutes.
            </p>
          </div>

          <div className="grid sm:grid-cols-3 gap-6 relative">
            {/* Connector line */}
            <div className="hidden sm:block absolute top-10 left-1/6 right-1/6 h-px bg-gradient-to-r from-transparent via-emerald-300 to-transparent dark:via-emerald-700 z-0" />

            {[
              {
                step: '01',
                title: 'Create Your Account',
                desc: 'Sign up in seconds as a student or teacher. No credit card required to get started.',
                icon: Users,
                color: '#059669',
              },
              {
                step: '02',
                title: 'Choose Your Courses',
                desc: 'Browse 120+ courses and pick what aligns with your Islamic learning goals.',
                icon: BookOpen,
                color: '#f59e0b',
              },
              {
                step: '03',
                title: 'Start Learning',
                desc: 'Join live classes, complete assignments, and earn your certificates.',
                icon: Award,
                color: '#3b82f6',
              },
            ].map((step, i) => (
              <div key={i} className="relative text-center group z-10">
                <div className="relative inline-flex items-center justify-center mb-6">
                  <div
                    className="w-20 h-20 rounded-2xl flex items-center justify-center shadow-lg transition-all duration-300 group-hover:scale-110 group-hover:shadow-xl"
                    style={{ background: `${step.color}15`, border: `2px solid ${step.color}30` }}
                  >
                    <step.icon className="w-9 h-9" style={{ color: step.color }} />
                  </div>
                  <span
                    className="absolute -top-2 -right-2 w-7 h-7 rounded-full flex items-center justify-center text-xs font-black text-white shadow-md"
                    style={{ background: step.color }}
                  >
                    {i + 1}
                  </span>
                </div>
                <h3 className="font-bold text-gray-900 dark:text-white text-lg mb-2">{step.title}</h3>
                <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link to="/signup" className="btn-primary px-10 py-3.5 text-base">
              Get Started Free
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ─── TESTIMONIALS ─────────────────────────────────────── */}
      <section className="py-20 lg:py-28 bg-white dark:bg-gray-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300 mb-4">
              <Globe className="w-3 h-3" />
              Student Stories
            </span>
            <h2 className="section-title">Loved by Our Community</h2>
            <p className="section-subtitle mx-auto text-center">
              Thousands of students and educators trust Hiraa for their Islamic education.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <div key={i} className="card p-6 group hover:shadow-[0_20px_40px_-12px_rgba(0,0,0,0.10)] hover:-translate-y-1 dark:hover:shadow-[0_20px_40px_-12px_rgba(0,0,0,0.35)] transition-all duration-300">
                {/* Stars */}
                <div className="flex items-center gap-1 mb-4">
                  {[1,2,3,4,5].map(s => (
                    <Star key={s} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>

                {/* Quote */}
                <div className="relative mb-5">
                  <span className="absolute -top-2 -left-1 text-5xl leading-none text-emerald-100 dark:text-emerald-900 font-serif select-none">
                    "
                  </span>
                  <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed pl-4 pt-3 italic">
                    {t.text}
                  </p>
                </div>

                {/* Course chip */}
                <span className="inline-block px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300 text-xs font-medium mb-4">
                  {t.course}
                </span>

                {/* Author */}
                <div className="flex items-center gap-3">
                  <img
                    src={t.avatar}
                    alt={t.name}
                    className="w-11 h-11 rounded-full object-cover ring-2 ring-emerald-100 dark:ring-emerald-900"
                  />
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white text-sm">{t.name}</p>
                    <p className="text-gray-500 dark:text-gray-400 text-xs">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA ──────────────────────────────────────────────── */}
      <section className="relative gradient-hero pattern-overlay py-24 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full blur-3xl opacity-10"
            style={{ background: 'radial-gradient(circle, #34d399, transparent)' }} />
        </div>

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="font-arabic text-4xl text-amber-300/90 mb-5 leading-relaxed">
            بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-5 leading-tight">
            Begin Your Islamic Education
            <br />
            <span className="gold-shimmer">Journey Today</span>
          </h2>
          <p className="text-white/70 text-lg mb-10 max-w-2xl mx-auto leading-relaxed">
            Join thousands of students growing in knowledge, faith, and character at Hiraa Moral School.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/signup" className="btn-secondary px-10 py-4 text-base">
              Register Free — Start Today
            </Link>
            <Link
              to="/about"
              className="inline-flex items-center justify-center gap-2 px-10 py-4 rounded-xl text-base font-semibold text-white transition-all duration-200 hover:-translate-y-0.5"
              style={{
                background: 'rgba(255,255,255,0.1)',
                border: '1.5px solid rgba(255,255,255,0.25)',
                backdropFilter: 'blur(8px)',
              }}
            >
              Learn More About Us
            </Link>
          </div>

          <div className="mt-12 flex flex-wrap items-center justify-center gap-6">
            {[
              { icon: CheckCircle, text: 'No credit card required' },
              { icon: Shield, text: 'Safe & secure platform' },
              { icon: Globe, text: 'Available worldwide' },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-2 text-white/70 text-sm">
                <item.icon className="w-4 h-4 text-emerald-400" />
                {item.text}
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
