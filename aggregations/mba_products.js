db.getCollection("mba_combinations_products").aggregate(

	// Pipeline
	[
		// Stage 1
		{
			$lookup: {
			   from: "orders",
			   let: {  },
			   pipeline: [ 
			   {
			       $match: {
			           financial_status: 'paid'
			       } 
			       
			   },
			   {
			       $group: {
			           _id: 0,
			           count: { $sum: 1 } 
			       } 
			       
			   }
			   ],
			   as: "total_transactions"
			}
		},

		// Stage 2
		{
			$unwind: {
			    path : "$total_transactions",
			}
		},

		// Stage 3
		{
			$lookup: {
			    from: "mba_transactions_products",
			    localField: "1",
			    foreignField: "_id",
			    as: "1"
			}
		},

		// Stage 4
		{
			$unwind: {
			    path : "$1",
			}
		},

		// Stage 5
		{
			$lookup: {
			    from: "mba_transactions_products",
			    localField: "2",
			    foreignField: "_id",
			    as: "2"
			}
		},

		// Stage 6
		{
			$unwind: {
			    path : "$2",
			}
		},

		// Stage 7
		{
			$addFields: {
			    "sup_1": { $divide: [ '$1.count', '$total_transactions.count' ] },
			    "sup_2": { $divide: [ '$2.count', '$total_transactions.count' ] },
			    "sup_1_2": { $divide: [ '$count', '$total_transactions.count' ] },   
			}
		},

		// Stage 8
		{
			$project: {
			     1: '$1.title',
			     2: '$2.title',
			     count: 1,
			     support_1: { $round: [ { $multiply: [ '$sup_1', 100 ] }, 2 ] },
			     support_2: { $round: [ { $multiply: [ '$sup_2', 100 ] }, 2 ] },
			     support_1_2: { $round: [ { $multiply: [ '$sup_1_2', 100 ] },  2 ] }, 
			     confidence_1_2: { $round: [ { $multiply: [  { $divide: [ '$sup_1_2', '$sup_1' ] }, 100 ] }, 2 ] },
			     confidence_2_1: { $round: [ { $multiply: [ { $divide: [ '$sup_1_2', '$sup_2' ] }, 100 ] }, 2 ] },
			     lift: { $round: [{ $divide: [ '$sup_1_2', { $multiply: [ '$sup_1', '$sup_1' ] } ] }, 2 ] },
			}
		},

		// Stage 9
		{
			$sort: {
			    'support_1_2': -1,
			    
			}
		},

	]

	// Created with Studio 3T, the IDE for MongoDB - https://studio3t.com/

);
