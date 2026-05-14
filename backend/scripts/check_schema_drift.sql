-- Шукає varchar/text-колонки, у яких УСІ непорожні значення — цілі числа.
-- Майже завжди це симптом того, що модель Django оголошена як IntegerField,
-- а колонка в БД лишилась рядковою через редагування 0001_initial.py
-- замість створення нової міграції.
--
-- Запуск:
--   python manage.py dbshell < backend/scripts/check_schema_drift.sql

DO $$
DECLARE
  r     record;
  total bigint;
  bad   bigint;
BEGIN
  FOR r IN
    SELECT table_name, column_name
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND data_type IN ('character varying', 'text')
  LOOP
    EXECUTE format(
      'SELECT count(*) FILTER (WHERE %1$I IS NOT NULL AND %1$I <> ''''),
              count(*) FILTER (WHERE %1$I IS NOT NULL AND %1$I <> '''' AND %1$I !~ ''^-?[0-9]+$'')
       FROM %2$I',
      r.column_name, r.table_name
    ) INTO total, bad;

    IF total > 0 AND bad = 0 THEN
      RAISE NOTICE 'SUSPECT  %.%  (% rows, всі цифрові)',
        r.table_name, r.column_name, total;
    END IF;
  END LOOP;
END$$;
