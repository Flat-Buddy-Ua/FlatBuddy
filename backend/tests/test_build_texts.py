from types import SimpleNamespace
from unittest import TestCase

from user.constants.choices import Hobby
from user.matching.llm_scorer import _build_texts


def _profile(**overrides):
    base = dict(
        my_vibe="vibe text",
        buddy_vibe="buddy text",
        schedule="9-18",
        sleep_schedule="23:00 - 07:00",
        hobbies=[],
    )
    base.update(overrides)
    return SimpleNamespace(**base)


class BuildTextsHobbiesTests(TestCase):

    def test_empty_list_yields_empty_hobby_section(self):
        out = _build_texts(_profile(hobbies=[]))
        self.assertEqual(out["hobbies"], "Мої захоплення: ")

    def test_none_hobbies_yields_empty_hobby_section(self):
        out = _build_texts(_profile(hobbies=None))
        self.assertEqual(out["hobbies"], "Мої захоплення: ")

    def test_single_hobby_in_list_uses_label(self):
        out = _build_texts(_profile(hobbies=[Hobby.FITNESS]))
        self.assertEqual(out["hobbies"], f"Мої захоплення: {Hobby.FITNESS.label}")

    def test_multiple_hobbies_joined_with_comma(self):
        hobbies = [Hobby.FITNESS, Hobby.GAMING, Hobby.COOKING]
        out = _build_texts(_profile(hobbies=hobbies))
        expected = ", ".join(h.label for h in hobbies)
        self.assertEqual(out["hobbies"], f"Мої захоплення: {expected}")

    def test_invalid_hobby_id_skipped_not_raised(self):
        # 999 is outside the Hobby enum — must be silently skipped,
        # not crash the whole batch.
        out = _build_texts(_profile(hobbies=[Hobby.FITNESS, 999, Hobby.GAMING]))
        expected = ", ".join([Hobby.FITNESS.label, Hobby.GAMING.label])
        self.assertEqual(out["hobbies"], f"Мої захоплення: {expected}")

    def test_passing_list_does_not_raise_typeerror(self):
        # Regression guard for the original bug:
        # Hobby(profile.hobbies) on a list raised TypeError.
        try:
            _build_texts(_profile(hobbies=[1, 2, 3]))
        except TypeError as e:
            self.fail(f"_build_texts must accept a list of hobby ids, raised: {e}")


class BuildTextsOtherSectionsTests(TestCase):
    """Anything that wasn't part of the hobby fix must stay untouched."""

    def test_vibe_section_unchanged(self):
        out = _build_texts(_profile(my_vibe="абв", buddy_vibe="гд"))
        self.assertEqual(out["vibe"], "Стиль життя: абв Шукаю: гд")

    def test_schedule_section_unchanged(self):
        out = _build_texts(_profile(schedule="9-18", sleep_schedule="23:00 - 07:00"))
        self.assertEqual(out["schedule"], "Мій графік: 9-18. Режим сну: 23:00 - 07:00")

    def test_returned_keys(self):
        out = _build_texts(_profile())
        self.assertEqual(set(out.keys()), {"vibe", "hobbies", "schedule"})

    def test_none_text_fields_become_empty_strings(self):
        out = _build_texts(_profile(
            my_vibe=None, buddy_vibe=None,
            schedule=None, sleep_schedule=None,
        ))
        self.assertEqual(out["vibe"], "Стиль життя:  Шукаю: ")
        self.assertEqual(out["schedule"], "Мій графік: . Режим сну: ")
