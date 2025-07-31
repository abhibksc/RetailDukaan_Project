<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Auth; // Import the Auth facade
use Carbon\Carbon;
use Illuminate\Support\Str;



use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use Razorpay\Api\Api;



class PlaceOrderController extends Controller
{
    
     private $baseUIurl;  // Declare class variable

    public function __construct()
    {
        
             //  $baseUIurl = "http://localhost:1234";
       $this->baseUIurl = "https://retaildukaan.com"; // Initialize variable
    }
    
    
    
    
     // Handle Razorpay Payment Callback
    public function handlePaymentCallback($userID, $razropayOrderId)
    {
        
        return response()->json([$userID,$razropayOrderId]);
        $input = $request->all();

        // Verify Razorpay Signature
        $generatedSignature = hash_hmac('sha256', $input['razorpay_order_id'] . '|' . $input['razorpay_payment_id'], env('RAZORPAY_SECRET'));
        
        if ($generatedSignature === $input['razorpay_signature']) {
            // Update order status in the database
            DB::table('orders')->where('order_id', $input['razorpay_order_id'])->update([
                'payment_status' => 'Paid',
                'payment_id' => $input['razorpay_payment_id'],
                'updated_at' => now(),
            ]);

            return response()->json(['status' => 'success', 'message' => 'Payment Verified Successfully']);
        } else {
            return response()->json(['status' => 'error', 'message' => 'Payment Verification Failed']);
        }
        
        
        
        
        
        
        
         $razorpaySecret = env('RAZORPAY_SECRET');

    try {
        
        // ✅ Validate request
        $validated = $request->validate([
            'order_id' => 'required|string',
            'payment_id' => 'required|string',
            'signature' => 'required|string',
            'message' => 'nullable|string',
            'current_date' => 'required|date|date_format:Y-m-d', // Ensures it's a valid date
        ]);

        // ✅ Verify Signature using Razorpay SDK
        $api = new Api(env('RAZORPAY_KEY'), $razorpaySecret);
        $api->utility->verifyPaymentSignature([
            'razorpay_order_id' => $validated['order_id'],
            'razorpay_payment_id' => $validated['payment_id'],
            'razorpay_signature' => $validated['signature'],
        ]);

        // ✅ Fetch full payment details from Razorpay
        $payment = $api->payment->fetch($validated['payment_id']);

        // ✅ Prepare payment details for DB
        $paymentDetails = [
            'razorpay_order_id'      => $payment['order_id'],
            'payment_id'    => $payment['id'],
            'amount'        => $payment['amount'] / 100, // Convert from paise to INR
             'transaction_id'  => $payment['acquirer_data']['upi_transaction_id'] ?? null, // UPI / Bank Transaction ID
            'currency'      => $payment['currency'],
            'status'        => 'success',
            'method'        => $payment['method'],
            'email'         => $payment['email'],
            'contact'       => $payment['contact'],
            'fee'           => $payment['fee'] / 100, // Razorpay fee
            'tax'           => $payment['tax'] / 100, // GST on fee
            'captured'      => $payment['captured'],
            'description'   => $payment['description'],
            'invoice_id'    => $payment['invoice_id'],
            'notes'         => json_encode($payment['notes']),
            'refund_status' => $payment['refund_status'],
            'failure_reason'=> null, // No failure
            'created_at'    => now(),
            'updated_at'    => now(),
        ];

        // ✅ Insert into DB and get inserted ID
        $paymentId = DB::table('Razorpay_Verified_Payment_Details')->insertGetId($paymentDetails);

        if (!$paymentId) {
            return response()->json(["error" => "Verified payment details could not be stored."], 500);
        }
        

        // ✅ Check if the payment already exists in `order_temp_payment_details`
        $tempPaymentExists = DB::table('order_temp_payment_details')
            ->where('razorpay_order_id', $validated['order_id'])
            ->exists();
                     

        if ($tempPaymentExists) {
            // ✅ Update existing record in `order_temp_payment_details`
            DB::table('order_temp_payment_details')
                ->where('razorpay_order_id', $validated['order_id'])
                ->update($paymentDetails);
                
                
        } else {
            // ✅ If payment is captured but not found in temp records, initiate refund
            if ($payment['status'] === 'captured') {
                try {
                    $refund = $api->payment->fetch($validated['payment_id'])->refund();
                    if ($refund) {
                        DB::table('Order_Payment_refunds')->insert([
                            'payment_id'  => $validated['payment_id'],
                            'order_id'    => $validated['order_id'],
                            'amount'      => $payment['amount'] / 100,
                            'currency'    => $payment['currency'],
                            'refund_id'   => $refund['id'],
                            'status'      => $refund['status'], // processed, failed, etc.
                            'created_at'  => now(),
                            'updated_at'  => now(),
                        ]);
                    }
                    
                      $Customer = Auth::user(); 
    
                      $Customer_phone = $Customer->phone;
                      $Customer_email = $Customer->email;
                    $message = "Your order could not be placed due to a technical issue. However, don't worry! If any amount was deducted from your account, it has been refunded successfully. The refund will be processed within 3-5 business days, depending on your bank.";
                    
                    $sendMessage = $this->SendMessage($Customer_phone,$Customer_email,$senderId,$message);
                    
                    
                    
                  return response()->json([
                      'success' => false,
                      'message' => $message,
                         'SendingMessageDetails' => $sendMessage,
                      'refund_id' => $refund['id'],
                      'refund_status' => ucfirst($refund['status']), // Format status properly
                      'support_contact' => "For any concerns, please contact our support team at info@retaildukaan.com."
                  ], 400);
                    
                } catch (\Exception $e) {
                    return response()->json(['error' => 'Refund failed', 'message' => $e->getMessage()], 500);
                }
            } else {
                return response()->json(['success' => false, 'message' => 'Payment not captured, cannot refund.']);
            }
        }

        // ✅ Proceed with order placement
      $placeOrderResponse =   $this->Prepaid_placeOrder($validated['message'], $validated['current_date'] , $validated['order_id']);
        
        if($placeOrderResponse['Status'] !== "Success"){
            
                  return response()->json(['success' => false, 'message' => $placeOrderResponse['message']]);
            
        }

        return response()->json($placeOrderResponse);
    } 
    // ❌ Catch validation errors
    catch (\Illuminate\Validation\ValidationException $e) {
        return response()->json([
            'success' => false,
            'message' => 'Validation Error',
            'errors' => $e->errors()
        ], 422);
    }
    // ❌ Catch all other errors
    catch (\Throwable $e) {
        Log::error("Razorpay Payment Verification Failed: " . $e->getMessage());

        // ❌ Store Failed Payment
        DB::table('order_temp_payment_details')
            ->where('razorpay_order_id', $request->input('order_id'))
            ->update([
                'payment_id'     => $request->input('payment_id') ?? null,
                'status'         => 'failed',
                'failure_reason' => $e->getMessage(), // Store error message
                'updated_at'     => now(),
            ]);

        return response()->json(['success' => false, 'message' => 'Invalid Payment'], 400);
    }
        
        
        
        
    }

    // Handle Razorpay Payment Cancellation
    public function handlePaymentCancel(Request $request)
    {
        $orderId = $request->input('razorpay_order_id');
        
        // Update order status to cancelled
        DB::table('orders')->where('order_id', $orderId)->update([
            'payment_status' => 'Cancelled',
            'updated_at' => now(),
        ]);

        return response()->json(['status' => 'cancelled', 'message' => 'Payment Cancelled']);
    }
    
    
    
    

   private function StockChecking($stockId)
   {
    $packet_stock = DB::table('packet_stock')->where('id', $stockId)->first();

    if ($packet_stock) {
        // Check packet_stock
        return $packet_stock;
    }

    $loose_stock = DB::table('loose_stock')->where('id', $stockId)->first();

    if ($loose_stock) {
        // Check loose_stock
        return $loose_stock;
    }

    // If no stock is found
    return null;
}


