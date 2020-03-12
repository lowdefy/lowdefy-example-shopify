// Stages that have been excluded from the aggregation pipeline query
__3tsoftwarelabs_disabled_aggregation_stages = [

	{
		// Stage 1 - excluded
		stage: 1,  source: {
			$match: {
			   created_at_date: { $gte: ISODate('2019-01-01') },
			   financial_status: 'paid'
			    
			}
		}
	},
]

db.getCollection("orders").aggregate(

	// Pipeline
	[
		// Stage 2
		{
			$project: {
			    line_items: '$line_items.variant_id'
			    
			}
		},

		// Stage 3
		{
			$match: {
			  $expr: {  $gt: [ { $size: '$line_items' }, 1 ] } 
			}
		},

		// Stage 4
		{
			$project: {
			    "line_items": { $map: {
			      input: '$line_items',
			      as: 'item',
			      in: {
			          id: '$$item',
			          other: { $filter: {
			             input: '$line_items',
			             as: 'other',
			             cond: { $ne: [ '$$other', '$$item' ] }
			          } }
			      }
			    } }
			}
		},

		// Stage 5
		{
			$unwind: {
			    path: '$line_items'
			}
		},

		// Stage 6
		{
			$unwind: {
			    path: '$line_items.other'
			}
		},

		// Stage 7
		{
			$match: {
			    $expr : { $lt: [ '$line_items.other', '$line_items.id' ] }
			    
			}
		},

		// Stage 8
		{
			$group: {
			    _id: "$line_items",
			    count: { $sum: 1 },
			}
		},

		// Stage 9
		{
			$sort: {
			    count: -1,
			}
		},

		// Stage 10
		{
			$limit: 100
		},

		// Stage 11
		{
			$lookup: // Equality Match
			{
			    from: "products",
			    localField: "_id.id",
			    foreignField: "variants.id",
			    as: "p1"
			}
			
			// Uncorrelated Subqueries
			// (supported as of MongoDB 3.6)
			// {
			//    from: "<collection to join>",
			//    let: { <var_1>: <expression>, …, <var_n>: <expression> },
			//    pipeline: [ <pipeline to execute on the collection to join> ],
			//    as: "<output array field>"
			// }
		},

		// Stage 12
		{
			$unwind: {
			    path : "$p1",
			}
		},

		// Stage 13
		{
			$lookup: {
			    from: "products",
			    localField: "_id.other",
			    foreignField: "variants.id",
			    as: "p2"
			}
		},

		// Stage 14
		{
			$unwind: {
			    path : "$p2",
			}
		},

		// Stage 15
		{
			$project: {
			    // specifications
			    count: 1,
			    title1: '$p1.title' ,
			    title2: '$p2.title' 
			}
		},

	]

	// Created with Studio 3T, the IDE for MongoDB - https://studio3t.com/

);
