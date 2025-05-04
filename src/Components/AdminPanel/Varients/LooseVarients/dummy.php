public function getAllloose_Varient()
{
    $Items = DB::table('Items')
        ->leftJoin('categories', 'Items.category_id', '=', 'categories.id')
        ->leftJoin('subcategories', 'Items.subCategory_id', '=', 'subcategories.id')
        ->leftJoin('sub_subcategories', 'Items.SubSubCategory_id', '=', 'sub_subcategories.id')
        ->select(
            'Items.id',
            'Items.ItemName as Item_ItemName',
            'Items.category_id',
            'Items.subCategory_id',
            'Items.SubSubCategory_id',
            'categories.name as category_name',
            DB::raw("CONCAT('" . asset('images/') . "/', categories.category_desktop_Image) as category_desktop_image_url"),
            DB::raw("CONCAT('" . asset('images/') . "/', categories.category_mobile_Image) as category_mobile_image_url"),
            'subcategories.name as subcategory_name',
            DB::raw("CONCAT('" . asset('images/') . "/', subcategories.desktop_image) as subcategory_desktop_image_url"),
            DB::raw("CONCAT('" . asset('images/') . "/', subcategories.mobile_image) as subcategory_mobile_image_url"),
            'sub_subcategories.name as sub_subcategory_name',
            DB::raw("CONCAT('" . asset('images/') . "/', sub_subcategories.image_path) as sub_subcategory_image_url")
        )
        ->get();

    // Check if any records were found
    if ($Items->isEmpty()) {
        return response()->json([
            'message' => 'No loose_variant records found',
        ]);
    }
    
    $finalData = [];

    // Fetch loose_variant data for each item
    foreach ($Items as $itemData) {
        $looseVarientData = DB::table('loose_variant')
            ->where('item_id', $itemData->id)
            ->leftJoin('purchases', 'loose_variant.purchases_id', '=', 'purchases.id')
            ->leftJoin('purchases_items', 'loose_variant.purchase_item_id', '=', 'purchases_items.id')
            ->leftJoin('si_units', 'loose_variant.quantity_unit', '=', 'si_units.id')
            ->leftJoin('loose_stock', 'loose_variant.loose_stock_id', '=', 'loose_stock.id')
            ->leftJoin('warehouse', 'loose_variant.warehouse_id', '=', 'warehouse.id')
            ->select(
                'loose_variant.id',
                'loose_variant.purchases_id',
                'loose_variant.purchase_item_id',
                'loose_variant.loose_stock_id',
                'loose_variant.sku_id',
                       'loose_variant.item_id',
                'loose_variant.quantity_unit',
                'loose_variant.quantity_per_packet',
                'loose_variant.price',
                'loose_variant.discount_percentage',
                'loose_variant.discount_price',
                'loose_variant.selling_price',
                'loose_variant.Available_in_packet',
                'loose_variant.image_path',
                'loose_variant.limit_per_order',
                'loose_variant.warehouse_id',
                'purchases_items.ItemName as purchases_ItemName',
                'si_units.unit',
                'loose_stock.stock_type',
                'warehouse.warehouse_name'
            )
            ->get();

        // Add image URL to each loose_variant record
        foreach ($looseVarientData as $data) {
            $data->image_url = $data->image_path ? asset('images/' . $data->image_path) : null;
        }

        // Attach variants to each item
        $itemData->Variants = $looseVarientData;
        
            $finalData[] =      $itemData;
    }

    // Return the response
    return response()->json([
        'message' => 'All loose_variant retrieved successfully!',
        'data' => $finalData,
    ], 200);
}