db.getCollection("orders").aggregate(

	// Pipeline
	[
		// Stage 1
		{
			$match: {
			  'email': 'reg.maher@worldonline.co.za'
			    
			}
		},

		// Stage 2
		{
			$sort: {
			    created_at_date: -1
			}
		},

		// Stage 3
		{
			$addFields: {
			    "line_items": { $map: {
			          input: '$line_items',
			          in: {
			              title: '$$this.title',
			              quantity: '$$this.quantity',
			              vendor: '$$this.vendor',
			              price: '$$this.price'
			          }
			    } }
			}
		},

		// Stage 4
		{
			$group: {
			    _id: '0',
			    customer: { $first: '$customer' },
			    orders: { $push: { line_items: '$line_items', financial_status: '$financial_status', subtotal_price: '$total_price' } }
			}
		},

	]

	// Created with Studio 3T, the IDE for MongoDB - https://studio3t.com/

);
