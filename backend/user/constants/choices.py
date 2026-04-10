from django.db import models

class Country(models.IntegerChoices):
    UKRAINE = 1, 'Україна'

class Gender(models.IntegerChoices):
    MALE = 1, 'Чоловік'
    FEMALE = 2, 'Жінка'
    OTHER = 3, 'Інша'

class City(models.IntegerChoices):
    KYIV = 1, 'Київ'
    LVIV = 2, 'Львів'
    KHARKIV = 3, 'Харків'
    ODESA = 4, 'Одеса'
    DNIPRO = 5, 'Дніпро'
    ZAPORIZHZHIA = 6, 'Запоріжжя'
    VINNYTSIA = 7, 'Вінниця'
    CHERKASY = 8, 'Черкаси'
    IVANO_FRANKIVSK = 9, 'Івано-Франківськ'
    TERNOPIL = 10, 'Тернопіль'
    RIVNE = 11, 'Рівне'
    ZHYTOMYR = 12, 'Житомир'
    SUMY = 13, 'Суми'
    POLTAVA = 14, 'Полтава'
    CHERNIHIV = 15, 'Чернігів'
    KROPYVNYTSKYI = 16, 'Кропивницький'
    LUTSK = 17, 'Луцьк'
    KHMELNYTSKYI = 18, 'Хмельницький'
    MYKOLAIV = 19, 'Миколаїв'
    CHERNIVTSI = 20, 'Чернівці'
    UZHHOROD = 21, 'Ужгород'
    BEREHOVE = 22, 'Берегове'
    KAMIANETS_PODILSKYI = 23, "Кам'янець-Подільський"
    KAMIANSKE = 24, "Кам'янське"
    BILA_TSERKVA = 25, 'Біла Церква'
    BROVARY = 26, 'Бровари'
    KHERSON = 27, 'Херсон'
    MUKACHEVO = 28, 'Мукачево'
    KREMENCHUK = 29, 'Кременчук'
    KONOTOP = 30, 'Конотоп'
    UMAN = 31, 'Умань'
    YAREMCHE = 32, 'Яремче'

