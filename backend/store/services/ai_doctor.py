"""
Aria - Halo AI Hair and Scalp Guide Service
Provides clear, science-backed guidance on hair patterns, wash routines,
lifestyle & nutrition habits, and grounds recommendations in the Halo product catalog.
"""

import json
import logging
import os
import re
import requests
from django.conf import settings
from store.models import Product, HairConcern, HairType

logger = logging.getLogger(__name__)

SYSTEM_PROMPT = """You are Aria, the Halo hair and scalp guide.
You are an AI guide—you are NOT a doctor or medical professional. Never claim medical credentials or diagnose medical conditions.

Safety & Triage Guidelines:
- If the user reports sudden, patchy, or scarring hair loss, a painful, bleeding, or burning scalp, rapidly spreading rashes, open lesions, or signs of acute infection, advise them clearly and warmly to consult a board-certified dermatologist. Never attempt to diagnose, cure, or treat pathological skin conditions.

Tone & Style:
- Calm, clear, warm, concise, and scientifically grounded.
- Avoid flowery, mystical, or ornamental language. Keep paragraphs short and formatting clean with standard markdown.
- Ground advice in strand biophysics: cuticular porosity, sebum balance, hard water mineral chelation, and humidity shields.

Structure your guidance:
1. **Assessment & Fiber Science**: Clear, concise explanation of what is happening at the scalp and strand level.
2. **Key Actives**: Specific clinical and botanical actives that address the stressor (e.g. Salicylic acid, Peptides, Ceramides, Phytic acid).
3. **Routine & Wash Habits**: Wash frequency, water temperature, gentle mechanical habits, and drying techniques.
4. **Lifestyle & Nutrition**: Supportive nutrition and habits (Iron/Ferritin, Zinc, Omega fatty acids, hydration).
5. **Recommended Formulations**: Recommend 2 to 4 matching formulas from our catalog.

Available products in catalog:
{catalog_json}

IMPORTANT: You must format your final response as valid JSON with two top-level keys:
- "reply": Markdown formatted string with your clear, structured response.
- "recommended_product_ids": A list of integer IDs corresponding to the products from the catalog that best address the user's needs.
"""


def get_catalog_summary():
    """Generates a structured catalog summary for the AI prompt and matching logic."""
    products = Product.objects.all().select_related('category').prefetch_related('hair_types', 'concerns')
    catalog = []
    for p in products:
        catalog.append({
            'id': p.id,
            'title': p.title,
            'subtitle': p.subtitle,
            'category': p.category.name if p.category else '',
            'price': float(p.effective_price),
            'routine_step': p.routine_step,
            'hair_types': [ht.code for ht in p.hair_types.all()],
            'concerns': [c.name for c in p.concerns.all()],
            'key_ingredients': p.key_ingredients,
            'botanical_actives': p.botanical_actives,
            'clinical_actives': p.clinical_actives,
            'benefits': p.benefits,
        })
    return catalog


