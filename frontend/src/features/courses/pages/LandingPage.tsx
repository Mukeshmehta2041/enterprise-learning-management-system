import { useNavigate } from 'react-router-dom'
import { useFeaturedCourses, useTrendingCourses } from '../api/useCourses'
import { CourseCard } from '../components/CourseCard'
import {
  Container,
  Heading1,
  Heading2,
  TextMuted,
  Button,
} from '@/shared/ui'
import { Sparkles, TrendingUp, ArrowRight, Zap, Shield, BookOpen } from 'lucide-react'

export function LandingPage() {
  const navigate = useNavigate()
  const { data: featuredData, isLoading: featuredLoading } = useFeaturedCourses()
  const { data: trendingData, isLoading: trendingLoading } = useTrendingCourses()

  return (
    <div className="space-y-20 pb-20">
      {/* Hero Section */}
      <section className="bg-slate-900 py-24 text-white">
        <Container>
          <div className="max-w-3xl">
            <span className="inline-block px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-400 text-sm font-medium mb-6">
              New: Advanced TypeScript Course Out Now
            </span>
            <Heading1 className="text-white text-5xl md:text-6xl mb-6">
              Master New Skills with Our Professional Courses
            </Heading1>
            <p className="text-slate-400 text-xl mb-10 leading-relaxed">
              Join over 10,000 students learning from industry experts.
              Get access to high-quality video lectures, practical assignments, and personalized feedback.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="px-8" onClick={() => navigate('/courses')}>
                Browse All Courses
                <ArrowRight size={20} className="ml-2" />
              </Button>
              <Button size="lg" variant="outline" className="border-slate-700 text-white hover:bg-slate-800" onClick={() => navigate('/register')}>
                Start Learning for Free
              </Button>
            </div>
          </div>
        </Container>
      </section>

      {/* Featured Courses */}
      {!featuredLoading && featuredData?.content && featuredData.content.length > 0 && (
        <section>
          <Container>
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-2">
                <Sparkles className="text-amber-500" size={28} />
                <Heading2>Featured Courses</Heading2>
              </div>
              <Button variant="link" onClick={() => navigate('/courses?featured=true')}>
                View all featured
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredData.content.slice(0, 3).map((course) => (
                <CourseCard key={course.id} course={course} />
              ))}
            </div>
          </Container>
        </section>
      )}

      {/* Benefits */}
      <section className="bg-slate-50 py-20 border-y border-slate-200">
        <Container>
          <div className="text-center mb-16">
            <Heading2 className="mb-4">Why learn with us?</Heading2>
            <TextMuted className="text-lg">We provide everything you need to succeed in your career.</TextMuted>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              {
                icon: <Zap className="text-indigo-600" size={32} />,
                title: 'Practical Learning',
                desc: 'Learn by doing with project-based courses designed for the real world.'
              },
              {
                icon: <Shield className="text-indigo-600" size={32} />,
                title: 'Official Certificates',
                desc: 'Earn recognized certificates to show off your achievements to employers.'
              },
              {
                icon: <BookOpen className="text-indigo-600" size={32} />,
                title: 'Lifetime Access',
                desc: 'Learn at your own pace with lifetime access to all your enrolled courses.'
              }
            ].map((benefit, i) => (
              <div key={i} className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 flex flex-col items-center text-center">
                <div className="mb-6 p-4 bg-indigo-50 rounded-2xl">{benefit.icon}</div>
                <h3 className="text-xl font-bold mb-3">{benefit.title}</h3>
                <p className="text-slate-600 leading-relaxed">{benefit.desc}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Trending Courses */}
      {!trendingLoading && trendingData?.content && trendingData.content.length > 0 && (
        <section>
          <Container>
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-2">
                <TrendingUp className="text-blue-500" size={28} />
                <Heading2>Trending Near You</Heading2>
              </div>
              <Button variant="link" onClick={() => navigate('/courses?sort=enrollmentCount&order=desc')}>
                View most popular
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {trendingData.content.slice(0, 3).map((course) => (
                <CourseCard key={course.id} course={course} />
              ))}
            </div>
          </Container>
        </section>
      )}

      {/* CTA */}
      <section>
        <Container>
          <div className="bg-indigo-600 rounded-3xl p-12 text-center text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 bg-indigo-500 rounded-full blur-3xl opacity-50"></div>
            <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-64 h-64 bg-indigo-700 rounded-full blur-3xl opacity-50"></div>

            <h2 className="text-4xl font-bold mb-6 relative">Ready to start your journey?</h2>
            <p className="text-indigo-100 text-lg mb-10 max-w-2xl mx-auto relative">
              Join thousands of students who are already learning on our platform.
              Get started today and discover your new favorite hobby or profession.
            </p>
            <div className="flex justify-center gap-4 relative">
              <Button size="lg" variant="secondary" onClick={() => navigate('/register')}>
                Sign Up Now
              </Button>
              <Button size="lg" className="bg-white text-indigo-600 hover:bg-slate-100 border-none px-8" onClick={() => navigate('/courses')}>
                Explore Catalog
              </Button>
            </div>
          </div>
        </Container>
      </section>
    </div>
  )
}
