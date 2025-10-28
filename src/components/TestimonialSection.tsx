import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

interface Testimonial {
  id: number;
  name: string;
  role: string;
  quote: string;
  country: string;
  avatar: string;
}

const testimonials: Testimonial[] = [
  {
    id: 1,
    name: "Sarah Chen",
    role: "Student in Tokyo",
    quote: "GlobeMates helped me connect with other international students in Tokyo. Within my first week, I found a study group and attended amazing cultural events. It made my transition so much easier!",
    country: "🇺🇸 USA",
    avatar: "https://api.dicebear.com/7.x/adventurer/svg?seed=Sarah&backgroundColor=b6e3f4"
  },
  {
    id: 2,
    name: "Lucas Martinez",
    role: "Exchange Student in Paris",
    quote: "The local integration hub was a lifesaver. I learned about French customs and found resources that helped me feel at home quickly. Best platform for international students!",
    country: "🇪🇸 Spain",
    avatar: "https://api.dicebear.com/7.x/adventurer/svg?seed=Lucas&backgroundColor=ffd5dc"
  },
  {
    id: 3,
    name: "Priya Sharma",
    role: "Graduate Student in London",
    quote: "Finding peers from my home country and making new international friends has been incredible. The event calendar keeps me updated on everything happening around the city.",
    country: "🇮🇳 India",
    avatar: "https://api.dicebear.com/7.x/adventurer/svg?seed=Priya&backgroundColor=c0aede"
  }
];

const TestimonialSection = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === testimonials.length - 1 ? 0 : prev + 1));
  };

  const currentTestimonial = testimonials[currentIndex];

  return (
    <section className="py-20 px-4 bg-gray-50">
      <div className="max-w-5xl mx-auto">
        <div className="bg-white rounded-2xl p-8 md:p-12 shadow-sm">
          <div className="flex flex-col md:flex-row gap-8 items-start">
            {/* Left: Avatar and Info */}
            <div className="flex-shrink-0">
              <Avatar className="h-24 w-24 mb-4">
                <AvatarImage src={currentTestimonial.avatar} alt={currentTestimonial.name} />
                <AvatarFallback>{currentTestimonial.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-semibold text-gray-900">{currentTestimonial.name}</p>
                <p className="text-sm text-gray-500">{currentTestimonial.role}</p>
              </div>
            </div>

            {/* Middle: Testimonial Text */}
            <div className="flex-1">
              <p className="text-gray-600 leading-relaxed text-lg">
                "{currentTestimonial.quote}"
              </p>
            </div>

            {/* Right: Country Badge - Starburst Style */}
            <div className="flex-shrink-0">
              <div className="relative w-32 h-32 flex items-center justify-center">
                {/* Starburst background */}
                <svg viewBox="0 0 200 200" className="absolute inset-0 w-full h-full">
                  <defs>
                    <linearGradient id="badge-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" style={{ stopColor: '#FF9C7C', stopOpacity: 1 }} />
                      <stop offset="100%" style={{ stopColor: '#FFA07A', stopOpacity: 1 }} />
                    </linearGradient>
                  </defs>
                  {/* Starburst outer edge */}
                  <path
                    d="M100,10 L105,45 L115,15 L115,50 L125,20 L122,55 L135,30 L128,60 L145,40 L135,65 L155,50 L142,70 L165,60 L148,75 L170,70 L153,80 L175,85 L155,85 L175,95 L153,100 L170,110 L148,105 L165,120 L142,110 L155,130 L135,115 L145,140 L128,120 L135,150 L122,125 L125,160 L115,130 L115,165 L105,135 L100,170 L95,135 L85,165 L85,130 L75,160 L78,125 L65,150 L72,120 L55,140 L65,115 L45,130 L58,110 L35,120 L52,105 L30,110 L47,100 L25,95 L45,85 L25,85 L47,80 L30,70 L52,75 L35,60 L58,70 L45,50 L65,65 L55,40 L72,60 L65,30 L78,55 L75,20 L85,50 L85,15 L95,45 Z"
                    fill="url(#badge-gradient)"
                    stroke="#FFFFFF"
                    strokeWidth="3"
                    filter="drop-shadow(0 2px 4px rgba(0,0,0,0.1))"
                  />
                  {/* Inner circles */}
                  <circle cx="100" cy="100" r="45" fill="rgba(255,255,255,0.3)" />
                  <circle cx="100" cy="100" r="40" fill="rgba(255,156,124,0.5)" stroke="rgba(255,255,255,0.5)" strokeWidth="1" />
                </svg>
                {/* Text content */}
                <div className="relative z-10 flex flex-col items-center justify-center">
                  <span className="text-xl font-bold text-white drop-shadow-sm">
                    {currentTestimonial.country}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Arrows */}
          <div className="flex items-center justify-center gap-4 mt-8">
            <button
              onClick={handlePrevious}
              className="p-2 rounded-full hover:bg-gray-100 transition-colors"
              aria-label="Previous testimonial"
            >
              <ChevronLeft className="w-6 h-6 text-gray-600" />
            </button>
            
            <div className="flex gap-2">
              {testimonials.map((_, index) => (
                <div
                  key={index}
                  className={`h-2 w-2 rounded-full transition-colors ${
                    index === currentIndex ? 'bg-gray-900' : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>

            <button
              onClick={handleNext}
              className="p-2 rounded-full hover:bg-gray-100 transition-colors"
              aria-label="Next testimonial"
            >
              <ChevronRight className="w-6 h-6 text-gray-600" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialSection;
