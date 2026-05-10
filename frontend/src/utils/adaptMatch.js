/**
 * adaptMatch.js
 * Перетворює об'єкт матчу з API у форму, яку очікує ProfileCard.
 */

import { hobbyOptions }          from '../components/hobbyOptions.jsx';
import { smokingOptions }        from '../components/smokingOptions.jsx';
import { partyingOptions }       from '../components/partyingOptions.jsx';
import { statusOptions }         from '../components/statusOptions.jsx';
import { orbitOptions }          from '../components/orbitOptions.jsx';
import { languageOptions }       from '../components/languageOptions.jsx';
import { plannedDurationOptions } from '../components/plannedDurationOptions.jsx';

// ── Lookup-таблиці ────────────────────────────────────────────────────────

const CITY_LABELS = {
    1: 'Київ', 2: 'Львів', 3: 'Харків', 4: 'Одеса', 5: 'Дніпро',
    6: 'Запоріжжя', 7: 'Вінниця', 8: 'Черкаси', 9: 'Івано-Франківськ',
    10: 'Тернопіль', 11: 'Рівне', 12: 'Житомир', 13: 'Суми',
    14: 'Полтава', 15: 'Чернігів', 16: 'Кропивницький', 17: 'Луцьк',
    18: 'Хмельницький', 19: 'Миколаїв', 20: 'Чернівці', 21: 'Ужгород',
    22: 'Берегове', 23: "Кам'янець-Подільський", 24: "Кам'янське",
    25: 'Біла Церква', 26: 'Бровари', 27: 'Херсон', 28: 'Мукачево',
    29: 'Кременчук', 30: 'Конотоп', 31: 'Умань', 32: 'Яремче', 33: 'Кривий Ріг',
};

const DISTRICT_LABELS = {
    1:'Голосіївський',2:'Дарницький',3:'Деснянський',4:'Дніпровський',
    5:'Оболонський',6:'Печерський',7:'Подільський',8:'Святошинський',
    9:"Солом'янський",10:'Шевченківський',11:'Галицький',12:'Залізничний',
    13:'Личаківський',14:'Сихівський',15:'Франківський',16:'Шевченківський',
    17:'Холодногірський',18:'Шевченківський',19:'Київський',20:'Салтівський',
    21:'Немишлянський',22:'Індустріальний',23:'Слобідський',24:"Основ'янський",
    25:'Новобаварський',26:'Київський',27:'Хаджибейський',28:'Приморський',
    29:'Пересипський',30:'Амур-Нижньодніпровський',31:'Шевченківський',
    32:'Соборний',33:'Індустріальний',34:'Центральний',35:'Чечелівський',
    36:'Новокодацький',37:'Самарський',38:'Заводський',39:'Хортицький',
    40:'Комунарський',41:'Дніпровський',42:'Олександрівський',
    43:'Вознесенівський',44:'Шевченківський',45:'Замостянський',
    46:'Лівобережний',47:'Староміський',48:'Придніпровський',49:'Соснівський',
    50:'Центральний',51:'Пасічна',52:'БАМ',53:'Каскад',54:'Заріччя',
    55:'Центр',56:'Дружба',57:'Аляска',58:'Східний',59:'Сонячний',
    60:'Новий Світ',61:'Центр',62:'Ювілейний',63:'Боярка',64:'Північний',
    65:'Щасливий',66:'Богунський',67:'Корольовський',68:'Зарічний',
    69:'Ковпаківський',70:'Шевченківський',71:'Київський',72:'Подільський',
    73:'Деснянський',74:'Новозаводський',75:'Фортечний',76:'Подільський',
    77:'Центр',78:'Затишний',79:'Першотравневий',80:'Садгірський',
    81:'Шевченківський',82:'Центральний',83:'Минайський',84:'Боздоський',
    85:'Радванський',86:'Центральний',87:'Зарічний',88:'Староміський',
    89:'Новоплановський',90:'Баглійський',91:'Дніпровський',92:'Заводський',
    93:'Центральний',94:'Мікрорайон Південний',95:'Мікрорайон Північний',
    96:'Центральний',97:'Південний',98:'Північний',99:'Дніпровський',
    100:'Суворовський',101:'Корабельний',102:'Центральний',103:'Заводський',
    104:'Інгульський',105:'Корабельний',106:'Центральний',107:'Південно-Західний',
    108:'Покровський',109:'Тернівський',110:'Саксаганський',
    111:'Довгинцівський',112:'Металургійний',113:'Центрально-Міський',114:'Інгулецький',
};

const ROOM_SHARING_LABELS = {
    1: 'Комфортно ділити кімнату',
    2: 'Хочу окрему кімнату',
};
const PREFERRED_GENDER_LABELS = {
    1: 'Лише з хлопцями',
    2: 'Лише з дівчатами',
    3: 'Не має значення',
};
const HOUSING_STATUS_LABELS = {
    1: 'Шукає квартиру та сусіда',
    2: 'Є квартира, шукає сусіда',
};

// ── Хелпери ───────────────────────────────────────────────────────────────

function lookup(options, value) {
    const found = options.find(o => o.value === value);
    return found ? found.label : '—';
}

function lookupMap(map, value) {
    return map[value] ?? '—';
}

