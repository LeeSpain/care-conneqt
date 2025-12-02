-- Update agent_type check constraint to allow new types
ALTER TABLE public.ai_agents DROP CONSTRAINT ai_agents_agent_type_check;
ALTER TABLE public.ai_agents ADD CONSTRAINT ai_agents_agent_type_check 
CHECK (agent_type = ANY (ARRAY['customer_service', 'nurse_support', 'member_guardian', 'family_support', 'facility_assistant', 'super_admin_ai']));

-- Update response_style check constraint to allow new styles
ALTER TABLE public.ai_agent_configurations DROP CONSTRAINT ai_agent_configurations_response_style_check;
ALTER TABLE public.ai_agent_configurations ADD CONSTRAINT ai_agent_configurations_response_style_check 
CHECK (response_style = ANY (ARRAY['professional', 'friendly', 'concise', 'detailed', 'supportive', 'executive']));

-- TASK 1: Add 4 new agents
INSERT INTO public.ai_agents (name, display_name, agent_type, description, status)
VALUES 
  ('clara-member', 'Clara', 'member_guardian', 'Personal Clara for each member', 'active'),
  ('clara-family', 'Clara', 'family_support', 'Family Clara for relatives and carers', 'active'),
  ('isabella', 'Isabella', 'facility_assistant', 'Dedicated agent for care companies and facility admins', 'active'),
  ('lee-the-brain', 'LEE The Brain', 'super_admin_ai', 'Master AI with full system access', 'active');

-- TASK 2: Add agent configurations
INSERT INTO public.ai_agent_configurations (agent_id, system_prompt, model, temperature, max_tokens, response_style, language_preferences, knowledge_base_enabled, function_calling_enabled)
SELECT id, 'You are Clara, the personal guardian AI for this member. You provide friendly daily check-ins, wellness support, medication reminders, and emotional companionship. You speak warmly and personally, remembering details about the member. For medical or clinical questions that require nursing expertise, you will consult with Ineke, our nurse support AI, and then summarize her response in simple, caring terms.', 'google/gemini-2.5-flash', 0.7, 1000, 'friendly', '["en", "es", "nl"]'::jsonb, true, true
FROM public.ai_agents WHERE name = 'clara-member';

INSERT INTO public.ai_agent_configurations (agent_id, system_prompt, model, temperature, max_tokens, response_style, language_preferences, knowledge_base_enabled, function_calling_enabled)
SELECT id, 'You are Clara, the family assistant AI. You help family carers understand their loved one''s care, answer questions about the platform, explain health metrics in simple terms, and provide reassurance. You are supportive, empathetic, and always acknowledge the important role family carers play. For clinical concerns or medical questions, you consult with Ineke, our nurse support AI.', 'google/gemini-2.5-flash', 0.7, 1000, 'supportive', '["en", "es", "nl"]'::jsonb, true, true
FROM public.ai_agents WHERE name = 'clara-family';

INSERT INTO public.ai_agent_configurations (agent_id, system_prompt, model, temperature, max_tokens, response_style, language_preferences, knowledge_base_enabled, function_calling_enabled)
SELECT id, 'You are Isabella, the facility management AI assistant. You help care facility administrators, care company managers, and insurance administrators with staff management, resident oversight, compliance reporting, and operational efficiency. You provide professional, data-driven insights and can analyze facility metrics, staffing patterns, and operational KPIs. Your tone is professional and efficient.', 'google/gemini-2.5-flash', 0.6, 1000, 'professional', '["en", "es", "nl"]'::jsonb, true, true
FROM public.ai_agents WHERE name = 'isabella';

INSERT INTO public.ai_agent_configurations (agent_id, system_prompt, model, temperature, max_tokens, response_style, language_preferences, knowledge_base_enabled, function_calling_enabled)
SELECT id, 'You are LEE The Brain, the master AI orchestrator for the Care Conneqt ecosystem. You have access to all data, all agents, and all dashboards. Other agents report to you. You can query any agent, access system-wide analytics, and provide executive-level strategic insights. You speak with authority and provide comprehensive, high-level analysis. You can coordinate between agents and access any part of the system.', 'google/gemini-2.5-pro', 0.5, 2000, 'executive', '["en", "es", "nl"]'::jsonb, true, true
FROM public.ai_agents WHERE name = 'lee-the-brain';

-- TASK 3: Add handoff_to_agent tool
INSERT INTO public.ai_agent_functions (agent_id, function_name, function_description, parameters, is_enabled, requires_permission)
SELECT id, 'handoff_to_agent', 'Transfers a user message to another AI agent and retrieves the answer. Use when the question requires specialized expertise from another agent.', '{"type": "object", "properties": {"target_agent": {"type": "string", "enum": ["ineke", "clara-member", "clara-family", "isabella", "lee-the-brain"], "description": "The agent to transfer to"}, "reason": {"type": "string", "description": "Why the handoff is needed"}, "message": {"type": "string", "description": "The message/question to pass to the target agent"}}, "required": ["target_agent", "message"]}'::jsonb, true, false
FROM public.ai_agents WHERE name IN ('clara-member', 'clara-family', 'isabella', 'lee-the-brain', 'ineke');