-- V3: soporte para hasta 4 platos por día
ALTER TABLE weekly_menu
  ADD COLUMN IF NOT EXISTS monday_dish3_id    uuid REFERENCES dishes(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS monday_dish4_id    uuid REFERENCES dishes(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS tuesday_dish3_id   uuid REFERENCES dishes(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS tuesday_dish4_id   uuid REFERENCES dishes(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS wednesday_dish3_id uuid REFERENCES dishes(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS wednesday_dish4_id uuid REFERENCES dishes(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS thursday_dish3_id  uuid REFERENCES dishes(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS thursday_dish4_id  uuid REFERENCES dishes(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS friday_dish3_id    uuid REFERENCES dishes(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS friday_dish4_id    uuid REFERENCES dishes(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS saturday_dish3_id  uuid REFERENCES dishes(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS saturday_dish4_id  uuid REFERENCES dishes(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS sunday_dish3_id    uuid REFERENCES dishes(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS sunday_dish4_id    uuid REFERENCES dishes(id) ON DELETE SET NULL;
