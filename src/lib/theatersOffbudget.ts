// Auto-generated on 2025-08-08T13:30:00.000Z
export const theatersOffbudget = [
	{
		/** ИНН / ID театра */
		id: 7703035553,

		years: [
			{
				/* ===== 2024 год ===== */
				year: 2024,

				/** Суммарный внебюджет (₽) */
				total: 542_000_000,

				/** Детализация источников внебюджета */
				breakdown: {
					/** Билеты */
					tickets: {
						value: 496_900_000, // ₽
						share: 0.92, // доля от total
						avgShare: 0.79 // среднее по отрасли
					},

					/** Гастроли */
					touring: {
						value: 11_800_000, // ₽
						share: 0.022,
						avgShare: 0.034
					},

					/** Собственность (аренда, услуги и т.п.) */
					property: {
						value: 13_200_000, // ₽
						share: 0.024,
						avgShare: 0.047
					},

					/** Реклама и прочее */
					advertising: {
						value: 4_500_000, // ₽
						share: 0.008,
						avgShare: 0.007
					}
				}
			}

			/* ===== добавьте 2025+ по мере появления данных =====
      {
        year: 2025,
        total: ...,
        breakdown: {
          tickets: { value: ..., share: ..., avgShare: ... },
          touring: { value: ..., share: ..., avgShare: ... },
          property:{ value: ..., share: ..., avgShare: ... },
          advertising:{ value: ..., share: ..., avgShare: ... }
        }
      }
      */
		]
	}

	/* ➟ другие театры — тот же формат */
];
