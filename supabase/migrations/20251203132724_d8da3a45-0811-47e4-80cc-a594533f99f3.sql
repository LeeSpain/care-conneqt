-- Create appointments table for scheduling meetings, calls, video conferences
CREATE TABLE public.appointments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  start_time TIMESTAMP WITH TIME ZONE NOT NULL,
  end_time TIMESTAMP WITH TIME ZONE NOT NULL,
  location TEXT,
  appointment_type TEXT NOT NULL DEFAULT 'meeting', -- meeting, call, video
  organizer_id UUID NOT NULL,
  status TEXT NOT NULL DEFAULT 'scheduled', -- scheduled, confirmed, cancelled, completed
  requires_confirmation BOOLEAN DEFAULT true,
  confirmation_deadline TIMESTAMP WITH TIME ZONE,
  created_by_ai BOOLEAN DEFAULT false,
  ai_agent_name TEXT,
  member_id UUID REFERENCES public.members(id),
  facility_id UUID REFERENCES public.facilities(id),
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create appointment participants table
CREATE TABLE public.appointment_participants (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  appointment_id UUID NOT NULL REFERENCES public.appointments(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending', -- pending, confirmed, declined
  notified_at TIMESTAMP WITH TIME ZONE,
  responded_at TIMESTAMP WITH TIME ZONE,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create admin reminders table for personal reminders
CREATE TABLE public.admin_reminders (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  reminder_time TIMESTAMP WITH TIME ZONE NOT NULL,
  is_completed BOOLEAN DEFAULT false,
  completed_at TIMESTAMP WITH TIME ZONE,
  priority TEXT DEFAULT 'normal', -- low, normal, high, urgent
  created_by_ai BOOLEAN DEFAULT false,
  ai_agent_name TEXT,
  related_entity_type TEXT, -- member, lead, facility, etc.
  related_entity_id UUID,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.appointment_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_reminders ENABLE ROW LEVEL SECURITY;

-- Appointments policies
CREATE POLICY "Admins can manage all appointments"
ON public.appointments FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Users can view appointments they organize"
ON public.appointments FOR SELECT
USING (organizer_id = auth.uid());

CREATE POLICY "Users can view appointments they participate in"
ON public.appointments FOR SELECT
USING (EXISTS (
  SELECT 1 FROM public.appointment_participants
  WHERE appointment_participants.appointment_id = appointments.id
  AND appointment_participants.user_id = auth.uid()
));

CREATE POLICY "Users can create appointments"
ON public.appointments FOR INSERT
WITH CHECK (organizer_id = auth.uid() OR has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Organizers can update own appointments"
ON public.appointments FOR UPDATE
USING (organizer_id = auth.uid());

-- Appointment participants policies
CREATE POLICY "Admins can manage all participants"
ON public.appointment_participants FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Users can view their participation"
ON public.appointment_participants FOR SELECT
USING (user_id = auth.uid());

CREATE POLICY "Organizers can view appointment participants"
ON public.appointment_participants FOR SELECT
USING (EXISTS (
  SELECT 1 FROM public.appointments
  WHERE appointments.id = appointment_participants.appointment_id
  AND appointments.organizer_id = auth.uid()
));

CREATE POLICY "Users can update their participation status"
ON public.appointment_participants FOR UPDATE
USING (user_id = auth.uid());

CREATE POLICY "Organizers can add participants"
ON public.appointment_participants FOR INSERT
WITH CHECK (EXISTS (
  SELECT 1 FROM public.appointments
  WHERE appointments.id = appointment_participants.appointment_id
  AND (appointments.organizer_id = auth.uid() OR has_role(auth.uid(), 'admin'::app_role))
));

-- Admin reminders policies
CREATE POLICY "Admins can manage all reminders"
ON public.admin_reminders FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Users can manage own reminders"
ON public.admin_reminders FOR ALL
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

-- Add indexes for performance
CREATE INDEX idx_appointments_organizer ON public.appointments(organizer_id);
CREATE INDEX idx_appointments_start_time ON public.appointments(start_time);
CREATE INDEX idx_appointments_status ON public.appointments(status);
CREATE INDEX idx_appointment_participants_appointment ON public.appointment_participants(appointment_id);
CREATE INDEX idx_appointment_participants_user ON public.appointment_participants(user_id);
CREATE INDEX idx_admin_reminders_user ON public.admin_reminders(user_id);
CREATE INDEX idx_admin_reminders_time ON public.admin_reminders(reminder_time);

-- Add triggers for updated_at
CREATE TRIGGER update_appointments_updated_at
BEFORE UPDATE ON public.appointments
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_admin_reminders_updated_at
BEFORE UPDATE ON public.admin_reminders
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();