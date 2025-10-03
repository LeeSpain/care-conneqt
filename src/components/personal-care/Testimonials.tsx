import { Card, CardContent } from "@/components/ui/card";
import { Star, Quote } from "lucide-react";

export const Testimonials = () => {
  const testimonials = [
    {
      name: "Maria Garcia",
      age: 78,
      location: "Madrid, Spain",
      quote: "The AI Guardian checks on me every morning and evening in Spanish. It's like having a caring friend who never forgets about me. When I had chest pain last month, the nurses were on the phone within minutes.",
      rating: 5,
      image: "M"
    },
    {
      name: "David Thompson's Family",
      relationship: "Son, living in London",
      location: "Father in Manchester, UK",
      quote: "We can see Dad's activity on the dashboard throughout the day. No more constant worry calls that made him feel monitored. The SOS pendant gives him confidence to go on his daily walks again.",
      rating: 5,
      image: "D"
    },
    {
      name: "Anna van Dijk",
      age: 82,
      location: "Amsterdam, Netherlands",
      quote: "After my fall last year, the SOS pendant saved my life. I couldn't reach my phone, but I pressed the button and nurses arrived in 8 minutes. Now I have the BBrain monitor that tracks my sleep too. I feel so safe.",
      rating: 5,
      image: "A"
    }
  ];

  return (
    <section className="py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold font-['Poppins'] text-primary mb-4">
            Real Stories from Our Members
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Hear from families and seniors who have experienced the Care Conneqt difference
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {testimonials.map((testimonial, idx) => (
            <Card key={idx} className="border-2 hover:border-secondary/50 transition-all relative">
              <div className="absolute top-4 right-4 text-secondary/20">
                <Quote className="h-12 w-12" />
              </div>
              <CardContent className="pt-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-16 h-16 rounded-full bg-secondary/10 flex items-center justify-center text-2xl font-bold text-secondary">
                    {testimonial.image}
                  </div>
                  <div>
                    <div className="font-bold text-lg">{testimonial.name}</div>
                    {'age' in testimonial && (
                      <div className="text-sm text-muted-foreground">{testimonial.age} years old</div>
                    )}
                    {'relationship' in testimonial && (
                      <div className="text-sm text-muted-foreground">{testimonial.relationship}</div>
                    )}
                  </div>
                </div>

                <div className="flex gap-1 mb-3">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-secondary text-secondary" />
                  ))}
                </div>

                <p className="text-muted-foreground leading-relaxed mb-4 italic">
                  "{testimonial.quote}"
                </p>

                <div className="text-sm text-muted-foreground">
                  📍 {testimonial.location}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-secondary/10">
            <Star className="h-5 w-5 fill-secondary text-secondary" />
            <span className="font-semibold">
              4.9/5 Average Rating from 10,000+ Members
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};
