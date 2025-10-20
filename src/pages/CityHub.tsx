import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Calendar, BookOpen, Users, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import tokyoImage from "@/assets/tokyo-city.jpg";

const cityData: Record<string, {
  name: string;
  country: string;
  description: string;
  events: Array<{ title: string; date: string; location: string }>;
  survival: Array<{ title: string; description: string }>;
  resources: Array<{ title: string; description: string; contact: string }>;
  slang: Array<{ term: string; meaning: string; example: string }>;
}> = {
  tokyo: {
    name: "Tokyo",
    country: "Japan",
    description: "Welcome to Tokyo! Navigate Japan's vibrant capital with confidence.",
    events: [
      { title: "International Students Meetup", date: "Every Friday 7 PM", location: "Shibuya Hub" },
      { title: "Cherry Blossom Festival", date: "April 1-10", location: "Ueno Park" },
      { title: "Japanese Language Exchange", date: "Tuesdays & Thursdays 6 PM", location: "Shinjuku Community Center" },
    ],
    survival: [
      { title: "Transportation", description: "Get a Suica or Pasmo card for trains and buses. Tokyo Metro and JR lines cover the entire city. Download the Japan Transit Planner app." },
      { title: "Emergency Numbers", description: "Police: 110, Ambulance/Fire: 119. For English support, dial the Japan Helpline: 0570-000-911." },
      { title: "Banking", description: "7-Eleven ATMs accept international cards. Consider opening an account at Japan Post Bank or SMBC." },
      { title: "Mobile & Internet", description: "Get a pocket wifi or SIM card at the airport. Recommended providers: Sakura Mobile, Mobal, or SoftBank." },
    ],
    resources: [
      { title: "Tokyo International Students Office", description: "Academic and visa support", contact: "tiso@tokyo-university.ac.jp" },
      { title: "Tokyo Medical Clinic", description: "English-speaking doctors", contact: "+81-3-1234-5678" },
      { title: "Student Housing Support", description: "Help finding accommodation", contact: "housing@studytokyo.org" },
      { title: "Mental Health Support", description: "24/7 counseling in English", contact: "TELL: 03-5774-0992" },
    ],
    slang: [
      { term: "Yabai", meaning: "Amazing/terrible (context-dependent)", example: "That ramen was yabai! (That ramen was amazing!)" },
      { term: "Sugoi", meaning: "Wow, amazing, incredible", example: "Sugoi desu ne! (That's incredible!)" },
      { term: "Meccha", meaning: "Very, super", example: "Meccha oishii! (Super delicious!)" },
      { term: "Maji", meaning: "Seriously, really", example: "Maji? (Seriously?)" },
      { term: "Chotto", meaning: "A little, wait a moment", example: "Chotto matte! (Wait a moment!)" },
    ],
  },
  paris: {
    name: "Paris",
    country: "France",
    description: "Bienvenue à Paris! Your guide to the City of Light.",
    events: [
      { title: "Student Welcome Soirée", date: "First Monday of each month", location: "Latin Quarter" },
      { title: "Museum Night", date: "Every Saturday evening", location: "Various Museums" },
    ],
    survival: [
      { title: "Metro & Transport", description: "Get a Navigo pass for unlimited metro and bus travel. Download Citymapper for navigation." },
      { title: "Emergency Numbers", description: "Emergency: 112, Police: 17, Medical: 15, Fire: 18" },
    ],
    resources: [
      { title: "CROUS Paris", description: "Student services and housing", contact: "contact@crous-paris.fr" },
      { title: "SOS Médecins", description: "24/7 medical house calls", contact: "01 47 07 77 77" },
    ],
    slang: [
      { term: "Bof", meaning: "Meh, indifferent", example: "C'était comment? Bof. (How was it? Meh.)" },
      { term: "Kiffer", meaning: "To love, to really like", example: "Je kiffe Paris! (I love Paris!)" },
    ],
  },
  london: {
    name: "London",
    country: "England",
    description: "Welcome to London! Your guide to Britain's bustling capital.",
    events: [
      { title: "Student Pub Night", date: "Every Thursday", location: "Camden Town" },
      { title: "Free Museum Tours", date: "Weekends", location: "British Museum & V&A" },
    ],
    survival: [
      { title: "Oyster Card", description: "Essential for Tube, buses, and trains. Tap in and out for best fares." },
      { title: "Emergency", description: "Dial 999 for emergency services. NHS 111 for non-emergency health advice." },
    ],
    resources: [
      { title: "UKCISA", description: "International student advice", contact: "advice@ukcisa.org.uk" },
      { title: "NHS Student Health", description: "Register at a local GP", contact: "Visit nhs.uk" },
    ],
    slang: [
      { term: "Chuffed", meaning: "Very pleased", example: "I'm chuffed with my results!" },
      { term: "Knackered", meaning: "Exhausted", example: "I'm absolutely knackered." },
    ],
  },
  "new-york": {
    name: "New York City",
    country: "USA",
    description: "Welcome to NYC! The city that never sleeps awaits you.",
    events: [
      { title: "Student Networking", date: "Every Wednesday 6 PM", location: "Manhattan Campus Hub" },
      { title: "Free Concert Series", date: "Summer weekends", location: "Central Park" },
    ],
    survival: [
      { title: "MetroCard", description: "Get an unlimited MetroCard for subway and bus travel. Download the MYmta app." },
      { title: "Emergency", description: "Call 911 for all emergencies. 311 for city services and information." },
    ],
    resources: [
      { title: "NYU International Students", description: "Visa and academic support", contact: "iss@nyu.edu" },
      { title: "NYC Health Clinics", description: "Affordable student healthcare", contact: "Visit nyc.gov/health" },
    ],
    slang: [
      { term: "Deadass", meaning: "Seriously, for real", example: "I'm deadass tired right now." },
      { term: "Mad", meaning: "Very, a lot", example: "That's mad cool!" },
    ],
  },
  copenhagen: {
    name: "Copenhagen",
    country: "Denmark",
    description: "Velkommen til København! Navigate Denmark's design capital.",
    events: [
      { title: "Student Cycling Tours", date: "Every Saturday 10 AM", location: "City Hall Square" },
      { title: "Nordic Film Night", date: "Monthly", location: "Student Cinema" },
    ],
    survival: [
      { title: "Cycling", description: "Get a bike! Copenhagen is built for cycling. Follow bike lane rules strictly." },
      { title: "Emergency", description: "Dial 112 for emergencies. All services speak English." },
    ],
    resources: [
      { title: "Study in Denmark", description: "Official student support", contact: "info@studyindenmark.dk" },
      { title: "CPR Number Help", description: "Assistance with registration", contact: "Visit local borgerservice" },
    ],
    slang: [
      { term: "Hygge", meaning: "Cozy contentment", example: "Let's have a hygge evening with candles and coffee." },
      { term: "Lige", meaning: "Just, exactly", example: "Det er lige det! (That's exactly it!)" },
    ],
  },
  milan: {
    name: "Milan",
    country: "Italy",
    description: "Benvenuto a Milano! Your guide to Italy's fashion and business capital.",
    events: [
      { title: "Aperitivo Hour", date: "Daily 6-9 PM", location: "Navigli District" },
      { title: "Fashion Week Events", date: "Twice yearly", location: "City Center" },
    ],
    survival: [
      { title: "ATM Pass", description: "Milan's metro, tram, and bus pass. Get weekly or monthly tickets." },
      { title: "Emergency", description: "Emergency: 112, Police: 113, Medical: 118" },
    ],
    resources: [
      { title: "Politecnico Support", description: "Student services", contact: "servizi.studenti@polimi.it" },
      { title: "English-Speaking Doctors", description: "Milan Medical Center", contact: "+39 02 7601 6047" },
    ],
    slang: [
      { term: "Boh", meaning: "I don't know", example: "Dove andiamo? Boh! (Where are we going? I dunno!)" },
      { term: "Che figata", meaning: "How cool!", example: "Che figata questa città! (This city is so cool!)" },
    ],
  },
  rome: {
    name: "Rome",
    country: "Italy",
    description: "Benvenuto a Roma! Experience the eternal city.",
    events: [
      { title: "Student Gelato Tour", date: "Every Sunday 4 PM", location: "Trastevere" },
      { title: "Ancient Rome Walking Tour", date: "Saturdays", location: "Colosseum Area" },
    ],
    survival: [
      { title: "ATAC Transport", description: "Get a monthly pass for metro and buses. Validate tickets every time!" },
      { title: "Emergency", description: "Emergency: 112, Tourist Police: 06 4686 2987" },
    ],
    resources: [
      { title: "Sapienza Int'l Office", description: "Academic support", contact: "international@uniroma1.it" },
      { title: "Rome English Hospital", description: "24/7 English care", contact: "+39 06 225 51" },
    ],
    slang: [
      { term: "Daje", meaning: "Come on! Let's go!", example: "Daje Roma! (Come on, Rome!)" },
      { term: "A bro", meaning: "Cool, great", example: "Che bello, a bro! (How nice, cool!)" },
    ],
  },
};