/** Перетворює числовий діапазон [-10..10] у відсотки [0..100] */
function axisToPercent(value) {
    if (value === null || value === undefined) return 50;
    return Math.round(((value + 10) / 20) * 100);
}

/** Підпис для економічної осі */
function econLabel(value) {
    if (value === null || value === undefined) return 'Невідомо';
    if (value <= -4) return 'Лівий';
    if (value >= 4)  return 'Правий';
    return 'Центрист';
}

/** Підпис для соціальної осі */
function socLabel(value) {
    if (value === null || value === undefined) return 'Невідомо';
    if (value <= -4) return 'Ліберальний';
    if (value >= 4)  return 'Комунітарний';
    return 'Центрист';
}

/** Очищення значення від [0..100] */
function cleanlinessToPercent(value) {
    if (value === null || value === undefined) return 50;
    return Math.round(((value - 1) / 4) * 100);
}

/** extra_intro_version: -1, 0, 1 → [0..100] */
function personalityToPercent(value) {
    if (value === null || value === undefined) return 50;
    return Math.round(((value + 1) / 2) * 100);
}

function formatDate(dateStr) {
    if (!dateStr) return '—';
    const [y, m, d] = dateStr.split('-');
    return `${d}.${m}.${y}`;
}

// ── Головна функція ───────────────────────────────────────────────────────

/**
 * @param {Object} match  — один елемент з GET /api/matches/
 * @returns {Object}      — об'єкт у формі, яку очікує ProfileCard
 */
export function adaptMatch(match) {
    const user    = match.matched_user;
    const profile = user.profile  ?? {};
    const housing = user.housing  ?? {};
    const photos  = (profile.photos ?? []).map(p => p.image);

    // Підпис під іменем
    const city      = lookupMap(CITY_LABELS, housing.destination);
    const status    = lookup(statusOptions, profile.status);
    const orbit     = lookup(orbitOptions,  profile.orbit);
    const sub       = [city, status, orbit].filter(Boolean).join(' · ');

    // Хобі
    const hobbies = (profile.hobbies ?? [])
        .map(v => lookup(hobbyOptions, v))
        .filter(l => l !== '—');
    const customHobbies = profile.custom_hobbies ?? [];

    // Мови
    const languages = (profile.languages ?? [])
        .map(v => lookup(languageOptions, v))
        .filter(l => l !== '—');

    // Бюджет
    const budget = (housing.budget_min && housing.budget_max)
        ? `${housing.budget_min.toLocaleString('uk-UA')} – ${housing.budget_max.toLocaleString('uk-UA')} ₴`
        : '—';

    // Райони
    const districts = (housing.preferred_districts ?? [])
        .map(v => lookupMap(DISTRICT_LABELS, v))
        .filter(Boolean)
        .join(', ') || '—';

    // Бейджі
    const badges = [
        { kind: 'yellow',  text: lookupMap(HOUSING_STATUS_LABELS, housing.housing_status) },
        { kind: 'default', text: `Бюджет ${budget}` },
        districts !== '—' && { kind: 'outline', text: `${city} — ${districts}` },
    ].filter(Boolean);

    // Житлові уподобання (таблиця)
    const housingTable = [
        ['Преференція',         lookupMap(ROOM_SHARING_LABELS,    housing.room_sharing_preference)],
        ['З ким готовий жити',  lookupMap(PREFERRED_GENDER_LABELS, housing.preferred_gender)],
        ['Ситуація',            lookupMap(HOUSING_STATUS_LABELS,   housing.housing_status)],
        ['Бюджет',              budget],
        ['Місто',               city],
        ['Бажані райони',       districts],
        ['Термін проживання',   lookup(plannedDurationOptions, housing.planned_duration)],
        ['Дата заселення',      formatDate(housing.move_in_date)],
        ['Тваринка',            housing.has_pet
            ? (housing.pet_description || 'Є')
            : '—'],
    ];

    return {
        id:               match.id,
        name:             `${user.first_name} ${user.last_name}`,
        age:              user.age,
        photos,
        sub,
        badges,

        myVibe:           profile.my_vibe    ?? '',
        buddyVibe:        profile.buddy_vibe ?? '',

        cleanlinessPct:   cleanlinessToPercent(profile.cleanliness),
        personalityPct:   personalityToPercent(profile.extra_intro_version),

        schedule:         profile.schedule       ?? '—',
        sleepSchedule:    profile.sleep_schedule ?? '—',
        smokingLabel:     lookup(smokingOptions,  profile.smoking),
        partyingLabel:    lookup(partyingOptions, profile.partying),

        politicalEconLabel: econLabel(profile.political_coordinate_economic),
        politicalEconPct:   axisToPercent(profile.political_coordinate_economic),
        politicalSocLabel:  socLabel(profile.political_coordinate_social),
        politicalSocPct:    axisToPercent(profile.political_coordinate_social),

        languages,
        hobbies,
        customHobbies,
        housing: housingTable,

        // Скори сумісності
        totalScore:       match.total_score,
        scores: {
            vibe:        match.score_vibe,
            hobbies:     match.score_hobbies,
            cleanliness: match.score_cleanliness,
            smoking:     match.score_smoking,
            partying:    match.score_partying,
            political:   match.score_political,
            personality: match.score_personality,
            schedule:    match.score_schedule,
        },
    };
}
