// AI Laundry Expert knowledge base

interface KnowledgeEntry {
  keywords: string[];
  response_ar: string;
  response_en: string;
}

export const knowledgeBase: KnowledgeEntry[] = [
  // Cotton
  {
    keywords: ['cotton', 'قطن'],
    response_ar: `**القطن (Cotton)**

**تركيبة القماش:** ألياف سليلوز طبيعية 100% من نبات القطن.

**طريقة الغسيل:**
• الغسيل بالآلة على درجة 40-60°C
• يمكن غسيله بالماء الساخن (حتى 95°C للأبيض)
• استخدم منظف قوي للمواد المتسخة بشدة

**طريقة التجفيف:**
• تجفيف دوار على حرارة متوسطة إلى عالية
• أو التجفيف على حبل في الهواء الطلق

**طريقة الكوي:**
• مكواة على حرارة عالية (200°C)
• استخدم البخار للحصول على أفضل النتائج
• القطن يتحمل درجات الحرارة العالية

**الطي والتخزين:**
• طوِ على طول الدرزات
• احفظ في مكان جاف ومهواة
• تجنب التخزين في الأكياس البلاستيكية المغلقة`,
    response_en: `**Cotton Fabric**

**Composition:** 100% natural cellulose fibers from the cotton plant.

**Washing Method:**
• Machine wash at 40-60°C
• Can handle hot water (up to 95°C for whites)
• Use heavy-duty detergent for heavily soiled items

**Drying Method:**
• Tumble dry on medium to high heat
• Or line dry outdoors

**Ironing Method:**
• High heat iron (200°C)
• Use steam for best results
• Cotton tolerates high temperatures well

**Folding & Storage:**
• Fold along seams
• Store in dry, ventilated place
• Avoid sealed plastic bags`,
  },
  // Silk
  {
    keywords: ['silk', 'حرير'],
    response_ar: `**الحرير (Silk)**

**تركيبة القماش:** ألياف بروتينية طبيعية من شرانق دودة الحرير.

**طريقة الغسيل:**
• غسيل يدوي فقط في ماء بارد (30°C كحد أقصى)
• استخدم منظف مخصص للحرير
• أو تنظيف جاف احترافي
• لا تعصر أو تفرك

**طريقة التجفيف:**
• لف في منشفة نظيفة لامتصاص الماء
• ضع أفقياً أو علق في الظل
• لا تضع في مجفف أبداً
• ابعد عن الشمس المباشرة

**طريقة الكوي:**
• حرارة منخفضة (110°C)
• استخدم قماش ضغط
• اكوِ من الجانب العكسي
• بدون بخار مباشر

**تحذيرات مهمة:**
⚠️ لا تستخدم الكلور أبداً
⚠️ الماء الساخن يتلف الحرير
⚠️ تجنب الإنزيمات`,
    response_en: `**Silk Fabric**

**Composition:** Natural protein fiber from silkworm cocoons.

**Washing Method:**
• Hand wash ONLY in cold water (max 30°C)
• Use silk-specific detergent
• Or professional dry clean
• Never wring or scrub

**Drying Method:**
• Roll in clean towel to absorb water
• Lay flat or hang in shade
• NEVER put in tumble dryer
• Keep away from direct sunlight

**Ironing Method:**
• Low heat (110°C)
• Use pressing cloth
• Iron on reverse side
• No direct steam

**Important Warnings:**
⚠️ Never use chlorine bleach
⚠️ Hot water destroys silk
⚠️ Avoid enzyme detergents`,
  },
  // Wool
  {
    keywords: ['wool', 'صوف', 'cashmere', 'كشمير'],
    response_ar: `**الصوف (Wool)**

**تركيبة القماش:** ألياف بروتينية طبيعية من صوف الأغنام أو الماعز.

**طريقة الغسيل:**
• غسيل يدوي بارد أو دورة صوف في الآلة
• استخدم منظف مخصص للصوف (pH متعادل)
• ماء بارد لا يتجاوز 30°C
• لا تفرك أو تعصر

**طريقة التجفيف:**
• لف في منشفة لامتصاص الماء
• ضع أفقياً للتجفيف
• لا تعلق (يتمدد بسبب الوزن)
• لا تجفف بالتدوير أبداً

**طريقة الكوي:**
• ضع قماش ضغط بين المكواة والصوف
• حرارة متوسطة مع بخار
• لا تضغط مباشرة على الصوف

**التخزين:**
• نظف قبل التخزين (مهم!)
• استخدم خشب الأرز أو اللافندر لطرد العثة
• احفظ في أكياس مغلقة

**تحذيرات:**
⚠️ يتقلص بسبب الحرارة والاحتكاك
⚠️ لا تستخدم الكلور أبداً`,
    response_en: `**Wool Fabric**

**Composition:** Natural protein fiber from sheep or goat fleece.

**Washing Method:**
• Hand wash cold or wool machine cycle
• Use wool-specific detergent (pH neutral)
• Cold water, max 30°C
• Do not rub or wring

**Drying Method:**
• Roll in towel to absorb water
• Lay FLAT to dry
• Do not hang (stretches from weight)
• NEVER tumble dry

**Ironing Method:**
• Use pressing cloth between iron and wool
• Medium heat with steam
• Never press directly on wool

**Storage:**
• Clean before storing (important!)
• Use cedar or lavender for moth prevention
• Store in sealed bags

**Warnings:**
⚠️ Felts/shrinks from heat and agitation
⚠️ Never use chlorine bleach`,
  },
  // Linen
  {
    keywords: ['linen', 'كتان', 'flax'],
    response_ar: `**الكتان (Linen)**

**تركيبة القماش:** ألياف طبيعية من سيقان نبات الكتان. أقوى بكثير من القطن.

**طريقة الغسيل:**
• غسيل آلة 30-40°C أو غسيل يدوي
• منظف خفيف
• تجنب درجات الحرارة العالية (يتقلص)

**طريقة التجفيف:**
• جفف على حبل وهو لا يزال رطباً قليلاً
• تجفيف دوار منخفض الحرارة
• تجنب الحرارة العالية

**طريقة الكوي:**
• حرارة عالية وهو لا يزال رطباً قليلاً
• البخار يساعد كثيراً
• الكتان يقبل الكوي بشكل ممتاز

**خصائص مميزة:**
• أقوى وأطول عمراً من القطن
• يتحسن مع الغسيل
• الطيات طبيعية في الكتان
• ناعم ومبرد في الصيف`,
    response_en: `**Linen Fabric**

**Composition:** Natural fibers from flax plant stems. Much stronger than cotton.

**Washing Method:**
• Machine wash 30-40°C or hand wash
• Use mild detergent
• Avoid high temperatures (shrinks)

**Drying Method:**
• Line dry while slightly damp
• Low heat tumble dry
• Avoid high heat

**Ironing Method:**
• High heat while still slightly damp
• Steam helps greatly
• Linen takes ironing beautifully

**Special Properties:**
• Stronger and longer-lasting than cotton
• Improves with washing
• Natural creasing is normal
• Cool and breathable in summer`,
  },
  // Polyester
  {
    keywords: ['polyester', 'بوليستر', 'synthetic', 'اصطناعي'],
    response_ar: `**البوليستر (Polyester)**

**تركيبة القماش:** ألياف بوليمر اصطناعية مصنوعة من البترول.

**طريقة الغسيل:**
• غسيل آلة 30-40°C
• حرارة منخفضة لتجنب التكتل
• منظف عادي أو للألوان

**طريقة التجفيف:**
• تجفيف دوار حرارة منخفضة
• أو تجفيف هوائي
• تجنب الحرارة العالية (تشوه الشكل)

**طريقة الكوي:**
• حرارة منخفضة إلى متوسطة (150°C كحد أقصى)
• الحرارة العالية تذيب/تشوه البوليستر

**مزايا:**
• مقاوم للتجعد
• جاف سريعاً
• قوي ومتين
• يحافظ على لونه

**عيوب:**
• يجمع الروائح
• يولد كهرباء ساكنة`,
    response_en: `**Polyester Fabric**

**Composition:** Synthetic polymer fibers made from petroleum.

**Washing Method:**
• Machine wash 30-40°C
• Low heat to prevent pilling
• Regular or color detergent

**Drying Method:**
• Low heat tumble dry
• Or air dry
• Avoid high heat (deforms shape)

**Ironing Method:**
• Low to medium heat (max 150°C)
• High heat melts/deforms polyester

**Advantages:**
• Wrinkle-resistant
• Quick-drying
• Strong and durable
• Color-fast

**Disadvantages:**
• Traps odors
• Generates static electricity`,
  },
  // Blood stains
  {
    keywords: ['blood', 'دم', 'bloody'],
    response_ar: `**إزالة بقع الدم**

**مهم جداً:** استخدم الماء البارد فقط - الماء الساخن يثبت الدم بشكل دائم!

**للدم الطازج:**
1. اشطف فوراً بالماء البارد تحت الصنبور
2. أضف ملح الطعام واتركه 5 دقائق
3. ضع بيروكسيد الهيدروجين 3% واترك حتى يتوقف عن الفوران
4. اشطف بالماء البارد واغسل بمنظف إنزيمي

**للدم الجاف:**
1. انقع في ماء مالح بارد لساعات
2. ضع منظف إنزيمي واترك طوال الليل
3. ضع بيروكسيد الهيدروجين على البقعة المتبقية
4. قد تحتاج معالجات متعددة

**المواد الكيميائية:**
• بيروكسيد الهيدروجين 3%
• ماء مالح بارد
• منظف إنزيمي

⚠️ **تحذير:** لا تستخدم ماء ساخناً أبداً!`,
    response_en: `**Blood Stain Removal**

**Critical:** Use COLD water only - hot water permanently sets blood!

**Fresh Blood:**
1. Rinse immediately with cold running water
2. Add table salt and leave 5 minutes
3. Apply 3% hydrogen peroxide - let it bubble
4. Rinse cold and wash with enzyme cleaner

**Dried Blood:**
1. Soak in cold salt water for hours
2. Apply enzyme cleaner overnight
3. Apply hydrogen peroxide on remaining stain
4. May need multiple treatments

**Chemicals Needed:**
• 3% Hydrogen Peroxide
• Cold Salt Water
• Enzyme Cleaner

⚠️ **Warning:** NEVER use hot water!`,
  },
  // Oil stains
  {
    keywords: ['oil', 'زيت', 'grease', 'شحوم', 'fat', 'دهن'],
    response_ar: `**إزالة بقع الزيت والشحوم**

**الزيوت الغذائية (زيت طهي، زبدة، مارجرين):**
1. امتص الزيت الزائد بالنشا أو البودرة - اترك 15 دقيقة
2. افرك النشا وأزله
3. ضع سائل الجلي مباشرة على البقعة
4. افرك بلطف واترك 10 دقائق
5. اغسل بماء دافئ ومنظف

**الزيت الصناعي (زيت محرك):**
1. ضع WD-40 أو نفس نوع الزيت (يذيب الزيت المتصلب)
2. ضع سائل الجلي فوقه
3. اغسل بمنظف قوي ومزيل شحوم

**نصيحة ذهبية:**
الماء وحده لا يزيل الزيت - دائماً ابدأ بمادة تمتص الدهن!

**المواد الكيميائية:**
• نشا أو بودرة طلق
• سائل غسيل الأطباق
• مزيل الشحوم`,
    response_en: `**Oil & Grease Stain Removal**

**Food Oils (cooking oil, butter, margarine):**
1. Absorb excess oil with cornstarch or powder - leave 15 min
2. Brush off the starch
3. Apply dish soap directly to stain
4. Rub gently, leave 10 minutes
5. Wash with warm water and detergent

**Industrial Oil (motor oil):**
1. Apply WD-40 or same oil type (dissolves hardened oil)
2. Apply dish soap over it
3. Wash with strong detergent and degreaser

**Golden Tip:**
Water alone doesn't remove oil - always start with an oil-absorbing agent!

**Chemicals Needed:**
• Cornstarch or talcum powder
• Dish soap
• Degreaser`,
  },
  // Coffee stains
  {
    keywords: ['coffee', 'قهوة', 'tea', 'شاي'],
    response_ar: `**إزالة بقع القهوة والشاي**

**فوراً (بقعة طازجة):**
1. امتص البقعة - لا تفرك
2. اشطف بالماء البارد من الخلف
3. ضع منظف إنزيمي أو خل أبيض
4. اغسل بالماء الدافئ

**بقعة قديمة:**
1. انقع في محلول الخل الأبيض 30 دقيقة
2. ضع منظف إنزيمي واترك ساعة
3. استخدم أكسجين تبييض إذا تبقت البقعة
4. اغسل بشكل طبيعي

**القهوة العربية/التركية:**
أصعب في الإزالة بسبب تركيزها العالي من التانين - تصرف فوراً!

**المواد الكيميائية:**
• منظف إنزيمي
• خل أبيض
• أكسجين تبييض

⚠️ لا تستخدم ماء ساخن - يثبت بقعة القهوة`,
    response_en: `**Coffee & Tea Stain Removal**

**Immediately (fresh stain):**
1. Blot stain - don't rub
2. Rinse with cold water from reverse
3. Apply enzyme cleaner or white vinegar
4. Wash with warm water

**Old Stain:**
1. Soak in white vinegar solution 30 minutes
2. Apply enzyme cleaner, leave 1 hour
3. Use oxygen bleach if stain remains
4. Launder normally

**Strong Coffee (Arabic/Turkish):**
Harder to remove due to high tannin concentration - act immediately!

**Chemicals Needed:**
• Enzyme Cleaner
• White Vinegar
• Oxygen Bleach

⚠️ No hot water - it sets coffee stains`,
  },
  // Chlorine bleach
  {
    keywords: ['bleach', 'بليتش', 'كلور', 'chlorine', 'تبييض'],
    response_ar: `**استخدام التبييض**

**كلور التبييض (هيبوكلوريت الصوديوم):**
✅ مناسب لـ: القطن الأبيض، الكتان الأبيض
❌ لا تستخدم على: الملونات، الصوف، الحرير، النايلون، الإسبانديكس

**طريقة الاستخدام:**
• خفف دائماً (1:10 على الأقل)
• أضف للغسيل وليس مباشرة على القماش
• 50-100مل لكل حمولة

**أكسجين التبييض (بيركربونات الصوديوم):**
✅ مناسب لـ: معظم الأقمشة بما في ذلك الملونة
❌ لا تستخدم على: الصوف، الحرير

**قواعد السلامة المهمة:**
⚠️ لا تخلط الكلور مع الأمونيا - ينتج غاز سام!
⚠️ لا تخلط الكلور مع الخل - ينتج كلور ساخن!
⚠️ ارتدِ قفازات وافتح النوافذ
⚠️ لا تستخدم على الصدأ - يثبته`,
    response_en: `**Bleach Usage Guide**

**Chlorine Bleach (Sodium Hypochlorite):**
✅ Suitable for: White cotton, white linen
❌ Do NOT use on: Colors, wool, silk, nylon, spandex

**How to Use:**
• Always dilute (at least 1:10)
• Add to wash, not directly on fabric
• 50-100ml per load

**Oxygen Bleach (Sodium Percarbonate):**
✅ Suitable for: Most fabrics including colored
❌ Do NOT use on: Wool, silk

**Critical Safety Rules:**
⚠️ NEVER mix chlorine bleach with ammonia - toxic gas!
⚠️ NEVER mix chlorine bleach with vinegar - produces hot chlorine!
⚠️ Wear gloves and open windows
⚠️ Don't use on rust stains - makes them permanent`,
  },
  // Dry cleaning
  {
    keywords: ['dry clean', 'تنظيف جاف', 'dry-clean'],
    response_ar: `**التنظيف الجاف**

**ما يحتاج تنظيفاً جافاً:**
• الصوف الثمين والكشمير
• الحرير الطبيعي
• المخمل
• الملابس المطرزة أو المزخرفة
• البدل والفساتين الرسمية
• الملابس بعلامة P على بطاقة العناية

**المذيبات المستخدمة:**
• PERC (البيركلوروإيثيلين) - الأكثر شيوعاً
• مذيبات هيدروكربونية (أنظف للبيئة)
• GreenEarth (سيليكون) - أكثر حداثة

**مميزات التنظيف الجاف:**
✅ لا يسبب التقلص
✅ يحافظ على شكل الملابس
✅ ممتاز للزيوت والشحوم
✅ مناسب للأقمشة الحساسة

**نصائح للفندق:**
• الزي الموحد الثقيل: يُنظف جافاً مرة شهرياً
• فساتين السهرة: تنظيف جاف بعد كل ارتداء
• المعاطف والجاكيت الجلدي: تنظيف جاف متخصص`,
    response_en: `**Dry Cleaning**

**What Needs Dry Cleaning:**
• Fine wool and cashmere
• Natural silk
• Velvet
• Embellished or decorative garments
• Suits and formal dresses
• Items labeled 'P' on care label

**Solvents Used:**
• PERC (Perchloroethylene) - most common
• Hydrocarbon solvents (greener option)
• GreenEarth (silicone) - modern option

**Advantages of Dry Cleaning:**
✅ No shrinkage
✅ Preserves garment shape
✅ Excellent for oils and grease
✅ Suitable for sensitive fabrics

**Hotel Tips:**
• Heavy uniforms: dry clean once monthly
• Evening dresses: dry clean after each wearing
• Leather jackets: specialized dry cleaning`,
  },
  // Stain general
  {
    keywords: ['stain', 'بقعة', 'remove', 'إزالة', 'stains', 'بقع'],
    response_ar: `**دليل إزالة البقع العام**

**قاعدة ذهبية #1:** تصرف فوراً - كل دقيقة تحسب!

**قاعدة ذهبية #2:** امتص ولا تفرك - الفرك يوسع البقعة

**خطوات البدء:**
1. حدد نوع البقعة (بروتين/زيت/صبغة)
2. تصرف فوراً قبل أن تجف
3. امتص السوائل الزائدة بقماش نظيف
4. اختبر في منطقة مخفية أولاً

**تصنيف البقع:**
🔴 **بروتين** (دم، بيض، حليب): ماء بارد + إنزيمي
🟡 **زيت** (طعام، آلات): نشا + سائل الجلي
🟠 **صبغة** (حبر، كاري): كحول طبي أو أكسجين تبييض
🟣 **تانين** (قهوة، شاي، نبيذ): ماء بارد + خل أبيض

**البقع الأصعب:**
• الكركم والزعفران ⭐⭐⭐⭐⭐
• الحناء ⭐⭐⭐⭐⭐
• طلاء الأظافر ⭐⭐⭐⭐
• الدم الجاف ⭐⭐⭐⭐`,
    response_en: `**General Stain Removal Guide**

**Golden Rule #1:** Act immediately - every minute counts!

**Golden Rule #2:** Blot, don't rub - rubbing spreads the stain

**Getting Started:**
1. Identify stain type (protein/oil/dye)
2. Act immediately before it dries
3. Blot excess liquid with clean cloth
4. Test on hidden area first

**Stain Classification:**
🔴 **Protein** (blood, egg, milk): Cold water + enzyme cleaner
🟡 **Oil** (food, machine): Cornstarch + dish soap
🟠 **Dye** (ink, curry): Rubbing alcohol or oxygen bleach
🟣 **Tannin** (coffee, tea, wine): Cold water + white vinegar

**Most Difficult Stains:**
• Turmeric/Saffron ⭐⭐⭐⭐⭐
• Henna ⭐⭐⭐⭐⭐
• Nail Polish ⭐⭐⭐⭐
• Dried Blood ⭐⭐⭐⭐`,
  },
  // Care labels
  {
    keywords: ['care label', 'بطاقة عناية', 'care symbol', 'رمز', 'washing symbol', 'رمز غسيل'],
    response_ar: `**دليل رموز العناية**

**رموز الغسيل:**
• 🪣 بدون خطوط = غسيل آلة عادي
• 🪣 مع خط تحته = دورة لطيفة
• 🪣 مع خطين = دورة رقيقة جداً
• 30°/40°/60°/95° = درجة الحرارة القصوى
• 🖐️ = غسيل يدوي فقط
• ✕ = لا تغسل بالماء

**رموز التجفيف:**
• □ دائرة داخل مربع = يمكن التجفيف الدوار
• نقطة = حرارة منخفضة، نقطتان = متوسطة، ثلاث = عالية
• ✕ على الدائرة = لا تجفف دوارياً
• 📐 خطوط أفقية = جفف أفقياً

**رموز الكوي:**
• 🔥 = حرارة عالية (قطن/كتان)
• 🔥🔥 = حرارة متوسطة (صوف/بوليستر)
• 🔥 = حرارة منخفضة (حرير/نايلون)
• ✕ = لا تكوِ

**رموز التبييض:**
• △ = أي تبييض مقبول
• △ مشطور = أكسجين فقط
• ✕ △ = لا تبيّض

**رموز التنظيف الجاف:**
• P = تنظيف جاف عادي
• F = مذيبات بترولية فقط
• ✕ P = لا تنظف جافاً`,
    response_en: `**Care Label Symbols Guide**

**Washing Symbols:**
• 🪣 No lines = Regular machine wash
• 🪣 One underline = Gentle cycle
• 🪣 Two underlines = Very delicate cycle
• 30°/40°/60°/95° = Maximum water temperature
• 🖐️ = Hand wash only
• ✕ = Do not wash with water

**Drying Symbols:**
• □ Circle in square = Can tumble dry
• One dot = Low heat, two = Medium, three = High
• ✕ on circle = Do not tumble dry
• 📐 Horizontal lines = Dry flat

**Ironing Symbols:**
• 3 dots = High heat (cotton/linen)
• 2 dots = Medium heat (wool/polyester)
• 1 dot = Low heat (silk/nylon)
• ✕ = Do not iron

**Bleaching Symbols:**
• △ = Any bleach acceptable
• Dashed △ = Oxygen bleach only
• ✕ △ = Do not bleach

**Dry Cleaning Symbols:**
• P = Normal dry cleaning
• F = Petroleum solvents only
• ✕ P = Do not dry clean`,
  },
  // Towels hotel linen
  {
    keywords: ['towel', 'منشفة', 'مناشف', 'linen', 'بياضات', 'hotel linen', 'بياضات فندقية'],
    response_ar: `**العناية ببياضات الفندق والمناشف**

**المناشف:**
🔹 **الغسيل:** ماء ساخن 60-90°C مع منظف قوي
🔹 **مهم:** لا تستخدم منعم القماش - يدمر الامتصاص!
🔹 **التجفيف:** تجفيف دوار حرارة عالية - يعيد نفش الحلقات
🔹 **الكوي:** غير ضروري عادةً
🔹 **الطي:** طية الفندق الاحترافية

**بياضات السرير (ملاءات):**
🔹 **الغسيل:** 60-90°C مع منظف وبليتش أكسجين للبقع
🔹 **التجفيف:** حرارة عالية
🔹 **الكوي:** بالمكواة الساخنة أو الضاغط الصناعي
🔹 **الطي:** ثلاثة أثلاث أو النصف حسب المعيار

**مشكلة واقي الشمس البرتقالي:**
هذه ليست صدأ - هي تفاعل كيميائي بين أفوبنزون وحديد الماء.
الحل: مزيل الصدأ التجاري أو أوكسيكلين - لا تستخدم كلور!

**دورة الغسيل المقترحة للمناشف:**
1. شطف مسبق 60°C
2. الغسيل الرئيسي 90°C
3. شطف بمعادل حمض
4. تجفيف بحرارة عالية`,
    response_en: `**Hotel Linen & Towels Care**

**Towels:**
🔹 **Washing:** Hot water 60-90°C with heavy-duty detergent
🔹 **Important:** NO fabric softener - it destroys absorbency!
🔹 **Drying:** High heat tumble dry - restores fluffiness
🔹 **Ironing:** Usually not needed
🔹 **Folding:** Professional hotel fold

**Bed Linen (Sheets):**
🔹 **Washing:** 60-90°C with detergent and oxygen bleach for stains
🔹 **Drying:** High heat
🔹 **Ironing:** Hot iron or industrial calender press
🔹 **Folding:** Thirds or half fold per standard

**Sunscreen Orange Stain Problem:**
Not rust - it's a chemical reaction between avobenzone and iron in water.
Solution: Commercial rust remover or OxiClean - NO chlorine bleach!

**Recommended Towel Wash Cycle:**
1. Pre-rinse at 60°C
2. Main wash at 90°C
3. Rinse with acid neutralizer
4. High heat tumble dry`,
  },
  // Uniforms
  {
    keywords: ['uniform', 'يونيفورم', 'زي موحد', 'staff', 'موظفين'],
    response_ar: `**العناية بزي موظفي الفندق**

**أنواع الزي وطريقة تنظيفه:**

**الزي القطن/البوليستر:**
• غسيل آلة 40-60°C
• منظف قوي
• أكسجين تبييض للبقع
• تجفيف دوار حرارة متوسطة
• كوي بالبخار

**زي المطبخ (الكباسيات):**
• غسيل بـ 90°C لإزالة البكتيريا
• منظف قوي مع مطهر
• تجفيف كامل
• تبييض أكسجين للبقع الدهنية

**الأثواب الرسمية والبدل:**
• تنظيف جاف شهرياً أو عند الحاجة
• تعليق فوراً بعد الاستخدام
• تجنب الجلوس لفترات طويلة بعد الكوي

**بقع المطبخ الشائعة:**
🔴 شحوم: سائل الجلي + مزيل شحوم
🟤 صلصة: منظف إنزيمي + أكسجين تبييض
🟡 بهارات/كاري: غليسرين + أوكسيكلين
⚫ حبر: كحول طبي + منظف إنزيمي

**نصيحة:** دع دائماً ليلة كاملة للمنظف الإنزيمي قبل الغسيل`,
    response_en: `**Hotel Staff Uniform Care**

**Uniform Types & Cleaning:**

**Cotton/Polyester Uniform:**
• Machine wash 40-60°C
• Heavy-duty detergent
• Oxygen bleach for stains
• Medium heat tumble dry
• Steam ironing

**Kitchen Uniform (Chef Whites):**
• Wash at 90°C to eliminate bacteria
• Heavy-duty detergent with disinfectant
• Complete drying
• Oxygen bleach for greasy stains

**Formal Wear & Suits:**
• Dry clean monthly or as needed
• Hang immediately after wearing
• Avoid prolonged sitting after ironing

**Common Kitchen Stains:**
🔴 Grease: Dish soap + degreaser
🟤 Sauce: Enzyme cleaner + oxygen bleach
🟡 Spices/Curry: Glycerine + OxiClean
⚫ Ink: Rubbing alcohol + enzyme cleaner

**Tip:** Always allow enzyme cleaner to work overnight before washing`,
  },
];

