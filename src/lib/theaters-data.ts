export const theaters = [
	{
		id: 7703035553,
		name: 'ГБУК г. Москвы "МДТ им. А.С. Пушкина"',
		description:
			'Московский драматический театр имени А. С. Пушкина — один из знаковых драматических театров столицы. Он возник в 1950 году после реорганизации Камерного театра Александра Таирова; первым художественным руководителем стал народный артист СССР Владимир Ванин, утвердивший в репертуаре русскую классику и новую отечественную драматургию. В разные годы коллектив возглавляли Борис Бабочкин, Юрий Ерёмин, Роман Козак, а с июня 2010-го театром руководит Евгений Писарев, привлекая к постановкам ведущих режиссёров страны. Сегодня более 60 артистов играют свыше 30 спектаклей: от «Женитьбы Фигаро» и «Зойкиной квартиры» до камерного мюзикла «Рождество О. Генри». Театр располагается в историческом особняке на Тверском бульваре 23/1; после реставрации 1980-х годов зрителям открыта анфилада «Пушкинские залы», сохранившая атмосферу дворянского особняка.',
		address: '123104, город Москва, Тверской б-р, д. 23 стр. 1 ',
		revenueRank: 1,
		attendanceRank: 1,
		capacity: 886.0,
		audience_thousands: 200.3,
		occupancy_percent: 72.0,
		ticket_price_rub: 4500.0,
		photo: '7703035553_1',

		/* новые поля */
		employees: 312,
		artistic_staff: 78,
		cast: 97,
		ticketing_system: 'Базис',

		/* соцсети */
		socials: [
			{
				name: 'Сайт',
				link: 'https://teatrpushkin.ru/',
				icon: '7703035553_logo.png'
			},
			{
				name: 'Телеграмм',
				link: 'https://t.me/teatrpushkin',
				icon: 'telegram.png'
			},
			{
				name: 'Ютуб',
				link: 'https://www.youtube.com/channel/UCL6n8CTa-HHlHkrPkZmJ00A',
				icon: 'youtube.png'
			},
			{
				name: 'Дзен',
				link: 'https://dzen.ru/teatrpushkin',
				icon: 'dzen.png'
			},
			{
				name: 'ВК',
				link: 'https://vk.com/club1288419',
				icon: 'vk.png'
			}
		],

		productions: [
			{
				id: 1,
				name: 'Сделка',
				foto: '7703035553_1'
			},
			{
				id: 2,
				name: 'Барабаны в ночи',
				foto: '7703035553_2'
			},
			{
				id: 3,
				name: 'Буря',
				foto: '7703035553_3'
			}
		],

		spaces: [
			{
				id: 94,
				district: 'Пресненский',
				okrug: 'ЦАО',
				type: 'Сц.площадка в отдельно стоящем здании',
				venue_space_short_name: 'Филиал театра',
				commercial_capacity: 62,
				inconvenient_seats: 0,
				total_capacity: 62,
				venue_space_id: 'kassir.ru_307452',
				photo: '7703035553_94',
				genre: 'драма',
				maps_link: 'https://yandex.ru/maps/-/CHsbAKpn',
				address: 'Сытинский пер., 3/25'
			},
			{
				id: 96,
				district: 'Пресненский',
				okrug: 'ЦАО',
				type: 'Основная сцена',
				venue_space_short_name: 'Основная сцена',
				commercial_capacity: 824,
				inconvenient_seats: 0,
				total_capacity: 824,
				venue_space_id: 'kassir.ru_28527',
				photo: '7703035553_96',
				genre: 'драма',
				maps_link: 'https://yandex.ru/maps/-/CHsbEZ1n',
				address: 'Тверской бульвар 23 строение 1'
			}
		],

		hr: [
			{
				full_name: 'ПИСАРЕВ Евгений Александрович',
				position: 'художественный руководитель',
				photo: null
			},
			{
				full_name: 'ЖУКОВ Владимир Иванович',
				position: 'директор',
				photo: null
			}
		],

		maps_link: 'https://yandex.ru/maps/-/CHCQZZ65',
		yandex_ratings_count: 13805,
		yandex_reviews_count: 4308,
		yandex_rating: 4.9
	},
	{
		id: 7707062124,
		name: 'ГБУК г. Москвы "Московский государственный театр "Ленком Марка Захарова"',
		description:
			'«Ленком Марка Захарова» — легендарная драматическая сцена Москвы. Театр родился в 1927 году как Театр рабочей молодёжи (ТРАМ) на Малой Дмитровке; в 1938-м получил имя Ленинского комсомола, а с 1990-х прочно закрепилось короткое название «Ленком». На протяжении 46 лет (1973 – 2019) творческое лицо театра определял народный артист СССР Марк Захаров: именно здесь появились культовые музыкальные спектакли «Тиль», «Юнона и Авось», «Безумный день, или Женитьба Фигаро» и другие',
		address: '127006, город Москва, ул Малая Дмитровка, д. 6 стр. 1 ',
		revenueRank: 1,
		attendanceRank: 1,
		capacity: 625.0,
		audience_thousands: 159.1,
		occupancy_percent: 88.32,
		ticket_price_rub: 4001.4166666666665,
		photo: '7707062124_10',
		productions: [
			{
				id: 4,
				name: 'Ненаглядная сторона',
				foto: '7707062124_4'
			},
			{
				id: 5,
				name: 'Кабаре Пушкин',
				foto: '7707062124_5'
			},
			{
				id: 6,
				name: 'Старомодная комедия',
				foto: '7707062124_6'
			}
		],
		spaces: [
			{
				id: 100,
				district: 'Тверской',
				okrug: 'ЦАО',
				type: 'Основная сцена',
				venue_space_short_name: 'Основной зал',
				commercial_capacity: 625,
				inconvenient_seats: 0,
				total_capacity: 625,
				venue_space_id: 'tickets.mos.ru_215918',
				photo: '7707062124_100'
			}
		],
		hr: [
			{
				full_name: 'БЕРЕСТОВ  Дмитрий Юрьевич',
				position: 'директор       ',
				photo: null
			},
			{
				full_name: 'ПАНКОВ Владимир Николаевич',
				position: 'художественный руководитель',
				photo: null
			}
		],
		maps_link: 'https://yandex.ru/maps/-/CHCQ6FzN',
		yandex_ratings_count: 13082,
		yandex_reviews_count: 3889,
		yandex_rating: 5.0
	},
	{
		id: 7703063504,
		name: 'ГБУК г. Москвы "ММТ "Геликон-опера"',
		description:
			'«Геликон-опера» — один из любимых и самых посещаемых музыкальных театров столицы. Коллектив славится уникальными постановками, ярким ансамблем солистов и разнообразным репертуаром (свыше 75 спектаклей). Театр ведёт свою летопись с 10 апреля 1990 года; его основатель и художественный руководитель — народный артист России Дмитрий Бертман, поставивший более 120 спектаклей по всему миру. «Геликон» размещён в исторической усадьбе Шаховских-Глебовых-Стрешневых на Большой Никитской улице: здесь современный зал «Стравинский» на 490 мест и два исторических зала («Покровский» и Белоколонный). В труппе сегодня свыше 500 человек — солисты, симфонический оркестр и хор, что позволяет театру давать более 200 спектаклей за сезон. ',
		address: '125009, город Москва, Большая Никитская ул., д.19/16 стр.1 ',
		revenueRank: 1,
		attendanceRank: 1,
		capacity: 576.0,
		audience_thousands: 80.0,
		occupancy_percent: 99.32,
		ticket_price_rub: 2245.1666666666665,
		photo: '7703063504_26',
		productions: [
			{
				id: 7,
				name: 'Алеко',
				foto: '7703063504_7'
			},
			{
				id: 8,
				name: 'Аида',
				foto: '7703063504_8'
			},
			{
				id: 9,
				name: 'Арлекин',
				foto: '7703063504_9'
			}
		],
		spaces: [
			{
				id: 41,
				district: 'Пресненский',
				okrug: 'ЦАО',
				type: 'Малая сцена',
				venue_space_short_name: 'Зал "Покровский"',
				commercial_capacity: 30,
				inconvenient_seats: 0,
				total_capacity: 30,
				venue_space_id: 'hwm-ubsystem_57',
				photo: '7703063504_41'
			},
			{
				id: 51,
				district: 'Пресненский',
				okrug: 'ЦАО',
				type: 'Малая сцена',
				venue_space_short_name: 'Белоколонный зал княгини Шаховской',
				commercial_capacity: 139,
				inconvenient_seats: 0,
				total_capacity: 139,
				venue_space_id: 'hwm-ubsystem_145',
				photo: '7703063504_51'
			},
			{
				id: 62,
				district: 'Пресненский',
				okrug: 'ЦАО',
				type: 'Основная сцена',
				venue_space_short_name: 'Зал "Стравинский"',
				commercial_capacity: 438,
				inconvenient_seats: 0,
				total_capacity: 438,
				venue_space_id: 'hwm-ubsystem_65',
				photo: '7703063504_62'
			}
		],
		hr: [
			{
				full_name: 'БЕРТМАН  Дмитрий Александрович',
				position: 'генеральный директор ',
				photo: null
			},
			{
				full_name: 'БЕРТМАН  Дмитрий Александрович',
				position: 'художественный руководитель',
				photo: null
			}
		],
		maps_link: 'https://yandex.ru/maps/-/CHCQjU0F',
		yandex_ratings_count: 8782,
		yandex_reviews_count: 3134,
		yandex_rating: 5.0
	},
	{
		id: 7704060947,
		name: 'ГБУК г. Москвы "Мастерская "12" Никиты Михалкова", Мастерская "12"',
		description: '',
		address: '121069, город Москва, Поварская ул., д. 33 стр. 1 ',
		revenueRank: 1,
		attendanceRank: 1,
		capacity: 712.0,
		audience_thousands: 11.7,
		occupancy_percent: NaN,
		ticket_price_rub: 1602.2499999999998,
		photo: '7704060947_29',
		productions: [
			{
				id: 10,
				name: 'На дне',
				foto: '7704060947_10'
			},
			{
				id: 11,
				name: 'Перед рассветом',
				foto: '7704060947_11'
			},
			{
				id: 12,
				name: 'Ревизор',
				foto: '7704060947_12'
			}
		],
		spaces: [
			{
				id: 50,
				district: 'Ломоносовский',
				okrug: 'ЮЗАО',
				type: 'Основная сцена',
				venue_space_short_name: 'УТК ГИТИС (аренда)',
				commercial_capacity: 235,
				inconvenient_seats: 0,
				total_capacity: 235,
				venue_space_id: 'tickets.mos.ru_215949',
				photo: '7704060947_50'
			}
		],
		hr: [],
		maps_link: 'https://yandex.ru/maps/-/CHCQnJIR',
		yandex_ratings_count: 646,
		yandex_reviews_count: 250,
		yandex_rating: 4.9
	},
	{
		id: 7710009515,
		name: 'ГБУК г. Москвы "МДТ им. К.С. Станиславского"',
		description: '',
		address: '125375, город Москва, Тверская ул, д. 23 стр. 1 ',
		revenueRank: 1,
		attendanceRank: 1,
		capacity: 312.0,
		audience_thousands: 17.5,
		occupancy_percent: 70.06,
		ticket_price_rub: 1548.5441666666666,
		photo: '7709018353_50',
		productions: [
			{
				id: 13,
				name: 'Дон Жуан',
				foto: '7710009515_13'
			},
			{
				id: 14,
				name: 'Дон Кихот',
				foto: '7710009515_14'
			},
			{
				id: 15,
				name: 'Зазеркалье',
				foto: '7710009515_15'
			}
		],
		spaces: [
			{
				id: 34,
				district: 'Тверской',
				okrug: 'ЦАО',
				type: 'Сц.площадка в отдельно стоящем здании',
				venue_space_short_name: 'Малая сцена',
				commercial_capacity: 120,
				inconvenient_seats: 0,
				total_capacity: 120,
				venue_space_id: 'edinoepole_electrotheatre-7',
				photo: '7710009515_34'
			},
			{
				id: 35,
				district: 'Тверской',
				okrug: 'ЦАО',
				type: 'Основная сцена',
				venue_space_short_name: 'Основная сцена',
				commercial_capacity: 192,
				inconvenient_seats: 0,
				total_capacity: 192,
				venue_space_id: 'edinoepole_electrotheatre-1',
				photo: '7710009515_35'
			}
		],
		hr: [
			{
				full_name: 'ЗОЛИНА Ирина Вячеславовна',
				position: 'директор',
				photo: null
			}
		],
		maps_link: 'https://yandex.ru/maps/-/CHCUu40t',
		yandex_ratings_count: 1237,
		yandex_reviews_count: 375,
		yandex_rating: 4.4
	},
	{
		id: 7707086767,
		name: 'ГБУК "МГАТО"; Московский театр оперетты',
		address: '125009, город Москва, ул. Дмитровка Б., д. 6 ',
		revenueRank: 1,
		attendanceRank: 1,
		capacity: 1428.0,
		audience_thousands: 339.6,
		occupancy_percent: 68.0,
		ticket_price_rub: 3569.344166666667,
		photo: '7707086767_1',
		productions: [],
		spaces: [
			{
				id: 7,
				district: 'Тверской',
				okrug: 'ЦАО',
				type: 'Сц.площадка в отдельно стоящем здании',
				venue_space_short_name: 'Дополнительная сцена',
				commercial_capacity: 40,
				inconvenient_seats: 10,
				total_capacity: 50,
				venue_space_id: 'profticket_2_profticket_ts_moscow_operetta',
				photo: '7707086767_7'
			},
			{
				id: 30,
				district: 'Тверской',
				okrug: 'ЦАО',
				type: 'Основная сцена',
				venue_space_short_name: 'Основной зал',
				commercial_capacity: 1428,
				inconvenient_seats: 12,
				total_capacity: 1440,
				venue_space_id: 'profticket_2_profticket_ts_moscow_operetta',
				photo: '7707086767_30'
			}
		],
		hr: [],
		maps_link: 'https://yandex.ru/maps/-/CHCQVY0L',
		yandex_ratings_count: 21784,
		yandex_reviews_count: 7048,
		yandex_rating: 5.0
	},
	{
		id: 7710040730,
		name: 'ГБУК г.Москвы "Театр им. Моссовета"',
		description:
			'Государственный академический театр имени Моссовета — драматический театр в Москве, отмеченный орденами Ленина и Трудового Красного Знамени. Основан в 1923 году литератором и режиссёром Сергеем Прокофьевым как театр рабочих Московского губернского совета профессиональных союзов',
		address: '125375, город Москва, Большая Садовая ул, д. 16 ',
		revenueRank: 1,
		attendanceRank: 1,
		capacity: 1176.0,
		audience_thousands: 264.7,
		occupancy_percent: 85.0,
		ticket_price_rub: 1892.3583333333333,
		photo: '7710040730_2',
		productions: [],
		spaces: [
			{
				id: 90,
				district: 'Арбат',
				okrug: 'ЦАО',
				type: 'Сц.площадка в отдельно стоящем здании',
				venue_space_short_name: 'Новая сцена "МОСТ"',
				commercial_capacity: 60,
				inconvenient_seats: 0,
				total_capacity: 60,
				venue_space_id: 'intickets_11324883',
				photo: '7710040730_90'
			},
			{
				id: 91,
				district: 'Пресненский',
				okrug: 'ЦАО',
				type: 'Основная сцена',
				venue_space_short_name: 'Основная сцена "МОСТ"',
				commercial_capacity: 90,
				inconvenient_seats: 0,
				total_capacity: 90,
				venue_space_id: 'kassir.ru_24216',
				photo: '7710040730_91'
			},
			{
				id: 92,
				district: 'Пресненский',
				okrug: 'ЦАО',
				type: 'Малая сцена',
				venue_space_short_name: 'Сцена "Под крышей"',
				commercial_capacity: 103,
				inconvenient_seats: 0,
				total_capacity: 103,
				venue_space_id: 'ticketland_199211',
				photo: '7710040730_92'
			},
			{
				id: 93,
				district: 'Пресненский',
				okrug: 'ЦАО',
				type: 'Основная сцена',
				venue_space_short_name: 'Основная сцена',
				commercial_capacity: 894,
				inconvenient_seats: 121,
				total_capacity: 1015,
				venue_space_id: 'intickets_11324459',
				photo: '7710040730_93'
			}
		],
		hr: [],
		maps_link: 'https://yandex.ru/maps/-/CHCQV0LX',
		yandex_ratings_count: 15383,
		yandex_reviews_count: 4639,
		yandex_rating: 4.9
	},
	{
		id: 7710002492,
		name: 'ГБУК г. Москвы "Московский академический театр сатиры"',
		address: '125375, город Москва, Триумфальная пл, д. 2 стр. 1 ',
		capacity: 1886.0,
		audience_thousands: 247.8,
		occupancy_percent: 62.0,
		ticket_price_rub: 1484.4166666666667,
		photo: '7710002492_3',
		productions: [],
		spaces: [
			{
				id: 19,
				district: 'Тверской',
				okrug: 'ЦАО',
				type: 'Основная сцена',
				venue_space_short_name: 'Основная сцена',
				commercial_capacity: 1130,
				inconvenient_seats: 0,
				total_capacity: 1130,
				venue_space_id: 'ticketland_108455',
				photo: '7710002492_19'
			},
			{
				id: 127,
				district: 'Хамовники',
				okrug: 'ЦАО',
				type: 'Сц.площадка в отдельно стоящем здании',
				venue_space_short_name: 'Детская сцена',
				commercial_capacity: 88,
				inconvenient_seats: 0,
				total_capacity: 88,
				venue_space_id: 'intickets_7500174',
				photo: '7710002492_127'
			},
			{
				id: 138,
				district: 'Гагаринский',
				okrug: 'ЮЗАО',
				type: 'Основная сцена',
				venue_space_short_name: 'Прогресс сцена',
				commercial_capacity: 420,
				inconvenient_seats: 0,
				total_capacity: 420,
				venue_space_id: 'intickets_7499560',
				photo: '7710002492_138'
			},
			{
				id: 149,
				district: 'Тверской',
				okrug: 'ЦАО',
				type: 'Малая сцена',
				venue_space_short_name: 'Чердак сатиры',
				commercial_capacity: 150,
				inconvenient_seats: 0,
				total_capacity: 150,
				venue_space_id: 'ticketland_106',
				photo: '7710002492_149'
			}
		],
		hr: [
			{
				full_name: 'ГЕРАСИМОВ Евгений Владимирович',
				position: 'художественный руководитель',
				photo: null
			},
			{
				full_name: 'НЕСТРАТОВ Павел Вячеславович',
				position: 'директор ',
				photo: null
			}
		],
		maps_link: 'https://yandex.ru/maps/-/CHCQZEjY',
		yandex_ratings_count: 20000,
		yandex_reviews_count: 6371,
		yandex_rating: 4.9
	},
	{
		id: 7725054895,
		name: 'ГБУК г. Москвы "Театр Терезы Дуровой"',
		address: '115093, город Москва, Павловская ул., д. 6 ',
		capacity: 1323.0,
		audience_thousands: 253.7,
		occupancy_percent: 90.39,
		ticket_price_rub: 1317.0,
		photo: '7725054895_4',
		productions: [],
		spaces: [
			{
				id: 137,
				district: 'Даниловский',
				okrug: 'ЮАО',
				type: 'Малая сцена',
				venue_space_short_name: 'Театральная гостиная (для показа для самых маленьких зрителей)',
				commercial_capacity: 30,
				inconvenient_seats: 0,
				total_capacity: 30,
				venue_space_id: 'profticket_3_profticket_ts_tereza_durova_theatre',
				photo: '7725054895_137'
			},
			{
				id: 139,
				district: 'Даниловский',
				okrug: 'ЮАО',
				type: 'Малая сцена',
				venue_space_short_name: 'Малый зал',
				commercial_capacity: 250,
				inconvenient_seats: 0,
				total_capacity: 250,
				venue_space_id: 'profticket_2_profticket_ts_tereza_durova_theatre',
				photo: '7725054895_139'
			},
			{
				id: 140,
				district: 'Даниловский',
				okrug: 'ЮАО',
				type: 'Основная сцена',
				venue_space_short_name: 'Большой зал',
				commercial_capacity: 1027,
				inconvenient_seats: 0,
				total_capacity: 1027,
				venue_space_id: 'profticket_1_profticket_ts_tereza_durova_theatre',
				photo: '7725054895_140'
			}
		],
		hr: [
			{
				full_name: 'ЧЕРЕПНЕВ Алексей Анатольевич',
				position: 'директор',
				photo: null
			},
			{
				full_name: 'ЯКОВЛЕВА  Валентина Юрьевна',
				position: 'директор',
				photo: null
			}
		],
		maps_link: 'https://yandex.ru/maps/-/CHCQZ4iZ',
		yandex_ratings_count: 36438,
		yandex_reviews_count: 13545,
		yandex_rating: 5.0
	},
	{
		id: 7710081367,
		name: 'ГБУК г. Москвы "МАМТ"',
		address: '125375, город Москва, ул Дмитровка Б., д. 17 ',
		capacity: 1268.0,
		audience_thousands: 197.0,
		occupancy_percent: 81.2,
		ticket_price_rub: 3072.8333333333335,
		photo: '7710081367_6',
		productions: [],
		spaces: [
			{
				id: 6,
				district: 'Тверской',
				okrug: 'ЦАО',
				type: 'Малая сцена',
				venue_space_short_name: 'Атриум',
				commercial_capacity: 150,
				inconvenient_seats: 0,
				total_capacity: 150,
				venue_space_id: 'profticket_319_profticket_ts_mamt',
				photo: '7710081367_6'
			},
			{
				id: 84,
				district: 'Тверской',
				okrug: 'ЦАО',
				type: 'Малая сцена',
				venue_space_short_name: 'Музыкальная гостиная',
				commercial_capacity: 150,
				inconvenient_seats: 0,
				total_capacity: 150,
				venue_space_id: 'profticket_308_profticket_ts_mamt',
				photo: '7710081367_84'
			},
			{
				id: 95,
				district: 'Тверской',
				okrug: 'ЦАО',
				type: 'Малая сцена',
				venue_space_short_name: 'Малая сцена',
				commercial_capacity: 204,
				inconvenient_seats: 0,
				total_capacity: 204,
				venue_space_id: 'profticket_307_profticket_ts_mamt',
				photo: '7710081367_95'
			},
			{
				id: 150,
				district: 'Тверской',
				okrug: 'ЦАО',
				type: 'Основная сцена',
				venue_space_short_name: 'Основная сцена',
				commercial_capacity: 1062,
				inconvenient_seats: 0,
				total_capacity: 1062,
				venue_space_id: 'profticket_309_profticket_ts_mamt',
				photo: '7710081367_150'
			}
		],
		hr: [
			{
				full_name: 'БОРИСОВ Андрей Александрович',
				position: 'генеральный директор',
				photo: null
			}
		],
		maps_link: 'https://yandex.ru/maps/-/CHCQZO0B',
		yandex_ratings_count: 9559,
		yandex_reviews_count: 2956,
		yandex_rating: 5.0
	},
	{
		id: 7703001970,
		name: 'ГБУК г. Москвы "Театр на Малой Бронной"',
		address: '123104, город Москва, ул. Бронная М., д.4 к.2 ',
		capacity: 541.0,
		audience_thousands: 104.8,
		occupancy_percent: 84.87,
		ticket_price_rub: 3900.425833333333,
		photo: '7703001970_7',
		productions: [],
		spaces: [
			{
				id: 17,
				district: 'Пресненский',
				okrug: 'ЦАО',
				type: 'Малая сцена',
				venue_space_short_name: 'Малый зал',
				commercial_capacity: 44,
				inconvenient_seats: 0,
				total_capacity: 44,
				venue_space_id: 'ticketland_623826',
				photo: '7703001970_17'
			},
			{
				id: 18,
				district: 'Пресненский',
				okrug: 'ЦАО',
				type: 'Основная сцена',
				venue_space_short_name: 'Большой зал',
				commercial_capacity: 461,
				inconvenient_seats: 0,
				total_capacity: 461,
				venue_space_id: 'kassir_ru_ts_radario_32212',
				photo: '7703001970_18'
			},
			{
				id: 61,
				district: 'Сокольники',
				okrug: 'ВАО',
				type: 'Основная сцена',
				venue_space_short_name: 'Основной зал',
				commercial_capacity: 550,
				inconvenient_seats: 0,
				total_capacity: 550,
				venue_space_id: 'kassir.ru_24031',
				photo: '7703001970_61'
			}
		],
		hr: [
			{
				full_name: 'БОГОМОЛОВ Константин Юрьевич ',
				position: 'художественный руководитель',
				photo: null
			}
		],
		maps_link: 'https://yandex.ru/maps/-/CHCQZDMJ',
		yandex_ratings_count: 5529,
		yandex_reviews_count: 1823,
		yandex_rating: 4.8
	},
	{
		id: 7701046341,
		name: '"Московский театр "Современник"',
		address: '101000, город Москва, Чистопрудный б-р, д. 19 стр. 1 ',
		capacity: 839.0,
		audience_thousands: 174.1,
		occupancy_percent: 88.07,
		ticket_price_rub: 3174.5,
		photo: '7701046341_8',
		productions: [],
		spaces: [
			{
				id: 106,
				district: 'Басманный',
				okrug: 'ЦАО',
				type: 'Основная сцена',
				venue_space_short_name: 'Другая сцена',
				commercial_capacity: 185,
				inconvenient_seats: 0,
				total_capacity: 185,
				venue_space_id: 'intickets_11091479',
				photo: '7701046341_106'
			},
			{
				id: 117,
				district: 'Басманный',
				okrug: 'ЦАО',
				type: 'Основная сцена',
				venue_space_short_name: 'Основная сцена',
				commercial_capacity: 660,
				inconvenient_seats: 0,
				total_capacity: 660,
				venue_space_id: 'ticketland_417201',
				photo: '7701046341_117'
			}
		],
		hr: [
			{
				full_name: 'МАШКОВ Владимир Львович',
				position: 'директор',
				photo: null
			}
		],
		maps_link: 'https://yandex.ru/maps/-/CHCQ6AM1',
		yandex_ratings_count: 13844,
		yandex_reviews_count: 4032,
		yandex_rating: 5.0
	},
	{
		id: 7703025812,
		name: 'ГБУК г. Москвы "Московский академический театр им. Вл. Маяковского"',
		address: '125009, город Москва, Большая Никитская ул., д. 19/13 стр 1 ',
		capacity: 1169.0,
		audience_thousands: 172.2,
		occupancy_percent: 95.17,
		ticket_price_rub: 2543.6666666666665,
		photo: '7703025812_9',
		productions: [],
		spaces: [
			{
				id: 5,
				district: 'Пресненский',
				okrug: 'ЦАО',
				type: 'Малая сцена',
				venue_space_short_name: 'Сцена Маяк',
				commercial_capacity: 60,
				inconvenient_seats: 0,
				total_capacity: 60,
				venue_space_id: 'ticketland_351903',
				photo: '7703025812_5'
			},
			{
				id: 97,
				district: 'Мещанский',
				okrug: 'ЦАО',
				type: 'Сц.площадка в отдельно стоящем здании',
				venue_space_short_name: 'Сцена на Сретенке',
				commercial_capacity: 209,
				inconvenient_seats: 0,
				total_capacity: 209,
				venue_space_id: 'ticketland_52007',
				photo: '7703025812_97'
			},
			{
				id: 98,
				district: 'Пресненский',
				okrug: 'ЦАО',
				type: 'Малая сцена',
				venue_space_short_name: 'Малая сцена',
				commercial_capacity: 72,
				inconvenient_seats: 0,
				total_capacity: 72,
				venue_space_id: 'tickets.mos.ru_199391',
				photo: '7703025812_98'
			},
			{
				id: 99,
				district: 'Пресненский',
				okrug: 'ЦАО',
				type: 'Основная сцена',
				venue_space_short_name: 'Основная сцена',
				commercial_capacity: 784,
				inconvenient_seats: 13,
				total_capacity: 797,
				venue_space_id: 'ticketland_417012',
				photo: '7703025812_99'
			}
		],
		hr: [
			{
				full_name: 'ЛАПШИНА Екатерина Николаевна',
				position: 'директор',
				photo: null
			},
			{
				full_name: 'ПЕРЕГУДОВ Георгий Михайлович',
				position: 'художественный руководитель',
				photo: null
			}
		],
		maps_link: 'https://yandex.ru/maps/-/CHCQ6Q8V',
		yandex_ratings_count: 10786,
		yandex_reviews_count: 3225,
		yandex_rating: 4.9
	},
	{
		id: 7702061293,
		name: 'ГБУК г. Москвы "Театр "Уголок дедушки Дурова"',
		address: '129090, город Москва, ул. Дурова, д. 2 стр. 1 ',
		capacity: 619.0,
		audience_thousands: 136.2,
		occupancy_percent: 88.07,
		ticket_price_rub: 924.3874999999999,
		photo: '7702061293_11',
		productions: [],
		spaces: [
			{
				id: 116,
				district: 'Мещанский',
				okrug: 'ЦАО',
				type: 'Малая сцена',
				venue_space_short_name: 'Мышиная железная дорога',
				commercial_capacity: 33,
				inconvenient_seats: 0,
				total_capacity: 33,
				venue_space_id: 'ticketland_31280',
				photo: '7702061293_116'
			},
			{
				id: 118,
				district: 'Мещанский',
				okrug: 'ЦАО',
				type: 'Сц.площадка в отдельно стоящем здании',
				venue_space_short_name: 'Большая сцена',
				commercial_capacity: 300,
				inconvenient_seats: 0,
				total_capacity: 300,
				venue_space_id: 'ticketland_31279',
				photo: '7702061293_118'
			},
			{
				id: 119,
				district: 'Мещанский',
				okrug: 'ЦАО',
				type: 'Основная сцена',
				venue_space_short_name: 'Новая сцена',
				commercial_capacity: 319,
				inconvenient_seats: 0,
				total_capacity: 319,
				venue_space_id: 'ticketland_173751',
				photo: '7702061293_119'
			}
		],
		hr: [
			{
				full_name: 'ДУРОВА Наталья Юрьевна',
				position: 'художественный руководитель',
				photo: null
			}
		],
		maps_link: 'https://yandex.ru/maps/-/CHCQ6VO8',
		yandex_ratings_count: 11834,
		yandex_reviews_count: 5065,
		yandex_rating: 4.9
	},
	{
		id: 7710130279,
		name: 'ГБУК г. Москвы "МТЮЗ"',
		address: '123001, город Москва, Мамоновский пер., д. 10 стр. 1 ',
		capacity: 979.0,
		audience_thousands: 133.5,
		occupancy_percent: 83.52,
		ticket_price_rub: 1849.5225,
		photo: '7710130279_12',
		productions: [],
		spaces: [
			{
				id: 87,
				district: 'Бирюлево Восточное',
				okrug: 'ЮАО',
				type: 'Основная сцена',
				venue_space_short_name: 'Основная сцена',
				commercial_capacity: 301,
				inconvenient_seats: 0,
				total_capacity: 301,
				venue_space_id: 'ticketland_109854',
				photo: '7710130279_87'
			},
			{
				id: 88,
				district: 'Тверской',
				okrug: 'ЦАО',
				type: 'Сц.площадка в отдельно стоящем здании',
				venue_space_short_name: 'Игры во флигеле (малый зал)',
				commercial_capacity: 62,
				inconvenient_seats: 0,
				total_capacity: 62,
				venue_space_id: 'tickets.mos.ru_215923',
				photo: '7710130279_88'
			},
			{
				id: 89,
				district: 'Тверской',
				okrug: 'ЦАО',
				type: 'Основная сцена',
				venue_space_short_name: 'Основная сцена',
				commercial_capacity: 532,
				inconvenient_seats: 0,
				total_capacity: 532,
				venue_space_id: 'ticketland_109854',
				photo: '7710130279_89'
			}
		],
		hr: [],
		maps_link: 'https://yandex.ru/maps/-/CHCQ6KkV',
		yandex_ratings_count: 3854,
		yandex_reviews_count: 1390,
		yandex_rating: 4.6
	},
	{
		id: 7703002886,
		name: 'ГБУК г.Москвы "Московский театр "Мастерская П.Н. Фоменко"',
		address: '121165, город Москва, Кутузовский пр-кт, д. 30 ',
		capacity: 772.0,
		audience_thousands: 125.9,
		occupancy_percent: 80.95,
		ticket_price_rub: 3963.4545454545455,
		photo: '7703002886_13',
		productions: [],
		spaces: [
			{
				id: 82,
				district: 'Дорогомилово',
				okrug: 'ЗАО',
				type: 'Малая сцена',
				venue_space_short_name: 'Малый зал',
				commercial_capacity: 144,
				inconvenient_seats: 0,
				total_capacity: 144,
				venue_space_id: 'ticketland_940',
				photo: '7703002886_82'
			},
			{
				id: 83,
				district: 'Дорогомилово',
				okrug: 'ЗАО',
				type: 'Основная сцена',
				venue_space_short_name: 'Большой зал',
				commercial_capacity: 432,
				inconvenient_seats: 0,
				total_capacity: 432,
				venue_space_id: 'tickets.mos.ru_215927',
				photo: '7703002886_83'
			},
			{
				id: 85,
				district: 'Дорогомилово',
				okrug: 'ЗАО',
				type: 'Сц.площадка в отдельно стоящем здании',
				venue_space_short_name: 'Филиал - Зеленый зал',
				commercial_capacity: 128,
				inconvenient_seats: 0,
				total_capacity: 128,
				venue_space_id: 'ticketland_21271',
				photo: '7703002886_85'
			},
			{
				id: 86,
				district: 'Дорогомилово',
				okrug: 'ЗАО',
				type: 'Сц.площадка в отдельно стоящем здании',
				venue_space_short_name: 'Филиал - Серый зал',
				commercial_capacity: 146,
				inconvenient_seats: 0,
				total_capacity: 146,
				venue_space_id: 'ticketland_30302',
				photo: '7703002886_86'
			}
		],
		hr: [
			{
				full_name: 'ВОРОБЬЁВ Андрей Михайлович',
				position: 'директор',
				photo: null
			},
			{
				full_name: 'КАМЕНЬКОВИЧ Евгений Борисович ',
				position: 'художественный руководитель',
				photo: null
			}
		],
		maps_link: 'https://yandex.ru/maps/-/CHCQ6HkK',
		yandex_ratings_count: 11355,
		yandex_reviews_count: 3278,
		yandex_rating: 5.0
	},
	{
		id: 7709010548,
		name: 'ГБУК г. Москвы "Московский театр на Таганке"',
		address: '109240, город Москва, ул Земляной Вал, д. 76/21 стр. 1 ',
		capacity: 1516.0,
		audience_thousands: 119.7,
		occupancy_percent: 74.73,
		ticket_price_rub: 2488.6183333333333,
		photo: '7709010548_14',
		productions: [],
		spaces: [
			{
				id: 8,
				district: 'Таганский',
				okrug: 'ЦАО',
				type: 'Сц.площадка в отдельно стоящем здании',
				venue_space_short_name: 'Филиал',
				commercial_capacity: 22,
				inconvenient_seats: 0,
				total_capacity: 22,
				venue_space_id: 'afisha.tickets_139787',
				photo: '7709010548_8'
			},
			{
				id: 78,
				district: 'Таганский',
				okrug: 'ЦАО',
				type: 'Основная сцена',
				venue_space_short_name: 'Сцена на Факельном',
				commercial_capacity: 100,
				inconvenient_seats: 0,
				total_capacity: 100,
				venue_space_id: 'afisha.tickets_139787',
				photo: '7709010548_78'
			},
			{
				id: 79,
				district: 'Таганский',
				okrug: 'ЦАО',
				type: 'Основная сцена',
				venue_space_short_name: 'Новая сцена',
				commercial_capacity: 729,
				inconvenient_seats: 0,
				total_capacity: 729,
				venue_space_id: 'afisha.tickets_136341',
				photo: '7709010548_79'
			},
			{
				id: 80,
				district: 'Таганский',
				okrug: 'ЦАО',
				type: 'Малая сцена',
				venue_space_short_name: 'Малая сцена',
				commercial_capacity: 101,
				inconvenient_seats: 0,
				total_capacity: 101,
				venue_space_id: 'afisha.tickets_83021',
				photo: '7709010548_80'
			},
			{
				id: 81,
				district: 'Таганский',
				okrug: 'ЦАО',
				type: 'Основная сцена',
				venue_space_short_name: 'Основная сцена',
				commercial_capacity: 487,
				inconvenient_seats: 0,
				total_capacity: 487,
				venue_space_id: 'afisha.tickets_6660',
				photo: '7709010548_81'
			}
		],
		hr: [
			{
				full_name: 'АПЕКСИМОВА Ирина Викторовна',
				position: 'директор',
				photo: null
			}
		],
		maps_link: 'https://yandex.ru/maps/-/CHCQ6T2w',
		yandex_ratings_count: 9588,
		yandex_reviews_count: 2652,
		yandex_rating: 4.8
	},
	{
		id: 7721032971,
		name: 'ГБУК г. Москвы "Московский детский музыкально-драматический театр"',
		address: '109377, город Москва, 1-Я Новокузьминская ул., д.1 ',
		capacity: 668.0,
		audience_thousands: 103.2,
		occupancy_percent: 71.7,
		ticket_price_rub: 1152.9591666666668,
		photo: '7721032971_15',
		productions: [],
		spaces: [
			{
				id: 124,
				district: 'Басманный',
				okrug: 'ЦАО',
				type: 'Основная сцена',
				venue_space_short_name: 'Драматическая сцена на ул. Радио',
				commercial_capacity: 92,
				inconvenient_seats: 0,
				total_capacity: 92,
				venue_space_id: 'tickets.mos.ru_216013',
				photo: '7721032971_124'
			},
			{
				id: 125,
				district: 'Рязанский',
				okrug: 'ЮВАО',
				type: 'Малая сцена',
				venue_space_short_name: 'Малая сцена на 1-й Новокузьминской',
				commercial_capacity: 89,
				inconvenient_seats: 0,
				total_capacity: 89,
				venue_space_id: 'tickets.mos.ru_216012',
				photo: '7721032971_125'
			},
			{
				id: 126,
				district: 'Рязанский',
				okrug: 'ЮВАО',
				type: 'Основная сцена',
				venue_space_short_name: 'Основная сцена на 1-й Новокузьминской',
				commercial_capacity: 459,
				inconvenient_seats: 0,
				total_capacity: 459,
				venue_space_id: 'ticketland_708961',
				photo: '7721032971_126'
			}
		],
		hr: [
			{
				full_name: 'МОГИНОВ Альберт Рафисович',
				position: 'директор',
				photo: null
			}
		],
		maps_link: 'https://yandex.ru/maps/-/CHCQbBmy',
		yandex_ratings_count: 5191,
		yandex_reviews_count: 2811,
		yandex_rating: 5.0
	},
	{
		id: 7730116466,
		name: 'ГБУК г. Москвы "ФЦ "Москва"',
		address: '121096, город Москва, Барклая ул., д. 9 ',
		capacity: 518.0,
		audience_thousands: 86.0,
		occupancy_percent: 52.1,
		ticket_price_rub: 953.5833333333334,
		photo: '7730116466_16',
		productions: [],
		spaces: [
			{
				id: 133,
				district: 'Филевский парк',
				okrug: 'ЗАО',
				type: 'Малая сцена',
				venue_space_short_name: 'Малый зал',
				commercial_capacity: 123,
				inconvenient_seats: 0,
				total_capacity: 123,
				venue_space_id: 'ticketland_838886',
				photo: '7730116466_133'
			},
			{
				id: 134,
				district: 'Филевский парк',
				okrug: 'ЗАО',
				type: 'Основная сцена',
				venue_space_short_name: 'Большой зал',
				commercial_capacity: 511,
				inconvenient_seats: 0,
				total_capacity: 511,
				venue_space_id: 'ticketland_397689',
				photo: '7730116466_134'
			}
		],
		hr: [],
		maps_link: 'https://yandex.ru/maps/-/CHCQbVor',
		yandex_ratings_count: 5467,
		yandex_reviews_count: 1979,
		yandex_rating: 4.7
	},
	{
		id: 7710143327,
		name: 'ГБУК "МДТ им. М.Н. Ермоловой"',
		address: '125009, город Москва, Тверская ул., д.5/6 ',
		capacity: 670.0,
		audience_thousands: 84.4,
		occupancy_percent: 79.88,
		ticket_price_rub: 3274.0833333333335,
		photo: '7710143327_17',
		productions: [],
		spaces: [
			{
				id: 63,
				district: 'Тверской',
				okrug: 'ЦАО',
				type: 'Малая сцена',
				venue_space_short_name: 'Новая сцена',
				commercial_capacity: 75,
				inconvenient_seats: 0,
				total_capacity: 75,
				venue_space_id: 'profticket_2_profticket_ts_ermolova_theatre',
				photo: '7710143327_63'
			},
			{
				id: 64,
				district: 'Тверской',
				okrug: 'ЦАО',
				type: 'Основная сцена',
				venue_space_short_name: 'Основная сцена',
				commercial_capacity: 556,
				inconvenient_seats: 0,
				total_capacity: 556,
				venue_space_id: 'profticket_1_profticket_ts_ermolova_theatre',
				photo: '7710143327_64'
			}
		],
		hr: [],
		maps_link: 'https://yandex.ru/maps/-/CHCQbG5w',
		yandex_ratings_count: 7200,
		yandex_reviews_count: 2418,
		yandex_rating: 4.8
	},
	{
		id: 7714039052,
		name: 'ГБУК г. Москвы "МГАТ "Русская песня"',
		address: '107078, город Москва, Садовая-Черногрязская ул., д.5/9 стр.2 ',
		capacity: 1139.0,
		audience_thousands: 82.0,
		occupancy_percent: 78.96,
		ticket_price_rub: 2737.8333333333335,
		photo: '7714039052_18',
		productions: [],
		spaces: [
			{
				id: 135,
				district: 'Басманный',
				okrug: 'ЦАО',
				type: 'Сц.площадка в отдельно стоящем здании',
				venue_space_short_name: 'Зрительный зал',
				commercial_capacity: 136,
				inconvenient_seats: 0,
				total_capacity: 136,
				venue_space_id: 'tickets.mos.ru_216004',
				photo: '7714039052_135'
			},
			{
				id: 136,
				district: 'Мещанский',
				okrug: 'ЦАО',
				type: 'Основная сцена',
				venue_space_short_name: 'Зрительный зал',
				commercial_capacity: 947,
				inconvenient_seats: 0,
				total_capacity: 947,
				venue_space_id: 'tickets.mos.ru_216004',
				photo: '7714039052_136'
			}
		],
		hr: [
			{
				full_name: 'БАБКИНА Надежда Георгиевна',
				position: 'художественный руководитель',
				photo: null
			},
			{
				full_name: 'БАБКИНА Надежда Георгиевна',
				position: 'директор',
				photo: null
			}
		],
		maps_link: 'https://yandex.ru/maps/-/CHCQbW2u',
		yandex_ratings_count: 18797,
		yandex_reviews_count: 6781,
		yandex_rating: 5.0
	},
	{
		id: 7707120908,
		name: 'ГБУК г. Москвы "ДМТЮА"',
		address: '127006, город Москва, ул Малая Дмитровка, д. 8 стр. 4 ',
		capacity: 528.0,
		audience_thousands: 77.8,
		occupancy_percent: 71.0,
		ticket_price_rub: 1292.2533333333333,
		photo: '7707120908_19',
		productions: [],
		spaces: [
			{
				id: 103,
				district: 'Таганский',
				okrug: 'ЦАО',
				type: 'Основная сцена',
				venue_space_short_name: 'Сцена "Театр русской драмы"',
				commercial_capacity: 115,
				inconvenient_seats: 0,
				total_capacity: 115,
				venue_space_id: 'intickets_13299809',
				photo: '7707120908_103'
			},
			{
				id: 104,
				district: 'Тверской',
				okrug: 'ЦАО',
				type: 'Малая сцена',
				venue_space_short_name: 'Сцена на Малой Дмитровке',
				commercial_capacity: 88,
				inconvenient_seats: 0,
				total_capacity: 88,
				venue_space_id: 'intickets_4314601',
				photo: '7707120908_104'
			},
			{
				id: 105,
				district: 'Басманный',
				okrug: 'ЦАО',
				type: 'Основная сцена',
				venue_space_short_name: 'Сцена "Экспромт"',
				commercial_capacity: 72,
				inconvenient_seats: 0,
				total_capacity: 72,
				venue_space_id: 'ticketland_185024',
				photo: '7707120908_105'
			},
			{
				id: 107,
				district: 'Басманный',
				okrug: 'ЦАО',
				type: 'Основная сцена',
				venue_space_short_name: 'Новая сцена на Чистых прудах',
				commercial_capacity: 259,
				inconvenient_seats: 0,
				total_capacity: 259,
				venue_space_id: 'ticketland_171865',
				photo: '7707120908_107'
			}
		],
		hr: [
			{
				full_name: 'ФЕДОРОВ Александр Львович',
				position: 'художественный руководитель ',
				photo: null
			}
		],
		maps_link: 'https://yandex.ru/maps/-/CHCQb-2I',
		yandex_ratings_count: 1408,
		yandex_reviews_count: 576,
		yandex_rating: 4.9
	},
	{
		id: 7701109200,
		name: 'ГБУК г. Москвы "Московский театр кукол"',
		address: '105066, город Москва, Спартаковская ул., д.26/30 ',
		capacity: 483.0,
		audience_thousands: 81.2,
		occupancy_percent: 89.0,
		ticket_price_rub: 1150.8333333333333,
		photo: '7701109200_20',
		productions: [],
		spaces: [
			{
				id: 9,
				district: 'Басманный',
				okrug: 'ЦАО',
				type: 'Малая сцена',
				venue_space_short_name: 'Малый зал',
				commercial_capacity: 80,
				inconvenient_seats: 0,
				total_capacity: 80,
				venue_space_id: 'aticketland_194556',
				photo: '7701109200_9'
			},
			{
				id: 10,
				district: 'Басманный',
				okrug: 'ЦАО',
				type: 'Основная сцена',
				venue_space_short_name: 'Большой зал',
				commercial_capacity: 243,
				inconvenient_seats: 0,
				total_capacity: 243,
				venue_space_id: 'tickets.mos.ru_215990',
				photo: '7701109200_10'
			},
			{
				id: 101,
				district: 'Таганский',
				okrug: 'ЦАО',
				type: 'Основная сцена',
				venue_space_short_name: 'Основной зал',
				commercial_capacity: 50,
				inconvenient_seats: 0,
				total_capacity: 50,
				venue_space_id: 'afisha.tickets_154008',
				photo: '7701109200_101'
			},
			{
				id: 148,
				district: 'Ростокино',
				okrug: 'СВАО',
				type: 'Основная сцена',
				venue_space_short_name: 'Камерная сцена',
				commercial_capacity: 106,
				inconvenient_seats: 0,
				total_capacity: 106,
				venue_space_id: 'tickets.mos.ru_215989',
				photo: '7701109200_148'
			}
		],
		hr: [
			{
				full_name: 'ГОЛДОВСКИЙ Борис Павлович',
				position: 'художественный руководитель',
				photo: null
			},
			{
				full_name: 'РЕДЬКО Людмила Викторовна',
				position: 'директор ',
				photo: null
			}
		],
		maps_link: 'https://yandex.ru/maps/-/CHCQfUid',
		yandex_ratings_count: 4194,
		yandex_reviews_count: 1830,
		yandex_rating: 4.9
	},
	{
		id: 7710018171,
		name: 'ГБУК г. Москвы "Театр на Малой Ордынке"',
		address: '115184, город Москва, ул. Малая Ордынка, д. 31 стр. 1 ',
		capacity: 513.0,
		audience_thousands: 77.5,
		occupancy_percent: 73.0,
		ticket_price_rub: 1524.0,
		photo: '7710018171_21',
		productions: [],
		spaces: [
			{
				id: 71,
				district: 'Замоскворечье',
				okrug: 'ЦАО',
				type: 'Сц.площадка в отдельно стоящем здании',
				venue_space_short_name: 'Сцена "Маленькая Луна"',
				commercial_capacity: 67,
				inconvenient_seats: 0,
				total_capacity: 67,
				venue_space_id: 'afisha.tickets_146635',
				photo: '7710018171_71'
			},
			{
				id: 72,
				district: 'Замоскворечье',
				okrug: 'ЦАО',
				type: 'Малая сцена',
				venue_space_short_name: 'Малая сцена',
				commercial_capacity: 93,
				inconvenient_seats: 0,
				total_capacity: 93,
				venue_space_id: 'tickets.mos.ru_215711',
				photo: '7710018171_72'
			},
			{
				id: 74,
				district: 'Замоскворечье',
				okrug: 'ЦАО',
				type: 'Основная сцена',
				venue_space_short_name: 'Основная сцена',
				commercial_capacity: 330,
				inconvenient_seats: 0,
				total_capacity: 330,
				venue_space_id: 'tickets.mos.ru_215936',
				photo: '7710018171_74'
			}
		],
		hr: [],
		maps_link: 'https://yandex.ru/maps/-/CHCQfF-u',
		yandex_ratings_count: 7618,
		yandex_reviews_count: 3058,
		yandex_rating: 4.7
	},
	{
		id: 7707098113,
		name: 'ГБУК г. Москвы "Московский театр "ЕТС"',
		address: '101000, город Москва, пер. Фролов, д. 2 ',
		capacity: 671.0,
		audience_thousands: 76.6,
		occupancy_percent: 70.0,
		ticket_price_rub: 1795.8333333333333,
		photo: '7707098113_22',
		productions: [],
		spaces: [
			{
				id: 68,
				district: 'Красносельский',
				okrug: 'ЦАО',
				type: 'Малая сцена',
				venue_space_short_name: 'Эфросовский зал',
				commercial_capacity: 114,
				inconvenient_seats: 0,
				total_capacity: 114,
				venue_space_id: 'ticketland_72012',
				photo: '7707098113_68'
			},
			{
				id: 69,
				district: 'Красносельский',
				okrug: 'ЦАО',
				type: 'Малая сцена',
				venue_space_short_name: 'Малый зал',
				commercial_capacity: 120,
				inconvenient_seats: 0,
				total_capacity: 120,
				venue_space_id: 'ticketland_985514',
				photo: '7707098113_69'
			},
			{
				id: 70,
				district: 'Красносельский',
				okrug: 'ЦАО',
				type: 'Основная сцена',
				venue_space_short_name: 'Большой зал',
				commercial_capacity: 505,
				inconvenient_seats: 0,
				total_capacity: 505,
				venue_space_id: 'ticketland_59775',
				photo: '7707098113_70'
			}
		],
		hr: [],
		maps_link: 'https://yandex.ru/maps/-/CHCQfZ4r',
		yandex_ratings_count: 7622,
		yandex_reviews_count: 3152,
		yandex_rating: 4.9
	},
	{
		id: 7704249283,
		name: 'ГБУК МТ "Новая Опера" им. Е.В.Колобова',
		address: '127006, город Москва, ул Каретный Ряд, д. 3 стр. 2 ',
		capacity: 760.0,
		audience_thousands: 78.1,
		occupancy_percent: 84.0,
		ticket_price_rub: 1773.3333333333333,
		photo: '7704249283_23',
		productions: [],
		spaces: [
			{
				id: 73,
				district: 'Тверской',
				okrug: 'ЦАО',
				type: 'Основная сцена',
				venue_space_short_name: 'Основная сцена',
				commercial_capacity: 654,
				inconvenient_seats: 0,
				total_capacity: 654,
				venue_space_id: 'tickets.mos.ru_215910',
				photo: '7704249283_73'
			}
		],
		hr: [],
		maps_link: 'https://yandex.ru/maps/-/CHCQfG-o',
		yandex_ratings_count: 5238,
		yandex_reviews_count: 1790,
		yandex_rating: 4.9
	},
	{
		id: 7707064139,
		name: 'ГБУК г. Москвы "Театр на Трубной"',
		address: '127051, город Москва, Неглинная ул., д. 29 стр. 1 ',
		capacity: 700.0,
		audience_thousands: 80.8,
		occupancy_percent: 93.6,
		ticket_price_rub: 2169.0266666666666,
		photo: '7707064139_24',
		productions: [],
		spaces: [
			{
				id: 55,
				district: 'Тверской',
				okrug: 'ЦАО',
				type: 'Малая сцена',
				venue_space_short_name: '"Фойе"',
				commercial_capacity: 50,
				inconvenient_seats: 0,
				total_capacity: 50,
				venue_space_id: 'ticketland_143592',
				photo: '7707064139_55'
			},
			{
				id: 56,
				district: 'Тверской',
				okrug: 'ЦАО',
				type: 'Малая сцена',
				venue_space_short_name: '"Белый зал"',
				commercial_capacity: 100,
				inconvenient_seats: 0,
				total_capacity: 100,
				venue_space_id: 'yandex_d28ae69093fd450e893a9bea0a6e971c18fde47825049c41a27911e4ba3df8e1',
				photo: '7707064139_56'
			},
			{
				id: 57,
				district: 'Тверской',
				okrug: 'ЦАО',
				type: 'Малая сцена',
				venue_space_short_name: '"Зимний сад"',
				commercial_capacity: 200,
				inconvenient_seats: 0,
				total_capacity: 200,
				venue_space_id: 'ticketland_143592',
				photo: '7707064139_57'
			},
			{
				id: 58,
				district: 'Тверской',
				okrug: 'ЦАО',
				type: 'Основная сцена',
				venue_space_short_name: '"Эрмитаж"',
				commercial_capacity: 350,
				inconvenient_seats: 0,
				total_capacity: 350,
				venue_space_id: 'ticketland_270392',
				photo: '7707064139_58'
			}
		],
		hr: [
			{
				full_name: 'АСТРАХАН Дмитрий Хананович',
				position: 'художественный руководитель',
				photo: null
			}
		],
		maps_link: 'https://yandex.ru/maps/-/CHCQfLi5',
		yandex_ratings_count: 3179,
		yandex_reviews_count: 1362,
		yandex_rating: 4.8
	},
	{
		id: 7707085202,
		name: 'ГБУК г. Москвы "Театр Эрмитаж"',
		address: '127006, город Москва, ул Каретный Ряд, д. 3 стр. 1 ',
		capacity: 414.0,
		audience_thousands: 73.8,
		occupancy_percent: 80.0,
		ticket_price_rub: 1283.8083333333334,
		photo: '7707085202_25',
		productions: [],
		spaces: [
			{
				id: 24,
				district: 'Тверской',
				okrug: 'ЦАО',
				type: 'Малая сцена',
				venue_space_short_name: 'Камерная сцена (Сфера)',
				commercial_capacity: 70,
				inconvenient_seats: 0,
				total_capacity: 70,
				venue_space_id: 'intickets_4275372',
				photo: '7707085202_24'
			},
			{
				id: 25,
				district: 'Тверской',
				okrug: 'ЦАО',
				type: 'Основная сцена',
				venue_space_short_name: 'Основная сцена (Сфера)',
				commercial_capacity: 157,
				inconvenient_seats: 0,
				total_capacity: 157,
				venue_space_id: 'kassir.ru_308160',
				photo: '7707085202_25'
			},
			{
				id: 26,
				district: 'Арбат',
				okrug: 'ЦАО',
				type: 'Основная сцена',
				venue_space_short_name: 'Основная сцена',
				commercial_capacity: 187,
				inconvenient_seats: 0,
				total_capacity: 187,
				venue_space_id: 'ticketland_179752',
				photo: '7707085202_26'
			}
		],
		hr: [
			{
				full_name: 'ЛЕВИТИН Михаил Захарович',
				position: 'художественный руководитель                                     ',
				photo: null
			},
			{
				full_name: 'МОГИНОВА Анастасия Рафисовна',
				position: 'директор',
				photo: null
			}
		],
		maps_link: 'https://yandex.ru/maps/-/CHCQf-9x',
		yandex_ratings_count: 4195,
		yandex_reviews_count: 1936,
		yandex_rating: 5.0
	},
	{
		id: 7701127897,
		name: 'ГБУК г. Москвы "МДТ "Модернъ"',
		address: '105082, город Москва, Спартаковская пл., д. 9/1 ',
		capacity: 462.0,
		audience_thousands: 65.6,
		occupancy_percent: 92.0,
		ticket_price_rub: 2990.7641666666664,
		photo: '7701127897_27',
		productions: [],
		spaces: [
			{
				id: 65,
				district: 'Басманный',
				okrug: 'ЦАО',
				type: 'Малая сцена',
				venue_space_short_name: 'Зал Владимира Зельдина (сцена № 2)',
				commercial_capacity: 99,
				inconvenient_seats: 0,
				total_capacity: 99,
				venue_space_id: 'ticketland_1134504',
				photo: '7701127897_65'
			},
			{
				id: 66,
				district: 'Басманный',
				okrug: 'ЦАО',
				type: 'Малая сцена',
				venue_space_short_name: 'Зал Владимира Левашева (сцена № 1)',
				commercial_capacity: 108,
				inconvenient_seats: 0,
				total_capacity: 108,
				venue_space_id: 'ticketland_1166434',
				photo: '7701127897_66'
			},
			{
				id: 67,
				district: 'Басманный',
				okrug: 'ЦАО',
				type: 'Основная сцена',
				venue_space_short_name: 'Зал Премьер (большой зал)',
				commercial_capacity: 337,
				inconvenient_seats: 16,
				total_capacity: 353,
				venue_space_id: 'tickets.mos.ru_215940',
				photo: '7701127897_67'
			}
		],
		hr: [],
		maps_link: 'https://yandex.ru/maps/-/CHCQjN1c',
		yandex_ratings_count: 7106,
		yandex_reviews_count: 3197,
		yandex_rating: 4.9
	},
	{
		id: 7701117909,
		name: 'ГБУК г. Москвы "Театр Олега Табакова"',
		address: '105062, город Москва, ул. Чаплыгина, д.1а стр.1 ',
		capacity: 480.0,
		audience_thousands: 70.1,
		occupancy_percent: 100.0,
		ticket_price_rub: 6315.796666666666,
		photo: '7701117909_28',
		productions: [],
		spaces: [
			{
				id: 76,
				district: 'Басманный',
				okrug: 'ЦАО',
				type: 'Сц.площадка в отдельно стоящем здании',
				venue_space_short_name: 'Сцена на Чистых прудах',
				commercial_capacity: 114,
				inconvenient_seats: 0,
				total_capacity: 114,
				venue_space_id: 'profticket_2_profticket_ts_tabakov_theatre',
				photo: '7701117909_76'
			},
			{
				id: 77,
				district: 'Мещанский',
				okrug: 'ЦАО',
				type: 'Основная сцена',
				venue_space_short_name: 'Сцена на Сухаревской',
				commercial_capacity: 366,
				inconvenient_seats: 0,
				total_capacity: 366,
				venue_space_id: 'profticket_10_profticket_ts_tabakov_theatre',
				photo: '7701117909_77'
			}
		],
		hr: [
			{
				full_name: 'МАШКОВ Владимир Львович',
				position: 'художественный руководитель',
				photo: null
			}
		],
		maps_link: 'https://yandex.ru/maps/-/CHCQjP7M',
		yandex_ratings_count: 1364,
		yandex_reviews_count: 438,
		yandex_rating: 4.7
	},
	{
		id: 7704132084,
		name: 'ГБУК г. Москвы "МТЦ "Вишневый сад" п/р А. Вилькина"',
		address: '127051, город Москва, Малая Сухаревская пл., д. 10',
		capacity: 415.0,
		audience_thousands: 50.3,
		occupancy_percent: 57.0,
		ticket_price_rub: 986.9166666666666,
		photo: '7704132084_30',
		productions: [],
		spaces: [
			{
				id: 53,
				district: 'Мещанский',
				okrug: 'ЦАО',
				type: 'Малая сцена',
				venue_space_short_name: 'Малый зал',
				commercial_capacity: 70,
				inconvenient_seats: 4,
				total_capacity: 74,
				venue_space_id: 'ticketland_764568',
				photo: '7704132084_53'
			},
			{
				id: 54,
				district: 'Мещанский',
				okrug: 'ЦАО',
				type: 'Основная сцена',
				venue_space_short_name: 'Большой зал',
				commercial_capacity: 345,
				inconvenient_seats: 21,
				total_capacity: 366,
				venue_space_id: 'tickets.mos.ru_215946',
				photo: '7704132084_54'
			}
		],
		hr: [
			{
				full_name: 'ВИЛЬКИН Александр Михайлович',
				position: 'художественный руководитель',
				photo: null
			}
		],
		maps_link: 'https://yandex.ru/maps/-/CHCQnS0P',
		yandex_ratings_count: 3728,
		yandex_reviews_count: 1768,
		yandex_rating: 4.9
	},
	{
		id: 7735026248,
		name: 'ГБУК г.Москвы "Ведогонь-театр"',
		address: '124536, город Москва, г Зеленоград, ул Юности, д. 17 ',
		capacity: 402.0,
		audience_thousands: 48.7,
		occupancy_percent: 83.6,
		ticket_price_rub: 983.9166666666666,
		photo: '7735026248_31',
		productions: [],
		spaces: [
			{
				id: 13,
				district: 'Савелки',
				okrug: 'ЗелАО',
				type: 'Малая сцена',
				venue_space_short_name: 'Зал №2',
				commercial_capacity: 40,
				inconvenient_seats: 0,
				total_capacity: 40,
				venue_space_id: 'kassir_ru_ts_radario_10883',
				photo: '7735026248_13'
			},
			{
				id: 14,
				district: 'Савелки',
				okrug: 'ЗелАО',
				type: 'Малая сцена',
				venue_space_short_name: 'Зал №3',
				commercial_capacity: 60,
				inconvenient_seats: 0,
				total_capacity: 60,
				venue_space_id: 'tickets.mos.ru_215985',
				photo: '7735026248_14'
			},
			{
				id: 15,
				district: 'Савелки',
				okrug: 'ЗелАО',
				type: 'Малая сцена',
				venue_space_short_name: 'Малый зал',
				commercial_capacity: 90,
				inconvenient_seats: 0,
				total_capacity: 90,
				venue_space_id: 'tickets.mos.ru_215984',
				photo: '7735026248_15'
			},
			{
				id: 16,
				district: 'Савелки',
				okrug: 'ЗелАО',
				type: 'Основная сцена',
				venue_space_short_name: 'Большой зал',
				commercial_capacity: 301,
				inconvenient_seats: 0,
				total_capacity: 301,
				venue_space_id: 'tickets.mos.ru_215983',
				photo: '7735026248_16'
			}
		],
		hr: [],
		maps_link: 'https://yandex.ru/maps/-/CHCUETIX',
		yandex_ratings_count: 2103,
		yandex_reviews_count: 747,
		yandex_rating: 5.0
	},
	{
		id: 7730519779,
		name: 'ГБУК г. Москвы "Театр кошек Куклачева"',
		address: '121151, город Москва, Кутузовский пр-кт, д. 25 ',
		capacity: 237.0,
		audience_thousands: 47.4,
		occupancy_percent: 70.02,
		ticket_price_rub: 1986.2983333333332,
		photo: '7730519779_32',
		productions: [],
		spaces: [
			{
				id: 115,
				district: 'Дорогомилово',
				okrug: 'ЗАО',
				type: 'Основная сцена',
				venue_space_short_name: 'Основной',
				commercial_capacity: 237,
				inconvenient_seats: 4,
				total_capacity: 241,
				venue_space_id: 'afisha.tickets_6685',
				photo: '7730519779_115'
			}
		],
		hr: [
			{
				full_name: 'КУКЛАЧЕВ Юрий Дмитриевич',
				position: 'художественный руководитель',
				photo: null
			}
		],
		maps_link: 'https://yandex.ru/maps/-/CHCUIY6N',
		yandex_ratings_count: 5540,
		yandex_reviews_count: 2387,
		yandex_rating: 4.9
	},
	{
		id: 7709018353,
		name: 'ГБУК г. Москвы "МДТ им. Н.В. Гоголя"',
		address: '105064, город Москва, ул. Казакова, д. 8 ',
		capacity: 757.0,
		audience_thousands: 46.2,
		occupancy_percent: 64.0,
		ticket_price_rub: 1342.8333333333333,
		photo: '7709018353_33',
		productions: [],
		spaces: [
			{
				id: 59,
				district: 'Басманный',
				okrug: 'ЦАО',
				type: 'Малая сцена',
				venue_space_short_name: 'Малый зал',
				commercial_capacity: 108,
				inconvenient_seats: 0,
				total_capacity: 108,
				venue_space_id: 'afisha.tickets_139817',
				photo: '7709018353_59'
			},
			{
				id: 60,
				district: 'Басманный',
				okrug: 'ЦАО',
				type: 'Основная сцена',
				venue_space_short_name: 'Основной зал',
				commercial_capacity: 605,
				inconvenient_seats: 0,
				total_capacity: 605,
				venue_space_id: 'profticket_1_profticket_ts_gogol_theatre',
				photo: '7709018353_60'
			}
		],
		hr: [],
		maps_link: 'https://yandex.ru/maps/-/CHCUI6ix',
		yandex_ratings_count: 2502,
		yandex_reviews_count: 1048,
		yandex_rating: 4.7
	},
	{
		id: 7729217597,
		name: 'ГБУК г. Москвы "Театр на Юго-Западе"',
		address: '119571, город Москва, пр-кт Вернадского, д.125 ',
		capacity: 182.0,
		audience_thousands: 49.0,
		occupancy_percent: 96.7,
		ticket_price_rub: 2035.7458333333334,
		photo: '7709018353_34',
		productions: [],
		spaces: [
			{
				id: 36,
				district: 'Тропарево-Никулино',
				okrug: 'ЗАО',
				type: 'Малая сцена',
				venue_space_short_name: 'Арт - кафе',
				commercial_capacity: 68,
				inconvenient_seats: 0,
				total_capacity: 68,
				venue_space_id: 'ticketland_356681',
				photo: '7729217597_36'
			},
			{
				id: 37,
				district: 'Тропарево-Никулино',
				okrug: 'ЗАО',
				type: 'Основная сцена',
				venue_space_short_name: 'Основной зал',
				commercial_capacity: 118,
				inconvenient_seats: 0,
				total_capacity: 118,
				venue_space_id: 'tickets.mos.ru_215958',
				photo: '7729217597_37'
			}
		],
		hr: [
			{
				full_name: 'БЕРЕСТОВ  Дмитрий Юрьевич',
				position: 'директор       ',
				photo: null
			},
			{
				full_name: 'ЛЕУШИН Олег Николаевич',
				position: 'художественный руководитель',
				photo: null
			}
		],
		maps_link: 'https://yandex.ru/maps/-/CHCUIPL5',
		yandex_ratings_count: 4150,
		yandex_reviews_count: 1672,
		yandex_rating: 4.9
	},
	{
		id: 7703093185,
		name: 'ГБУК г. Москвы "МТ "У Никитских ворот"',
		address: '121069, город Москва, Большая Никитская ул., д. 23/14/9 ',
		capacity: 198.0,
		audience_thousands: 42.6,
		occupancy_percent: 73.0,
		ticket_price_rub: 1307.0833333333333,
		photo: '7709018353_35',
		productions: [],
		spaces: [
			{
				id: 48,
				district: 'Пресненский',
				okrug: 'ЦАО',
				type: 'Малая сцена',
				venue_space_short_name: 'Старая сцена',
				commercial_capacity: 48,
				inconvenient_seats: 0,
				total_capacity: 48,
				venue_space_id: 'ticketland_71347',
				photo: '7703093185_48'
			},
			{
				id: 49,
				district: 'Пресненский',
				okrug: 'ЦАО',
				type: 'Основная сцена',
				venue_space_short_name: 'Новая сцена',
				commercial_capacity: 190,
				inconvenient_seats: 0,
				total_capacity: 190,
				venue_space_id: 'ticketland_30942',
				photo: '7703093185_49'
			}
		],
		hr: [],
		maps_link: 'https://yandex.ru/maps/-/CHCUMF7F',
		yandex_ratings_count: 2735,
		yandex_reviews_count: 1031,
		yandex_rating: 4.9
	},
	{
		id: 7714035227,
		name: 'ГБУК г. Москвы "Цыганский театр "Ромэн"',
		address: '125040, город Москва, Ленинградский пр-кт, д.32/2 ',
		capacity: 514.0,
		audience_thousands: 40.9,
		occupancy_percent: 55.0,
		ticket_price_rub: 1618.6666666666667,
		photo: '7709018353_36',
		productions: [],
		spaces: [
			{
				id: 4,
				district: 'Беговой',
				okrug: 'САО',
				type: 'Малая сцена',
				venue_space_short_name: 'Малый зал',
				commercial_capacity: 60,
				inconvenient_seats: 0,
				total_capacity: 60,
				venue_space_id: 'intickets_728251',
				photo: '7714035227_4'
			},
			{
				id: 52,
				district: 'Беговой',
				okrug: 'САО',
				type: 'Основная сцена',
				venue_space_short_name: 'Зрительный зал',
				commercial_capacity: 506,
				inconvenient_seats: 0,
				total_capacity: 506,
				venue_space_id: 'tickets.mos.ru_215948',
				photo: '7714035227_52'
			}
		],
		hr: [
			{
				full_name: 'РОМАНЦОВА Наталья Николаевна',
				position: 'директор',
				photo: null
			},
			{
				full_name: 'СЕРГИЕНКО Николай Николаевич',
				position: 'художественный руководитель',
				photo: null
			}
		],
		maps_link: 'https://yandex.ru/maps/-/CHCUMPKW',
		yandex_ratings_count: 3398,
		yandex_reviews_count: 1408,
		yandex_rating: 4.7
	},
	{
		id: 7720056169,
		name: 'ГБУК г. Москвы "Московский театр иллюзии"',
		address: '111398, город Москва, ул Лазо, д. 3 ',
		capacity: 437.0,
		audience_thousands: 40.0,
		occupancy_percent: 63.0,
		ticket_price_rub: 1326.75,
		photo: '7709018353_37',
		productions: [],
		spaces: [
			{
				id: 120,
				district: 'Новогиреево',
				okrug: 'ВАО',
				type: 'Основная сцена',
				venue_space_short_name: 'Сцена на Перовской',
				commercial_capacity: 102,
				inconvenient_seats: 0,
				total_capacity: 102,
				venue_space_id: 'tickets.mos.ru_216017',
				photo: '7720056169_120'
			},
			{
				id: 121,
				district: 'Перово',
				okrug: 'ВАО',
				type: 'Основная сцена',
				venue_space_short_name: 'Основная сцена',
				commercial_capacity: 301,
				inconvenient_seats: 0,
				total_capacity: 301,
				venue_space_id: 'intickets_12607418',
				photo: '7720056169_121'
			}
		],
		hr: [
			{
				full_name: 'АСЛАНОВ Эдуард Эдуардович',
				position: 'директор ',
				photo: null
			}
		],
		maps_link: 'https://yandex.ru/maps/-/CHCUQJ4C',
		yandex_ratings_count: 2491,
		yandex_reviews_count: 1432,
		yandex_rating: 4.9
	},
	{
		id: 7716028803,
		name: 'ГБУК г. Москвы "Новый драматический театр"',
		address: '129347, город Москва, ул. Проходчиков, д.2 ',
		capacity: 266.0,
		audience_thousands: 32.9,
		occupancy_percent: 50.0,
		ticket_price_rub: 905.0,
		photo: '7709018353_38',
		productions: [],
		spaces: [
			{
				id: 39,
				district: 'Ярославский',
				okrug: 'СВАО',
				type: 'Малая сцена',
				venue_space_short_name: 'Сцена Мастерская',
				commercial_capacity: 72,
				inconvenient_seats: 0,
				total_capacity: 72,
				venue_space_id: 'afisha.tickets_2121',
				photo: '7716028803_39'
			},
			{
				id: 40,
				district: 'Ярославский',
				okrug: 'СВАО',
				type: 'Основная сцена',
				venue_space_short_name: 'Основная сцена',
				commercial_capacity: 194,
				inconvenient_seats: 0,
				total_capacity: 194,
				venue_space_id: 'afisha.tickets_34161',
				photo: '7716028803_40'
			}
		],
		hr: [
			{
				full_name: 'ДОЛГАЧЕВ Вячеслав Васильевич',
				position: 'художественный руководитель',
				photo: null
			},
			{
				full_name: 'ПОПОВИЧЕВА  Вера Илларионовна',
				position: 'директор',
				photo: null
			}
		],
		maps_link: 'https://yandex.ru/maps/-/CHCUUMLl',
		yandex_ratings_count: 4071,
		yandex_reviews_count: 1702,
		yandex_rating: 4.8
	},
	{
		id: 7715049230,
		name: 'ГБУК г. Москвы "ММЭТ п/р В.Спесивцева"',
		address: '127254, город Москва, ул. Руставели, д. 19 ',
		capacity: 304.0,
		audience_thousands: 33.8,
		occupancy_percent: 70.0,
		ticket_price_rub: 709.25,
		photo: '7709018353_39',
		productions: [],
		spaces: [
			{
				id: 75,
				district: 'Бутырский',
				okrug: 'СВАО',
				type: 'Основная сцена',
				venue_space_short_name: 'Основной зал',
				commercial_capacity: 304,
				inconvenient_seats: 0,
				total_capacity: 304,
				venue_space_id: 'afisha.tickets_31',
				photo: '7715049230_75'
			}
		],
		hr: [
			{
				full_name: 'СПЕСИВЦЕВ Вячеслав Семёнович',
				position: 'художественный руководитель',
				photo: null
			}
		],
		maps_link: 'https://yandex.ru/maps/-/CHCUUSJq',
		yandex_ratings_count: 2858,
		yandex_reviews_count: 1196,
		yandex_rating: 4.6
	},
	{
		id: 7723316672,
		name: 'ГБУК г. Москвы "Театр Стаса Намина"',
		address: '119049, город Москва, ул Крымский Вал, д. 9 стр. 33 ',
		capacity: 140.0,
		audience_thousands: 29.2,
		occupancy_percent: 86.3,
		ticket_price_rub: 1798.8333333333333,
		photo: '7709018353_40',
		productions: [],
		spaces: [
			{
				id: 131,
				district: 'Якиманка',
				okrug: 'ЦАО',
				type: 'Малая сцена',
				venue_space_short_name: 'Зеленый театр',
				commercial_capacity: 8000,
				inconvenient_seats: 0,
				total_capacity: 8000,
				venue_space_id: NaN,
				photo: '7723316672_131'
			},
			{
				id: 132,
				district: 'Якиманка',
				okrug: 'ЦАО',
				type: 'Основная сцена',
				venue_space_short_name: 'Театральный зал',
				commercial_capacity: 147,
				inconvenient_seats: 2,
				total_capacity: 149,
				venue_space_id: 'tickets.mos.ru_216007',
				photo: '7723316672_132'
			}
		],
		hr: [
			{
				full_name: 'МИКОЯН Анастас Алексеевич',
				position: 'художественный руководитель                      ',
				photo: null
			}
		],
		maps_link: 'https://yandex.ru/maps/-/CHCUYP-p',
		yandex_ratings_count: 2136,
		yandex_reviews_count: 907,
		yandex_rating: 4.7
	},
	{
		id: 7704198381,
		name: 'ГБУК г. Москвы "МГТМ п/р А. Рыбникова"',
		address: '121069, город Москва, Большой Ржевский пер., д.11 ',
		capacity: NaN,
		audience_thousands: 11.16,
		occupancy_percent: NaN,
		ticket_price_rub: NaN,
		photo: '7709018353_41',
		productions: [],
		spaces: [
			{
				id: 113,
				district: 'Замоскворечье',
				okrug: 'ЦАО',
				type: 'Малая сцена',
				venue_space_short_name: 'Малый Зал',
				commercial_capacity: 150,
				inconvenient_seats: 0,
				total_capacity: 150,
				venue_space_id: 'tickets.mos.ru_215972',
				photo: '7704198381_113'
			},
			{
				id: 114,
				district: 'Замоскворечье',
				okrug: 'ЦАО',
				type: 'Основная сцена',
				venue_space_short_name: 'Большой Зал',
				commercial_capacity: 470,
				inconvenient_seats: 2,
				total_capacity: 472,
				venue_space_id: 'tickets.mos.ru_215974',
				photo: '7704198381_114'
			}
		],
		hr: [],
		maps_link: 'https://yandex.ru/maps/-/CHCUeU5F',
		yandex_ratings_count: 9188,
		yandex_reviews_count: 3301,
		yandex_rating: 4.8
	},
	{
		id: 7710042865,
		name: 'ГБУК г. Москвы "Детский театр эстрады"',
		address: '105005, город Москва, Бауманская ул., д.32 стр.1 ',
		capacity: 202.0,
		audience_thousands: 30.8,
		occupancy_percent: 96.25,
		ticket_price_rub: 632.5024999999999,
		photo: '7709018353_42',
		productions: [],
		spaces: [
			{
				id: 110,
				district: 'Басманный',
				okrug: 'ЦАО',
				type: 'Основная сцена',
				venue_space_short_name: 'Зрительный зал',
				commercial_capacity: 202,
				inconvenient_seats: 0,
				total_capacity: 202,
				venue_space_id: 'tickets.mos.ru_215968',
				photo: '7710042865_110'
			}
		],
		hr: [],
		maps_link: 'https://yandex.ru/maps/-/CHCUeCzA',
		yandex_ratings_count: 1494,
		yandex_reviews_count: 592,
		yandex_rating: 4.6
	},
	{
		id: 7701199901,
		name: 'ГБУК г. Москвы "Театр марионеток"',
		address: '109147, город Москва, Абельмановская ул., д. 17а ',
		capacity: 150.0,
		audience_thousands: 25.2,
		occupancy_percent: 50.0,
		ticket_price_rub: 997.665,
		photo: '7709018353_43',
		productions: [],
		spaces: [
			{
				id: 142,
				district: 'Таганский',
				okrug: 'ЦАО',
				type: 'Малая сцена',
				venue_space_short_name: 'Малый зал (Театральное кафе)',
				commercial_capacity: 28,
				inconvenient_seats: 0,
				total_capacity: 28,
				venue_space_id: 'afisha.tickets_136390',
				photo: '7701199901_142'
			},
			{
				id: 143,
				district: 'Таганский',
				okrug: 'ЦАО',
				type: 'Основная сцена',
				venue_space_short_name: 'Большой зал (Синий зал)',
				commercial_capacity: 194,
				inconvenient_seats: 0,
				total_capacity: 194,
				venue_space_id: 'afisha.tickets_135871',
				photo: '7701199901_143'
			}
		],
		hr: [
			{
				full_name: 'КРЯЧУН Ирина Ивановна',
				position: 'художественный руководитель',
				photo: null
			}
		],
		maps_link: 'https://yandex.ru/maps/-/CHCUe-7G',
		yandex_ratings_count: 1225,
		yandex_reviews_count: 599,
		yandex_rating: 4.6
	},
	{
		id: 7701258410,
		name: 'ГБУК г.Москвы "Московский музыкальный театр "На Басманной"',
		address: '105066, город Москва, 1-Й Басманный пер., д. 12 ',
		capacity: 662.0,
		audience_thousands: 25.5,
		occupancy_percent: 58.0,
		ticket_price_rub: 959.1666666666666,
		photo: '7709018353_44',
		productions: [],
		spaces: [
			{
				id: 122,
				district: 'Басманный',
				okrug: 'ЦАО',
				type: 'Сц.площадка в отдельно стоящем здании',
				venue_space_short_name: 'Малая сцена',
				commercial_capacity: 43,
				inconvenient_seats: 0,
				total_capacity: 43,
				venue_space_id: 'ticketland_166710',
				photo: '7701258410_122'
			},
			{
				id: 123,
				district: 'Басманный',
				okrug: 'ЦАО',
				type: 'Основная сцена',
				venue_space_short_name: 'Зал управы Басманного района',
				commercial_capacity: 492,
				inconvenient_seats: 120,
				total_capacity: 612,
				venue_space_id: 'ticketland_156606',
				photo: '7701258410_123'
			}
		],
		hr: [
			{
				full_name: 'ТЕРТЕРЯН Жаннета Гургеновна',
				position: 'художественный руководитель                                     ',
				photo: null
			}
		],
		maps_link: 'https://yandex.ru/maps/-/CHCUiRYE',
		yandex_ratings_count: 1128,
		yandex_reviews_count: 673,
		yandex_rating: 4.7
	},
	{
		id: 7702619852,
		name: 'ГБУК г. Москвы "Школа драматического искусства"',
		address: '107045, город Москва, ул. Сретенка, д.19 ',
		capacity: 393.0,
		audience_thousands: 25.5,
		occupancy_percent: 64.0,
		ticket_price_rub: 1635.3183333333334,
		photo: '7709018353_45',
		productions: [],
		spaces: [
			{
				id: 42,
				district: 'Мещанский',
				okrug: 'ЦАО',
				type: 'Основная сцена',
				venue_space_short_name: 'Глобус зал',
				commercial_capacity: 99,
				inconvenient_seats: 0,
				total_capacity: 99,
				venue_space_id: 'ticketland_50501',
				photo: '7702619852_42'
			},
			{
				id: 43,
				district: 'Мещанский',
				okrug: 'ЦАО',
				type: 'Малая сцена',
				venue_space_short_name: 'Тау-зал',
				commercial_capacity: 80,
				inconvenient_seats: 0,
				total_capacity: 80,
				venue_space_id: 'ticketland_22466',
				photo: '7702619852_43'
			},
			{
				id: 44,
				district: 'Мещанский',
				okrug: 'ЦАО',
				type: 'Основная сцена',
				venue_space_short_name: 'Зал Манеж',
				commercial_capacity: 220,
				inconvenient_seats: 0,
				total_capacity: 220,
				venue_space_id: 'tickets.mos.ru_215747',
				photo: '7702619852_44'
			}
		],
		hr: [
			{
				full_name: 'СОКОЛОВА Ольга Эдуардовна',
				position: 'директор ',
				photo: null
			}
		],
		maps_link: 'https://yandex.ru/maps/-/CHCUiTPu',
		yandex_ratings_count: 1660,
		yandex_reviews_count: 715,
		yandex_rating: 4.7
	},
	{
		id: 7710593781,
		name: 'ГБУК г. Москвы "Театр "Практика"',
		address: '123001, город Москва, Трёхпрудный пер., д.11/13 стр.1 ',
		capacity: 147.0,
		audience_thousands: 23.7,
		occupancy_percent: 92.0,
		ticket_price_rub: 2951.0833333333335,
		photo: '7709018353_46',
		productions: [],
		spaces: [
			{
				id: 111,
				district: 'Пресненский',
				okrug: 'ЦАО',
				type: 'Малая сцена',
				venue_space_short_name: 'Малый зал',
				commercial_capacity: 51,
				inconvenient_seats: 0,
				total_capacity: 51,
				venue_space_id: 'afisha.tickets_141833',
				photo: '7710593781_111'
			},
			{
				id: 112,
				district: 'Пресненский',
				okrug: 'ЦАО',
				type: 'Основная сцена',
				venue_space_short_name: 'Основной зал',
				commercial_capacity: 87,
				inconvenient_seats: 0,
				total_capacity: 87,
				venue_space_id: 'afisha.tickets_141211',
				photo: '7710593781_112'
			}
		],
		hr: [],
		maps_link: 'https://yandex.ru/maps/-/CHCUmZ-R',
		yandex_ratings_count: 1269,
		yandex_reviews_count: 457,
		yandex_rating: 4.7
	},
	{
		id: 7716149741,
		name: 'ГБУК г. Москвы "МГИЭТ"',
		address: '129327, город Москва, Рудневой ул., д.3 ',
		capacity: 176.0,
		audience_thousands: 19.1,
		occupancy_percent: 50.5,
		ticket_price_rub: 710.6666666666666,
		photo: '7709018353_47',
		productions: [],
		spaces: [
			{
				id: 38,
				district: 'Бабушкинский',
				okrug: 'СВАО',
				type: 'Основная сцена',
				venue_space_short_name: 'Основная сцена',
				commercial_capacity: 176,
				inconvenient_seats: 0,
				total_capacity: 176,
				venue_space_id: 'intickets_11932169',
				photo: '7716149741_38'
			}
		],
		hr: [],
		maps_link: 'https://yandex.ru/maps/-/CHCUmLL5',
		yandex_ratings_count: 1431,
		yandex_reviews_count: 645,
		yandex_rating: 4.7
	},
	{
		id: 7726073570,
		name: 'ГБУК г. Москвы "Театр "Шалом"',
		address: '117556, город Москва, Варшавское ш., д.71 к.1 ',
		capacity: 528.0,
		audience_thousands: 19.7,
		occupancy_percent: 96.93,
		ticket_price_rub: 1927.03,
		photo: '7709018353_48',
		productions: [],
		spaces: [
			{
				id: 3,
				district: 'Тверской',
				okrug: 'ЦАО',
				type: 'Малая сцена',
				venue_space_short_name: 'Зелёное фойе',
				commercial_capacity: 64,
				inconvenient_seats: 0,
				total_capacity: 64,
				venue_space_id: 'afisha.tickets_138269',
				photo: '7726073570_3'
			},
			{
				id: 27,
				district: 'Тверской',
				okrug: 'ЦАО',
				type: 'Малая сцена',
				venue_space_short_name: 'Малый зал',
				commercial_capacity: 99,
				inconvenient_seats: 0,
				total_capacity: 99,
				venue_space_id: 'afisha.tickets_153397',
				photo: '7726073570_27'
			},
			{
				id: 28,
				district: 'Тверской',
				okrug: 'ЦАО',
				type: 'Основная сцена',
				venue_space_short_name: 'Большой зал',
				commercial_capacity: 280,
				inconvenient_seats: 0,
				total_capacity: 280,
				venue_space_id: 'afisha.tickets_153396',
				photo: '7726073570_28'
			},
			{
				id: 29,
				district: 'Нагорный',
				okrug: 'ЮАО',
				type: 'Сц.площадка в отдельно стоящем здании',
				venue_space_short_name: 'Сцена на Варшавке',
				commercial_capacity: 139,
				inconvenient_seats: 0,
				total_capacity: 139,
				venue_space_id: 'afisha.tickets_140248',
				photo: '7726073570_29'
			}
		],
		hr: [],
		maps_link: 'https://yandex.ru/maps/-/CHCUqB4S',
		yandex_ratings_count: 1228,
		yandex_reviews_count: 485,
		yandex_rating: 4.5
	},
	{
		id: 7719013636,
		name: 'ГБУК г. Москвы "МДТТ"',
		address: '105077, город Москва, Измайловский б-р, д.60 /10 ',
		capacity: 207.0,
		audience_thousands: 17.4,
		occupancy_percent: 62.1,
		ticket_price_rub: 1358.793333333333,
		photo: '7709018353_49',
		productions: [],
		spaces: [
			{
				id: 144,
				district: 'Марьина роща',
				okrug: 'СВАО',
				type: 'Основная сцена',
				venue_space_short_name: 'Сцена "Тень", Основной зал',
				commercial_capacity: 35,
				inconvenient_seats: 0,
				total_capacity: 35,
				venue_space_id: 'tickets.mos.ru_215996',
				photo: '7719013636_144'
			},
			{
				id: 145,
				district: 'Марьина роща',
				okrug: 'СВАО',
				type: 'Малая сцена',
				venue_space_short_name: 'Сцена "Тень", Лиликанский театр',
				commercial_capacity: 5,
				inconvenient_seats: 0,
				total_capacity: 5,
				venue_space_id: 'yandex_41dc142a740cc8214e8a28cdeec76e532934a706087c3daa37facd9a37c355b7',
				photo: '7719013636_145'
			},
			{
				id: 146,
				district: 'Восточное Измайлово',
				okrug: 'ВАО',
				type: 'Малая сцена',
				venue_space_short_name: 'Фойе',
				commercial_capacity: 40,
				inconvenient_seats: 0,
				total_capacity: 40,
				venue_space_id: 'tickets.mos.ru_215994',
				photo: '7719013636_146'
			},
			{
				id: 147,
				district: 'Восточное Измайлово',
				okrug: 'ВАО',
				type: 'Основная сцена',
				venue_space_short_name: 'Основной зал',
				commercial_capacity: 127,
				inconvenient_seats: 0,
				total_capacity: 127,
				venue_space_id: 'yandex_08807c5f96844b4b2eaba3e0c43d1a7f4b113e525745823afa4428adf04847de',
				photo: '7719013636_147'
			}
		],
		hr: [],
		maps_link: 'https://yandex.ru/maps/-/CHCUqL~q',
		yandex_ratings_count: 1513,
		yandex_reviews_count: 644,
		yandex_rating: 4.6
	},
	{
		id: 7701045549,
		name: 'ГБУК г. Москвы "Театр на Покровке"',
		address: '101000, город Москва, ул Покровка, д. 50/2 стр. 1 ',
		capacity: 80.0,
		audience_thousands: 17.7,
		occupancy_percent: 85.4,
		ticket_price_rub: 1570.0833333333333,
		photo: '7709018353_51',
		productions: [],
		spaces: [
			{
				id: 23,
				district: 'Басманный',
				okrug: 'ЦАО',
				type: 'Основная сцена',
				venue_space_short_name: 'Зрительный зал',
				commercial_capacity: 80,
				inconvenient_seats: 0,
				total_capacity: 80,
				venue_space_id: 'ticketland_27142',
				photo: '7701045549_23'
			}
		],
		hr: [
			{
				full_name: 'ПЕПЕЛЯЕВА Ольга Юрьевна',
				position: 'директор',
				photo: null
			}
		],
		maps_link: 'https://yandex.ru/maps/-/CHCU5Ni1',
		yandex_ratings_count: 1595,
		yandex_reviews_count: 686,
		yandex_rating: 4.7
	},
	{
		id: 7703068710,
		name: 'ГБУК г. Москвы "Московский театр ОКОЛО"',
		address: '125009, город Москва, Вознесенский пер., д. 9 стр. 3 ',
		capacity: 170.0,
		audience_thousands: 18.3,
		occupancy_percent: 97.0,
		ticket_price_rub: 1314.8333333333333,
		photo: '7709018353_52',
		productions: [],
		spaces: [
			{
				id: 31,
				district: 'Пресненский',
				okrug: 'ЦАО',
				type: 'Сц.площадка в отдельно стоящем здании',
				venue_space_short_name: 'Малая сцена',
				commercial_capacity: 0,
				inconvenient_seats: 0,
				total_capacity: 0,
				venue_space_id: 'tickets.mos.ru_215964',
				photo: '7703068710_31'
			},
			{
				id: 32,
				district: 'Пресненский',
				okrug: 'ЦАО',
				type: 'Основная сцена',
				venue_space_short_name: 'Новая сцена',
				commercial_capacity: 96,
				inconvenient_seats: 0,
				total_capacity: 96,
				venue_space_id: 'afisha.tickets_46425',
				photo: '7703068710_32'
			}
		],
		hr: [
			{
				full_name: 'ЗАСЛАВСКИЙ Константин Яковлевич ',
				position: 'директор ',
				photo: null
			},
			{
				full_name: 'ПОГРЕБНИЧКО Юрий Николаевич',
				position: 'художественный руководитель',
				photo: null
			}
		],
		maps_link: 'https://yandex.ru/maps/-/CHCU50nz',
		yandex_ratings_count: 1073,
		yandex_reviews_count: 373,
		yandex_rating: 4.6
	},
	{
		id: 7722284474,
		name: 'ГБУК г. Москвы "Центр драматургии и режиссуры"',
		address: '125284, город Москва, Беговая ул., д.5 ',
		capacity: 327.0,
		audience_thousands: 14.7,
		occupancy_percent: 51.5,
		ticket_price_rub: 1457.9666666666665,
		photo: '7709018353_53',
		productions: [],
		spaces: [
			{
				id: 1,
				district: 'Арбат',
				okrug: 'ЦАО',
				type: 'Малая сцена',
				venue_space_short_name: 'Студия 6',
				commercial_capacity: 40,
				inconvenient_seats: 0,
				total_capacity: 40,
				venue_space_id: 'ticketland_23285',
				photo: '7722284474_1'
			},
			{
				id: 2,
				district: 'Арбат',
				okrug: 'ЦАО',
				type: 'Малая сцена',
				venue_space_short_name: 'Студия 1',
				commercial_capacity: 74,
				inconvenient_seats: 0,
				total_capacity: 74,
				venue_space_id: 'ticketland_184026',
				photo: '7722284474_2'
			},
			{
				id: 45,
				district: 'Беговой',
				okrug: 'САО',
				type: 'Сц.площадка в отдельно стоящем здании',
				venue_space_short_name: 'Дополнительный, Малый',
				commercial_capacity: 54,
				inconvenient_seats: 0,
				total_capacity: 54,
				venue_space_id: 'tickets.mos.ru_199463',
				photo: '7722284474_45'
			},
			{
				id: 46,
				district: 'Беговой',
				okrug: 'САО',
				type: 'Сц.площадка в отдельно стоящем здании',
				venue_space_short_name: 'Дополнительный, Большой',
				commercial_capacity: 87,
				inconvenient_seats: 0,
				total_capacity: 87,
				venue_space_id: 'tickets.mos.ru_199462',
				photo: '7722284474_46'
			},
			{
				id: 47,
				district: 'Сокол',
				okrug: 'САО',
				type: 'Основная сцена',
				venue_space_short_name: 'Основной',
				commercial_capacity: 157,
				inconvenient_seats: 0,
				total_capacity: 157,
				venue_space_id: 'tickets.mos.ru_215952',
				photo: '7722284474_47'
			}
		],
		hr: [
			{
				full_name: 'ГРИШУНИН  Глеб Павлович',
				position: 'директор ',
				photo: null
			},
			{
				full_name: 'ПАНКОВ Владимир Николаевич',
				position: 'художественный руководитель',
				photo: null
			}
		],
		maps_link: 'https://yandex.ru/maps/-/CHCU5-9f',
		yandex_ratings_count: 548,
		yandex_reviews_count: 213,
		yandex_rating: 4.4
	},
	{
		id: 7702078561,
		name: 'ГБУК г.Москвы "Театр Музыки и Поэзии п/р Е.Камбуровой"',
		address: '119435, город Москва, Большая Пироговская ул., д.53/55 ',
		capacity: 189.0,
		audience_thousands: 14.0,
		occupancy_percent: 92.0,
		ticket_price_rub: 2291.0,
		photo: '7709018353_54',
		productions: [],
		spaces: [
			{
				id: 128,
				district: 'Хамовники',
				okrug: 'ЦАО',
				type: 'Малая сцена',
				venue_space_short_name: 'Малый зал',
				commercial_capacity: 50,
				inconvenient_seats: 0,
				total_capacity: 50,
				venue_space_id: 'ticketland_19268',
				photo: '7702078561_128'
			},
			{
				id: 129,
				district: 'Хамовники',
				okrug: 'ЦАО',
				type: 'Основная сцена',
				venue_space_short_name: 'Новый зал',
				commercial_capacity: 97,
				inconvenient_seats: 0,
				total_capacity: 97,
				venue_space_id: 'ticketland_46833',
				photo: '7702078561_129'
			},
			{
				id: 130,
				district: 'Хамовники',
				okrug: 'ЦАО',
				type: 'Малая сцена',
				venue_space_short_name: 'Большой зал',
				commercial_capacity: 70,
				inconvenient_seats: 0,
				total_capacity: 70,
				venue_space_id: 'tickets.mos.ru_216008',
				photo: '7702078561_130'
			}
		],
		hr: [
			{
				full_name: 'КАМБУРОВА Елена Антоновна ',
				position: 'художественный руководитель',
				photo: null
			}
		],
		maps_link: 'https://yandex.ru/maps/-/CHCUBVyM',
		yandex_ratings_count: 1465,
		yandex_reviews_count: 570,
		yandex_rating: 4.8
	},
	{
		id: 7706089941,
		name: 'ГБУК г. Москвы "Московский театр Эстрады"',
		address: '119072, город Москва, Берсеневская наб., д.20/2 ',
		capacity: 1312.0,
		audience_thousands: 14.6,
		occupancy_percent: 96.25,
		ticket_price_rub: 2513.3225,
		photo: '7709018353_55',
		productions: [],
		spaces: [
			{
				id: 102,
				district: 'Якиманка',
				okrug: 'ЦАО',
				type: 'Основная сцена',
				venue_space_short_name: 'Большой зал',
				commercial_capacity: 952,
				inconvenient_seats: 48,
				total_capacity: 1000,
				venue_space_id: 'afisha.tickets_145385',
				photo: '7706089941_102'
			}
		],
		hr: [
			{
				full_name: 'ХАЗАНОВ Геннадий Викторович',
				position: 'художественный руководитель ',
				photo: null
			}
		],
		maps_link: 'https://yandex.ru/maps/-/CHCUBPpJ',
		yandex_ratings_count: 3939,
		yandex_reviews_count: 1419,
		yandex_rating: 4.9
	},
	{
		id: 7709264045,
		name: 'ГБУК г. Москвы "МД "Сказочный театр"',
		address: '109004, город Москва, Большой Факельный пер., д. 18 стр. 2 ',
		capacity: 102.0,
		audience_thousands: 12.7,
		occupancy_percent: 63.5,
		ticket_price_rub: 1185.0833333333333,
		photo: '7709018353_56',
		productions: [],
		spaces: [
			{
				id: 141,
				district: 'Таганский',
				okrug: 'ЦАО',
				type: 'Основная сцена',
				venue_space_short_name: 'Основная сцена',
				commercial_capacity: 102,
				inconvenient_seats: 0,
				total_capacity: 102,
				venue_space_id: 'ticketland_84210',
				photo: '7709264045_141'
			}
		],
		hr: [
			{
				full_name: 'МИЛЕНИНА Ирина Петровна',
				position: 'художественный руководитель',
				photo: null
			}
		],
		maps_link: 'https://yandex.ru/maps/-/CHCUFQ4N',
		yandex_ratings_count: 1077,
		yandex_reviews_count: 670,
		yandex_rating: 4.9
	},
	{
		id: 7702069567,
		name: 'ГБУК г. Москвы "РДТ "ГЛАС"',
		address: '111250, город Москва, ул. Лефортовский Вал, д. 26 ',
		capacity: 70.0,
		audience_thousands: 9.2,
		occupancy_percent: 72.26,
		ticket_price_rub: 1013.0,
		photo: '7709018353_57',
		productions: [],
		spaces: [
			{
				id: 21,
				district: 'Замоскворечье',
				okrug: 'ЦАО',
				type: 'Основная сцена',
				venue_space_short_name: 'Основная сцена',
				commercial_capacity: 77,
				inconvenient_seats: 0,
				total_capacity: 77,
				venue_space_id: 'afisha.tickets_144375',
				photo: '7702069567_21'
			}
		],
		hr: [
			{
				full_name: 'АСТАХОВ Никита Сергеевич',
				position: 'художественный руководитель',
				photo: null
			},
			{
				full_name: 'БЕЛЕВИЧ Татьяна Георгиевна',
				position: 'директор',
				photo: null
			}
		],
		maps_link: 'https://yandex.ru/maps/-/CHCUF07K',
		yandex_ratings_count: 832,
		yandex_reviews_count: 434,
		yandex_rating: 4.7
	},
	{
		id: 7708107804,
		name: 'ГБУК г.Москвы "МТДК "Волшебная лампа"',
		address: '127030, город Москва, Сущёвская ул, д. 25 стр. 5 ',
		capacity: 90.0,
		audience_thousands: 8.1,
		occupancy_percent: 50.0,
		ticket_price_rub: 1509.1666666666667,
		photo: '7709018353_58',
		productions: [],
		spaces: [
			{
				id: 12,
				district: 'Тверской',
				okrug: 'ЦАО',
				type: 'Основная сцена',
				venue_space_short_name: 'Основная сцена',
				commercial_capacity: 90,
				inconvenient_seats: 0,
				total_capacity: 90,
				venue_space_id: 'tickets.mos.ru_215987',
				photo: '7708107804_12'
			}
		],
		hr: [],
		maps_link: 'https://yandex.ru/maps/-/CHCUJI0U',
		yandex_ratings_count: 528,
		yandex_reviews_count: 263,
		yandex_rating: 4.6
	},
	{
		id: 7728039292,
		name: 'ГБУК г. Москвы МДТ "Бенефис"',
		address: '117335, город Москва, ул. Гарибальди, д.23 к.4 ',
		capacity: 100.0,
		audience_thousands: 7.9,
		occupancy_percent: 72.69,
		ticket_price_rub: 620.8333333333334,
		photo: '7709018353_59',
		productions: [],
		spaces: [
			{
				id: 20,
				district: 'Черемушки',
				okrug: 'ЮЗАО',
				type: 'Основная сцена',
				venue_space_short_name: 'Основная сцена',
				commercial_capacity: 100,
				inconvenient_seats: 0,
				total_capacity: 100,
				venue_space_id: 'ticketland_105668',
				photo: '7728039292_20'
			}
		],
		hr: [
			{
				full_name: 'НЕРОВНАЯ Анна Михайловна',
				position: 'художественный руководитель',
				photo: null
			}
		],
		maps_link: 'https://yandex.ru/maps/-/CHCUJ68x',
		yandex_ratings_count: 840,
		yandex_reviews_count: 350,
		yandex_rating: 4.5
	},
	{
		id: 7703014835,
		name: 'ГБУК "Московский театр "На досках"',
		address: '127051, город Москва, 2-Й Колобовский пер., д. 9/2 стр. 4 ',
		capacity: 148.0,
		audience_thousands: 7.8,
		occupancy_percent: 87.0,
		ticket_price_rub: 425.0,
		photo: '7709018353_60',
		productions: [],
		spaces: [
			{
				id: 33,
				district: 'Тверской',
				okrug: 'ЦАО',
				type: 'Основная сцена',
				venue_space_short_name: 'Основная сцена',
				commercial_capacity: 148,
				inconvenient_seats: 0,
				total_capacity: 148,
				venue_space_id: 'tickets.mos.ru_202265',
				photo: '7703014835_33'
			}
		],
		hr: [
			{
				full_name: 'НЕСМЕЛОВА Наталия Михайловна',
				position: 'директор',
				photo: null
			}
		],
		maps_link: 'https://yandex.ru/maps/-/CHCUJTMI',
		yandex_ratings_count: 536,
		yandex_reviews_count: 264,
		yandex_rating: 4.4
	},
	{
		id: 7701020760,
		name: 'ГБУК "МТК "Жар-птица"',
		address: '107014, город Москва, ул. Стромынка, д.3 ',
		capacity: 169.0,
		audience_thousands: 5.25,
		occupancy_percent: 75.0,
		ticket_price_rub: 575.0,
		photo: '7709018353_61',
		productions: [],
		spaces: [
			{
				id: 11,
				district: 'Сокольники',
				okrug: 'ВАО',
				type: 'Основная сцена',
				venue_space_short_name: 'Основная сцена',
				commercial_capacity: 154,
				inconvenient_seats: 0,
				total_capacity: 154,
				venue_space_id: 'tickets.mos.ru_216270',
				photo: '7701020760_11'
			}
		],
		hr: [
			{
				full_name: 'НЕРУШ Людмила Викторовна',
				position: 'директор',
				photo: null
			}
		],
		maps_link: 'https://yandex.ru/maps/-/CHCUNNi5',
		yandex_ratings_count: 388,
		yandex_reviews_count: 159,
		yandex_rating: 4.4
	},
	{
		id: 7703127934,
		name: 'ГБУК г. Москвы "Московский драматический театр "Человек"',
		address: '121069, город Москва, Скатертный пер, д. 23 стр. 3 ',
		capacity: 88.0,
		audience_thousands: 5.7,
		occupancy_percent: 99.9,
		ticket_price_rub: 1146.0616666666667,
		photo: '7709018353_62',
		productions: [],
		spaces: [
			{
				id: 22,
				district: 'Пресненский',
				okrug: 'ЦАО',
				type: 'Основная сцена',
				venue_space_short_name: 'Основная сцена',
				commercial_capacity: 49,
				inconvenient_seats: 0,
				total_capacity: 49,
				venue_space_id: 'afisha.tickets_134883',
				photo: '7703127934_22'
			}
		],
		hr: [
			{
				full_name: 'МЕСХИШВИЛИ Владимир Георгиевич ',
				position: 'директор',
				photo: null
			}
		],
		maps_link: 'https://yandex.ru/maps/-/CHCUNDZk',
		yandex_ratings_count: 415,
		yandex_reviews_count: 176,
		yandex_rating: 4.4
	},
	{
		id: 7704224472,
		name: 'ГБУК г. Москвы ДДТ "На набережной"',
		address: '119270, город Москва, Фрунзенская наб., д.48 ',
		capacity: 90.0,
		audience_thousands: 3.1,
		occupancy_percent: 55.94,
		ticket_price_rub: 1000.0,
		photo: '7709018353_63',
		productions: [],
		spaces: [
			{
				id: 108,
				district: 'Хамовники',
				okrug: 'ЦАО',
				type: 'Малая сцена',
				venue_space_short_name: 'Родная сцена',
				commercial_capacity: 40,
				inconvenient_seats: 0,
				total_capacity: 40,
				venue_space_id: 'afisha.tickets_134595',
				photo: '7704224472_108'
			},
			{
				id: 109,
				district: 'Хамовники',
				okrug: 'ЦАО',
				type: 'Основная сцена',
				venue_space_short_name: 'Новая сцена',
				commercial_capacity: 50,
				inconvenient_seats: 0,
				total_capacity: 50,
				venue_space_id: 'afisha.tickets_32',
				photo: '7704224472_109'
			}
		],
		hr: [
			{
				full_name: 'СУХОВ Федор Владимирович',
				position: 'художественный руководитель ',
				photo: null
			}
		],
		maps_link: 'https://yandex.ru/maps/-/CHCURI1J',
		yandex_ratings_count: 262,
		yandex_reviews_count: 87,
		yandex_rating: 4.4
	}
];
