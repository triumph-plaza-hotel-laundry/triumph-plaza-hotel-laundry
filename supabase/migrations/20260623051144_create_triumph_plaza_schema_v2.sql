
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Employees table
CREATE TABLE IF NOT EXISTS employees (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  name_ar TEXT,
  department TEXT NOT NULL DEFAULT 'Laundry',
  position TEXT NOT NULL,
  phone TEXT,
  email TEXT,
  national_id TEXT,
  hire_date DATE,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'on_leave')),
  notes TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE employees ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='employees' AND policyname='select_employees') THEN
    CREATE POLICY "select_employees" ON employees FOR SELECT TO authenticated USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='employees' AND policyname='insert_employees') THEN
    CREATE POLICY "insert_employees" ON employees FOR INSERT TO authenticated WITH CHECK (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='employees' AND policyname='update_employees') THEN
    CREATE POLICY "update_employees" ON employees FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='employees' AND policyname='delete_employees') THEN
    CREATE POLICY "delete_employees" ON employees FOR DELETE TO authenticated USING (true);
  END IF;
END $$;

-- Shifts table
CREATE TABLE IF NOT EXISTS shifts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  employee_id UUID REFERENCES employees(id) ON DELETE CASCADE,
  shift_date DATE NOT NULL,
  shift_type TEXT NOT NULL CHECK (shift_type IN ('morning', 'evening', 'night')),
  start_time TIME,
  end_time TIME,
  status TEXT NOT NULL DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'attended', 'absent', 'late', 'on_leave')),
  check_in TIME,
  check_out TIME,
  late_minutes INTEGER DEFAULT 0,
  overtime_minutes INTEGER DEFAULT 0,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE shifts ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='shifts' AND policyname='select_shifts') THEN
    CREATE POLICY "select_shifts" ON shifts FOR SELECT TO authenticated USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='shifts' AND policyname='insert_shifts') THEN
    CREATE POLICY "insert_shifts" ON shifts FOR INSERT TO authenticated WITH CHECK (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='shifts' AND policyname='update_shifts') THEN
    CREATE POLICY "update_shifts" ON shifts FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='shifts' AND policyname='delete_shifts') THEN
    CREATE POLICY "delete_shifts" ON shifts FOR DELETE TO authenticated USING (true);
  END IF;
END $$;

-- Price lists table
CREATE TABLE IF NOT EXISTS price_lists (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  category TEXT NOT NULL CHECK (category IN ('guest', 'outside', 'dry_cleaning', 'pressing', 'express')),
  item_name TEXT NOT NULL,
  item_name_ar TEXT,
  price DECIMAL(10,2) NOT NULL DEFAULT 0,
  express_price DECIMAL(10,2),
  currency TEXT DEFAULT 'SAR',
  unit TEXT DEFAULT 'piece',
  is_active BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE price_lists ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='price_lists' AND policyname='select_prices') THEN
    CREATE POLICY "select_prices" ON price_lists FOR SELECT TO authenticated USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='price_lists' AND policyname='insert_prices') THEN
    CREATE POLICY "insert_prices" ON price_lists FOR INSERT TO authenticated WITH CHECK (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='price_lists' AND policyname='update_prices') THEN
    CREATE POLICY "update_prices" ON price_lists FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='price_lists' AND policyname='delete_prices') THEN
    CREATE POLICY "delete_prices" ON price_lists FOR DELETE TO authenticated USING (true);
  END IF;
END $$;

-- Laundry orders table
CREATE TABLE IF NOT EXISTS laundry_orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_number TEXT UNIQUE,
  room_number TEXT,
  guest_name TEXT,
  service_type TEXT NOT NULL DEFAULT 'guest' CHECK (service_type IN ('guest', 'outside', 'dry_cleaning', 'pressing', 'express')),
  items JSONB DEFAULT '[]',
  total_amount DECIMAL(10,2) DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'received' CHECK (status IN ('received', 'processing', 'ready', 'delivered', 'cancelled')),
  priority TEXT DEFAULT 'normal' CHECK (priority IN ('normal', 'express', 'urgent')),
  received_at TIMESTAMPTZ DEFAULT NOW(),
  due_date TIMESTAMPTZ,
  delivered_at TIMESTAMPTZ,
  employee_id UUID REFERENCES employees(id),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE laundry_orders ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='laundry_orders' AND policyname='select_orders') THEN
    CREATE POLICY "select_orders" ON laundry_orders FOR SELECT TO authenticated USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='laundry_orders' AND policyname='insert_orders') THEN
    CREATE POLICY "insert_orders" ON laundry_orders FOR INSERT TO authenticated WITH CHECK (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='laundry_orders' AND policyname='update_orders') THEN
    CREATE POLICY "update_orders" ON laundry_orders FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='laundry_orders' AND policyname='delete_orders') THEN
    CREATE POLICY "delete_orders" ON laundry_orders FOR DELETE TO authenticated USING (true);
  END IF;
END $$;

-- App settings table
CREATE TABLE IF NOT EXISTS app_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  key TEXT UNIQUE NOT NULL,
  value TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE app_settings ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='app_settings' AND policyname='select_settings') THEN
    CREATE POLICY "select_settings" ON app_settings FOR SELECT TO authenticated USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='app_settings' AND policyname='insert_settings') THEN
    CREATE POLICY "insert_settings" ON app_settings FOR INSERT TO authenticated WITH CHECK (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='app_settings' AND policyname='update_settings') THEN
    CREATE POLICY "update_settings" ON app_settings FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='app_settings' AND policyname='delete_settings') THEN
    CREATE POLICY "delete_settings" ON app_settings FOR DELETE TO authenticated USING (true);
  END IF;
