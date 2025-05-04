public function deletePurchaseItem($id)
{
    // Begin a transaction
    DB::beginTransaction();

    try {
        $purchaseItem = DB::table('purchases_items')
            ->join('si_units', 'purchases_items.unit_Id', '=', 'si_units.id')
            ->select('purchases_items.purchase_id', 'purchases_items.gstAmount', 'purchases_items.costPrice', 'si_units.value', 'purchases_items.discountPercent')
            ->where('purchases_items.id', $id)
            ->first();

        // Check if the purchase item exists before proceeding
        if (!$purchaseItem) {
            return response()->json(['message' => 'Purchase item not found.'], 404);
        }

        // Step 1: Perform Calculations Before Deletion

        // Calculate discount amount
        $discountAmount = ($purchaseItem->costPrice * $purchaseItem->discountPercent) / 100;

        // Calculate taxable amount
        $taxableAmt = $purchaseItem->costPrice - $discountAmount;

        // Initialize GST variables
        $gstAmount = 0;
        $cgst = 0;
        $sgst = 0;
        $igst = 0;

        // Fetch invoice details
        $invoiceDetails = DB::table('purchases')
            ->where('id', $purchaseItem->purchase_id)
            ->select('cgst_amount', 'sgst_amount', 'igst_amount')
            ->first();

        // Check the GST type (CGST + SGST or IGST)
        if ($invoiceDetails) {
            if ($invoiceDetails->igst_amount > 0) {
                // If IGST is applicable
                $gstAmount = $invoiceDetails->igst_amount - $purchaseItem->gstAmount;
                $igst = $gstAmount;
            } elseif ($invoiceDetails->cgst_amount > 0 && $invoiceDetails->sgst_amount > 0) {
                // If CGST + SGST are applicable
                $gstAmount = $invoiceDetails->cgst_amount + $invoiceDetails->sgst_amount;
                $gstAmount = $gstAmount - $purchaseItem->gstAmount;

                // Divide equally between CGST and SGST
                $cgst = $gstAmount / 2;
                $sgst = $gstAmount / 2;
            }
        }

        // Calculate final total amount
        $itemTotalAmount = $taxableAmt + $cgst + $sgst;

        // // Step 2: Update the Summary Totals Before Deleting the Item
        // DB::table('purchases')->where('id', $purchaseItem->purchase_id)->update([
        //     'totalTaxableAmount' => DB::raw('totalTaxableAmount - ' . $taxableAmt),
        //     'cgst_amount' => DB::raw('cgst_amount - ' . max(0, $cgst)),
        //     'sgst_amount' => DB::raw('sgst_amount - ' . max(0, $sgst)),
        //     'igst_amount' => DB::raw('igst_amount - ' . max(0, $igst)),
        //     'totalDiscount' => DB::raw('totalDiscount - ' . $discountAmount),
        //     'totalAmount' => DB::raw('totalAmount - ' . $itemTotalAmount),
        //     'roundOff' => DB::raw('roundOff - ' . round($itemTotalAmount)),
        //     'roundOff_Value' => DB::raw('roundOff_Value - ROUND(' . ($itemTotalAmount - round($itemTotalAmount)) . ', 2)'),
        //     'payment' => DB::raw('payment - ' . round($itemTotalAmount)),
        // ]);

        // // Step 1: Delete the purchase item
        // DB::table('purchases_items')->where('id', $id)->delete();

        // // Step 2: Check if there are any remaining items for this purchase_id
        // $remainingItems = DB::table('purchases_items')->where('purchase_id', $purchaseItem->purchase_id)->count();

        // // Step 3: If no more items exist, delete the associated purchase record
        // if ($remainingItems == 0) {
        //     DB::table('purchases')->where('id', $purchaseItem->purchase_id)->delete();
        // }
        
        return response()->json([
            'totalTaxableAmount' => DB::raw('totalTaxableAmount - ' . $taxableAmt),
            'cgst_amount' => DB::raw('cgst_amount - ' . max(0, $cgst)),
            'sgst_amount' => DB::raw('sgst_amount - ' . max(0, $sgst)),
            'igst_amount' => DB::raw('igst_amount - ' . max(0, $igst)),
            'totalDiscount' => DB::raw('totalDiscount - ' . $discountAmount),
            'totalAmount' => DB::raw('totalAmount - ' . $itemTotalAmount),
            'roundOff' => DB::raw('roundOff - ' . round($itemTotalAmount)),
            'roundOff_Value' => DB::raw('roundOff_Value - ROUND(' . ($itemTotalAmount - round($itemTotalAmount)) . ', 2)'),
            'payment' => DB::raw('payment - ' . round($itemTotalAmount)),
        ]);

        // Commit the transaction
        DB::commit();

        // Return a success response
        return response()->json(['message' => 'Purchase item deleted successfully!'], 200);

    } catch (\Exception $e) {
        // Rollback the transaction if an error occurs
        DB::rollBack();

        // Return an error response
        return response()->json(['message' => 'Failed to delete purchase item: ' . $e->getMessage()], 500);
    }
}