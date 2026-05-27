import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Filter, Star, Users, Clock, BookOpen, ChevronRight, SlidersHorizontal } from 'lucide-react';

const allCourses = [
  { id: 1, title: 'Quran & Tajweed Foundations', category: 'Quran', level: 'beginner', students: 450, rating: 4.9, duration: '40 hrs', image: 'https://images.pexels.com/photos/1340185/pexels-photo-1340185.jpeg?auto=compress&cs=tinysrgb&w=400', isFree: false, price: 49, description: 'Master the art of Quran recitation with proper Tajweed rules.' },
  { id: 2, title: 'Islamic Studies: Fundamentals', category: 'Islamic Studies', level: 'beginner', students: 380, rating: 4.8, duration: '30 hrs', image: 'https://images.pexels.com/photos/3771074/pexels-photo-3771074.jpeg?auto=compress&cs=tinysrgb&w=400', isFree: true, price: 0, description: 'Comprehensive introduction to the pillars of Islamic faith.' },
  { id: 3, title: 'Arabic Language for Beginners', category: 'Arabic', level: 'beginner', students: 290, rating: 4.7, duration: '50 hrs', image: 'https://images.pexels.com/photos/3184611/pexels-photo-3184611.jpeg?auto=compress&cs=tinysrgb&w=400', isFree: false, price: 39, description: 'Learn the fundamentals of the Arabic language from scratch.' },
  { id: 4, title: 'Hadith Sciences & Authentication', category: 'Hadith', level: 'intermediate', students: 210, rating: 4.8, duration: '35 hrs', image: 'https://images.pexels.com/photos/3184338/pexels-photo-3184338.jpeg?auto=compress&cs=tinysrgb&w=400', isFree: false, price: 59, description: 'Explore the science of hadith collection, authentication, and application.' },
  { id: 5, title: 'Moral Education & Character', category: 'Moral Education', level: 'beginner', students: 520, rating: 4.9, duration: '25 hrs', image: 'https://images.pexels.com/photos/1181298/pexels-photo-1181298.jpeg?auto=compress&cs=tinysrgb&w=400', isFree: true, price: 0, description: 'Build strong Islamic character and moral values.' },
  { id: 6, title: 'Fiqh: Islamic Jurisprudence', category: 'Fiqh', level: 'advanced', students: 175, rating: 4.7, duration: '60 hrs', image: 'https://images.pexels.com/photos/6330644/pexels-photo-6330644.jpeg?auto=compress&cs=tinysrgb&w=400', isFree: false, price: 79, description: 'Advanced study of Islamic law and its practical applications.' },
  { id: 7, title: 'Quran Memorization (Hifz)', category: 'Quran', level: 'intermediate', students: 340, rating: 4.9, duration: '120 hrs', image: 'https://images.pexels.com/photos/5699456/pexels-photo-5699456.jpeg?auto=compress&cs=tinysrgb&w=400', isFree: false, price: 129, description: 'Structured Quran memorization program with expert guidance.' },
  { id: 8, title: 'Seerah: Life of the Prophet', category: 'Islamic Studies', level: 'beginner', students: 410, rating: 4.8, duration: '28 hrs', image: 'https://images.pexels.com/photos/1108572/pexels-photo-1108572.jpeg?auto=compress&cs=tinysrgb&w=400', isFree: true, price: 0, description: 'Study the blessed life and teachings of Prophet Muhammad ﷺ.' },
  { id: 9, title: 'Advanced Arabic Grammar', category: 'Arabic', level: 'advanced', students: 145, rating: 4.6, duration: '45 hrs', image: 'https://images.pexels.com/photos/3862135/pexels-photo-3862135.jpeg?auto=compress&cs=tinysrgb&w=400', isFree: false, price: 69, description: 'Deep dive into Arabic grammar (Nahw & Sarf) for Quranic understanding.' },
];

const categories = ['All', 'Quran', 'Islamic Studies', 'Arabic', 'Hadith', 'Moral Education', 'Fiqh'];
const levels = ['All Levels', 'beginner', 'intermediate', 'advanced'];