    private function tranferCartItems($or_Id, $Cart_items,$Cart)
    {
        // Initialize an array to track successful operations
        $successfulItems = [];

        foreach ($Cart_items as $items) {
            
            
            if($items && $items->signUp_Offer){
                
                
                
                
                
                 $saveItems = DB::table('order_items')->insertGetId([
                    'order_id' => $or_Id,
                            'signUp_Offer' => $items->signUp_Offer,
                    'quantity' => $items->quantity,
                       'approved_quantity' => $items->quantity,
                    'totalDiscount' => $items->TotaldiscountPrice,
                    'total_price' => $items->TotalPrice,
                    'created_at' => now(),
                ]);
                    continue;
                
                
                
            }
            else {
                
                
                
                  $packet_stock = DB::table('packet_stock')
                ->where('packet_stock.id', $items->packet_stock_id)
               ->join('Items', 'packet_stock.item_id', '=', 'Items.id')
               ->select([
                   "packet_stock.id as id",
                     "packet_stock.purchase_id as purchase_id",
                       "packet_stock.purchase_item_id as purchase_item_id",
                                   "packet_stock.warehouse_id  as warehouse_id",
                         "Items.Merchant_id as Merchant_id",
                         
                   ])
                ->first();
                
                
                
                
                
                
                
                
                
                
                

            if ($packet_stock) {
                $saveItems = DB::table('order_items')->insertGetId([
                    'order_id' => $or_Id,
                    'purchase_id' => $packet_stock->purchase_id,
                    'purchase_item_id' => $packet_stock->purchase_item_id,
                    'packet_stock_id' => $packet_stock->id,
                    
                          'created_time_totalPrice' => $items->TotalPrice,
                            'created_time_totalDiscount' => $items->TotaldiscountPrice,
                          
                          
                          
                          
                          
                    'quantity' => $items->quantity,
                          'approved_quantity' => $items->quantity,
                    'totalDiscount' => $items->TotaldiscountPrice,
                    'total_price' => $items->TotalPrice,
                    'created_at' => now(),
                ]);
                
                   $Update_Merchant = DB::table('orders')
                ->where('id' , $or_Id)
                ->update([
                    'Merchant_id' => $packet_stock->Merchant_id,
                    'warehouse_id' => $packet_stock->warehouse_id,
                    'created_at' => now(),
                ]);

                // Mark the item as successfully processed
                $successfulItems[] = $items->purchase_item_id;
                continue;
            }

            $loose_stock = DB::table('loose_stock')
                ->where('loose_stock.id', $items->loose_stock_id)
                ->join('Items', 'loose_stock.item_id', '=', 'Items.id')
                ->select([
                   "loose_stock.id as id",
                     "loose_stock.purchase_id as purchase_id",
                       "loose_stock.purchase_item_id as purchase_item_id",
                        "loose_stock.warehouse_id  as warehouse_id",
                         "Items.Merchant_id as Merchant_id",
                   ])
                ->first();

            if ($loose_stock) {
                $saveItems = DB::table('order_items')->insertGetId([
                    'order_id' => $or_Id,
                    'purchase_id' => $loose_stock->purchase_id,
                    'purchase_item_id' => $loose_stock->purchase_item_id,
                    'loose_stock_id' => $loose_stock->id,
                    'quantity' => $items->quantity,
                       'approved_quantity' => $items->quantity,
                    'totalDiscount' => $items->TotaldiscountPrice,
                    'total_price' => $items->TotalPrice,
                    'created_at' => now(),
                ]);
                
                    $Update_Merchant = DB::table('orders')
                ->where('id' , $or_Id)
                ->update([
                    'Merchant_id' => $loose_stock->Merchant_id,
                         'warehouse_id' => $loose_stock->warehouse_id,
                    'created_at' => now(),
                ]);

                // Mark the item as successfully processed
                $successfulItems[] = $items->purchase_item_id;
                continue;
            }
            
            
                
                
                
                
            }
            
            
            
          
            
             
        }
        
        
        
        
            $Update_order_bill = DB::table('order_bill')
            ->insertGetId([
                
                "orders_id" => $or_Id,
                   "total_mrp" => $Cart->total_mrp,
                      "total_discount" => $Cart->total_discount,
                         "total_delivery" => $Cart->total_delivery,
                            "total_amount" => round($Cart->total_amount)
                
                
                
                
                
                ]);
               

        // Check if all items were processed successfully
        if (count($successfulItems) === count($Cart_items)) {
            
            if($Update_order_bill){
                
                 return [
                'status' => 'success',
                'message' => 'All cart items were successfully transferred.',
                'successful_items' => $successfulItems,
            ];
                
            }
        } else {
            return [
                'status' => 'partial_success',
                'message' => 'Some cart items could not be .',
                'successful_items' => $successfulItems,
                'failed_items' => array_diff(
                    array_column($Cart_items, 'purchase_item_id'),
                    $successfulItems
                ),
            ];
        }
        
        
        
        
        
    }
    
    
    private function SendMessage($Customer_phone,$Customer_email,$senderId,$message)
{
    
    
    
    
    if($Customer_phone && $senderId){
        
        
        
        $authKey = "68fa5e3a98822f85b5cde69c1371f87";
        // $senderId = "RETDKN"; // Replace with your sender ID
        $mobileNo = $Customer_phone;
        
        
        
        
        $url = "http://msg.wipenex.in/rest/services/sendSMS/sendGroupSms";
        
        
        // Make the HTTP request
        $response = Http::get($url, [
        'AUTH_KEY' => $authKey,
        'message' => $message,
        'senderId' => $senderId,
        'routeId' => 1,
        'mobileNos' => $mobileNo,
        'smsContentType' => 'english',
        ]);
        
        
        
        // return response()->json($response->json()); // Ensure proper JSON response
        
        if ($response->failed()) {
        DB::rollBack(); // Rollback if SMS fails
        Log::error('SMS sending failed: ' . $response->body());
        return ['error' => 'Failed to send OTP via SMS.'];
        }
                
                
        
    }
    
    if($Customer_email){
        
        
        
        //  $message = "Placed: Retail Dukaan Order for $un_Order_id items are placed & will be delivered by $expectedDeliveryDate. Regards Retail Dukaan.";
        
        
        try {
                
                
Mail::raw($message, function ($message) use ($Customer_email) {
$message->to($Customer_email)->subject('Placed Order');
});


} catch (\Exception $e) {
    // Catch any errors like invalid email or SMTP issues
    Log::error('Failed to send email', ['error' => $e->getMessage()]);
    return ['error' => 'Failed .', 'details' => $e->getMessage()];
}
        
        
        
        
    }
    
  

        return ['status' => 'Success', 'message' => "Message Sent Successfully"];
    
}
    
private function cartCleanup($userId)
{
    // Validate user ID
    if (!is_numeric($userId)) {
        return [
            'status' => 'fail',
            'message' => 'Invalid user ID',
        ];
    }

    try {
      // Perform the delete operation
$cartClear = DB::table('grocery_cart')
    ->where('user_id', $userId)
    ->delete();

// Prepare the response
if ($cartClear > 0) {
    return [
        'status' => 'success',
        'message' => 'Cart cleared successfully',
    ];
} else {
    return [
        'status' => 'fail',
        'message' => "No items found in the cart for this user: $userId",
    ];
}

    } catch (\Exception $e) {
        // Handle any errors
        return [
            'status' => 'error',
            'message' => 'An error occurred: ' . $e->getMessage(),
        ];
    }
}


private function validateCartStock($Cart_items)
{
    
     $errors = [];
    
        foreach ($Cart_items as $item) {
            // Fetch packet stock
            $packet_stock = DB::table('packet_stock')
                ->where('packet_stock.id', $item->packet_stock_id) // Corrected variable name
                ->join('Items', 'packet_stock.item_id', '=', 'Items.id')
                ->join('packet_variant', 'packet_stock.packet_variant_id', '=', 'packet_variant.id')
                ->select([
                    "packet_stock.id as id",
                    "packet_variant.variantName as variantName",
                    "packet_variant.limit_per_order as limit_per_order",
                    "packet_stock.quantity as quantity",
                    "packet_stock.purchase_id as purchase_id",
                    "packet_stock.purchase_item_id as purchase_item_id",
                    "packet_stock.warehouse_id as warehouse_id",
                    "Items.Merchant_id as Merchant_id",
                ])
                ->first();


            // Stock validation
            if ( $packet_stock &&  $packet_stock->quantity <= 0) {
               $errors[] = "Out of Stock: $packet_stock->variantName";
            }

            if (  $packet_stock && $item->quantity > $packet_stock->limit_per_order) {
                $errors[] = "Limit Exceeded: $packet_stock->variantName";
            }


            // Processing for loose stock
            $loose_stock = DB::table('loose_stock')
                ->where('loose_stock.id', $item->loose_stock_id)
                ->join('Items', 'loose_stock.item_id', '=', 'Items.id')
                ->join('loose_variant', 'loose_stock.loose_varient_id', '=', 'loose_variant.id')
                ->select([
                    "loose_stock.id as id",
                    "loose_stock.paketings as paketings",
                    "loose_variant.variantName as variantName",
                    "loose_variant.limit_per_order as limit_per_order",
                    "loose_stock.quantity as quantity",
                    "loose_stock.purchase_id as purchase_id",
                    "loose_stock.purchase_item_id as purchase_item_id",
                    "loose_stock.warehouse_id as warehouse_id",
                    "Items.Merchant_id as Merchant_id",
                ])
                ->first();

            if ($loose_stock) {
                if ( $loose_stock && $loose_stock->quantity <= 0) {
                    return ['status' => "failed", 'message' => "Out of Stock: $loose_stock->variantName"];
                }

                if ( $loose_stock && $item->quantity > $loose_stock->limit_per_order) {
                    return ['status' => "failed", 'message' => "Limit Exceeded: $loose_stock->variantName"];
                }

            }
            
                 if (!$item->packet_stock_id && !$item->loose_stock_id) {
            return ['status' => "failed", 'message' => "Invalid Cart Item Data"];
        }
        }
        
        
            if (!empty($errors)) {
        return ['status' => "failed", 'message' => implode(', ', $errors)];
    }

        return ['status' => 'Success', 'message' => "Successfully Checked"];
    
}


private function reserveCartItems($razorPayOrderId, $Cart_items,$date)
{
    try {
        DB::beginTransaction(); // Start transaction
        
        foreach ($Cart_items as $item) {
            // Fetch Packet Stock
            $packet_stock = DB::table('packet_stock')
                ->where('packet_stock.id', $item->packet_stock_id)
                ->join('Items', 'packet_stock.item_id', '=', 'Items.id')
                ->join('packet_variant', 'packet_stock.packet_variant_id', '=', 'packet_variant.id')
                ->select([
                    "packet_stock.id as id",
                    "packet_variant.variantName as variantName",
                    "packet_variant.limit_per_order as limit_per_order",
                    "packet_stock.quantity as quantity",
                    "packet_stock.purchase_id as purchase_id",
                    "packet_stock.purchase_item_id as purchase_item_id",
                    "packet_stock.warehouse_id as warehouse_id",
                    "Items.Merchant_id as Merchant_id",
                ])
                ->first();

            // Validate Stock Availability before reserving
            if ($packet_stock && $packet_stock->quantity >= $item->quantity) {
                // Reserve the stock
                DB::table('reserveGroceryCartItems')->insert([
                    'razorpay_order_id' => $razorPayOrderId,
                    'purchase_id' => $packet_stock->purchase_id,
                    'purchase_item_id' => $packet_stock->purchase_item_id,
                    'packet_stock_id' => $packet_stock->id,
                    'quantity' => $item->quantity,
                    'approved_quantity' => $item->quantity,
                    'totalDiscount' => $item->TotaldiscountPrice ?? 0,
                    'total_price' => $item->TotalPrice ?? 0,
                    'created_at' => now(),
                  'expires_at' => now()->addMinutes(15),
                ]);

                // Deduct from stock
                DB::table('packet_stock')
                    ->where('id', $packet_stock->id)
                    ->update([
                        'quantity' => DB::raw("quantity - {$item->quantity}"),
                        'updated_at' => now(),
                    ]);
            }

            // Fetch Loose Stock
            $loose_stock = DB::table('loose_stock')
                ->where('loose_stock.id', $item->loose_stock_id)
                ->join('Items', 'loose_stock.item_id', '=', 'Items.id')
                ->join('loose_variant', 'loose_stock.loose_varient_id', '=', 'loose_variant.id')
                ->select([
                    "loose_stock.id as id",
                    "loose_stock.paketings as paketings",
                    "loose_variant.variantName as variantName",
                    "loose_variant.limit_per_order as limit_per_order",
                    "loose_stock.quantity as quantity",
                    "loose_stock.purchase_id as purchase_id",
                    "loose_stock.purchase_item_id as purchase_item_id",
                    "loose_stock.warehouse_id as warehouse_id",
                    "Items.Merchant_id as Merchant_id",
                ])
                ->first();

            // Validate Loose Stock before reserving
            if ($loose_stock && $loose_stock->paketings >= $item->quantity) {
                // Reserve Loose Stock
                DB::table('reserveGroceryCartItems')->insert([
                    'razorpay_order_id' => $razorPayOrderId,
                    'purchase_id' => $loose_stock->purchase_id,
                    'purchase_item_id' => $loose_stock->purchase_item_id,
                    'loose_stock_id' => $loose_stock->id,
                    'quantity' => $item->quantity,
                    'approved_quantity' => $item->quantity,
                    'totalDiscount' => $item->TotaldiscountPrice ?? 0,
                    'total_price' => $item->TotalPrice ?? 0,
                    'created_at' => now(),
                      'expires_at' => now()->addMinutes(15),
                ]);

           DB::table('loose_stock')
    ->where('id', $loose_stock->id)
    ->where('paketings', '>=', $item->quantity) // Ensures stock doesn't go negative
    ->update([
        'paketings' => DB::raw("paketings - {$item->quantity}"), // ✅ Correct way
        'updated_at' => now(),
    ]);

                    
            }

            // If neither stock is valid
            if (!$packet_stock && !$loose_stock) {
                DB::rollBack();
                return ['status' => "failed", 'message' => "Invalid Cart Item Data"];
            }
            
            
        }

        DB::commit(); // Commit transaction
        return ['status' => 'Success', 'message' => "Successfully Reserved"];
    } catch (\Exception $e) {
        DB::rollBack(); // Rollback on error
        return ['status' => 'error', 'message' => 'Error: ' . $e->getMessage()];
    }
}




public function createOrder(Request $request)
{
    
    
    
    
    
    
    $api = new Api(env('RAZORPAY_KEY'), env('RAZORPAY_SECRET'));

    DB::beginTransaction(); // Start transaction
    try {
        // Fetch user ID
        $id = Auth::id();
        
        
     $cart = DB::table('grocery_cart')
    ->where('user_id', $id)
    ->select('cart_payment_attempts' , 'total_amount')
    ->first();
    
    
    if ($cart->total_amount === null || $cart->total_amount == 0) {
    return response()->json([
        'success' => false,
        'message' => "Cart is Empty! Please logout and login again."
    ]);
    }

         if ($cart) {
             DB::table('grocery_cart')
                 ->where('user_id', $id)
                 ->update([
                     'cart_payment_attempts' => ($cart->cart_payment_attempts ?? 0) + 1
                 ]);
         } 




            
            

        
        
        

        // Fetch cart items
        $cartItems = DB::table('grocery_cart_items')
            ->leftJoin('grocery_cart', 'grocery_cart_items.cart_id', '=', 'grocery_cart.id')
            ->where('grocery_cart.user_id', $id)
            ->select('grocery_cart_items.*')
            ->get();

        // Check stock availability
        $CheckStocks = $this->validateCartStock($cartItems);
        if ($CheckStocks['status'] !== 'Success') {
            return response()->json(['success' => false, 'message' => $CheckStocks['message']]);
        }

        // Create Razorpay order
        $amount = intval($cart->total_amount) * 100; // Convert to paisa
        $receiptId = 'REC_' . time(); // Generate unique receipt ID

        $order = $api->order->create([
            'receipt' => $receiptId,
            'amount' => $amount,
            'currency' => 'INR',
            'payment_capture' => 1
        ]);

        if (!isset($order['id'])) {
            throw new Exception('Razorpay Order Creation Failed');
        }

        // Store temporary order details
        DB::table('order_temp_payment_details')->insert([
            'razorpay_order_id' => $order['id'],
                  'userId' => $id,
            'amount' => intval($cart->total_amount),
            'receipt' => $receiptId,
            'status' => 'pending',
            'expires_at' => now()->addMinutes(15),
            'created_at' => now(),
            'updated_at' => now()
        ]);

        // Reserve cart items
        $ReserveCartItems = $this->reserveCartItems($order['id'], $cartItems, $request->date);
        if ($ReserveCartItems['status'] !== 'Success') {
            throw new Exception($ReserveCartItems['message']);
        }

        DB::commit(); // Commit transaction

        return response()->json([
            'success' => true,
            'order_id' => $order['id'],
            'amount' => $order['amount']/100
        ]);
    } catch (Exception $e) {
        DB::rollBack(); // Rollback transaction in case of any error
        return response()->json(['success' => false, 'message' => $e->getMessage()], 500);
    }
}


    

public function verifyPayment(Request $request,$userID, $razropayOrderId ,$currentDate)
{
    
    // return response()->json($request->all());
    
    // {"razorpay_payment_id":"pay_QFHrzTv8QnXS0r","razorpay_order_id":"order_QFHrsdCVWnld7Q","razorpay_signature":"2289aab61f4a9ded2f6bc6012edb8dc3c5217cb72249bec49543efb60c9838c3"}
    
    
    $baseUIurl = $this->baseUIurl;
    

    try {
        
        
        $cart = DB::table('grocery_cart')->where('user_id', $userID)->first();

         if (!$cart) {
    
                 // ❌ Store Failed Payment
        DB::table('order_temp_payment_details')
            ->where('razorpay_order_id', $razropayOrderId)
            ->update([
                'status'         => 'failed',
                'failure_reason' => "cart id is not found!!", // Store error message
                'updated_at'     => now(),
            ]);
            
    
    
       return redirect()->to($baseUIurl . "/order/payment-fail/userId-" . $userID . "/orderId-" . $razropayOrderId . "/" . "cart id is not found!!");
    
    
}
         
         















        
    // $razorpaySecret = env('RAZORPAY_SECRET');
    $apiKey = env('RAZORPAY_KEY');
    $apiSecret = env('RAZORPAY_SECRET');
    $api = new Api($apiKey, $apiSecret);
        
        
    $razorpayPaymentId = $request->input('razorpay_payment_id');
    $razorpaySignature = $request->input('razorpay_signature');
    
        // Step 1: Verify the signature
       $generatedSignature = hash_hmac('sha256', $razropayOrderId . "|" . $razorpayPaymentId, $apiSecret);
    
       if ($generatedSignature !== $razorpaySignature) {
           
             // ❌ Store Failed Payment
      $done =   DB::table('order_temp_payment_details')
            ->where('razorpay_order_id', $razropayOrderId)
            ->update([
                'payment_id'     => $razorpayPaymentId ?? null,
                'status'         => 'failed',
                'failure_reason' => "Signature mismatch", // Store error message
                'updated_at'     => now(),
            ]);
            
    
            
           
           
           
           return redirect()->to($baseUIurl . "/order/payment-fail/userId-" . $userID . "/orderId-" . $razropayOrderId . "/" . "Signature mismatch");
        }
    
    
    
       // Step 2: Fetch payment details from Razorpay (optional but recommended)
        $payment = $api->payment->fetch($razorpayPaymentId);
        
        // ✅ Verify Payment Status
        if ($payment['status'] !== 'captured') {
            
                        // ❌ Store Failed Payment
        DB::table('order_temp_payment_details')
            ->where('razorpay_order_id', $razropayOrderId)
            ->update([
                'payment_id'     => $razorpayPaymentId ?? null,
                'status'         => 'failed',
                'failure_reason' => "Payment status not captured", // Store error message
                'updated_at'     => now(),
            ]);
            
            
            
            
            
             return redirect()->to($baseUIurl . "/order/payment-fail/userId-" . $userID . "/orderId-" . $razropayOrderId . "/" . 'Payment status not captured');

        }
        
        
                 // Compare the stored amount with the received amount
         $originalAmount = $cart->total_amount;
         $paidAmount = $payment['amount'] / 100  ?? 0; // Assuming Razorpay sends amount in POST
         
         if ($originalAmount != $paidAmount) {
             // ❌ Store Failed Payment due to amount mismatch
             DB::table('order_temp_payment_details')
                 ->where('razorpay_order_id', $razropayOrderId)
                 ->update([
                     'payment_id'     => $razorpayPaymentId ?? null,
                     'status'         => 'failed',
                     'failure_reason' => "Amount mismatch",
                     'updated_at'     => now(),
                 ]);
                 
                    return redirect()->to($baseUIurl . "/order/payment-fail/userId-" . $userID . "/orderId-" . $razropayOrderId . "/" . "Amount mismatch . $originalAmount . "-vs-" . $paidAmount");
         
         }

        
        
            $getUserDetails = DB::table('users')
                            ->where('id', $userID)
                            ->exists();
    
    
                       if (!$getUserDetails) {
         
         
                                                // ❌ Store Failed Payment
                         DB::table('order_temp_payment_details')
                         ->where('razorpay_order_id', $razropayOrderId)
                         ->update([
                             'payment_id'     => $razorpayPaymentId ?? null,
                             'status'         => 'failed',
                            'failure_reason' => "User not found",
                             'updated_at'     => now(),
                         ]);
                            
                      
                         return redirect()->to($baseUIurl . "/order/payment-fail/userId-" . $userID . "/orderId-" . $razropayOrderId . "/" . 'User not found');


                          }
    
    
    
            
        
             
             

        // ✅ Prepare payment details for DB
        $paymentDetails = [
            'razorpay_order_id'      => $payment['order_id'],
                 'userId'      => $userID,
            'payment_id'    => $payment['id'],
            'amount'        => $payment['amount'] / 100, // Convert from paise to INR
             'transaction_id'  => $payment['acquirer_data']['upi_transaction_id'] ?? null, // UPI / Bank Transaction ID
            'currency'      => $payment['currency'],
            'status'        => 'success',
            'method'        => $payment['method'],
            'email'         => $payment['email'],
            'contact'       => $payment['contact'],
            'fee'           => $payment['fee'] / 100, // Razorpay fee
            'tax'           => $payment['tax'] / 100, // GST on fee
            'captured'      => $payment['captured'],
            'description'   => $payment['description'],
            'invoice_id'    => $payment['invoice_id'],
            'notes'         => json_encode($payment['notes']),
            'refund_status' => $payment['refund_status'],
            'failure_reason'=> null, // No failure
            'created_at'    => now(),
            'updated_at'    => now(),
        ];
        
        

        // ✅ Insert into DB and get inserted ID
        $paymentId = DB::table('Razorpay_Verified_Payment_Details')->insertGetId($paymentDetails);

        if (!$paymentId) {
            
                            // ❌ Store Failed Payment
        DB::table('order_temp_payment_details')
            ->where('razorpay_order_id', $razropayOrderId)
            ->update([
                'payment_id'     => $razorpayPaymentId ?? null,
                'status'         => 'failed',
               'failure_reason' => "Confirm payment details not captured by Retail Dukaan!",
                'updated_at'     => now(),
            ]);
            
            
           return redirect()->to($baseUIurl . "/order/payment-fail/userId-" . $userID . "/orderId-" . $razropayOrderId . "/" . 'Payment id not found');     
        }
        

        // ✅ Check if the payment already exists in `order_temp_payment_details`
        
        $tempPaymentExists = DB::table('order_temp_payment_details')
            ->where('razorpay_order_id', $razropayOrderId)
            ->exists();
                     

        if ($tempPaymentExists) {
            
            // ✅ Update existing record in `order_temp_payment_details`
            DB::table('order_temp_payment_details')
                ->where('razorpay_order_id', $razropayOrderId)
                ->update($paymentDetails);
                
                
        } 
        else {
            // ✅ If payment is captured but not found in temp records, initiate refund
            
                try {
                    
     
     
                    $refund = $api->payment->fetch($razorpayPaymentId)->refund();
                    if ($refund) {
                        
                        DB::table('Order_Payment_refunds')->insert([
                            'payment_id'  => $razorpayPaymentId,
                              'userId'  => $userID,
                            'order_id'    => $razropayOrderId,
                            'amount'      => $payment['amount'] / 100,
                            'currency'    => $payment['currency'],
                            'refund_id'   => $refund['id'],
                            'reason' => "No ID found for this order in the order_temp_payment_details table.",
                            'status'      => $refund['status'], // processed, failed, etc.
                            'created_at'  => now(),
                            'updated_at'  => now(),
                        ]);
                        
                        
                    }
                    
                 $Customer = DB::table("users")
                 ->where('id' , $userID)
                 ->first();
                 
                 $Customer_phone = null;
                 $Customer_email = null;
                 
                 if($Customer){
                     
                 $Customer_phone = $Customer->phone;
                 $Customer_email = $Customer->email;
                     
                 }
                 
                 $message = "Your order could not be placed due to a technical issue. However, don't worry! If any amount was deducted from your account, it has been refunded successfully. The refund will be processed within 3-5 business days, depending on your bank.";
    
                 $sendMessage = $this->SendMessage($Customer_phone,$Customer_email,$senderId,$message);
    
    
    
                    
                    
                
                
                
                
                    
                } 
                
                catch (\Exception $e) {
                    
                    
                                            // ❌ Store Failed Payment
            DB::table('order_temp_payment_details')
            ->where('razorpay_order_id', $razropayOrderId)
            ->update([
                'payment_id'     => $razorpayPaymentId ?? null,
                'status'         => 'failed',
               'failure_reason' => $e->getMessage(),
                'updated_at'     => now(),
            ]);
                    
                    
                    
                return redirect()->to($baseUIurl . "/order/payment-fail/userId-" . $userID . "/orderId-" . $razropayOrderId . "/" . $e->getMessage());             


                    // return response()->json(['error' => 'Refund failed', 'message' => $e->getMessage()], 500);
                }
            
        }
        
        
        
     
     


        
        
        $amount = $payment['amount']/100;


      return redirect()->to("{$baseUIurl}/CheckOut/PaymentStatus-Check/userId={$userID}/orderId={$razropayOrderId}/paymentId={$razorpayPaymentId}/signature={$razorpaySignature}/amount={$amount}");

             
             
             
         
        
    

      
    } 
    // ❌ Catch validation errors
    catch (\Illuminate\Validation\ValidationException $e) {
        
      $errorMessages = implode(', ', array_map('implode', $e->errors()));
      
            $razorpayPaymentId = $request->input('razorpay_payment_id');
      
              DB::table('order_temp_payment_details')
            ->where('razorpay_order_id', $razropayOrderId)
            ->update([
                'payment_id'     => $razorpayPaymentId ?? null,
                'status'         => 'failed',
                'failure_reason' => $errorMessages, // Store error message
                'updated_at'     => now(),
            ]);
            
            
         return redirect()->to($baseUIurl . "/order/payment-fail/userId-" . $userID . "/orderId-" . $razropayOrderId . "/" . $errorMessages); 
        
    }
    // ❌ Catch all other errors
    catch (\Throwable $e) {
        // ✅ Correct handling of generic Throwable errors
        Log::error("Razorpay Payment Verification Failed: " . $e->getMessage());
        
        $razorpayPaymentId = $request->input('razorpay_payment_id');
        $razorpaySignature = $request->input('razorpay_signature');
        
        // ❌ Store Failed Payment
        DB::table('order_temp_payment_details')
            ->where('razorpay_order_id', $razropayOrderId)
            ->update([
                'payment_id'     => $razorpayPaymentId ?? null,
                'status'         => 'failed',
                'failure_reason' => $e->getMessage(), // Store error message
                'updated_at'     => now(),
            ]);
        
        // Since $e->errors() is not valid in \Throwable, fallback to getMessage()
        $errorMessage = $e->getMessage();
         return redirect()->to($baseUIurl . "/order/payment-fail/userId-" . $userID . "/orderId-" . $razropayOrderId . "/" . $errorMessage);     
              
              

    }
    
    
    
    
    
}





public function Final_verifyPayment($userID, $razropayOrderId ,$currentDate , $paymentID, $signature)
{
         $baseUIurl = $this->baseUIurl;
    
    //  $baseUIurl = "http://localhost:1234";
    
    
   $getUserDetails = DB::table('users')
    ->where('id', $userID)
    ->exists();
    
    
     if (!$getUserDetails) {
             return response()->json(["status" => "failed",  "message" => "User not found"]);

     }
     
     
    $order_temp_payment_details = DB::table('order_temp_payment_details')
    ->where('razorpay_order_id', $razropayOrderId)
    ->exists();
    
     if (!$order_temp_payment_details) {
               return response()->json(["status" => "failed",  "message" => "temp table id not found"]);
     }
     
     
     
     
     
     
     
    $razorpaySecret = env('RAZORPAY_SECRET');

    try {
        
        
    $razorpayPaymentId = $paymentID;
    $razorpayOrderId = $razropayOrderId;
    $razorpaySignature = $signature;
    
    //   Step 1: Verify the signature
    $generatedSignature = hash_hmac('sha256', $razorpayOrderId . "|" . $razorpayPaymentId, $razorpaySecret);
    
      if ($generatedSignature !== $razorpaySignature) {
             return response()->json(["status" => "failed",  "message" => "Signature Mismatch" , "orderId" => $razorpayOrderId]);
    }
    
             // Initialize Razorpay API
    $apiKey = env('RAZORPAY_KEY');
    $apiSecret = env('RAZORPAY_SECRET');
    $api = new Api($apiKey, $apiSecret);
    
    
       // Step 2: Fetch payment details from Razorpay (optional but recommended)
        $payment = $api->payment->fetch($razorpayPaymentId);
        
        
        // ✅ Verify Payment Status
        if ($payment['status'] !== 'captured') {
                  return response()->json(["status" => "failed",  "message" => "Payment status not captured" , "orderId" => $razorpayOrderId]);

        }
    
    
    
            
        
         if ($payment['status'] === 'captured') {
             
           
              // 🌟 Checking for existing successful payment in 'order_temp_payment_details'
           $tempPaymentExists = DB::table('order_temp_payment_details')
               ->where('razorpay_order_id', $razorpayOrderId)
               ->where('status', "success")
               ->exists();
               
             if (!$tempPaymentExists) {
                return response()->json(["status" => "failed",  "message" => "temp payment id doesn't exists!!" , "orderId" => $razorpayOrderId]);

             }

           
         
               
               
                    // ✅ Proceed with order placement
      $placeOrderResponse =   $this->Prepaid_placeOrder("PLACE_ORDER", $currentDate , $razorpayOrderId , $userID);
        
        if($placeOrderResponse['Status'] !== "Success"){
            

            
             return response()->json(["status" => "failed",  "message" => $placeOrderResponse['message'] , "orderId" => $razorpayOrderId]);
            
            
            
        }
        
        
            $amount = $payment['amount']/100;

            
            
              return response()->json(["status" => "Success", "amount" => $amount, "orderId" => $razorpayOrderId , "message" => "order successfullyOrder placed" , "data" => $placeOrderResponse]);
            
               
          
           
           


             
             
             
             
             
         }
        
    

      
    } 
    // ❌ Catch validation errors
    catch (\Illuminate\Validation\ValidationException $e) {
        return response()->json([
            'success' => false,
            'message' => $e->errors()
        ], 422);
        
        
    }
    // ❌ Catch all other errors
    catch (\Throwable $e) {
        
        // ✅ Correct handling of generic Throwable errors
        Log::error("Razorpay Payment Verification Failed: " . $e->getMessage());
        
        $razorpayPaymentId = $paymentID;
        $razorpayOrderId = $razropayOrderId;
        $razorpaySignature = $signature;
        
        // ❌ Store Failed Payment
        DB::table('order_temp_payment_details')
            ->where('razorpay_order_id', $razorpayOrderId)
            ->update([
                'payment_id'     => $razorpayPaymentId ?? null,
                'status'         => 'failed',
                'failure_reason' => $e->getMessage(), // Store error message
                'updated_at'     => now(),
            ]);
        
        return response()->json([
            'success' => false,
            'message' => $e->getMessage()
        ], 422);
        
              
              
              

    }
    
    
    
    
    
}






public function verifyOrderId($orderId)
{
$order_Check = DB::table('orders')
    ->where('un_Order_id', $orderId)
    ->exists();

if (!$order_Check) {
    return response()->json([
        "status" => "Not Verified",
        "message" => "Order ID does not exist!"
    ]);
}

return response()->json([
    "status" => "Verified"
]);

    
}




public function cancelverifyPayment($userID, $razropayOrderId ,$currentDate)
{
    
          $baseUIurl = $this->baseUIurl;
          
        //  $baseUIurl = "http://localhost:1234";
     return redirect()->to($baseUIurl . "/order/payment-fail/userId-" . $userID . "/orderId-" . $razropayOrderId . "/" . "Payment Cancelled: You have cancelled the order");


    
}






public function verifyPaymentForMobile(Request $request,$userID, $razropayOrderId ,$currentDate)
{
    $baseUIurl = $this->baseUIurl;
    

    try {
        
    // $razorpaySecret = env('RAZORPAY_SECRET');
    $apiKey = env('RAZORPAY_KEY');
    $apiSecret = env('RAZORPAY_SECRET');
    $api = new Api($apiKey, $apiSecret);
        
        
    $razorpayPaymentId = $request->input('razorpay_payment_id');
    $razorpaySignature = $request->input('razorpay_signature');
    
        // Step 1: Verify the signature
       $generatedSignature = hash_hmac('sha256', $razropayOrderId . "|" . $razorpayPaymentId, $apiSecret);
    
       if ($generatedSignature !== $razorpaySignature) {
           
             // ❌ Store Failed Payment
      $done =   DB::table('order_temp_payment_details')
            ->where('razorpay_order_id', $razropayOrderId)
            ->update([
                'payment_id'     => $razorpayPaymentId ?? null,
                'status'         => 'failed',
                'failure_reason' => "Signature mismatch", // Store error message
                'updated_at'     => now(),
            ]);
            
    
            
           
           
           
            return response()->json(["status" => "failed",  "message" => 'Signature mismatch']);
        }
    
    
    
       // Step 2: Fetch payment details from Razorpay (optional but recommended)
        $payment = $api->payment->fetch($razorpayPaymentId);
        
        // ✅ Verify Payment Status
        if ($payment['status'] !== 'captured') {
            
                        // ❌ Store Failed Payment
        DB::table('order_temp_payment_details')
            ->where('razorpay_order_id', $razropayOrderId)
            ->update([
                'payment_id'     => $razorpayPaymentId ?? null,
                'status'         => 'failed',
                'failure_reason' => "Payment status not captured", // Store error message
                'updated_at'     => now(),
            ]);
            
            
            
      return response()->json(["status" => "failed",  "message" => 'Payment status not captured' , "orderId" => $razropayOrderId]);       
            

        }
        
        
            $getUserDetails = DB::table('users')
                            ->where('id', $userID)
                            ->exists();
    
    
                       if (!$getUserDetails) {
         
         
                                                // ❌ Store Failed Payment
                         DB::table('order_temp_payment_details')
                         ->where('razorpay_order_id', $razropayOrderId)
                         ->update([
                             'payment_id'     => $razorpayPaymentId ?? null,
                             'status'         => 'failed',
                            'failure_reason' => "User not found",
                             'updated_at'     => now(),
                         ]);
                            
               return response()->json(["status" => "failed",  "message" => "User not found"]);         


                          }
    
    
    
            
        
             
             

        // ✅ Prepare payment details for DB
        $paymentDetails = [
            'razorpay_order_id'      => $payment['order_id'],
            'userId'      => $userID,
            'payment_id'    => $payment['id'],
            'amount'        => $payment['amount'] / 100, // Convert from paise to INR
            'transaction_id'  => $payment['acquirer_data']['upi_transaction_id'] ?? null, // UPI / Bank Transaction ID
            'currency'      => $payment['currency'],
            'status'        => 'success',
            'method'        => $payment['method'],
            'email'         => $payment['email'],
            'contact'       => $payment['contact'],
            'fee'           => $payment['fee'] / 100, // Razorpay fee
            'tax'           => $payment['tax'] / 100, // GST on fee
            'captured'      => $payment['captured'],
            'description'   => $payment['description'],
            'invoice_id'    => $payment['invoice_id'],
            'notes'         => json_encode($payment['notes']),
            'refund_status' => $payment['refund_status'],
            'failure_reason'=> null, // No failure
            'created_at'    => now(),
            'updated_at'    => now(),
        ];
        
        

        // ✅ Insert into DB and get inserted ID
        $paymentId = DB::table('Razorpay_Verified_Payment_Details')->insertGetId($paymentDetails);

        if (!$paymentId) {
            
                            // ❌ Store Failed Payment
        DB::table('order_temp_payment_details')
            ->where('razorpay_order_id', $razropayOrderId)
            ->update([
                'payment_id'     => $razorpayPaymentId ?? null,
                'status'         => 'failed',
               'failure_reason' => "Confirm payment details not captured by Retail Dukaan!",
                'updated_at'     => now(),
            ]);
            
           return response()->json(["status" => "failed",  "message" => "Razorpay_Verified_payment_details Table insertion failed!!!"]);      
        }
        

        // ✅ Check if the payment already exists in `order_temp_payment_details`
        
        $tempPaymentExists = DB::table('order_temp_payment_details')
            ->where('razorpay_order_id', $razropayOrderId)
            ->exists();
                     

        if ($tempPaymentExists) {
            
            
            
            
            // ✅ Update existing record in `order_temp_payment_details`
            DB::table('order_temp_payment_details')
                ->where('razorpay_order_id', $razropayOrderId)
                ->update($paymentDetails);
                
                
        } 
        
        else {
            // ✅ If payment is captured but not found in temp records, initiate refund
            
                try {
                    
     
     
                    $refund = $api->payment->fetch($razorpayPaymentId)->refund();
                    if ($refund) {
                        
                        DB::table('Order_Payment_refunds')->insert([
                            'payment_id'  => $razorpayPaymentId,
                              'userId'  => $userID,
                            'order_id'    => $razropayOrderId,
                            'amount'      => $payment['amount'] / 100,
                            'currency'    => $payment['currency'],
                            'refund_id'   => $refund['id'],
                            'reason' => "No ID found for this order in the order_temp_payment_details table.",
                            'status'      => $refund['status'], // processed, failed, etc.
                            'created_at'  => now(),
                            'updated_at'  => now(),
                        ]);
                        
                        
                    }
                    
                 $Customer = DB::table("users")
                 ->where('id' , $userID)
                 ->first();
                 
                 $Customer_phone = null;
                 $Customer_email = null;
                 
                 if($Customer){
                     
                 $Customer_phone = $Customer->phone;
                 $Customer_email = $Customer->email;
                     
                 }
                 
                 $message = "Your order could not be placed due to a technical issue. However, don't worry! If any amount was deducted from your account, it has been refunded successfully. The refund will be processed within 3-5 business days, depending on your bank.";
    
                 $sendMessage = $this->SendMessage($Customer_phone,$Customer_email,$senderId,$message);
    
    
    
                    
                    
                
                
                
                
                    
                } 
                
                catch (\Exception $e) {
                    
                    
                                            // ❌ Store Failed Payment
            DB::table('order_temp_payment_details')
            ->where('razorpay_order_id', $razropayOrderId)
            ->update([
                'payment_id'     => $razorpayPaymentId ?? null,
                'status'         => 'failed',
               'failure_reason' => $e->getMessage(),
                'updated_at'     => now(),
            ]);
                    
                return response()->json(["status" => "failed",  "message" => $e->getMessage()]);          
                    


                    // return response()->json(['error' => 'Refund failed', 'message' => $e->getMessage()], 500);
                }
            
        }
        
        
        
     
     


        
        
        $amount = $payment['amount']/100;


    //   return redirect()->to("{$baseUIurl}/CheckOut/PaymentStatus-Check/userId={$userID}/orderId={$razropayOrderId}/paymentId={$razorpayPaymentId}/signature={$razorpaySignature}/amount={$amount}");

        return response()->json(["status" => "success",
        "message" => "success",
        "data" => [
            
            
            "userID" => $userID,
              "razropayOrderId" => $razropayOrderId,
                "razorpayPaymentId" => $razorpayPaymentId,
                  "razorpaySignature" => $razorpaySignature,
                       "amount" => $amount ]
                       
                       
                       
                       ]);             
             
             
         
        
    

      
    } 
    // ❌ Catch validation errors
    catch (\Illuminate\Validation\ValidationException $e) {
        // return response()->json([
        //     'success' => false,
        //     'message' => 'Validation Error',
        //     'errors' => $e->errors()
        // ], 422);
        
      $errorMessages = implode(', ', array_map('implode', $e->errors()));
      
            $razorpayPaymentId = $request->input('razorpay_payment_id');
      
              DB::table('order_temp_payment_details')
            ->where('razorpay_order_id', $razropayOrderId)
            ->update([
                'payment_id'     => $razorpayPaymentId ?? null,
                'status'         => 'failed',
                'failure_reason' => $errorMessages, // Store error message
                'updated_at'     => now(),
            ]);
            
                 return response()->json(["status" => "failed",  "message" => $errorMessages]);        
        
    }
    // ❌ Catch all other errors
    catch (\Throwable $e) {
        // ✅ Correct handling of generic Throwable errors
        Log::error("Razorpay Payment Verification Failed: " . $e->getMessage());
        
        $razorpayPaymentId = $request->input('razorpay_payment_id');
        $razorpaySignature = $request->input('razorpay_signature');
        
        // ❌ Store Failed Payment
        DB::table('order_temp_payment_details')
            ->where('razorpay_order_id', $razropayOrderId)
            ->update([
                'payment_id'     => $razorpayPaymentId ?? null,
                'status'         => 'failed',
                'failure_reason' => $e->getMessage(), // Store error message
                'updated_at'     => now(),
            ]);
        
        // Since $e->errors() is not valid in \Throwable, fallback to getMessage()
        $errorMessage = $e->getMessage();
        
        return response()->json(["status" => "failed",  "message" => $errorMessage]);         
              

    }
    
    
    
    
    
}




