-- ==============================================================================
-- KUSUMIKA LUXURY HOME TEXTILES - SEED DATA FOR SUPABASE
-- Categories, Products, Variants, Swatches, Reviews, Coupons & Demo Orders
-- ==============================================================================

-- 1. SEED CATEGORIES
INSERT INTO categories (id, slug, name, description, hero_image, display_order, is_active)
VALUES
  ('c1000000-0000-0000-0000-000000000001', 'bedsheets-linens', 'Bedsheets & Linens', 'Breathable 400–800 thread count sateen and cambric hand-block printed bed linens crafted with unbleached organic cotton.', 'https://lh3.googleusercontent.com/aida-public/AB6AXuCYAbKZ33pQ3lzeA69Wjagq1adsg9pG2bitcfb4SF2Ucpw9Kqkq5caInI--jrtMa3MdP5SGA3fSl1n30_rWaHJxO7ygOY761RKwtCmjC8oWX-09qhahrmtrMy_SBGV53qm90csA5_n_lxT_U5aCYj0O9whvpsRZdiNtJS2Aq0nm2ZoUgoQ1JhKEqspLeAOXiW5axgSL8ybs68JZzYjtsjqFvccn0KPnsN577qzzuryYYTZiH9KPVmiD8A', 1, TRUE),
  ('c1000000-0000-0000-0000-000000000002', 'throws-quilts', 'Throws & Quilts', 'Weightless cotton mulmul dohars and fine Jaipur razais quilted by hand with pure carded surgical cotton batting.', 'https://lh3.googleusercontent.com/aida-public/AB6AXuCaxj6myT1QzlUhNURqvcGCAIBGmDq9NJSDmc4_el1ewD_AIW5uW6YaNonlOixklKpEJF8kmqX4Qrx_sfv4IyBFK03LGNBxgQgU_dlmSMJltew5kKMT54W8xA7TV6gvzjWm5OlyyPUu9h8upyTf01GItu6Z8wIwwYvsluz2RpAVKE4P-ic3UnMmWTdjXGC1RFrLzRmXDbbQi3kW7BAYKQ8RMQ2QAQvihSm7LGGMX-OKC_WkOGGTCpImbw', 2, TRUE),
  ('c1000000-0000-0000-0000-000000000003', 'towels-bath', 'Towels & Bath', 'Ultra-absorbent honeycombed waffle-weave spa towels pre-washed with natural desert soapnuts for skin-soothing softness.', 'https://lh3.googleusercontent.com/aida-public/AB6AXuBG21fwCILGL3KU8ZGOAAEfKsOMn0uigAI1fgCtxuqAKmAfHkktjSBKhZWQEdN2xqF8zYLaxGM9bmPEnEOYf0nfukWoojySCR__twaMq4z5UaACVxMykdtAk_G6iWRFm0dIoNJjHCTGUsZII1dMwh80QwLO914wKsbfH-h2NloIvLN0-FIs2iDlAp23yICkc_VHDDDjqSJUFVfkfCf2d5RP7vWB5bRjA9nnX7-pDGn8Xgof1M3EaDzzTw', 3, TRUE),
  ('c1000000-0000-0000-0000-000000000004', 'cushions-decor', 'Cushions & Living', 'Heritage jewel-toned velvet and textured raw slub cotton cushions finished with antique zari and kantha stitching.', 'https://lh3.googleusercontent.com/aida-public/AB6AXuBa0aTlB2k5SuCbCtFSeriRz3__YgsOLfPR_Pbu9ctlW7-W0DvniMiRvChWVOB6WkvnDORZEo6REOXHg1SD_jFmCtZ96776rvOGo6Cavmq8szak9VMoYctlbw86thBW3vGRHMI-huovTJZTBSiGwfzMsCPAQ92jHM4o9KrOF7KvuPIiFbYAreY9GoEmvKB21BBENwu_kbLU7eGt-LUf8btRy0d6DQHGL0Y9E2XvFOMua7xJK4Sh1MsRPA', 4, TRUE),
  ('c1000000-0000-0000-0000-000000000005', 'festive-edit', 'Festive Heritage Edit', 'Limited-batch festive treasures infused with natural madder, wild turmeric haldi, and deep Persian indigo vat dyes.', 'https://lh3.googleusercontent.com/aida-public/AB6AXuBTS-aw_TUNsy6opw3yi5KDRIQodWNHaGv0Tp7tTw62n7v-zbQNySQw0LxnPDy-AjHW3XrrpbFHBC_wcH7KG5TAz3nH2EYKKiykyLe8gsIfRlIx8bAsIc7a82DsuDHCXXtyAv6z6_KWrI59aejNURUpp9W6GDtOTNeW3A1Ph30UW4w7-vEttvgaQ0qxb0wfQRZ21qwdgnV03kcgxZdXZe8fY4XXoQ0nEwMBFW-LYAYEnnFcHijyQ-Y-ig', 5, TRUE)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  hero_image = EXCLUDED.hero_image;