def clinical_knowledge_engine(user_message: str, user_profile: dict = None) -> dict:
    """
    Precision knowledge engine for Aria.
    Used when external LLM API keys are not supplied or as a fail-safe fallback.
    Delivers calm, science-grounded explanations, active ingredients, and exact catalog matches.
    """
    text = (user_message or "").lower()
    profile = user_profile or {}
    
    # Extract signals
    has_dandruff = any(k in text for k in ['dandruff', 'flake', 'flaky', 'itch', 'itchy', 'scalp buildup', 'fungus', 'seborrheic'])
    has_frizz = any(k in text for k in ['frizz', 'frizzy', 'humidity', 'puffy', 'monsoon', 'flyaway', 'rough'])
    has_hairfall = any(k in text for k in ['hair fall', 'hairfall', 'shedding', 'thinning', 'postpartum', 'receding', 'density', 'breakage'])
    has_hard_water = any(k in text for k in ['hard water', 'mineral', 'borewell', 'tap water', 'chlorine', 'stiff', 'dullness'])
    has_curls = any(k in text for k in ['curl', 'curly', '2c', '3a', '3b', '3c', '4a', 'coily', 'wavy', 'waves', 'cgm'])
    has_dryness = any(k in text for k in ['dry', 'brittle', 'straw', 'split end', 'dehydrated', 'bleach', 'colored', 'damage'])

    # Red flag safety triage
    has_red_flags = any(k in text for k in ['pain', 'bleeding', 'burning', 'lesion', 'patchy', 'alopecia areata', 'pus', 'sores', 'infection'])

    matched_products = []
    
    if has_red_flags:
        diagnostic = (
            "### Scalp Health Notice\n\n"
            "Because you mentioned severe pain, bleeding, or sudden patchy symptoms, I strongly recommend consulting a board-certified dermatologist for a clinical evaluation. "
            "These symptoms can indicate conditions that require medical diagnosis rather than over-the-counter hair care."
        )
        actives_focus = (
            "### Gentle Care Approach\n"
            "- Discontinue active chemical treatments, scrubs, or strong heat until assessed by a specialist.\n"
            "- Use only gentle, fragrance-free, pH-neutral cleansers without mechanical scrubbing."
        )
        wash_protocol = (
            "### Clarified Protocol\n"
            "1. Avoid hot water and vigorous scalp massage.\n"
            "2. Pat hair dry gently with a microfiber towel—do not rub.\n"
            "3. Allow a dermatologist to evaluate before applying new leave-in treatments."
        )
        nutrition = (
            "### General Wellness\n"
            "- Maintain steady hydration and a balanced diet rich in micronutrients."
        )
        matched_products = list(Product.objects.filter(is_bestseller=True)[:2])

    elif has_dandruff:
        diagnostic = (
            "### Scalp Barrier & Sebum Equilibrium\n\n"
            "Flaking and scalp irritation often stem from sebum imbalances and microbial turnover. "
            "When natural lipids oxidize, the scalp's outer barrier sheds prematurely, leading to visible flakes and mild itching."
        )
        actives_focus = (
            "### Targeted Clarifying Actives\n"
            "- **Salicylic Acid (BHA)**: Gently exfoliates dead surface cells and clears follicular buildup.\n"
            "- **Tea Tree & Botanical Clarifiers**: Clarify and balance microflora without stripping the acid mantle.\n"
            "- **Peppermint & Rosemary**: Refresh the scalp environment and support balanced micro-circulation."
        )
        wash_protocol = (
            "### Wash Routine\n"
            "1. **Clarifying Cleanse**: Apply a salicylic cleanser directly to the scalp 2 to 3 times weekly. Allow lather to sit for 2 minutes before rinsing.\n"
            "2. **Water Temperature**: Wash with lukewarm water; finish with a cool rinse to calm the scalp.\n"
            "3. **Thorough Drying**: Avoid sleeping on damp hair or leaving the scalp wet for prolonged periods."
        )
        nutrition = (
            "### Nutrition & Habits\n"
            "- **Zinc & Omega-3**: Support sebum regulation with pumpkin seeds, walnuts, and leafy greens.\n"
            "- **Balanced Diet**: Limit excess refined sugars which can alter sebum viscosity."
        )
        prods = Product.objects.filter(concerns__slug__icontains='dandruff')[:3]
        if not prods.exists():
            prods = Product.objects.filter(title__icontains='scalp')[:3]
        matched_products = list(prods)

    elif has_hairfall:
        diagnostic = (
            "### Strand Shedding & Root Fortification\n\n"
            "Daily shedding is a normal part of the hair cycle (typically 50-100 strands). "
            "When shedding increases, common culprits include seasonal shifts, high stress, tight hairstyles, or nutritional depletion."
        )
        actives_focus = (
            "### Actives for Root Strength\n"
            "- **Biomimetic Peptides**: Support dermal root attachment and reinforce fine fibers.\n"
            "- **Rosemary & Botanical Extracts**: Provide antioxidant defense to hair follicles.\n"
            "- **Ceramides**: Seal cuticle edges to prevent mechanical breakage along the shaft."
        )
        wash_protocol = (
            "### Gentle Care Routine\n"
            "1. **Low-Tension Styling**: Avoid tight elastics, buns, or aggressive brushing when wet.\n"
            "2. **Gentle Scalp Care**: Light fingertip stimulation during cleansing to encourage healthy root circulation.\n"
            "3. **Silk or Satin Pillowcase**: Minimizes overnight shearing friction on delicate strands."
        )
        nutrition = (
            "### Nutrition Support\n"
            "- **Iron & Ferritin**: Essential for healthy hair cycles; include lentils, spinach, and lean proteins.\n"
            "- **Amino Acids**: Keratin synthesis requires adequate dietary protein."
        )
        prods = Product.objects.filter(concerns__slug__icontains='hairfall')[:3]
        if not prods.exists():
            prods = Product.objects.filter(title__icontains='growth')[:3]
        matched_products = list(prods)

    elif has_hard_water:
        diagnostic = (
            "### Mineral Deposition & Hard Water Balance\n\n"
            "Hard water contains dissolved calcium and magnesium ions that cling to negatively charged hair cuticles. "
            "Over time, this forms a mineral film that blocks hydration, leaving hair feeling brittle, stiff, and prone to tangling."
        )
        actives_focus = (
            "### Chelating & Restorative Actives\n"
            "- **Phytic Acid & Gentle Chelators**: Sequester and break down mineral buildup from the hair shaft.\n"
            "- **Hyaluronic Acid & Rice Peptides**: Re-infuse lightweight hydration deep into porous layers.\n"
            "- **Acidic Rinse (pH 4.5 - 5.2)**: Smooths cuticular shingles to restore soft light reflection."
        )
        wash_protocol = (
            "### Clarifying Regimen\n"
            "1. **Weekly Chelation Wash**: Use a clarifying chelating shampoo once every 7 days.\n"
            "2. **Shower Filter Consideration**: A multi-stage filter helps trap sediment and heavy minerals.\n"
            "3. **Cool Final Rinse**: Helps close the cuticle down after conditioning."
        )
        nutrition = (
            "### Daily Habits\n"
            "- Ensure consistent daily hydration.\n"
            "- Avoid heat styling without a thermal barrier on mineral-stressed hair."
        )
        prods = Product.objects.filter(concerns__slug__icontains='hard-water')[:3]
        if not prods.exists():
            prods = Product.objects.filter(title__icontains='clarifying')[:3]
        matched_products = list(prods)

    elif has_curls or has_frizz:
        diagnostic = (
            "### Texture Dynamics & Moisture Sealing\n\n"
            "Wavy and curly textures have naturally raised cuticle points along their curves. "
            "In high humidity, atmospheric water penetrates these openings, swelling fibers unevenly and breaking strand alignment."
        )
        actives_focus = (
            "### Weightless Definers & Sealants\n"
            "- **Plant Hemisqualane**: Imparts breathable shine without heavy silicone weight.\n"
            "- **Murumuru & Seed Butters**: Lock in moisture along the fiber length.\n"
            "- **Hydrolyzed Rice Peptides**: Fortify cuticle elasticity and spring."
        )
        wash_protocol = (
            "### Texture Care Routine\n"
            "1. **Hydrate on Soaking Strands**: Apply conditioners and leave-ins while hair is wet to lock in fluid.\n"
            "2. **Microfiber Drying**: Gently squeeze excess water with a microfiber cloth instead of terry cloth.\n"
            "3. **Finger Detangling**: Detangle with slip during conditioning to protect wave patterns."
        )
        nutrition = (
            "### Supportive Habits\n"
            "- Hydration and healthy fatty acids (flaxseeds, chia, avocado) support natural lipid flexibility."
        )
        prods = Product.objects.filter(hair_types__slug__in=['wavy', 'curly'])[:3]
        if not prods.exists():
            prods = Product.objects.filter(concerns__slug__icontains='frizz')[:3]
        matched_products = list(prods)

    else:
        # Standard clarified routine
        diagnostic = (
            "### Fiber & Scalp Equilibrium\n\n"
            "Optimal hair vitality relies on a clean, balanced scalp mantle (pH ~5.5) and smooth, well-hydrated cuticles. "
            "Urban stressors, mechanical styling, and environmental exposure can deplete natural surface lipids over time."
        )
        actives_focus = (
            "### Core Actives\n"
            "- **Biomimetic Peptides**: Support strand elasticity and reduce everyday split-end formation.\n"
            "- **Niacinamide**: Calms environmental oxidative stress on the scalp.\n"
            "- **Clean Lipid Carriers**: Replenish moisture without residual weight."
        )
        wash_protocol = (
            "### Regimen Habits\n"
            "1. **Gentle Cleansing**: Cleanse primarily at the scalp with lukewarm water.\n"
            "2. **Mid-lengths Conditioning**: Leave conditioner on for 3 minutes before rinsing.\n"
            "3. **Cool Finish**: A brief cool rinse helps align the cuticular surface."
        )
        nutrition = (
            "### Daily Habits\n"
            "- Ensure adequate protein intake and balanced essential fatty acids."
        )
        prods = Product.objects.filter(is_bestseller=True)[:3]
        if not prods.exists():
            prods = Product.objects.all()[:3]
        matched_products = list(prods)

    if len(matched_products) < 2:
        fallbacks = Product.objects.exclude(id__in=[p.id for p in matched_products])[:3]
        matched_products.extend(list(fallbacks))
    matched_products = matched_products[:3]

    product_names = [f"**{p.title}** ({p.subtitle or p.size})" for p in matched_products]
    product_section = (
        "### 🧴 Recommended Formulations\n"
        "Here are the matching formulas selected for your profile:\n"
        + "\n".join([f"- {name}" for name in product_names])
        + "\n\n*Click on any card below to inspect formula specs or add to your routine.*"
    )

    full_reply = f"{diagnostic}\n\n{actives_focus}\n\n{wash_protocol}\n\n{nutrition}\n\n{product_section}"
    return {
        "reply": full_reply,
        "recommended_product_ids": [p.id for p in matched_products]
    }


