import os
import sys
import django
import datetime
import random
from itertools import combinations


BACKEND_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
if BACKEND_DIR not in sys.path:
    sys.path.insert(0, BACKEND_DIR)

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'flatbuddy.settings')
django.setup()

from user.models import User, UserProfile, UserHousing, UserPriority, MatchResult
from user.constants.choices import (
    Country, City, Gender, Status, Orbit, 
    Language, Smoking, Partying, Hobby, 
    RoomSharing, PreferredGender, HousingStatus,
    PlannedDuration, Personality
)

users_data = [
    {
        "first_name": "Ярина",
        "email": "yaryna@test.com",
        "gender": Gender.FEMALE,
        "cleanliness": 5,
        "pol_x": -4, "pol_y": 7,
        "smoking": Smoking.NO, "partying": Partying.NO, "personality": Personality.INTROVERT, "hobbies": Hobby.TECHNOLOGY,
        "budget_min": 7000, "budget_max": 13000,
        "preferred_gender": PreferredGender.GIRLS_ONLY,
        "lifestyle": "Студентка магістратури з комп'ютерних наук, живу за строгим розкладом. Прокидаюся о 7:00, до 22:00 вже сплю. Вдома ціную абсолютну тишу — особливо з 19:00, коли роблю домашні завдання. Ніколи не залишаю брудний посуд. Алергія на сигаретний дим і домашніх тварин. Мінімалістичний інтер'єр — моя любов.",
        "bio": "Шукаю спокійну, відповідальну сусідку, яка поважає тишу і особистий простір. Обіцяю бути ідеальним сусідом: чисто, тихо, без гостей вночі. Важлива взаємоповага.",
        "schedule": "Прокидаюся о 7:00, лягаю о 22:00",
        "sleep_schedule": "22:00 - 7:00",
        "orbit": Orbit.STEM
    },
    {
        "first_name": "Олена",
        "email": "olena@test.com",
        "gender": Gender.FEMALE,
        "cleanliness": 5,
        "pol_x": -3, "pol_y": 6,
        "smoking": Smoking.NO, "partying": Partying.NO, "personality": Personality.INTROVERT, "hobbies": Hobby.LANGUAGES,
        "budget_min": 6000, "budget_max": 11000,
        "preferred_gender": PreferredGender.GIRLS_ONLY,
        "lifestyle": "Вчителька іноземних мов з 5-річним стажем. Дуже дисциплінована і пунктуальна — прокидаюся о 6:30 щодня. Вдома завжди прибрано, квіти на підвіконні, запах випічки у вихідні. Не курю, не п'ю, не люблю галас після 21:00. Вечорами читаю або вчу нові мови.",
        "bio": "Шукаю затишну і тиху кімнату. Обіцяю пригощати домашніми пирогами щонеділі і ніколи не шуміти. Ідеально, якщо у сусідки схожий режим дня і любов до порядку.",
        "schedule": "Прокидаюся о 6:30, лягаю о 21:00",
        "sleep_schedule": "21:00 - 6:30",
        "orbit": Orbit.EDUCATION
    },
    {
        "first_name": "Вікторія",
        "email": "viktoria@test.com",
        "gender": Gender.FEMALE,
        "cleanliness": 5,
        "pol_x": -5, "pol_y": 4,
        "smoking": Smoking.NO, "partying": Partying.OK, "personality": Personality.AMBIVERT, "hobbies": Hobby.ART,
        "budget_min": 9000, "budget_max": 16000,
        "preferred_gender": PreferredGender.GIRLS_ONLY,
        "lifestyle": "Фріланс-дизайнерка інтер'єрів. Працюю вдома з 9 до 18, тому робочий простір для мене — священне місце. Дотримуюся принципів мінімалізму: кожна річ на своєму місці, нічого зайвого. Обожнюю функціональну красу. Не терплю безладу — він буквально заважає мені думати.",
        "bio": "Шукаю естетичну квартиру і сумісну сусідку з відчуттям стилю. Люблю вино ввечері і перегляд архітектурних журналів. Тихий побут — мій пріоритет.",
        "schedule": "Прокидаюся о 8:00, лягаю о 23:00",
        "sleep_schedule": "23:00 - 8:00",
        "orbit": Orbit.ART
    },
    {
        "first_name": "Маркіян",
        "email": "markiyan@test.com",
        "gender": Gender.MALE,
        "cleanliness": 5,
        "pol_x": 1, "pol_y": -2,
        "smoking": Smoking.NO, "partying": Partying.NO, "personality": Personality.INTROVERT, "hobbies": Hobby.TECHNOLOGY,
        "budget_min": 11000, "budget_max": 22000,
        "preferred_gender": PreferredGender.DOESNT_MATTER,
        "lifestyle": "Senior інженер у міжнародній ІТ-компанії. Вдома практично не буваю — офіс і спортзал. Ціную чистоту на рівні готелю: все миється одразу, нічого не залишається на поверхнях. Встаю о 6, лягаю о 23. Колегам пояснюю: я 'продуктивний мовчун'. Гостей не запрошую.",
        "bio": "Шукаю адекватного сусіда, який поважає приватність і вміє мити посуд одразу після себе. Ніяких вечірок, ніякого диму. Ділю квартиру як бізнес-партнерство: кожен у своїй зоні.",
        "schedule": "Прокидаюся о 6:00, лягаю о 23:00",
        "sleep_schedule": "23:00 - 6:00",
        "orbit": Orbit.STEM
    },
    {
        "first_name": "Дмитро",
        "email": "dmytro@test.com",
        "gender": Gender.MALE,
        "cleanliness": 4,
        "pol_x": 0, "pol_y": 1,
        "smoking": Smoking.NO, "partying": Partying.OK, "personality": Personality.AMBIVERT, "hobbies": Hobby.GAMING,
        "budget_min": 8000, "budget_max": 14000,
        "preferred_gender": PreferredGender.DOESNT_MATTER,
        "lifestyle": "Розробник ігор на фрілансі. Вдома — моя фортеця: потужний ПК, два монітори, тихі навушники. Граю з командою вночі, але завжди в навушниках — сусіди нічого не чують. Посуд миємо одразу, їжу не лишаємо. Кіт є, але він гіпоалергенний і спить зі мною.",
        "bio": "Шукаю сусіда, якому потрібен потужний роутер і кондиціонер. В побуті невибагливий, але дотримуюся чистоти. Найважливіше — стабільний інтернет і спокійна атмосфера.",
        "schedule": "Прокидаюся о 10:00, лягаю о 2:00",
        "sleep_schedule": "2:00 - 10:00",
        "orbit": Orbit.STEM
    },
    {
        "first_name": "Максим",
        "email": "maksym@test.com",
        "gender": Gender.MALE,
        "cleanliness": 4,
        "pol_x": 4, "pol_y": 3,
        "smoking": Smoking.NO, "partying": Partying.NO, "personality": Personality.EXTROVERT, "hobbies": Hobby.FITNESS,
        "budget_min": 7000, "budget_max": 12000,
        "preferred_gender": PreferredGender.DOESNT_MATTER,
        "lifestyle": "Тренер з кросфіту і аматор здорового харчування. О 5:30 вже на ранковому пробіжці, о 7:00 сніданок з вівсянкою і яйцями. Готую багато, але завжди після себе прибираю. О 22:00 вже сплю — ранній підйом і режим недоторканні. Вихідні: гори або басейн.",
        "bio": "Шукаю сусіда з режимом і повагою до сну. Можу допомогти в залі або порадити план харчування. Вдома завжди є здорова їжа, якою ділюся. Вечірки — не моє, якщо тільки не спортивний перегляд.",
        "schedule": "Прокидаюся о 5:30, лягаю о 22:00",
        "sleep_schedule": "22:00 - 5:30",
        "orbit": Orbit.SPORT
    },
    {
        "first_name": "Роман",
        "email": "roman@test.com",
        "gender": Gender.MALE,
        "cleanliness": 4,
        "pol_x": 3, "pol_y": 4,
        "smoking": Smoking.NO, "partying": Partying.NO, "personality": Personality.INTROVERT, "hobbies": Hobby.RUNNING,
        "budget_min": 6500, "budget_max": 12000,
        "preferred_gender": PreferredGender.DOESNT_MATTER,
        "lifestyle": "Лікар-інтерн, змінний графік 2/2. Коли вдома — сплю, відновлююся або готую. Здоровий спосіб життя — не опція, а необхідність. Встаю рано, але тихо. Дуже цінує спокій і порядок після виснажливих змін. Не п'ю, не курю, спорт — щодня.",
        "bio": "Шукаю спокійного сусіда з режимом. Мій графік непередбачуваний, але вдома я — тінь. Чистота і тиша — базові потреби. Буду вдячний за порозуміння щодо раннього підйому.",
        "schedule": "Змінний графік 2/2",
        "sleep_schedule": "22:00 - 6:00",
        "orbit": Orbit.MEDICINE
    },
    {
        "first_name": "Оксана",
        "email": "oksana@test.com",
        "gender": Gender.FEMALE,
        "cleanliness": 3,
        "pol_x": -3, "pol_y": 5,
        "smoking": Smoking.OK, "partying": Partying.SOMETIMES, "personality": Personality.AMBIVERT, "hobbies": Hobby.ART,
        "budget_min": 5000, "budget_max": 9500,
        "preferred_gender": PreferredGender.GIRLS_ONLY,
        "lifestyle": "Художниця і ілюстраторка. Малюю вдень і ввечері дивлюся кіно — іноді гучно. На кухні завжди є пляма від кави, але я її завтра витру, обіцяю. Запрошую подруг раз на тиждень — спокійні посиденьки з вином і розмовами про мистецтво. Тварин не маю, але дуже люблю.",
        "bio": "Шукаю затишне місце без гучних вечірок, але і без надмірної строгості. Творчий безлад — частина процесу, але намагаюся тримати спільні зони в порядку.",
        "schedule": "Прокидаюся о 9:00, лягаю о 0:00",
        "sleep_schedule": "0:00 - 9:00",
        "orbit": Orbit.ART
    },
    {
        "first_name": "Настя",
        "email": "nastya@test.com",
        "gender": Gender.FEMALE,
        "cleanliness": 3,
        "pol_x": -5, "pol_y": 8,
        "smoking": Smoking.OK, "partying": Partying.YES, "personality": Personality.EXTROVERT, "hobbies": Hobby.VOLUNTEERING,
        "budget_min": 5000, "budget_max": 8500,
        "preferred_gender": PreferredGender.DOESNT_MATTER,
        "lifestyle": "Громадська активістка і волонтерка. Вдома — база для зустрічей і склад гуманітарної допомоги. Завжди купа коробок і людей. Живу за принципом 'дім відкритий для всіх'. Сама по собі охайна, але ресурси вдома постійно рухаються. Ціную людей більше за порядок.",
        "bio": "Шукаю не просто сусіда, а союзника. Якщо тобі близькі соціальні ініціативи — будемо чудово ладити. Якщо ні — потрібен хоча б той, хто не заважає добрим справам.",
        "schedule": "Гнучкий графік",
        "sleep_schedule": "23:00 - 8:00",
        "orbit": Orbit.SOCIAL
    },
    {
        "first_name": "Катерина",
        "email": "kateryna@test.com",
        "gender": Gender.FEMALE,
        "cleanliness": 3,
        "pol_x": 2, "pol_y": 2,
        "smoking": Smoking.OK, "partying": Partying.SOMETIMES, "personality": Personality.AMBIVERT, "hobbies": Hobby.TRAVELING,
        "budget_min": 7000, "budget_max": 12000,
        "preferred_gender": PreferredGender.DOESNT_MATTER,
        "lifestyle": "Маркетологиня в стартапі. Гнучкий графік — то рано, то пізно. Вдома середній порядок: ліжко застелене, кухня чиста, але на столі завжди стопка документів і кілька кухлів. Люблю запрошувати колег на вечерю раз-два на місяць. Повага до особистого простору — обов'язково.",
        "bio": "Шукаю сусіда, з яким можна і помовчати, і поговорити. Я — посередній варіант: не ідеально тихо і не хаотично. Просто живе, адекватне сусідство.",
        "schedule": "Гнучкий графік",
        "sleep_schedule": "23:00 - 8:00",
        "orbit": Orbit.BUSSINESS
    },
    {
        "first_name": "Богдан",
        "email": "bohdan@test.com",
        "gender": Gender.MALE,
        "cleanliness": 2,
        "pol_x": -2, "pol_y": 3,
        "smoking": Smoking.SOMETIMES, "partying": Partying.YES, "personality": Personality.EXTROVERT, "hobbies": Hobby.PLANTS,
        "budget_min": 5000, "budget_max": 9000,
        "preferred_gender": PreferredGender.DOESNT_MATTER,
        "lifestyle": "Аспірант-соціолог, пишу дисертацію. Вдома буваю багато, але тихо — читаю, пишу, слухаю подкасти. Раз на тиждень приходять колеги на дискусію — спокійні розмови за чаєм до 22:00. Охайний, але не педантичний. Люблю рослини.",
        "bio": "Шукаю сусіда, з яким можна зрідка поговорити про щось важливе і частіше мовчки займатися своїми справами. Середній рівень чистоти, але зі спільною повагою.",
        "schedule": "Студентський графік",
        "sleep_schedule": "1:00 - 9:00",
        "orbit": Orbit.SOCIAL
    },
    {
        "first_name": "Ірина",
        "email": "iryna@test.com",
        "gender": Gender.FEMALE,
        "cleanliness": 3,
        "pol_x": 0, "pol_y": 4,
        "smoking": Smoking.OK, "partying": Partying.SOMETIMES, "personality": Personality.AMBIVERT, "hobbies": Hobby.YOGA,
        "budget_min": 6000, "budget_max": 11000,
        "preferred_gender": PreferredGender.GIRLS_ONLY,
        "lifestyle": "Психологиня, веду онлайн-практику. Прийом клієнтів онлайн 4 дні на тиждень. Вдома завжди тиша і спокій — це моя умова для роботи. Займаюся йогою вранці, готую повільно і з насолодою. Рослини, свічки, ефірні олії — мій мікроклімат.",
        "bio": "Шукаю safe space і усвідомленого сусіда. Повага до кордонів і тиші в робочий час — обов'язкова умова. Зате вміння слухати і підтримати — завжди поруч.",
        "schedule": "Онлайн-практика",
        "sleep_schedule": "23:00 - 8:00",
        "orbit": Orbit.SOCIAL
    },
    {
        "first_name": "Тарас",
        "email": "taras@test.com",
        "gender": Gender.MALE,
        "cleanliness": 2,
        "pol_x": 5, "pol_y": -3,
        "smoking": Smoking.YES, "partying": Partying.YES, "personality": Personality.EXTROVERT, "hobbies": Hobby.WRITING,
        "budget_min": 4500, "budget_max": 8000,
        "preferred_gender": PreferredGender.DOESNT_MATTER,
        "lifestyle": "Журналіст-фрілансер, пишу репортажі і веду блог. Живу хаотично — то засиджуюся до 3 ночі з дедлайном, то сплю до обіду. Вдома купа книг, газет і рукописів скрізь. Намагаюся прибирати, але 'пізніше' часто не настає. Зате завжди цікаво і є що обговорити.",
        "bio": "Шукаю толерантного сусіда, який не буде ускладнювати побут. Плачу вчасно, не шумлю вночі (лише пишу), намагаюся бути адекватним. Але порядок — не моя сильна сторона.",
        "schedule": "Пізній підйом, пізній відбій",
        "sleep_schedule": "3:00 - 11:00",
        "orbit": Orbit.SOCIAL
    },
    {
        "first_name": "Соломія",
        "email": "solomiia@test.com",
        "gender": Gender.FEMALE,
        "cleanliness": 4,
        "pol_x": -4, "pol_y": 6,
        "smoking": Smoking.NO, "partying": Partying.OK, "personality": Personality.INTROVERT, "hobbies": Hobby.MUSIC,
        "budget_min": 7000, "budget_max": 13000,
        "preferred_gender": PreferredGender.GIRLS_ONLY,
        "lifestyle": "Студентка консерваторії, грю на скрипці. Репетирую вдома щодня з 10 до 14 — але класична музика, не метал. Ціную атмосферу і естетику простору. Вдома завжди квіти, свічки і негучна музика. Режим: підйом о 8, відбій о 23.",
        "bio": "Шукаю тиху сусідку, яка цінує спокій і культуру. Буду раді спільним вечорам з чаєм і хорошою музикою. Куріння, гучні вечірки і безлад — категорично не підходять.",
        "schedule": "Прокидаюся о 8:00, лягаю о 23:00",
        "sleep_schedule": "23:00 - 8:00",
        "orbit": Orbit.ART
    },
    {
        "first_name": "Андрій",
        "email": "andriy@test.com",
        "gender": Gender.MALE,
        "cleanliness": 3,
        "pol_x": 2, "pol_y": 0,
        "smoking": Smoking.OK, "partying": Partying.SOMETIMES, "personality": Personality.AMBIVERT, "hobbies": Hobby.TECHNOLOGY,
        "budget_min": 8000, "budget_max": 14000,
        "preferred_gender": PreferredGender.DOESNT_MATTER,
        "lifestyle": "Бекенд-розробник, працюю віддалено. Вдома — основне місце роботи і відпочинку. Ранки тихі, вечори гнучкі. Можу затриматися за кодом до опівночі, але без шуму. Люблю порядок на кухні — для мене це питання поваги до спільного простору.",
        "bio": "Шукаю адекватного сусіда без фанатизму. Мені потрібна тиша для роботи вдень і можливість спокійно відпочити ввечері. Гості — ок, але не щодня і не до ранку.",
        "schedule": "Прокидаюся о 9:00, лягаю о 0:00",
        "sleep_schedule": "0:00 - 9:00",
        "orbit": Orbit.STEM
    },
    {
        "first_name": "Артем",
        "email": "artem@test.com",
        "gender": Gender.MALE,
        "cleanliness": 3,
        "pol_x": 1, "pol_y": 2,
        "smoking": Smoking.OK, "partying": Partying.SOMETIMES, "personality": Personality.AMBIVERT, "hobbies": Hobby.TRAVELING,
        "budget_min": 7500, "budget_max": 13000,
        "preferred_gender": PreferredGender.DOESNT_MATTER,
        "lifestyle": "Менеджер проектів у рекламному агентстві. Офіс з 9 до 19, потім спортзал або друзі. Вдома переважно ввечері — вечеря, серіал, сон. Вихідні активні: подорожі або кафе. До чистоти ставлюся спокійно: загальні зони тримаю в порядку, своя кімната — моя справа.",
        "bio": "Шукаю нейтрального сусіда — щоб не заважати одне одному і при потребі нормально спілкуватися. Без надмірних правил і контролю. Живи своїм життям, я живу своїм.",
        "schedule": "Офіс з 9 до 19",
        "sleep_schedule": "0:00 - 8:00",
        "orbit": Orbit.BUSSINESS
    },
    {
        "first_name": "Денис",
        "email": "denys@test.com",
        "gender": Gender.MALE,
        "cleanliness": 2,
        "pol_x": 6, "pol_y": -5,
        "smoking": Smoking.SOMETIMES, "partying": Partying.YES, "personality": Personality.EXTROVERT, "hobbies": Hobby.GAMING,
        "budget_min": 5000, "budget_max": 9000,
        "preferred_gender": PreferredGender.DOESNT_MATTER,
        "lifestyle": "Студент і заядлий геймер. Вдома — мій світ: ПК, два монітори, мікрофон для стрімів. Лягаю пізно — ігри з командою до 3-4 ранку. Прокидаюся о 13:00. З прибиранням — 'коли дістане'. Їжа: доставка або мівіна. Але нікому не заважаю.",
        "bio": "Шукаю сусіда, якому пофіг на мій режим і яким пофіг мій режим. Я тихий у своїй кімнаті, не лізу в чужі справи. Потрібна лише стабільна мережа і спокій.",
        "schedule": "Нічний режим",
        "sleep_schedule": "5:00 - 13:00",
        "orbit": Orbit.STEM
    },
    {
        "first_name": "Крістіна",
        "email": "kristina@test.com",
        "gender": Gender.FEMALE,
        "cleanliness": 2,
        "pol_x": -6, "pol_y": 9,
        "smoking": Smoking.SOMETIMES, "partying": Partying.YES, "personality": Personality.EXTROVERT, "hobbies": Hobby.MUSIC,
        "budget_min": 4000, "budget_max": 7000,
        "preferred_gender": PreferredGender.DOESNT_MATTER,
        "lifestyle": "Барменша і DJ на підробітку. Додому повертаюся о 4-5 ранку щоп'ятниці та щосуботи. Вдень сплю до 13:00, потім хаотично живу до наступного виходу. Безлад — це мій природний стан. Кухня: 'щось знайдеться'. Люблю гучну музику і спонтанні гості після клубу.",
        "bio": "Шукаю сусіда без зайвих запитань і з розумінням нічного ритму. Я не заважаю твоєму дню, ти не заважаєш моїй ночі. Ідеально, якщо теж любиш музику.",
        "schedule": "Нічний режим",
        "sleep_schedule": "7:00 - 15:00",
        "orbit": Orbit.SERVICE
    },
    {
        "first_name": "Вадим",
        "email": "vadym@test.com",
        "gender": Gender.MALE,
        "cleanliness": 1,
        "pol_x": 9, "pol_y": -8,
        "smoking": Smoking.OK, "partying": Partying.YES, "personality": Personality.AMBIVERT, "hobbies": Hobby.GAMING,
        "budget_min": 8000, "budget_max": 15000,
        "preferred_gender": PreferredGender.DOESNT_MATTER,
        "lifestyle": "Стример і контент-мейкер. Веду прямі ефіри по 6-8 годин — часто вночі, бо аудиторія переважно американська. Кімната захаращена технікою, коробками і упаковками від їжі. Замовляю їжу щодня — коробки складаються стопками. Прибирання? Лише якщо фонить у кадрі.",
        "bio": "Шукаю максимально толерантного сусіда. Я не злий — просто зайнятий своїм контентом 24/7. Фінансово стабільний, вчасно плачу. Але мій стиль життя — специфічний, чесно кажу.",
        "schedule": "Нічний стрімінг",
        "sleep_schedule": "6:00 - 14:00",
        "orbit": Orbit.ART
    },
    {
        "first_name": "Роман1",
        "email": "roman1@test.com",
        "gender": Gender.MALE,
        "cleanliness": 4,
        "pol_x": -3, "pol_y": 5,
        "smoking": Smoking.NO, "partying": Partying.OK, "personality": Personality.AMBIVERT, "hobbies": Hobby.CYCLING,
        "budget_min": 7000, "budget_max": 10000,
        "preferred_gender": PreferredGender.DOESNT_MATTER,
        "lifestyle": "В цілому веду здебільшого активний спосіб життя. Працюю в IT-шці, у вільний час бігаю, гуляю, катаюсь на велосипеді. Люблю посидіти в центрі, відпочити від важкого дня. Можу попрацювати вночі за потреби. Обожнюю музику. Вдома тримаю порядок — для мене це норма, а не зусилля.",
        "bio": "Головне — повага до особистого простору. Не обов'язково, щоб ви були дуже екстравертивні, ця штука дуже опційна. Будьте уважними до базової чистоти. Жодної руснявої!!!",
        "schedule": "Гнучкий IT-графік",
        "sleep_schedule": "0:00 - 8:00",
        "orbit": Orbit.STEM
    },
    {
        "first_name": "Ярина1",
        "email": "yaryna1@test.com",
        "gender": Gender.FEMALE,
        "cleanliness": 5,
        "pol_x": 1, "pol_y": -1,
        "smoking": Smoking.NO, "partying": Partying.NO, "personality": Personality.INTROVERT, "hobbies": Hobby.LITERATURE,
        "budget_min": 8000, "budget_max": 12000,
        "preferred_gender": PreferredGender.GIRLS_ONLY,
        "lifestyle": "Студентка 2 курсу комп. наук. Я за натурою людина спокійна без різких змін у графіку. У вільний час стараюся не замикатися в чотирьох стінах: люблю спокійні прогулянки, щоб перезавантажитись, або ж відпочиваю за книгою чи серіалом. Можу інколи засиджуватись допізна за навчанням, але в середньому стараюсь лягати до опівночі.",
        "bio": "Шукаю дівчину, яка вміє поважати особисті кордони та дотримується чистоти (але не на рівні Ольги-Фреймут, а базово). Раптова поява гостей у квартирі без попередження — сорі, не мій варіант. Толерація руснявого — теж одразу мінус.",
        "schedule": "Студентський графік",
        "sleep_schedule": "23:00 - 8:00",
        "orbit": Orbit.STEM
    },
    {
        "first_name": "Оля",
        "email": "olya@test.com",
        "gender": Gender.FEMALE,
        "cleanliness": 4,
        "pol_x": -3, "pol_y": 5,
        "smoking": Smoking.OK, "partying": Partying.SOMETIMES, "personality": Personality.AMBIVERT, "hobbies": Hobby.PLANTS,
        "budget_min": 7000, "budget_max": 11000,
        "preferred_gender": PreferredGender.DOESNT_MATTER,
        "lifestyle": "Стартапер, викладаю англ онлайн, часто відсутня вдома. Сова (працюю до 01:00 зазвичай за ноутом). Люблю всі види музики, слухаю інколи на фоні. Класно готую, можу і на двох, якщо помиєте посуд. Вдома затишно — є рослини, свічки, гарний смак в інтер'єрі.",
        "bio": "Хтось чіловий, активний по життю, без обсесії чистотою — базово її підтримую, але витирати крапельки з умивальника кожен раз не буду. Шукаю людину з гумором і повагою до чужого ритму.",
        "schedule": "Сова, працюю до 1:00",
        "sleep_schedule": "1:00 - 9:00",
        "orbit": Orbit.BUSSINESS
    }
]