-- 2. SEED PRODUCTS
INSERT INTO products (
  id, title, subtitle, slug, description, story, care_instructions, dimensions,
  weave_type, thread_count, material, gots_certified, base_price, mrp, category_id,
  is_active, is_featured, is_festive, partial_cod_eligible, cod_advance_amount
) VALUES
(
  'p1000000-0000-0000-0000-000000000001',
  'Marwar Lotus 400TC Double Bedsheet Set',
  'Hand-block printed Sanganeri jaal on organic sateen',
  'marwar-lotus-400tc-double-bedsheet-set',
  'Crafted from certified organic Indian cotton with a silken 400 thread count sateen weave. Features archival lotus motifs chiseled into seasoned teakwood blocks by seventh-generation artisans in Sanganer. Pre-washed with wild soapnuts for an exceptionally gentle touch.',
  'Each Marwar Lotus bedsheet requires seventy-two meticulous hand stamp impressions per meter. The deep madder red is extracted from natural rubia tinctorum roots and fixed with desert alum water.',
  'Gentle machine wash with mild liquid detergent at 30°C. Line dry in shade to preserve organic botanical pigments. Warm iron on reverse while slightly damp.',
  'Double / Queen: 90 x 108 inches | King: 108 x 108 inches | Pillow Shams: 18 x 28 inches (Set of 2)',
  '400TC Silken Sateen',
  400,
  '100% GOTS Certified Long-Staple Cotton',
  TRUE,
  2850.00,
  3500.00,
  'c1000000-0000-0000-0000-000000000001',
  TRUE,
  TRUE,
  FALSE,
  TRUE,
  500.00
),
(
  'p1000000-0000-0000-0000-000000000002',
  'Pushkar Morning Fine Mulmul Razai',
  'Double-cloth voile quilted with carded organic cotton',
  'pushkar-morning-fine-mulmul-razai',
  'An ethereal cloud of pure warmth. Two whisper-thin layers of hand-spun cotton mulmul filled with carded cotton, hand-quilted by women needlecrafters in Barmer using traditional tagai stitching.',
  'Light as a breeze yet comforting for all-season sleep. The botanical print captures the dawn lotus blooms on Pushkar Lake during the auspicious Kartik month.',
  'Dry clean recommended for first two seasons, or gentle cold hand wash. Fluff in morning sunlight for twenty minutes once a month.',
  'Double / Queen: 90 x 100 inches (1.4 kg fill) | King: 108 x 108 inches (1.8 kg fill)',
  'Mulmul Voile Double Cloth',
  300,
  'Handspun Cotton Mulmul with Carded Cotton Batting',
  TRUE,
  3850.00,
  4600.00,
  'c1000000-0000-0000-0000-000000000002',
  TRUE,
  TRUE,
  FALSE,
  TRUE,
  500.00
),
(
  'p1000000-0000-0000-0000-000000000003',
  'Gulabi Bagh 600TC Cotton Sateen King Bed Set',
  'High-density heirloom luster with subtle rose madder tint',
  'gulabi-bagh-600tc-cotton-sateen-king-bed-set',
  'Our most opulent weave. Spun from rare extra-long staple Suvin cotton at 600 single-ply threads per square inch. Yields a liquid drape that glides effortlessly over skin with zero synthetics.',
  'Named after the historic rose gardens of the Jaipur royal court. The delicate pink blush is attained through repeated immersions in natural rose madder and pomegranate rind extracts.',
  'Machine wash cold on gentle cycle. Use natural non-enzyme detergent. Low tumble dry or line dry in gentle breeze.',
  'King: 108 x 108 inches | Super King: 108 x 120 inches | Pillow Covers: 20 x 30 inches (Pair)',
  '600TC Extra-Long Staple Sateen',
  600,
  '100% Organic Suvin Cotton',
  TRUE,
  4250.00,
  5200.00,
  'c1000000-0000-0000-0000-000000000001',
  TRUE,
  FALSE,
  TRUE,
  TRUE,
  500.00
),
(
  'p1000000-0000-0000-0000-000000000004',
  'Aravali Organic Waffle Spa Bath Towel Set',
  'Honeycomb weave with rapid drying and zero linting',
  'aravali-organic-waffle-spa-bath-towel-set',
  'Woven on traditional frame looms with three-dimensional honeycomb air pockets that drink moisture instantly. Unlike heavy terry towels that trap moisture, these air-dry in less than 40 minutes.',
  'Inspired by the rocky granite ridges of the Aravali range. Hand-fringed by master weavers using unbleached combed cotton yarns.',
  'Machine wash at 40°C. Do not use chemical fabric softeners as they coat the natural waffle cells. Tumble dry to restore honeycomb dimension.',
  'Bath Sheet: 35 x 65 inches | Hand Towel: 18 x 30 inches | Face Cloth: 12 x 12 inches (Set of 3)',
  'Honeycomb Air-Waffle Weave',
  350,
  '100% GOTS Combed Cotton (450 GSM equivalent)',
  TRUE,
  1850.00,
  2400.00,
  'c1000000-0000-0000-0000-000000000003',
  TRUE,
  FALSE,
  FALSE,
  TRUE,
  500.00
),
(
  'p1000000-0000-0000-0000-000000000005',
  'Shekhawati Chintz Floral 300TC Bed Linen Set',
  'Cooling percale with archival Persian indigo vines',
  'shekhawati-chintz-floral-300tc-bed-linen-set',
  'A classic crisp percale bedsheet that sleeps cool through hot tropical nights. Printed with fine botanical chintz motifs adapted from 18th-century Shekhawati haveli fresco murals.',
  'Utilizes authentic natural indigo fermented in mud vats for 14 days, yielding a nuanced shade that subtly enriches with each laundering.',
  'Machine wash cold. Warm iron on reverse to restore crisp matte percale feel.',
  'Double / Queen: 90 x 108 inches | King: 108 x 108 inches | 2 Pillow Shams',
  '300TC Crisp Heritage Percale',
  300,
  '100% Certified Organic Cotton',
  TRUE,
  2550.00,
  3100.00,
  'c1000000-0000-0000-0000-000000000001',
  TRUE,
  FALSE,
  FALSE,
  TRUE,
  500.00
),
(
  'p1000000-0000-0000-0000-000000000006',
  'Jodhpur Heritage Velvet Cushion Covers (Pair)',
  'Heavyweight cotton velvet with antique gold zari piping',
  'jodhpur-heritage-velvet-cushion-covers-pair',
  'Rich architectural elegance for ancestral divans or modern living spaces. Rich cotton velvet piped with genuine antique zari cord and tailored with concealed bottom zip closures.',
  'Crafted in collaboration with the royal atelier embroiderers of Marwar, honoring the deep indigo and rust hues of the Mehrangarh Fort ramparts.',
  'Spot clean with damp cloth or professional dry clean only.',
  '18 x 18 inches (Set of 2 cushion shells)',
  'Royal Cotton Velvet',
  400,
  '100% Cotton Velvet with Metallic Zari Piping',
  FALSE,
  1299.00,
  1650.00,
  'c1000000-0000-0000-0000-000000000004',
  TRUE,
  FALSE,
  TRUE,
  TRUE,
  500.00
),
(
  'p1000000-0000-0000-0000-000000000007',
  'Varanasi Zari Border Mulberry Throw',
  'Weightless pure silk and hand-spun cotton blend throw',
  'varanasi-zari-border-mulberry-throw',
  'A masterwork draped across the foot of a bed or curled upon an armchair. Interwoven with mulberry silk warp and fine cotton weft, bordered by a two-inch woven antique gold brocade edge.',
  'Woven by master weavers on pit looms along the sacred ghats of Varanasi over twelve days.',
  'Dry clean only. Store in pure unbleached muslin wrapping to protect delicate zari.',
  '55 x 75 inches with 3-inch hand-knotted fringe',
  'Silk-Cotton Brocade',
  500,
  '60% Mulberry Silk, 40% Fine Combed Cotton',
  FALSE,
  4650.00,
  5800.00,
  'c1000000-0000-0000-0000-000000000002',
  TRUE,
  FALSE,
  TRUE,
  TRUE,
  500.00
),
(
  'p1000000-0000-0000-0000-000000000008',
  'Maheshwari Handloom Khadi Table Runner & Mats',
  'Fine textured handspun cotton dining ensemble',
  'maheshwari-handloom-khadi-table-runner-mats',
  'Celebrates mindful gathering with natural texture. Includes one generous runner and six matching place mats accented with woven chevron borders and natural ecru selvedges.',
  'Woven on community looms established under the patronage of Rani Ahilyabai Holkar in Maheshwar.',
  'Gentle hand wash with reetha soapnuts. Iron while wet for crisp artisanal drape.',
  'Runner: 16 x 72 inches | Place Mats: 14 x 19 inches (Set of 6)',
  'Textured Khadi Plain Weave',
  250,
  '100% Handspun Artisanal Khadi Cotton',
  TRUE,
  1950.00,
  2450.00,
  'c1000000-0000-0000-0000-000000000004',
  TRUE,
  FALSE,
  FALSE,
  TRUE,
  500.00
)
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  subtitle = EXCLUDED.subtitle,
  description = EXCLUDED.description,
  base_price = EXCLUDED.base_price,
  mrp = EXCLUDED.mrp;