class District(models.IntegerChoices):
    # Київ
    KYIV_HOLOSIIVSKYI = 1, 'Голосіївський'
    KYIV_DARNYTSKYI = 2, 'Дарницький'
    KYIV_DESNYANSKYI = 3, 'Деснянський'
    KYIV_DNIPROVSKYI = 4, 'Дніпровський'
    KYIV_OBOLONSKYI = 5, 'Оболонський'
    KYIV_PECHERSKYI = 6, 'Печерський'
    KYIV_PODILSKYI = 7, 'Подільський'
    KYIV_SVIATOSHYNSKYI = 8, 'Святошинський'
    KYIV_SOLOMIANSKYI = 9, 'Солом’янський'
    KYIV_SHEVCHENKIVSKYI = 10, 'Шевченківський'
    # Львів
    LVIV_HALYTSKYI = 11, 'Галицький'
    LVIV_ZALIZNYCHNYI = 12, 'Залізничний'
    LVIV_LYCHAKIVSKYI = 13, 'Личаківський'
    LVIV_SYKHIVSKYI = 14, 'Сихівський'
    LVIV_FRANKIVSKYI = 15, 'Франківський'
    LVIV_SHEVCHENKIVSKYI = 16, 'Шевченківський'
    # Харків
    KHARKIV_Kholodnohirskyi = 17, 'Холодногірський'
    KHARKIV_SHEVCHENKIVSKYI = 18, 'Шевченківський'
    KHARKIV_KYIVSKYI = 19, 'Київський'
    KHARKIV_SALTIVSKYI = 20, 'Салтівський'
    KHARKIV_NEMYSHLIANSKYI = 21, 'Немишлянський'
    KHARKIV_INDUTRIALNYI = 22, 'Індустріальний'
    KHARKIV_SLOBIDSKYI = 23, 'Слобідський'
    KHARKIV_OSNOVYANSKYI = 24, 'Основ’янський'
    KHARKIV_NOVOBAVARSKYI = 25, 'Новобаварський'
    # Одеса
    ODESA_KYIVSKYI = 26, 'Київський'
    ODESA_KHYDZHYBEISKYI = 27, 'Хаджибейський'
    ODESA_PRYMORSKYI = 28, 'Приморський'
    ODESA_PERESYPSKYI = 29, 'Пересипський'
    # Дніпро
    DNIPRO_AMUR_NYZHNODNIPROVSKYI = 30, 'Амур-Нижньодніпровський'
    DNIPRO_SHEVCHENKIVSKYI = 31, 'Шевченківський'
    DNIPRO_SOBORNYI = 32, 'Соборний'
    DNIPRO_INDUTRIALNYI = 33, 'Індустріальний'
    DNIPRO_TSENTRALNYI = 34, 'Центральний'
    DNIPRO_CHECHELIVSKYI = 35, 'Чечелівський'
    DNIPRO_NOVOYADATSKYI = 36, 'Новокодацький'
    DNIPRO_SAMARSKYI = 37, 'Самарський'
    # Запоріжжя
    ZAPORIZHZHIA_ZAVODSKYI = 38, 'Заводський'
    ZAPORIZHZHIA_KHORTYTSKYI = 39, 'Хортицький'
    ZAPORIZHZHIA_KOMUNARSKYI = 40, 'Комунарський'
    ZAPORIZHZHIA_DNIPROVSKYI = 41, 'Дніпровський'
    ZAPORIZHZHIA_OLEKSANDRIVSKYI = 42, 'Олександрівський'
    ZAPORIZHZHIA_VOZNESENIVSKYI = 43, 'Вознесенівський'
    ZAPORIZHZHIA_SHEVCHENKIVSKYI = 44, 'Шевченківський'
    # Вінниця
    VINNYTSIA_ZAMOSTIANSKYI = 45, 'Замостянський'
    VINNYTSIA_LIVOBEREZHNYI = 46, 'Лівобережний'
    VINNYTSIA_STAROMISKYI = 47, 'Староміський'
    # Черкаси
    CHERKASY_PRYDNIPROVSKYI = 48, 'Придніпровський'
    CHERKASY_SOSNIVSKYI = 49, 'Соснівський'
    # Івано-Франківськ
    IF_TSENTRALNYI = 50, 'Центральний'
    IF_PASICHNA = 51, 'Пасічна'
    IF_BAM = 52, 'БАМ'
    IF_KASKAD = 53, 'Каскад'
    IF_ZARICHCHIA = 54, 'Заріччя'
    # Тернопіль
    TERNOPIL_TSENTR = 55, 'Центр'
    TERNOPIL_DRUZHBA = 56, 'Дружба'
    TERNOPIL_ALiASKA = 57, 'Аляска'
    TERNOPIL_SKHIDNYI = 58, 'Східний'
    TERNOPIL_SONYACHNYI = 59, 'Сонячний'
    TERNOPIL_NOVYI_SVIT = 60, 'Новий Світ'
    # Рівне
    RIVNE_TSENTR = 61, 'Центр'
    RIVNE_YUVILENYI = 62, 'Ювілейний'
    RIVNE_BOYARKA = 63, 'Боярка'
    RIVNE_PIVNICHNYI = 64, 'Північний'
    RIVNE_SCHASLYVYI = 65, 'Щасливий'
    # Житомир
    ZHYTOMYR_BOHUNSKYI = 66, 'Богунський'
    ZHYTOMYR_KOROLOVSKYI = 67, 'Корольовський'
    # Суми
    SUMY_ZARICHNYI = 68, 'Зарічний'
    SUMY_KOVPAKOVSKYI = 69, 'Ковпаківський'
    # Полтава
    POLTAVA_SHEVCHENKIVSKYI = 70, 'Шевченківський'
    POLTAVA_KYIVSKYI = 71, 'Київський'
    POLTAVA_PODYLSKYI = 72, 'Подільський'
    # Чернігів
    CHERNIHIV_DESNYANSKYI = 73, 'Деснянський'
    CHERNIHIV_NOVODZAVODSKYI = 74, 'Новозаводський'
    # Кропивницький
    KROPYVNYTSKYI_FORTECHNYI = 75, 'Фортечний'
    KROPYVNYTSKYI_PODILSKYI = 76, 'Подільський'
    # Луцьк
    LUTSK_TSENTR = 77, 'Центр'
    LUTSK_ZATYSHNYI = 78, 'Затишний'
    # Чернівці
    CHERNIVTSI_PERSHOTRAVNEVYI = 79, 'Першотравневий'
    CHERNIVTSI_SADGORSKYI = 80, 'Садгірський'
    CHERNIVTSI_SHEVCHENKIVSKYI = 81, 'Шевченківський'
    # Ужгород
    UZHHOROD_TSENTR = 82, 'Центральний'
    UZHHOROD_MINAI = 83, 'Минайський'
    UZHHOROD_BOZDOSH = 84, 'Боздоський'
    UZHHOROD_RADVANKA = 85, 'Радванський'
    # Берегове
    BEREHOVE_TSENTR = 86, 'Центральний'
    BEREHOVE_ZARICHNYI = 87, 'Зарічний'
    # Кам'янець-Подільський
    KP_STAROMISKYI = 88, 'Староміський'
    KP_NOVOPLANOVSKYI = 89, 'Новоплановський'
    # Кам'янське
    KAMIANSKE_BAHLIISKYI = 90, 'Баглійський'
    KAMIANSKE_DNIPROVSKYI = 91, 'Дніпровський'
    KAMIANSKE_ZAVODSKYI = 92, 'Заводський'
    # Біла Церква
    BT_TSENTR = 93, 'Центральний'
    BT_PIVDENNYI = 94, 'Мікрорайон Південний'
    BT_PIVNICHNYI = 95, 'Мікрорайон Північний'
    # Бровари
    BROVARY_TSENTR = 96, 'Центральний'
    BROVARY_PIVDENNYI = 97, 'Південний'
    BROVARY_PIVNICHNYI = 98, 'Північний'
    # Херсон
    KHERSON_DNIPROVSKYI = 99, 'Дніпровський'
    KHERSON_SUvOROVSKYI = 100, 'Суворовський'
    KHERSON_KORABELNYI = 101, 'Корабельний'
    # Миколаїв (ID 19 - райони були загублені або йдуть під іншими ID, додамо для повноти)
    MYKOLAIV_TSENTRALNYI = 102, 'Центральний'
    MYKOLAIV_ZAVODSKYI = 103, 'Заводський'
    MYKOLAIV_INGULSKYI = 104, 'Інгульський'
    MYKOLAIV_KORABELNYI = 105, 'Корабельний'
    # Хмельницький (ID 18 - аналогічно)
    KHMEL_TSENTRALNYI = 106, 'Центральний'
    KHMEL_PIVDENNO_ZAKHIDNYI = 107, 'Південно-Західний'


