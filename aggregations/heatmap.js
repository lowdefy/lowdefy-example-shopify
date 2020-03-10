// Stages that have been excluded from the aggregation pipeline query
__3tsoftwarelabs_disabled_aggregation_stages = [

	{
		// Stage 1 - excluded
		stage: 1,  source: {
			$match: {
			  
			  $expr: { $gte: [ '$created_at_date', ISODate("2018-10-01T00:00:00.000+0000") ] } 
			}
		}
	},
]

db.getCollection("orders").aggregate(

	// Pipeline
	[
		// Stage 2
		{
			$group: {
			    _id: { day: { $dayOfWeek: '$created_at_date'  }, hour: { $hour: '$created_at_date' } },
			    count: { $sum: 1 },
			    revenue: { $sum: { $toDouble: '$total_price' } }
			    
			}
		},

		// Stage 3
		{
			$project: {
			    _id: 0,
			    day: '$_id.day',
			    hour: '$_id.hour',
			    count: 1,
			    revenue: 1,  
			}
		},

		// Stage 4
		{
			$group: {
			    _id: 0,
			    day: { $addToSet : '$day' },
			    hour: { $addToSet : '$hour' },
			    data: { $push: '$$ROOT' }
			}
		},

		// Stage 5
		{
			$unwind: {
			    path : "$day",
			}
		},

		// Stage 6
		{
			$unwind: {
			    path : "$hour",
			}
		},

		// Stage 7
		{
			$addFields: {
			    data: { $ifNull: [ { $arrayElemAt: [ { $filter: {
			        input: '$data',
			        cond: {  $and: [ { $eq: [ '$$this.day', '$day' ] }, { $eq: [ '$$this.hour', '$hour' ] } ]  } 
			    } }, 0 ] }, 
			    
			  
			   {
			       day: '$day',
			        hour: '$hour',
			        count: 0,
			        revenue: 0,  
			   }
			   
			   ] }
			}
		},

		// Stage 8
		{
			$replaceRoot: {
			    newRoot: '$data'
			}
		},

		// Stage 9
		{
			$sort: {
			    day: 1,
			    hour: 1
			}
		},

	]

	// Created with Studio 3T, the IDE for MongoDB - https://studio3t.com/

);
