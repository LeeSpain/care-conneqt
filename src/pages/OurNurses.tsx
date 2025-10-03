import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { Card, CardContent, CardDescription, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Heart, Shield, Clock, Award, CheckCircle, Phone, Users } from 'lucide-react';
import nursesHero from '@/assets/nurses-hero.jpg';
import nurseSarah from '@/assets/nurse-sarah.jpg';
import nurseJames from '@/assets/nurse-james.jpg';
import nurseMaria from '@/assets/nurse-maria.jpg';
import nurseDavid from '@/assets/nurse-david.jpg';
import nurseEmma from '@/assets/nurse-emma.jpg';
import nurseAisha from '@/assets/nurse-aisha.jpg';

export default function OurNurses() {
  const nurses = [
    {
      name: 'Sarah Thompson',
      title: 'Lead Clinical Nurse',
      credentials: 'RGN, BSc (Hons)',
      experience: '15+ years',
      specialties: ['Emergency Care', 'Geriatric Nursing', 'Cardiac Care'],
      bio: 'Sarah leads our clinical team with extensive experience in emergency medicine and elderly care. She ensures our response protocols meet the highest clinical standards.',
      image: nurseSarah
    },
    {
      name: 'James Mitchell',
      title: 'Senior Nurse Specialist',
      credentials: 'RGN, MSc',
      experience: '12+ years',
      specialties: ['Diabetes Management', 'Chronic Disease', 'Health Education'],
      bio: 'James specializes in chronic disease management and brings deep expertise in supporting patients with complex health needs at home.',
      image: nurseJames
    },
    {
      name: 'Maria Garcia',
      title: 'Clinical Nurse Manager',
      credentials: 'RGN, Advanced Diploma',
      experience: '18+ years',
      specialties: ['Palliative Care', 'Mental Health', 'Family Support'],
      bio: 'Maria oversees quality assurance and staff training, ensuring compassionate, person-centered care for all our members and their families.',
      image: nurseMaria
    },
    {
      name: 'David Chen',
      title: 'Technology Integration Nurse',
      credentials: 'RGN, Health Informatics',
      experience: '10+ years',
      specialties: ['Remote Monitoring', 'Digital Health', 'Care Innovation'],
      bio: 'David bridges healthcare and technology, ensuring our AI systems and devices deliver accurate, clinically relevant insights.',
      image: nurseDavid
    },
    {
      name: 'Emma Williams',
      title: 'Night Shift Coordinator',
      credentials: 'RGN, Critical Care',
      experience: '14+ years',
      specialties: ['Overnight Care', 'Crisis Response', 'Sleep Disorders'],
      bio: 'Emma leads our 24/7 night team, providing expert care and rapid response when it matters most.',
      image: nurseEmma
    },
    {
      name: 'Aisha Patel',
      title: 'Community Nurse Liaison',
      credentials: 'RGN, Community Health',
      experience: '11+ years',
      specialties: ['Home Care', 'Fall Prevention', 'Medication Management'],
      bio: 'Aisha coordinates with GPs, families, and social services to ensure seamless, integrated care for our members.',
      image: nurseAisha
    }
  ];

  const certifications = [
    { name: 'Registered General Nurses (RGN)', icon: Shield },
    { name: 'Advanced Life Support (ALS)', icon: Heart },
    { name: 'Safeguarding Trained', icon: Shield },
    { name: 'Mental Health First Aid', icon: Heart },
    { name: 'Dementia Care Specialists', icon: Users },
    { name: 'Ongoing Professional Development', icon: Award }
  ];

  const stats = [
    { value: '24/7', label: 'Nurse Coverage', icon: Clock },
    { value: '50+', label: 'Clinical Staff', icon: Users },
    { value: '200+', label: 'Years Combined Experience', icon: Award },
    { value: '<60s', label: 'Average Response Time', icon: Phone }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Hero Section */}
      <section className="pt-32 pb-20 bg-gradient-to-br from-secondary/5 via-background to-primary/5">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="text-center lg:text-left">
                <Badge className="mb-4" variant="secondary">
                  <Heart className="h-3 w-3 mr-1" />
                  Professional Care Team
                </Badge>
                <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
                  Meet Our
                  <span className="block text-secondary mt-2">Experienced Nurses</span>
                </h1>
                <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
                  Our team of qualified, registered nurses brings decades of clinical experience to provide 
                  you with expert care, guidance, and rapid response 24 hours a day, 365 days a year.
                </p>
              </div>
              <div className="relative">
                <img 
                  src={nursesHero} 
                  alt="Professional nursing team" 
                  className="rounded-2xl shadow-2xl w-full h-auto"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-5xl mx-auto">
            {stats.map((stat, index) => (
              <Card key={index}>
                <CardContent className="pt-6 text-center">
                  <stat.icon className="h-8 w-8 text-secondary mx-auto mb-3" />
                  <div className="text-3xl font-bold text-primary mb-1">{stat.value}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Why Our Nurses Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
              Why Our Nursing Team is Different
            </h2>
            
            <div className="grid md:grid-cols-2 gap-6 mb-12">
              <Card className="border-secondary/20">
                <CardHeader>
                  <div className="h-12 w-12 rounded-lg bg-secondary/10 flex items-center justify-center mb-3">
                    <Shield className="h-6 w-6 text-secondary" />
                  </div>
                  <h3 className="text-xl font-bold">Registered & Qualified</h3>
                  <CardDescription>
                    Every member of our nursing team is a fully qualified Registered General Nurse (RGN) 
                    with current NMC registration and ongoing professional development.
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card className="border-secondary/20">
                <CardHeader>
                  <div className="h-12 w-12 rounded-lg bg-secondary/10 flex items-center justify-center mb-3">
                    <Heart className="h-6 w-6 text-secondary" />
                  </div>
                  <h3 className="text-xl font-bold">Specialist Training</h3>
                  <CardDescription>
                    Our nurses are trained in elderly care, remote monitoring, emergency response, 
                    and using AI health insights to provide proactive, preventive care.
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card className="border-secondary/20">
                <CardHeader>
                  <div className="h-12 w-12 rounded-lg bg-secondary/10 flex items-center justify-center mb-3">
                    <Clock className="h-6 w-6 text-secondary" />
                  </div>
                  <h3 className="text-xl font-bold">Always Available</h3>
                  <CardDescription>
                    Our nursing team operates 24/7/365 with dedicated day and night shifts. You're never 
                    alone - expert help is always just a button press away.
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card className="border-secondary/20">
                <CardHeader>
                  <div className="h-12 w-12 rounded-lg bg-secondary/10 flex items-center justify-center mb-3">
                    <Users className="h-6 w-6 text-secondary" />
                  </div>
                  <h3 className="text-xl font-bold">Person-Centered Care</h3>
                  <CardDescription>
                    We get to know you, your preferences, and your health history. Our nurses provide 
                    personalized guidance tailored to your unique needs.
                  </CardDescription>
                </CardHeader>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Meet the Team */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
              Meet Some of Our Senior Nurses
            </h2>
            <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
              Our clinical leadership team brings together decades of nursing experience across 
              emergency care, geriatrics, chronic disease management, and digital health.
            </p>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {nurses.map((nurse, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <img 
                      src={nurse.image} 
                      alt={nurse.name}
                      className="w-full h-48 object-cover rounded-lg mb-4"
                    />
                    <h3 className="text-xl font-bold">{nurse.name}</h3>
                    <p className="text-secondary font-semibold">{nurse.title}</p>
                    <p className="text-sm text-muted-foreground">{nurse.credentials}</p>
                    <Badge variant="outline" className="w-fit mt-2">{nurse.experience}</Badge>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm text-muted-foreground">{nurse.bio}</p>
                    <div>
                      <p className="text-xs font-semibold mb-2">Specialties:</p>
                      <div className="flex flex-wrap gap-1">
                        {nurse.specialties.map((specialty, idx) => (
                          <Badge key={idx} variant="secondary" className="text-xs">
                            {specialty}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <p className="text-center text-sm text-muted-foreground mt-8">
              Plus 40+ additional registered nurses providing 24/7 coverage across our care network
            </p>
          </div>
        </div>
      </section>

      {/* Certifications */}
      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">
              Qualifications & Certifications
            </h2>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {certifications.map((cert, index) => (
                <Card key={index}>
                  <CardContent className="pt-6 flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-secondary/10 flex items-center justify-center flex-shrink-0">
                      <cert.icon className="h-5 w-5 text-secondary" />
                    </div>
                    <span className="font-medium text-sm">{cert.name}</span>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">
              How Our Nurses Support You
            </h2>

            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <div className="flex items-start gap-4">
                    <div className="h-10 w-10 rounded-full bg-secondary text-white flex items-center justify-center flex-shrink-0 font-bold">
                      1
                    </div>
                    <div>
                      <h3 className="text-lg font-bold mb-2">AI-Assisted Monitoring</h3>
                      <p className="text-sm text-muted-foreground">
                        Our nurses are alerted by AI when your device data shows concerning patterns - 
                        they review, assess, and reach out proactively before small issues become emergencies.
                      </p>
                    </div>
                  </div>
                </CardHeader>
              </Card>

              <Card>
                <CardHeader>
                  <div className="flex items-start gap-4">
                    <div className="h-10 w-10 rounded-full bg-secondary text-white flex items-center justify-center flex-shrink-0 font-bold">
                      2
                    </div>
                    <div>
                      <h3 className="text-lg font-bold mb-2">Emergency Response</h3>
                      <p className="text-sm text-muted-foreground">
                        When you press your SOS button, a nurse answers within seconds, assesses your situation, 
                        provides guidance, and dispatches help if needed - all while staying on the line with you.
                      </p>
                    </div>
                  </div>
                </CardHeader>
              </Card>

              <Card>
                <CardHeader>
                  <div className="flex items-start gap-4">
                    <div className="h-10 w-10 rounded-full bg-secondary text-white flex items-center justify-center flex-shrink-0 font-bold">
                      3
                    </div>
                    <div>
                      <h3 className="text-lg font-bold mb-2">Health Guidance</h3>
                      <p className="text-sm text-muted-foreground">
                        Call anytime for health questions, medication queries, or advice. Our nurses provide 
                        evidence-based guidance and coordinate with your GP when needed.
                      </p>
                    </div>
                  </div>
                </CardHeader>
              </Card>

              <Card>
                <CardHeader>
                  <div className="flex items-start gap-4">
                    <div className="h-10 w-10 rounded-full bg-secondary text-white flex items-center justify-center flex-shrink-0 font-bold">
                      4
                    </div>
                    <div>
                      <h3 className="text-lg font-bold mb-2">Family Communication</h3>
                      <p className="text-sm text-muted-foreground">
                        With your permission, our nurses keep family members informed, provide updates after 
                        incidents, and coordinate care plans with your loved ones.
                      </p>
                    </div>
                  </div>
                </CardHeader>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="max-w-3xl mx-auto bg-gradient-to-br from-secondary/5 to-primary/5 border-secondary/20">
            <CardContent className="p-12 text-center">
              <Heart className="h-12 w-12 text-secondary mx-auto mb-4" />
              <h2 className="text-3xl font-bold mb-4">Experience Expert Nursing Care</h2>
              <p className="text-lg text-muted-foreground mb-8">
                Join thousands of families who trust our experienced nursing team for peace of mind, 
                24/7 support, and proactive health monitoring.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="bg-secondary hover:bg-secondary/90" asChild>
                  <a href="/personal-care">View Care Packages</a>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <a href="/auth/signup">Get Started Today</a>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      <Footer />
    </div>
  );
}
