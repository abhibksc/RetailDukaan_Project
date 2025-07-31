 Server: localhost:3306
 Database: wipenyl6_retaildukan
 Table: signUp_Offer
Browse Browse
Structure Structure(current)
SQL SQL
Search Search
Insert Insert
Export Export
Import Import
Operations Operations
Triggers Triggers
Page-related settings Click on the bar to scroll to top of page
SQL Query Console Console
ascendingdescendingOrder:Debug SQLExecution orderTime takenOrder by:Group queries
Some error occurred while getting SQL debug info.
OptionsSet default
Always expand query messages
Show query history at start
Show current browsing query
 Execute queries on Enter and insert new line with Shift+Enter. To make this permanent, view settings.
Switch to dark theme
Table structure Table structure
Relation view Relation view
#	Name	Type	Collation	Attributes	Null	Default	Comments	Extra	Action
	1	id Primary	bigint(20)		UNSIGNED	No	None		AUTO_INCREMENT	Change Change	Drop Drop	
	2	signUp_offer_Unique_id Index	varchar(100)	utf8_unicode_ci		No	None			Change Change	Drop Drop	
	3	Created_for_warehouse	bigint(20)		UNSIGNED	No	None			Change Change	Drop Drop	
	4	created_by_merchant_id Index	bigint(20)		UNSIGNED	Yes	NULL			Change Change	Drop Drop	
	5	offer_name	varchar(255)	utf8_unicode_ci		Yes	NULL			Change Change	Drop Drop	
	6	offer_mrp	decimal(10,2)			No	None			Change Change	Drop Drop	
	7	offer_discount	decimal(10,2)			No	None			Change Change	Drop Drop	
	8	offer_cashback	decimal(10,2)			No	None			Change Change	Drop Drop	
	9	offer_description	varchar(255)	utf8_unicode_ci		Yes	NULL			Change Change	Drop Drop	
	10	offer_status	tinyint(2)		UNSIGNED	No	0			Change Change	Drop Drop	
	11	offer_image_path	varchar(255)	utf8_unicode_ci		Yes	NULL			Change Change	Drop Drop	
	12	created_at	timestamp			Yes	NULL			Change Change	Drop Drop	
	13	updated_at	timestamp			Yes	NULL			Change Change	Drop Drop	


 Server: localhost:3306
 Database: wipenyl6_retaildukan
 Table: signUp_offer_items
Browse Browse
Structure Structure(current)
SQL SQL
Search Search
Insert Insert
Export Export
Import Import
Operations Operations
Triggers Triggers
Page-related settings Click on the bar to scroll to top of page
SQL Query Console Console
ascendingdescendingOrder:Debug SQLExecution orderTime takenOrder by:Group queries
Some error occurred while getting SQL debug info.
OptionsSet default
Always expand query messages
Show query history at start
Show current browsing query
 Execute queries on Enter and insert new line with Shift+Enter. To make this permanent, view settings.
Switch to dark theme
Table structure Table structure
Relation view Relation view
#	Name	Type	Collation	Attributes	Null	Default	Comments	Extra	Action
	1	id Primary	bigint(20)		UNSIGNED	No	None		AUTO_INCREMENT	Change Change	Drop Drop	
	2	signup_offer_id Index	bigint(20)		UNSIGNED	No	None			Change Change	Drop Drop	
	3	purchase_id Index	bigint(20)		UNSIGNED	Yes	NULL			Change Change	Drop Drop	
	4	purchase_item_id Index	bigint(20)		UNSIGNED	Yes	NULL			Change Change	Drop Drop	
	5	loose_stock_id Index	bigint(20)		UNSIGNED	Yes	NULL			Change Change	Drop Drop	
	6	packet_stock_id Index	bigint(20)		UNSIGNED	Yes	NULL			Change Change	Drop Drop	
	7	quantity	int(11)			No	1			Change Change	Drop Drop	
	8	created_at	timestamp			No	CURRENT_TIMESTAMP			Change Change	Drop Drop	
	9	updated_at	timestamp		on update CURRENT_TIMESTAMP	No	CURRENT_TIMESTAMP		ON UPDATE CURRENT_TIMESTAMP	Change Change	Drop Drop	


 Server: localhost:3306
 Database: wipenyl6_retaildukan
 Table: orders
