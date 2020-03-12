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

	{
		// Stage 6 - excluded
		stage: 6,  source: {
			$addFields: {
			    "prod": { $trim: { input: { $arrayElemAt: [ { $split:  [ '$product.product_type', '>' ] }, -1 ] } } }
			}
		}
	},

	{
		// Stage 7 - excluded
		stage: 7,  source: {
			$addFields: {
			    "prod": { $switch: {
			      "branches": [
			        { case: { $eq: [ '$prod', 'Beer' ] }, then: 'Beers'  },
			        { case: { $eq: [ '$prod', 'Whisky' ] }, then: 'Whiskey'  },
			        { case: { $eq: [ '$prod', 'Cocktail Mixes' ] }, then: 'Mixers'  },
			      ],
			        "default": "$prod"
			    } }
			}
		}
	},
]

db.getCollection("orders").aggregate(

	// Pipeline
	[
		// Stage 2
		{
			$unwind: {
			    path : "$line_items",
			}
		},

		// Stage 3
		{
			$group: {
			    _id: '$line_items.variant_id',
			    count: { $sum: 1 },
			    quantity: {  $sum: '$line_items.quantity' },
			    name: { $first: '$line_items.name' },
			    title: { $first: '$line_items.title' },
			    revenue: { $sum: { $toDouble: '$line_items.price' } },
			    max_unit_price: { $max: { $toDouble: '$line_items.price' } },
			    min_unit_price: { $min: { $toDouble: '$line_items.price' } },
			}
		},

		// Stage 4
		{
			$lookup: {
			    from: "products",
			    localField: "_id",
			    foreignField: "variants.id",
			    as: "product"
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

		// Stage 5
		{
			$unwind: {
			    path : "$product",
			}
		},

		// Stage 8
		{
			$group: {
			    _id: '$product.product_type',
			    count: { $sum: '$count' },
			    quantity: {  $sum: '$quantity' },
			    revenue: { $sum: '$revenue' },
			}
		},

		// Stage 9
		{
			$addFields: {
			    "product_type": '$_id',
			//    "tags": '$product.tags',
			//    "vendor": '$product.vendor',
			}
		},

		// Stage 10
		{
			$project: {
			    _id: 0,
			    
			}
		},

		// Stage 11
		{
			$sort: {
			    product_type: 1
			}
		},

	]

	// Created with Studio 3T, the IDE for MongoDB - https://studio3t.com/

);
