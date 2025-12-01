-- Create user_career_selections table to store user's selected career
CREATE TABLE IF NOT EXISTS public.user_career_selections (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL,
  recommendation_id uuid NOT NULL REFERENCES public.career_recommendations(id) ON DELETE CASCADE,
  selected_domain text NOT NULL,
  selected_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE(user_id)
);

-- Enable RLS
ALTER TABLE public.user_career_selections ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view their own career selection"
  ON public.user_career_selections
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own career selection"
  ON public.user_career_selections
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own career selection"
  ON public.user_career_selections
  FOR UPDATE
  USING (auth.uid() = user_id);

-- Create index for faster lookups
CREATE INDEX idx_user_career_selections_user_id ON public.user_career_selections(user_id);