-- 3. SEED PRODUCT VARIANTS
INSERT INTO product_variants (product_id, sku, size, dimensions, price_adjustment, stock_count, is_default)
VALUES
  ('p1000000-0000-0000-0000-000000000001', 'KSM-ML-Q', 'Double / Queen (84x100")', '90x108 inches', 0.00, 25, TRUE),
  ('p1000000-0000-0000-0000-000000000001', 'KSM-ML-K', 'King (108x108")', '108x108 inches', 400.00, 30, FALSE),
  ('p1000000-0000-0000-0000-000000000001', 'KSM-ML-SK', 'Super King (108x120")', '108x120 inches', 850.00, 15, FALSE),

  ('p1000000-0000-0000-0000-000000000002', 'KSM-PM-Q', 'Double / Queen (90x100")', '90x100 inches', 0.00, 18, TRUE),
  ('p1000000-0000-0000-0000-000000000002', 'KSM-PM-K', 'King (108x108")', '108x108 inches', 500.00, 20, FALSE),

  ('p1000000-0000-0000-0000-000000000003', 'KSM-GB-K', 'King (108x108")', '108x108 inches', 0.00, 22, TRUE),
  ('p1000000-0000-0000-0000-000000000003', 'KSM-GB-SK', 'Super King (108x120")', '108x120 inches', 600.00, 12, FALSE),

  ('p1000000-0000-0000-0000-000000000004', 'KSM-AW-SET', 'Set of 3 (Bath + Hand + Face)', 'Full Set', 0.00, 45, TRUE),
  ('p1000000-0000-0000-0000-000000000004', 'KSM-AW-BATH2', 'Pair of Bath Sheets (2x)', '35x65 inches', 350.00, 30, FALSE),

  ('p1000000-0000-0000-0000-000000000005', 'KSM-SC-Q', 'Double / Queen (90x108")', '90x108 inches', 0.00, 28, TRUE),
  ('p1000000-0000-0000-0000-000000000005', 'KSM-SC-K', 'King (108x108")', '108x108 inches', 450.00, 20, FALSE),

  ('p1000000-0000-0000-0000-000000000006', 'KSM-JH-18', '18x18" Pair', '18x18 inches', 0.00, 40, TRUE),
  ('p1000000-0000-0000-0000-000000000006', 'KSM-JH-20', '20x20" Pair', '20x20 inches', 200.00, 25, FALSE),

  ('p1000000-0000-0000-0000-000000000007', 'KSM-VZ-STD', 'Standard Drape (55x75")', '55x75 inches', 0.00, 14, TRUE),

  ('p1000000-0000-0000-0000-000000000008', 'KSM-MH-SET7', '7-Piece Dining Suite', 'Runner + 6 Mats', 0.00, 35, TRUE)
