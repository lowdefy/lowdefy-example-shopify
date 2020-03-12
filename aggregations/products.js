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
			    preserveNullAndEmptyArrays : true 
			}
		},

		// Stage 6
		{
			$addFields: {
			    "product_type": '$product.product_type',
			    "tags": '$product.tags',
			    "vendor": '$product.vendor',
			}
		},

		// Stage 7
		{
			$project: {
			    _id: 0,
			    product: 0
			    
			}
		},

		// Stage 8
		{
			$sort: {
			    quantity: -1
			}
		},

	]

	// Created with Studio 3T, the IDE for MongoDB - https://studio3t.com/

);
