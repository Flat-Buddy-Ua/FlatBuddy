import itertools
import numpy as np
from django.core.management.base import BaseCommand

FIELDS = ['vibe', 'hobbies', 'schedule']

def cosine(a, b):
    a = np.asarray(a, dtype=np.float32)
    b = np.asarray(b, dtype=np.float32)
    denom = np.linalg.norm(a) * np.linalg.norm(b)
    if denom < 1e-9:
        return 0.0
    return float(np.dot(a, b) / denom)


class Command(BaseCommand):
    help = 'Calibrate cosine similarity thresholds for LLM scorers'

    def add_arguments(self, parser):
        parser.add_argument(
            '--field',
            choices=FIELDS + ['all'],
            default='all',
            help='Which embedding field to analyse (default: all)',
        )
        parser.add_argument(
            '--sample',
            type=int,
            default=None,
            help='Max number of profiles to load (default: all)',
        )
        parser.add_argument(
            '--low-pct',
            type=float,
            default=10.0,
            help='Percentile to use as low threshold (default: 10)',
        )
        parser.add_argument(
            '--high-pct',
            type=float,
            default=90.0,
            help='Percentile to use as high threshold (default: 90)',
        )

    def handle(self, *args, **options):
        from user.models import UserProfile

        target_fields = FIELDS if options['field'] == 'all' else [options['field']]
        low_pct  = options['low_pct']
        high_pct = options['high_pct']
        sample   = options['sample']

        self.stdout.write(self.style.MIGRATE_HEADING(
            f'\n=== Calibrating thresholds (low_pct={low_pct}, high_pct={high_pct}) ===\n'
        ))

        qs = UserProfile.objects.exclude(embedding_vibe__isnull=True)
        if sample:
            qs = qs[:sample]

        profiles = list(qs.only('id', 'embedding_vibe', 'embedding_hobbies', 'embedding_schedule'))
        n = len(profiles)

        if n < 2:
            self.stdout.write(self.style.ERROR('Потрібно хоча б 2 профілі з embeddings.'))
            return

        self.stdout.write(f'Завантажено {n} профілів → {n*(n-1)//2} пар\n')

        results = {}

        for field in target_fields:
            attr = f'embedding_{field}'
            pairs_with_data = [
                (p1, p2)
                for p1, p2 in itertools.combinations(profiles, 2)
                if getattr(p1, attr) and getattr(p2, attr)
            ]

            if not pairs_with_data:
                self.stdout.write(self.style.WARNING(f'[{field}] Немає пар з embeddings, пропускаємо.'))
                continue

            sims = [cosine(getattr(p1, attr), getattr(p2, attr)) for p1, p2 in pairs_with_data]
            sims = np.array(sims)

            p_low  = float(np.percentile(sims, low_pct))
            p_high = float(np.percentile(sims, high_pct))

            results[field] = {'low': p_low, 'high': p_high, 'sims': sims}

            self.stdout.write(self.style.SUCCESS(f'\n[{field}] ({len(sims)} пар)'))
            self.stdout.write(f'  min    = {sims.min():.4f}')
            self.stdout.write(f'  p10    = {float(np.percentile(sims, 10)):.4f}')
            self.stdout.write(f'  p25    = {float(np.percentile(sims, 25)):.4f}')
            self.stdout.write(f'  median = {float(np.percentile(sims, 50)):.4f}')
            self.stdout.write(f'  p75    = {float(np.percentile(sims, 75)):.4f}')
            self.stdout.write(f'  p90    = {float(np.percentile(sims, 90)):.4f}')
            self.stdout.write(f'  max    = {sims.max():.4f}')
            self.stdout.write(f'  mean   = {sims.mean():.4f}  std={sims.std():.4f}')

            self.stdout.write(self.style.WARNING(
                f'\n  → Рекомендовані пороги: low={p_low:.3f}, high={p_high:.3f}'
            ))

            CURRENT = {'vibe': (0.47, 0.99), 'hobbies': (0.30, 0.85), 'schedule': (0.60, 0.99)}
            if field in CURRENT:
                cur_low, cur_high = CURRENT[field]
                pct_100_current = float(np.mean(sims >= cur_high)) * 100
                pct_100_new     = float(np.mean(sims >= p_high))   * 100
                self.stdout.write(
                    f'  Поточні пороги ({cur_low}, {cur_high}): '
                    f'{pct_100_current:.1f}% пар отримують score=100'
                )
                self.stdout.write(
                    f'  Нові пороги ({p_low:.3f}, {p_high:.3f}): '
                    f'{pct_100_new:.1f}% пар отримують score=100'
                )

        if results:
            self.stdout.write(self.style.MIGRATE_HEADING('\n=== Готовий код для llm_scorer.py ===\n'))
            for field, data in results.items():
                self.stdout.write(
                    f"    return _to_score(raw, low={data['low']:.3f}, high={data['high']:.3f})  "
                    f"# [{field}] auto-calibrated"
                )