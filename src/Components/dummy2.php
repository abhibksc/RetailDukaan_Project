$ords = [
                  "id" => $od->order_id,
                  "unique_order_id" => $od->unique_order_id,
                  "payment_type" => $od->payment_type,
                //   "date_of_assign" => $od->deliveryExe_Assign_Date,
                   "delivery_Status" => []  ,
                   "Expected_Delivery" => [
                    "date" => $od->expected_DeliveryDate,
                    "time" => $od->expected_DeliveryTime,
                       ],
                  "Customer" => [
                    "id" => $od->userId,
                    "delivery_address" => [
                    "name" => $od->addresses_person_name,
                    "phone" => $od->addresses_person_phone,
                    "email" => $od->userEmail,
                    "locality" => $od->addresses_Locality,
                    "City" => $od->addresses_City,
                    "full_addresss" => $od->addresses_full_addresss,
                    "state" => $od->addresses_state,
                    "pin_code" => $od->addresses_pin_code,
                    "landmark" => $od->addresses_landmark,
                    "address_type" => $od->addresses_address_type,
                     "alternate_phone" => $od->addresses_alternate_phone,
                        ]
                        ],
                       
                //   "Merchant" => [
                       
                //     "id" => $od->Merchant_id,
                //     "phone" => $od->merchant_ph_number,
                //     "email" => $od->merchant_email_id,
                    
                //         ],
                       
                  "Warehouse" => [
                               
                               
                    "id" => $od->warehouse_id,
                    "name" => $od->warehouse_name,
                    "phone" => $od->warehouse_mobile_number,
                    "email" => $od->warehouse_email,
                    "address" => $od->warehouse_address,
                    "pin_code" => $od->warehouse_pin_code,
                    
                    
                        ],
                       
                       
                    "Items" => [],    
                    "Total_Bill" => []  ,
               
                        
                    ];
                    
                    //   // Retrieve order items
     $retrive_od_items = DB::table('order_items')
    ->where('order_id', $od->order_id)
    ->join('purchases_items', 'order_items.purchase_item_id', '=', 'purchases_items.id')
    ->leftJoin('packet_variant', 'purchases_items.packet_varient_id', '=', 'packet_variant.id')
    ->leftJoin('loose_variant', 'purchases_items.loose_varient_id', '=', 'loose_variant.id')
    ->select('order_items.id as order_item_id','order_items.*', 'packet_variant.variantName as p_ItemName', 'packet_variant.id as pct_id', 'loose_variant.variantName as l_ItemName' , 'loose_variant.id as loose_id') // Include the fields you need
    ->get();
    
    
    
    
    // return response()->json($retrive_od_items);
    
    $item = [];
    
    
    foreach($retrive_od_items as $items){
        
        $image = [];
        

       if (isset($items->l_ItemName)) {
           
    $retrive_loose_var = DB::table('loose_variant')
    ->where('id' , $items->loose_id )
      ->select() // Include the fields you need
    ->first();
   $image = asset('images/' . $retrive_loose_var->image_path);
       }
       else if (isset($items->p_ItemName)) {
           
              $retrive_pct_var = DB::table('packet_varient_image')
    ->where('packet_variant_id' , $items->pct_id)
      ->select() // Include the fields you need
    ->first();
      $image = asset($retrive_pct_var->image_path);
           
           // Logic for p_ItemName
       }
       
       if($items->approved_quantity < 0 ){
           
           
           
           
           
       }
       
       
        
        $itemData = [
            
            "Order_itemId" => $items->order_item_id,
            "ItemName" => $items->p_ItemName ?? $items->l_ItemName,
            
            "quantity" => $items->approved_quantity,
            "totalDiscount" => $items->totalDiscount,
            "total_price" => $items->total_price,
            "Status" => $items->Status,
            "image" => $image
            
            
            ];
            
            $item[] = $itemData;
        
        
    }
    
          $ords['Items'] = $item; // Assign bill
    
                
                    // // Retrieve order bill
                    $retrive_od_bill = DB::table('order_bill')
                        ->where('orders_id', $od->order_id)
                        ->first();
                        
                            $retrive_od_status = DB::table('order_status')
                        ->where('order_id', $od->order_id)
                        ->first();
                        
                    $ords['Total_Bill'] = $retrive_od_bill; // Assign bill
                        $ords['delivery_Status'] = $retrive_od_status->delivery_status; // Assign bill
                    
                    
                    $Order[] = $ords;