def sanitize_first_name(raw_name: str) -> str:
    """Sanitizes user name: extracts first name, strips newlines/special chars, max 30 chars."""
    if not raw_name:
        return ""
    # Extract first token
    first = raw_name.strip().split()[0]
    # Remove any character that is not alphanumeric or hyphen
    cleaned = re.sub(r'[^a-zA-Z0-9\-]', '', first)
    return cleaned[:30]


def get_system_prompt_for_user(first_name: str = "") -> str:
    prompt = SYSTEM_PROMPT
    clean_name = sanitize_first_name(first_name)
    if clean_name:
        prompt += f"\n\nThe user's name is {clean_name}. Address them by name occasionally and naturally, not in every message."
    return prompt


def call_gemini_consultation(user_message: str, user_profile: dict = None, conversation_history: list = None, first_name: str = "") -> dict:
    """
    Invokes Google Gemini API with JSON output mode grounded in the Halo product catalog.
    """
    api_key = settings.GEMINI_API_KEY
    if not api_key:
        return None

    catalog = get_catalog_summary()
    catalog_json_str = json.dumps(catalog[:25], indent=2)
    base_prompt = get_system_prompt_for_user(first_name)
    prompt = base_prompt.format(catalog_json=catalog_json_str)

    model_name = getattr(settings, 'GEMINI_MODEL', 'gemini-3.8-flash') or 'gemini-3.8-flash'
    url = f"https://generativelanguage.googleapis.com/v1beta/models/{model_name}:generateContent?key={api_key}"

    contents = []

    context_prefix = ""
    if user_profile:
        context_prefix = f"[User Hair Profile: {json.dumps(user_profile)}]\n\n"

    if conversation_history:
        for msg in conversation_history[-6:]:
            role = "model" if msg.get("sender") in ["doctor", "guide"] else "user"
            text_content = msg.get("message", "")
            if text_content:
                contents.append({
                    "role": role,
                    "parts": [{"text": text_content}]
                })

    contents.append({
        "role": "user",
        "parts": [{"text": f"{context_prefix}{user_message}"}]
    })

    payload = {
        "systemInstruction": {
            "parts": [{"text": prompt}]
        },
        "contents": contents,
        "generationConfig": {
            "responseMimeType": "application/json",
            "temperature": 0.5,
            "maxOutputTokens": 2048
        }
    }

    try:
        response = requests.post(
            url,
            headers={"Content-Type": "application/json"},
            json=payload,
            timeout=25
        )
        if response.status_code == 200:
            data = response.json()
            candidates = data.get('candidates', [])
            if candidates and 'content' in candidates[0]:
                parts = candidates[0]['content'].get('parts', [])
                if parts and 'text' in parts[0]:
                    raw_text = parts[0]['text']
                    parsed = json.loads(raw_text)
                    return {
                        "reply": parsed.get("reply", ""),
                        "recommended_product_ids": parsed.get("recommended_product_ids", [])
                    }
        else:
            logger.warning(f"Gemini API returned status {response.status_code}: {response.text}")
            if response.status_code == 404 and model_name != "gemini-3.8-flash":
                fallback_url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-3.8-flash:generateContent?key={api_key}"
                resp2 = requests.post(fallback_url, headers={"Content-Type": "application/json"}, json=payload, timeout=25)
                if resp2.status_code == 200:
                    data = resp2.json()
                    candidates = data.get('candidates', [])
                    if candidates and 'content' in candidates[0]:
                        parts = candidates[0]['content'].get('parts', [])
                        if parts and 'text' in parts[0]:
                            parsed = json.loads(parts[0]['text'])
                            return {
                                "reply": parsed.get("reply", ""),
                                "recommended_product_ids": parsed.get("recommended_product_ids", [])
                            }
    except Exception as e:
        logger.error(f"Error calling Gemini API: {e}")

    return None


