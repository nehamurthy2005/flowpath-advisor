-- Create career quiz responses table
CREATE TABLE IF NOT EXISTS public.career_quiz_responses (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  education_level TEXT NOT NULL,
  stream TEXT,
  interests TEXT[] NOT NULL,
  work_preference TEXT NOT NULL,
  favorite_subjects TEXT[] NOT NULL,
  learning_style TEXT NOT NULL,
  hardware_software TEXT,
  user_goal TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create AI career recommendations table
CREATE TABLE IF NOT EXISTS public.career_recommendations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  quiz_response_id UUID NOT NULL REFERENCES public.career_quiz_responses(id) ON DELETE CASCADE,
  recommended_domain TEXT NOT NULL,
  confidence_score INTEGER NOT NULL,
  alternative_domains JSONB,
  roadmap JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.career_quiz_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.career_recommendations ENABLE ROW LEVEL SECURITY;

-- Create policies for career_quiz_responses
CREATE POLICY "Users can view their own quiz responses"
ON public.career_quiz_responses
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own quiz responses"
ON public.career_quiz_responses
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own quiz responses"
ON public.career_quiz_responses
FOR UPDATE
USING (auth.uid() = user_id);

-- Create policies for career_recommendations
CREATE POLICY "Users can view their own recommendations"
ON public.career_recommendations
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own recommendations"
ON public.career_recommendations
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX idx_career_quiz_user_id ON public.career_quiz_responses(user_id);
CREATE INDEX idx_career_recommendations_user_id ON public.career_recommendations(user_id);
CREATE INDEX idx_career_recommendations_quiz_id ON public.career_recommendations(quiz_response_id);