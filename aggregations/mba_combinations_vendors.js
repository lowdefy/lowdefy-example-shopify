db.getCollection("mba_basket").aggregate(

	// Pipeline
	[
		// Stage 1
		{
			$project: {
			    '1': '$vendors',
			    '2': '$vendors'
			    
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
			    '_id.1': { $ne: 'vendor-unknown' },
			    '_id.2': { $ne: 'vendor-unknown' },   
			}
		},

		// Stage 8
		{
			$match: {
			    $expr: { $gte: ['$_id.1', '$_id.2'] }
			}
		},

		// Stage 9
		{
			$project: {
			    _id: 0,
			    1: '$_id.1',
			    2: '$_id.2',
			    count: 1  
			}
		},

		// Stage 10
		{
			$out: "mba_combinations_vendors"
		},

	]

	// Created with Studio 3T, the IDE for MongoDB - https://studio3t.com/

);
