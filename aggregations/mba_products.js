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
			    localField: "p1",
			    foreignField: "_id",
			    as: "p1"
			}
		},

		// Stage 4
		{
			$unwind: {
			    path : "$p1",
			}
		},

		// Stage 5
		{
			$lookup: {
			    from: "mba_transactions_products",
			    localField: "p2",
			    foreignField: "_id",
			    as: "p2"
			}
		},

		// Stage 6
		{
			$unwind: {
			    path : "$p2",
			}
		},

		// Stage 7
		{
			$addFields: {
			    "sup_p1": { $divide: [ '$p1.count', '$total_transactions.count' ] },
			    "sup_p2": { $divide: [ '$p2.count', '$total_transactions.count' ] },
			    "sup_p1_p2": { $divide: [ '$count', '$total_transactions.count' ] },   
			}
		},

		// Stage 8
		{
			$project: {
			     p1: '$p1.title',
			     p2: '$p2.title',
			     count: 1,
			     support_p1: { $round: [ { $multiply: [ '$sup_p1', 100 ] }, 2 ] },
			     support_p2: { $round: [ { $multiply: [ '$sup_p2', 100 ] }, 2 ] },
			     support_p1_p2: { $round: [ { $multiply: [ '$sup_p1_p2', 100 ] },  2 ] }, 
			     confidence_p1_p2: { $round: [ { $multiply: [  { $divide: [ '$sup_p1_p2', '$sup_p1' ] }, 100 ] }, 2 ] },
			     confidence_p2_p1: { $round: [ { $multiply: [ { $divide: [ '$sup_p1_p2', '$sup_p2' ] }, 100 ] }, 2 ] },
			     lift: { $round: [{ $divide: [ '$sup_p1_p2', { $multiply: [ '$sup_p1', '$sup_p1' ] } ] }, 2 ] },
			}
		},

		// Stage 9
		{
			$sort: {
			    'confidence_p1': -1,
			    
			}
		},

	]

	// Created with Studio 3T, the IDE for MongoDB - https://studio3t.com/

);