# Мапінг: Якому місту які райони належать. 
# Ключ - ID міста, Значення - список ID районів (або об'єктів District)
CITY_DISTRICTS_MAPPING = {
    City.KYIV: [
        District.KYIV_HOLOSIIVSKYI, District.KYIV_DARNYTSKYI, District.KYIV_DESNYANSKYI, 
        District.KYIV_DNIPROVSKYI, District.KYIV_OBOLONSKYI, District.KYIV_PECHERSKYI, 
        District.KYIV_PODILSKYI, District.KYIV_SVIATOSHYNSKYI, District.KYIV_SOLOMIANSKYI, 
        District.KYIV_SHEVCHENKIVSKYI
    ],
    City.LVIV: [
        District.LVIV_HALYTSKYI, District.LVIV_ZALIZNYCHNYI, District.LVIV_LYCHAKIVSKYI, 
        District.LVIV_SYKHIVSKYI, District.LVIV_FRANKIVSKYI, District.LVIV_SHEVCHENKIVSKYI
    ],
    City.KHARKIV: [
        District.KHARKIV_Kholodnohirskyi, District.KHARKIV_SHEVCHENKIVSKYI, District.KHARKIV_KYIVSKYI, 
        District.KHARKIV_SALTIVSKYI, District.KHARKIV_NEMYSHLIANSKYI, District.KHARKIV_INDUTRIALNYI, 
        District.KHARKIV_SLOBIDSKYI, District.KHARKIV_OSNOVYANSKYI, District.KHARKIV_NOVOBAVARSKYI
    ],
    City.ODESA: [
        District.ODESA_KYIVSKYI, District.ODESA_KHYDZHYBEISKYI, District.ODESA_PRYMORSKYI, 
        District.ODESA_PERESYPSKYI
    ],
    City.DNIPRO: [
        District.DNIPRO_AMUR_NYZHNODNIPROVSKYI, District.DNIPRO_SHEVCHENKIVSKYI, District.DNIPRO_SOBORNYI, 
        District.DNIPRO_INDUTRIALNYI, District.DNIPRO_TSENTRALNYI, District.DNIPRO_CHECHELIVSKYI, 
        District.DNIPRO_NOVOYADATSKYI, District.DNIPRO_SAMARSKYI
    ],
    City.ZAPORIZHZHIA: [
        District.ZAPORIZHZHIA_ZAVODSKYI, District.ZAPORIZHZHIA_KHORTYTSKYI, District.ZAPORIZHZHIA_KOMUNARSKYI,
        District.ZAPORIZHZHIA_DNIPROVSKYI, District.ZAPORIZHZHIA_OLEKSANDRIVSKYI, District.ZAPORIZHZHIA_VOZNESENIVSKYI,
        District.ZAPORIZHZHIA_SHEVCHENKIVSKYI
    ],
    City.VINNYTSIA: [
        District.VINNYTSIA_ZAMOSTIANSKYI, District.VINNYTSIA_LIVOBEREZHNYI, District.VINNYTSIA_STAROMISKYI
    ],
    City.CHERKASY: [
        District.CHERKASY_PRYDNIPROVSKYI, District.CHERKASY_SOSNIVSKYI
    ],
    City.IVANO_FRANKIVSK: [
        District.IF_TSENTRALNYI, District.IF_PASICHNA, District.IF_BAM, District.IF_KASKAD, District.IF_ZARICHCHIA
    ],
    City.TERNOPIL: [
        District.TERNOPIL_TSENTR, District.TERNOPIL_DRUZHBA, District.TERNOPIL_ALiASKA, 
        District.TERNOPIL_SKHIDNYI, District.TERNOPIL_SONYACHNYI, District.TERNOPIL_NOVYI_SVIT
    ],
    City.RIVNE: [
        District.RIVNE_TSENTR, District.RIVNE_YUVILENYI, District.RIVNE_BOYARKA, District.RIVNE_PIVNICHNYI, District.RIVNE_SCHASLYVYI
    ],
    City.ZHYTOMYR: [
        District.ZHYTOMYR_BOHUNSKYI, District.ZHYTOMYR_KOROLOVSKYI
    ],
    City.SUMY: [
        District.SUMY_ZARICHNYI, District.SUMY_KOVPAKOVSKYI
    ],
    City.POLTAVA: [
        District.POLTAVA_SHEVCHENKIVSKYI, District.POLTAVA_KYIVSKYI, District.POLTAVA_PODYLSKYI
    ],
    City.CHERNIHIV: [
        District.CHERNIHIV_DESNYANSKYI, District.CHERNIHIV_NOVODZAVODSKYI
    ],
    City.KROPYVNYTSKYI: [
        District.KROPYVNYTSKYI_FORTECHNYI, District.KROPYVNYTSKYI_PODILSKYI
    ],
    City.LUTSK: [
        District.LUTSK_TSENTR, District.LUTSK_ZATYSHNYI
    ],
    City.CHERNIVTSI: [
        District.CHERNIVTSI_PERSHOTRAVNEVYI, District.CHERNIVTSI_SADGORSKYI, District.CHERNIVTSI_SHEVCHENKIVSKYI
    ],
    City.UZHHOROD: [
        District.UZHHOROD_TSENTR, District.UZHHOROD_MINAI, District.UZHHOROD_BOZDOSH, District.UZHHOROD_RADVANKA
    ],
    City.BEREHOVE: [
        District.BEREHOVE_TSENTR, District.BEREHOVE_ZARICHNYI
    ],
    City.KAMIANETS_PODILSKYI: [
        District.KP_STAROMISKYI, District.KP_NOVOPLANOVSKYI
    ],
    City.KAMIANSKE: [
        District.KAMIANSKE_BAHLIISKYI, District.KAMIANSKE_DNIPROVSKYI, District.KAMIANSKE_ZAVODSKYI
    ],
    City.BILA_TSERKVA: [
        District.BT_TSENTR, District.BT_PIVDENNYI, District.BT_PIVNICHNYI
    ],
    City.BROVARY: [
        District.BROVARY_TSENTR, District.BROVARY_PIVDENNYI, District.BROVARY_PIVNICHNYI
    ],
    City.KHERSON: [
        District.KHERSON_DNIPROVSKYI, District.KHERSON_SUvOROVSKYI, District.KHERSON_KORABELNYI
    ],
    City.MYKOLAIV: [
        District.MYKOLAIV_TSENTRALNYI, District.MYKOLAIV_ZAVODSKYI, District.MYKOLAIV_INGULSKYI, District.MYKOLAIV_KORABELNYI
    ],
    City.KHMELNYTSKYI: [
        District.KHMEL_TSENTRALNYI, District.KHMEL_PIVDENNO_ZAKHIDNYI
    ]
}

