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

class Status(models.IntegerChoices):
    STUDENT = 1, 'Студент'
    WORKING = 2, 'Працюю'
    BOTH = 3, 'Студент і працюю'
    
class Orbit(models.IntegerChoices):
    STEM = 1, 'STEM та IT'
    BUSSINESS = 2, 'Бізнес та Управління'
    SOCIAL = 3, 'Соціальні науки та гуманітарні дисципліни'
    SPORT = 4, 'Здоров’я та спорт'
    ART = 5, 'Творча індустрія та дизайн'
    EDUCATION = 6, 'Освіта та педагогіка'
    SERVICE = 7, 'Сфера послуг'
    MILITARY = 8, 'Військова справа, безпека та правоохоронні органи'
    MEDICINE = 9, 'Медицина та охорона здоров’я'

class University(models.IntegerChoices):
    VNMU = 1, "Вінницький національний медичний університет"
    VNU_LESI_UKRAINKY = 2, "Волинський національний університет імені Лесі Українки"
    DNU_HONCHARA = 3, "Дніпровський національний університет імені Олеся Гончара"
    IFNMU = 4, "Івано-Франківський національний медичний університет"
    ZDIU = 5, "Запорізький державний інженерний університет"
    ZNTU = 6, "Запорізький національний технічний університет"
    ZNU = 7, "Запорізький національний університет"
    KMA = 8, "Києво-Могилянська академія"
    KDADM = 9, "Київська державна академія декоративно-прикладного мистецтва"
    KSE = 10, "Київська школа економіки"
    KMU = 11, "Київський медичний університет"
    KNEU = 12, "Київський національний економічний університет"
    KNUBA = 13, "Київський національний університет будівництва і архітектури"
    KNU_SHEVCHENKA = 14, "Київський національний університет імені Тараса Шевченка"
    KNUKIM = 15, "Київський національний університет культури і мистецтв"
    KNUTKT = 16, "Київський національний університет театру, кіно і телебачення"
    KDPU = 17, "Криворізький державний педагогічний університет"
    LNAM = 18, "Львівська національна академія мистецтв"
    LNMA = 19, "Львівська національна музична академія"
    LDAU = 20, "Львівський державний аграрний університет"
    LNU_FRANKA = 21, "Львівський національний університет імені Івана Франка"
    MDU = 22, "Маріупольський державний університет"
    MSU = 23, "Міжнародний Соломонів університет"
    NAU_MANAGEMENT = 24, "Національна академія управління"
    NAU = 25, "Національний авіаційний університет"
    NLTU = 26, "Національний лісотехнічний університет України"
    NMU_BOHOMOLTSIA = 27, "Національний медичний університет імені О.О. Богомольця"
    NPU_DRAHOMANOVA = 28, "Національний педагогічний університет імені М.П. Драгоманова"
    KPI = 29, "Національний технічний університет \"Київський політехнічний інститут\""
    NULP = 30, "Національний університет \"Львівська політехніка\""
    NUBIP = 31, "Національний університет біоресурсів і природокористування"
    NU_ODESKA_POLITEKHNIKA = 32, "Національний університет \"Одеська політехніка\""
    NYU_MUROHO = 33, "Національний юридичний університет імені Ярослава Мудрого"
    ONMA = 34, "Одеська національна музична академія"
    ONU_MECHNYKOVA = 35, "Одеський національний університет іменя І.І. Мечникова"
    PNTU = 36, "Полтавський національний технічний університет"
    RDHU = 37, "Рівненський державний гуманітарний університет"
    SUMDU = 38, "Сумський державний університет"
    TNTU = 39, "Тернопільський національний технічний університет"
    CHNU_FEDKOVYCHA = 40, "Чернівецький національний університет імені Юрія Федьковича"
    CHNTU = 41, "Чернігівський національний технологічний університет"
    CHDTU = 42, "Черкаський державний технологічний університет"
    UZHNU = 43, "Ужгородський національний університет"
    KHNMU = 44, "Харківський національний медичний університет"
    KHNPU = 45, "Харківський національний педагогічний університет"
    KHNU_KARAZINA = 46, "Харківський національний університет імені В.Н. Каразіна"
    KHNUM = 47, "Харківський національний університет мистецтв"
    KHNURE = 48, "Харківський національний університет радіоелектроніки"
    KHDU = 49, "Херсонський державний університет"
    KHNU = 50, "Хмельницький національний університет"

