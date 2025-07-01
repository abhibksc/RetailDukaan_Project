
Added Two Coloumns in "DeliveryExecutive_Wallet_txn" in uat_retaildukaan





Added a Coloum "referral_code" in user table

Some Changes On UserController

Created "user_wallets" table in database

Created "user_wallet_transactions" table in database






four ways of signup the user...

1. by reffering someone and signup without selecting any offer.
2. by not reffering someone, and signup without selecting any offer.
3. by not reffering someone, and signup with selecting any offer.
4. by reffering someone and signup with selecting any offer.



This is to allow admin-defined rules:

Created "signUp_Offer" table in database

Created "signUp_offer_items" table in database

Created "user_SignUp_Offer" table in database

Created "user_referrals" table in database // if singup user uses any referral code then use this table.

 Connector ---------->>>>>>>>>  It connect user_SignUp_Offer and user_referrals table ______________---  Created "refree_SignUp_Offers" table in database

Created "user_referral_milestones" table in database  //configure by admin 

Created "user_referral_milestone_rewards" table in database  

Created "user_referral_wallet" table in database 
Created "user_referral_wallet_txn" table in database  


Add Some Apis in Api.


Created a Controller "SignUpOfferController".

in user table Added "SignUp_OfferId" as null





...........................

guptatradingco74@gmail.com



Date :- 31/05/25 _________-- Continue...



Created a Controller "RefferalController".

********************************** Uat Databse ***************************** start *********************

Changes in grocery_cart_items 
1. added a coloumn SignUp_Offer
2. maked not null , total mrp  , total discountprice , totalprice


Changes in item 
1. added a coloumn isveg



********************************** Uat Databse ***************************** End *********************

Some Changes in class "UserController" function "LoginUser"

Some Changes in class "UserCategoryController"

Some Changes in class "GroceryCartController" .

Some Changes in class "Retrive_All_ItemController"


Some Changes in class "AuthorizationController.php" in RetailDukaan.com api........ mind it ___________


Some Changes in class "AddressController"


Some Changes in class "order_items" in uat.retail database.

 Some Changes in class "PlaceOrderController" in uat.retail.


 Some Changes in class "PurchaseController.php" in uat.retail.

Some Changes in class "purchases" in uat.retail database.

 Some Changes in class "CancelController.php" in uat.retail.

 Some Changes in class "warehouseController.php" in uat.retail.

  Some Changes in class "GroupController.php" in uat.retail.


Some Changes in class "items" in controller.



Created a Controller "grouped_warehouse_pincode".








***** do work *****

1. cart page item .. stock availablity, and delivery availaibley.
2. on order .... stock availabilyt, and delivery availabily






********************************************* last updated in Retail dukaan is on 10th june ****************************************



************* New Updation will be ready belowo *********************

packet_variant_controller,
retrive all item controller..


Created tables

1. "main_group_pincodes"
2.	change name  "grouped_warehouse_pincode"  to "main_group_warehouses"



Created Services

1. UserPinCodeEffectService
2.	

Changes in Controller...

1. UserController
2. GroupController
3. HomeManagementController
4. packetVarientController
5. warehouseController










******************************** privious all changes done ***********************************************************
<!-- new Changes start -->

changes i  api.... 




Created tables or created coloumns

1. 






Changes in Controller...

1. 
2. 








Created Services



Todays Work..

in userlogin function.. make 

initialize user wallet with 0 rupees
initialize user refferal wallert with 0 rupees

if particular user refferl code arrive on any milestoen.. just update that......