print("Починаємо створення тестових користувачів...")

for u in users_data:
    user, created = User.objects.update_or_create(
        email=u['email'],
        defaults={
            'first_name': u['first_name'],
            'last_name': 'Тестовий',
            'gender': u['gender'],
            'country': Country.UKRAINE,
            'city': City.LVIV,
            'birthdate': datetime.date(1995 + random.randint(0, 7), 1, 1),
            'is_active': True,
            'phone_number': f"+38067{random.randint(1000000, 9999999)}",
        }
    )
    
    user.set_password('testpass123')
    user.save()

    UserProfile.objects.update_or_create(
        user=user,
        defaults={
            'status': Status.STUDENT if ("Студент" in u['lifestyle'] or "інтерн" in u['lifestyle']) else Status.WORKING,
            'orbit': u['orbit'],
            'languages': [Language.UK, Language.EN],
            'cleanliness': u['cleanliness'],
            'my_vibe': u['lifestyle'],
            'buddy_vibe': u['bio'],
            'schedule': u['schedule'],
            'sleep_schedule': u['sleep_schedule'],
            'smoking': u['smoking'],
            'partying': u['partying'],
            'extra_intro_version': u['personality'],
            'hobbies': [u['hobbies']], 
            'political_coordinate_economic': u['pol_x'],
            'political_coordinate_social': u['pol_y'],
            'custom_hobbies': ["Тестове хобі"], 
        }
    )
    
    UserHousing.objects.update_or_create(
        user=user,
        defaults={
            'room_sharing_preference': RoomSharing.WANT_PRIVATE,
            'preferred_gender': u['preferred_gender'],
            'housing_status': HousingStatus.LOOKING_FOR_BOTH,
            'budget_min': u['budget_min'],
            'budget_max': u['budget_max'],
            'destination': City.LVIV,
            'planned_duration': PlannedDuration.FROM_6_TO_12_MONTHS,
            'move_in_date': datetime.date(2026, 9, 1),
            'has_pet': False,
        }
    )

    UserPriority.objects.get_or_create(user=user, defaults={'fields': ['cleanliness', 'vibe']})

    action = "Створено" if created else "Оновлено"
    print(f"{action}: {u['first_name']} ({u['email']})")

created_emails = [u['email'] for u in users_data]
test_users = list(User.objects.filter(email__in=created_emails))

print("\nГенеруємо тестові матчі...")
matches_created = 0

for user_a, user_b in combinations(test_users, 2):
    if random.random() > 0.6:
        continue
        
    u1, u2 = sorted([user_a, user_b], key=lambda x: x.id)

    MatchResult.objects.update_or_create(
        user_1=u1,
        user_2=u2,
        defaults={
            'status': MatchResult.Status.DONE,
            'hard_filter_passed': True,        
            'total_score': random.randint(60, 99),
            'score_vibe': random.randint(60, 99),
            'score_hobbies': random.randint(60, 99),
            'score_cleanliness': random.randint(60, 99),
            'score_smoking': random.randint(60, 99),
            'score_partying': random.randint(60, 99),
            'score_political': random.randint(60, 99),
            'score_personality': random.randint(60, 99),
            'score_schedule': random.randint(60, 99),
        }
    )
    matches_created += 1

print(f"Створено/оновлено {len(users_data)} користувачів та {matches_created} матчів.")