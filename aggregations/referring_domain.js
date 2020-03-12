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
			$limit: 200
		}
	},
]

db.getCollection("orders").aggregate(

	// Pipeline
	[
		// Stage 3
		{
			$project: {
			    "referring_domain": { $regexFind: {
			           input: '$referring_site',
			           regex: 'https:\/\/(.*?)\/'
			    } },
			//landing_site: 1
			}
		},

		// Stage 4
		{
			$addFields: {
			    "referring_domain": { $arrayElemAt: ['$referring_domain.captures', 0] }
			}
		},

		// Stage 5
		{
			$addFields: {
			    'referring_domain': { $cond: [ 
			        { $regexMatch:  {
			            input: '$referring_domain',
			            regex: 'google'
			        }
			             },
			         'google',
			        '$referring_domain' 
			        
			        
			         ]  }
			    
			}
		},

		// Stage 6
		{
			$group: {
			    _id: '$referring_domain',
			    count: { $sum: 1 }
			}
		},

		// Stage 7
		{
			$project: {
			    _id: 0,
			    referring_domain: { $ifNull: [ '$_id', 'None' ] },
			    count: 1
			    
			}
		},

		// Stage 8
		{
			$sort: {
			   count: -1
			    
			}
		},

	]

	// Created with Studio 3T, the IDE for MongoDB - https://studio3t.com/

);
