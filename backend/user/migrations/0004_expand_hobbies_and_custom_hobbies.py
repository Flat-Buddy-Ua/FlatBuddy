# Manually written migration:
#   - Hobby choices expanded from 25 to 52 (metadata-only on the column)
#   - UserProfile.custom_hobbies added (ArrayField of CharField, size=5)

import django.contrib.postgres.fields
from django.db import migrations, models


HOBBY_CHOICES = [
    (1, 'Фітнес / Тренажерний зал'), (2, 'Біг / Легка атлетика'),
    (3, 'Йога / Медитація'), (4, 'Велоспорт'), (5, 'Командні види спорту'),
    (6, 'Бойові мистецтва'), (7, 'Походи / Гори'),
    (8, 'Музика / Гра на інструментах'), (9, 'Фотографія / Відео'),
    (10, 'Малювання / Дизайн'), (11, 'Рукоділля / DIY'),
    (12, 'Письменництво / Блогінг'),
    (13, 'Відеоігри'), (14, 'Настільні ігри'), (15, 'Кіно та Серіали'),
    (16, 'Аніме / Манга'), (17, 'Книги / Література'),
    (18, 'Кулінарія / Випічка'), (19, 'Подорожі / Туризм'),
    (20, 'Домашні тварини'), (21, 'Кімнатні рослини'),
    (22, 'Волонтерство'), (23, 'Технології / Програмування'),
    (24, 'Вивчення мов'), (25, 'Мода / Стиль'),
    (26, 'Плавання / Аквапарки'), (27, 'Танці'),
    (28, 'Скейтбординг / Лонгбординг'), (29, 'Лижі / Сноубординг'),
    (30, 'Скелелазіння / Боулдеринг'), (31, 'Стрільба з лука'),
    (32, 'Каякінг / Парусний спорт'), (33, 'Серфінг / Кайт'),
    (34, 'Кераміка / Гончарство'), (35, '3D / Цифрове мистецтво'),
    (36, 'Театр / Акторська майстерність'), (37, 'Вокал / Спів'),
    (38, 'DJ / Продюсування музики'), (39, 'Татуювання / Боді-арт'),
    (40, 'Каліграфія'),
    (41, 'D&D / Рольові ігри'), (42, 'Косплей'), (43, 'Подкасти'),
    (44, 'Стримінг / Контент-кріейтинг'),
    (45, 'Колекціонування (марки, монети, фігурки)'), (46, 'Караоке'),
    (47, 'Кава / Кавова культура'), (48, 'Чай / Чайна культура'),
    (49, 'Вино / Енологія'), (50, 'Городництво / Сад'),
    (51, 'Психологія / Саморозвиток'), (52, 'Інвестиції / Фінанси'),
]


class Migration(migrations.Migration):

    dependencies = [
        ('user', '0003_kryvyi_rih_and_hobbies_array'),
    ]

    operations = [
        migrations.AlterField(
            model_name='userprofile',
            name='hobbies',
            field=django.contrib.postgres.fields.ArrayField(
                base_field=models.IntegerField(choices=HOBBY_CHOICES),
                blank=True,
                default=list,
                size=10,
            ),
        ),
        migrations.AddField(
            model_name='userprofile',
            name='custom_hobbies',
            field=django.contrib.postgres.fields.ArrayField(
                base_field=models.CharField(max_length=50),
                blank=True,
                default=list,
                size=5,
            ),
        ),
    ]
