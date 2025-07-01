
  public function sendOtp(Request $request)
{
    $user = auth()->user();

    try {
        // Validate the incoming request
        $data = $request->validate([
            'order_Id' => 'required|exists:orders,id',
                 'Executive_id' => 'nullable',
            'message' => 'required|string'
        ]);
        
        
        $address = DB::table('orders')
        ->join('addresses' , 'orders.address_id' , '=' , 'addresses.id')
        ->where('orders.id', $data['order_Id'])
        ->select('addresses.*' , 'orders.user_id')
        ->first();

        // Generate a 6-digit OTP
        $otp = rand(100000, 999999);

        // Check the statuses of the order
        $checkStatus = $this->checkAllStatus(
            $data['order_Id'],          // Order ID
            "processed",                // Order Status
            "picked up",                // Delivery Status
            "Prepaid",                  // Payment Status
            "COD Paid"                  // COD Status
        );

        if ($checkStatus['success'] === false) {
            // If the message is not "ORDER CANCEL", return the status response
            if ($data['message'] !== "ORDER CANCEL") {
                return response()->json($checkStatus);
            }
            
            
        }
        
        

        if ($data['message'] === "ORDER CANCEL") {
            $phone = $this->formatPhoneNumber($address->phone);

            // Check if the phone number exists for the given order
            if (!$this->checkNumberExists($phone, $data['order_Id'])) {
                return response()->json(['message' => 'Number does not exist'], 400);
            }

            // Begin a database transaction
            DB::beginTransaction();

            try {
                // Store the OTP record
                $store = $this->storeOtpRecord($phone, $otp, $data['order_Id'], $data['message']);
                
                //            'message' => "$message OTP stored successfully.",
                
                // return response()->json([$store]);

                if ($store['status'] === "success") {
                    
                    
                    //   return response()->json([$user->email]);
                    
                    
                    // userData Fettch
                    
                    $customer = DB::table('users')
                    ->where('id' , $address->user_id)
                    ->select()
                    ->first();
                    
                    if(!$customer){
                                            DB::rollBack();
                          return response()->json(['message' => 'User not exist'], 400);
                    }
                    
                    $otpID = $store['otpId'];

                    // Send the OTP email to the user
                    $email = $customer->email;

                   if($email){
                       
                          Mail::raw("Your OTP is: $otp. It expires in 10 minutes.", function ($message) use ($email) {
                            $message->to($email)->subject('Your OTP Code');
                        });
                        
                        
                   }
                    
                 

                    // Commit the transaction
                    DB::commit();

                    return response()->json([
                        'message' => 'OTP sent successfully',
                        'OtpID' => $otpID,
                          'OTP' => $otp
                    ], 200);
                } 
                else {
                    
        //              'message' => 'An error occurred while storing the OTP.',
        // 'error'   => $e->getMessage(), // Optional: for debugging/logging
        
        
        
                    // Rollback the transaction if storing OTP fails
                    DB::rollBack();
                    return response()->json(['error' => $store['error']  ], 500);
                }
            } catch (\Exception $e) {
                // Rollback and handle any database errors
                DB::rollBack();
                Log::error('Failed to store OTP or process transaction', ['error' => $e->getMessage()]);

                return response()->json([
                    'error' => 'Failed to process OTP request.',
                    'details' => $e->getMessage()
                ], 500);
            }
        }
        
        
        
        
        
        
    } catch (\Illuminate\Validation\ValidationException $e) {
        // Handle validation errors
        return response()->json([
            'message' => 'Validation Error',
            'errors' => $e->errors(),
        ], 422);
    } catch (\Exception $e) {
        // Catch any general errors
        Log::error('Error in sendOtp method', ['error' => $e->getMessage()]);
        return response()->json([
            'error' => 'Failed to send OTP.',
            'details' => $e->getMessage()
        ], 500);
    }
}