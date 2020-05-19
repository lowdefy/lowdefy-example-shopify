db.getCollection("orders").aggregate(

	// Pipeline
	[
		// Stage 1
		{
			$match: {
			    // enter query here
			     $expr: { $ne: [ '$billing_address.country', '$shipping_address.country' ] }   
			}
		},

		// Stage 2
		{
			$group: {
			    _id: { 
			        'bac': '$billing_address.country',
			        'sac': '$shipping_address.country',
			        'sap': '$shipping_address.province',
			    },
			    count: { $sum: 1 }
			}
		},

		// Stage 3
		{
			$addFields: {
			        'billing_address_country': '$_id.bac',
			        'shipping_address_country': '$_id.sac',
			        'shipping_address_province': '$_id.sap',
			}
		},

		// Stage 4
		{
			$sort: {
			    count: -1
			    
			}
		},

	]

	// Created with Studio 3T, the IDE for MongoDB - https://studio3t.com/

);
