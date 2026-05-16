def genders_compatible(user1, h1, user2, h2) -> bool:
    from user.constants.choices import PreferredGender, Gender

    def _ok(preferred, other_gender):
        if preferred is None or preferred == PreferredGender.DOESNT_MATTER:
            return True
        if preferred == PreferredGender.GUYS_ONLY:
            return other_gender == Gender.MALE
        if preferred == PreferredGender.GIRLS_ONLY:
            return other_gender == Gender.FEMALE
        return True

    return (
        _ok(h1.preferred_gender, user2.gender) and
        _ok(h2.preferred_gender, user1.gender)
    )

def districts_compatible(h1, h2) -> bool:
    if not h1.preferred_districts or not h2.preferred_districts:
        return True
    return bool(set(h1.preferred_districts) & set(h2.preferred_districts))


def languages_compatible(p1, p2) -> bool:
    l1 = set(p1.languages or [])
    l2 = set(p2.languages or [])
    if not l1 or not l2:
        return True
    return bool(l1 & l2)

def passes_hard_filters(user1, user2) -> tuple[bool, str]:
    h1 = user1.housing
    h2 = user2.housing
    p1 = user1.profile
    p2 = user2.profile

    if h1.destination != h2.destination:
        return False, 'different_city'

    if not genders_compatible(user1, h1, user2, h2):
        return False, 'gender_mismatch'

    if not districts_compatible(h1, h2):
        return False, 'district_mismatch'

    if not languages_compatible(p1, p2):
        return False, 'no_common_language'

    return True, ''