class MBTI(models.IntegerChoices):
    INTJ = 1, "Архітектор - INTJ-A / INTJ-T"
    INTP = 2, "Логік - INTP-A / INTP-T"
    ENTJ = 3, "Командир - ENTJ-A / ENTJ-T"
    ENTP = 4, "Полеміст - ENTP-A / ENTP-T"
    INFJ = 5, "Адвокат - INFJ-A / INFJ-T"
    INFP = 6, "Посередник - INFP-A / INFP-T"
    ENFJ = 7, "Протагоніст - ENFJ-A / ENFJ-T"
    ENFP = 8, "Активіст - ENFP-A / ENFP-T"
    ISTJ = 9, "Логіст - ISTJ-A / ISTJ-T"
    ISFJ = 10, "Захисник - ISFJ-A / ISFJ-T"
    ESTJ = 11, "Керівник - ESTJ-A / ESTJ-T"
    ESFJ = 12, "Консул - ESFJ-A / ESFJ-T"
    ISTP = 13, "Віртуоз - ISTP-A / ISTP-T"
    ISFP = 14, "Авантюрист - ISFP-A / ISFP-T"
    ESTP = 15, "Підприємець - ESTP-A / ESTP-T"
    ESFP = 16, "Артист - ESFP-A / ESFP-T"

class Personality(models.IntegerChoices):
    INTROVERT = -1, "Інтроверт"
    AMBIVERT = 0, "Амбіверт"
    EXTROVERT = 1, "Екстраверт"

class Language(models.TextChoices):
    UK = 'uk', '🇺🇦 Українська'
    EN = 'en', 'en English'
    FR = 'fr', '🇫🇷 Français'
    DE = 'de', '🇩🇪 Deutsch'
    ES = 'es', '🇪🇸 Español'
    PL = 'pl', '🇵🇱 Polski'
    IT = 'it', '🇮🇹 Italiano'
    PT = 'pt', '🇵🇹 Português'
    AR = 'ar', '🇸🇦 العربية'
    JA = 'ja', '🇯🇵 日本語'
    KO = 'ko', '🇰🇷 한국어'
    ZH = 'zh', '🇨🇳 中文'
    RU = 'ru', '🇷🇺 Русский'
    TR = 'tr', '🇹🇷 Türkçe'
    NL = 'nl', '🇳🇱 Nederlands'
    CS = 'cs', '🇨🇿 Čeština'
    SK = 'sk', '🇸🇰 Slovenčina'
    HU = 'hu', '🇭🇺 Magyar'
    RO = 'ro', '🇷🇴 Română'
    BG = 'bg', '🇧🇬 Български'

class RoomSharing(models.IntegerChoices):
    OK_WITH_ROOMMATE = 1, 'Mені комфортно ділити кімнату з співмешканцем'
    WANT_PRIVATE = 2, 'Я хочу мати окрему кімнату'

class PreferredGender(models.IntegerChoices):
    GUYS_ONLY = 1, 'Лише з хлопцями'
    GIRLS_ONLY = 2, 'Лише з дівчатами'
    DOESNT_MATTER = 3, 'Не має значення'

class HousingStatus(models.IntegerChoices):
    LOOKING_FOR_BOTH = 1, 'Я шукаю квартиру та співмешканця'
    HAVE_HOUSING = 2, 'Я шукаю лише співмешканця, маю свою/орендовану квартиру'
    
