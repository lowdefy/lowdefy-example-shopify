db.getCollection("orders").aggregate(

	// Pipeline
	[
		// Stage 1
		{
			$match: {
			   financial_status: 'paid',
			}
		},

		// Stage 2
		{
			$project: {
			    // deduplicate product_ids
			    line_items: { $setUnion: [ '$line_items.product_id', [] ] }
			}
		},

		// Stage 3
		{
			$unwind: {
			    "path": "$line_items"
			}
		},

		// Stage 4
		{
			$group: {
			    _id: "$line_items",
			    count: { $sum: 1 }
			}
		},

		// Stage 5
		{
			$match: {
			    _id: { $ne: null }
			}
		},

		// Stage 6
		{
			$lookup: // Equality Match
			{
			    from: "products",
			    localField: "_id",
			    foreignField: "_id",
			    as: "product"
			}
		},

		// Stage 7
		{
			$unwind: {
			    path : "$product",
			    preserveNullAndEmptyArrays: true
			}
		},

		// Stage 8
		{
			$group: {
			    _id: '$product.product_type',
			    count: { $sum: '$count' }
			}
		},

		// Stage 9
		{
			$out: "mba_transactions_types"
		},

	]

	// Created with Studio 3T, the IDE for MongoDB - https://studio3t.com/

);
