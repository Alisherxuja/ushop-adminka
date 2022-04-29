export default [
	{
		path: '/report',
		name: 'report',
		props: true,
		meta: {
			title: 'Отчет по продажам'
		},
		component: () => import('../../views/report/index')
	},
	{
		path: '/report-by-products',
		name: 'report-by-products',
		props: true,
		meta: {
			title: 'Отчёт по товарам'
		},
		component: () => import('../../views/report/byProducts')
	},
]