export function getAIResponse(query: string, language: 'ar' | 'en'): string {
  const lowerQuery = query.toLowerCase();

  for (const entry of knowledgeBase) {
    const matches = entry.keywords.some(k => lowerQuery.includes(k.toLowerCase()));
    if (matches) {
      return language === 'ar' ? entry.response_ar : entry.response_en;
    }
  }

  // Default response
  if (language === 'ar') {
    return `**خبير الغسيل الذكي**

أنا متخصص في الإجابة على أسئلة الغسيل الاحترافي للفنادق.

**يمكنني مساعدتك في:**
• 🧵 أنواع الأقمشة وطريقة العناية بها
• 🧽 إزالة أنواع البقع المختلفة
• 🏷️ تفسير رموز العناية
• ⚗️ استخدام المواد الكيميائية بأمان
• 🏨 العناية ببياضات الفندق والمناشف
• 👔 تنظيف زي الموظفين

**أمثلة على الأسئلة:**
- "كيف أزيل بقعة الدم؟"
- "ما هي طريقة غسيل الحرير؟"
- "كيف أستخدم البليتش؟"
- "ما معنى رمز الكوي؟"
- "كيف أنظف مناشف الفندق؟"

اسألني أي سؤال عن الغسيل الاحترافي! 🌟`;
  } else {
    return `**AI Laundry Expert**

I specialize in professional hotel laundry questions.

**I can help you with:**
• 🧵 Fabric types and care methods
• 🧽 Removing different types of stains
• 🏷️ Interpreting care label symbols
• ⚗️ Safe chemical usage
• 🏨 Hotel linen and towel care
• 👔 Staff uniform cleaning

**Example Questions:**
- "How do I remove a blood stain?"
- "What's the proper way to wash silk?"
- "How do I use bleach safely?"
- "What does the ironing symbol mean?"
- "How do I clean hotel towels properly?"

Ask me any professional laundry question! 🌟`;
  }
}
