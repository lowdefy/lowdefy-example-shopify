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

	{
		// Stage 3 - excluded
		stage: 3,  source: {
			$match: {
			    // enter query here
			    _id: 2031829221425
			}
		}
	},
]

db.getCollection("orders").aggregate(

	// Pipeline
	[
		// Stage 4
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
			        
			         ]  },
			 
			     "referring_domain": { $regexFind: {
			           input: '$referring_site',
			           regex: 'https:\/\/(.*?)\/'
			    } },
			    
			}
		},

		// Stage 5
		{
			$project: {
			    "landing_site_path": { $regexFind: {
			           input: '$landing_site',
			           regex: '(\/.*?)\?'
			    } },
			    "referring_domain": { $arrayElemAt: ['$referring_domain.captures', 0] }
			}
		},

		// Stage 6
		{
			$addFields: {
			    "landing_site_path": { $arrayElemAt: ['$landing_site_path.captures', 0] },
			    'referring_domain': { $cond: [ 
			        { $regexMatch:  {
			            input: '$referring_domain',
			            regex: 'google'
			        }
			             },
			         'Google',
			        '$referring_domain'         
			         ]  }
			}
		},

		// Stage 7
		{
			$addFields: {
			    "landing_site_path": 
			    {
			          $cond: [
			            { $eq: [ '$landing_site_path', null ] },
			            'None',
			             { $concat: [ '/', { $arrayElemAt: [{ $split: [ '$landing_site_path', '/' ] }, 1] } ] },
			          ]
			    }
			    
			}
		},

		// Stage 8
		{
			$group: {
			    _id: { referring_domain: '$referring_domain', landing_site_path: '$landing_site_path' },
			    count: { $sum: 1 }
			}
		},

		// Stage 9
		{
			$project: {
			    _id: 0,
			    referring_domain: { $ifNull: [ '$_id.referring_domain', 'None' ] },
			    landing_site_path: { $ifNull: [ '$_id.landing_site_path', '/' ] },
			    count: 1
			    
			}
		},

		// Stage 10
		{
			$sort: {
			   count: -1
			    
			}
		},

		// Stage 11
		{
			$limit: 100
		},

	]

	// Created with Studio 3T, the IDE for MongoDB - https://studio3t.com/

);
