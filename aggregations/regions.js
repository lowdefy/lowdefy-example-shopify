// Stages that have been excluded from the aggregation pipeline query
__3tsoftwarelabs_disabled_aggregation_stages = [

	{
		// Stage 2 - excluded
		stage: 2,  source: {
			$limit: 200
		}
	},
]

db.getCollection("orders").aggregate(

	// Pipeline
	[
		// Stage 1
		{
			$sort: {
			    // enter query here
			    created_at_date: -1
			}
		},

		// Stage 3
		{
			$group: {
			    _id: { 'province': '$billing_address.province','country': '$billing_address.country' },
			    total_orders: { $sum: 1 },
			    total_revenue: { $sum: { $toDouble: '$total_price' } },
			    total_customers: { $addToSet: '$email' },
			}
		},

		// Stage 4
		{
			$project: {
			    _id: 0,
			    province: '$_id.province',
			    country: '$_id.country',
			    total_orders: 1,
			    total_revenue: 1,
			    total_customers: { $size: '$total_customers' },
			    
			}
		},

		// Stage 5
		{
			$sort: {
			   total_orders: -1
			    
			}
		},

	]

	// Created with Studio 3T, the IDE for MongoDB - https://studio3t.com/

);