COUNTRY_CHOICES = {
    1: "Україна"
}

CITY_CHOICES = {
    1: "Київ",
    2: "Львів",
    3: "Харків",
    4: "Одеса",
    5: "Дніпро",
    6: "Запоріжжя",
    7: "Вінниця",
    8: "Черкаси",
    9: "Івано-Франківськ",
    10: "Тернопіль",
    11: "Рівне",
    12: "Житомир",
    13: "Суми",
    14: "Полтава",
    15: "Чернігів",
    16: "Кропивницький",
    17: "Луцьк",
    18: "Хмельницький",
    19: "Миколаїв",
    20: "Чернівці",
    21: "Ужгород",
    22: "Берегове",
    23: "Кам'янець-Подільський",
    24: "Кам'янське",
    25: "Біла Церква",
    26: "Бровари",
    27: "Херсон",
    28: "Мукачево",
    29: "Кременчук",
    30: "Конотоп",
    31: "Умань",
    32: "Кривий Ріг",
}


VALID_GENDERS = {
    1: "Чоловік",
    2: "Жінка",
    3: "Інше"
}

UNIVERSITY_CHOICES = {
    1: "Вінницький національний медичний університет",
    2: "Волинський національний університет імені Лесі Українки",
    3: "Дніпровський національний університет імені Олеся Гончара",
    4: "Івано-Франківський національний медичний університет",
    5: "Запорізький державний інженерний університет",
    6: "Запорізький національний технічний університет",
    7: "Запорізький національний університет",
    8: "Києво-Могилянська академія",
    9: "Київська державна академія декоративно-прикладного мистецтва",
    10: "Київська школа економіки",
    11: "Київський медичний університет",
    12: "Київський національний економічний університет",
    13: "Київський національний університет будівництва і архітектури",
    14: "Київський національний університет імені Тараса Шевченка",
    15: "Київський національний університет культури і мистецтв",
    16: "Київський національний університет театру, кіно і телебачення",
    17: "Криворізький державний педагогічний університет",
    18: "Львівська національна академія мистецтв",
    19: "Львівська національна музична академія",
    20: "Львівський державний аграрний університет",
    21: "Львівський національний університет імені Івана Франка",
    22: "Маріупольський державний університет",
    23: "Міжнародний Соломонів університет",
    24: "Національна академія управління",
    25: "Національний авіаційний університет",
    26: "Національний лісотехнічний університет України",
    27: "Національний медичний університет імені О.О. Богомольця",
    28: "Національний педагогічний університет імені М.П. Драгоманова",
    29: "Національний технічний університет \"Київський політехнічний інститут\"",
    30: "Національний університет \"Львівська політехніка\"",
    31: "Національний університет біоресурсів і природокористування",
    32: "Національний університет \"Одеська політехніка\"",
    33: "Національний юридичний університет імені Ярослава Мудрого",
    34: "Одеська національна музична академія",
    35: "Одеський національний університет іменя І.І. Мечникова",
    36: "Полтавський національний технічний університет",
    37: "Рівненський державний гуманітарний університет",
    38: "Сумський державний університет",
    39: "Тернопільський національний технічний університет",
    40: "Чернівецький національний університет імені Юрія Федьковича",
    41: "Чернігівський національний технологічний університет",
    42: "Черкаський державний технологічний університет",
    43: "Ужгородський національний університет",
    44: "Харківський національний медичний університет",
    45: "Харківський національний педагогічний університет",
    46: "Харківський національний університет імені В.Н. Каразіна",
    47: "Харківський національний університет мистецтв",
    48: "Харківський національний університет радіоелектроніки",
    49: "Херсонський державний університет",
    50: "Хмельницький національний університет",
}


