import django, os, time, sys
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'flatbuddy.settings')
django.setup()

class MockHousing:
    def __init__(self, **kw):
        [setattr(self, k, v) for k, v in kw.items()]

class MockProfile:
    def __init__(self, **kw):
        [setattr(self, k, v) for k, v in kw.items()]

class MockUser:
    def __init__(self, id, gender, profile, housing):
        self.id = id
        self.gender = gender
        self.profile = profile
        self.housing = housing
    def __getattr__(self, name):
        raise AttributeError(name)

p1 = MockProfile(
    status=2, orbit=6,
    languages=['uk', 'en', 'de'],
    political_coordinate_economic=-3, political_coordinate_social=6,
    cleanliness=5,
    my_vibe=(
        "Я дуже дисциплінована та пунктуальна людина, що звикла до чіткого графіка. "
        "У моїй квартирі завжди панує атмосфера затишку та ідеальної чистоти, на підвіконнях "
        "багато доглянутих квітів, а щовихідних оселя наповнюється приємним запахом домашньої "
        "випічки. Я ціную спокій, не маю шкідливих звичок і віддаю перевагу тихому вечору з "
        "книгою замість галасливих компаній."
    ),
    buddy_vibe=(
        "Шукаю інтелігентну та виховану співмешканку, для якої дім — це місце відпочинку та "
        "відновлення сил. Мені важливо, щоб ми поважали тишу одна одної, особливо після дев'ятої "
        "вечора. Буде чудово, якщо ви також любите порядок і цінуєте домашній затишок так само "
        "сильно, як і я."
    ),
    schedule="Робота в школі з 8:30 до 16:00, вечорами — підготовка до занять та репетиторство.",
    sleep_schedule="Прокидаюся о 6:30, лягаю спати близько 22:30. Дотримуюся режиму дня.",
    smoking=4, extra_intro_version=-1, hobbies=17, partying=4,
)
h1 = MockHousing(
    room_sharing_preference=2, preferred_gender=2,
    housing_status=1, budget_min=6000, budget_max=11000,
    destination=1, preferred_districts=[],
    planned_duration=2, move_in_date='2025-09-01', has_pet=False,
)
u1 = MockUser(id=1, gender=2, profile=p1, housing=h1)

p2 = MockProfile(
    status=2, orbit=5,
    languages=['uk', 'en', 'fr'],
    political_coordinate_economic=-5, political_coordinate_social=4,
    cleanliness=5,
    my_vibe=(
        "Мій стиль життя базується на принципах естетичного мінімалізму та функціональності. "
        "Оскільки я працюю вдома, мій робочий простір для мене є священним, де кожна річ має своє "
        "строго визначене місце. Я дуже чутлива до візуального шуму та безладу, тому підтримую "
        "стерильну чистоту навколо себе. Люблю завершувати день з келихом хорошого вина, "
        "переглядаючи архітектурні журнали або займаючись художньою фотографією."
    ),
    buddy_vibe=(
        "Шукаю сучасну, стильну співмешканку, яка розуміє цінність приватного простору та естетики "
        "побуту. Для мене важливо жити з людиною, яка не захаращує спільні зони зайвими речами та "
        "підтримує високий рівень охайності. Ідеально, якщо ви також працюєте у творчій чи "
        "інтелектуальній сфері, цінуєте тишу протягом робочого дня."
    ),
    schedule="Працюю вдома за графіком 9:00 - 18:00, повна концентрація на проектах.",
    sleep_schedule="Лягаю о 00:00, прокидаюся о 8:30. Люблю повільний ранок з кавою.",
    smoking=3, extra_intro_version=0, hobbies=10, partying=3,
)
h2 = MockHousing(
    room_sharing_preference=2, preferred_gender=2,
    housing_status=1, budget_min=9000, budget_max=16000,
    destination=1, preferred_districts=[],
    planned_duration=3, move_in_date='2025-09-01', has_pet=False,
)
u2 = MockUser(id=2, gender=2, profile=p2, housing=h2)

from user.matching.hard_filters import passes_hard_filters
passed, reason = passes_hard_filters(u1, u2)
print(f"\nHard filter: {'✅ пройдено' if passed else f'❌ відхилено — {reason}'}")

if not passed:
    exit()

from user.matching.numeric_scorer import (
    score_cleanliness, score_smoking, score_partying,
    score_political, score_personality,
)
from user.matching.llm_scorer import score_vibe, score_hobbies, score_schedule

t_start = time.perf_counter()

t0 = time.perf_counter(); s_clean   = score_cleanliness(p1, p2); t_clean   = time.perf_counter() - t0
t0 = time.perf_counter(); s_smoking = score_smoking(p1, p2);     t_smoking = time.perf_counter() - t0
t0 = time.perf_counter(); s_party   = score_partying(p1, p2);    t_party   = time.perf_counter() - t0
t0 = time.perf_counter(); s_pol     = score_political(p1, p2);   t_pol     = time.perf_counter() - t0
t0 = time.perf_counter(); s_pers    = score_personality(p1, p2); t_pers    = time.perf_counter() - t0
t0 = time.perf_counter(); s_vibe    = score_vibe(p1, p2);        t_vibe    = time.perf_counter() - t0
t0 = time.perf_counter(); s_hobbies = score_hobbies(p1, p2);     t_hobbies = time.perf_counter() - t0
t0 = time.perf_counter(); s_schedule= score_schedule(p1, p2);    t_schedule= time.perf_counter() - t0

t_total = time.perf_counter() - t_start

weights = {
    'vibe': 0.30, 'cleanliness': 0.20, 'schedule': 0.15,
    'hobbies': 0.10, 'smoking': 0.10, 'partying': 0.05,
    'political': 0.05, 'personality': 0.05,
}
total = round(
    s_vibe     * weights['vibe']        +
    s_clean    * weights['cleanliness'] +
    s_schedule * weights['schedule']    +
    s_hobbies  * weights['hobbies']     +
    s_smoking  * weights['smoking']     +
    s_party    * weights['partying']    +
    s_pol      * weights['political']   +
    s_pers     * weights['personality'],
1)

tier = "🟢 HIGH" if total > 70 else ("🟡 MID" if total > 40 else "🔴 LOW")

print(f"\n{'='*50}")
print(f"  Аня ↔ Оля        {total}%  {tier}")
print(f"{'='*50}")
print(f"  Вайб:        {s_vibe}%   ({t_vibe:.2f}s)")
print(f"  Охайність:   {s_clean}%   ({t_clean:.2f}s)")
print(f"  Графік:      {s_schedule}%   ({t_schedule:.2f}s)")
print(f"  Хобі:        {s_hobbies}%   ({t_hobbies:.2f}s)")
print(f"  Паління:     {s_smoking}%   ({t_smoking:.2f}s)")
print(f"  Вечірки:     {s_party}%   ({t_party:.2f}s)")
print(f"  Погляди:     {s_pol}%   ({t_pol:.2f}s)")
print(f"  Особистість: {s_pers}%   ({t_pers:.2f}s)")
print(f"{'='*50}")
print(f"  ⏱  Загальний час: {t_total:.2f}s")
print(f"{'='*50}")