class Smoking(models.IntegerChoices):
    YES = 1, 'Палю'
    SOMETIMES = 2, 'Іноді палю'
    OK = 3, 'Не палю, але це не проблема для мене'
    NO = 4, 'Проти паління'
    
class Partying(models.IntegerChoices):
    YES = 1, 'Люблю вечірки/гостей'
    SOMETIMES = 2, 'Іноді люблю вечірки/гостей'
    OK = 3, 'Це не проблема для мене'
    NO = 4, 'Проти вечірок/гостей'
    
class Hobby(models.IntegerChoices):
    # --- Спорт і активність ---
    FITNESS = 1, 'Фітнес / Тренажерний зал'
    RUNNING = 2, 'Біг / Легка атлетика'
    YOGA = 3, 'Йога / Медитація'
    CYCLING = 4, 'Велоспорт'
    TEAM_SPORTS = 5, 'Командні види спорту'
    MARTIAL_ARTS = 6, 'Бойові мистецтва'
    HIKING = 7, 'Походи / Гори'

    # --- Творчість та мистецтво ---
    MUSIC = 8, 'Музика / Гра на інструментах'
    PHOTOGRAPHY = 9, 'Фотографія / Відео'
    ART = 10, 'Малювання / Дизайн'
    HANDICRAFT = 11, 'Рукоділля / DIY'
    WRITING = 12, 'Письменництво / Блогінг'

    # --- Розваги та гік-культура ---
    GAMING = 13, 'Відеоігри'
    BOARD_GAMES = 14, 'Настільні ігри'
    MOVIES = 15, 'Кіно та Серіали'
    ANIME = 16, 'Аніме / Манга'
    LITERATURE = 17, 'Книги / Література'

    # --- Стиль життя та інше ---
    COOKING = 18, 'Кулінарія / Випічка'
    TRAVELING = 19, 'Подорожі / Туризм'
    PETS = 20, 'Домашні тварини'
    PLANTS = 21, 'Кімнатні рослини'
    VOLUNTEERING = 22, 'Волонтерство'
    TECHNOLOGY = 23, 'Технології / Програмування'
    LANGUAGES = 24, 'Вивчення мов'
    FASHION = 25, 'Мода / Стиль'
    
class PlannedDuration(models.IntegerChoices):
    LESS_THAN_6_MONTHS = 1, 'Менше 6 місяців'
    FROM_6_TO_12_MONTHS = 2, 'Від 6 до 12 місяців'
    MORE_THAN_1_YEAR = 3, 'Більше 1 року'
    
class Language(models.TextChoices):
    EN = 'en', 'English'
    UK = 'uk', 'Українська'
    FR = 'fr', 'Français'
    DE = 'de', 'Deutsch'
    ES = 'es', 'Español'
    PL = 'pl', 'Polski'
    IT = 'it', 'Italiano'
    PT = 'pt', 'Português'
    AR = 'ar', 'العربية'
    JA = 'ja', '日本語'
    KO = 'ko', '한국어'
    ZH = 'zh', '中文'
    RU = 'ru', 'Русский'
    TR = 'tr', 'Türkçe'
    NL = 'nl', 'Nederlands'
    CS = 'cs', 'Čeština'
    SK = 'sk', 'Slovenčina'
    HU = 'hu', 'Magyar'
    RO = 'ro', 'Română'
    BG = 'bg', 'Български'
    SV = 'sv', 'Svenska'
    HR = 'hr', 'Hrvatski'
    
UKRAINIAN_PATTERN = r"^[А-ЩЬЮЯҐЄІЇ][а-щьюяґєії'\-]*$"

VALID_UA_PHONE_CODES = [
    # Київстар
    '067', '068', '096', '097', '098',
    # Vodafone
    '050', '066', '095', '099',
    # lifecell
    '063', '073', '093',
    # Інтертелеком
    '089', '094',
    # ТриМоб
    '091',
    # People.net
    '092',
    # Фінтелеком
    '039'
]