ON CONFLICT (sku) DO NOTHING;

-- 4. SEED PRODUCT SWATCHES & PRIMARY IMAGES
INSERT INTO product_swatches (product_id, name, color_code, image_url, sort_order)
VALUES
  ('p1000000-0000-0000-0000-000000000001', 'Madder Terracotta & Ecru', '#994534', 'https://lh3.googleusercontent.com/aida-public/AB6AXuCYAbKZ33pQ3lzeA69Wjagq1adsg9pG2bitcfb4SF2Ucpw9Kqkq5caInI--jrtMa3MdP5SGA3fSl1n30_rWaHJxO7ygOY761RKwtCmjC8oWX-09qhahrmtrMy_SBGV53qm90csA5_n_lxT_U5aCYj0O9whvpsRZdiNtJS2Aq0nm2ZoUgoQ1JhKEqspLeAOXiW5axgSL8ybs68JZzYjtsjqFvccn0KPnsN577qzzuryYYTZiH9KPVmiD8A', 1),
  ('p1000000-0000-0000-0000-000000000001', 'Haldi Ochre & Indigo', '#C9A24D', 'https://lh3.googleusercontent.com/aida-public/AB6AXuBMHRbI_YXk7MyRTDrm0hmu3xUYxabC7JyHjcN3ysQyQW24COrbsYpXj7omIwQdpblTMInXRS-L_YiM2EOemTzqPt6ymAOEzXysZs7oQpWqN86xhTY2Uok_9WDk9RoCS0JV21zqoWKwIHomGpaqYK7wiO5zHslThM3-gsD7sIYsgR36J3yoygv-JDiGLkeS3AgbqyzNcSN57qZFeYq36tOSjWBLKnPazTOuhFziuGKcK57oyJLFuPu7YQ', 2),
  ('p1000000-0000-0000-0000-000000000001', 'Olive Leaf Sage', '#616136', 'https://lh3.googleusercontent.com/aida-public/AB6AXuCaxj6myT1QzlUhNURqvcGCAIBGmDq9NJSDmc4_el1ewD_AIW5uW6YaNonlOixklKpEJF8kmqX4Qrx_sfv4IyBFK03LGNBxgQgU_dlmSMJltew5kKMT54W8xA7TV6gvzjWm5OlyyPUu9h8upyTf01GItu6Z8wIwwYvsluz2RpAVKE4P-ic3UnMmWTdjXGC1RFrLzRmXDbbQi3kW7BAYKQ8RMQ2QAQvihSm7LGGMX-OKC_WkOGGTCpImbw', 3),

  ('p1000000-0000-0000-0000-000000000002', 'Morning Lotus Voile', '#FBEAE5', 'https://lh3.googleusercontent.com/aida-public/AB6AXuCaxj6myT1QzlUhNURqvcGCAIBGmDq9NJSDmc4_el1ewD_AIW5uW6YaNonlOixklKpEJF8kmqX4Qrx_sfv4IyBFK03LGNBxgQgU_dlmSMJltew5kKMT54W8xA7TV6gvzjWm5OlyyPUu9h8upyTf01GItu6Z8wIwwYvsluz2RpAVKE4P-ic3UnMmWTdjXGC1RFrLzRmXDbbQi3kW7BAYKQ8RMQ2QAQvihSm7LGGMX-OKC_WkOGGTCpImbw', 1),
  ('p1000000-0000-0000-0000-000000000003', 'Gulabi Rose Blush', '#5C181A', 'https://lh3.googleusercontent.com/aida-public/AB6AXuBTS-aw_TUNsy6opw3yi5KDRIQodWNHaGv0Tp7tTw62n7v-zbQNySQw0LxnPDy-AjHW3XrrpbFHBC_wcH7KG5TAz3nH2EYKKiykyLe8gsIfRlIx8bAsIc7a82DsuDHCXXtyAv6z6_KWrI59aejNURUpp9W6GDtOTNeW3A1Ph30UW4w7-vEttvgaQ0qxb0wfQRZ21qwdgnV03kcgxZdXZe8fY4XXoQ0nEwMBFW-LYAYEnnFcHijyQ-Y-ig', 1),
  ('p1000000-0000-0000-0000-000000000004', 'Ivory & Baked Terracotta', '#994534', 'https://lh3.googleusercontent.com/aida-public/AB6AXuBG21fwCILGL3KU8ZGOAAEfKsOMn0uigAI1fgCtxuqAKmAfHkktjSBKhZWQEdN2xqF8zYLaxGM9bmPEnEOYf0nfukWoojySCR__twaMq4z5UaACVxMykdtAk_G6iWRFm0dIoNJjHCTGUsZII1dMwh80QwLO914wKsbfH-h2NloIvLN0-FIs2iDlAp23yICkc_VHDDDjqSJUFVfkfCf2d5RP7vWB5bRjA9nnX7-pDGn8Xgof1M3EaDzzTw', 1)