MBTI_CHOICES = {
    1: "Архітектор - INTJ-A / INTJ-T",
    2: "Логік - INTP-A / INTP-T",
    3: "Командир - ENTJ-A / ENTJ-T",
    4: "Полеміст - ENTP-A / ENTP-T",
    5: "Адвокат - INFJ-A / INFJ-T",
    6: "Посередник - INFP-A / INFP-T",
    7: "Протагоніст - ENFJ-A / ENFJ-T",
    8: "Активіст - ENFP-A / ENFP-T",
    9: "Логіст - ISTJ-A / ISTJ-T",
    10: "Захисник - ISFJ-A / ISFJ-T",
    11: "Керівник - ESTJ-A / ESTJ-T",
    12: "Консул - ESFJ-A / ESFJ-T",
    13: "Віртуоз - ISTP-A / ISTP-T",
    14: "Авантюрист - ISFP-A / ISFP-T",
    15: "Підприємець - ESTP-A / ESTP-T",
    16: "Артист - ESFP-A / ESFP-T",
}

PERSONALITY_CHOICES = {

    -1: "Інтроверт",
    0: "Амбіверт",
    1: "Екстраверт",

}

LANGUAGE_CHOICES = {
    'en': 'en English',
    'uk': '🇺🇦 Українська',
    'fr': '🇫🇷 Français',
    'de': '🇩🇪 Deutsch',
    'es': '🇪🇸 Español',
    'pl': '🇵🇱 Polski',
    'it': '🇮🇹 Italiano',
    'pt': '🇵🇹 Português',
    'ar': '🇸🇦 العربية',
    'ja': '🇯🇵 日本語',
    'ko': '🇰🇷 한국어',
    'zh': '🇨🇳 中文',
    'ru': '🇷🇺 Русский',
    'tr': '🇹🇷 Türkçe',
    'nl': '🇳🇱 Nederlands',
    'cs': '🇨🇿 Čeština',
    'sk': '🇸🇰 Slovenčina',
    'hu': '🇭🇺 Magyar',
    'ro': '🇷🇴 Română',
    'bg': '🇧🇬 Български',
}


