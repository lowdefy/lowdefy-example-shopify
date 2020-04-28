// Stages that have been excluded from the aggregation pipeline query
__3tsoftwarelabs_disabled_aggregation_stages = [

	{
		// Stage 8 - excluded
		stage: 8,  source: {
			$sort: {
			  count: -1
			}
		}
	},

	{
		// Stage 9 - excluded
		stage: 9,  source: {
			$limit: 100
		}
	},
]

db.getCollection("mba_basket").aggregate(

	// Pipeline
	[
		// Stage 1
		{
			$project: {
			    "types": { $map: {
			      input: '$types',
			      as: 'item',
			      in: {
			          id: '$$item',
			          other: { $filter: {
			             input: '$types',
			             as: 'other',
			             cond: { $ne: [ '$$other', '$$item' ] }
			          } }
			      }
			    } }
			}
		},

		// Stage 2
		{
			$unwind: {
			    path: '$types'
			}
		},

		// Stage 3
		{
			$addFields: {
			    'types.other': { $setUnion: [ '$types.other', [] ] }
			    
			}
		},

		// Stage 4
		{
			$unwind: {
			    path: '$types.other'
			}
		},

		// Stage 5
		{
			$group: {
			    _id: "$types",
			    count: { $sum: 1 },
			}
		},

		// Stage 6
		{
			$match: {
			    '_id.id': { $ne: null },
			    '_id.other': { $ne: null }, 
			    
			}
		},

		// Stage 7
		{
			$match: {
			    $expr: { $gt: ['$_id.id', '$_id.other'] }
			}
		},

		// Stage 10
		{
			$project: {
			    _id: 0,
			    t1: '$_id.id',
			    t2: '$_id.other',
			    count: 1  
			}
		},

		// Stage 11
		{
			$out: "mba_combinations_types"
		},

	]

	// Created with Studio 3T, the IDE for MongoDB - https://studio3t.com/

);
