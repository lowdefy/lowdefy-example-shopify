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
			$match: {
			  $expr: {  $gt: [ { $size: '$line_items' }, 1 ] } 
			}
		},

		// Stage 3
		{
			$addFields: {
			    line_items: { $setUnion: [ '$line_items.product_id', [] ] }
			}
		},

		// Stage 4
		{
			$unwind: {
			    path : "$line_items",
			}
		},

		// Stage 5
		{
			$lookup: {
			    from: "products",
			    localField: "line_items",
			    foreignField: "_id",
			    as: "product"
			}
		},

		// Stage 6
		{
			$unwind: {
			    path : "$product",
			}
		},

		// Stage 7
		{
			$group: {
			    _id: '$_id',
			    products: { $push: '$product._id' },
			    types: { $push: '$product.product_type' },
			    vendors: { $push: '$product.vendor' },
			}
		},

		// Stage 8
		{
			$match: {
			  $expr: {  $gt: [ { $size: '$products' }, 1 ] } 
			}
		},

		// Stage 9
		{
			$out: "mba_basket"
		},

	]

	// Created with Studio 3T, the IDE for MongoDB - https://studio3t.com/

);
