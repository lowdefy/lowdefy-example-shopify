db.getCollection("orders").aggregate(

	// Pipeline
	[
		// Stage 1
		{
			$group: {
			    _id: '$email',
			    count: {$sum: 1}
			    
			}
		},

		// Stage 2
		{
			$group: {
			    _id: '$count',
			    count: {$sum: 1}
			}
		},

		// Stage 3
		{
			$sort: {
			_id: 1
			    
			}
		},

		// Stage 4
		{
			$group: {
			    _id: 0,
			    data: { $push: { visits: '$_id', count: '$count' } },
			    max_visits: { $max: '$_id' }
			}
		},

		// Stage 5
		{
			$addFields: {
			    "number_visits": { $range: [ 1, { $add: [ 1, '$max_visits' ] } ] }
			}
		},

		// Stage 6
		{
			$unwind: {
			    path : "$number_visits",
			}
		},

		// Stage 7
		{
			$addFields: {
			    index: { $indexOfArray: [ '$data.visits', '$number_visits' ] }
			}
		},

		// Stage 8
		{
			$project: {
			    // specifications
			    _id: 0,
			    number_visits: 1,
			    count: { $cond: [ { $eq: [ '$index', -1 ] }, 0, { $arrayElemAt: [ '$data.count', '$index' ] } ] }
			}
		},

	]

	// Created with Studio 3T, the IDE for MongoDB - https://studio3t.com/

);
