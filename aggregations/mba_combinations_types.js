// Stages that have been excluded from the aggregation pipeline query
__3tsoftwarelabs_disabled_aggregation_stages = [

	{
		// Stage 2 - excluded
		stage: 2,  source: {
			$sort: {
			   created_at_date: -1
			}
		}
	},

	{
		// Stage 3 - excluded
		stage: 3,  source: {
			$limit: 100
		}
	},
]

db.getCollection("orders").aggregate(

	// Pipeline
	[
		// Stage 1
		{
			$match: {
			   financial_status: 'paid'
			}
		},

		// Stage 4
		{
			$project: {
			    // deduplicate product_ids
			    line_items: { $setUnion: [ '$line_items.product_id', [] ] }
			}
		},

		// Stage 5
		{
			$match: {
			  $expr: {  $gt: [ { $size: '$line_items' }, 1 ] } 
			}
		},

		// Stage 6
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

		// Stage 7
		{
			$unwind: {
			    path: '$line_items'
			}
		},

		// Stage 8
		{
			$lookup: {
			    from: "products",
			    localField: "line_items.id",
			    foreignField: "id",
			    as: "product"
			}
		},

		// Stage 9
		{
			$unwind: {
			    path : "$product",
			}
		},

		// Stage 10
		{
			$lookup: {
			    from: "products",
			    let: { ids: "$line_items.other" },
			    pipeline: [ 
			    {
			        $match: {
			            $expr: {
			                $in: [ '$_id', '$$ids' ]
			            }
			        }
			    },
			    {
			        $group: {
			            _id: '$product_type'
			        }
			    }
			    
			    
			    
			     ],
			    as: "other"
			 }
		},

		// Stage 11
		{
			$unwind: {
			    path : "$other",
			}
		},

		// Stage 12
		{
			$match: {
			    'product.product_type': { $ne: null },
			    'other._id': { $ne: null }, 
			    
			}
		},

		// Stage 13
		{
			$match: {
			    $expr: { $gte: ['$product.product_type', '$other._id'] } 
			}
		},

		// Stage 14
		{
			$group: {
			    _id: { t1: '$product.product_type', t2: '$other._id' },
			    count: { $sum: 1 },
			}
		},

		// Stage 15
		{
			$project: {
			    _id: 0,
			    t1: '$_id.t1',
			    t2: '$_id.t2',
			    count: 1  
			}
		},

		// Stage 16
		{
			$out: "mba_combinations_types"
		},

	]

	// Created with Studio 3T, the IDE for MongoDB - https://studio3t.com/

);
