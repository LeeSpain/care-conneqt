import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Watch, Radio, Home, Pill, Calendar, Activity, Scale, Thermometer, Shield, Zap, Check } from 'lucide-react';

export default function Devices() {
  const devices = [
    {
      icon: Watch,
      name: 'Vivago Smart Watch',
      tagline: 'Your 24/7 Wellness Guardian',
      description: 'Advanced wrist-worn device with continuous activity monitoring, fall detection, and emergency alerts. FDA-cleared technology trusted by healthcare professionals worldwide.',
      price: 'Included in Base Package or +€19.99/month',
      features: [
        'Automatic fall detection',
        'Heart rate monitoring',
        'Sleep quality tracking',
        'Activity level analysis',
        'Emergency SOS button',
        'Water-resistant (IPX7)',
        '7-day battery life',
        'Cellular connectivity (no phone needed)'
      ],
      specs: {
        'Battery Life': '5-7 days',
        'Water Resistance': 'IPX7 (shower safe)',
        'Connectivity': '4G LTE cellular',
        'Weight': '45g',
        'Certification': 'FDA cleared, CE certified'
      },
      color: 'text-secondary',
      gradient: 'from-secondary/10 to-secondary/5'
    },
    {
      icon: Radio,
      name: 'SOS Pendant',
      tagline: 'Emergency Help at Your Fingertips',
      description: 'Lightweight, discreet emergency alert pendant with GPS location tracking. One-press activation connects you directly to our 24/7 nurse response center.',
      price: 'Alternative Base Device or +€19.99/month',
      features: [
        'One-touch emergency alert',
        'GPS location tracking',
        'Two-way voice communication',
        'Waterproof design',
        'Long battery life (30+ days)',
        'Range: works anywhere with cellular',
        'Multiple wearing options (neck/wrist)',
        'Automatic low battery alerts'
      ],
      specs: {
        'Battery Life': '30+ days',
        'Water Resistance': 'IPX7 (fully waterproof)',
        'Connectivity': '4G LTE cellular',
        'Weight': '35g',
        'Range': 'Nationwide coverage'
      },
      color: 'text-coral',
      gradient: 'from-coral/10 to-coral/5'
    },
    {
      icon: Home,
      name: 'Vivago Domi',
      tagline: 'Smart Home Safety Sensors',
      description: 'Advanced home monitoring system with motion sensors, door sensors, and environmental monitoring. Detects unusual patterns and potential safety issues.',
      price: '+€29.99/month',
      features: [
        'Motion detection sensors',
        'Door/window sensors',
        'Temperature monitoring',
        'Humidity tracking',
        'Activity pattern analysis',
        'Bathroom safety monitoring',
        'Night-time movement alerts',
        'Easy plug-and-play installation'
      ],
      specs: {
        'Sensors Included': '4-6 sensors',
        'Battery Life': '1-2 years (per sensor)',
        'Connectivity': 'WiFi + cellular backup',
        'Range': '100m indoor',
        'Installation': 'Plug & play, no wiring'
      },
      color: 'text-primary',
      gradient: 'from-primary/10 to-primary/5'
    },
    {
      icon: Pill,
      name: 'Dosell Smart Dispenser',
      tagline: 'Never Miss Your Medication',
      description: 'Automated medication management system with timed reminders, dose tracking, and family notifications. Perfect for complex medication schedules.',
      price: '+€34.99/month',
      features: [
        'Automated dose dispensing',
        'Audio & visual reminders',
        'Missed dose alerts to family',
        'Tamper-proof locking',
        '28-day medication storage',
        'Medication history tracking',
        'Pharmacist-friendly design',
        'Backup power supply'
      ],
      specs: {
        'Capacity': '28 days of medication',
        'Dose Times': 'Up to 6 per day',
        'Connectivity': 'WiFi + 4G backup',
        'Power': 'Mains powered + battery backup',
        'Dimensions': '25cm x 20cm x 12cm'
      },
      color: 'text-lilac',
      gradient: 'from-lilac/10 to-lilac/5'
    },
    {
      icon: Calendar,
      name: 'BBrain Calendar Clock',
      tagline: 'Memory Support Made Simple',
      description: 'Large-display digital calendar clock with clear date, time, and appointment reminders. Reduces confusion and supports daily routines for memory challenges.',
      price: '+€19.99/month',
      features: [
        'Extra-large display (10 inch)',
        'Date, time, and day clearly shown',
        'Medication reminders',
        'Appointment alerts',
        'Custom voice messages from family',
        'Photo display capability',
        'Simple, confusion-free interface',
        'Wall-mounted or tabletop'
      ],
      specs: {
        'Display': '10-inch LCD',
        'Connectivity': 'WiFi',
        'Power': 'Mains powered',
        'Dimensions': '26cm x 18cm',
        'Visibility': 'High contrast, anti-glare'
      },
      color: 'text-secondary',
      gradient: 'from-secondary/10 to-secondary/5'
    },
    {
      icon: Activity,
      name: 'Health Monitors',
      tagline: 'Clinical-Grade Vital Signs',
      description: 'Professional health monitoring devices including blood pressure monitors, pulse oximeters, and glucose meters. Automatic sync to your health dashboard.',
      price: '+€14.99/month each',
      features: [
        'Automatic data sync',
        'Clinical accuracy',
        'Irregular heartbeat detection',
        'Trend analysis & alerts',
        'Share data with GP',
        'Multiple user profiles',
        'Large, easy-read displays',
        'Voice-guided measurements'
      ],
      specs: {
        'Accuracy': 'Clinical grade',
        'Connectivity': 'Bluetooth + cellular',
        'Memory': '60-100 readings',
        'Certifications': 'CE medical, FDA listed',
        'Battery': '3-6 months'
      },
      color: 'text-coral',
      gradient: 'from-coral/10 to-coral/5'
    },
    {
      icon: Scale,
      name: 'Smart Weight Scale',
      tagline: 'Complete Body Composition',
      description: 'Advanced body composition scale measuring weight, BMI, body fat, muscle mass, and more. Track trends and receive health insights.',
      price: '+€14.99/month',
      features: [
        'Weight tracking',
        'Body fat percentage',
        'Muscle mass measurement',
        'BMI calculation',
        'Bone density estimation',
        'Water percentage',
        'Automatic user recognition',
        'Trend charts & insights'
      ],
      specs: {
        'Max Weight': '180kg / 400lbs',
        'Accuracy': '±0.1kg',
        'Connectivity': 'WiFi + Bluetooth',
        'Users': 'Up to 8 profiles',
        'Battery': '12 months (AAA x4)'
      },
      color: 'text-primary',
      gradient: 'from-primary/10 to-primary/5'
    },
    {
      icon: Thermometer,
      name: 'Smart Thermometer',
      tagline: 'Instant, Contactless Temperature',
      description: 'Medical-grade infrared thermometer with contactless measurement. Instant readings with fever alerts and automatic health record updates.',
      price: '+€14.99/month',
      features: [
        'Contactless measurement',
        'Instant 1-second reading',
        'Fever alert system',
        'Memory for 30 readings',
        'Adult & child modes',
        'Large LCD display',
        'Silent mode option',
        'Automatic sync to health log'
      ],
      specs: {
        'Accuracy': '±0.2°C',
        'Distance': '1-3cm',
        'Speed': '1 second',
        'Display': 'Backlit LCD',
        'Battery': '6-12 months (AAA x2)'
      },
      color: 'text-lilac',
      gradient: 'from-lilac/10 to-lilac/5'
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Hero Section */}
      <section className="pt-32 pb-20 bg-gradient-to-br from-primary/5 via-background to-secondary/5">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <Badge className="mb-4" variant="secondary">Medical-Grade Technology</Badge>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              Connected Devices for
              <span className="block text-primary mt-2">Complete Peace of Mind</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
              Professional-grade health monitoring devices that seamlessly connect to our AI-powered care platform 
              and 24/7 nurse response center. All devices include free shipping, setup, and replacement.
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-sm">
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-secondary" />
                <span>Medical Grade</span>
              </div>
              <div className="flex items-center gap-2">
                <Zap className="h-4 w-4 text-secondary" />
                <span>Plug & Play Setup</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4 text-secondary" />
                <span>24/7 Tech Support</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Devices Grid */}
      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-16 max-w-7xl mx-auto">
            {devices.map((device, index) => (
              <Card key={device.name} className="overflow-hidden hover:shadow-xl transition-shadow">
                <div className={`bg-gradient-to-br ${device.gradient} p-8`}>
                  <div className="grid lg:grid-cols-2 gap-8 items-start">
                    {/* Left Column */}
                    <div className="space-y-6">
                      <div className="flex items-start gap-4">
                        <div className="h-16 w-16 rounded-2xl bg-background flex items-center justify-center flex-shrink-0">
                          <device.icon className={`h-8 w-8 ${device.color}`} />
                        </div>
                        <div>
                          <h2 className="text-3xl font-bold mb-2">{device.name}</h2>
                          <p className={`text-lg font-medium ${device.color}`}>{device.tagline}</p>
                        </div>
                      </div>

                      <p className="text-base text-muted-foreground leading-relaxed">
                        {device.description}
                      </p>

                      <div className="flex items-baseline gap-2">
                        <span className="text-2xl font-bold text-primary">{device.price}</span>
                      </div>

                      <div className="pt-4">
                        <h3 className="font-semibold mb-3">Key Features:</h3>
                        <div className="grid sm:grid-cols-2 gap-2">
                          {device.features.map((feature, idx) => (
                            <div key={idx} className="flex items-start gap-2">
                              <Check className="h-4 w-4 text-secondary mt-0.5 flex-shrink-0" />
                              <span className="text-sm">{feature}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Right Column - Specs */}
                    <div className="lg:pl-8">
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-lg">Technical Specifications</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          {Object.entries(device.specs).map(([key, value]) => (
                            <div key={key} className="flex justify-between items-start border-b border-border pb-2 last:border-0">
                              <span className="text-sm font-medium text-muted-foreground">{key}:</span>
                              <span className="text-sm font-semibold text-right">{value}</span>
                            </div>
                          ))}
                        </CardContent>
                      </Card>

                      <div className="mt-6 space-y-3">
                        <Button className="w-full bg-secondary hover:bg-secondary/90" asChild>
                          <a href="/auth/signup">Add to Package</a>
                        </Button>
                        <Button variant="outline" className="w-full" asChild>
                          <a href="/personal-care">View Full Plans</a>
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* What's Included Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">What's Included With Every Device</h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5 text-secondary" />
                    Device Protection
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm text-muted-foreground">
                  <p>• Free replacement if damaged or faulty</p>
                  <p>• 24/7 technical support</p>
                  <p>• Automatic firmware updates</p>
                  <p>• Return shipping included</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Zap className="h-5 w-5 text-secondary" />
                    Easy Setup
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm text-muted-foreground">
                  <p>• Pre-configured and ready to use</p>
                  <p>• Free UK delivery (3-5 days)</p>
                  <p>• Setup guide & video tutorials</p>
                  <p>• Live setup assistance available</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="h-5 w-5 text-secondary" />
                    Integration & Monitoring
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm text-muted-foreground">
                  <p>• Automatic sync to health dashboard</p>
                  <p>• AI analysis and alerts</p>
                  <p>• Nurse monitoring 24/7</p>
                  <p>• Family portal access</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Check className="h-5 w-5 text-secondary" />
                    Quality Guarantee
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm text-muted-foreground">
                  <p>• Medical-grade quality</p>
                  <p>• CE certified & FDA cleared</p>
                  <p>• GDPR compliant data handling</p>
                  <p>• Clinically validated accuracy</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="max-w-3xl mx-auto bg-gradient-to-br from-primary/5 to-secondary/5 border-primary/20">
            <CardContent className="p-12 text-center">
              <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
              <p className="text-lg text-muted-foreground mb-8">
                Choose your care package and customize with the devices that matter most to you. 
                All devices include setup, monitoring, and support.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="bg-secondary hover:bg-secondary/90" asChild>
                  <a href="/personal-care">View Care Packages</a>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <a href="/auth/signup">Get Started Now</a>
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
