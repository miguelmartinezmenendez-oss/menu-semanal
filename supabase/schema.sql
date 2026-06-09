-- households
create table if not exists households (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  created_at timestamptz default now()
);

-- dishes
create table if not exists dishes (
  id uuid primary key default gen_random_uuid(),
  household_id uuid not null references households(id) on delete cascade,
  name text not null,
  ingredients text[] not null default '{}',
  notes text,
  created_at timestamptz default now()
);

-- weekly_menu
create table if not exists weekly_menu (
  id uuid primary key default gen_random_uuid(),
  household_id uuid not null references households(id) on delete cascade,
  week_start date not null,
  monday_dish_id uuid references dishes(id) on delete set null,
  tuesday_dish_id uuid references dishes(id) on delete set null,
  wednesday_dish_id uuid references dishes(id) on delete set null,
  thursday_dish_id uuid references dishes(id) on delete set null,
  friday_dish_id uuid references dishes(id) on delete set null,
  saturday_dish_id uuid references dishes(id) on delete set null,
  sunday_dish_id uuid references dishes(id) on delete set null,
  unique(household_id, week_start)
);

-- shopping_list_items
create table if not exists shopping_list_items (
  id uuid primary key default gen_random_uuid(),
  household_id uuid not null references households(id) on delete cascade,
  week_start date not null,
  name text not null,
  category text not null default 'Otros',
  checked boolean not null default false,
  source text not null default 'manual',
  created_at timestamptz default now()
);

-- Row Level Security
alter table households enable row level security;
alter table dishes enable row level security;
alter table weekly_menu enable row level security;
alter table shopping_list_items enable row level security;

create policy "anon_all_households" on households for all to anon using (true) with check (true);
create policy "anon_all_dishes" on dishes for all to anon using (true) with check (true);
create policy "anon_all_weekly_menu" on weekly_menu for all to anon using (true) with check (true);
create policy "anon_all_shopping" on shopping_list_items for all to anon using (true) with check (true);

-- Habilitar Realtime
alter publication supabase_realtime add table dishes;
alter publication supabase_realtime add table weekly_menu;
alter publication supabase_realtime add table shopping_list_items;
