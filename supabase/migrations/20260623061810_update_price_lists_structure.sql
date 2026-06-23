-- Drop the old price_lists table and recreate with new structure
DROP TABLE IF EXISTS price_lists CASCADE;

-- Recreate price_lists table with new structure
CREATE TABLE price_lists (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  category TEXT NOT NULL CHECK (category IN ('guest', 'outside')),
  item_name TEXT NOT NULL,
  item_name_ar TEXT,
  washing_price DECIMAL(10,2) NOT NULL DEFAULT 0,
  dry_cleaning_price DECIMAL(10,2) NOT NULL DEFAULT 0,
  pressing_price DECIMAL(10,2) NOT NULL DEFAULT 0,
  currency TEXT DEFAULT 'SAR',
  is_active BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE price_lists ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "select_prices" ON price_lists FOR SELECT TO authenticated USING (true);
CREATE POLICY "insert_prices" ON price_lists FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "update_prices" ON price_lists FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "delete_prices" ON price_lists FOR DELETE TO authenticated USING (true);

-- Insert Guest Laundry prices (30 items)
INSERT INTO price_lists (category, item_name, item_name_ar, washing_price, dry_cleaning_price, pressing_price, currency, sort_order) VALUES
('guest', 'Shirt', 'قميص', 15, 25, 10, 'SAR', 1),
('guest', 'Blouse', 'بلوزة', 18, 30, 12, 'SAR', 2),
('guest', 'Trousers', 'بنطلون', 20, 35, 15, 'SAR', 3),
('guest', 'Shorts', 'شورت', 12, 20, 8, 'SAR', 4),
('guest', 'Jacket', 'جاكيت', 35, 55, 20, 'SAR', 5),
('guest', 'Pullover', 'سترة صوف', 25, 40, 15, 'SAR', 6),
('guest', 'Sweatshirt', 'هودي', 22, 35, 12, 'SAR', 7),
('guest', 'Galabeya', 'جلابية', 25, 45, 18, 'SAR', 8),
('guest', 'Abaya', 'عباءة', 40, 70, 25, 'SAR', 9),
('guest', 'Pajamas', 'بيجامة', 18, 30, 10, 'SAR', 10),
('guest', 'Suit (2 pieces)', 'بدلة (قطعتين)', 50, 80, 30, 'SAR', 11),
('guest', 'Coat', 'معطف', 45, 75, 25, 'SAR', 12),
('guest', 'Underwear', 'ملابس داخلية', 8, 15, 5, 'SAR', 13),
('guest', 'Undershirt', 'فانلة', 10, 18, 6, 'SAR', 14),
('guest', 'Bra', 'حمالة صدر', 15, 25, 10, 'SAR', 15),
('guest', 'Socks (pair)', 'جوارب (زوج)', 8, 12, 5, 'SAR', 16),
('guest', 'Ghutra', 'غطرة', 15, 25, 12, 'SAR', 17),
('guest', 'Hijab', 'حجاب', 12, 20, 10, 'SAR', 18),
('guest', 'Scarf', 'وشاح', 15, 25, 12, 'SAR', 19),
('guest', 'Handkerchief', 'منديل', 8, 12, 5, 'SAR', 20),
('guest', 'Tie', 'ربطة عنق', 10, 20, 8, 'SAR', 21),
('guest', 'Bed Sheet', 'ملاءات سرير', 25, 40, 15, 'SAR', 22),
('guest', 'Pillow Case', 'غطاء وسادة', 12, 20, 8, 'SAR', 23),
('guest', 'Bath Towel', 'منشفة استحمام', 15, 25, 10, 'SAR', 24),
('guest', 'Face Towel', 'منشفة وجه', 10, 15, 6, 'SAR', 25),
('guest', 'Blanket', 'بطانية', 50, 90, 35, 'SAR', 26),
('guest', 'Large Duvet', 'لحاف كبير', 80, 150, 50, 'SAR', 27),
('guest', 'Small Duvet', 'لحاف صغير', 60, 110, 40, 'SAR', 28),
('guest', 'Curtain (per panel)', 'ستارة (للوحة)', 40, 70, 25, 'SAR', 29),
('guest', 'Hanger (returned)', 'شماع (مسترجع)', 2, 3, 1, 'SAR', 30);

-- Insert Outside Customer prices (30 items, ~30% higher)
INSERT INTO price_lists (category, item_name, item_name_ar, washing_price, dry_cleaning_price, pressing_price, currency, sort_order) VALUES
('outside', 'Shirt', 'قميص', 20, 33, 13, 'SAR', 1),
('outside', 'Blouse', 'بلوزة', 23, 39, 16, 'SAR', 2),
('outside', 'Trousers', 'بنطلون', 26, 46, 20, 'SAR', 3),
('outside', 'Shorts', 'شورت', 16, 26, 10, 'SAR', 4),
('outside', 'Jacket', 'جاكيت', 46, 72, 26, 'SAR', 5),
('outside', 'Pullover', 'سترة صوف', 33, 52, 20, 'SAR', 6),
('outside', 'Sweatshirt', 'هودي', 29, 46, 16, 'SAR', 7),
('outside', 'Galabeya', 'جلابية', 33, 59, 23, 'SAR', 8),
('outside', 'Abaya', 'عباءة', 52, 91, 33, 'SAR', 9),
('outside', 'Pajamas', 'بيجامة', 23, 39, 13, 'SAR', 10),
('outside', 'Suit (2 pieces)', 'بدلة (قطعتين)', 65, 104, 39, 'SAR', 11),
('outside', 'Coat', 'معطف', 59, 98, 33, 'SAR', 12),
('outside', 'Underwear', 'ملابس داخلية', 10, 20, 7, 'SAR', 13),
('outside', 'Undershirt', 'فانلة', 13, 23, 8, 'SAR', 14),
('outside', 'Bra', 'حمالة صدر', 20, 33, 13, 'SAR', 15),
('outside', 'Socks (pair)', 'جوارب (زوج)', 10, 16, 7, 'SAR', 16),
('outside', 'Ghutra', 'غطرة', 20, 33, 16, 'SAR', 17),
('outside', 'Hijab', 'حجاب', 16, 26, 13, 'SAR', 18),
('outside', 'Scarf', 'وشاح', 20, 33, 16, 'SAR', 19),
('outside', 'Handkerchief', 'منديل', 10, 16, 7, 'SAR', 20),
('outside', 'Tie', 'ربطة عنق', 13, 26, 10, 'SAR', 21),
('outside', 'Bed Sheet', 'ملاءات سرير', 33, 52, 20, 'SAR', 22),
('outside', 'Pillow Case', 'غطاء وسادة', 16, 26, 10, 'SAR', 23),
('outside', 'Bath Towel', 'منشفة استحمام', 20, 33, 13, 'SAR', 24),
('outside', 'Face Towel', 'منشفة وجه', 13, 20, 8, 'SAR', 25),
('outside', 'Blanket', 'بطانية', 65, 117, 46, 'SAR', 26),
('outside', 'Large Duvet', 'لحاف كبير', 104, 195, 65, 'SAR', 27),
('outside', 'Small Duvet', 'لحاف صغير', 78, 143, 52, 'SAR', 28),
('outside', 'Curtain (per panel)', 'ستارة (للوحة)', 52, 91, 33, 'SAR', 29),
('outside', 'Hanger (returned)', 'شماع (مسترجع)', 3, 4, 2, 'SAR', 30);