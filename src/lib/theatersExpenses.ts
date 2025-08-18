// Auto-generated on 2025-08-08T13:05:00.000Z
export const theatersExpenses = [
	{
		id: 7703035553,

		years: [
			{
				/* ===== 2024 год ===== */
				year: 2024,

				/** Суммарные расходы */
				total: 517_000_000, // ₽

				/** Детализация */
				breakdown: {
					fot: {
						value: 269_000_000, // ₽
						share: 0.52, // доля от total (52 %)
						avgShare: 0.45 // среднее по отрасли (45 %)
					},
					royalties: {
						value: 0, // ₽
						share: 0.0, // 0 %
						avgShare: 0.095 // 9,5 % (среднее)
					},
					transport: {
						value: 7_758_814, // ₽
						share: 0.0149, // 0 %
						avgShare: 0.0146 // 9,5 % (среднее)
					},
					gph: {
						value: 1_702_224, // ₽
						share: 0.0329, // 0 %
						avgShare: 0.0523 // 9,5 % (среднее)
					},
					events: {
						value: 0, // ₽
						share: 0.0, // 0 %
						avgShare: 0.0091 // 9,5 % (среднее)
					},

					rent: {
						value: 520_353, // ₽
						share: 0.0, // 0 %
						avgShare: 0.0147 // 9,5 % (среднее)
					}
					/* можете добавить другие статьи — «хозрасходы», «амортизация»… */
				}
			}

			/* ===== 2025, если уже есть данные ===== */
			/*
      {
        year: 2025,
        total: 540_000_000,
        breakdown: {
          fot: { value: 285_000_000, share: 0.53, avgShare: 0.46 },
          royalties: { value: 12_000_000, share: 0.022, avgShare: 0.095 }
        }
      }
      */
		]
	}

	/* ➟ другие театры по тому же шаблону */
];
