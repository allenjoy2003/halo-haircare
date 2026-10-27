import decimal
from django.core.management.base import BaseCommand
from store.models import (
    Category,
    HairConcern,
    HairType,
    Product,
    RoutineBundle,
    CustomerReview
)


class Command(BaseCommand):
    help = "Seed database with 24+ premium science-clarified haircare products, routine bundles, and reviews"

    def handle(self, *args, **options):
        self.stdout.write(self.style.NOTICE("Clearing old data..."))
        Product.objects.all().delete()
        RoutineBundle.objects.all().delete()
        Category.objects.all().delete()
        HairConcern.objects.all().delete()
        HairType.objects.all().delete()
        CustomerReview.objects.all().delete()

        self.stdout.write(self.style.NOTICE("Seeding Categories..."))
        cat_scalp = Category.objects.create(
            name="Scalp Solutions & Oils",
            slug="scalp-solutions-oils",
            description="Root-strengthening elixirs and exfoliating serums to reset the scalp microbiome.",
            image_url="https://images.unsplash.com/photo-1608248597359-00918c8b417c?auto=format&fit=crop&w=600&q=80",
            order=1
        )
        cat_cleanse = Category.objects.create(
            name="Cleanse & Clarify",
            slug="cleanse-clarify",
            description="Sulfate-free, pH-balanced washes infused with saponin-rich botanicals and clinical actives.",
            image_url="https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?auto=format&fit=crop&w=600&q=80",
            order=2
        )
        cat_condition = Category.objects.create(
            name="Conditioners & Rinses",
            slug="conditioners-rinses",
            description="Weightless slip and 18-MEA cuticle sealants without silicone buildup.",
            image_url="https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=600&q=80",
            order=3
        )
        cat_treat = Category.objects.create(
            name="Deep Treatments & Masks",
            slug="treatments-masks",
            description="Intensive biomimetic protein repair and moisture infusions for porous strands.",
            image_url="https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=600&q=80",
            order=4
        )
        cat_style = Category.objects.create(
            name="Styling & Curl Definers",
            slug="styling-definers",
            description="Flaxseed gels, wave sprays, and curl balms formulated for weather-proof hold.",
            image_url="https://images.unsplash.com/photo-1526947425960-945c6e72858f?auto=format&fit=crop&w=600&q=80",
            order=5
        )
        cat_leavein = Category.objects.create(
            name="Leave-ins & Heat Protectants",
            slug="leaveins-protectants",
            description="Daily shields against hard water mineral deposits, UV oxidation, and 230°C thermal tools.",
            image_url="https://images.unsplash.com/photo-1571781926291-c477ebfd024b?auto=format&fit=crop&w=600&q=80",
            order=6
        )

        self.stdout.write(self.style.NOTICE("Seeding Hair Concerns..."))
        concern_dandruff = HairConcern.objects.create(
            name="Dandruff & Scalp Itch",
            slug="dandruff-itch",
            description="Flakes, fungal dysbiosis, and irritated roots.",
            icon_name="ShieldAlert"
        )
        concern_frizz = HairConcern.objects.create(
            name="Frizz & Humidity Shield",
            slug="frizz-humidity",
            description="Puffiness, atmospheric swelling, and flyaways.",
            icon_name="CloudRain"
        )
        concern_hairfall = HairConcern.objects.create(
            name="Hair Fall & Thinning",
            slug="hairfall-thinning",
            description="Excessive shedding, weak follicles, and sparse density.",
            icon_name="TrendingDown"
        )
        concern_hardwater = HairConcern.objects.create(
            name="Hard Water Damage",
            slug="hard-water-damage",
            description="Calcium calcification, straw texture, and brassy dullness.",
            icon_name="Droplets"
        )
        concern_dryness = HairConcern.objects.create(
            name="Dry & Damaged Strands",
            slug="dry-damaged",
            description="Brittle texture, chemical bleach damage, and split ends.",
            icon_name="Flame"
        )
        concern_curl_definition = HairConcern.objects.create(
            name="Limp & Undefined Curls",
            slug="curl-definition",
            description="Loss of bounce, undefined wave clumps, and lack of hold.",
            icon_name="Waves"
        )

        self.stdout.write(self.style.NOTICE("Seeding Hair Types..."))
        ht_straight = HairType.objects.create(
            name="Straight Hair",
            code="1A - 1C",
            slug="straight",
            description="Strands with no visible curl pattern; prone to scalp oiliness and flat roots."
        )
        ht_wavy = HairType.objects.create(
            name="Wavy Hair",
            code="2A - 2C",
            slug="wavy",
            description="S-pattern bends with mixed dry ends and prone to monsoon humidity frizz."
        )
        ht_curly = HairType.objects.create(
            name="Curly Hair",
            code="3A - 3C",
            slug="curly",
            description="Defined spiral ringlets requiring deep hydration and botanical film sealants."
        )
        ht_coily = HairType.objects.create(
            name="Coily & Kinky Hair",
            code="4A - 4C",
            slug="coily",
            description="Tight zig-zag coils with delicate cuticle structure demanding lipid butters."
        )

        self.stdout.write(self.style.NOTICE("Seeding Products..."))
        
        products_data = [
            # 1. Scalp Pre-Wash Clarifier
            {
                "title": "Scalp Clarifying BHA & Neem Pre-Wash Elixir",
                "subtitle": "2% Salicylic Acid + Cold-Pressed Neem & Rosemary Oil",
                "slug": "scalp-clarifying-bha-neem-prewash-elixir",
                "category": cat_scalp,
                "price": decimal.Decimal("849.00"),
                "discount_price": decimal.Decimal("699.00"),
                "routine_step": "prep",
                "size": "100 ml / 3.38 fl. oz.",
                "key_ingredients": "Salicylic Acid 2%, Pure Neem Extract, Rosemary Leaf Oil, Tea Tree Terpenes, Jojoba Carrier Base",
                "botanical_actives": "Cold-Pressed Neem, Rosemary Cineole, Tea Tree",
                "clinical_actives": "2% Salicylic Acid (BHA), Caprylic Triglycerides",
                "benefits": "Dissolves stubborn flaky sebum plugs within 15 minutes. Regulates Malassezia yeast and decongests the follicular ostium.",
                "usage_instructions": "Part dry hair and apply 2-3 pipettes directly to scalp. Massage gently in circles for 3 minutes. Leave for 20 minutes before shampooing.",
                "texture_description": "Weightless dry-oil nectar that rinses clean",
                "aroma_notes": "Invigorating Herbaceous Rosemary, Tea Tree & Sweet Orange",
                "ph_level": "pH Balanced Formulation",
                "image_url": "https://images.unsplash.com/photo-1608248597359-00918c8b417c?auto=format&fit=crop&w=700&q=80",
                "rating": decimal.Decimal("4.92"),
                "review_count": 248,
                "is_bestseller": True,
                "concerns": [concern_dandruff, concern_hairfall],
                "hair_types": [ht_straight, ht_wavy, ht_curly, ht_coily]
            },
            # 2. Hard Water Chelating Shampoo
            {
                "title": "Hard Water Defense & Chelating Shampoo",
                "subtitle": "Apple Cider Vinegar + Shikakai Saponins + EDTA-Alternative Phytic Acid",
                "slug": "hard-water-defense-chelating-shampoo",
                "category": cat_cleanse,
                "price": decimal.Decimal("949.00"),
                "discount_price": decimal.Decimal("799.00"),
                "routine_step": "cleanse",
                "size": "250 ml / 8.45 fl. oz.",
                "key_ingredients": "Phytic Acid 1.5%, Fermented Himalayan Apple Cider Vinegar, Shikakai & Reetha Infusion, Niacinamide",
                "botanical_actives": "Shikakai, Reetha, Raw Apple Cider Vinegar",
                "clinical_actives": "Bio-chelation Phytic Acid Complex, Niacinamide 2%",
                "benefits": "Dissolves hard water calcium and magnesium mineral crust. Re-balances scalp pH to 5.2 and restores diamond shine.",
                "usage_instructions": "Massage thoroughly into soaking wet roots for 60 seconds to activate micro-bubbles. Rinse with lukewarm water.",
                "texture_description": "Silky golden gel with dense sulfate-free lather",
                "aroma_notes": "Crisp Green Apple, Crushed Mint & Bergamot",
                "ph_level": "pH 5.2 (Acidic Cuticle Seal)",
                "image_url": "https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?auto=format&fit=crop&w=700&q=80",
                "rating": decimal.Decimal("4.88"),
                "review_count": 312,
                "is_bestseller": True,
                "concerns": [concern_hardwater, concern_dandruff, concern_frizz],
                "hair_types": [ht_straight, ht_wavy, ht_curly, ht_coily]
            },
            # 3. Frizz Control Moisture Shampoo
            {
                "title": "Monsoon Moisture & Frizz Shield Shampoo",
                "subtitle": "Hydrolyzed Rice Water + Bhringraj + Coconut Iselux™ Cleansers",
                "slug": "monsoon-moisture-frizz-shield-shampoo",
                "category": cat_cleanse,
                "price": decimal.Decimal("899.00"),
                "discount_price": decimal.Decimal("749.00"),
                "routine_step": "cleanse",
                "size": "250 ml / 8.45 fl. oz.",
                "key_ingredients": "Fermented Rice Water Bioferment, Bhringraj Extract, Aloe Vera Leaf Juice, Hydrolyzed Wheat Protein",
                "botanical_actives": "Bhringraj, Aloe Barbadensis, Marshmallow Root",
                "clinical_actives": "Sodium Cocoyl Isethionate, Panthenol Provitamin B5",
                "benefits": "Shields strands against 90%+ relative humidity. Fills porous cuticle gaps and prevents halo puffiness without weight.",
                "usage_instructions": "Lather onto wet roots. Gently sweep lather through mid-lengths and rinse thoroughly.",
                "texture_description": "Pearly milky cream that melts into luscious foam",
                "aroma_notes": "Jasmine Sambac, White Tea & Cedarwood",
                "ph_level": "pH 5.5",
                "image_url": "https://images.unsplash.com/photo-1585751119414-ef2636f8aede?auto=format&fit=crop&w=700&q=80",
                "rating": decimal.Decimal("4.85"),
                "review_count": 184,
                "is_bestseller": False,
                "concerns": [concern_frizz, concern_dryness],
                "hair_types": [ht_wavy, ht_curly, ht_coily]
            },
            # 4. Anti-Hair Fall Stimulating Shampoo
            {
                "title": "Root Awakening & Follicle Densifying Shampoo",
                "subtitle": "Copper Tripeptide-1 + Redensyl-Grade Actives + Methi & Amla",
                "slug": "root-awakening-follicle-densifying-shampoo",
                "category": cat_cleanse,
                "price": decimal.Decimal("999.00"),
                "discount_price": decimal.Decimal("849.00"),
                "routine_step": "cleanse",
                "size": "250 ml / 8.45 fl. oz.",
                "key_ingredients": "Copper Tripeptide-1, Redensyl Biomimetic Complex, Fenugreek (Methi) Sprout Extract, Indian Gooseberry (Amla)",
                "botanical_actives": "Methi, Amla, Brahmi, Hibiscus Rosa-Sinensis",
                "clinical_actives": "Copper Tripeptide-1, Caffeine 1%, Zinc Glycinate",
                "benefits": "Reduces telogen shedding by up to 72% in 45 days. Stimulates micro-capillary nutrient delivery to dermal papilla cells.",
                "usage_instructions": "Apply to wet scalp. Massage with fingertips for 2 full minutes to allow peptide absorption before rinsing.",
                "texture_description": "Botanical amber gel with subtle warming sensation",
                "aroma_notes": "Warm Sandalwood, Cardamom & Clary Sage",
                "ph_level": "pH 5.4",
                "image_url": "https://images.unsplash.com/photo-1527799820374-dcf8d9d4a388?auto=format&fit=crop&w=700&q=80",
                "rating": decimal.Decimal("4.94"),
                "review_count": 420,
                "is_bestseller": True,
                "concerns": [concern_hairfall, concern_dandruff],
                "hair_types": [ht_straight, ht_wavy, ht_curly, ht_coily]
            },
            # 5. Velvet Slip Peptide Conditioner
            {
                "title": "Velvet Slip Biomimetic Peptide Conditioner",
                "subtitle": "Rice Ceramides + Murumuru Butter + Fenugreek Mucilage",
                "slug": "velvet-slip-biomimetic-peptide-conditioner",
                "category": cat_condition,
                "price": decimal.Decimal("899.00"),
                "discount_price": decimal.Decimal("765.00"),
                "routine_step": "condition",
                "size": "200 ml / 6.76 fl. oz.",
                "key_ingredients": "Ceramide NP, Hydrolyzed Rice Peptide, Amazonian Murumuru Butter, Fenugreek Seed Mucilage",
                "botanical_actives": "Fenugreek, Kokum Butter, Gotu Kola",
                "clinical_actives": "Ceramide Complex, Behentrimonium Methosulfate (rapeseed-derived)",
                "benefits": "Instantly melts knots and provides effortless glide. Re-bonds the hydrophobic 18-MEA layer without pore-clogging silicones.",
                "usage_instructions": "Glide generously through damp mid-lengths and ends. Finger-detangle starting from tips upward. Leave for 3 minutes and rinse.",
                "texture_description": "Whipped velvety cream with immediate melting slip",
                "aroma_notes": "Wild Neroli, Sweet Fig & Vetiver",
                "ph_level": "pH 4.8",
                "image_url": "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=700&q=80",
                "rating": decimal.Decimal("4.89"),
                "review_count": 195,
                "is_bestseller": True,
                "concerns": [concern_frizz, concern_dryness, concern_curl_definition],
                "hair_types": [ht_wavy, ht_curly, ht_coily]
            },
            # 6. Weightless Volume Feather Conditioner
            {
                "title": "Feather-Light Hydrating & Detangling Rinse",
                "subtitle": "Bamboo Silica + Brahmi + Squalane for Fine, Straight & Oily Hair",
                "slug": "feather-light-hydrating-detangling-rinse",
                "category": cat_condition,
                "price": decimal.Decimal("849.00"),
                "discount_price": decimal.Decimal("720.00"),
                "routine_step": "condition",
                "size": "200 ml / 6.76 fl. oz.",
                "key_ingredients": "Bamboo Stem Silica, Brahmi Infusion, 100% Plant Squalane, Green Tea Polyphenols",
                "botanical_actives": "Brahmi, Green Tea, Bamboo Ferment",
                "clinical_actives": "Olive-derived Squalane, Hydrolyzed Pea Protein",
                "benefits": "Provides knot-free detangling without pulling hair flat. Leaves fine waves and straight strands bouncy and silky.",
                "usage_instructions": "Apply 1-2 pumps only from mid-lengths to ends. Rinse cleanly after 60 seconds with cool water.",
                "texture_description": "Translucent milky fluid that rinses clean instantly",
                "aroma_notes": "Japanese Yuzu, Lemongrass & White Cedar",
                "ph_level": "pH 5.0",
                "image_url": "https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=700&q=80",
                "rating": decimal.Decimal("4.78"),
                "review_count": 114,
                "is_bestseller": False,
                "concerns": [concern_hardwater, concern_frizz],
                "hair_types": [ht_straight, ht_wavy]
            },
            # 7. Intensive Bond Rebuild Repair Mask
            {
                "title": "Ayur-Keratin Deep Bond Repair & Moisture Mask",
                "subtitle": "Hydrolzyed Quinoa + Gotu Kola + Cold-Pressed Castor & Argan Lipids",
                "slug": "ayur-keratin-deep-bond-repair-moisture-mask",
                "category": cat_treat,
                "price": decimal.Decimal("1199.00"),
                "discount_price": decimal.Decimal("999.00"),
                "routine_step": "treat",
                "size": "200 g / 7.05 oz.",
                "key_ingredients": "Hydrolyzed Quinoa Protein, Centella Asiatica (Gotu Kola), Pure Cold-Pressed Argan Oil, Hyaluronic Acid",
                "botanical_actives": "Gotu Kola, Castor Oil, Hibiscus Petals",
                "clinical_actives": "Biomimetic Keratin Peptides, Multi-molecular Hyaluronic Acid",
                "benefits": "Re-architects fractured disulfide bonds damaged by chemical bleach, hot tools, and environmental minerals. 88% reduction in split ends.",
                "usage_instructions": "Once or twice a week, coat damp hair from mid-lengths to ends. Cover with warm shower cap for 15 minutes. Rinse with cool water.",
                "texture_description": "Rich decadent botanical soufflé",
                "aroma_notes": "Warm Madagascar Vanilla, Amber & Cardamom Pods",
                "ph_level": "pH 4.5 (Deep Cuticle Sealing)",
                "image_url": "https://images.unsplash.com/photo-1526947425960-945c6e72858f?auto=format&fit=crop&w=700&q=80",
                "rating": decimal.Decimal("4.96"),
                "review_count": 358,
                "is_bestseller": True,
                "concerns": [concern_dryness, concern_hardwater, concern_frizz],
                "hair_types": [ht_wavy, ht_curly, ht_coily]
            },
            # 8. Flaxseed & Chia Defining Gel
            {
                "title": "Flaxseed & Chia Humidity-Proof Curl Defining Gel",
                "subtitle": "Golden Flax Mucilage + Chia Seed Polysaccharides + Hibiscus Gloss",
                "slug": "flaxseed-chia-humidity-proof-curl-defining-gel",
                "category": cat_style,
                "price": decimal.Decimal("899.00"),
                "discount_price": decimal.Decimal("749.00"),
                "routine_step": "define",
                "size": "250 ml / 8.45 fl. oz.",
                "key_ingredients": "Whole Golden Flaxseed Extract, Salvia Hispanica (Chia) Seed Gel, Hibiscus Flower Infusion, Vegetable Glycerin",
                "botanical_actives": "Flaxseed (Alsi), Chia Seed, Hibiscus",
                "clinical_actives": "Polyquaternium-69 (non-drying polymer), Panthenol",
                "benefits": "Forms a crunch-free, flexible humidity shield that seals wave and curl clumps for 72 hours even in 85% monsoon moisture.",
                "usage_instructions": "Glaze and scrunch into dripping-wet hair in sections. Air-dry or diffuse. Once 100% dry, scrunch out the cast with 2 drops of serum.",
                "texture_description": "Clear bouncy jelly with zero stickiness or flake",
                "aroma_notes": "Fresh Rose Damascena, Lotus & Lychee",
                "ph_level": "pH 5.4",
                "image_url": "https://images.unsplash.com/photo-1571781926291-c477ebfd024b?auto=format&fit=crop&w=700&q=80",
                "rating": decimal.Decimal("4.91"),
                "review_count": 270,
                "is_bestseller": True,
                "concerns": [concern_frizz, concern_curl_definition],
                "hair_types": [ht_wavy, ht_curly, ht_coily]
            },
            # 9. Leave-in Moisture Milk
            {
                "title": "Cashmere Strands Peptide Leave-In Moisture Milk",
                "subtitle": "Hydrolyzed Silk Peptides + Amla Nectar + Moringa Oil",
                "slug": "cashmere-strands-peptide-leave-in-moisture-milk",
                "category": cat_leavein,
                "price": decimal.Decimal("949.00"),
                "discount_price": decimal.Decimal("799.00"),
                "routine_step": "define",
                "size": "150 ml / 5.07 fl. oz.",
                "key_ingredients": "Hydrolyzed Silk Peptides, Amla Supercritical Extract, Moringa Oleifera Seed Oil, Sodium Hyaluronate",
                "botanical_actives": "Amla, Moringa, Licorice Root",
                "clinical_actives": "Silk Peptides, Sodium Hyaluronate, Tocopherol",
                "benefits": "Quenches dehydrated hair shafts, prevents weather-induced frizz halo, and leaves hair feeling like spun silk.",
                "usage_instructions": "Rake a nickel-sized amount through towel-damp hair from mid-shaft to ends before styling or blow-drying.",
                "texture_description": "Silky, lightweight lotion that absorbs without residue",
                "aroma_notes": "Sweet Almond, Orange Blossom & Sandalwood",
                "ph_level": "pH 5.0",
                "image_url": "https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?auto=format&fit=crop&w=700&q=80",
                "rating": decimal.Decimal("4.87"),
                "review_count": 162,
                "is_bestseller": False,
                "concerns": [concern_dryness, concern_frizz, concern_curl_definition],
                "hair_types": [ht_straight, ht_wavy, ht_curly, ht_coily]
            },
            # 10. Thermal & UV Defense Gloss Serum
            {
                "title": "Solar & Heat Defense 230°C Glass-Shine Elixir",
                "subtitle": "Golden Jojoba + Karanja Oil + Bio-Silicone Alternatives",
                "slug": "solar-heat-defense-glass-shine-elixir",
                "category": cat_leavein,
                "price": decimal.Decimal("1099.00"),
                "discount_price": decimal.Decimal("899.00"),
                "routine_step": "protect",
                "size": "50 ml / 1.69 fl. oz.",
                "key_ingredients": "Karanja Seed Oil (Natural UV absorber), Cold-Pressed Jojoba Oil, Hemisqualane, Camellia Tsubaki Oil",
                "botanical_actives": "Karanja, Camellia, Sea Buckthorn",
                "clinical_actives": "Plant Hemisqualane, Thermal Polymer Shield",
                "benefits": "Provides 230°C thermal protection and shields cuticles from harsh UV melanin degradation. Imparts a mirror-like glass reflection.",
                "usage_instructions": "Warm 2-3 drops between palms and sweep over finished dry hair to break gel cast or seal blowout shine.",
                "texture_description": "Ultralight dry-oil gloss that absorbs instantly",
                "aroma_notes": "Warm Golden Amber, Cedar & Bergamot",
                "ph_level": "Anhydrous Formula",
                "image_url": "https://images.unsplash.com/photo-1608248597359-00918c8b417c?auto=format&fit=crop&w=700&q=80",
                "rating": decimal.Decimal("4.93"),
                "review_count": 210,
                "is_bestseller": True,
                "concerns": [concern_dryness, concern_hardwater, concern_frizz],
                "hair_types": [ht_straight, ht_wavy, ht_curly, ht_coily]
            },
            # 11. Rosemary Peptides Density Drops
            {
                "title": "Follicle Activator Rosemary & Redensyl Scalp Drops",
                "subtitle": "Water-Based Night Serum with 3% Redensyl + Pure Rosemary Extract",
                "slug": "follicle-activator-rosemary-redensyl-scalp-drops",
                "category": cat_scalp,
                "price": decimal.Decimal("1299.00"),
                "discount_price": decimal.Decimal("1099.00"),
                "routine_step": "prep",
                "size": "60 ml / 2.02 fl. oz.",
                "key_ingredients": "Rosmarinus Officinalis (Rosemary) Leaf Extract, Redensyl 3%, Procapil 2%, Bhringraj Extract, Biotinoyl Tripeptide",
                "botanical_actives": "Rosemary, Bhringraj, Saw Palmetto, Nettle",
                "clinical_actives": "Redensyl 3%, Procapil 2%, Biotinoyl Tripeptide-1",
                "benefits": "Clinically proven to boost follicle density by 14,000+ hairs over 3 months without greasy residue or rebound shedding.",
                "usage_instructions": "Fill dropper and apply directly to thinning areas across the scalp once nightly before bedtime. Massage gently. Do not rinse.",
                "texture_description": "Water-light non-greasy drops that dry in 60 seconds",
                "aroma_notes": "Subtle Fresh Rosemary & Lavender Flower",
                "ph_level": "pH 5.8",
                "image_url": "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=700&q=80",
                "rating": decimal.Decimal("4.97"),
                "review_count": 540,
                "is_bestseller": True,
                "concerns": [concern_hairfall],
                "hair_types": [ht_straight, ht_wavy, ht_curly, ht_coily]
            },
            # 12. Sea Salt & Hibiscus Wave Defining Spray
            {
                "title": "Coastal Sea Mist & Hibiscus Wave Enhancer",
                "subtitle": "Himalayan Pink Salt + Hibiscus + Aloe Water for 2A-2C Waves",
                "slug": "coastal-sea-mist-hibiscus-wave-enhancer",
                "category": cat_style,
                "price": decimal.Decimal("799.00"),
                "discount_price": decimal.Decimal("649.00"),
                "routine_step": "define",
                "size": "150 ml / 5.07 fl. oz.",
                "key_ingredients": "Purified Mineral Sea Salt, Hibiscus Extract, Aloe Leaf Hydrosol, Provitamin B5",
                "botanical_actives": "Hibiscus, Aloe, Coconut Water",
                "clinical_actives": "Panthenol, Hydrolyzed Corn Starch",
                "benefits": "Brings out natural S-pattern waves with airy volume, texture, and touchable separation. Non-sticky and never crunchy.",
                "usage_instructions": "Mist generously onto damp or dry 2A-2C waves. Scrunch upwards from ends towards roots to encourage bend.",
                "texture_description": "Fine atomized ocean mist",
                "aroma_notes": "Salty Sea Breeze, Coconut Milk & Hibiscus",
                "ph_level": "pH 5.5",
                "image_url": "https://images.unsplash.com/photo-1616683693504-3ea7e9ad6fec?auto=format&fit=crop&w=700&q=80",
                "rating": decimal.Decimal("4.81"),
                "review_count": 138,
                "is_bestseller": False,
                "concerns": [concern_curl_definition, concern_frizz],
                "hair_types": [ht_wavy]
            },
            # 13. Scalp Soothing Salicylic Exfoliating Wash
            {
                "title": "Microbiome Balancing Anti-Dandruff Treatment Shampoo",
                "subtitle": "Piroctone Olamine + Salicylic Acid 1% + Tea Tree & Aloe",
                "slug": "microbiome-balancing-anti-dandruff-treatment-shampoo",
                "category": cat_cleanse,
                "price": decimal.Decimal("899.00"),
                "discount_price": decimal.Decimal("749.00"),
                "routine_step": "cleanse",
                "size": "250 ml / 8.45 fl. oz.",
                "key_ingredients": "Piroctone Olamine 0.8%, Salicylic Acid 1%, Tea Tree Leaf Oil, Aloe Vera, Menthol",
                "botanical_actives": "Tea Tree, Aloe, Peppermint",
                "clinical_actives": "Piroctone Olamine (Safe Zinc Pyrithione Alternative), Salicylic Acid",
                "benefits": "Eradicates 100% of visible dandruff flakes and ends scalp itch after 2 washes while preserving follicle moisture.",
                "usage_instructions": "Lather onto scalp and leave on for 2-3 minutes to allow active ingredients to target fungal cell membranes. Rinse well.",
                "texture_description": "Cooling mint-green gel with refreshing tingle",
                "aroma_notes": "Spearmint, Tea Tree & Crisp Eucalyptus",
                "ph_level": "pH 5.0",
                "image_url": "https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?auto=format&fit=crop&w=700&q=80",
                "rating": decimal.Decimal("4.90"),
                "review_count": 285,
                "is_bestseller": True,
                "concerns": [concern_dandruff],
                "hair_types": [ht_straight, ht_wavy, ht_curly, ht_coily]
            },
            # 14. Curl Butter Intense Hydration Cream
            {
                "title": "Maharani Rich Curl Butter & Clump Sculptor",
                "subtitle": "Kokum Butter + Hydrolyzed Pea Protein + Flaxseed Cream",
                "slug": "maharani-rich-curl-butter-clump-sculptor",
                "category": cat_style,
                "price": decimal.Decimal("999.00"),
                "discount_price": decimal.Decimal("849.00"),
                "routine_step": "define",
                "size": "200 g / 7.05 oz.",
                "key_ingredients": "Garcinia Indica (Kokum) Seed Butter, Hydrolyzed Pea Protein, Cold-Pressed Almond Oil, Flaxseed Gel",
                "botanical_actives": "Kokum, Sweet Almond, Fenugreek",
                "clinical_actives": "Pea Hydrolysates, Glyceryl Stearate",
                "benefits": "Deeply moisturizes thirsty 3B-4C coils, transforming dry fuzz into elongated, glossy, clumped spirals with zero crunch.",
                "usage_instructions": "Section soaking wet curls. Smooth a small dollop over each section using praying hands method. Layer with gel for strong hold.",
                "texture_description": "Rich artisanal whipped butter",
                "aroma_notes": "Sandalwood, Vanilla Bean & Cardamom",
                "ph_level": "pH 5.2",
                "image_url": "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=700&q=80",
                "rating": decimal.Decimal("4.95"),
                "review_count": 230,
                "is_bestseller": True,
                "concerns": [concern_curl_definition, concern_dryness, concern_frizz],
                "hair_types": [ht_curly, ht_coily]
            },
            # 15. Clarifying Scalp Apple Cider Vinegar Acidic Glaze
            {
                "title": "Acidic Cuticle Seal & Apple Cider Vinegar Glaze",
                "subtitle": "Organic ACV + Hibiscus Flowers + Hydrolyzed Silk for Hard Water Rinse",
                "slug": "acidic-cuticle-seal-apple-cider-vinegar-glaze",
                "category": cat_condition,
                "price": decimal.Decimal("849.00"),
                "discount_price": decimal.Decimal("699.00"),
                "routine_step": "condition",
                "size": "200 ml / 6.76 fl. oz.",
                "key_ingredients": "Raw Himalayan Apple Cider Vinegar, Hibiscus Sabdariffa Extract, Hydrolyzed Silk Peptides, Polyquaternium-10",
                "botanical_actives": "Apple Cider Vinegar, Hibiscus, Calendula",
                "clinical_actives": "Silk Amino Acids, Lactic Acid",
                "benefits": "Neutralizes alkaline hard water deposits in 60 seconds. Flattens flared cuticles for intense liquid glass reflection.",
                "usage_instructions": "After conditioning, squirt directly onto hair ends and scalp. Leave for 60 seconds, then rinse with cold water.",
                "texture_description": "Ruby-red aromatic acidic nectar",
                "aroma_notes": "Wild Raspberry, Crisp Apple & Hibiscus",
                "ph_level": "pH 4.2 (Rapid Cuticle Flattening)",
                "image_url": "https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=700&q=80",
                "rating": decimal.Decimal("4.86"),
                "review_count": 178,
                "is_bestseller": False,
                "concerns": [concern_hardwater, concern_frizz],
                "hair_types": [ht_straight, ht_wavy, ht_curly, ht_coily]
            },
            # 16. Night Repair Ceramide Hair Oil
            {
                "title": "Mahabhringraj & Ceramide Intensive Night Hair Oil",
                "subtitle": "Traditional 21-Herb Siddha Taila with Sesame, Amla & Rosemary",
                "slug": "mahabhringraj-ceramide-intensive-night-hair-oil",
                "category": cat_scalp,
                "price": decimal.Decimal("899.00"),
                "discount_price": decimal.Decimal("749.00"),
                "routine_step": "prep",
                "size": "150 ml / 5.07 fl. oz.",
                "key_ingredients": "Eclipta Alba (Bhringraj), Sesame Seed Oil, Amla, Brahmi, Mulethi, Castor Oil, Ceramide NG",
                "botanical_actives": "Bhringraj, Amla, Brahmi, Mulethi, Vetiver",
                "clinical_actives": "Bio-fermented Ceramides, Vitamin E",
                "benefits": "Deep root rejuvenation that calms stress, nourishes hair bulbs, and prevents premature graying and strand breakage.",
                "usage_instructions": "Warm oil slightly. Massage deeply into scalp for 10 minutes using circular motions. Leave on overnight or for 1 hour before wash.",
                "texture_description": "Silky herbal botanical infusion with subtle herbaceous aroma",
                "aroma_notes": "Earthy Vetiver, Bhringraj Herbs & Warm Sesame",
                "ph_level": "Anhydrous Oil Formulation",
                "image_url": "https://images.unsplash.com/photo-1608248597359-00918c8b417c?auto=format&fit=crop&w=700&q=80",
                "rating": decimal.Decimal("4.96"),
                "review_count": 480,
                "is_bestseller": True,
                "concerns": [concern_hairfall, concern_dryness],
                "hair_types": [ht_straight, ht_wavy, ht_curly, ht_coily]
            },
            # 17. Botanical Co-Wash Cleansing Conditioner
            {
                "title": "Botanical Velvet Co-Wash & Scalp Conditioning Cleanser",
                "subtitle": "Castor Milk + Marshmallow Root + Mild Cleansing Esters",
                "slug": "botanical-velvet-cowash-conditioning-cleanser",
                "category": cat_cleanse,
                "price": decimal.Decimal("899.00"),
                "discount_price": decimal.Decimal("750.00"),
                "routine_step": "cleanse",
                "size": "300 ml / 10.14 fl. oz.",
                "key_ingredients": "Marshmallow Root Mucilage, Castor Seed Emulsion, Peppermint Hydrosol, Cetrimonium Chloride",
                "botanical_actives": "Marshmallow Root, Castor Oil, Spearmint",
                "clinical_actives": "Non-stripping cationic micellar cleansing complex",
                "benefits": "Washes away sweat and product residue without stripping natural moisture. Perfect for mid-week gym washes for curly hair.",
                "usage_instructions": "Massage vigorously into soaking wet scalp for 2 minutes. Distribute through ends and rinse with warm water.",
                "texture_description": "Velvety conditioning creme",
                "aroma_notes": "Cooling Spearmint & Crushed Vanilla",
                "ph_level": "pH 5.0",
                "image_url": "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=700&q=80",
                "rating": decimal.Decimal("4.84"),
                "review_count": 122,
                "is_bestseller": False,
                "concerns": [concern_curl_definition, concern_dryness],
                "hair_types": [ht_curly, ht_coily]
            },
            # 18. Saw Palmetto Root Volume Mist
            {
                "title": "Biotin & Saw Palmetto Volumizing Crown Lift Mist",
                "subtitle": "Peptides + Saw Palmetto DHT Blocker + Organic Bamboo Extract",
                "slug": "biotin-saw-palmetto-volumizing-crown-lift-mist",
                "category": cat_leavein,
                "price": decimal.Decimal("920.00"),
                "discount_price": decimal.Decimal("780.00"),
                "routine_step": "define",
                "size": "150 ml / 5.07 fl. oz.",
                "key_ingredients": "Serenoa Serrulata (Saw Palmetto), Pure Biotin, Bamboo Silica, Hydrolyzed Wheat Starch",
                "botanical_actives": "Saw Palmetto, Bamboo, Green Tea",
                "clinical_actives": "Biotinoyl Tripeptide, Niacinamide",
                "benefits": "Instantly lifts flat, lifeless roots at the crown while natural phytosterols block DHT-induced follicular shrinkage.",
                "usage_instructions": "Spray directly onto damp roots. Blow-dry upside down or massage with fingertips for instant volume.",
                "texture_description": "Micro-fine volumizing mist",
                "aroma_notes": "Bergamot, White Freesia & Cedarwood",
                "ph_level": "pH 5.6",
                "image_url": "https://images.unsplash.com/photo-1616683693504-3ea7e9ad6fec?auto=format&fit=crop&w=700&q=80",
                "rating": decimal.Decimal("4.88"),
                "review_count": 164,
                "is_bestseller": False,
                "concerns": [concern_hairfall],
                "hair_types": [ht_straight, ht_wavy]
            },
            # 19. Charcoal Scalp Detox Mud Mask
            {
                "title": "Rhassoul & Activated Charcoal Scalp Clarifying Mud",
                "subtitle": "Mineral-Rich Clay + Botanical Actives + Salicylic Acid 1.5%",
                "slug": "rhassoul-activated-charcoal-scalp-clarifying-mud",
                "category": cat_treat,
                "price": decimal.Decimal("999.00"),
                "discount_price": decimal.Decimal("849.00"),
                "routine_step": "prep",
                "size": "150 g / 5.29 oz.",
                "key_ingredients": "Moroccan Rhassoul Clay, Activated Bamboo Charcoal, Shikakai, Salicylic Acid, Tea Tree Oil",
                "botanical_actives": "Rhassoul Clay, Shikakai, Tea Tree, Eucalyptus",
                "clinical_actives": "Salicylic Acid 1.5%, Zinc PCA",
                "benefits": "Magnetic adsorption pulls heavy metal minerals, sebum buildup, and micro-pollutants out of pores in 10 minutes.",
                "usage_instructions": "Apply directly to damp scalp once a fortnight. Leave for 10 minutes until slightly set, then emulsify with warm water and rinse.",
                "texture_description": "Silky dark botanical clay mousse",
                "aroma_notes": "Cooling Eucalyptus, Earthy Cedar & Patchouli",
                "ph_level": "pH 5.4",
                "image_url": "https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=700&q=80",
                "rating": decimal.Decimal("4.92"),
                "review_count": 218,
                "is_bestseller": False,
                "concerns": [concern_dandruff, concern_hardwater],
                "hair_types": [ht_straight, ht_wavy, ht_curly, ht_coily]
            },
            # 20. Marula Split End Fusion Nectar
            {
                "title": "Golden Marula & Baobab Split End Repair Nectar",
                "subtitle": "Bio-Lipid Complex + 18-MEA Restorer + Cold Pressed Baobab Oil",
                "slug": "golden-marula-baobab-split-end-repair-nectar",
                "category": cat_leavein,
                "price": decimal.Decimal("1050.00"),
                "discount_price": decimal.Decimal("890.00"),
                "routine_step": "protect",
                "size": "50 ml / 1.69 fl. oz.",
                "key_ingredients": "Sclerocarya Birrea (Marula) Seed Oil, Adansonia Digitata (Baobab) Seed Oil, C10-40 Isoalkylamidopropylethyldimonium Ethosulfate (18-MEA)",
                "botanical_actives": "Marula, Baobab, Argan",
                "clinical_actives": "18-MEA Lipid Reconstructor, Ceramide Complex",
                "benefits": "Clinically seals 93% of frayed split ends upon first application. Protects porous bleached and heat-damaged ends from snapping.",
                "usage_instructions": "Dispense 1-2 pumps onto fingertips and press specifically into the last 3 inches of dry or damp hair ends.",
                "texture_description": "Liquid golden satin nectar",
                "aroma_notes": "Warm Golden Orchid, Plum & Cashmere Wood",
                "ph_level": "Anhydrous",
                "image_url": "https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?auto=format&fit=crop&w=700&q=80",
                "rating": decimal.Decimal("4.95"),
                "review_count": 310,
                "is_bestseller": True,
                "concerns": [concern_dryness, concern_frizz],
                "hair_types": [ht_straight, ht_wavy, ht_curly, ht_coily]
            },
            # 21. Rice Water & Keratin Strengthening Rinse
            {
                "title": "Fermented Rice Water & Keratin Post-Wash Acidic Tonic",
                "subtitle": "Inositol + Rice Peptides + Hibiscus pH Neutralizer",
                "slug": "fermented-rice-water-keratin-post-wash-tonic",
                "category": cat_condition,
                "price": decimal.Decimal("799.00"),
                "discount_price": decimal.Decimal("650.00"),
                "routine_step": "condition",
                "size": "200 ml / 6.76 fl. oz.",
                "key_ingredients": "Oryza Sativa (Rice) Bran Water Ferment, Inositol, Hydrolyzed Keratin, Hibiscus Extract",
                "botanical_actives": "Fermented Rice Water, Hibiscus, Fenugreek",
                "clinical_actives": "Inositol, Hydrolyzed Keratin, Lactic Acid",
                "benefits": "Infuses elasticity into limp, stretchy hair cortex. Enhances strand tensile strength by 42%.",
                "usage_instructions": "After washing and conditioning, pour liberally from roots to ends. Leave for 2 minutes before a final cool water splash.",
                "texture_description": "Watery clarifying tonic",
                "aroma_notes": "Rice Blossom, Jasmine & Fresh Mint",
                "ph_level": "pH 4.6",
                "image_url": "https://images.unsplash.com/photo-1527799820374-dcf8d9d4a388?auto=format&fit=crop&w=700&q=80",
                "rating": decimal.Decimal("4.86"),
                "review_count": 189,
                "is_bestseller": False,
                "concerns": [concern_hairfall, concern_dryness],
                "hair_types": [ht_straight, ht_wavy, ht_curly, ht_coily]
            }
        ]

        created_products = {}
        for p_data in products_data:
            concerns = p_data.pop("concerns", [])
            hair_types = p_data.pop("hair_types", [])
            p = Product.objects.create(**p_data)
            p.concerns.set(concerns)
            p.hair_types.set(hair_types)
            created_products[p.slug] = p
            self.stdout.write(f"  Created Product: {p.title}")

        self.stdout.write(self.style.NOTICE("Seeding Routine Bundles..."))
        
        # 1. The 3-Step Frizz & Humidity Shield Ritual
        frizz_p1 = created_products["monsoon-moisture-frizz-shield-shampoo"]
        frizz_p2 = created_products["velvet-slip-biomimetic-peptide-conditioner"]
        frizz_p3 = created_products["flaxseed-chia-humidity-proof-curl-defining-gel"]
        
        orig_1 = frizz_p1.price + frizz_p2.price + frizz_p3.price
        bundle_1 = RoutineBundle.objects.create(
            title="The 3-Step Frizz & Monsoon Humidity Shield Ritual",
            slug="frizz-monsoon-humidity-shield-ritual",
            tagline="Formulated for high-humidity climates & high-porosity wavy/curly strands to lock out frizz for 72 hours.",
            description="A comprehensive 3-tier barrier system: Gentle sulfate-free cleansing, biomimetic cuticle sealing, and an elastic botanical flaxseed matrix to keep hair sleek, defined, and weather-proof.",
            original_price=orig_1,
            bundle_price=decimal.Decimal("2150.00"),
            savings_percentage=20,
            badge_text="Best Seller • Save 20%",
            clinical_results="94% of users in high-humidity cities reported zero halo frizz after 1 wash",
            image_url="https://images.unsplash.com/photo-1526947425960-945c6e72858f?auto=format&fit=crop&w=900&q=80",
            is_featured=True,
            routine_steps=[
                {
                    "step": 1,
                    "phase": "Cleanse",
                    "title": "Moisture Shield Cleansing",
                    "product_name": frizz_p1.title,
                    "product_id": frizz_p1.id,
                    "tip": "Wash with lukewarm water; focus lather exclusively on the roots."
                },
                {
                    "step": 2,
                    "phase": "Condition",
                    "title": "Cuticle Lipid Repair",
                    "product_name": frizz_p2.title,
                    "product_id": frizz_p2.id,
                    "tip": "Squish upwards onto wet hair for 3 minutes to seal porous open cuticles."
                },
                {
                    "step": 3,
                    "phase": "Define & Shield",
                    "title": "Flexible Film Sealant",
                    "product_name": frizz_p3.title,
                    "product_id": frizz_p3.id,
                    "tip": "Glaze through dripping wet curls and scrunch. Air dry or diffuse with zero touching."
                }
            ]
        )
        bundle_1.products.set([frizz_p1, frizz_p2, frizz_p3])
        bundle_1.target_hair_types.set([ht_wavy, ht_curly, ht_coily])
        bundle_1.target_concerns.set([concern_frizz, concern_curl_definition, concern_dryness])

        # 2. Scalp Detox & Follicle Density Regimen
        scalp_p1 = created_products["scalp-clarifying-bha-neem-prewash-elixir"]
        scalp_p2 = created_products["root-awakening-follicle-densifying-shampoo"]
        scalp_p3 = created_products["follicle-activator-rosemary-redensyl-scalp-drops"]
        
        orig_2 = scalp_p1.price + scalp_p2.price + scalp_p3.price
        bundle_2 = RoutineBundle.objects.create(
            title="Scalp Detox & Hair Density Awakening Regimen",
            slug="scalp-detox-hair-density-awakening-regimen",
            tagline="Clinical trichologist-designed triple protocol to eradicate dandruff and reignite sluggish hair follicles.",
            description="Decongests sebum-clogged pores with BHA salicylic acid, washes away inflammatory micro-flora, and nourishes dermal papillae with biomimetic copper peptides and Redensyl.",
            original_price=orig_2,
            bundle_price=decimal.Decimal("2499.00"),
            savings_percentage=22,
            badge_text="Trichologist Prescribed • Save 22%",
            clinical_results="14,000+ new visible strands measured clinically in a 90-day double-blind trial",
            image_url="https://images.unsplash.com/photo-1608248597359-00918c8b417c?auto=format&fit=crop&w=900&q=80",
            is_featured=True,
            routine_steps=[
                {
                    "step": 1,
                    "phase": "Pre-Wash Reset",
                    "title": "Sebum & Flake Dissolution",
                    "product_name": scalp_p1.title,
                    "product_id": scalp_p1.id,
                    "tip": "Massage directly into dry scalp 20 minutes before stepping into the shower."
                },
                {
                    "step": 2,
                    "phase": "Cleanse",
                    "title": "Follicular Micro-Circulation",
                    "product_name": scalp_p2.title,
                    "product_id": scalp_p2.id,
                    "tip": "Lather on roots for 2 full minutes to allow active peptide and caffeine absorption."
                },
                {
                    "step": 3,
                    "phase": "Night Treatment",
                    "title": "Anagen Phase Prolongation",
                    "product_name": scalp_p3.title,
                    "product_id": scalp_p3.id,
                    "tip": "Apply 1 dropperful every night on clean scalp. Zero grease, no wash required."
                }
            ]
        )
        bundle_2.products.set([scalp_p1, scalp_p2, scalp_p3])
        bundle_2.target_hair_types.set([ht_straight, ht_wavy, ht_curly, ht_coily])
        bundle_2.target_concerns.set([concern_dandruff, concern_hairfall])

        # 3. Hard Water Rescue & Glass Cuticle Ritual
        hw_p1 = created_products["hard-water-defense-chelating-shampoo"]
        hw_p2 = created_products["acidic-cuticle-seal-apple-cider-vinegar-glaze"]
        hw_p3 = created_products["solar-heat-defense-glass-shine-elixir"]

        orig_3 = hw_p1.price + hw_p2.price + hw_p3.price
        bundle_3 = RoutineBundle.objects.create(
            title="Hard Water Mineral Detox & Liquid Glass Ritual",
            slug="hard-water-mineral-detox-liquid-glass-ritual",
            tagline="Reverses calcium crust buildup, restores the acidic acid mantle, and seals cuticles for reflective shine.",
            description="Engineered specifically for metro cities with borewell & municipal hard water (>300 PPM). Dissolves mineral film, contracts lifted cuticles, and provides heat & UV protection.",
            original_price=orig_3,
            bundle_price=decimal.Decimal("2299.00"),
            savings_percentage=21,
            badge_text="City Living Essential • Save 21%",
            clinical_results="100% of mineral residue removed after 1 chelation wash; 3.8x shine increase",
            image_url="https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?auto=format&fit=crop&w=900&q=80",
            is_featured=True,
            routine_steps=[
                {
                    "step": 1,
                    "phase": "Chelate",
                    "title": "Phytic Acid Demineralizer",
                    "product_name": hw_p1.title,
                    "product_id": hw_p1.id,
                    "tip": "Use weekly or every second wash to dissolve calcium and magnesium deposits."
                },
                {
                    "step": 2,
                    "phase": "Acidic Glaze",
                    "title": "pH 4.2 Cuticle Contraction",
                    "product_name": hw_p2.title,
                    "product_id": hw_p2.id,
                    "tip": "Pour through damp ends. Leave for 60 seconds then rinse with cool water."
                },
                {
                    "step": 3,
                    "phase": "Protect & Gloss",
                    "title": "230°C Thermal & UV Shield",
                    "product_name": hw_p3.title,
                    "product_id": hw_p3.id,
                    "tip": "Spread 2 drops between palms and gloss over finished dry hair for glass reflection."
                }
            ]
        )
        bundle_3.products.set([hw_p1, hw_p2, hw_p3])
        bundle_3.target_hair_types.set([ht_straight, ht_wavy, ht_curly, ht_coily])
        bundle_3.target_concerns.set([concern_hardwater, concern_dryness, concern_frizz])

        # 4. Ultimate Curl Definition & Clump System
        curl_p1 = created_products["monsoon-moisture-frizz-shield-shampoo"]
        curl_p2 = created_products["ayur-keratin-deep-bond-repair-moisture-mask"]
        curl_p3 = created_products["maharani-rich-curl-butter-clump-sculptor"]
        curl_p4 = created_products["flaxseed-chia-humidity-proof-curl-defining-gel"]

        orig_4 = curl_p1.price + curl_p2.price + curl_p3.price + curl_p4.price
        bundle_4 = RoutineBundle.objects.create(
            title="The 4-Step Curly & Coily Clump Sculpting System",
            slug="curly-coily-clump-sculpting-system",
            tagline="Maximum clump definition, deep cortex protein-hydration balance, and 72-hour weatherproof hold.",
            description="A complete regimen for Type 3A to 4C curl patterns: Gentle moisture cleansing, biomimetic deep bond restoration, decadent Kokum sculpting butter, and crystalline flaxseed lock.",
            original_price=orig_4,
            bundle_price=decimal.Decimal("3190.00"),
            savings_percentage=22,
            badge_text="Complete Regimen • Save 22%",
            clinical_results="Zero crunch, 4x tighter curl clump retention verified by high-speed moisture chamber test",
            image_url="https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=900&q=80",
            is_featured=True,
            routine_steps=[
                {
                    "step": 1,
                    "phase": "Hydrate Cleanse",
                    "title": "Non-Stripping Foam",
                    "product_name": curl_p1.title,
                    "product_id": curl_p1.id,
                    "tip": "Gently massage roots without tangling hair lengths."
                },
                {
                    "step": 2,
                    "phase": "Deep Moisture Mask",
                    "title": "Bio-Keratin Restructure",
                    "product_name": curl_p2.title,
                    "product_id": curl_p2.id,
                    "tip": "Leave under a warm towel for 15 minutes to allow rice and quinoa peptides to penetrate."
                },
                {
                    "step": 3,
                    "phase": "Sculpt & Clump",
                    "title": "Kokum Butter Slip",
                    "product_name": curl_p3.title,
                    "product_id": curl_p3.id,
                    "tip": "Apply to soaking wet strands using praying hands technique to encourage curl families."
                },
                {
                    "step": 4,
                    "phase": "Seal Cast",
                    "title": "Flaxseed Matrix",
                    "product_name": curl_p4.title,
                    "product_id": curl_p4.id,
                    "tip": "Scrunch gently from ends upward; diffuse on low heat without touching."
                }
            ]
        )
        bundle_4.products.set([curl_p1, curl_p2, curl_p3, curl_p4])
        bundle_4.target_hair_types.set([ht_curly, ht_coily])
        bundle_4.target_concerns.set([concern_curl_definition, concern_frizz, concern_dryness])

        self.stdout.write(self.style.NOTICE("Seeding Customer Reviews & Social Proof..."))
        reviews_data = [
            {
                "reviewer_name": "Ananya Sharma",
                "age": "27",
                "hair_type_tag": "2B/2C Fine Waves • High Porosity",
                "location": "Mumbai (88% Humidity)",
                "concern_addressed": "Severe Monsoon Frizz & Flat Crown",
                "routine_used": "The 3-Step Frizz & Monsoon Humidity Shield Ritual",
                "rating": 5,
                "review_title": "Literally changed my relationship with my natural waves!",
                "review_text": "I used to straighten my hair every week because Mumbai humidity would turn my hair into a giant dry triangle. Aria evaluated my high porosity cuticles and recommended the Flaxseed & Chia gel + Velvet Slip. My waves hold clean defined spirals now with ZERO frizz even when it's pouring outside!",
                "before_after_image": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=500&q=80",
                "verified_purchase": True
            },
            {
                "reviewer_name": "Rohan Deshmukh",
                "age": "32",
                "hair_type_tag": "1B Straight • Oily Scalp",
                "location": "Bangalore (Hard Water 420 PPM)",
                "concern_addressed": "Stubborn Itchy Dandruff & Hard Water Mineral Crust",
                "routine_used": "Scalp Detox & Hair Density Regimen + Hard Water Shampoo",
                "rating": 5,
                "review_title": "No more embarrassing flakes on my shirts at work.",
                "review_text": "I moved to Whitefield Bangalore and within 2 months my scalp was inflamed and peeling with itchy dandruff from the borewell water. The Salicylic Acid pre-wash elixir dissolved the flakes on day one. After 3 weeks of following the cool-rinse protocol, my scalp is completely clean and calm.",
                "before_after_image": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=500&q=80",
                "verified_purchase": True
            },
            {
                "reviewer_name": "Dr. Priyamvada Nair",
                "age": "34",
                "hair_type_tag": "3B Defined Ringlets",
                "location": "Kochi (Coastal Tropical)",
                "concern_addressed": "Dryness, Lack of Hold & Split Ends",
                "routine_used": "The 4-Step Curly Clump Sculpting System",
                "rating": 5,
                "review_title": "Clinical formulations that truly understand Indian curls.",
                "review_text": "As a health researcher, I appreciate the transparency of active percentages. The blend of plant Kokum and biomimetic pea peptides gives slip that outperforms any imported salon brand I've tested. My ringlets are soft, bouncy, and stay hydrated for 4 full days between washes.",
                "before_after_image": "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=500&q=80",
                "verified_purchase": True
            },
            {
                "reviewer_name": "Sneha Sen",
                "age": "29",
                "hair_type_tag": "2A Soft Waves • Postpartum Shedding",
                "location": "Kolkata (High Pollution & Humidity)",
                "concern_addressed": "Postpartum Hair Fall & Visible Temple Thinning",
                "routine_used": "Scalp Detox & Hair Density Awakening Regimen",
                "rating": 5,
                "review_title": "My temples are finally filling in with new baby hairs!",
                "review_text": "Postpartum hair fall at 4 months post-delivery felt terrifying. Aria's routine guidance explained the natural shedding phase and recommended the Rosemary & Peptide drops along with ferritin dietary habits. In 8 weeks, the shedding dropped drastically and I have dense sprouts framing my forehead.",
                "before_after_image": "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=500&q=80",
                "verified_purchase": True
            }
        ]

        for r_data in reviews_data:
            CustomerReview.objects.create(**r_data)

        self.stdout.write(self.style.SUCCESS(f"Successfully seeded database! Total Products: {Product.objects.count()}, Routines: {RoutineBundle.objects.count()}, Reviews: {CustomerReview.objects.count()}"))
