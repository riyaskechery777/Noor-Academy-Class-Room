import React from 'react';
import { Link } from 'react-router-dom';
import { Users, Award, BookOpen, Heart, Target, Eye, Shield, Globe, Star, CheckCircle } from 'lucide-react';

const team = [
  {
    name: 'Sheikh Abdullah Al-Noor',
    role: 'Principal & Founder',
    image: 'https://images.pexels.com/photos/1181391/pexels-photo-1181391.jpeg?auto=compress&cs=tinysrgb&w=300',
    bio: '25 years of Islamic education experience',
  },
  {
    name: 'Dr. Fatima Hassan',
    role: 'Head of Curriculum',
    image: 'https://images.pexels.com/photos/3756679/pexels-photo-3756679.jpeg?auto=compress&cs=tinysrgb&w=300',
    bio: 'PhD in Islamic Studies, Al-Azhar University',
  },
  {
    name: 'Ustadh Yusuf Ibrahim',
    role: 'Quran Department Head',
    image: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=300',
    bio: 'Certified Quran teacher with Ijazah',
  },
  {
    name: 'Sister Maryam Siddiq',
    role: 'Student Counselor',
    image: 'https://images.pexels.com/photos/3756681/pexels-photo-3756681.jpeg?auto=compress&cs=tinysrgb&w=300',
    bio: 'Specialized in Islamic moral guidance',
  },
];

const values = [
  { icon: Shield, title: 'Integrity', desc: 'We uphold Islamic principles of honesty and transparency in all our endeavors.' },
  { icon: Heart, title: 'Compassion', desc: 'We nurture every student with care, patience, and understanding.' },
  { icon: Globe, title: 'Excellence', desc: 'We strive for the highest standards in education and character.' },
  { icon: Target, title: 'Purpose', desc: 'We help students discover their purpose in life through Islamic guidance.' },
];

const milestones = [
  { year: '2015', event: 'School founded by Sheikh Abdullah Al-Noor' },
  { year: '2017', event: 'Launched online learning platform' },
  { year: '2019', event: 'Reached 500 enrolled students' },
  { year: '2021', event: 'Expanded to 80+ courses and subjects' },
  { year: '2023', event: 'Issued 5,000+ completion certificates' },
  { year: '2024', event: 'Launched advanced AI-powered learning tools' },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 pt-20">
      {/* Hero */}
      <section className="relative gradient-hero pattern-overlay py-20 lg:py-28">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="inline-block px-4 py-1.5 bg-white/10 border border-white/20 rounded-full text-white/90 text-sm font-medium mb-6">
            About Hiraa Moral School
          </span>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
            Nurturing Minds, <span className="gold-shimmer">Elevating Souls</span>
          </h1>
          <p className="text-white/80 text-lg leading-relaxed max-w-3xl mx-auto">
            Hiraa Moral School was established with a vision to bridge the gap between modern education and Islamic values,
            creating a generation of knowledgeable, principled, and compassionate leaders.
          </p>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-8">
            <div className="card p-8 border-l-4 border-emerald-500">
              <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900/30 rounded-xl flex items-center justify-center mb-5">
                <Target className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Our Mission</h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                To provide world-class Islamic education that combines authentic religious knowledge with contemporary academic skills,
                empowering students to excel in both worlds and contribute positively to society.
              </p>
            </div>
            <div className="card p-8 border-l-4 border-gold-500">
              <div className="w-12 h-12 bg-gold-50 dark:bg-amber-900/30 rounded-xl flex items-center justify-center mb-5">
                <Eye className="w-6 h-6 text-gold-600 dark:text-amber-400" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Our Vision</h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                To be the leading Islamic educational institution globally, recognized for excellence in moral education,
                Quranic studies, and the development of principled Muslim professionals.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="section-title">Our Core Values</h2>
            <p className="section-subtitle mx-auto text-center">Guided by Islamic principles, we build character alongside knowledge.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((v, i) => (
              <div key={i} className="card p-6 text-center group hover:shadow-lg transition-all duration-300">
                <div className="w-14 h-14 bg-emerald-50 dark:bg-emerald-900/20 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-emerald-100 dark:group-hover:bg-emerald-900/40 transition-colors">
                  <v.icon className="w-7 h-7 text-emerald-600 dark:text-emerald-400" />
                </div>
                <h3 className="font-bold text-gray-900 dark:text-white text-lg mb-2">{v.title}</h3>
                <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-20 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <span className="badge-gold px-3 py-1 text-sm font-semibold mb-4 inline-block">Our Team</span>
            <h2 className="section-title">Meet the Educators</h2>
            <p className="section-subtitle mx-auto text-center">Our dedicated team of scholars and educators bring decades of experience.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {team.map((member, i) => (
              <div key={i} className="card-hover text-center p-6">
                <div className="relative w-24 h-24 mx-auto mb-4">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full rounded-2xl object-cover"
                  />
                  <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-emerald-500 rounded-full border-2 border-white dark:border-gray-800 flex items-center justify-center">
                    <CheckCircle className="w-3.5 h-3.5 text-white" />
                  </div>
                </div>
                <h3 className="font-bold text-gray-900 dark:text-white mb-1">{member.name}</h3>
                <p className="text-emerald-600 dark:text-emerald-400 text-sm font-medium mb-2">{member.role}</p>
                <p className="text-gray-500 dark:text-gray-400 text-xs">{member.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Milestones */}
      <section className="py-20 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="section-title">Our Journey</h2>
            <p className="section-subtitle mx-auto text-center">A decade of growth, learning, and impact in Islamic education.</p>
          </div>
          <div className="relative">
            <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-emerald-200 dark:bg-emerald-800"></div>
            <div className="space-y-8">
              {milestones.map((m, i) => (
                <div key={i} className="relative flex gap-6">
                  <div className="w-16 flex-shrink-0 flex flex-col items-center">
                    <div className="w-4 h-4 bg-emerald-500 rounded-full border-4 border-white dark:border-gray-900 z-10 mt-1"></div>
                  </div>
                  <div className="card p-4 flex-1">
                    <span className="text-emerald-600 dark:text-emerald-400 font-bold text-sm">{m.year}</span>
                    <p className="text-gray-700 dark:text-gray-300 text-sm mt-1">{m.event}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 gradient-hero">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">Join Our Growing Community</h2>
          <p className="text-white/80 text-lg mb-8">
            Be part of a movement that's shaping the future of Islamic education worldwide.
          </p>
          <Link to="/signup" className="btn-secondary px-8 py-3.5 text-base">
            Get Started Today
          </Link>
        </div>
      </section>
    </div>
  );
}
