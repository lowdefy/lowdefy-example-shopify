db.getCollection("mba_combinations_vendors").aggregate(

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
			    from: "mba_transactions_vendors",
			    localField: "1",
			    foreignField: "_id",
			    as: "1_lu"
			}
		},

		// Stage 4
		{
			$unwind: {
			    path : "$1_lu",
			}
		},

		// Stage 5
		{
			$lookup: {
			    from: "mba_transactions_vendors",
			    localField: "2",
			    foreignField: "_id",
			    as: "2_lu"
			}
		},

		// Stage 6
		{
			$unwind: {
			    path : "$2_lu",
			}
		},

		// Stage 7
		{
			$addFields: {
			    "sup_1": { $divide: [ '$1_lu.count', '$total_transactions.count' ] },
			    "sup_2": { $divide: [ '$2_lu.count', '$total_transactions.count' ] },
			    "sup_1_2": { $divide: [ '$count', '$total_transactions.count' ] },   
			}
		},

		// Stage 8
		{
			$project: {
			     1: '$1',
			     2: '$2',
			     count: 1,
			     support_1: { $round: [ { $multiply: [ '$sup_1', 100 ] }, 2 ] },
			     support_2: { $round: [ { $multiply: [ '$sup_2', 100 ] }, 2 ] },
			     support_1_2: { $round: [ { $multiply: [ '$sup_1_2', 100 ] },  2 ] }, 
			     confidence_1_2: { $round: [ { $multiply: [  { $divide: [ '$sup_1_2', '$sup_1' ] }, 100 ] }, 0 ] },
			     confidence_2_1: { $round: [ { $multiply: [ { $divide: [ '$sup_1_2', '$sup_2' ] }, 100 ] }, 0 ] },
			     lift: { $round: [{ $divide: [ '$sup_1_2', { $multiply: [ '$sup_1', '$sup_1' ] } ] }, 4 ] },
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
