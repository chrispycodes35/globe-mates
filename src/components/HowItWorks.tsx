import { useEffect, useRef, useState } from 'react';
import { School, MapPin, Calendar, Users, CheckCircle2 } from 'lucide-react';

export interface Step {
  id: string;
  title: string;
  description: string;
  details: string[];
  icon: React.ComponentType<{ className?: string }>;
  image?: string;
  video?: string;
  color: string;
}

interface HowItWorksProps {
  steps: Step[];
}

const HowItWorks = ({ steps }: HowItWorksProps) => {
  const [activeStep, setActiveStep] = useState(0);
  const stepRefs = useRef<(HTMLDivElement | null)[]>([]);

  const getTextColor = (bgColor: string) => {
    const colorMap: Record<string, string> = {
      'bg-blue-600': 'text-orange-600',
      'bg-pink-600': 'text-orange-500',
      'bg-purple-600': 'text-orange-400',
      'bg-green-600': 'text-orange-600',
    };
    return colorMap[bgColor] || 'text-orange-600';
  };

  useEffect(() => {
    const observers: IntersectionObserver[] = [];

    stepRefs.current.forEach((ref, index) => {
      if (!ref) return;

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              setActiveStep(index);
            }
          });
        },
        {
          threshold: 0.5,
          rootMargin: '-100px 0px -100px 0px',
        }
      );

      observer.observe(ref);
      observers.push(observer);
    });

    return () => {
      observers.forEach((observer) => observer.disconnect());
    };
  }, []);

  return (
    <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16 fade-in">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900">
            How It Works
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Get started in just a few simple steps
          </p>
        </div>

        <div className="relative">
          {/* Progress Indicator */}
          <div className="hidden lg:block absolute left-0 top-0 bottom-0 w-1 bg-gray-300 ml-6">
            <div 
              className="absolute top-0 w-1 bg-orange-600 transition-all duration-500"
              style={{ 
                height: `${((activeStep + 1) / steps.length) * 100}%` 
              }}
            />
          </div>

          <div className="space-y-24 lg:space-y-32">
            {steps.map((step, index) => (
              <div
                key={step.id}
                ref={(el) => {
                  stepRefs.current[index] = el;
                }}
                className={`relative lg:pl-20 transition-all duration-500 ${
                  activeStep === index
                    ? 'opacity-100 scale-100'
                    : 'opacity-60 scale-95'
                }`}
              >
                {/* Step Number & Icon */}
                <div className="flex items-start gap-6 mb-8">
                  <div className={`flex-shrink-0 w-14 h-14 rounded-full ${step.color === 'bg-blue-600' ? 'bg-orange-600' : step.color === 'bg-pink-600' ? 'bg-orange-500' : step.color === 'bg-purple-600' ? 'bg-orange-400' : 'bg-orange-600'} flex items-center justify-center text-white font-bold text-xl shadow-lg transition-transform ${
                    activeStep === index ? 'scale-110' : ''
                  }`}>
                    {activeStep >= index ? (
                      <CheckCircle2 className="w-8 h-8" />
                    ) : (
                      <span>{index + 1}</span>
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-4 mb-4">
                      <step.icon className={`w-8 h-8 ${getTextColor(step.color)}`} />
                      <h3 className="text-3xl md:text-4xl font-bold text-gray-900">
                        {step.title}
                      </h3>
                    </div>
                    <p className="text-lg text-gray-700 mb-6 leading-relaxed">
                      {step.description}
                    </p>

                    {/* Step Details */}
                    <div className="bg-white rounded-xl p-6 shadow-lg mb-6">
                      <ul className="space-y-3">
                        {step.details.map((detail, detailIndex) => (
                          <li key={detailIndex} className="flex items-start gap-3">
                            <div className="flex-shrink-0 w-6 h-6 rounded-full bg-orange-100 flex items-center justify-center mt-0.5">
                              <div className="w-2 h-2 rounded-full bg-orange-600" />
                            </div>
                            <p className="text-gray-700 flex-1">{detail}</p>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Demo Video or Image */}
                    {step.video && (
                      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                        <div className="relative w-full aspect-video bg-gray-900">
                          <video
                            src={step.video}
                            controls
                            className="w-full h-full object-cover"
                            playsInline
                          >
                            Your browser does not support the video tag.
                          </video>
                        </div>
                      </div>
                    )}
                    {step.image && !step.video && (
                      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                        <img 
                          src={step.image} 
                          alt={step.title}
                          className="w-full h-auto"
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
    </div>
  );
};

export default HowItWorks;

