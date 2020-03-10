db.getCollection("api_calls").aggregate(

	// Pipeline
	[
		// Stage 1
		{
			$sort: {
			    timestamp: -1
			}
		},

		// Stage 2
		{
			$limit: 1
		},

		// Stage 3
		{
			$project: {
			    _id: 0,
			    timestamp: 1,
			    initial: { $literal: false },
			    page_info: { $regexFind: {
			            input: '$headers.link',
			            regex: "<https:\/\/.*\.com\/admin\/api\/2020-01\/orders\.json\?limit=.*&page_info=(.*)>; rel=\"next\""
			         }
			    },
			}
		},

		// Stage 4
		{
			$addFields: {
			    "page_info": { $arrayElemAt: ['$page_info.captures', 0] }
			}
		},

		// Stage 5
		{
			$lookup: {
			    from: "orders",
			    let: {  },
			    pipeline: [
			       {
			           $group: {
			               _id: 0,
			               max_id: { $max: '$_id' }
			           }
			       }
			    ],
			    as: "orders"
			}
		},

		// Stage 6
		{
			$unwind: {
			    path : "$orders",
			    preserveNullAndEmptyArrays : true 
			}
		},

		// Stage 7
		{
			$project: {
			    last_fetched: { $dateToString: { date: '$timestamp' } },
			    initial: 1,
			    page_info: 1,
			    max_id: { $ifNull: [ '$orders.max_id', 1 ] },
			    "page":
			        { $and: [
			     { $not: [ '$initial' ] },
			     { $ne: [ '$page_info', null ] }
			     ]}  
			}
		},

	]

	// Created with Studio 3T, the IDE for MongoDB - https://studio3t.com/

);
