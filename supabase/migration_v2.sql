-- V2: tipo de plato y segundo plato por día
ALTER TABLE dishes ADD COLUMN IF NOT EXISTS type text;

ALTER TABLE weekly_menu
  ADD COLUMN IF NOT EXISTS monday_dish2_id    uuid REFERENCES dishes(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS tuesday_dish2_id   uuid REFERENCES dishes(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS wednesday_dish2_id uuid REFERENCES dishes(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS thursday_dish2_id  uuid REFERENCES dishes(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS friday_dish2_id    uuid REFERENCES dishes(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS saturday_dish2_id  uuid REFERENCES dishes(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS sunday_dish2_id    uuid REFERENCES dishes(id) ON DELETE SET NULL;
