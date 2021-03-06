db.getCollection("mba_basket").aggregate(

	// Pipeline
	[
		// Stage 1
		{
			$project: {
			    '1': '$types',
			    '2': '$types'
			    
			}
		},

		// Stage 2
		{
			$unwind: {
			    path: '$1',
			    includeArrayIndex : "index",
			}
		},

		// Stage 3
		{
			$addFields: {
			    "2": { $setUnion: [ {
			        $concatArrays: [
			            { $slice: [ '$2',  '$index' ] },
			            { $slice: [ '$2', { $add: ['$index', 1] }, 99 ] },
			        ]
			    }, [] ] }
			}
		},

		// Stage 4
		{
			$unwind: {
			    path: '$2'
			}
		},

		// Stage 5
		{
			$group: {
			    _id: {'1': '$1', '2': '$2'},
			    count: { $sum: 1 },
			}
		},

		// Stage 6
		{
			$match: {
			    '_id.1': { $ne: null },
			    '_id.2': { $ne: null }, 
			    
			}
		},

		// Stage 7
		{
			$match: {
			    $expr: { $gte: ['$_id.1', '$_id.2'] }
			}
		},

		// Stage 8
		{
			$project: {
			    _id: 0,
			    '1': '$_id.1',
			    '2': '$_id.2',
			    count: 1  
			}
		},

		// Stage 9
		{
			$out: "mba_combinations_types"
		},

	]

	// Created with Studio 3T, the IDE for MongoDB - https://studio3t.com/

);