    public function Prepaid_placeOrder($message , $current_date , $razorpayOrderId,$userID)
    {


        DB::beginTransaction(); // Start a database transaction

        try {
            
            if(!$razorpayOrderId || !$current_date || !$message){
               return [
                    'Status' => "failed",
                    'message' => 'Missing required data: R_OrderId, Message, or CurrentDate is not provided in the Prepaid_placeOrder function.'
                ];

            }
            
            $checkOrderPayment = DB::table('order_temp_payment_details')
                ->where('razorpay_order_id', $razorpayOrderId)
                ->first();
                
                if(!$checkOrderPayment){
                    
                     return [
                         'Status' => "failed",
                         'message' => 'The provided razorpay_order_id does not exist in the Razorpay_order_id records.'
                     ];
                     
                    
                }
            


            
            


            $Cart = DB::table('grocery_cart')->where('user_id', $userID)->first();
            
            
              if(!$Cart){
                    
                     return [
                         'Status' => "failed",
                         'message' => 'No id found in the grocery_cart for this user'
                     ];
                     
                    
                }
                
                
            
            
            
            

            $Cart_items = DB::table('grocery_cart_items')->where('cart_id', $Cart->id)->get();
            
                if ($Cart_items->count() === 0) {
                     return [
                         'status' => 'failed',
                         'message' => 'No item exists in the grocery cart item',
                     ];
                 }
            
            
            
            
            
            // return response()->json("fsdf");

            if ($message === "PLACE_ORDER") {
                
                
    // *****************************************  Calculating Expected Delivery Date and Time  **************************************************************
                
              
                
                
                // Retrieve primary address of the user
                $user_addresses = DB::table('addresses')
                ->where('foreign_id', $userID)
                ->where('primary_address', 1)
                ->select()
                ->first();
                
              if(!$user_addresses){
                    
                                    return response()->json([
                               'message' => 'Order not placed! A technical error occurred. We encountered an issue with the primary address not being set. Please try again later or contact support for assistance.'
                                ], 500);

                    
                }
                
                
            
            
            $getDeliveryDate = DB::table('orders_scheduled')
            ->join('Pincode_Table', 'orders_scheduled.pincode_id', '=', 'Pincode_Table.id')
              ->where('Pincode_Table.pincode' , $user_addresses->pin_code)
              ->select()
              ->first();
              
              $expectedDeliveryDate = "";
              $expectedDeliveryTime = "";
               
                  if ($getDeliveryDate) {
                  // Fetch the number of days
               $deliveryDays = $getDeliveryDate->noOfDays;
               
              $currentDate = Carbon::createFromFormat('Y-m-d', $current_date);
  
              $expectedDeliveryDate = $currentDate->addDays($deliveryDays)->toDateString();

              $expectedDeliveryTime = $getDeliveryDate->time;


                  }
                  else{
                      
                      
                   return ['Status' => "failed" , 'message' => 'Order Not Placed! Technical error occurred. We encountered an issue with the expected delivery date and time. Please try again later or contact support for assistance.'];

                      
         
                  }
                  
                  
                
                
                
                
            // ***************************************** Now Placeing Order **************************************************************
                
                
                $or_Id = DB::table('orders')->insertGetId([
                    'user_id' => $userID,
                    'action' => "accepted",
                                 'Paid' => 1,
                          'cart_payment_attempts' => $Cart->cart_payment_attempts,
                       'payment_type' => "PREPAID",
                    'created_at' => now(),
                ]);
                
                if(!$or_Id){
                    
                         DB::rollBack();
                    
                        return ['Status' => "failed" , 'message' => "Techincal error due to inseting data into order table!!!"];
                    
                }
                
                
                
                
                
               $uniquePart = Str::random(12); 
              $un_Order_id = 'OD_' . $uniquePart;
             
                    // address_id 
                $User_Address = DB::table('addresses')
                ->where('foreign_id', $Cart->user_id)
                ->where('primary_address', 1)
                ->select()
                ->first();
                
                if(!$User_Address){
                    
                           DB::rollBack();
                    
                        return ['Status' => "failed" , 'message' => "First Set Primary Address!"];
                    
                }
                
            
            

               $Update_order = DB::table('orders')
                ->where('id', $or_Id) // Replace 'id' and $order_id with the actual column and variable
                ->update([
                    'address_id' =>  $User_Address->id,
                    'expected_DeliveryDate' => $expectedDeliveryDate,
                    'expected_DeliveryTime' => $expectedDeliveryTime,
                    'un_Order_id' => $un_Order_id,
                    'created_at' => now(), // Avoid updating created_at in most cases
                ]);
                
                
                
                
                // InSertData Payment Data into Confirm Payment Table *********************************************
                
            $MakeConfirmPayment = DB::table('order_confirm_payment_details')->insertGetId( [
            'order_id'      => $or_Id,
            'order_temp_payment_details_id'      => $checkOrderPayment->id,
             'receipt'      => $checkOrderPayment->receipt,
            'payment_id'    => $checkOrderPayment->payment_id,
            'amount'        => $checkOrderPayment->amount,
             'transaction_id'  => $checkOrderPayment->transaction_id ?? null, // UPI / Bank Transaction ID
            'currency'      => $checkOrderPayment->currency,
            'status'        => 'success',
            'method'        => $checkOrderPayment->method,
            'email'         => $checkOrderPayment->email,
            'contact'       => $checkOrderPayment->contact,
            'fee'           => $checkOrderPayment->fee,
            'tax'           => $checkOrderPayment->tax,
            'captured'      => $checkOrderPayment->captured,
            'description'   => $checkOrderPayment->description,
            'invoice_id'    => $checkOrderPayment->invoice_id,
            'notes'         => $checkOrderPayment->notes,
            'refund_status' => $checkOrderPayment->refund_status,
            'created_at'    => now(),
            'updated_at'    => now(),
        ]);
        
        if(!$MakeConfirmPayment){
              return ['Status' => "failed" , 'message' => "temp payment details not inseted in confirm payment details.. error!!!"];
        }
                
                
                            
                
                
      // ***************************************** Transfering Cart item to order_items table  **************************************************************
                
                
                $order_items = $this->tranferCartItems($or_Id, $Cart_items,$Cart);
                
                

                if ($order_items['status'] == 'success') {
                    
                    
                    
               $cartCleared = $this->cartCleanup($userID);

              if ($cartCleared['status'] === 'success') {
        
        
                 $or_Status_Id = DB::table('order_status')->insertGetId([
                    'order_id' => $or_Id,
                     'order_status' => 'processed',
                      'payment_status' => 'Prepaid'
                ]);
                
                
                
                
                
        
            $tracking_id = "TR_" . bin2hex(random_bytes(8));
            
          
                
           
       $or_tracking_Id = DB::table('order_track')->insertGetId([
        'orders_id' => $or_Id,
        'tracking_id' => $tracking_id,
        'order_recived' => 1,
        'order_recived_date' => $current_date,
        'order_recived_message' => "Your order is put on hold",
        
        'order_confirm' => 1,
        'order_confirm_date' => $current_date,
        'order_confirm_message' => "Your order is Confirmed",
        
        
        
                      'created_at' => now(),
    ]);
    
    
    
    
    
    
    // ******************* Delete All Items from reserveGroceryCartItems table *************************************
    
    
                    
                $deletedRows = DB::table('reserveGroceryCartItems')
                    ->where('razorpay_order_id', $razorpayOrderId)
                    ->delete();
                
                // Store deletion status for response
                $IsReservedItems_Clear = $deletedRows ? "true" : "false";
                
                
                
                 // Generate Invoice 
    
     $prefix = 'RD'; // RD for RetailDukaan
    $dateCode = now()->format('Ymd'); // Current date as code (e.g., 20240722)
    $randomNumber = str_pad(mt_rand(1, 999999), 6, '0', STR_PAD_LEFT); // Random 6-digit number

    $invoiceNumber = $prefix . $dateCode . $randomNumber;
    
             $InvoiceDetails_table = DB::table('InvoiceDetails')->insertGetId([
                 'OrderID'        => $or_Id,
                 'AddressID'      => $user_addresses->id,
                 'Invoice_Number' => $invoiceNumber,
                 'InvoiceDate'    => $current_date,
                 'TotalAmount'    => $Cart->total_amount,
                 'OrderStatusId'  => $or_Status_Id,
                 'CreatedAt'     => now(),
                 'UpdatedAt'     => now(),  
             ]);
             
             if (!$InvoiceDetails_table) {
                 return response()->json([
                     'message' => 'Order not placed! A technical error occurred. We encountered an issue where the invoice number was not generated. Please try again later or contact support for assistance.'
                 ], 500);
             }
             
             
             
             
            //  Messaging Part_______________________________________________
             
               $Customer = DB::table("users")
               ->where('id' , $userID)
               ->first();
               
               $Customer_phone = null;
               $Customer_email = null;
               
               if($Customer){
        
            $Customer_phone = $Customer->phone;
    $Customer_email = $Customer->email;
        
    }
               
               
               if($Customer_phone){
        
        
        
        $authKey = "68fa5e3a98822f85b5cde69c1371f87";
        $senderId = "RETDKN"; // Replace with your sender ID
        $mobileNo = $Customer_phone;
        
        
        $message = "Placed: Retail Dukaan Order for $un_Order_id items are placed & will be delivered by $expectedDeliveryDate. Regards Retail Dukaan.";
        
        
        $url = "http://msg.wipenex.in/rest/services/sendSMS/sendGroupSms";
        
        
        // Make the HTTP request
        $response = Http::get($url, [
        'AUTH_KEY' => $authKey,
        'message' => $message,
        'senderId' => $senderId,
        'routeId' => 1,
        'mobileNos' => $mobileNo,
        'smsContentType' => 'english',
        ]);
        
        
        
       
        
      
                
                
        
    }
               
               if($Customer_email){
        
        
        
         $message = "Placed: Retail Dukaan Order for $un_Order_id items are placed & will be delivered by $expectedDeliveryDate. Regards Retail Dukaan.";
         
         Mail::raw($message, function ($message) use ($Customer_email) {
$message->to($Customer_email)->subject('Placed Order');
});
        
        

        
        
        
        
    }
             
             
             
             
                
                DB::commit(); // Commit the transaction
                
        
                
                return [
                    'Status' => "Success",
                    'message' => 'Order Placed',
                    'order_Id' => $un_Order_id,
                    'IsReservedItems_Clear' => $IsReservedItems_Clear,
                    'items' => $Cart_items,
                    'Expected_Delivery' => [
                        "date" => $expectedDeliveryDate,
                        "time" => $expectedDeliveryTime,
                    ],
                    'delivery_Address' => $user_addresses,
                ];
                
    }
               else {
                        // Rollback transaction and handle the failure
                        DB::rollBack();
                        return [
                              'Status' => "failed",
                            'message' => 'Failed to place order: ' . $cartCleared['message'],
                        ];
                    }
             
             
             
             
             
             
             
             
             
             
             
                }
                else{
                    
                    
                            DB::rollBack();
                    
                        return ['Status' => "failed" , 'message' => $order_items['message']];
                    
                }

            }
            
            
            
        } 
        
        catch (\Illuminate\Validation\ValidationException $e) {
        // Handle validation exceptions
        return [
            'message' => $e->errors(),
        ];
        }
        
        
        catch (\Exception $e) {
            DB::rollBack(); // Rollback transaction on failure
            return ['Status' => 'failed' , "message" => $e->getMessage()];
        }










    }






