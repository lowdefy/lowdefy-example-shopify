db.getCollection("mba_basket").aggregate(

	// Pipeline
	[
		// Stage 1
		{
			$project: {
			    "products": { $map: {
			      input: '$products',
			      as: 'item',
			      in: {
			          id: '$$item',
			          other: { $filter: {
			             input: '$products',
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
			    path: '$products'
			}
		},

		// Stage 3
		{
			$unwind: {
			    path: '$products.other'
			}
		},

		// Stage 4
		{
			$group: {
			    _id: "$products",
			    count: { $sum: 1 },
			}
		},

		// Stage 5
		{
			$match: {
			    '_id.id': { $ne: null },
			    '_id.other': { $ne: null }, 
			    
			}
		},

		// Stage 6
		{
			$match: {
			    $expr: { $gt: ['$_id.id', '$_id.other'] }
			}
		},

		// Stage 7
		{
			$sort: {
			  count: -1
			}
		},

		// Stage 8
		{
			$limit: 100
		},

		// Stage 9
		{
			$project: {
			    _id: 0,
			    p1: '$_id.id',
			    p2: '$_id.other',
			    count: 1  
			}
		},

		// Stage 10
		{
			$out: "mba_combinations_products"
		},

	]

	// Created with Studio 3T, the IDE for MongoDB - https://studio3t.com/

);