def call_openai_consultation(user_message: str, user_profile: dict = None, conversation_history: list = None, first_name: str = "") -> dict:
    """Invokes OpenAI GPT-4o / GPT-4o-mini if API key is present."""
    api_key = settings.OPENAI_API_KEY
    if not api_key:
        return None

    catalog = get_catalog_summary()
    catalog_json_str = json.dumps(catalog[:25], indent=2)
    base_prompt = get_system_prompt_for_user(first_name)
    prompt = base_prompt.format(catalog_json=catalog_json_str)

    messages = [{"role": "system", "content": prompt}]
    
    if user_profile:
        messages.append({
            "role": "system",
            "content": f"User Hair Profile Context: {json.dumps(user_profile)}"
        })

    if conversation_history:
        for msg in conversation_history[-6:]:
            role = "assistant" if msg.get("sender") in ["doctor", "guide"] else "user"
            messages.append({"role": role, "content": msg.get("message", "")})

    messages.append({"role": "user", "content": user_message})

    model_name = getattr(settings, 'OPENAI_MODEL', 'gpt-4o-mini') or 'gpt-4o-mini'

    try:
        response = requests.post(
            "https://api.openai.com/v1/chat/completions",
            headers={
                "Authorization": f"Bearer {api_key}",
                "Content-Type": "application/json"
            },
            json={
                "model": model_name,
                "messages": messages,
                "response_format": {"type": "json_object"},
                "temperature": 0.5,
                "max_tokens": 1500
            },
            timeout=25
        )
        if response.status_code == 200:
            data = response.json()
            raw_content = data['choices'][0]['message']['content']
            parsed = json.loads(raw_content)
            return {
                "reply": parsed.get("reply", ""),
                "recommended_product_ids": parsed.get("recommended_product_ids", [])
            }
        else:
            logger.warning(f"OpenAI API failed with status {response.status_code}: {response.text}")
    except Exception as e:
        logger.error(f"Error calling OpenAI API: {e}")
    
    return None