    public function placeOrder(Request $request)
    {


        DB::beginTransaction(); // Start a database transaction

        try {
            
                  $data = $request->validate([
            'message' => 'nullable|string',
            'current_date' => 'required|date|date_format:Y-m-d', // Ensures it's a valid date or null
            ]);
            
            if($data['message'] !== "PLACE_ORDER"){
                
                  return response()->json([
            'message' => 'wrong message!! for placing an order!!',
        ], 200);
                
            }


            $id = Auth::id();
            
            


            $Cart = DB::table('grocery_cart')->where('user_id', $id)->first();

            $Cart_items = DB::table('grocery_cart_items')->where('cart_id', $Cart->id)->get();
            
            // return response()->json("fsdf");

            if ($data['message'] === "PLACE_ORDER") {
                
                 $user_id = Auth::id();
                
                
                
                
                    // Retrieve primary address of the user
        $user_addresses = DB::table('addresses')
            ->where('foreign_id', $user_id)
            ->where('primary_address', 1)
            ->select()
            ->first();
            
            
                        if(!$user_addresses){
                    
                                    return response()->json([
    'message' => 'Order not placed! A technical error occurred. We encountered an issue with the primary address not being set. Please try again later or contact support for assistance.'
], 500);

                    
                }
            
            
                $getDeliveryDate = DB::table('orders_scheduled')
               ->join('Pincode_Table', 'orders_scheduled.pincode_id', '=', 'Pincode_Table.id')
              ->where('Pincode_Table.pincode' , $user_addresses->pin_code)
              ->select()
              ->first();
              
              $expectedDeliveryDate = "";
              $expectedDeliveryTime = "";
               
                  if ($getDeliveryDate) {
                  // Fetch the number of days
                  $deliveryDays = $getDeliveryDate->noOfDays;
               
             $currentDate = Carbon::createFromFormat('Y-m-d', $data['current_date']);
  
            $expectedDeliveryDate = $currentDate->addDays($deliveryDays)->toDateString();

              $expectedDeliveryTime = $getDeliveryDate->time;


                  }
                  else{
                      
                      
                   return response()->json([
                    'message' => 'Order Not Placed! Technical error occurred. We encountered an issue with the expected delivery date and time. Please try again later or contact support for assistance.'
                ], 500);
                
                                      
         
                  }
                  
                  
                
                
                
                
                $OutOfStockItems = [];
                foreach ($Cart_items as $items) {
                    
                    
                    
                    // Here We Will Check $item->signUp_Offer  and $item->loose_stock_id or $item->packet_stock_id
                    
                    if($items && $items->signUp_Offer){
                        
                        
                        
                        // Nothing To do...
                        
                        
                        
                        
                        
                        
                    }
                    else{
                        
                        
                               $stockId = '';
                    
                    if( $items &&  $items->loose_stock_id){
                        
                      $stockId =   $items->loose_stock_id;
                        
                    }
                    else if(  $items && $items->packet_stock_id){
                        
                    $stockId =   $items->packet_stock_id;
                        
                    }

                    $Stock = $this->StockChecking($stockId);
                    
                    // return response()->json($items);

                    if( $Stock && $Stock->stock_type == "packet"  && intval($Stock->quantity) <= 0) {
                        $OutOfStockItems[] = $Stock;
                    }
                    else if ($Stock && $Stock->stock_type == "loose" && $Stock->paketings <= 0){
                         $OutOfStockItems[] = $Stock;
                    }
                    
                    
                    
                    
                        
                        
                    }
                    

             
                    
                }
                
                
                    

                if (!empty($OutOfStockItems)) {

                    // DB::commit(); // Commit the transaction
                    return response()->json(["message" => "Out Of Stock", "Items" => $OutOfStockItems]);
                }
                
                
                $or_Id = DB::table('orders')->insertGetId([
                    'user_id' => $id,
                    'created_at' => now(),
                ]);
                
                
                
                
                 $uniquePart = Str::random(12); 
              $un_Order_id = 'order_' . $uniquePart;
                
            
            

               $Update_order = DB::table('orders')
                ->where('id', $or_Id) // Replace 'id' and $order_id with the actual column and variable
                ->update([
                    'expected_DeliveryDate' => $expectedDeliveryDate,
                    'expected_DeliveryTime' => $expectedDeliveryTime,
                    'un_Order_id' => $un_Order_id,
                    'created_at' => now(), // Avoid updating created_at in most cases
                ]);
                            
                
                
                
                $order_items = $this->tranferCartItems($or_Id, $Cart_items,$Cart);
                
                
                

                if ($order_items['status'] == 'success') {
                    
                    
                    

                    // address_id 
                $User_Address = DB::table('addresses')
                ->where('foreign_id', $Cart->user_id)
                ->where('primary_address', 1)
                ->select()
                ->first();
                
                if(!$User_Address){
                    
                                    return response()->json([
    'message' => 'Order not placed! A technical error occurred. We encountered an issue with the primary address not being set. Please try again later or contact support for assistance.'
], 500);

                    
                }
                
                if($User_Address && $User_Address->id){
                    
                    DB::table('orders')->update([
                    'address_id' => $User_Address->id,
                    'created_at' => now(),
                      ]);
                    
                }
                
                
                foreach ($Cart_items as $c_items) {
                    
                    if($c_items && $c_items->signUp_Offer){
                        continue;
                        
                        
                    }
                    
                    else{
                        
                        
                        
                           $Stock = "";
                    
                    if($c_items->loose_stock_id){
                          $Stock = $this->StockChecking($c_items->loose_stock_id);
                    }
                    else if($c_items->packet_stock_id ){
                          $Stock = $this->StockChecking($c_items->packet_stock_id );
                    }
                    
                        //   return response()->json($Stock);
                    
                        // Fetch stock details

                        // Check and update loose_stock
                    if ($Stock->stock_type == "loose") {
                            $newQuantity = max(0, $Stock->paketings - $c_items->quantity);

                            DB::table('loose_stock')
                                ->where('id', $c_items->loose_stock_id)
                                ->update([
                                    'paketings' => $newQuantity,
                                    'updated_at' => now(),
                                ]);
                        }
                        
                        
                        // // Check and update packet_stock
                    else if ($Stock->stock_type == "packet") {
                            $newQuantity = max(0, $Stock->quantity - $c_items->quantity);

                            DB::table('packet_stock')
                              ->where('id', $c_items->packet_stock_id)
                                ->update([
                                    'quantity' => $newQuantity,
                                    'updated_at' => now(),
                                ]);
                        }
                        
                        
                        
                        
                        
                        
                        
                    }
                    
                    
                    
                 
                        
                        
                    }
                    
                    
               $cartCleared = $this->cartCleanup($id);
               
               if($cartCleared['status'] !== 'success'){
                   
                                DB::rollBack();
                   
                   
                   
return response()->json([
    'message' => 'Order not placed! A technical error occurred. We encountered an issue with the grocery cart table not being cleared after transferring the item. Please try again later or contact support for assistance.'
], 500);

                   
                   
                   
               }

              if ($cartCleared['status'] === 'success') {
        
        
                         $or_Status_Id = DB::table('order_status')->insertGetId([
                            'order_id' => $or_Id,
                             'order_status' => 'received'
                        ]);
                
                
                
        
                      $tracking_id = "TR_" . bin2hex(random_bytes(8));
            
          
                
           
                      $or_tracking_Id = DB::table('order_track')->insertGetId([
                       'orders_id' => $or_Id,
                       'tracking_id' => $tracking_id,
                       'order_recived' => 1,
                       'order_recived_date' => $data['current_date'],
                       'order_recived_message' => "Your order is put on hold",
                      'created_at' => now(),
                         ]);
    
    
    
                     $Customer = Auth::user(); 
                     
                     $Customer_phone = $Customer->phone;
                     $Customer_email = $Customer->email;
                     
                     if($Customer_phone){
        
        
        
        $authKey = "68fa5e3a98822f85b5cde69c1371f87";
        $senderId = "RETDKN"; // Replace with your sender ID
        $mobileNo = $Customer_phone;
        
        
        $message = "Placed: Retail Dukaan Order for $un_Order_id items are placed & will be delivered by $expectedDeliveryDate. Regards Retail Dukaan.";
        
        
        $url = "http://msg.wipenex.in/rest/services/sendSMS/sendGroupSms";
        
        
        // Make the HTTP request
        $response = Http::get($url, [
        'AUTH_KEY' => $authKey,
        'message' => $message,
        'senderId' => $senderId,
        'routeId' => 1,
        'mobileNos' => $mobileNo,
        'smsContentType' => 'english',
        ]);
        
        
        
        // return response()->json($response->json()); // Ensure proper JSON response
        
        if ($response->failed()) {
        DB::rollBack(); // Rollback if SMS fails
        Log::error('SMS sending failed: ' . $response->body());
        return response()->json(['error' => 'Failed to send OTP via SMS.'], 500);
        }
                
                
        
    }
                     
                     if($Customer_email){
        
        
        
         $message = "Placed: Retail Dukaan Order for $un_Order_id items are placed & will be delivered by $expectedDeliveryDate. Regards Retail Dukaan.";
        
        
        try {
                
                
Mail::raw($message, function ($message) use ($Customer_email) {
$message->to($Customer_email)->subject('Placed Order');
});


} catch (\Exception $e) {
    // Catch any errors like invalid email or SMTP issues
    Log::error('Failed to send email', ['error' => $e->getMessage()]);
    return response()->json(['error' => 'Failed .', 'details' => $e->getMessage()], 400);
}
        
        
        
        
    }
    
    
    // Generate Invoice 
    
     $prefix = 'RD'; // RD for RetailDukaan
    $dateCode = now()->format('Ymd'); // Current date as code (e.g., 20240722)
    $randomNumber = str_pad(mt_rand(1, 999999), 6, '0', STR_PAD_LEFT); // Random 6-digit number

    $invoiceNumber = $prefix . $dateCode . $randomNumber;
    
             $InvoiceDetails_table = DB::table('InvoiceDetails')->insertGetId([
                 'OrderID'        => $or_Id,
                 'AddressID'      => $User_Address->id,
                 'Invoice_Number' => $invoiceNumber,
                 'InvoiceDate'    => $data['current_date'],
                 'TotalAmount'    => $Cart->total_amount,
                 'OrderStatusId'  => $or_Status_Id,
                 'CreatedAt'     => now(),
                 'UpdatedAt'     => now(),  
             ]);
             
             if (!$InvoiceDetails_table) {
                              DB::rollBack();
                 return response()->json([
                     'message' => 'Order not placed! A technical error occurred. We encountered an issue where the invoice number was not generated. Please try again later or contact support for assistance.'
                 ], 500);
             }
             
             $order_bill = DB::table('order_bill')
             ->where('orders_id' , $or_Id)
             ->select('total_amount')
             ->first();
             


                
      
        DB::commit(); // Commit the transaction
        return response()->json([
            'message' => 'Order Placed',
                    'order_Id' => $un_Order_id,
                   'amount' => $order_bill->total_amount ?? null,

                                        'userId' => $id,
            'items' => $Cart_items,
            
                      'Expected_Delivery' => [
                          
                          "date" => $expectedDeliveryDate,
                                         "time" => $expectedDeliveryTime,
                          
                          
                          ],
                      
                'delivery_Address' => $user_addresses,
        ]);
    }
    
    else {
        // Rollback transaction and handle the failure
        DB::rollBack();
        return response()->json([
            'message' => 'Failed to place order: ' . $cartCleared['message'],
        ]);
    }
             
             
             
             
             
             
             
             
             
             
             
                }

            }
            
            
            
            
        } 
        
        catch (\Illuminate\Validation\ValidationException $e) {
        // Handle validation exceptions
        return response()->json([
            'message' => 'Validation Error',
            'errors' => $e->errors(),
        ], 422);
        }
        
        
        catch (\Exception $e) {
            DB::rollBack(); // Rollback transaction on failure
            return response()->json(['error' => 'Order placement failed!' , $e->getMessage()], 500);
        }










    }

