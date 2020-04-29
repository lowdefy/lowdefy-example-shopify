db.getCollection("orders").aggregate(

	// Pipeline
	[
		// Stage 1
		{
			$group: {
			    _id: '$email',
			    count: { $sum: 1 }
			}
		},

		// Stage 2
		{
			$sort: {
			  count: -1    
			}
		},

		// Stage 3
		{
			$limit: 100
		},

	]

	// Created with Studio 3T, the IDE for MongoDB - https://studio3t.com/

);
