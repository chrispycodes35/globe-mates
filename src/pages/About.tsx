import PreLoginNavbar from '@/components/PreLoginNavbar';
import Footer from '@/components/Footer';
import { Globe, MapPin, Users, BookOpen, Heart } from 'lucide-react';

const About = () => {
  return (
    <div className="min-h-screen bg-globemates-navy">
      <PreLoginNavbar />

      <main className="pt-24 pb-20 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16 fade-in">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 text-white">
              About GlobeMates
            </h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Your trusted companion for navigating study abroad experiences
            </p>
          </div>

          {/* Mission Section */}
          <section className="mb-16 fade-in-delay-1">
            <h2 className="text-3xl font-bold mb-6 text-white">Our Mission</h2>
            <p className="text-lg text-gray-300 leading-relaxed mb-4">
              GlobeMates is designed to help students studying abroad connect with their peers, 
              discover local events, and access essential resources to make their international 
              experience unforgettable.
            </p>
            <p className="text-lg text-gray-300 leading-relaxed">
              We believe that studying abroad should be accessible, safe, and enriching. 
              Our platform brings together everything you need in one place.
            </p>
          </section>

          {/* How It Works */}
          <section className="mb-16 fade-in-delay-2">
            <h2 className="text-3xl font-bold mb-8 text-white">How to Use GlobeMates</h2>
            
            <div className="space-y-8">
              <div className="bg-globemates-navy-light rounded-xl p-6 shadow-lg border border-gray-700">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-pink-600 rounded-full flex items-center justify-center">
                      <span className="text-2xl font-bold text-white">1</span>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2 text-white">Create Your Account</h3>
                    <p className="text-gray-300">
                      Sign up with your email and provide basic information about your study abroad program, 
                      including your home university, destination city, and program type.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-globemates-navy-light rounded-xl p-6 shadow-lg border border-gray-700">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-pink-600 rounded-full flex items-center justify-center">
                      <span className="text-2xl font-bold text-white">2</span>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2 text-white">Explore Your City</h3>
                    <p className="text-gray-300">
                      Browse city hubs to discover events, resources, and local knowledge specific to your 
                      study abroad destination. Each city has its own dedicated page with curated content.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-globemates-navy-light rounded-xl p-6 shadow-lg border border-gray-700">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-pink-600 rounded-full flex items-center justify-center">
                      <span className="text-2xl font-bold text-white">3</span>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2 text-white">Discover Events</h3>
                    <p className="text-gray-300">
                      Check out the Events page to find program events, student-led activities, local events, 
                      and broader regional gatherings. Events are automatically filtered based on your location.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-globemates-navy-light rounded-xl p-6 shadow-lg border border-gray-700">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-pink-600 rounded-full flex items-center justify-center">
                      <span className="text-2xl font-bold text-white">4</span>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2 text-white">Access Resources</h3>
                    <p className="text-gray-300">
                      Use the Services and Features pages to find academic support, local guidance, 
                      networking opportunities, and practical tips for your study abroad journey.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Features Section */}
          <section className="mb-16 fade-in-delay-3">
            <h2 className="text-3xl font-bold mb-8 text-white">Platform Features</h2>
            <div className="space-y-8">
              <div className="bg-globemates-navy-light rounded-xl p-6 shadow-lg border border-gray-700">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    <MapPin className="w-10 h-10 text-pink-500" strokeWidth={1.5} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2 text-white">Local Hubs</h3>
                    <p className="text-gray-300 leading-relaxed">
                      Connect with your city's international community through dedicated local hubs that bring students together
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="bg-globemates-navy-light rounded-xl p-6 shadow-lg border border-gray-700">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    <Users className="w-10 h-10 text-pink-500" strokeWidth={1.5} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2 text-white">University Integration</h3>
                    <p className="text-gray-300 leading-relaxed">
                      Seamlessly integrate with your university's services and connect with fellow students from your institution
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="bg-globemates-navy-light rounded-xl p-6 shadow-lg border border-gray-700">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    <Globe className="w-10 h-10 text-pink-500" strokeWidth={1.5} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2 text-white">Resource Guide</h3>
                    <p className="text-gray-300 leading-relaxed">
                      Access comprehensive guides covering everything from local customs to essential services in your new city
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* CTA Section */}
          <section className="text-center bg-globemates-navy-light rounded-xl p-8 shadow-lg border border-gray-700 fade-in-delay-3">
            <Heart className="w-12 h-12 text-pink-500 mx-auto mb-4" />
            <h2 className="text-3xl font-bold mb-4 text-white">Ready to Get Started?</h2>
            <p className="text-lg text-gray-300 mb-6">
              Join thousands of students making the most of their study abroad experience.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a 
                href="/signup" 
                className="px-6 py-3 rounded-xl text-base font-semibold transition-colors"
                style={{ backgroundColor: '#FF9C00', color: '#000' }}
              >
                Create Account
              </a>
              <a 
                href="/login" 
                className="px-6 py-3 rounded-xl text-base font-semibold transition-colors border border-gray-600 bg-gray-700 text-white hover:bg-gray-600"
              >
                Log In
              </a>
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default About;