ON CONFLICT DO NOTHING;

INSERT INTO product_images (product_id, image_url, alt_text, is_primary, sort_order)
VALUES
  ('p1000000-0000-0000-0000-000000000001', 'https://lh3.googleusercontent.com/aida-public/AB6AXuCYAbKZ33pQ3lzeA69Wjagq1adsg9pG2bitcfb4SF2Ucpw9Kqkq5caInI--jrtMa3MdP5SGA3fSl1n30_rWaHJxO7ygOY761RKwtCmjC8oWX-09qhahrmtrMy_SBGV53qm90csA5_n_lxT_U5aCYj0O9whvpsRZdiNtJS2Aq0nm2ZoUgoQ1JhKEqspLeAOXiW5axgSL8ybs68JZzYjtsjqFvccn0KPnsN577qzzuryYYTZiH9KPVmiD8A', 'Marwar Lotus 400TC Bedsheet in Rajasthani Haveli setting', TRUE, 1),
  ('p1000000-0000-0000-0000-000000000001', 'https://lh3.googleusercontent.com/aida-public/AB6AXuBMHRbI_YXk7MyRTDrm0hmu3xUYxabC7JyHjcN3ysQyQW24COrbsYpXj7omIwQdpblTMInXRS-L_YiM2EOemTzqPt6ymAOEzXysZs7oQpWqN86xhTY2Uok_9WDk9RoCS0JV21zqoWKwIHomGpaqYK7wiO5zHslThM3-gsD7sIYsgR36J3yoygv-JDiGLkeS3AgbqyzNcSN57qZFeYq36tOSjWBLKnPazTOuhFziuGKcK57oyJLFuPu7YQ', 'Close up of wooden block stamp and weave texture', FALSE, 2),
  ('p1000000-0000-0000-0000-000000000002', 'https://lh3.googleusercontent.com/aida-public/AB6AXuCaxj6myT1QzlUhNURqvcGCAIBGmDq9NJSDmc4_el1ewD_AIW5uW6YaNonlOixklKpEJF8kmqX4Qrx_sfv4IyBFK03LGNBxgQgU_dlmSMJltew5kKMT54W8xA7TV6gvzjWm5OlyyPUu9h8upyTf01GItu6Z8wIwwYvsluz2RpAVKE4P-ic3UnMmWTdjXGC1RFrLzRmXDbbQi3kW7BAYKQ8RMQ2QAQvihSm7LGGMX-OKC_WkOGGTCpImbw', 'Pushkar Morning Fine Mulmul Razai folded with kantha stitching', TRUE, 1),
  ('p1000000-0000-0000-0000-000000000003', 'https://lh3.googleusercontent.com/aida-public/AB6AXuBTS-aw_TUNsy6opw3yi5KDRIQodWNHaGv0Tp7tTw62n7v-zbQNySQw0LxnPDy-AjHW3XrrpbFHBC_wcH7KG5TAz3nH2EYKKiykyLe8gsIfRlIx8bAsIc7a82DsuDHCXXtyAv6z6_KWrI59aejNURUpp9W6GDtOTNeW3A1Ph30UW4w7-vEttvgaQ0qxb0wfQRZ21qwdgnV03kcgxZdXZe8fY4XXoQ0nEwMBFW-LYAYEnnFcHijyQ-Y-ig', 'Gulabi Bagh 600TC Cotton Sateen King Bed Set', TRUE, 1),
  ('p1000000-0000-0000-0000-000000000004', 'https://lh3.googleusercontent.com/aida-public/AB6AXuBG21fwCILGL3KU8ZGOAAEfKsOMn0uigAI1fgCtxuqAKmAfHkktjSBKhZWQEdN2xqF8zYLaxGM9bmPEnEOYf0nfukWoojySCR__twaMq4z5UaACVxMykdtAk_G6iWRFm0dIoNJjHCTGUsZII1dMwh80QwLO914wKsbfH-h2NloIvLN0-FIs2iDlAp23yICkc_VHDDDjqSJUFVfkfCf2d5RP7vWB5bRjA9nnX7-pDGn8Xgof1M3EaDzzTw', 'Aravali Organic Waffle Spa Bath Towel Set', TRUE, 1),
  ('p1000000-0000-0000-0000-000000000005', 'https://lh3.googleusercontent.com/aida-public/AB6AXuCzin4Wi7KZycZg57LUrvwiWIDRwbjfxrGPD2Dc04Mj9ZvN8JdObg4TMxYfFJT9Uo_AHduM7gJU517n9OxJ2o7_6S-v7ZPjS8qLI-SXDai_Tq1jtoVLqhRTjXYgY65efkJbskGPSV5HvceFrzUBoYQEqifgJ0wVWPvln3hTLXJXRhnrwE7a0q3Y2LigaP2FW-i9z2xF28jH6FbX-AcLA_3KL1lEBVsFsUHKYlezs46Z58end20ECx8O1w', 'Shekhawati Chintz Floral 300TC Bed Linen Set', TRUE, 1),
  ('p1000000-0000-0000-0000-000000000006', 'https://lh3.googleusercontent.com/aida-public/AB6AXuBa0aTlB2k5SuCbCtFSeriRz3__YgsOLfPR_Pbu9ctlW7-W0DvniMiRvChWVOB6WkvnDORZEo6REOXHg1SD_jFmCtZ96776rvOGo6Cavmq8szak9VMoYctlbw86thBW3vGRHMI-huovTJZTBSiGwfzMsCPAQ92jHM4o9KrOF7KvuPIiFbYAreY9GoEmvKB21BBENwu_kbLU7eGt-LUf8btRy0d6DQHGL0Y9E2XvFOMua7xJK4Sh1MsRPA', 'Jodhpur Heritage Velvet Cushion Covers Pair', TRUE, 1),
  ('p1000000-0000-0000-0000-000000000007', 'https://lh3.googleusercontent.com/aida-public/AB6AXuDwmTPn8oIKcK4Rm9gv22c2oPm5ApGMu93bYM6HFchSUhpFFRT6xvAG1td8cKKdB0xLInoT9LWySGrlE0vG_kJceITu1qZr4gEY-M0QJocf5GfcTDctBcTqsoNHmJZ3fRtdN9OmUHVELy3sJQZ5Sn1MWNUKnS8CwB9176sjEo5YjwS9LnRFc_SrKMaUzV7NHDa0EX5jyfU1gf5R7L0-Xa0VtxbzL9dzQppXpcgftr8oCIGxE82wfwqDhQ', 'Varanasi Zari Border Mulberry Throw', TRUE, 1),
  ('p1000000-0000-0000-0000-000000000008', 'https://lh3.googleusercontent.com/aida-public/AB6AXuCYAbKZ33pQ3lzeA69Wjagq1adsg9pG2bitcfb4SF2Ucpw9Kqkq5caInI--jrtMa3MdP5SGA3fSl1n30_rWaHJxO7ygOY761RKwtCmjC8oWX-09qhahrmtrMy_SBGV53qm90csA5_n_lxT_U5aCYj0O9whvpsRZdiNtJS2Aq0nm2ZoUgoQ1JhKEqspLeAOXiW5axgSL8ybs68JZzYjtsjqFvccn0KPnsN577qzzuryYYTZiH9KPVmiD8A', 'Maheshwari Handloom Khadi Table Runner & Mats', TRUE, 1)
