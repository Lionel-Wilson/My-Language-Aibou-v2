import React from 'react';
import { Link } from 'react-router-dom';
import { 
  BookOpen, 
  MessageCircle, 
  CheckCircle, 
  Globe, 
  Zap, 
  Search,
  ArrowRight,
  Star,
  Users,
  Languages
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  const features = [
    {
      icon: BookOpen,
      title: 'Definitions & Explanations in Your Native Language 🗣️',
      description: 'Just enter a word or sentence, select your native language, and watch the magic happen. No more confusing translations!',
      color: 'text-blue-400',
      highlight: 'Native Language Support'
    },
    {
      icon: MessageCircle,
      title: 'Translation & Slang Comprehension 👊🏽',
      description: 'No more asking your friends what "stop the cap" or "she\'s leng" means. Just look it up in the "Translator" section.',
      color: 'text-green-400',
      highlight: 'Translation & Slang'
    },
    {
      icon: CheckCircle,
      title: 'Sentence Correction 👨🏻‍🏫',
      description: 'Wondering if your sentence is grammatically correct or natural? Paste it in the "Correction" section and receive feedback instantly!',
      color: 'text-purple-400',
      highlight: 'Instant Feedback'
    }
  ];

  const benefits = [
    {
      icon: Search,
      title: 'Recursive Look-ups 🔍',
      description: 'Don\'t understand what a word in the explanation means? Highlight the word and click define to look it up in a new tab!'
    },
    {
      icon: Globe,
      title: 'Unlimited Languages 🌍',
      description: 'Your native language missing? Message me and I\'ll add it. We support 12+ languages and growing!'
    },
    {
      icon: Zap,
      title: 'Instant & Accurate',
      description: 'Get immediate, precise responses that help you understand and improve your language skills in real-time.'
    }
  ];

  const stats = [
    { number: '12+', label: 'Languages' },
    { number: '3', label: 'Core Features' },
    { number: '24/7', label: 'Available' },
    { number: '∞', label: 'Possibilities' }
  ];

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      {/* Header */}
      <header className="border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-2">
              <Languages className="w-8 h-8 text-blue-400" />
              <div>
                <h1 className="text-xl font-bold">My Language</h1>
                <p className="text-sm text-slate-400">Aibou</p>
              </div>
            </div>
            <Link
              to="/app"
              className="bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
            >
              Launch App
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <div className="mb-8">
            <div className="inline-flex items-center bg-slate-800 rounded-full px-4 py-2 mb-6">
              <Star className="w-4 h-4 text-yellow-400 mr-2" />
              <span className="text-sm text-slate-300">Your AI Language Assistant</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-400 via-purple-400 to-green-400 bg-clip-text text-transparent">
              No More Google Translate!
            </h1>
            <p className="text-xl text-slate-300 mb-8 max-w-3xl mx-auto leading-relaxed">
              Get definitions and explanations in your native language, correct your grammar instantly, 
              understand slang, and explore words recursively. Your complete language companion is here.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Link
              to="/app"
              className="bg-blue-600 hover:bg-blue-700 px-8 py-4 rounded-lg font-semibold text-lg transition-all transform hover:scale-105 flex items-center justify-center gap-2"
            >
              Get Started Free
              <ArrowRight size={20} />
            </Link>
            <button className="border border-slate-600 hover:border-slate-500 px-8 py-4 rounded-lg font-semibold text-lg transition-colors">
              Watch Demo
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-2xl mx-auto">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl font-bold text-blue-400 mb-2">{stat.number}</div>
                <div className="text-slate-400 text-sm">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-800/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Powerful Language Tools</h2>
            <p className="text-xl text-slate-300 max-w-2xl mx-auto">
              Everything you need to understand, analyze, and improve your language skills in one place.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-slate-800 rounded-xl p-8 border border-slate-700 hover:border-slate-600 transition-colors">
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 rounded-lg bg-slate-700 flex items-center justify-center`}>
                    <feature.icon className={`w-6 h-6 ${feature.color}`} />
                  </div>
                  <span className="text-xs bg-blue-600/20 text-blue-400 px-2 py-1 rounded-full font-medium">
                    {feature.highlight}
                  </span>
                </div>
                <h3 className="text-lg font-semibold mb-4 leading-tight">{feature.title}</h3>
                <p className="text-slate-300 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Why Choose My Language Aibou?</h2>
            <p className="text-xl text-slate-300 max-w-2xl mx-auto">
              Built for learners, professionals, and anyone who wants to communicate better across languages.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-blue-600/20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <benefit.icon className="w-8 h-8 text-blue-400" />
                </div>
                <h3 className="text-xl font-semibold mb-4">{benefit.title}</h3>
                <p className="text-slate-300 leading-relaxed">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-600/20 to-purple-600/20">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to Master Languages?</h2>
          <p className="text-xl text-slate-300 mb-8 max-w-2xl mx-auto">
            Join thousands of users who are already improving their language skills with My Language Aibou.
          </p>
          <Link
            to="/app"
            className="inline-flex items-center bg-blue-600 hover:bg-blue-700 px-8 py-4 rounded-lg font-semibold text-lg transition-all transform hover:scale-105 gap-2"
          >
            Start Learning Now
            <ArrowRight size={20} />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <Languages className="w-6 h-6 text-blue-400" />
              <div>
                <h3 className="font-semibold">My Language Aibou</h3>
                <p className="text-sm text-slate-400">Your AI Language Assistant</p>
              </div>
            </div>
            <div className="text-sm text-slate-400">
              © 2025 My Language Aibou. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};