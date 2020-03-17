// Stages that have been excluded from the aggregation pipeline query
__3tsoftwarelabs_disabled_aggregation_stages = [

	{
		// Stage 1 - excluded
		stage: 1,  source: {
			$sort: {
			    // enter query here
			    created_at_date: -1
			}
		}
	},

	{
		// Stage 2 - excluded
		stage: 2,  source: {
			$limit: 1000
		}
	},
]

db.getCollection("orders").aggregate(

	// Pipeline
	[
		// Stage 3
		{
			$addFields: {
			    paid: { $eq: [ '$financial_status', 'paid' ] },
			    pending: { $eq: [ '$financial_status', 'pending' ] },
			    voided: { $eq: [ '$financial_status', 'voided' ] },
			    partially_refunded: { $eq: [ '$financial_status', 'partially_refunded' ] },
			}
		},

		// Stage 4
		{
			$group: {
			    _id: { $dateFromParts: { year: { $year: '$created_at_date' }, month: { $month: '$created_at_date' } } },
			    paid_orders: { $sum: { $cond: [ '$paid', 1, 0 ] } },
			    paid_revenue: { $sum: { $cond: [ '$paid', { $toDouble: '$total_price' }, 0 ] } },
			    paid_customers: { $addToSet: { $cond: [ '$paid', '$email', '$$REMOVE' ] } },
			
			    pending_orders: { $sum: { $cond: [ '$pending', 1, 0 ] } },
			    pending_revenue: { $sum: { $cond: [ '$pending', { $toDouble: '$total_price' }, 0 ] } },
			    pending_customers: { $addToSet: { $cond: [ '$pending', '$email', '$$REMOVE' ] } },
			
			    voided_orders: { $sum: { $cond: [ '$voided', 1, 0 ] } },
			    pending_revenue: { $sum: { $cond: [ '$voided', { $toDouble: '$total_price' }, 0 ] } },
			    voided_customers: { $addToSet: { $cond: [ '$voided', '$email', '$$REMOVE' ] } },
			
			    partially_refunded_orders: { $sum: { $cond: [ '$partially_refunded', 1, 0 ] } },
			    partially_refunded_revenue: { $sum: { $cond: [ '$partially_refunded', { $toDouble: '$total_price' }, 0 ] } },
			    partially_refunded_customers: { $addToSet: { $cond: [ '$partially_refunded', '$email', '$$REMOVE' ] } },
			}
		},

		// Stage 5
		{
			$addFields: {
			    month: '$_id',
			    paid_customers: { $size: '$paid_customers' },
			    pending_customers: { $size: '$pending_customers' },
			    voided_customers: { $size: '$voided_customers' },
			    partially_refunded_customers: { $size: '$partially_refunded_customers' },
			    
			}
		},

		// Stage 6
		{
			$project: {
			    _id: 0 
			}
		},

		// Stage 7
		{
			$sort: {
			   month: 1
			    
			}
		},

	]

	// Created with Studio 3T, the IDE for MongoDB - https://studio3t.com/

);
