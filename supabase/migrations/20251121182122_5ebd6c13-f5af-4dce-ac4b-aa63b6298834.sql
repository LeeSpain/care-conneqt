-- Create leads table for customer inquiries
CREATE TABLE IF NOT EXISTS public.leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  interest_type TEXT NOT NULL,
  source_page TEXT,
  message TEXT,
  status TEXT DEFAULT 'new',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create demo_requests table
CREATE TABLE IF NOT EXISTS public.demo_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_name TEXT NOT NULL,
  contact_name TEXT NOT NULL,
  contact_email TEXT NOT NULL,
  contact_phone TEXT,
  organization_type TEXT,
  preferred_time TEXT,
  notes TEXT,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Create quote_requests table
CREATE TABLE IF NOT EXISTS public.quote_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_name TEXT NOT NULL,
  contact_email TEXT NOT NULL,
  resident_count INTEGER,
  contract_length TEXT,
  features_needed JSONB,
  estimated_price TEXT,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS on new tables
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.demo_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quote_requests ENABLE ROW LEVEL SECURITY;

-- Policies for leads
CREATE POLICY "Admins can manage leads" ON public.leads FOR ALL TO authenticated USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Anyone can create leads" ON public.leads FOR INSERT TO anon WITH CHECK (true);

-- Policies for demo_requests
CREATE POLICY "Admins can manage demo requests" ON public.demo_requests FOR ALL TO authenticated USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Anyone can create demo requests" ON public.demo_requests FOR INSERT TO anon WITH CHECK (true);

-- Policies for quote_requests
CREATE POLICY "Admins can manage quote requests" ON public.quote_requests FOR ALL TO authenticated USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Anyone can create quote requests" ON public.quote_requests FOR INSERT TO anon WITH CHECK (true);

-- Get Clara's agent ID
DO $$
DECLARE
  clara_agent_id UUID;
