import React from 'react';
import { Link } from 'react-router-dom';
import {
  GraduationCap, BookOpen, Users, Video, Award, ChevronRight,
  Star, ArrowRight, CheckCircle, Globe, Clock, Shield, Zap,
  MessageCircle, BarChart2, BookMarked, Mic
} from 'lucide-react';

const stats = [
  { label: 'Active Students', value: '2,500+', icon: Users },
  { label: 'Expert Teachers', value: '80+', icon: GraduationCap },
  { label: 'Courses Available', value: '120+', icon: BookOpen },
  { label: 'Certificates Issued', value: '5,000+', icon: Award },
];

const features = [
  {
    icon: Video,
    title: 'Live & Recorded Classes',
    description: 'Join interactive live sessions or watch recorded lessons at your own pace.',
    color: 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400',
  },
  {
    icon: BookMarked,
    title: 'Study Notes & Materials',
    description: 'Access downloadable notes, PDFs, and resources for all subjects.',
    color: 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400',
  },
  {
    icon: BarChart2,
    title: 'Progress Tracking',
    description: 'Monitor your learning journey with detailed analytics and reports.',
    color: 'bg-gold-50 dark:bg-amber-900/20 text-gold-600 dark:text-amber-400',
  },
  {
    icon: MessageCircle,
    title: 'Direct Communication',
    description: 'Chat with teachers and classmates in real-time for better understanding.',
    color: 'bg-rose-50 dark:bg-rose-900/20 text-rose-600 dark:text-rose-400',
  },
  {
    icon: Shield,
    title: 'Safe Learning Environment',
    description: 'A secure, moderated platform following Islamic ethical guidelines.',
    color: 'bg-teal-50 dark:bg-teal-900/20 text-teal-600 dark:text-teal-400',
  },
  {
    icon: Award,
    title: 'Certificates & Recognition',
    description: 'Earn verified certificates upon course completion and achievement.',
    color: 'bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400',
  },
];

const courses = [
  {
    title: 'Quran & Tajweed',
    level: 'All Levels',
    students: 450,
    rating: 4.9,
    duration: '40 hrs',
    image: 'https://images.pexels.com/photos/1340185/pexels-photo-1340185.jpeg?auto=compress&cs=tinysrgb&w=400',
    category: 'Religious',
    isFree: false,
    price: 49,
  },
  {
    title: 'Islamic Studies',
    level: 'Beginner',
    students: 380,
    rating: 4.8,
    duration: '30 hrs',
    image: 'https://images.pexels.com/photos/3771074/pexels-photo-3771074.jpeg?auto=compress&cs=tinysrgb&w=400',
    category: 'Religious',
    isFree: true,
    price: 0,
  },
  {
    title: 'Arabic Language',
    level: 'Intermediate',
    students: 290,
    rating: 4.7,
    duration: '50 hrs',
    image: 'https://images.pexels.com/photos/3184611/pexels-photo-3184611.jpeg?auto=compress&cs=tinysrgb&w=400',
    category: 'Language',
    isFree: false,
    price: 39,
  },
];

