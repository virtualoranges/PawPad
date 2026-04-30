-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- User profiles (extends auth.users)
create table public.profiles (
  id uuid references auth.users(id) on delete cascade primary key,
  email text,
  full_name text,
  avatar_url text,
  phone text,
  address text,
  city text,
  state text,
  zip text,
  telegram_id text,
  created_at timestamptz default now()
);

-- Pet profiles
create table public.pets (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade,
  name text not null,
  species text check (species in ('dog', 'cat')) not null,
  breed text,
  birth_date date,
  weight_kg numeric(5,2),
  gender text check (gender in ('male', 'female')),
  color text,
  microchip_id text,
  photo_url text,
  notes text,
  is_primary boolean default false,
  created_at timestamptz default now()
);

-- QR Tags (100 pre-seeded)
create table public.qr_tags (
  id uuid default uuid_generate_v4() primary key,
  tag_code text unique not null,
  pet_id uuid references public.pets(id) on delete set null,
  user_id uuid references public.profiles(id) on delete set null,
  claimed_at timestamptz,
  is_active boolean default true,
  created_at timestamptz default now()
);

-- Vet info
create table public.vet_info (
  id uuid default uuid_generate_v4() primary key,
  pet_id uuid references public.pets(id) on delete cascade,
  vet_name text,
  clinic_name text,
  phone text,
  address text,
  email text,
  notes text,
  created_at timestamptz default now()
);

-- Emergency contacts
create table public.emergency_contacts (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade,
  name text not null,
  relationship text,
  phone text not null,
  email text,
  created_at timestamptz default now()
);

-- Vaccinations
create table public.vaccinations (
  id uuid default uuid_generate_v4() primary key,
  pet_id uuid references public.pets(id) on delete cascade,
  vaccine_name text not null,
  date_given date,
  next_due_date date,
  vet_name text,
  notes text,
  created_at timestamptz default now()
);

-- Medications
create table public.medications (
  id uuid default uuid_generate_v4() primary key,
  pet_id uuid references public.pets(id) on delete cascade,
  name text not null,
  dosage text,
  frequency text,
  start_date date,
  end_date date,
  is_active boolean default true,
  notes text,
  created_at timestamptz default now()
);

-- Weight history
create table public.weight_history (
  id uuid default uuid_generate_v4() primary key,
  pet_id uuid references public.pets(id) on delete cascade,
  weight_kg numeric(5,2) not null,
  recorded_at date not null default current_date,
  notes text,
  created_at timestamptz default now()
);

-- Activities
create table public.activities (
  id uuid default uuid_generate_v4() primary key,
  pet_id uuid references public.pets(id) on delete cascade,
  user_id uuid references public.profiles(id) on delete cascade,
  activity_type text not null,
  title text not null,
  duration_minutes integer,
  notes text,
  completed boolean default false,
  scheduled_for timestamptz,
  completed_at timestamptz,
  is_recurring boolean default false,
  recurrence_pattern text,
  created_at timestamptz default now()
);

-- Community posts
create table public.community_posts (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade,
  pet_id uuid references public.pets(id) on delete set null,
  content text,
  photo_url text,
  likes_count integer default 0,
  comments_count integer default 0,
  created_at timestamptz default now()
);

-- Post likes
create table public.post_likes (
  id uuid default uuid_generate_v4() primary key,
  post_id uuid references public.community_posts(id) on delete cascade,
  user_id uuid references public.profiles(id) on delete cascade,
  created_at timestamptz default now(),
  unique(post_id, user_id)
);

-- Post comments
create table public.post_comments (
  id uuid default uuid_generate_v4() primary key,
  post_id uuid references public.community_posts(id) on delete cascade,
  user_id uuid references public.profiles(id) on delete cascade,
  content text not null,
  created_at timestamptz default now()
);

-- Photo gallery
create table public.photos (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade,
  pet_id uuid references public.pets(id) on delete set null,
  photo_url text not null,
  caption text,
  created_at timestamptz default now()
);

-- Seed 100 QR tags
insert into public.qr_tags (tag_code)
select 'VP-' || lpad(generate_series::text, 3, '0')
from generate_series(1, 100);

-- Row Level Security
alter table public.profiles enable row level security;
alter table public.pets enable row level security;
alter table public.qr_tags enable row level security;
alter table public.vet_info enable row level security;
alter table public.emergency_contacts enable row level security;
alter table public.vaccinations enable row level security;
alter table public.medications enable row level security;
alter table public.weight_history enable row level security;
alter table public.activities enable row level security;
alter table public.community_posts enable row level security;
alter table public.post_likes enable row level security;
alter table public.post_comments enable row level security;
alter table public.photos enable row level security;

-- Profiles policies
create policy "Users can view own profile" on public.profiles for select using (auth.uid() = id);
create policy "Users can update own profile" on public.profiles for update using (auth.uid() = id);
create policy "Users can insert own profile" on public.profiles for insert with check (auth.uid() = id);

-- Pets policies
create policy "Users can CRUD own pets" on public.pets for all using (auth.uid() = user_id);
create policy "Anyone can view pets via QR" on public.pets for select using (true);

-- QR tags: anyone can read (for scanning), only owner can update
create policy "Anyone can view QR tags" on public.qr_tags for select using (true);
create policy "Users can claim unclaimed tags" on public.qr_tags for update using (
  auth.uid() = user_id or user_id is null
);

-- Other tables: owner-only
create policy "Vet info owner" on public.vet_info for all using (
  auth.uid() = (select user_id from public.pets where id = pet_id)
);
create policy "Emergency contacts owner" on public.emergency_contacts for all using (auth.uid() = user_id);
create policy "Vaccinations owner" on public.vaccinations for all using (
  auth.uid() = (select user_id from public.pets where id = pet_id)
);
create policy "Medications owner" on public.medications for all using (
  auth.uid() = (select user_id from public.pets where id = pet_id)
);
create policy "Weight history owner" on public.weight_history for all using (
  auth.uid() = (select user_id from public.pets where id = pet_id)
);
create policy "Activities owner" on public.activities for all using (auth.uid() = user_id);
create policy "Photos owner" on public.photos for all using (auth.uid() = user_id);

-- Community: everyone can read, owners can write
create policy "Anyone can read posts" on public.community_posts for select using (true);
create policy "Users can create posts" on public.community_posts for insert with check (auth.uid() = user_id);
create policy "Users can delete own posts" on public.community_posts for delete using (auth.uid() = user_id);
create policy "Anyone can read likes" on public.post_likes for select using (true);
create policy "Users can like" on public.post_likes for insert with check (auth.uid() = user_id);
create policy "Users can unlike" on public.post_likes for delete using (auth.uid() = user_id);
create policy "Anyone can read comments" on public.post_comments for select using (true);
create policy "Users can comment" on public.post_comments for insert with check (auth.uid() = user_id);
create policy "Users can delete own comments" on public.post_comments for delete using (auth.uid() = user_id);
