import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

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
    country: "USA",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah"
  },
  {
    id: 2,
    name: "Lucas Martinez",
    role: "Exchange Student in Paris",
    quote: "The local integration hub was a lifesaver. I learned about French customs and found resources that helped me feel at home quickly. Best platform for international students!",
    country: "Spain",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Lucas"
  },
  {
    id: 3,
    name: "Priya Sharma",
    role: "Graduate Student in London",
    quote: "Finding peers from my home country and making new international friends has been incredible. The event calendar keeps me updated on everything happening around the city.",
    country: "India",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Priya"
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

            {/* Right: Country Badge */}
            <div className="flex-shrink-0">
              <Badge 
                variant="outline" 
                className="text-xl font-bold px-6 py-3 rounded-xl border-2"
              >
                {currentTestimonial.country}
              </Badge>
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
