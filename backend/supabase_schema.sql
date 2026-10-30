-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Users table
create table if not exists users (
    id uuid references auth.users on delete cascade not null primary key,
    email text unique not null,
    name text,
    role text default 'citizen',
    health_score integer default 100,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Incidents table (hotspots)
create table if not exists incidents (
    id uuid default uuid_generate_v4() primary key,
    latitude double precision not null,
    longitude double precision not null,
    pollution_type text not null,
    severity text not null,
    confidence integer default 0,
    image_url text,
    description text,
    predicted_radius double precision default 1.0,
    status text default 'Active',
    suggested_action text,
    reporter_id uuid references users(id) on delete set null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Analytics table
create table if not exists analytics (
    id uuid default uuid_generate_v4() primary key,
    date date not null unique,
    daily_avg_aqi integer default 0,
    total_reports integer default 0,
    active_hotspots integer default 0,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Reports table
create table if not exists reports (
    id uuid default uuid_generate_v4() primary key,
    user_id uuid references users(id) on delete cascade not null,
    incident_id uuid references incidents(id) on delete set null,
    latitude double precision not null,
    longitude double precision not null,
    image_url text not null,
    voice_note_url text,
    status text default 'Pending Analysis',
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS (Row Level Security)
alter table users enable row level security;
alter table incidents enable row level security;
alter table analytics enable row level security;
alter table reports enable row level security;

-- Setup RLS Policies (For prototyping, we will allow all reads and writes)
create policy "Public can view incidents" on incidents for select using (true);
create policy "Public can create incidents" on incidents for insert with check (true);
create policy "Public can update incidents" on incidents for update using (true);
create policy "Public can view analytics" on analytics for select using (true);
create policy "Public can create reports" on reports for insert with check (true);
create policy "Public can view reports" on reports for select using (true);
create policy "Public can view users" on users for select using (true);

-- Setup Realtime
begin;
  drop publication if exists supabase_realtime;
  create publication supabase_realtime;
commit;
alter publication supabase_realtime add table incidents;
alter publication supabase_realtime add table analytics;