    // Confirm order payment details
    private function confirmOrderPaymentDetails($orderId, $paymentId, Request $request)
    {
        // Step 1: Validate payment confirmation data
        $request->validate([
            'payment_gateway' => 'required|string',
            'payment_option' => 'required|string',
            'total_payment' => 'required|numeric',
            'total_tax' => 'required|numeric',
            'total_gst' => 'required|numeric',
            'transaction_id' => 'nullable|string',
            'payment_id' => 'nullable|string',
            'payment_mode' => 'required|in:online,offline',
            'is_payment_confirmed' => 'required|boolean',
        ]);

        // Step 2: Ensure payment is confirmed before proceeding
        if (!$request->input('is_payment_confirmed')) {
            return response()->json(['success' => false, 'message' => 'Payment not confirmed.'], 400);
        }

        // Step 3: Insert confirmation details
        DB::table('order_confirm_payment_details')->insert([
            'order_id' => $orderId,
            'order_payment_details_id' => $paymentId,
            'payment_gateway' => $request->input('payment_gateway'),
            'payment_option' => $request->input('payment_option'),
            'total_payment' => $request->input('total_payment'),
            'total_tax' => $request->input('total_tax'),
            'total_gst' => $request->input('total_gst'),
            'transaction_id' => $request->input('transaction_id'),
            'payment_id' => $request->input('payment_id'),
            'payment_mode' => $request->input('payment_mode', 'online'),
            'is_order_confirmed' => true,
            'is_payment_confirmed' => true,
            'confirmation_date' => now(),
            'payment_confirmation_date' => now(),
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        return response()->json(['success' => true, 'message' => 'Order and payment confirmed successfully!'], 201);
    }


    public function getorderBasicDetails()
    {
        // Fetch all order details, ensuring no duplicate orders due to joins
        $allOrders = DB::table('orders')
            ->join('order_items', 'orders.id', '=', 'order_items.order_id')
            ->join('users', 'orders.user_id', '=', 'users.id') // To get customer/user details
            ->select(
                'orders.id as order_id',
                'orders.unique_order_id as unique_order_id',
                'orders.user_id',
                'users.name as customer_name',
                'users.email as customer_email',

                'orders.order_status',
                'orders.payment_status',
                'orders.created_at',
                'orders.updated_at'
            )
            ->groupBy(
                'orders.id',
                'orders.unique_order_id',
                'orders.user_id',
                'users.name',
                'users.email',
                'orders.order_status',
                'orders.payment_status',
                'orders.created_at',
                'orders.updated_at'
            ) // Group by all selected columns to avoid duplication
            ->get(); // Get all orders with their related data

        return response()->json($allOrders);
    }

    // OrderItems

    public function OrderItems($item_id)
    {

        // <th className="py-3 px-4 text-start text-indigo-800 font-semibold">SKU_ID</th>
        // <th className="py-3 px-4 text-start text-indigo-800 font-semibold">Image</th>
        // <th className="py-3 px-4 text-start text-indigo-800 font-semibold">Item_Type</th>
        // <th className="py-3 px-4 text-start text-indigo-800 font-semibold">Item_Name</th>
        // <th className="py-3 px-4 text-start text-indigo-800 font-semibold">quantity</th>
        // <th className="py-3 px-4 text-start text-indigo-800 font-semibold">Total Price</th>



        // Fetch all order items for the given order ID
        $allOrders = DB::table('order_items')
            ->where('order_id', $item_id)
            ->select('id', 'order_id', 'stocks_id', 'product_loose_quantity_id', 'product_packed_varient_id', 'quantity', 'total_price')
            ->get();

        // Check if the order items exist
        if ($allOrders->isEmpty()) {
            return response()->json("No items found for the provided order ID", 404);
        }

        $orderDetails = [];

        foreach ($allOrders as $order) {
            if ($order->product_loose_quantity_id !== null) {
                // Fetch loose quantity details
                $looseQuantityDetails = DB::table('product_loose_quantity')
                    ->where('id', $order->product_loose_quantity_id)
                    ->first();

                // Check if loose quantity details were found
                if ($looseQuantityDetails) {


                    $looseSKUId = DB::table('stocks')
                        ->where('id', $looseQuantityDetails->stocks_id)
                        ->select('id', 'loose_sku_Id')
                        ->first(); // Use first() to get a single record



                    $looseImage = DB::table('product_images')
                        ->where('stock_id', $looseSKUId->id)
                        ->select('image_path')
                        ->first(); // Use first() to get a single record

                    $looseImageUrl = $looseImage ? url("images/" . $looseImage->image_path) : null;



                    $orderDetails[] = [
                        'loose_sku_Id' => $looseSKUId->loose_sku_Id,
                        'Image_url' => $looseImageUrl,
                        'stock_type' => "loose",
                        'loose_varient_title' => $looseQuantityDetails->loose_varient_title,
                        'quantity' => $order->quantity,
                        'total_price' => $order->total_price,


                    ];
                }
            } elseif ($order->product_packed_varient_id !== null) {
                // Fetch packed variant details
                $packedQuantityDetails = DB::table('product_packed_varient')
                    ->where('id', $order->product_packed_varient_id)
                    ->first();

                $packedImage = DB::table('product_images')
                    ->where('variant_id', $packedQuantityDetails->id)
                    ->select('image_path')
                    ->first(); // Use first() to get a single record

                $packedImageUrl = $packedImage ? url('images/' . $packedImage->image_path) : null;



                $orderDetails[] = [
                    'packet_varient_sku_Id' => $packedQuantityDetails->packet_varient_sku_Id,
                    'Image_url' => $packedImageUrl,
                    'stock_type' => "packet",
                    'packet_varient_sku_name' => $packedQuantityDetails->packet_varient_sku_name,
                    'quantity' => $order->quantity,
                    'total_price' => $order->total_price,

                ];
            } else {
                // Handle case where both product_loose_quantity_id and product_packed_varient_id are null
                $orderDetails[] = [
                    'order_item' => $order,
                    'message' => 'No variant details found for this order item',
                ];
            }
        }

        // Return the details of the order items
        return response()->json($orderDetails);
    }


    public function OrderDelivery($item_id)
    {

        // <th className="py-3 px-4 text-start text-indigo-800 font-semibold">SKU_ID</th>
        // <th className="py-3 px-4 text-start text-indigo-800 font-semibold">Image</th>
        // <th className="py-3 px-4 text-start text-indigo-800 font-semibold">Item_Type</th>
        // <th className="py-3 px-4 text-start text-indigo-800 font-semibold">Item_Name</th>
        // <th className="py-3 px-4 text-start text-indigo-800 font-semibold">quantity</th>
        // <th className="py-3 px-4 text-start text-indigo-800 font-semibold">Total Price</th>



        // Fetch all order items for the given order ID
        $DeliveryDetails = DB::table('order_delivery_details')
            ->where('order_id', $item_id)
            ->select('id', 'order_id', 'shipping_address', 'delivery_executive', 'shipment_status', 'delivery_charge')
            ->get();

        // Check if the order items exist
        if ($DeliveryDetails->isEmpty()) {
            return response()->json("No items found for the provided order ID", 404);
        }



        // Return the details of the order items
        return response()->json($DeliveryDetails);
    }

    // ConfirmOrder

    public function ConfirmPayment($item_id)
    {

        // <th className="py-3 px-4 text-start text-indigo-800 font-semibold">SKU_ID</th>
        // <th className="py-3 px-4 text-start text-indigo-800 font-semibold">Image</th>
        // <th className="py-3 px-4 text-start text-indigo-800 font-semibold">Item_Type</th>
        // <th className="py-3 px-4 text-start text-indigo-800 font-semibold">Item_Name</th>
        // <th className="py-3 px-4 text-start text-indigo-800 font-semibold">quantity</th>
        // <th className="py-3 px-4 text-start text-indigo-800 font-semibold">Total Price</th>

        $PaymentDetails = DB::table('order_confirm_payment_details')
            ->join('orders', 'orders.id', '=', 'order_confirm_payment_details.order_id')
            ->where('order_confirm_payment_details.order_id', $item_id)
            ->select(
                'order_confirm_payment_details.id',
                'order_confirm_payment_details.order_id',
                'order_confirm_payment_details.order_payment_details_id',
                'order_confirm_payment_details.payment_gateway',
                'order_confirm_payment_details.payment_option',
                'order_confirm_payment_details.total_payment',
                'order_confirm_payment_details.total_tax',
                'order_confirm_payment_details.total_gst',
                'order_confirm_payment_details.delivery_charge',
                'order_confirm_payment_details.transaction_id',
                'order_confirm_payment_details.payment_id',
                'order_confirm_payment_details.payment_mode',
                'order_confirm_payment_details.is_order_confirmed',
                'order_confirm_payment_details.is_payment_confirmed',
                'order_confirm_payment_details.confirmation_date',
                'order_confirm_payment_details.payment_confirmation_date',
                'orders.unique_order_id'  // Fetch the unique_order_id from the orders table
            )
            ->get();




        // Check if the order items exist
        if ($PaymentDetails->isEmpty()) {
            return response()->json("No items found for the provided order ID", 404);
        }



        // Return the details of the order items
        return response()->json($PaymentDetails);
    }

    // storeDeliveryConstraints




    public function showDeliveryCharges()
    {


        $deliverylimits = DB::table('delivery_charges_limit')
            ->select('id', 'min_price_limit', 'max_price_limit', 'distance_from_warehouse', 'delivery_charge')
            ->get();




        // Check if the order items exist
        if ($deliverylimits->isEmpty()) {
            return response()->json("No items found for the provided order ID", 404);
        }


        // Return the details of the order items
        return response()->json($deliverylimits);
    }







}
