// DecreaseOrderItemQuantity
public function DeliveryBoy_DecreaseOrderItemQuantity( $orderItem_list, $Images,   $cancellation_type ,$orderId, $reason , $currentDate)
{
    
       $user = auth()->user();       

$Images = $data['Images'] ?? [];
       
        
        
             
         
         $cancellationData = [];
         
        $order_status = 'received';
        
        
         
         foreach($orderItem_list as $itemId){
             
             $decreasingQuantity = $itemId['decreasing_quantity'];
             $id = $itemId['order_itemsId']; 
             
             
             $OrderItemDetail = DB::table('order_items')
             ->where('id' , $id)
             ->select()
             ->first();
             
             
            $CurrentApprovedQuantity = $OrderItemDetail->approved_quantity;
            
            if($decreasingQuantity > $CurrentApprovedQuantity){
                return response()->json("Decreasing Quantity is should not greater than ApprovedQuantity");
            }
            
              $IsAllStatusReturned = true;
              
             $Order_items = DB::table('order_items')
             ->where('order_id' , $OrderItemDetail->order_id)
             ->select()
             ->get();
                        
              foreach ($Order_items as $item) {
                                  
              if($item->id != $id){
                                      
                if($item->approved_quantity !== 0){
                                                  
                   $IsAllStatusReturned = false;
                    break;
                   }
                   
                }
                 
              } 
              
              
              
              if($CurrentApprovedQuantity == 1 && $IsAllStatusReturned){
                  $order_status = 'cancelled';
              }
              
              
              
              
              
             //   NewQuantity
            
              $newBillResponse = $this->GenerateNewBill($id, $decreasingQuantity);
              
                //   'bill' => [
                        
                //           'newTotalMrp' => $newTotalMrp,
                //  'newTotalDiscount' => $newTotalDiscount,
                //  'newTotalAmount' => $newTotalAmount,
                        
                        
                //         ]
              
              
              if($newBillResponse['status'] !== 'success'){
                     
                     return [               'status' => 'failed', "message" => "error occured during GenerateNewBill"];    
                     
                 }
                     //   update order item approved_quantity ,totalDiscount,total_price , Status
             
            
              $updateOrderItemResponse = $this->UpdateOrderItemTable($id, $newBillResponse['order_item'], 'partial return request');
                 
                 if($updateOrderItemResponse['status'] !== 'success'){
                     
                      return [               'status' => 'failed', "message" => "error occured during OrderUpdation in Order Item Table"];     
                     
                 }
                 
                 
                 
                    $deliveryCharges = $newTotalAmount = $this->getFinalAmountWithDeliveryCharge($id, $newBillResponse['bill']);

                
                
                $updateOrderBillResponse = $this->UpdateOrderBillTable($orderId, $newBillResponse['bill'] , $deliveryCharges);
                 
                 

                 
                 
                 if($updateOrderItemResponse['status'] !== 'success'){
                     
                      return [               'status' => 'failed', "message" => "error occured during OrderUpdation in Order Bill Table"];     
                     
                 }
                 
                 
                //  if orderCancelation Id exist then update that id.. with new quantity..
                
            $ExistsInCancellationTable = DB::table('order_cancellation_items')
           ->join('order_cancellations' , 'order_cancellation_items.order_cancellation_id' , '=' , 'order_cancellations.id')
           ->where('order_item_id' , $id)
           ->select('order_cancellations.id as odCancellationID' , 'order_cancellations.cancelled_unique_id as cancelled_unique_id', 'order_cancellation_items.id' , 'order_cancellation_items.quantitiy' )
           ->first();
           
            // if($ExistsInCancellationTable){
             
            // $Cancellation_Item_id = DB::table('order_cancellation_items')
            //  ->where('id' , $ExistsInCancellationTable->id)
            // ->update([
            //  'quantitiy' =>   $ExistsInCancellationTable->quantitiy + $decreasingQuantity,
            //  'updated_at' => now()  ]);
                        
                        
                        
            //  }
        
                 
                 
                 
                 
             
             $tem = [
                 
             'decreasingQuantity' => $decreasingQuantity,
             'id' => $id,
                 ];
             
           
               $cancellationData[] = $tem;
             
             
            
             
         } 
         
         
         
         
         
        //orderDetails
        
            $ordersTableDetails = $this->ordersTableDetails($orderId);
        
      $Order =  $ordersTableDetails['Order'];
            $OrderBill =  $ordersTableDetails['OrderBill'];
    $Order_items = $ordersTableDetails['Order_items'];
    $Order_Status = $ordersTableDetails['Order_Status'];
         $Order_payment = $ordersTableDetails['Order_payment'];
                       $order_assingment = $ordersTableDetails['order_assingment'];
                       
                               // Calculate refund status and required based on payment status
         $refundStatus = $Order_payment->payment_status === 'pending' ? "Not Required" : "Processing";
         $refundRequired = $Order_payment->payment_status === 'pending' ? 0 : 1;
                       
        
        
        //   If order id is not exist in orderCancellationItem table, then create new cancellation, and push all item nnd quantity on ordercancellationItem table!!
                            
                            
         $coloumn = $this->reasonChecker($reason);
            $order_cancellation_reasons_id = DB::table('order_cancellation_reasons')->insertGetId([
                
            $coloumn => $reason,
            'created_at' => now() ]);
                 
                 
            if($cancellation_type === 'Item'){
                       
             if($Order_Status->order_status !== 'processed'){
                   
                     return ['status' => 'failed',  "message" => "order status is not processed, so that it can't be updated by delivery boy!!!"];     
                }
                       
             $order_cancellations =  DB::table('order_cancellations')->insertGetId([
             'order_id' => $orderId, 
             'user_id' => $Order->user_id, 
             'delivery_executives_id' => $order_assingment->DeliveryExecutive_id ?? null, 
             'merchant_id' => $Order->Merchant_id ?? null, 
             'cancellation_type' => $cancellation_type , 
             'initiated_by' => "Delivery Exe", 
             'reason_id' => $order_cancellation_reasons_id, 
              'cancelled_on' => $Order_Status->order_status,
             'refund_status' => $refundStatus, 
             'refund_required' => $refundRequired, 
             'requested_at' => $currentDate,
              'created_at' => now()
             ]);
             
             
            $un_Cancellation_id = 'CAN' . date('dmy') . $order_cancellations;
            $updateCancellation =  DB::table('order_cancellations')
            ->where('id' , $order_cancellations)
            ->update([
             'cancelled_unique_id' => $un_Cancellation_id,
              'updated_at' => now()
               ]);
           
        //   push all cancelled item and quantity to the cancellation item table
        
        
        foreach($cancellationData as $cancellationItemsdata){
        $Cancellation_Item_id = DB::table('order_cancellation_items')
                ->insertGetId([
                    'order_cancellation_id' => $order_cancellations,
                    'order_item_id' => $cancellationItemsdata['id'],
                    'quantitiy' => $cancellationItemsdata['decreasingQuantity'],
                    'created_at' => now()
                ]);
            
        }
        
        
        
               if (count($Images) > 0) {
    foreach ($Images as $img) {
        if (isset($img)) {
            // Generate a unique filename using time() and uniqid()
            $imageName = time() . '_' . uniqid() . '.' . $img->getClientOriginalExtension();

            // Move the file to the public/images directory
            $img->move(public_path('images'), $imageName);

            // Store the image path for insertion
            $Cancellation_image = DB::table('order_cancellation_images')->insertGetId([
                'Cancellation_id' => $order_cancellations,
                'image_path' => $imageName,
            ]);
        }
    }
}

        
        
        
                        //   return response()->json($cancellationData);
                if($order_status === 'cancelled'){
                       
                       
                       $update_Order_Status_Table_response = $this->update_Order_Status_Table($orderId, $order_status ,  $order_status  , $currentDate);
                       
                       if ($update_Order_Status_Table_response['status'] !== 'success') {
                           
                                return [
                                                  'status' => 'failed',
                            'message' => "An issue occurred while updating the Order Status Table. The order status is not in the 'cancelled' state.",
                            'error_code' => 'ORDER_STATUS_NOT_CANCELLED'
                        ];  
                        
                        
                    }
                    
                      $update_Order_track_Tableresponse = $this->update_Order_track_Table($orderId, 1 ,  $currentDate  , $reason);
                    
                    
                        if ($update_Order_track_Tableresponse['status'] !== 'success') {
                            
                             return [
                                               'status' => 'failed',
                           'message' => "An issue occurred while updating the Order Track Table. The order status is not in the 'cancelled' state.",
                            'error_code' => 'ORDER_STATUS_NOT_CANCELLED'
                        ];  
                        
                        
                    }
                       
                       
                       
                   }
                   
                   
                   
                   
                   
                   
                   
                   
                   
                   if($OrderBill->total_amount === 0){
                       
                       
                                              $update_order_status =  DB::table('order_status')
    ->where('order_id' , $orderId)
    ->update([
        
        'order_status' => "cancelled",
        'delivery_status' => "returned",
        'cancelled_date' => $currentDate,
        'updated_at' => now()
        
    ]);
    
    
    
    
     $update_order_track =  DB::table('order_track')
    ->where('orders_id' , $orderId)
    ->update([
        'cancelled' => 1,
        'cancelled_date' => $currentDate,
        'cancelled_message' => "Partial Returned",
                'updated_at' => now()
    ]);
    
    
    
    
    
                       
                   }
                   
                   
                   
                   
                   
                   
                   
                   
                   
                   
                   
                   
                   
                   
                   
                   
                   
                   
                   
                   
                   
                        DB::commit();
          
                  // Return success response if all updates succeed
              return [
    'status' => 'success',
    'message' => 'Your cancellation request has been successfully submitted. Please allow up to 12 hours for processing. You will be notified once the process is complete.',
    'cancellation_id' => $un_Cancellation_id,
];

        
        
           
           
           
                       
                       
                   }
                   
                   
                   
                   
                   
                   
     

    
    
}
