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
			          '1': '$$item',
			          '2': { $filter: {
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
			    path: '$products.2'
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
			    '_id.1': { $ne: null },
			    '_id.2': { $ne: null }, 
			    
			}
		},

		// Stage 6
		{
			$match: {
			    $expr: { $gt: ['$_id.1', '$_id.2'] }
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
			    '1': '$_id.1',
			    '2': '$_id.2',
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
