export type Language = 'ar' | 'en';
export type Theme = 'dark';
export type ShiftType = 'morning' | 'evening' | 'night';
export type EmployeeStatus = 'active' | 'inactive' | 'on_leave';
export type ShiftStatus = 'scheduled' | 'attended' | 'absent' | 'late' | 'on_leave';
export type OrderStatus = 'received' | 'processing' | 'ready' | 'delivered' | 'cancelled';
export type PriceListCategory = 'guest' | 'outside';
export type VacationType = 'annual' | 'sick' | 'emergency' | 'unpaid';
export type VacationStatus = 'pending' | 'approved' | 'rejected';

export interface Employee {
  id: string;
  name: string;
  name_ar?: string;
  department: string;
  position: string;
  phone?: string;
  email?: string;
  national_id?: string;
  hire_date?: string;
  status: EmployeeStatus;
  notes?: string;
  avatar_url?: string;
  created_at: string;
  updated_at: string;
}

export interface Shift {
  id: string;
  employee_id: string;
  employee?: Employee;
  shift_date: string;
  shift_type: ShiftType;
  start_time?: string;
  end_time?: string;
  status: ShiftStatus;
  check_in?: string;
  check_out?: string;
  late_minutes: number;
  overtime_minutes: number;
  notes?: string;
  created_at: string;
}

export interface PriceListItem {
  id: string;
  category: PriceListCategory;
  item_name: string;
  item_name_ar?: string;
  washing_price: number;
  dry_cleaning_price: number;
  pressing_price: number;
  currency: string;
  is_active: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface OrderItem {
  id: string;
  name: string;
  name_ar?: string;
  quantity: number;
  unit_price: number;
  total: number;
}

export interface LaundryOrder {
  id: string;
  order_number?: string;
  room_number?: string;
  guest_name?: string;
  service_type: string;
  items: OrderItem[];
  total_amount: number;
  status: OrderStatus;
  priority: 'normal' | 'express' | 'urgent';
  received_at: string;
  due_date?: string;
  delivered_at?: string;
  employee_id?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface Vacation {
  id: string;
  employee_id: string;
  employee?: Employee;
  start_date: string;
  end_date: string;
  type: VacationType;
  status: VacationStatus;
  reason?: string;
  notes?: string;
  created_at: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  created_at: string;
}

export interface AppSettings {
  hotel_name: string;
  hotel_name_ar: string;
  currency: string;
  language: Language;
  theme: Theme;
}

export interface Stain {
  id: string;
  name: string;
  name_ar: string;
  category: string;
  category_ar: string;
  difficulty: 'easy' | 'medium' | 'hard' | 'very_hard';
  cause: string;
  cause_ar: string;
  removalMethod: string;
  removalMethod_ar: string;
  chemicals: string[];
  chemicals_ar: string[];
  warnings: string;
  warnings_ar: string;
  fabricCompatibility: string[];
}

export interface Chemical {
  id: string;
  name: string;
  name_ar: string;
  category: string;
  category_ar: string;
  description: string;
  description_ar: string;
  usage: string;
  usage_ar: string;
  safetyInstructions: string;
  safetyInstructions_ar: string;
  compatibleFabrics: string[];
  incompatibleFabrics: string[];
  warnings: string;
  warnings_ar: string;
  dilution?: string;
  dilution_ar?: string;
}

export interface CareSymbol {
  id: string;
  symbol: string;
  category: 'washing' | 'drying' | 'ironing' | 'bleaching' | 'dry_cleaning';
  name: string;
  name_ar: string;
  description: string;
  description_ar: string;
}

export interface FabricInfo {
  id: string;
  name: string;
  name_ar: string;
  composition: string;
  composition_ar: string;
  washing: string;
  washing_ar: string;
  drying: string;
  drying_ar: string;
  ironing: string;
  ironing_ar: string;
  folding: string;
  folding_ar: string;
  storage: string;
  storage_ar: string;
  maxTemp: number;
  icon: string;
}

export type Page =
  | 'dashboard'
  | 'ai-assistant'
  | 'stains'
  | 'chemicals'
  | 'care-labels'
  | 'price-list'
  | 'employees'
  | 'shifts'
  | 'reports'
  | 'settings';
