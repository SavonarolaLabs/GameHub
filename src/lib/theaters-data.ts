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
	venues: {
		name: string;
		seats: number;
		expanded?: boolean;
	}[];
	shows: {
		title: string;
		description: string;
		ageLimit: string;
		category: string;
	}[];
}

export const theaters: Theater[] = [
	{
		id: 1,
		name: 'Театр Моссовета',
		fullName: 'Государственный академический театр имени Моссовета',
		description:
			'Драматический театр в Москве, отмеченный орденами Ленина и Трудового Красного Знамени. Основан в 1923 году литератором и режиссёром Сергеем Прокофьевым как театр рабочих Московского губернского совета профессиональных союзов',
		rating: 5.0,
		reviews: 21784,
		scores: 7048,
		director: 'Алексей Черепнев',
		artisticDirector: 'Евгений Марчелли',
		genre: 'Драма',
		address: 'Большая Садовая улица, 16с1, Москва, 125047',
		imageUrl: '/api/placeholder/400/300',
		renovation: 'planned',
		venues: [
			{ name: 'Основная сцена', seats: 894, expanded: true },
			{ name: 'Малая сцена', seats: 120 }
		],
		shows: [
			{
				title: 'ЖЕНИТЬБА',
				description: 'Николай Гоголь. Совершенно Невероятное Событие В Двух Действиях 16+',
				ageLimit: '16+',
				category: 'Комедия'
			},
			{
				title: '8 ЛЮБЯЩИХ ЖЕНЩИН',
				description: 'Робер Тома. Психологический Абсурд Нуарный С Элементами Черной Комедии 16+',
				ageLimit: '16+',
				category: 'Драма'
			},
			{
				title: 'БЕСПРИДНИЧИЦА',
				description: 'Александр Островский. Драма 16+',
				ageLimit: '16+',
				category: 'Драма'
			},
			{
				title: 'БРЕМЕНСКИЕ МУЗЫКАНТЫ',
				description: 'Василий Ливанов, Юрий Энтин. Сказка. Мюзикальная Сказка В 2-Х Действиях 6+',
				ageLimit: '6+',
				category: 'Мюзикл'
			},
			{
				title: 'ВИШНЁВЫЙ САД',
				description: 'Антон Чехов. Комедия 16+',
				ageLimit: '16+',
				category: 'Комедия'
			},
			{
				title: 'ВОЛКИ И ОВЦЫ',
				description: 'Александр Островский. Комедия В 5-Ти Действиях 12+',
				ageLimit: '12+',
				category: 'Комедия'
			}
		]
	},
	{
		id: 2,
		name: 'МХАТ им. Чехова',
		fullName: 'Московский Художественный Академический Театр им. А.П. Чехова',
		description:
			'Легендарный театр русской драматургии, основанный К.С. Станиславским и Вл.И. Немировичем-Данченко в 1898 году',
		rating: 4.9,
		reviews: 18500,
		scores: 6200,
		director: 'Константин Богомолов',
		artisticDirector: 'Олег Табаков',
		genre: 'Драма',
		address: 'Камергерский пер., 3, Москва',
		imageUrl: '/api/placeholder/400/300',
		renovation: 'not_planned',
		venues: [
			{ name: 'Основная сцена', seats: 1200 },
			{ name: 'Малая сцена', seats: 300 }
		],
		shows: [
			{
				title: 'ЧАЙКА',
				description: 'А.П. Чехов. Комедия в четырех действиях 16+',
				ageLimit: '16+',
				category: 'Драма'
			},
			{
				title: 'ТРИ СЕСТРЫ',
				description: 'А.П. Чехов. Драма в четырех действиях 16+',
				ageLimit: '16+',
				category: 'Драма'
			}
		]
	},
	{
		id: 3,
		name: 'Театр Вахтангова',
		fullName: 'Государственный Академический Театр им. Евг. Вахтангова',
		description: 'Театр с уникальной актерской школой, основанный учеником Станиславского',
		rating: 4.8,
		reviews: 15300,
		scores: 5100,
		director: 'Римас Туминас',
		artisticDirector: 'Кирилл Крок',
		genre: 'Драма',
		address: 'ул. Арбат, 26, Москва',
		imageUrl: '/api/placeholder/400/300',
		renovation: 'unsatisfactory',
		venues: [
			{ name: 'Основная сцена', seats: 1050 },
			{ name: 'Малая сцена', seats: 200 }
		],
		shows: [
			{
				title: 'ЕВГЕНИЙ ОНЕГИН',
				description: 'А.С. Пушкин. Роман в стихах 12+',
				ageLimit: '12+',
				category: 'Драма'
			}
		]
	}
];
