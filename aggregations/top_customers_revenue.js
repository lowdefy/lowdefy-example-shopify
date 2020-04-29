db.getCollection("orders").aggregate(

	// Pipeline
	[
		// Stage 1
		{
			$group: {
			    _id: '$email',
			    count: { $sum: 1 },
			    total_revenue: {$sum: {$toDouble: '$subtotal_price' }}
			}
		},

		// Stage 2
		{
			$sort: {
			  total_revenue: -1    
			}
		},

		// Stage 3
		{
			$limit: 200
		},

		// Stage 4
		{
			$addFields: {
			    // enter query here
			    total_revenue: { $round: ['$total_revenue', 2] } 
			}
		},

	]

	// Created with Studio 3T, the IDE for MongoDB - https://studio3t.com/

);
