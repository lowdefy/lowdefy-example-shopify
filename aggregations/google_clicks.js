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
			$addFields: {
			    'gclid': 
			        { $regexMatch:  {
			            input: '$landing_site',
			            regex: 'gclid'
			        }
			        }
			}
		},

		// Stage 4
		{
			$group: {
			    _id: '$gclid',
			    count: { $sum: 1 }
			}
		},

		// Stage 5
		{
			$project: {
			    _id: 0,
			    gclid: '$_id',
			    count: 1
			    
			}
		},

		// Stage 6
		{
			$sort: {
			   count: -1
			    
			}
		},

	]

	// Created with Studio 3T, the IDE for MongoDB - https://studio3t.com/

);
