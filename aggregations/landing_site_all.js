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
			    'landing_site': { $cond: [ 
			        { $regexMatch:  {
			            input: '$landing_site',
			            regex: '\?'
			        }
			             },
			         
			        '$landing_site' ,
			        { $concat: [ '$landing_site', '?' ] }
			        
			        
			         ]  }
			    
			}
		},

		// Stage 4
		{
			$project: {
			    "landing_site_path": { $regexFind: {
			           input: '$landing_site',
			           regex: '(\/.*?\/?.*?)\?'
			    } },
			landing_site: 1
			}
		},

		// Stage 5
		{
			$addFields: {
			    "landing_site_path": { $arrayElemAt: ['$landing_site_path.captures', 0] }
			}
		},

		// Stage 6
		{
			$group: {
			    _id: '$landing_site_path',
			    count: { $sum: 1 }
			}
		},

		// Stage 7
		{
			$project: {
			    _id: 0,
			    landing_site_path: { $ifNull: [ '$_id', 'None' ] },
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