def ask_dr_kesh(user_message: str, user_profile: dict = None, conversation_history: list = None, first_name: str = "") -> dict:
    """
    Unified entry point for the Aria Hair Guide consultation.
    Preserves existing backend function signature so views and routes remain unbroken.
    """
    result = None

    # 1. Primary: Google Gemini API
    if settings.GEMINI_API_KEY:
        result = call_gemini_consultation(user_message, user_profile, conversation_history, first_name=first_name)

    # 2. Secondary: OpenAI API (if configured and Gemini not provided)
    if not result and settings.OPENAI_API_KEY:
        result = call_openai_consultation(user_message, user_profile, conversation_history, first_name=first_name)

    # 3. Precision Knowledge Engine fallback
    if not result:
        result = clinical_knowledge_engine(user_message, user_profile)
        # If user has a name, warmly prefix the greeting if first consultation
        clean_name = sanitize_first_name(first_name)
        if clean_name and "Hi " not in result.get("reply", ""):
            result["reply"] = f"Hi {clean_name},\n\n" + result.get("reply", "")
        
    recommended_ids = result.get("recommended_product_ids", [])
    valid_products = Product.objects.filter(id__in=recommended_ids)
    
    if not valid_products.exists():
        valid_products = Product.objects.all()[:3]
        
    result["recommended_products"] = valid_products
    return result