END $$;

-- AI Chat history table
CREATE TABLE IF NOT EXISTS ai_chat_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  session_id TEXT,
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant')),
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE ai_chat_history ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='ai_chat_history' AND policyname='select_chat') THEN
    CREATE POLICY "select_chat" ON ai_chat_history FOR SELECT TO authenticated USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='ai_chat_history' AND policyname='insert_chat') THEN
    CREATE POLICY "insert_chat" ON ai_chat_history FOR INSERT TO authenticated WITH CHECK (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='ai_chat_history' AND policyname='update_chat') THEN
    CREATE POLICY "update_chat" ON ai_chat_history FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='ai_chat_history' AND policyname='delete_chat') THEN
    CREATE POLICY "delete_chat" ON ai_chat_history FOR DELETE TO authenticated USING (true);
  END IF;
END $$;

-- Vacations table
CREATE TABLE IF NOT EXISTS vacations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  employee_id UUID REFERENCES employees(id) ON DELETE CASCADE,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  type TEXT NOT NULL DEFAULT 'annual' CHECK (type IN ('annual', 'sick', 'emergency', 'unpaid')),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  reason TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE vacations ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='vacations' AND policyname='select_vacations') THEN
    CREATE POLICY "select_vacations" ON vacations FOR SELECT TO authenticated USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='vacations' AND policyname='insert_vacations') THEN
    CREATE POLICY "insert_vacations" ON vacations FOR INSERT TO authenticated WITH CHECK (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='vacations' AND policyname='update_vacations') THEN
    CREATE POLICY "update_vacations" ON vacations FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='vacations' AND policyname='delete_vacations') THEN
    CREATE POLICY "delete_vacations" ON vacations FOR DELETE TO authenticated USING (true);
  END IF;
END $$;

-- Insert default price list items
INSERT INTO price_lists (category, item_name, item_name_ar, price, express_price, currency, unit, sort_order) VALUES
('guest', 'Shirt', 'قميص', 15.00, 25.00, 'SAR', 'piece', 1),
('guest', 'Trousers', 'بنطلون', 18.00, 28.00, 'SAR', 'piece', 2),
('guest', 'Suit', 'بدلة', 45.00, 70.00, 'SAR', 'piece', 3),
('guest', 'T-Shirt', 'تي شيرت', 12.00, 20.00, 'SAR', 'piece', 4),
('guest', 'Dress', 'فستان', 35.00, 55.00, 'SAR', 'piece', 5),
('guest', 'Underwear', 'ملابس داخلية', 8.00, 15.00, 'SAR', 'piece', 6),
('guest', 'Socks', 'جوارب', 5.00, 10.00, 'SAR', 'pair', 7),
('guest', 'Jacket', 'جاكيت', 40.00, 65.00, 'SAR', 'piece', 8),
('guest', 'Abaya', 'عباية', 30.00, 50.00, 'SAR', 'piece', 9),
('guest', 'Thobe', 'ثوب', 25.00, 40.00, 'SAR', 'piece', 10),
('dry_cleaning', 'Suit (2-piece)', 'بدلة قطعتان', 80.00, 120.00, 'SAR', 'piece', 1),
('dry_cleaning', 'Suit (3-piece)', 'بدلة ثلاث قطع', 110.00, 160.00, 'SAR', 'piece', 2),
('dry_cleaning', 'Evening Dress', 'فستان سهرة', 90.00, 140.00, 'SAR', 'piece', 3),
('dry_cleaning', 'Coat', 'معطف', 75.00, 115.00, 'SAR', 'piece', 4),
('dry_cleaning', 'Leather Jacket', 'جاكيت جلد', 150.00, 220.00, 'SAR', 'piece', 5),
('pressing', 'Shirt', 'قميص', 8.00, 15.00, 'SAR', 'piece', 1),
('pressing', 'Trousers', 'بنطلون', 10.00, 18.00, 'SAR', 'piece', 2),
('pressing', 'Suit', 'بدلة', 25.00, 40.00, 'SAR', 'piece', 3),
('pressing', 'Dress', 'فستان', 20.00, 35.00, 'SAR', 'piece', 4),
('pressing', 'Thobe', 'ثوب', 12.00, 20.00, 'SAR', 'piece', 5),
('outside', 'Shirt', 'قميص', 10.00, 18.00, 'SAR', 'piece', 1),
('outside', 'Trousers', 'بنطلون', 12.00, 20.00, 'SAR', 'piece', 2),
('outside', 'Blanket (Single)', 'بطانية فردية', 40.00, 65.00, 'SAR', 'piece', 3),
('outside', 'Blanket (Double)', 'بطانية مزدوجة', 60.00, 90.00, 'SAR', 'piece', 4),
('outside', 'Curtain (per meter)', 'ستارة (للمتر)', 25.00, 40.00, 'SAR', 'meter', 5)
ON CONFLICT DO NOTHING;

-- Insert default settings
INSERT INTO app_settings (key, value) VALUES
('hotel_name', 'Triumph Plaza Hotel'),
('hotel_name_ar', 'فندق ترايمف بلازا'),
('currency', 'SAR'),
('language', 'ar'),
('theme', 'dark')
ON CONFLICT (key) DO NOTHING;
