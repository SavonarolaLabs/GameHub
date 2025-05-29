export interface Theater {
	id: number;
	name: string;
	fullName: string;
	description: string;
	rating: number;
	reviews: number;
	scores: number;
	director: string;
	artisticDirector: string;
	genre: string;
	address: string;
	imageUrl: string;
	renovation: 'planned' | 'not_planned' | 'unsatisfactory';
	venues: { name: string; seats: number; expanded?: boolean }[];
	shows: { title: string; description: string; ageLimit: string; category: string }[];
}

export const theaters: Theater[] = [
	{
		id: 1,
		name: 'Театр Моссовета',
		fullName: 'Государственный академический театр имени Моссовета',
		description:
			'Один из старейших драматических театров столицы, основан в 1923 году и славится классическим репертуаром.',
		rating: 5.0,
		reviews: 21784,
		scores: 7048,
		director: 'Алексей Черепнев',
		artisticDirector: 'Евгений Марчелли',
		genre: 'Драма',
		address: 'Большая Садовая ул., 16с1, Москва',
		imageUrl:
			'https://upload.wikimedia.org/wikipedia/commons/9/95/Mossovet_Theatre_Moscow_%282%29.jpg',
		renovation: 'planned',
		venues: [
			{ name: 'Основная сцена', seats: 894, expanded: true },
			{ name: 'Малая сцена', seats: 120 }
		],
		shows: [
			{
				title: 'Женитьба',
				description: 'Н. Гоголь. Совершенно невероятное событие в двух действиях',
				ageLimit: '16+',
				category: 'Комедия'
			},
			{
				title: 'Вишнёвый сад',
				description: 'А. Чехов. Комедия',
				ageLimit: '16+',
				category: 'Комедия'
			}
		]
	},
	{
		id: 2,
		name: 'Московский театр оперетты',
		fullName: 'Государственный академический театр «Московская оперетта»',
		description:
			'Главная музыкальная сцена страны для жанров оперетты и мюзикла, открыта в 1927 году.',
		rating: 4.9,
		reviews: 18500,
		scores: 6200,
		director: 'Владимир Тартаковский',
		artisticDirector: 'Владимир Назаров',
		genre: 'Мюзикл',
		address: 'ул. Большая Дмитровка, 6, Москва',
		imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop',
		renovation: 'not_planned',
		venues: [
			{ name: 'Зрительный зал', seats: 1500, expanded: true },
			{ name: 'Камерная сцена', seats: 250 }
		],
		shows: [
			{
				title: 'Анна Каренина',
				description: 'Мюзикл по роману Л. Толстого',
				ageLimit: '12+',
				category: 'Мюзикл'
			}
		]
	},
	{
		id: 3,
		name: 'Театр Вахтангова',
		fullName: 'Государственный академический театр имени Евг. Вахтангова',
		description: 'Театр с уникальной актёрской школой, основан Евгением Вахтанговым в 1921 году.',
		rating: 4.8,
		reviews: 15300,
		scores: 5100,
		director: 'Римас Туминас',
		artisticDirector: 'Кирилл Крок',
		genre: 'Драма',
		address: 'ул. Арбат, 26, Москва',
		imageUrl: 'https://images.unsplash.com/photo-1514306191717-452ec28c7814?w=400&h=300&fit=crop',
		renovation: 'unsatisfactory',
		venues: [
			{ name: 'Основная сцена', seats: 1050, expanded: true },
			{ name: 'Новая сцена', seats: 240 }
		],
		shows: [
			{
				title: 'Евгений Онегин',
				description: 'Пушкин. Роман в стихах',
				ageLimit: '12+',
				category: 'Драма'
			}
		]
	},
	{
		id: 4,
		name: 'Большой театр',
		fullName: 'Государственный академический Большой театр России',
		description: 'Всемирно известная сцена оперы и балета, символ российской культуры с 1825 года.',
		rating: 5.0,
		reviews: 40210,
		scores: 9900,
		director: 'Владимир Урин',
		artisticDirector: 'Туган Сохиев',
		genre: 'Опера и балет',
		address: 'Театральная пл., 1, Москва',
		imageUrl: 'https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?w=400&h=300&fit=crop',
		renovation: 'not_planned',
		venues: [
			{ name: 'Историческая сцена', seats: 2000, expanded: true },
			{ name: 'Новая сцена', seats: 1040 }
		],
		shows: [
			{
				title: 'Лебединое озеро',
				description: 'П.И. Чайковский. Балет',
				ageLimit: '6+',
				category: 'Балет'
			},
			{
				title: 'Евгений Онегин',
				description: 'Опера П.И. Чайковского',
				ageLimit: '10+',
				category: 'Опера'
			}
		]
	},
	{
		id: 5,
		name: 'Театр Сатиры',
		fullName: 'Московский академический театр Сатиры',
		description: 'Знаменитая сцена комедии и сатиры на площади Маяковского, работает с 1924 года.',
		rating: 4.7,
		reviews: 14200,
		scores: 4300,
		director: 'Александр Ширвиндт',
		artisticDirector: 'Сергей Газаров',
		genre: 'Комедия',
		address: 'Триумфальная пл., 2, Москва',
		imageUrl: 'https://images.unsplash.com/photo-1582578617635-87d06c32699b?w=400&h=300&fit=crop',
		renovation: 'planned',
		venues: [
			{ name: 'Большая сцена', seats: 986, expanded: true },
			{ name: 'Камерная сцена', seats: 120 }
		],
		shows: [
			{
				title: 'Таможня даёт добро',
				description: 'Современная комедия положений',
				ageLimit: '12+',
				category: 'Комедия'
			}
		]
	},
	{
		id: 6,
		name: 'ЛЕНКОМ Марка Захарова',
		fullName: 'Московский государственный театр «ЛЕНКОМ Марка Захарова»',
		description:
			'Легендарная площадка советского и российского авангарда, открыла сотни ярких премьер.',
		rating: 4.9,
		reviews: 17600,
		scores: 5600,
		director: 'Марина Захарова',
		artisticDirector: 'Марка Захарова',
		genre: 'Драма',
		address: 'ул. Малая Дмитровка, 6, Москва',
		imageUrl: 'https://images.unsplash.com/photo-1544640808-b8697d2cf7c4?w=400&h=300&fit=crop',
		renovation: 'not_planned',
		venues: [
			{ name: 'Основная сцена', seats: 720, expanded: true },
			{ name: 'Малая сцена', seats: 150 }
		],
		shows: [
			{
				title: 'Юнона и Авось',
				description: 'Рок-опера А. Рыбникова',
				ageLimit: '12+',
				category: 'Музыкальная драма'
			}
		]
	},
	{
		id: 7,
		name: 'Современник',
		fullName: 'Московский театр «Современник»',
		description: 'Театр «новой драмы», основанный Олегом Ефремовым в 1956 году.',
		rating: 4.8,
		reviews: 13200,
		scores: 4700,
		director: 'Виктор Рыжаков',
		artisticDirector: 'Марина Райкина',
		genre: 'Драма',
		address: 'ул. Чистопрудный бульвар, 19а, Москва',
		imageUrl: 'https://images.unsplash.com/photo-1529676468690-747e2af9107e?w=400&h=300&fit=crop',
		renovation: 'not_planned',
		venues: [
			{ name: 'Основная сцена', seats: 850, expanded: true },
			{ name: 'Сцена на Чистых прудах', seats: 120 }
		],
		shows: [
			{
				title: 'Три сестры',
				description: 'А. Чехов. Драма',
				ageLimit: '16+',
				category: 'Драма'
			}
		]
	},
	{
		id: 8,
		name: 'Театр Наций',
		fullName: 'Федеральный государственный театр Наций',
		description:
			'Экспериментальная площадка с международными проектами и приглашёнными режиссёрами.',
		rating: 4.8,
		reviews: 9800,
		scores: 3400,
		director: 'Марина Давыдова',
		artisticDirector: 'Евгений Миронов',
		genre: 'Современная драма',
		address: 'ул. Петровка, 3, Москва',
		imageUrl: 'https://images.unsplash.com/photo-1510511453077-9577538faa1c?w=400&h=300&fit=crop',
		renovation: 'not_planned',
		venues: [
			{ name: 'Главная сцена', seats: 580, expanded: true },
			{ name: 'Малая сцена', seats: 120 }
		],
		shows: [
			{
				title: 'Горки-10',
				description: 'Псевдодокументальный спектакль о российской истории',
				ageLimit: '18+',
				category: 'Докудрама'
			}
		]
	},
	{
		id: 9,
		name: 'Театр им. Вл. Маяковского',
		fullName: 'Московский академический театр имени Владимира Маяковского',
		description: 'Классический драматический театр, известный своими смелыми постановками.',
		rating: 4.7,
		reviews: 11200,
		scores: 3900,
		director: 'Миндаугас Карбаускис',
		artisticDirector: 'Юрий Итин',
		genre: 'Драма',
		address: 'ул. Большая Никитская, 19, Москва',
		imageUrl: 'https://images.unsplash.com/photo-1470071459604-3b5ec3e7620e?w=400&h=300&fit=crop',
		renovation: 'unsatisfactory',
		venues: [
			{ name: 'Основная сцена', seats: 967, expanded: true },
			{ name: 'Сцена на Сретенке', seats: 200 }
		],
		shows: [
			{
				title: 'Человек из Ресторана',
				description: 'По И. А. Бунину',
				ageLimit: '14+',
				category: 'Драма'
			}
		]
	},
	{
		id: 10,
		name: 'Театр им. Ермоловой',
		fullName: 'Российский государственный театр имени М. Н. Ермоловой',
		description:
			'Исторический театр в центре Москвы, известен экспериментальными постановками классики.',
		rating: 4.6,
		reviews: 9200,
		scores: 3100,
		director: 'Олег Меньшиков',
		artisticDirector: 'Олег Меньшиков',
		genre: 'Драма',
		address: 'Тверская ул., 5/6, Москва',
		imageUrl: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=400&h=300&fit=crop',
		renovation: 'not_planned',
		venues: [
			{ name: 'Основная сцена', seats: 600, expanded: true },
			{ name: 'Камерная сцена', seats: 100 }
		],
		shows: [
			{
				title: 'Капитанская дочка',
				description: 'А. Пушкин. Историческая драма',
				ageLimit: '12+',
				category: 'История'
			}
		]
	},
	{
		id: 11,
		name: 'Et Cetera',
		fullName: 'Московский театр «Et Cetera»',
		description:
			'Современный театр Александра Калягина, сочетающий классику и смелые эксперименты.',
		rating: 4.7,
		reviews: 8400,
		scores: 2800,
		director: 'Александр Калягин',
		artisticDirector: 'Александр Калягин',
		genre: 'Драма',
		address: 'Фролов пер., 2, Москва',
		imageUrl: 'https://images.unsplash.com/photo-1519789041213-5e4a4f2e8cdc?w=400&h=300&fit=crop',
		renovation: 'not_planned',
		venues: [
			{ name: 'Большая сцена', seats: 620, expanded: true },
			{ name: 'Малая сцена', seats: 120 }
		],
		shows: [
			{
				title: 'Приключения Чиполлино',
				description: 'Семейный музыкальный спектакль',
				ageLimit: '6+',
				category: 'Сказка'
			}
		]
	},
	{
		id: 12,
		name: 'Театр «Ромэн»',
		fullName: 'Московский музыкально-драматический театр «Ромэн»',
		description:
			'Старейший в мире цыганский театр, основанный в 1931 году, хранитель культуры ромов.',
		rating: 4.5,
		reviews: 6400,
		scores: 2100,
		director: 'Николай Сличенко',
		artisticDirector: 'Михаил Романов',
		genre: 'Музыкальная драма',
		address: 'ул. Ленинградский проспект, 32/2, Москва',
		imageUrl: 'https://images.unsplash.com/photo-1503095396549-807759245b35?w=400&h=300&fit=crop',
		renovation: 'planned',
		venues: [
			{ name: 'Основная сцена', seats: 500, expanded: true },
			{ name: 'Камерная сцена', seats: 80 }
		],
		shows: [
			{
				title: 'Цыганские песни',
				description: 'Музыкально-поэтическое представление',
				ageLimit: '6+',
				category: 'Музыкальное шоу'
			}
		]
	}
];
