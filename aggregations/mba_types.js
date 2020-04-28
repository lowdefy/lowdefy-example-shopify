db.getCollection("mba_combinations_types").aggregate(

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
			    from: "mba_transactions_types",
			    localField: "t1",
			    foreignField: "_id",
			    as: "t1_lu"
			}
		},

		// Stage 4
		{
			$unwind: {
			    path : "$t1_lu",
			}
		},

		// Stage 5
		{
			$lookup: {
			    from: "mba_transactions_types",
			    localField: "t2",
			    foreignField: "_id",
			    as: "t2_lu"
			}
		},

		// Stage 6
		{
			$unwind: {
			    path : "$t2_lu",
			}
		},

		// Stage 7
		{
			$addFields: {
			    "sup_t1": { $divide: [ '$t1_lu.count', '$total_transactions.count' ] },
			    "sup_t2": { $divide: [ '$t2_lu.count', '$total_transactions.count' ] },
			    "sup_t1_t2": { $divide: [ '$count', '$total_transactions.count' ] },   
			}
		},

		// Stage 8
		{
			$project: {
			     t1: '$t1',
			     t2: '$t2',
			     count: 1,
			     support_t1: { $round: [ { $multiply: [ '$sup_t1', 100 ] }, 2 ] },
			     support_t2: { $round: [ { $multiply: [ '$sup_t2', 100 ] }, 2 ] },
			     support_t1_t2: { $round: [ { $multiply: [ '$sup_t1_t2', 100 ] },  2 ] }, 
			     confidence_t1_t2: { $round: [ { $multiply: [  { $divide: [ '$sup_t1_t2', '$sup_t1' ] }, 100 ] }, 0 ] },
			     confidence_t2_t1: { $round: [ { $multiply: [ { $divide: [ '$sup_t1_t2', '$sup_t2' ] }, 100 ] }, 0 ] },
			     lift: { $round: [{ $divide: [ '$sup_t1_t2', { $multiply: [ '$sup_t1', '$sup_t1' ] } ] }, 4 ] },
			}
		},

		// Stage 9
		{
			$sort: {
			    'support_t1_t2': -1,
			}
		},

	]

	// Created with Studio 3T, the IDE for MongoDB - https://studio3t.com/

);