export default function CoursesPage() {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [level, setLevel] = useState('All Levels');
  const [priceFilter, setPriceFilter] = useState('all');

  const filtered = allCourses.filter(c => {
    const matchSearch = c.title.toLowerCase().includes(search.toLowerCase()) ||
      c.description.toLowerCase().includes(search.toLowerCase());
    const matchCat = category === 'All' || c.category === category;
    const matchLevel = level === 'All Levels' || c.level === level;
    const matchPrice = priceFilter === 'all' || (priceFilter === 'free' && c.isFree) || (priceFilter === 'paid' && !c.isFree);
    return matchSearch && matchCat && matchLevel && matchPrice;
  });

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 pt-20">
      {/* Header */}
      <section className="gradient-hero pattern-overlay py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">Explore Our Courses</h1>
          <p className="text-white/80 text-lg mb-8">
            From Quran recitation to advanced Islamic jurisprudence — find the perfect course for your journey.
          </p>
          {/* Search */}
          <div className="relative max-w-xl mx-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search courses..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-white/95 dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-lg"
            />
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Filters */}
        <div className="flex flex-col lg:flex-row gap-4 mb-8">
          {/* Categories */}
          <div className="flex flex-wrap gap-2 flex-1">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                  category === cat
                    ? 'bg-emerald-600 text-white shadow-md'
                    : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 hover:text-emerald-600 dark:hover:text-emerald-400 border border-gray-200 dark:border-gray-700'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Level & Price */}
          <div className="flex gap-3">
            <select
              value={level}
              onChange={e => setLevel(e.target.value)}
              className="input-field py-2 px-4 text-sm w-auto"
            >
              {levels.map(l => <option key={l} value={l}>{l === 'All Levels' ? l : l.charAt(0).toUpperCase() + l.slice(1)}</option>)}
            </select>
            <select
              value={priceFilter}
              onChange={e => setPriceFilter(e.target.value)}
              className="input-field py-2 px-4 text-sm w-auto"
            >
              <option value="all">All Prices</option>
              <option value="free">Free</option>
              <option value="paid">Paid</option>
            </select>
          </div>
        </div>

        {/* Results Count */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            Showing <span className="font-semibold text-gray-900 dark:text-white">{filtered.length}</span> courses
          </p>
        </div>

        {/* Grid */}
        {filtered.length > 0 ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map(course => (
              <div key={course.id} className="card-hover overflow-hidden group">
                <div className="relative overflow-hidden h-48">
                  <img
                    src={course.image}
                    alt={course.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                  <span className={`absolute top-3 left-3 px-2.5 py-1 rounded-full text-xs font-bold ${
                    course.isFree ? 'bg-emerald-500 text-white' : 'bg-gold-500 text-white'
                  }`}>
                    {course.isFree ? 'Free' : `$${course.price}`}
                  </span>
                  <span className="absolute top-3 right-3 badge bg-black/40 text-white text-xs backdrop-blur-sm">
                    {course.level.charAt(0).toUpperCase() + course.level.slice(1)}
                  </span>
                </div>
                <div className="p-5">
                  <span className="badge-green text-xs mb-2">{course.category}</span>
                  <h3 className="font-semibold text-gray-900 dark:text-white text-base mt-2 mb-1.5">{course.title}</h3>
                  <p className="text-gray-500 dark:text-gray-400 text-xs leading-relaxed mb-4">{course.description}</p>
                  <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400 mb-4">
                    <span className="flex items-center gap-1"><Users className="w-3 h-3" />{course.students} students</span>
                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{course.duration}</span>
                    <span className="flex items-center gap-1"><Star className="w-3 h-3 fill-gold-400 text-gold-400" />{course.rating}</span>
                  </div>
                  <Link
                    to="/signup"
                    className="w-full btn-primary text-sm py-2.5 flex items-center justify-center gap-1.5"
                  >
                    Enroll Now <ChevronRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <BookOpen className="w-16 h-16 text-gray-300 dark:text-gray-700 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 dark:text-gray-400 mb-2">No courses found</h3>
            <p className="text-gray-500 dark:text-gray-500">Try adjusting your filters or search term.</p>
            <button onClick={() => { setSearch(''); setCategory('All'); setLevel('All Levels'); setPriceFilter('all'); }}
              className="btn-outline mt-4">
              Reset Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
