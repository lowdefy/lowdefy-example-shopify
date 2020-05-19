db.getCollection("orders").aggregate(

	// Pipeline
	[
		// Stage 1
		{
			$match: {
			    // enter query here
			    'billing_address.country': 'South Africa'
			}
		},

		// Stage 2
		{
			$match: {
			    // enter query here
			     $expr: { $ne: [ '$billing_address.province', '$shipping_address.province' ] }   
			}
		},

		// Stage 3
		{
			$group: {
			    _id: { 
			        'bap': '$billing_address.province',
			        'sap': '$shipping_address.province',
			        'sac': '$shipping_address.city',
			    },
			    count: { $sum: 1 },
			    total_revenue:
			          { $sum:
			            { $toDouble: '$subtotal_price' } }
			}
		},

		// Stage 4
		{
			$addFields: {
			        'billing_address_province': '$_id.bap',
			        'shipping_address_province': '$_id.sap',
			        'shipping_address_city': '$_id.sac',
			}
		},

		// Stage 5
		{
			$sort: {
			    count: -1
			    
			}
		},

	]

	// Created with Studio 3T, the IDE for MongoDB - https://studio3t.com/

);