ON CONFLICT DO NOTHING;

-- 5. SEED ACTIVE COUPONS
INSERT INTO coupons (code, type, value, min_order_amount, description, is_active)
VALUES
  ('FESTIVE500', 'flat', 500.00, 2500.00, '₹500 flat off on festive orders above ₹2,500', TRUE),
  ('KUSUMIKA10', 'percent', 10.00, 0.00, '10% privilege discount on all handloom weaves', TRUE),
  ('WELCOME15', 'percent', 15.00, 3000.00, '15% off on your first sanctuary acquisition', TRUE)
ON CONFLICT (code) DO UPDATE SET
  value = EXCLUDED.value,
  min_order_amount = EXCLUDED.min_order_amount,
  is_active = EXCLUDED.is_active;

-- 6. SEED VERIFIED CUSTOMER REVIEWS
INSERT INTO reviews (product_id, customer_name, rating, title, comment, verified_purchase, is_approved)
VALUES
  (
    'p1000000-0000-0000-0000-000000000001',
    'Gayatri Devi Singhania',
    5,
    'Transformed our guest sanctuary',
    'The 400TC weave feels exactly as described: cool, soothing, and utterly luxurious without the slippery artificial feeling of polyester. You can genuinely smell the natural herbal wash.',
    TRUE,
    TRUE
  ),
  (
    'p1000000-0000-0000-0000-000000000001',
    'Arjun & Meera Sen',
    5,
    'Heirloom craftsmanship that withstands washing',
    'We were hesitant about natural vegetable dyes bleeding, but following the care guide with cold water kept the madder and ochre tones pristine. Truly soft like silk.',
    TRUE,
    TRUE
  ),
  (
    'p1000000-0000-0000-0000-000000000002',
    'Sunita M., Bangalore',
    5,
    'Like sleeping beneath a warm cloud',
    'The tagai needlework is so precise. We use it with the air conditioner on and wake up without feeling dry or weighed down. The mulmul fabric is unmatched.',
    TRUE,
    TRUE
  );

-- 7. SEED SAMPLE TRADE LEAD (B2B)
INSERT INTO leads (
  inquiry_number, contact_name, business_name, establishment_nature,
  email, phone, city, pincode, categories_needed, weave_grade,
  quantity_tier, bed_sizes, branding_option, timeline, notes, swatch_binder_requested, status
)
VALUES (
  'INQ-KSM-8841',
  'Vikramaditya Rathore',
  'Samode Haveli Heritage Retreat',
  'Boutique Hotel / Haveli',
  'procurement@samodehaveli.com',
  '+91 98290 12345',
  'Jaipur, Rajasthan',
  '302002',
  ARRAY['Bedsheets & Pillow Shams', 'Dohars & Fine Razais'],
  '400TC Sateen Luster Weave (Silken Hospitality Finish)',
  '26 – 50 Sets (35% Loom Discount)',
  ARRAY['King (108×108")', 'Queen (90×100")'],
  'Haveli Crest Embroidery & Woven Property Label',
  'Planned Suite Opening (3-4 weeks turnaround)',
  'Need tone-on-tone sand embroidery of the Samode lotus crest on all pillow flanges.',
  TRUE,
  'quote_sent'
)
ON CONFLICT (inquiry_number) DO NOTHING;