const CityHub = () => {
  const { cityName } = useParams<{ cityName: string }>();
  const navigate = useNavigate();
  
  const city = cityName ? cityData[cityName] : null;

  if (!city) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">City Not Found</h1>
          <Button onClick={() => navigate("/")}>Return Home</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="relative h-[400px] overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ 
            backgroundImage: cityName === 'tokyo' ? `url(${tokyoImage})` : 'linear-gradient(135deg, hsl(var(--primary)), hsl(var(--secondary)))',
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-background" />
        
        <div className="relative h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col justify-center">
          <Button 
            variant="ghost" 
            className="self-start mb-6 text-white hover:bg-white/20"
            onClick={() => navigate("/")}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Cities
          </Button>
          
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-2">
            {city.name}
          </h1>
          <p className="text-xl text-white/90 mb-1">{city.country}</p>
          <p className="text-lg text-white/80 max-w-2xl">{city.description}</p>
        </div>
      </div>

      {/* Content Sections */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
        
        {/* Events Section */}
        <section>
          <div className="flex items-center gap-3 mb-6">
            <Calendar className="h-8 w-8 text-primary" />
            <h2 className="text-3xl font-bold">Upcoming Events</h2>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {city.events.map((event, idx) => (
              <Card key={idx} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle>{event.title}</CardTitle>
                  <CardDescription>{event.date}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{event.location}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Survival Guide Section */}
        <section>
          <div className="flex items-center gap-3 mb-6">
            <BookOpen className="h-8 w-8 text-primary" />
            <h2 className="text-3xl font-bold">Survival Guide</h2>
          </div>
          <div className="grid gap-6 md:grid-cols-2">
            {city.survival.map((guide, idx) => (
              <Card key={idx}>
                <CardHeader>
                  <CardTitle className="text-xl">{guide.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{guide.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Support Resources Section */}
        <section>
          <div className="flex items-center gap-3 mb-6">
            <Users className="h-8 w-8 text-primary" />
            <h2 className="text-3xl font-bold">Support Resources</h2>
          </div>
          <div className="grid gap-6 md:grid-cols-2">
            {city.resources.map((resource, idx) => (
              <Card key={idx}>
                <CardHeader>
                  <CardTitle className="text-xl">{resource.title}</CardTitle>
                  <CardDescription>{resource.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm font-medium text-primary">{resource.contact}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Local Slang Section */}
        <section>
          <div className="flex items-center gap-3 mb-6">
            <MessageSquare className="h-8 w-8 text-primary" />
            <h2 className="text-3xl font-bold">Local Slang</h2>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {city.slang.map((item, idx) => (
              <Card key={idx}>
                <CardHeader>
                  <CardTitle className="text-lg text-accent">{item.term}</CardTitle>
                  <CardDescription>{item.meaning}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm italic text-muted-foreground">{item.example}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

      </div>
    </div>
  );
};

export default CityHub;
