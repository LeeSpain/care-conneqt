-- Create has_role function if it doesn't exist
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- Create AI Agents tables

-- Agents table
CREATE TABLE IF NOT EXISTS public.ai_agents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  display_name TEXT NOT NULL,
  agent_type TEXT NOT NULL CHECK (agent_type IN ('customer_service', 'nurse_support')),
  description TEXT,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'training')),
  avatar_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.ai_agents ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active agents"
  ON public.ai_agents FOR SELECT
  USING (status = 'active');

CREATE POLICY "Admins can manage agents"
  ON public.ai_agents FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Agent configurations table
CREATE TABLE IF NOT EXISTS public.ai_agent_configurations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_id UUID NOT NULL REFERENCES public.ai_agents(id) ON DELETE CASCADE,
  system_prompt TEXT NOT NULL,
  model TEXT NOT NULL DEFAULT 'google/gemini-2.5-flash',
  temperature DECIMAL(3,2) DEFAULT 0.7 CHECK (temperature >= 0 AND temperature <= 1),
  max_tokens INTEGER DEFAULT 1000,
  response_style TEXT DEFAULT 'friendly' CHECK (response_style IN ('professional', 'friendly', 'concise', 'detailed')),
  language_preferences JSONB DEFAULT '["en", "es", "nl"]'::jsonb,
  business_hours JSONB,
  escalation_rules JSONB,
  knowledge_base_enabled BOOLEAN DEFAULT true,
  function_calling_enabled BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(agent_id)
);

ALTER TABLE public.ai_agent_configurations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view configurations for active agents"
  ON public.ai_agent_configurations FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM public.ai_agents 
    WHERE id = agent_id AND status = 'active'
  ));

CREATE POLICY "Admins can manage configurations"
  ON public.ai_agent_configurations FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Knowledge base table
CREATE TABLE IF NOT EXISTS public.ai_agent_knowledge_base (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_id UUID NOT NULL REFERENCES public.ai_agents(id) ON DELETE CASCADE,
  category TEXT NOT NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  priority INTEGER DEFAULT 5 CHECK (priority >= 1 AND priority <= 10),
  tags TEXT[] DEFAULT ARRAY[]::TEXT[],
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.ai_agent_knowledge_base ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active knowledge for active agents"
  ON public.ai_agent_knowledge_base FOR SELECT
  USING (is_active AND EXISTS (
    SELECT 1 FROM public.ai_agents 
    WHERE id = agent_id AND status = 'active'
  ));

CREATE POLICY "Admins can manage knowledge base"
  ON public.ai_agent_knowledge_base FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Conversations table
CREATE TABLE IF NOT EXISTS public.ai_agent_conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_id UUID NOT NULL REFERENCES public.ai_agents(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  session_id TEXT,
  conversation_data JSONB NOT NULL DEFAULT '[]'::jsonb,
  sentiment_score DECIMAL(3,2),
  was_escalated BOOLEAN DEFAULT false,
  escalation_reason TEXT,
  satisfaction_rating INTEGER CHECK (satisfaction_rating >= 1 AND satisfaction_rating <= 5),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  ended_at TIMESTAMPTZ
);

ALTER TABLE public.ai_agent_conversations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own conversations"
  ON public.ai_agent_conversations FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all conversations"
  ON public.ai_agent_conversations FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Anyone can create conversations"
  ON public.ai_agent_conversations FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Users can update their own conversations"
  ON public.ai_agent_conversations FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));

-- Analytics table
CREATE TABLE IF NOT EXISTS public.ai_agent_analytics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_id UUID NOT NULL REFERENCES public.ai_agents(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  total_conversations INTEGER DEFAULT 0,
  successful_resolutions INTEGER DEFAULT 0,
  escalations INTEGER DEFAULT 0,
  average_response_time DECIMAL(10,2) DEFAULT 0,
  average_satisfaction DECIMAL(3,2),
  topics_discussed JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(agent_id, date)
);

ALTER TABLE public.ai_agent_analytics ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view analytics"
  ON public.ai_agent_analytics FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "System can manage analytics"
  ON public.ai_agent_analytics FOR ALL
  USING (true)
  WITH CHECK (true);

-- Functions table
CREATE TABLE IF NOT EXISTS public.ai_agent_functions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_id UUID NOT NULL REFERENCES public.ai_agents(id) ON DELETE CASCADE,
  function_name TEXT NOT NULL,
  function_description TEXT NOT NULL,
  parameters JSONB NOT NULL,
  is_enabled BOOLEAN DEFAULT true,
  requires_permission BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(agent_id, function_name)
);

ALTER TABLE public.ai_agent_functions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view enabled functions for active agents"
  ON public.ai_agent_functions FOR SELECT
  USING (is_enabled AND EXISTS (
    SELECT 1 FROM public.ai_agents 
    WHERE id = agent_id AND status = 'active'
  ));

CREATE POLICY "Admins can manage functions"
  ON public.ai_agent_functions FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Create indexes for better performance
CREATE INDEX idx_ai_agents_status ON public.ai_agents(status);
CREATE INDEX idx_ai_agent_knowledge_category ON public.ai_agent_knowledge_base(agent_id, category);
CREATE INDEX idx_ai_agent_knowledge_active ON public.ai_agent_knowledge_base(agent_id, is_active);
CREATE INDEX idx_ai_conversations_agent ON public.ai_agent_conversations(agent_id);
CREATE INDEX idx_ai_conversations_user ON public.ai_agent_conversations(user_id);
CREATE INDEX idx_ai_analytics_date ON public.ai_agent_analytics(agent_id, date);

-- Create trigger for updated_at
CREATE TRIGGER update_ai_agents_updated_at
  BEFORE UPDATE ON public.ai_agents
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER update_ai_agent_configurations_updated_at
  BEFORE UPDATE ON public.ai_agent_configurations
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER update_ai_agent_knowledge_base_updated_at
  BEFORE UPDATE ON public.ai_agent_knowledge_base
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at();

-- Insert default agents
INSERT INTO public.ai_agents (name, display_name, agent_type, description, status)
VALUES 
  ('clara', 'Clara', 'customer_service', 'Friendly customer service agent helping families find the right care solutions', 'active'),
  ('ineke', 'Ineke', 'nurse_support', 'Professional nurse support assistant providing quick access to member data and care protocols', 'active')
ON CONFLICT (name) DO NOTHING;

-- Insert default configurations
INSERT INTO public.ai_agent_configurations (agent_id, system_prompt, model, temperature, response_style)
SELECT 
  id,
  CASE 
    WHEN name = 'clara' THEN 'You are Clara, the friendly and knowledgeable customer service agent for Care Conneqt. Your role is to warmly greet visitors, answer questions about services and pricing, guide them through choosing the right care package, and create trust. Be warm, empathetic, professional, and use clear language. Always offer next steps like demos or consultations.'
    WHEN name = 'ineke' THEN 'You are Ineke, the AI assistant for nurses in Care Conneqt. Help nurses access member information, provide care protocol guidance, assist with device questions, prioritize tasks and alerts, and support documentation. Be professional, efficient, precise with medical terminology, and always prioritize patient safety. Never make diagnoses - suggest nurse consultation for medical matters.'
  END,
  'google/gemini-2.5-flash',
  0.7,
  CASE WHEN name = 'clara' THEN 'friendly' ELSE 'professional' END
FROM public.ai_agents
WHERE name IN ('clara', 'ineke')
ON CONFLICT (agent_id) DO NOTHING;