REQUIRED_PROFILE_FIELDS = [
    'status', 'cleanliness',
    'my_vibe', 'buddy_vibe',
    'schedule', 'sleep_schedule',
    'smoking', 'extra_intro_version',
    'hobbies', 'partying',
]

REQUIRED_HOUSING_FIELDS = [
    'room_sharing_preference', 'preferred_gender', 'housing_status',
    'budget_min', 'budget_max', 'destination',
    'planned_duration', 'move_in_date',
]

def is_profile_complete(user) -> tuple[bool, list[str]]:
    missing = []

    try:
        profile = user.profile
    except Exception:
        return False, ['profile_missing']

    for field in REQUIRED_PROFILE_FIELDS:
        val = getattr(profile, field, None)
        if val is None or val == '' or val == []:
            missing.append(f'profile.{field}')

    try:
        housing = user.housing
    except Exception:
        return False, ['housing_missing']

    for field in REQUIRED_HOUSING_FIELDS:
        val = getattr(housing, field, None)
        if val is None or val == '':
            missing.append(f'housing.{field}')

    return len(missing) == 0, missing