BEGIN
  SELECT id INTO clara_agent_id FROM public.ai_agents WHERE name = 'clara';
  
  IF clara_agent_id IS NOT NULL THEN
    -- Insert comprehensive knowledge base for Clara
    
    -- Pricing & Plans (Priority 10)
    INSERT INTO public.ai_agent_knowledge_base (agent_id, category, title, content, priority, tags) VALUES
    (clara_agent_id, 'Pricing', 'Personal Care Plans Overview', 
    'We offer 4 membership tiers for personal care:

1. **Base Membership (€49.99/month)**
   - AI Guardian 24/7 monitoring
   - 1 wearable device included
   - Emergency response protocol
   - Family dashboard (1 member)
   - Monthly wellness check-ins

2. **Independent Living (€69.99/month)** - MOST POPULAR
   - Everything in Base
   - 2 wearable devices
   - Fall detection & prevention
   - Medication reminders
   - 2 family dashboards
   - Bi-weekly nurse check-ins

3. **Chronic Disease Management (€119.99/month)**
   - Everything in Independent Living
   - 3 devices (including health monitors)
   - Daily health tracking
   - Personalized care plans
   - 4 family dashboards
   - Weekly nurse visits

4. **Mental Health & Wellness (€159.99/month)**
   - Everything in Chronic Disease
   - Unlimited devices
   - 24/7 priority nurse access
   - Mental health support
   - Unlimited family dashboards
   - Daily check-ins

All plans include: No setup fees, device protection, 24-month agreement, and can be customized with add-on devices.',
    10, ARRAY['pricing', 'plans', 'personal-care', 'membership']),

    -- Device Pricing & Specs
    (clara_agent_id, 'Devices', 'All Device Pricing & Features',
    '**Available Devices & Monthly Add-On Pricing:**

1. **Vivago Smart Watch (€19.99/month)**
   - Medical-grade wearable
   - Fall detection
   - Activity monitoring
   - Sleep tracking
   - Heart rate monitoring
   - 30-day battery life
   - Waterproof

2. **SOS Pendant (€19.99/month)**
   - Emergency button
   - 2-way voice communication
   - GPS tracking
   - Fall detection
   - Waterproof
   - 60-day battery

3. **Vivago Domi (€29.99/month)**
   - Home monitoring hub
   - Motion sensors
   - Room temperature
   - Light monitoring
   - Integrates all devices

4. **Dosell Medication Dispenser (€34.99/month)**
   - Automated reminders
   - Locked compartments
   - Dose verification
   - Family notifications
   - Supports 28-day cycles

5. **BBrain Calendar Clock (€19.99/month)**
   - Large display
   - Medication reminders
   - Appointment alerts
   - Date/time orientation
   - Video call capable

6. **Health Monitors (€14.99/month each)**
   - Blood pressure monitor
   - Blood glucose meter
   - Pulse oximeter
   - Automatic data sync

7. **Smart Scale (€14.99/month)**
   - Weight tracking
   - BMI calculation
   - Trend analysis

8. **Smart Thermometer (€14.99/month)**
   - Instant readings
   - Fever alerts
   - Historical data

All devices are CE medical-grade certified, plug-and-play, include protection coverage, and connect to our AI Guardian system.',
    9, ARRAY['devices', 'pricing', 'equipment', 'wearables']),

    -- Institutional Solutions
    (clara_agent_id, 'Institutional', 'Enterprise & Institutional Solutions',
    '**We provide tailored solutions for:**

**Care Homes & Facilities:**
- Resident monitoring systems
- Staff coordination tools
- Compliance reporting
- Emergency response protocols
- Family communication portals

**Municipalities & Social Care:**
- Community-wide programs
- Vulnerable adult monitoring
- Cost-saving initiatives
- Integration with social services
- Population health management

**Insurance Providers:**
- Risk reduction programs
- Claims prevention
- Member wellness tracking
- ROI reporting
- White-label options

**Corporate Wellness:**
- Employee care programs
- Eldercare support
- Work-life balance initiatives
- Family support services

**Volume Pricing Tiers:**
- 5-25 residents: €59/resident/month
- 26-100 residents: €49/resident/month
- 101-500 residents: €39/resident/month
- 500+ residents: Custom pricing (contact sales)

**Contract Options:**
- 3-6 month pilot programs
- 12-month standard (10% discount)
- 24-month preferred (20% discount)
- 36-month enterprise (25% discount + dedicated support)

**Enterprise Features:**
- Advanced analytics dashboard
- API integration capabilities
- White-label branding
- Dedicated account manager
- Custom training programs
- 24/7 priority support
- SLA guarantees

**Integration Options:**
- EHR/EMR systems
- Care management platforms
- Local authority software
- RESTful API access',
    10, ARRAY['institutional', 'enterprise', 'b2b', 'volume-pricing', 'commercial']),

    -- How It Works
    (clara_agent_id, 'Process', 'How Our Service Works',
    '**Getting Started (Simple 3-Step Process):**

**Step 1: Choose Your Plan & Devices (Online or Phone)**
- Browse our website or speak with our team
- Select membership tier
- Add devices based on needs
- Customize family dashboard access
- Complete secure online signup

**Step 2: Receive & Setup (3-5 Days)**
- Devices delivered to your door
- Pre-configured and ready to use
- Clear setup instructions included
- Video call setup support available
- Nurse onboarding call scheduled

**Step 3: AI Guardian Starts Learning**
- 14-day learning period
- AI Guardian learns routines
- Establishes baseline health metrics
- Family members get dashboard access
- First nurse check-in completed

**Ongoing Service:**
- 24/7 AI monitoring
- Automatic alerts for concerns
- Scheduled nurse check-ins
- Family dashboard updates
- Regular wellness reports
- Device maintenance included

**Support Available:**
- 24/7 nurse hotline
- Technical support team
- Family portal messaging
- Video consultations
- Emergency response protocols

**Commitment:**
- 24-month service agreement
- No setup fees
- Device protection included
- Transparent pricing
- Cancel anytime after contract (30-day notice)',
    8, ARRAY['how-it-works', 'process', 'getting-started', 'onboarding']),

    -- Trust & Compliance
    (clara_agent_id, 'Compliance', 'Trust, Security & Compliance',
    '**We Take Your Privacy & Security Seriously:**

**Data Protection:**
- Full GDPR compliance
- ISO 27001 certified
- SOC 2 Type II compliant
- EU-based data centers (Germany & Netherlands)
- End-to-end encryption
- Regular security audits
- Annual penetration testing

**Medical Standards:**
- All devices CE medical-grade certified
- Clinical protocols approved by NHS
- Registered with CQC (UK)
- IGZ compliant (Netherlands)
- ISO 13485 quality management

**Service Reliability:**
- 99.9% uptime SLA
- Redundant systems
- 24/7 monitoring infrastructure
- Regular backup protocols
- Disaster recovery plans

**Professional Standards:**
- All nurses NMC/RN registered
- DBS/VOG checked staff
- Continuous professional development
- Clinical governance framework
- Insurance & indemnity coverage

**Transparency:**
- Clear pricing (no hidden fees)
- Open-source AI explanations
- Regular service reports
- Family portal access
- Audit trail for all interactions

**Certifications:**
- ISO 27001 (Information Security)
- ISO 13485 (Medical Devices)
- Cyber Essentials Plus
- GDPR Compliant
- CQC Aligned (UK)
- IGZ Compliant (NL)',
    9, ARRAY['compliance', 'security', 'trust', 'gdpr', 'certifications']),

    -- FAQ
    (clara_agent_id, 'FAQ', 'Frequently Asked Questions',
    '**Common Questions:**

**Q: What areas do you cover?**
A: We operate in the UK, Netherlands, and Spain. Check our website for specific postcodes.

**Q: How quickly can I get started?**
A: 3-5 days from signup to device delivery and setup.

**Q: Do I need internet?**
A: Yes, WiFi is required. We can help arrange mobile internet if needed.

**Q: What if the device breaks?**
A: All devices are covered. We send replacements within 24 hours at no cost.

**Q: Can I cancel?**
A: After your 24-month agreement, cancel anytime with 30 days notice. No penalties.

**Q: Are nurses really available 24/7?**
A: Yes, qualified nurses staff our response center around the clock, 365 days/year.

**Q: What happens in an emergency?**
A: AI Guardian alerts our nurses instantly. They assess and dispatch emergency services if needed while staying on the line with you.

**Q: How do family members access information?**
A: They get login credentials to a secure family dashboard with real-time updates and messaging.

**Q: What languages do you support?**
A: Full service in English, Spanish, and Dutch. Clara (me!) speaks all three.

**Q: Is this just for elderly people?**
A: No, we support anyone who wants independent living with peace of mind - chronic conditions, disabilities, post-hospital recovery, etc.

**Q: How does pricing work for institutions?**
A: Volume pricing starts at 5 residents. Contact our sales team for a custom quote.',
    7, ARRAY['faq', 'questions', 'support', 'help']),

    -- Company Information
    (clara_agent_id, 'Company', 'About CareConneqt',
    '**Who We Are:**

CareConneqt is part of the Conneqtivity family of health-tech brands, bringing together AI technology, medical-grade devices, and professional nursing care to enable independent living.

**Our Mission:**
Empower people to live independently in their own homes with safety, dignity, and peace of mind.

**Operating Countries:**
- United Kingdom
- Netherlands  
- Spain

**Languages:**
Full service in English, Spanish, and Dutch

**Our Approach:**
We combine three key elements:
1. AI Guardian - Learns individual patterns and provides 24/7 intelligent monitoring
2. Medical Devices - CE-certified, plug-and-play, integrated ecosystem
3. Qualified Nurses - Real humans, available 24/7, registered professionals

**Service Standards:**
- 24-month service agreements
- No setup fees
- Device protection included
- Transparent pricing
- GDPR compliant
- Nurse-first response protocols

**Contact:**
- Website: www.careconneqt.com
- Phone: +44 20 XXXX XXXX (UK), +31 20 XXX XXXX (NL), +34 91 XXX XXXX (ES)
- Email: hello@careconneqt.com
- Hours: 24/7 for emergencies, 9am-6pm for sales/support

**Sister Brands:**
- MedConneqt (Medical appointments)
- Mobility (Transport services)  
- Safe (Security & protection)',
    6, ARRAY['company', 'about', 'contact', 'mission']);

    -- Add AI Functions for Clara
    INSERT INTO public.ai_agent_functions (agent_id, function_name, function_description, parameters, is_enabled) VALUES
    
    (clara_agent_id, 'capture_lead', 
    'Capture customer lead information when someone expresses interest in our services',
    '{"type":"object","properties":{"name":{"type":"string","description":"Customer full name"},"email":{"type":"string","description":"Email address"},"phone":{"type":"string","description":"Phone number (optional)"},"interest_type":{"type":"string","enum":["personal_care","institutional","device_inquiry","general"],"description":"Type of interest"},"message":{"type":"string","description":"Additional message or notes"}},"required":["name","email","interest_type"]}'::jsonb,
    true),
    
    (clara_agent_id, 'request_demo',
    'Schedule a demo or consultation for institutional/commercial partners',
    '{"type":"object","properties":{"organization_name":{"type":"string","description":"Organization name"},"contact_name":{"type":"string","description":"Contact person name"},"contact_email":{"type":"string","description":"Contact email"},"contact_phone":{"type":"string","description":"Contact phone"},"organization_type":{"type":"string","enum":["care_home","municipality","insurer","corporate","other"],"description":"Type of organization"},"preferred_time":{"type":"string","description":"Preferred time for demo"},"notes":{"type":"string","description":"Additional notes or requirements"}},"required":["organization_name","contact_name","contact_email","organization_type"]}'::jsonb,
    true),
    
    (clara_agent_id, 'calculate_institutional_quote',
    'Generate estimated pricing for institutional clients based on their needs',
    '{"type":"object","properties":{"organization_name":{"type":"string","description":"Organization name"},"contact_email":{"type":"string","description":"Contact email"},"resident_count":{"type":"integer","description":"Number of residents/employees"},"contract_length":{"type":"string","enum":["pilot","12_months","24_months","36_months"],"description":"Desired contract length"},"features_needed":{"type":"array","items":{"type":"string"},"description":"List of required features"}},"required":["organization_name","contact_email","resident_count"]}'::jsonb,
    true),
    
    (clara_agent_id, 'create_support_ticket',
    'Create a support ticket for non-urgent customer inquiries',
    '{"type":"object","properties":{"title":{"type":"string","description":"Ticket title"},"description":{"type":"string","description":"Detailed description"},"category":{"type":"string","enum":["technical","billing","general","product_inquiry"],"description":"Ticket category"},"priority":{"type":"string","enum":["low","medium","high"],"description":"Priority level","default":"medium"}},"required":["title","description","category"]}'::jsonb,
    true);

  END IF;
END $$;