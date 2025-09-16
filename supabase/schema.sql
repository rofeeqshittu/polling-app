-- Create the polls table
CREATE TABLE polls (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  user_id UUID REFERENCES auth.users(id)
);

-- Create the options table
CREATE TABLE options (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  poll_id UUID NOT NULL REFERENCES polls(id) ON DELETE CASCADE,
  text TEXT NOT NULL
);

-- Create the votes table
CREATE TABLE votes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  poll_id UUID NOT NULL REFERENCES polls(id) ON DELETE CASCADE,
  option_id UUID NOT NULL REFERENCES options(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable Row Level Security (RLS)
ALTER TABLE polls ENABLE ROW LEVEL SECURITY;
ALTER TABLE options ENABLE ROW LEVEL SECURITY;
ALTER TABLE votes ENABLE ROW LEVEL SECURITY;

-- Create policies for polls table
CREATE POLICY "polls_select" ON polls FOR SELECT USING (TRUE);
CREATE POLICY "polls_insert" ON polls FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "polls_update" ON polls FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "polls_delete" ON polls FOR DELETE USING (auth.uid() = user_id);

-- Create policies for options table
CREATE POLICY "options_select" ON options FOR SELECT USING (TRUE);
CREATE POLICY "options_insert" ON options FOR INSERT WITH CHECK (auth.uid() = (SELECT user_id FROM polls WHERE polls.id = poll_id));
CREATE POLICY "options_update" ON options FOR UPDATE USING (auth.uid() = (SELECT user_id FROM polls WHERE polls.id = poll_id));
CREATE POLICY "options_delete" ON options FOR DELETE USING (auth.uid() = (SELECT user_id FROM polls WHERE polls.id = poll_id));

-- Create policies for votes table
CREATE POLICY "votes_select" ON votes FOR SELECT USING (TRUE);
CREATE POLICY "votes_insert" ON votes FOR INSERT WITH CHECK (auth.uid() = user_id);
-- No update policy for votes
-- No delete policy for votes