const testimonials = [
  {
    name: 'Aisha Rahman',
    role: 'Student',
    avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=100',
    text: 'Hiraa has completely transformed my Islamic education journey. The teachers are knowledgeable and the platform is very user-friendly.',
    rating: 5,
  },
  {
    name: 'Omar Abdullah',
    role: 'Parent',
    avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=100',
    text: 'My children love learning here. The combination of modern technology with Islamic values is exactly what we needed.',
    rating: 5,
  },
  {
    name: 'Fatima Al-Sayed',
    role: 'Teacher',
    avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=100',
    text: 'As a teacher, the platform gives me all the tools I need to deliver quality Islamic education effectively.',
    rating: 5,
  },
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      {/* Hero Section */}
      <section className="relative gradient-hero pattern-overlay overflow-hidden pt-24 pb-20 lg:pt-32 lg:pb-32">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-emerald-400/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-1/4 left-1/4 w-64 h-64 bg-gold-500/10 rounded-full blur-3xl"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="text-center lg:text-left animate-fade-in">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 border border-white/20 rounded-full text-white/90 text-sm font-medium mb-6 backdrop-blur-sm">
                <span className="w-2 h-2 bg-gold-400 rounded-full animate-pulse"></span>
                Enrolment Open for 2024-25
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
                Discover <span className="gold-shimmer">Islamic</span><br />
                Excellence in Education
              </h1>

              <p className="text-lg text-white/80 leading-relaxed mb-8 max-w-xl">
                Join Hiraa Moral School for a transformative learning experience that combines modern education technology with Islamic values and moral teachings.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Link to="/signup" className="btn-secondary text-base px-8 py-3.5 group">
                  Start Learning
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link to="/courses" className="btn-outline border-white/40 text-white hover:bg-white hover:text-emerald-700 text-base px-8 py-3.5">
                  Explore Courses
                </Link>
              </div>

              <div className="flex items-center gap-6 mt-10 justify-center lg:justify-start">
                <div className="flex -space-x-2">
                  {['https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=60',
                    'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=60',
                    'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=60',
                  ].map((src, i) => (
                    <img key={i} src={src} alt="" className="w-9 h-9 rounded-full border-2 border-emerald-700 object-cover" />
                  ))}
                </div>
                <div>
                  <div className="flex items-center gap-1">
                    {[1,2,3,4,5].map(s => <Star key={s} className="w-3.5 h-3.5 fill-gold-400 text-gold-400" />)}
                  </div>
                  <p className="text-white/70 text-xs mt-0.5">2,500+ happy students</p>
                </div>
              </div>
            </div>

            {/* Hero Image */}
            <div className="relative hidden lg:block animate-slide-up">
              <div className="relative">
                <img
                  src="https://images.pexels.com/photos/4145153/pexels-photo-4145153.jpeg?auto=compress&cs=tinysrgb&w=600"
                  alt="Students learning"
                  className="w-full rounded-2xl shadow-2xl object-cover h-[500px]"
                />
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-t from-emerald-900/60 to-transparent"></div>

                {/* Floating Cards */}
                <div className="absolute -left-8 top-1/4 glass rounded-2xl p-4 animate-float shadow-xl">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center">
                      <BookOpen className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="text-white font-bold text-lg leading-none">120+</p>
                      <p className="text-white/70 text-xs">Live Courses</p>
                    </div>
                  </div>
                </div>

                <div className="absolute -right-8 bottom-1/4 glass rounded-2xl p-4 animate-float shadow-xl" style={{ animationDelay: '1.5s' }}>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gold-500 rounded-xl flex items-center justify-center">
                      <Award className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="text-white font-bold text-lg leading-none">5K+</p>
                      <p className="text-white/70 text-xs">Certificates</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-emerald-700 dark:bg-emerald-800 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, i) => (
              <div key={i} className="text-center">
                <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <stat.icon className="w-6 h-6 text-gold-300" />
                </div>
                <p className="text-3xl font-bold text-white">{stat.value}</p>
                <p className="text-emerald-200 text-sm mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 lg:py-28 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <span className="badge-green px-3 py-1 text-sm font-semibold mb-4 inline-block">Why Choose Us</span>
            <h2 className="section-title">Everything You Need to Learn</h2>
            <p className="section-subtitle mx-auto text-center">
              Our platform offers a comprehensive suite of tools designed for modern Islamic education.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f, i) => (
              <div key={i} className="card p-6 hover:shadow-lg transition-all duration-300 group">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${f.color}`}>
                  <f.icon className="w-6 h-6" />
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-white text-lg mb-2">{f.title}</h3>
                <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">{f.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Courses Preview */}
      <section className="py-20 lg:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-12">
            <div>
              <span className="badge-gold px-3 py-1 text-sm font-semibold mb-4 inline-block">Featured Courses</span>
              <h2 className="section-title">Start Your Learning Journey</h2>
            </div>
            <Link to="/courses" className="btn-outline hidden sm:flex items-center gap-2">
              View All <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {courses.map((course, i) => (
              <div key={i} className="card-hover overflow-hidden group">
                <div className="relative overflow-hidden h-48">
                  <img
                    src={course.image}
                    alt={course.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                  <span className={`absolute top-3 left-3 badge ${course.isFree ? 'bg-emerald-500 text-white' : 'bg-gold-500 text-white'} text-xs font-semibold px-2.5 py-1`}>
                    {course.isFree ? 'Free' : `$${course.price}`}
                  </span>
                  <span className="absolute top-3 right-3 badge bg-black/40 text-white backdrop-blur-sm">
                    {course.category}
                  </span>
                </div>
                <div className="p-5">
                  <h3 className="font-semibold text-gray-900 dark:text-white text-lg mb-2">{course.title}</h3>
                  <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400 mb-4">
                    <span className="flex items-center gap-1"><Users className="w-3.5 h-3.5" />{course.students}</span>
                    <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" />{course.duration}</span>
                    <span className="flex items-center gap-1"><Star className="w-3.5 h-3.5 fill-gold-400 text-gold-400" />{course.rating}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="badge-gray text-xs">{course.level}</span>
                    <Link to="/courses" className="text-emerald-600 dark:text-emerald-400 text-sm font-medium hover:text-emerald-700 flex items-center gap-1">
                      Learn more <ChevronRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center sm:hidden">
            <Link to="/courses" className="btn-outline">View All Courses</Link>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 lg:py-28 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <span className="badge-green px-3 py-1 text-sm font-semibold mb-4 inline-block">Testimonials</span>
            <h2 className="section-title">What Our Community Says</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <div key={i} className="card p-6">
                <div className="flex items-center gap-1 mb-4">
                  {[1,2,3,4,5].map(s => (
                    <Star key={s} className={`w-4 h-4 ${s <= t.rating ? 'fill-gold-400 text-gold-400' : 'text-gray-300'}`} />
                  ))}
                </div>
                <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed mb-5 italic">"{t.text}"</p>
                <div className="flex items-center gap-3">
                  <img src={t.avatar} alt={t.name} className="w-10 h-10 rounded-full object-cover" />
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

      {/* CTA */}
      <section className="relative gradient-hero pattern-overlay py-20 overflow-hidden">
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-block font-arabic text-3xl text-gold-300 mb-4">بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ</div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6">
            Begin Your Islamic Education Journey Today
          </h2>
          <p className="text-white/80 text-lg mb-8 max-w-2xl mx-auto">
            Join thousands of students who are growing in knowledge, faith, and character at Hiraa Moral School.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/signup" className="btn-secondary px-8 py-3.5 text-base">
              Register Now — It's Free
            </Link>
            <Link to="/about" className="btn-outline border-white/40 text-white hover:bg-white hover:text-emerald-700 px-8 py-3.5 text-base">
              Learn More About Us
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