Browse Browse
Structure Structure(current)
SQL SQL
Search Search
Insert Insert
Export Export
Import Import
Operations Operations
Triggers Triggers
Page-related settings Click on the bar to scroll to top of page
SQL Query Console Console
ascendingdescendingOrder:Debug SQLExecution orderTime takenOrder by:Group queries
Some error occurred while getting SQL debug info.
OptionsSet default
Always expand query messages
Show query history at start
Show current browsing query
 Execute queries on Enter and insert new line with Shift+Enter. To make this permanent, view settings.
Switch to dark theme
Table structure Table structure
Relation view Relation view
#	Name	Type	Collation	Attributes	Null	Default	Comments	Extra	Action
	1	id Primary	bigint(20)		UNSIGNED	No	None		AUTO_INCREMENT	Change Change	Drop Drop	
	2	un_Order_id Index	varchar(100)	utf8mb4_unicode_ci		Yes	NULL			Change Change	Drop Drop	
	3	user_id Index	bigint(20)		UNSIGNED	No	None			Change Change	Drop Drop	
	4	Merchant_id Index	bigint(20)		UNSIGNED	Yes	NULL			Change Change	Drop Drop	
	5	warehouse_id Index	bigint(20)		UNSIGNED	Yes	NULL			Change Change	Drop Drop	
	6	address_id Index	bigint(20)		UNSIGNED	Yes	NULL			Change Change	Drop Drop	
	7	expected_DeliveryDate	date			Yes	NULL			Change Change	Drop Drop	
	8	expected_DeliveryTime	time			Yes	NULL			Change Change	Drop Drop	
	9	payment_type	enum('COD', 'PREPAID')	utf8mb4_unicode_ci		No	COD			Change Change	Drop Drop	
	10	Paid	tinyint(1)			Yes	0			Change Change	Drop Drop	
	11	cart_payment_attempts	int(11)			Yes	NULL			Change Change	Drop Drop	
	12	Is_Payment_Collected_by_DeliveryExecutive	tinyint(10)			Yes	0			Change Change	Drop Drop	
	13	action	enum('accepted', 'It hasn''t been accepted yet', '...	utf8mb4_unicode_ci		No	It hasn't been accepted yet			Change Change	Drop Drop	
	14	created_at	timestamp			Yes	NULL			Change Change	Drop Drop	
	15	updated_at	timestamp			Yes	NULL			Change Change	Drop Drop	

 Server: localhost:3306
 Database: wipenyl6_retaildukan
 Table: order_items
Browse Browse
Structure Structure(current)
SQL SQL
Search Search
Insert Insert
Export Export
Import Import
Operations Operations
Triggers Triggers
Page-related settings Click on the bar to scroll to top of page
SQL Query Console Console
ascendingdescendingOrder:Debug SQLExecution orderTime takenOrder by:Group queries
Some error occurred while getting SQL debug info.
OptionsSet default
Always expand query messages
Show query history at start
Show current browsing query
 Execute queries on Enter and insert new line with Shift+Enter. To make this permanent, view settings.
Switch to dark theme
Table structure Table structure
Relation view Relation view
#	Name	Type	Collation	Attributes	Null	Default	Comments	Extra	Action
	1	id Primary	bigint(20)		UNSIGNED	No	None		AUTO_INCREMENT	Change Change	Drop Drop	
	2	order_id Index	bigint(20)		UNSIGNED	No	None			Change Change	Drop Drop	
	3	signUp_Offer Index	bigint(20)		UNSIGNED	Yes	NULL			Change Change	Drop Drop	
	4	purchase_id Index	bigint(20)		UNSIGNED	Yes	NULL			Change Change	Drop Drop	
	5	purchase_item_id Index	bigint(20)		UNSIGNED	Yes	NULL			Change Change	Drop Drop	
	6	loose_stock_id Index	bigint(20)		UNSIGNED	Yes	NULL			Change Change	Drop Drop	
	7	packet_stock_id Index	bigint(20)		UNSIGNED	Yes	NULL			Change Change	Drop Drop	
	8	quantity	decimal(10,2)			No	None			Change Change	Drop Drop	
	9	created_time_totalPrice	decimal(10,2)			Yes	NULL			Change Change	Drop Drop	
	10	created_time_totalDiscount	decimal(10,2)			Yes	NULL			Change Change	Drop Drop	
	11	approved_quantity	bigint(100)			No	0			Change Change	Drop Drop	
	12	totalDiscount	decimal(10,2)			Yes	0.00			Change Change	Drop Drop	
	13	total_price	decimal(10,2)			No	None			Change Change	Drop Drop	
	14	Status	enum('Pending Pickup', 'picked up', 'Pending deliv...	utf8mb4_unicode_ci		No	Pending Pickup			Change Change	Drop Drop	
	15	created_at	timestamp			Yes	NULL			Change Change	Drop Drop	
	16	updated_at	timestamp			Yes	NULL			Change Change	Drop Drop	

 Server: localhost:3306
 Database: wipenyl6_retaildukan
 Table: order_bill
Browse Browse
Structure Structure(current)
SQL SQL
Search Search
Insert Insert
Export Export
Import Import
Operations Operations
Triggers Triggers
Page-related settings Click on the bar to scroll to top of page
SQL Query Console Console
ascendingdescendingOrder:Debug SQLExecution orderTime takenOrder by:Group queries
Some error occurred while getting SQL debug info.
OptionsSet default
Always expand query messages
Show query history at start
Show current browsing query
 Execute queries on Enter and insert new line with Shift+Enter. To make this permanent, view settings.
Switch to dark theme
Table structure Table structure
Relation view Relation view
#	Name	Type	Collation	Attributes	Null	Default	Comments	Extra	Action
	1	id Primary	bigint(20)		UNSIGNED	No	None		AUTO_INCREMENT	Change Change	Drop Drop	
	2	orders_id Index	bigint(20)		UNSIGNED	No	None			Change Change	Drop Drop	
	3	total_mrp	decimal(10,2)			No	None			Change Change	Drop Drop	
	4	total_discount	decimal(10,2)			Yes	NULL			Change Change	Drop Drop	
	5	total_delivery	decimal(10,2)			Yes	0.00			Change Change	Drop Drop	
	6	total_amount	decimal(10,2)			No	None			Change Change	Drop Drop	
	7	updated_at	timestamp			Yes	NULL			Change Change	Drop Drop	
	8	created_at	timestamp			Yes	NULL			Change Change	Drop Drop	
With selected:  Check all With selected:        

 Server: localhost:3306
 Database: wipenyl6_retaildukan
 Table: order_status
Browse Browse
Structure Structure(current)
SQL SQL
Search Search
Insert Insert
Export Export
Import Import
Operations Operations
Triggers Triggers
Page-related settings Click on the bar to scroll to top of page
SQL Query Console Console
ascendingdescendingOrder:Debug SQLExecution orderTime takenOrder by:Group queries
Some error occurred while getting SQL debug info.
OptionsSet default
Always expand query messages
Show query history at start
Show current browsing query
 Execute queries on Enter and insert new line with Shift+Enter. To make this permanent, view settings.
Switch to dark theme
Table structure Table structure
Relation view Relation view
3 columns have been dropped successfully.
#	Name	Type	Collation	Attributes	Null	Default	Comments	Extra	Action
	1	id PrimaryIndex	bigint(20)		UNSIGNED	No	None		AUTO_INCREMENT	Change Change	Drop Drop	
	2	order_id Index	bigint(20)		UNSIGNED	No	None			Change Change	Drop Drop	
	3	order_status	enum('received', 'processed', 'cancelled', 'comple...	utf8_unicode_ci		Yes	received			Change Change	Drop Drop	
	4	delivery_status	enum('pending', 'picked up', 'returned', 'delivere...	utf8_unicode_ci		No	pending			Change Change	Drop Drop	
	5	payment_status	enum('pending', 'Prepaid', 'Payment Failed', 'Refu...	utf8_unicode_ci		No	pending			Change Change	Drop Drop	
	6	created_at	timestamp			Yes	NULL			Change Change	Drop Drop	
	7	updated_at	timestamp			Yes	NULL			Change Change	Drop Drop	

 Server: localhost:3306
 Database: wipenyl6_retaildukan
 Table: order_track
Browse Browse
Structure Structure(current)
SQL SQL
Search Search
Insert Insert
Export Export
Import Import
Operations Operations
Triggers Triggers
Page-related settings Click on the bar to scroll to top of page
SQL Query Console Console
ascendingdescendingOrder:Debug SQLExecution orderTime takenOrder by:Group queries
Some error occurred while getting SQL debug info.
OptionsSet default
Always expand query messages
Show query history at start
Show current browsing query
 Execute queries on Enter and insert new line with Shift+Enter. To make this permanent, view settings.
Switch to dark theme
Table structure Table structure
Relation view Relation view
#	Name	Type	Collation	Attributes	Null	Default	Comments	Extra	Action
	1	id Primary	bigint(20)		UNSIGNED	No	None		AUTO_INCREMENT	Change Change	Drop Drop	
	2	orders_id Index	bigint(20)		UNSIGNED	No	None			Change Change	Drop Drop	
	3	tracking_id Index	varchar(100)	utf8_unicode_ci		No	None			Change Change	Drop Drop	
	4	order_recived	tinyint(10)			No	0			Change Change	Drop Drop	
	5	order_recived_date	date			Yes	NULL			Change Change	Drop Drop	
	6	order_recived_message	varchar(100)	utf8_unicode_ci		Yes	NULL			Change Change	Drop Drop	
	7	order_confirm	tinyint(10)			No	0			Change Change	Drop Drop	
	8	order_confirm_date	date			Yes	NULL			Change Change	Drop Drop	
	9	order_confirm_message	varchar(100)	utf8_unicode_ci		Yes	NULL			Change Change	Drop Drop	
	10	Shipped	tinyint(10)			No	0			Change Change	Drop Drop	
	11	Shipped_date	date			Yes	NULL			Change Change	Drop Drop	
	12	Shipped_message	varchar(100)	utf8_unicode_ci		Yes	NULL			Change Change	Drop Drop	
	13	out_for_delivery	tinyint(10)			No	0			Change Change	Drop Drop	
	14	out_for_delivery_date	date			Yes	NULL			Change Change	Drop Drop	
	15	out_for_delivery_message	varchar(100)	utf8_unicode_ci		Yes	NULL			Change Change	Drop Drop	
	16	delivered	tinyint(20)			No	0			Change Change	Drop Drop	
	17	delivered_date	date			Yes	NULL			Change Change	Drop Drop	
	18	delivered_message	varchar(100)	utf8_unicode_ci		Yes	NULL			Change Change	Drop Drop	
	19	cancelled	tinyint(10)			No	0			Change Change	Drop Drop	
	20	cancelled_date	date			Yes	NULL			Change Change	Drop Drop	
	21	cancelled_message	varchar(100)	utf8_unicode_ci		Yes	NULL			Change Change	Drop Drop	
	22	refund	tinyint(10)			Yes	NULL			Change Change	Drop Drop	
	23	refund_date	datetime			Yes	NULL			Change Change	Drop Drop	
	24	refund_message	varchar(100)	utf8_unicode_ci		Yes	NULL			Change Change	Drop Drop	
	25	created_at	timestamp			Yes	NULL			Change Change	Drop Drop	
	26	updated_at	timestamp			Yes	NULL			Change Change	Drop Drop	