ROOM_SHARING_CHOICES = {
    1: 'Mені комфортно ділити кімнату з співмешканцем',
    2: 'Я хочу мати окрему кімнату',
}

PREFERRED_GENDER_CHOICES = {
    1: 'Лише з хлопцями',
    2: 'Лише з дівчатами',
    3: 'Не має значення',
}

HOUSING_STATUS_CHOICES = {
    1: 'Я шукаю квартиру та співмешканця',
    2: 'Я шукаю лише співмешканця, маю свою/орендовану квартиру',
}


DISTRICTS_BY_CITY = {
    # Київ (ID 1)
    1: {
        1: 'Печерський',
        2: 'Шевченківський',
        3: 'Подільський',
        4: 'Дарницький',
        5: 'Деснянський',
        6: 'Дніпровський',
        7: 'Голосіївський',
        8: 'Солом\'янський',
        9: 'Оболонський',
        10: 'Святошинський',
    },
    # Львів (ID 2)
    2: {
        11: 'Залізничний',
        12: 'Личаківський',
        13: 'Франківський',
        14: 'Шевченківський',
        15: 'Сихівський',
        16: 'Галицький',
    },
    # Харків (ID 3)
    3: {
        17: 'Шевченківський',
        18: 'Київський',
        19: 'Московський',
        20: 'Немишлянський',
        21: 'Індустріальний',
        22: 'Салтівський',
        23: 'Холодногірський',
        24: 'Новобаварський',
    },
    # Одеса (ID 4)
    4: {
        25: 'Приморський',
        26: 'Малиновський',
        27: 'Київський',
        28: 'Суворовський',
    },
    # Дніпро (ID 5)
    5: {
        29: 'Амур-Нижньодніпровський',
        30: 'Шевченківський',
        31: 'Соборний',
        32: 'Індустріальний',
        33: 'Новокодацький',
        34: 'Самарський',
        35: 'Центральний',
    },
    # Запоріжжя (ID 6)
    6: {
        36: 'Вознесенівський',
        37: 'Комунарський',
        38: 'Олександрівський',
        39: 'Шевченківський',
        40: 'Заводський',
        41: 'Хортицький',
        42: 'Дніпровський',
    },
    # Вінниця (ID 7)
    7: {
        43: 'Замостянський',
        44: 'Ленінський',
        45: 'Староміський',
    },
    # Черкаси (ID 8)
    8: {
        46: 'Придніпровський',
        47: 'Соснівський',
    },
    # Івано-Франківськ (ID 9)
    9: {
        48: 'Галицький',
        49: 'Надвірнянський',
        50: 'Тисменицький',
    },
    # Тернопіль (ID 10)
    10: {
        51: 'Центральний',
        52: 'Залізничний',
        53: 'Кутківецький',
    },
    # Рівне (ID 11)
    11: {
        54: 'Центральний',
        55: 'Зарічний',
        56: 'Млинівський',
    },
    # Житомир (ID 12)
    12: {
        57: 'Богунський',
        58: 'Корольовський',
    },
    # Суми (ID 13)
    13: {
        59: 'Ковпаківський',
        60: 'Засумський',
    },
    # Полтава (ID 14)
    14: {
        61: 'Шевченківський',
        62: 'Київський',
        63: 'Подільський',
    },
    # Чернігів (ID 15)
    15: {
        64: 'Деснянський',
        65: 'Новозаводський',
    },
    # Кропивницький (ID 16)
    16: {
        66: 'Фортечний',
        67: 'Подільський',
    },
    # Луцьк (ID 17)
    17: {
        68: 'Заводський',
        69: 'Центральний',
    },
    # Хмельницький (ID 18)
    18: {
        70: 'Центральний',
        71: 'Кам\'янецький',
    },
    # Миколаїв (ID 19)
    19: {
        72: 'Центральний',
        73: 'Заводський',
        74: 'Інгульський',
        75: 'Корабельний',
    },
    # Чернівці (ID 20)
    20: {
        76: 'Шевченківський',
        77: 'Першотравневий',
        78: 'Садибський',
    },
    # Ужгород (ID 21)
    21: {
        79: 'Центральний',
        80: 'Малобаганський',
        81: 'Радванський',
    },
    # Берегове (ID 22)
    22: {
        82: 'Центральний',
        83: 'Зарічний',
    },
    # Кам'янець-Подільський (ID 23)
    23: {
        84: 'Староміський',
        85: 'Новоплановський',
    },
    # Кам'янське (ID 24)
    24: {
        86: 'Баглійський',
        87: 'Дніпровський',
        88: 'Заводський',
    },
    # Біла Церква (ID 25)
    25: {
        89: 'Центральний',
        90: 'Мікрорайон Південний',
        91: 'Мікрорайон Північний',
    },
    # Бровари (ID 26)
    26: {
        92: 'Центральний',
        93: 'Південний',
        94: 'Північний',
    },
    # Херсон (ID 27)
    27: {
        95: 'Дніпровський',
        96: 'Суворовський',
        97: 'Корабельний',
    },
    # Мукачево (ID 28)
    28: {
        98: 'Центральний',
        99: 'Підзамче',
        100: 'Південний',
    },
    # Кременчук (ID 29)
    29: {
        101: 'Автозаводський',
        102: 'Крюківський',
    },
    # Конотоп (ID 30)
    30: {
        103: 'Центральний',
        104: 'Залізничний',
    },
    # Умань (ID 31)
    31: {
        105: 'Центральний',
        106: 'Залізничний',
    },
    # Кривий Ріг (ID 32)
    32: {
        107: 'Довгинцівський',
        108: 'Інгулецький',
        109: 'Металургійний',
        110: 'Покровський',
        111: 'Саксаганський',
        112: 'Тернівський',
        113: 'Центрально-Міський',
    },

}
