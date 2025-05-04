<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class Retrive_All_ItemController extends Controller
{

    public function getItems($id, $type)
    {
        $category = null;
        $category_type = null;

        if ($type === "SubCategory") {

            $subcategories = DB::table('subcategories')->where('id', $id)->first();
            $category = $subcategories;
            $category_type = "subCategory_id";


        } else if ($type === "SubSubCategory") {

            $sub_subcategories = DB::table('sub_subcategories')->where('id', $id)->first();

            $category = $sub_subcategories;
            $category_type = "SubSubCategory_id";


        }

        // Check if category exists
        if (!$category) {
            return response()->json(['error' => 'Category not found'], 404);
        }

        $packetVariants = DB::table('packet_stock')
            ->leftJoin('purchases', 'packet_stock.purchase_id', '=', 'purchases.id')
            ->leftJoin('purchases_items', 'packet_stock.purchase_item_id', '=', 'purchases_items.id')
            ->leftJoin('packet_variant', 'packet_stock.packet_variant_id', '=', 'packet_variant.id')
            ->leftJoin('loose_variant', 'packet_stock.loose_varient_id', '=', 'loose_variant.id') // Ensure this join is correct
            ->leftJoin('si_units', 'packet_stock.si_units_id', '=', 'si_units.id')
            ->leftJoin('brands as packetVariant_brand', 'packet_variant.brand_id', '=', 'packetVariant_brand.id')
            ->leftJoin('brands as looseVariant_brand', 'loose_variant.brand_id', '=', 'looseVariant_brand.id')
             ->leftJoin('Items', 'packet_stock.item_id', '=', 'Items.id')
            ->leftJoin('Items as packetVariant_item', 'packet_variant.id', '=', 'packetVariant_item.id')
            ->leftJoin('Items as looseVariant_item', 'loose_variant.id', '=', 'looseVariant_item.id')
            ->where("Items.{$category_type}", $category->id)
            ->select(
                'packet_stock.id as packetStockId',
                'packet_stock.purchase_id',
                'packet_stock.purchase_item_id',
                'packet_stock.stock_type',
                'packet_stock.quantity',
                'packet_stock.price',
                'packet_stock.si_units_id',
                'packet_variant.id as packetVarient_Id',
                'packet_variant.variantName as packetVarientName',
                'packet_variant.sku_id as packetVarientsku_id',
                'packet_variant.limit_per_order as packetVarient_limit_per_order',
                'packet_variant.Status as packetVarient_status',
                'loose_variant.id as loose_variant_Id',
                'loose_variant.variantName as loose_variantName',
                'loose_variant.sku_id as loose_variantsku_id',
                'loose_variant.limit_per_order as loose_variant_limit_per_order',
                'loose_variant.Status as loose_variant_status',
                'si_units.id as unit_id',
                'si_units.unit as unitName',
                'packetVariant_brand.brand_name as packetVariantBrandName',
                'looseVariant_brand.brand_name as looseVariantBrandName',
                'packetVariant_item.ItemName as packetVariant_ItemName',
                'looseVariant_item.ItemName as looseVariant_ItemName',

                'packetVariant_item.id as packetVariant_id',
                'looseVariant_item.id as looseVariant_id'
            )
            ->get();


        // return response()->json([$category_type , $category->id,$packetVariants]);



        $looseVariants = DB::table('loose_stock')
            ->leftJoin('purchases', 'loose_stock.purchase_id', '=', 'purchases.id')
            ->leftJoin('purchases_items', 'loose_stock.purchase_item_id', '=', 'purchases_items.id')
            ->leftJoin('packet_variant', 'loose_stock.packet_variant_id', '=', 'packet_variant.id')
            ->leftJoin('loose_variant', 'loose_stock.loose_varient_id', '=', 'loose_variant.id') // Ensure this join is correct
            ->leftJoin('si_units', 'loose_stock.si_units_id', '=', 'si_units.id')
            ->leftJoin('brands as packetVariant_brand', 'packet_variant.brand_id', '=', 'packetVariant_brand.id')
            ->leftJoin('brands as looseVariant_brand', 'loose_variant.brand_id', '=', 'looseVariant_brand.id')
            
            ->leftJoin('Items', 'loose_stock.item_id', '=', 'Items.id')
            
            
            
            ->leftJoin('Items as packetVariant_item', 'packet_variant.id', '=', 'packetVariant_item.id')
            ->leftJoin('Items as looseVariant_item', 'loose_variant.id', '=', 'looseVariant_item.id')
             ->where("Items.{$category_type}", $category->id)
            ->select(
                'loose_stock.id as packetStockId',
                'loose_stock.purchase_id',
                'loose_stock.purchase_item_id',
                'loose_stock.stock_type',
                'loose_stock.quantity',
                'loose_stock.price',
                'loose_stock.si_units_id',
                'packet_variant.id as packetVarient_Id',
                'packet_variant.variantName as packetVarientName',
                'packet_variant.sku_id as packetVarientsku_id',
                'packet_variant.limit_per_order as packetVarient_limit_per_order',
                'packet_variant.Status as packetVarient_status',
                'loose_variant.id as loose_variant_Id',
                'loose_variant.variantName as loose_variantName',
                'loose_variant.sku_id as loose_variantsku_id',
                'loose_variant.limit_per_order as loose_variant_limit_per_order',
                'loose_variant.Status as loose_variant_status',
                'si_units.id as unit_id',
                'si_units.unit as unitName',
                'packetVariant_brand.brand_name as packetVariantBrandName',
                'looseVariant_brand.brand_name as looseVariantBrandName',
                'packetVariant_item.ItemName as packetVariant_ItemName',
                'looseVariant_item.ItemName as looseVariant_ItemName'
            )
            ->get();

        // //   return response()->json([$category_type , $category->id,$packetVariants,$looseVariants]);

        $items = [];

        if ($packetVariants->isNotEmpty()) {


            $packet_images = DB::table('packet_varient_image')->select('packet_variant_id', 'image_path')->get()->groupBy('packet_variant_id');


            foreach ($packetVariants as $variant) {
                $images = [];
                $specifications = [];
                $purchase_Item = "";
                if (isset($variant->packetVarient_Id)) {

                    $images = isset($packet_images[$variant->packetVarient_Id])
                        ? $packet_images[$variant->packetVarient_Id]->pluck("image_path")->map(function ($imagePath) {
                            return asset($imagePath);
                        })->toArray()
                        : [];

                    $specifications = DB::table('packet_variant_Specification')->where('packet_variant_id', $variant->packetVarient_Id)->select(
                        "id",
                        "key",
                        "value"
                    )->get();


                    $purchase_Item = DB::table('purchases_items')
                        ->where('packet_varient_id', $variant->packetVarient_Id)
                        ->leftJoin('si_units', 'purchases_items.unit_Id', '=', 'si_units.id')
                        ->select(
                            'purchases_items.id as purchases_id',
                            'purchases_items.packet_varient_id as packet_varient_id',
                            'purchases_items.varient_type',
                            'purchases_items.quantity',
                            'purchases_items.unit_Id',
                            'si_units.unit',
                            'purchases_items.quantity_perPacket as quantity_perPacket',
                            'purchases_items.sellingPrice as sellingPrice',
                            'purchases_items.discount_percentage_in_mrp as discount_percentage_in_mrp',
                            'purchases_items.mrp'
                        )
                        ->first();


                } 
                else if (isset($variant->loose_variant_Id)) {
                    $looseImage = DB::table('loose_variant')
                        ->where('id', $variant->loose_variant_Id)
                        ->select('image_path')
                        ->first();
                    if ($looseImage && $looseImage->image_path) {
                        $images = asset('images/' . $looseImage->image_path);
                    }
                    $specifications = DB::table('loose_variant_Specification')->where('loose_variant_id', $variant->loose_variant_Id)->select(
                        "id",
                        "key",
                        "value"
                    )->get();

                    $purchase_Item = DB::table('purchases_items')
                        ->where('loose_varient_id', $variant->loose_variant_Id)
                        ->leftJoin('si_units', 'purchases_items.unit_Id', '=', 'si_units.id')
                        ->select(
                            'purchases_items.id as purchases_id',
                            'purchases_items.packet_varient_id as packet_varient_id',
                            'purchases_items.varient_type',
                            'purchases_items.quantity',
                            'purchases_items.unit_Id',
                            'si_units.unit',
                            'purchases_items.quantity_perPacket as quantity_perPacket',
                            'purchases_items.sellingPrice as sellingPrice',
                            'purchases_items.discount_percentage_in_mrp as discount_percentage_in_mrp',
                            'purchases_items.mrp'
                        )
                        ->first();
                }
                if ($purchase_Item) {

                    $item = [

                        'ItemName' => $variant->packetVariant_ItemName ?? $variant->looseVariant_ItemName,
                        'Item_Id' => $variant->packetVariant_id ?? $variant->looseVariant_id,
                        'variantName' => $variant->loose_variantName ?? $variant->packetVarientName,
                        'variant_id' => $variant->packetVarient_Id ?? $variant->loose_variant_Id,


                        'stock_type' => 'packet',
                        'brand' => $variant->packetVariantBrandName ?? $variant->looseVariantBrandName,
                        'sku_id' => $variant->packetVarientsku_id ?? $variant->loose_variantsku_id,

                        'quantity' => intval($purchase_Item->quantity ?? 0), // Provide a default value
                        'quantity/pct' => $purchase_Item->quantity_perPacket ?? 0,
                        'sellingPrice' => intval($purchase_Item->sellingPrice) ?? 0,
                        'mrp' => intval($purchase_Item->mrp) ?? 0,
                        'discount_percentage_in_mrp' => intval($purchase_Item->discount_percentage_in_mrp) ?? 0,
                        'unit' => $purchase_Item->unit ?? 'N/A',
                        'si_unit_id' => $purchase_Item->unit_Id ?? null,
                        'limit_per_order' => $variant->packetVarient_limit_per_order ?? $variant->loose_variant_limit_per_order,
                        'images' => $images,
                        'specifications' => $specifications,
                        // 'category' => [
                        //     'categoryName' => $variant->categoryName,
                        //     'subCategoryName' => $variant->subCategoryName,
                        //     'subSubCategoryName' => $variant->subSubCategoryName,
                        //     'category_id' => $variant->category_id,
                        //     'subCategory_id' => $variant->subCategory_id,
                        //     'sub_subCategory_id' => $variant->SubSubCategory_id,
                        // ],
                        'Variants' => [], // Initialize an empty Variants array

                    ];

                    // // // Fetch and assign all related variants to the Variants array
                    $relatedVariants = DB::table('packet_stock')
                        ->leftJoin('purchases', 'packet_stock.purchase_id', '=', 'purchases.id')
                        ->leftJoin('purchases_items', 'packet_stock.purchase_item_id', '=', 'purchases_items.id')
                        ->leftJoin('packet_variant', 'packet_stock.packet_variant_id', '=', 'packet_variant.id')
                        ->leftJoin('loose_variant', 'packet_stock.loose_varient_id', '=', 'loose_variant.id') // Ensure the field name is correct
                        ->leftJoin('si_units', 'packet_stock.si_units_id', '=', 'si_units.id')
                        ->leftJoin('brands as packetVariant_brand', 'packet_variant.brand_id', '=', 'packetVariant_brand.id')
                        ->leftJoin('brands as looseVariant_brand', 'loose_variant.brand_id', '=', 'looseVariant_brand.id')
                        
                         ->leftJoin('Items', 'packet_stock.item_id', '=', 'Items.id')
                         
                        ->leftJoin('Items as packetVariant_item', 'packet_variant.id', '=', 'packetVariant_item.id')
                        ->leftJoin('Items as looseVariant_item', 'loose_variant.id', '=', 'looseVariant_item.id')
                             ->where("Items.{$category_type}", $category->id)
                        ->select(
                            'packet_stock.id as packetStockId',
                            'packet_stock.purchase_id',
                            'packet_stock.purchase_item_id',
                            'packet_stock.stock_type',
                            'packet_stock.quantity',
                            'packet_stock.price',
                            'packet_stock.si_units_id',
                            'packet_variant.id as packetVarient_Id',
                            'packet_variant.variantName as packetVarientName',
                            'packet_variant.sku_id as packetVarientsku_id',
                            'packet_variant.limit_per_order as packetVarient_limit_per_order',
                            'packet_variant.Status as packetVarient_status',
                            'loose_variant.id as loose_variant_Id',
                            'loose_variant.variantName as loose_variantName',
                            'loose_variant.sku_id as loose_variantsku_id',
                            'loose_variant.limit_per_order as loose_variant_limit_per_order',
                            'loose_variant.Status as loose_variant_status',
                            'si_units.id as unit_id',
                            'si_units.unit as unitName',
                            'packetVariant_brand.brand_name as packetVariantBrandName',
                            'looseVariant_brand.brand_name as looseVariantBrandName',
                            'packetVariant_item.ItemName as packetVariant_ItemName',
                            'looseVariant_item.ItemName as looseVariant_ItemName',
                            'packetVariant_item.id as packetVariant_id',
                            'looseVariant_item.id as looseVariant_id'
                        )
                        ->get();


                    $Varient_items = [];

                    if ($relatedVariants->isNotEmpty()) {

                        $v_packet_images = DB::table('packet_varient_image')->select('packet_variant_id', 'image_path')->get()->groupBy('packet_variant_id');

                        foreach ($relatedVariants as $v_variant) {

                            $v_images = [];

                            $v_specifications = [];

                            $v_purchase_Item = "";

                            if (isset($v_variant->packetVarient_Id)) {

                            $v_images = isset($v_packet_images[$v_variant->packetVarient_Id])
                                    ? $v_packet_images[$v_variant->packetVarient_Id]->pluck("image_path")->map(function ($imagePath) {
                                        return asset($imagePath);
                                    })->toArray()
                                    : [];

                            $v_specifications = DB::table('packet_variant_Specification')->where('packet_variant_id', $v_variant->packetVarient_Id)->select(
                                    "id",
                                    "key",
                                    "value"
                                )->get();


                                $v_purchase_Item = DB::table('purchases_items')
                                    ->where('packet_varient_id', $v_variant->packetVarient_Id)
                                    ->leftJoin('si_units', 'purchases_items.unit_Id', '=', 'si_units.id')
                                    ->select(
                                        'purchases_items.id as purchases_id',
                                        'purchases_items.packet_varient_id as packet_varient_id',
                                        'purchases_items.varient_type',
                                        'purchases_items.quantity',
                                        'purchases_items.unit_Id',
                                        'si_units.unit',
                                        'purchases_items.quantity_perPacket as quantity_perPacket',
                                        'purchases_items.sellingPrice as sellingPrice',
                                        'purchases_items.discount_percentage_in_mrp as discount_percentage_in_mrp',
                                        'purchases_items.mrp'
                                    )
                                    ->first();


                            } 
                            
                            else if (isset($v_variant->loose_variant_Id)) {
                                $v_looseImage = DB::table('loose_variant')
                                    ->where('id', $v_variant->loose_variant_Id)
                                    ->select('image_path')
                                    ->first();
                                if ($v_looseImage && $v_looseImage->image_path) {
                                    $v_images = asset('images/' . $v_looseImage->image_path);
                                }

                                $v_specifications = DB::table('loose_variant_Specification')->where('loose_variant_id', $v_variant->loose_variant_Id)->select(
                                    "id",
                                    "key",
                                    "value"
                                )->get();

                                $v_purchase_Item = DB::table('purchases_items')
                                    ->where('loose_varient_id', $v_variant->loose_variant_Id)
                                    ->leftJoin('si_units', 'purchases_items.unit_Id', '=', 'si_units.id')
                                    ->select(
                                        'purchases_items.id as purchases_id',
                                        'purchases_items.packet_varient_id as packet_varient_id',
                                        'purchases_items.varient_type',
                                        'purchases_items.quantity',
                                        'purchases_items.unit_Id',
                                        'si_units.unit',
                                        'purchases_items.quantity_perPacket as quantity_perPacket',
                                        'purchases_items.sellingPrice as sellingPrice',
                                        'purchases_items.discount_percentage_in_mrp as discount_percentage_in_mrp',
                                        'purchases_items.mrp'
                                    )
                                    ->first();
                            }

                            //   return response()->json($v_purchase_Item);

                            if ($v_purchase_Item) {
                                $v_item = [

                                    'ItemName' => $variant->packetVariant_ItemName ?? $variant->looseVariant_ItemName,
                                    'Item_Id' => $variant->packetVariant_id ?? $variant->looseVariant_id,
                                    'variantName' => $variant->loose_variantName ?? $variant->packetVarientName,
                                    'variant_id' => $variant->packetVarient_Id ?? $variant->loose_variant_Id,


                                    'stock_type' => 'packet',
                                    'brand' => $variant->packetVariantBrandName ?? $variant->looseVariantBrandName,
                                    'sku_id' => $variant->packetVarientsku_id ?? $variant->loose_variantsku_id,

                                    'quantity' => intval($purchase_Item->quantity ?? 0), // Provide a default value
                                    'quantity/pct' => $purchase_Item->quantity_perPacket ?? 0,
                                    'sellingPrice' => intval($purchase_Item->sellingPrice) ?? 0,
                                    'mrp' => intval($purchase_Item->mrp) ?? 0,
                                    'discount_percentage_in_mrp' => intval($purchase_Item->discount_percentage_in_mrp) ?? 0,
                                    'unit' => $purchase_Item->unit ?? 'N/A',
                                    'si_unit_id' => $purchase_Item->unit_Id ?? null,
                                    'limit_per_order' => $variant->packetVarient_limit_per_order ?? $variant->loose_variant_limit_per_order,
                                    'images' => $images,
                                    'specifications' => $specifications
                                ];
                                $item['Variants'][] = $v_item;

                            }
                            
                            
                          
                            
                            
                            
                            
                            
                            
                            
                            

                        }
                        
                        
                        
                          $items[] = $item;


                    }
                }
            }
            
            

  






        }
        
        if ($looseVariants->isNotEmpty()) {
            
            // return response()->json($looseVariants);


            $packet_images = DB::table('packet_varient_image')->select('packet_variant_id', 'image_path')->get()->groupBy('packet_variant_id');


            foreach ($looseVariants as $variant) {
                
                // return response()->json($looseVariants);

                $images = [];

                $specifications = [];

                $purchase_Item = "";

                if (isset($variant->packetVarient_Id)) {

                    $images = isset($packet_images[$variant->packetVarient_Id])
                        ? $packet_images[$variant->packetVarient_Id]->pluck("image_path")->map(function ($imagePath) {
                            return asset($imagePath);
                        })->toArray()
                        : [];

                    $specifications = DB::table('packet_variant_Specification')->where('packet_variant_id', $variant->packetVarient_Id)->select(
                        "id",
                        "key",
                        "value"
                    )->get();

                    $purchase_Item = DB::table('purchases_items')
                        ->where('packet_varient_id', $variant->packetVarient_Id)
                        ->leftJoin('si_units', 'purchases_items.unit_Id', '=', 'si_units.id')
                        ->select(
                            'purchases_items.id as purchases_id',
                            'purchases_items.packet_varient_id as packet_varient_id',
                            'purchases_items.varient_type',
                            'purchases_items.quantity',
                            'purchases_items.unit_Id',
                            'si_units.unit',
                            'purchases_items.quantity_perPacket as quantity_perPacket',
                            'purchases_items.sellingPrice as sellingPrice',
                            'purchases_items.discount_percentage_in_mrp as discount_percentage_in_mrp',
                            'purchases_items.mrp'
                        )
                        ->first();
                        // return response()->json($purchase_Item);


                } 
                
                else if (isset($variant->loose_variant_Id)) {
                    $looseImage = DB::table('loose_variant')
                        ->where('id', $variant->loose_variant_Id)
                        ->select('image_path')
                        ->first();
                    if ($looseImage && $looseImage->image_path) {
                        $images = asset('images/' . $looseImage->image_path);
                    }
                    $specifications = DB::table('loose_variant_Specification')->where('loose_variant_id', $variant->loose_variant_Id)->select(
                        "id",
                        "key",
                        "value"
                    )->get();

                    $purchase_Item = DB::table('purchases_items')
                        ->where('loose_varient_id', $variant->loose_variant_Id)
                        ->leftJoin('si_units', 'purchases_items.unit_Id', '=', 'si_units.id')
                        ->select(
                            'purchases_items.id as purchases_id',
                            'purchases_items.packet_varient_id as packet_varient_id',
                            'purchases_items.varient_type',
                            'purchases_items.quantity',
                            'purchases_items.unit_Id',
                            'si_units.unit',
                            'purchases_items.quantity_perPacket as quantity_perPacket',
                            'purchases_items.sellingPrice as sellingPrice',
                            'purchases_items.discount_percentage_in_mrp as discount_percentage_in_mrp',
                            'purchases_items.mrp'
                        )
                        ->first();
                }

                if ($purchase_Item) {

                    $item = [

                        'ItemName' => $variant->packetVariant_ItemName ?? $variant->looseVariant_ItemName,
                        'Item_Id' => $variant->packetVarient_Id ?? $variant->loose_variant_Id,
                        'variantName' => $variant->loose_variantName ?? $variant->packetVarientName,
                        'variant_id' => $variant->packetVarient_Id ?? $variant->loose_variant_Id,


                        'stock_type' => 'loose',
                        'brand' => $variant->packetVariantBrandName ?? $variant->looseVariantBrandName,
                        'sku_id' => $variant->packetVarientsku_id ?? $variant->loose_variantsku_id,

                        'quantity' => intval($purchase_Item->quantity ?? 0), // Provide a default value
                        'quantity/pct' => $purchase_Item->quantity_perPacket ?? 0,
                        'sellingPrice' => intval($purchase_Item->sellingPrice) ?? 0,
                        'mrp' => intval($purchase_Item->mrp) ?? 0,
                        'discount_percentage_in_mrp' => intval($purchase_Item->discount_percentage_in_mrp) ?? 0,
                        'unit' => $purchase_Item->unit ?? 'N/A',
                        'si_unit_id' => $purchase_Item->unit_Id ?? null,
                        'limit_per_order' => $variant->packetVarient_limit_per_order ?? $variant->loose_variant_limit_per_order,
                        'images' => $images,
                        'specifications' => $specifications,
                        // 'category' => [
                        //     'categoryName' => $variant->categoryName,
                        //     'subCategoryName' => $variant->subCategoryName,
                        //     'subSubCategoryName' => $variant->subSubCategoryName,
                        //     'category_id' => $variant->category_id,
                        //     'subCategory_id' => $variant->subCategory_id,
                        //     'sub_subCategory_id' => $variant->SubSubCategory_id,
                        // ],
                        // 'Variants' => [], // Initialize an empty Variants array

                    ];

            //         // // // Fetch and assign all related variants to the Variants array
                    $relatedVariants = DB::table('loose_stock')
              ->leftJoin('purchases', 'loose_stock.purchase_id', '=', 'purchases.id')
              ->leftJoin('purchases_items', 'loose_stock.purchase_item_id', '=', 'purchases_items.id')
              ->leftJoin('packet_variant', 'loose_stock.packet_variant_id', '=', 'packet_variant.id')
              ->leftJoin('loose_variant', 'loose_stock.loose_varient_id', '=', 'loose_variant.id') // Ensure this join is correct
              ->leftJoin('si_units', 'loose_stock.si_units_id', '=', 'si_units.id')
              ->leftJoin('brands as packetVariant_brand', 'packet_variant.brand_id', '=', 'packetVariant_brand.id')
              ->leftJoin('brands as looseVariant_brand', 'loose_variant.brand_id', '=', 'looseVariant_brand.id')
              ->leftJoin('Items as packetVariant_item', 'packet_variant.id', '=', 'packetVariant_item.id')
              ->leftJoin('Items as looseVariant_item', 'loose_variant.id', '=', 'looseVariant_item.id')
              ->leftJoin('Items', 'loose_stock.item_id', '=', 'Items.id')
              ->where("Items.{$category_type}", $category->id)
              ->select(
                'loose_stock.id as packetStockId',
                'loose_stock.purchase_id',
                'loose_stock.purchase_item_id',
                'loose_stock.stock_type',
                'loose_stock.quantity',
                'loose_stock.price',
                'loose_stock.si_units_id',
                'packet_variant.id as packetVarient_Id',
                'packet_variant.variantName as packetVarientName',
                'packet_variant.sku_id as packetVarientsku_id',
                'packet_variant.limit_per_order as packetVarient_limit_per_order',
                'packet_variant.Status as packetVarient_status',
                'loose_variant.id as loose_variant_Id',
                'loose_variant.variantName as loose_variantName',
                'loose_variant.sku_id as loose_variantsku_id',
                'loose_variant.limit_per_order as loose_variant_limit_per_order',
                'loose_variant.Status as loose_variant_status',
                'si_units.id as unit_id',
                'si_units.unit as unitName',
                'packetVariant_brand.brand_name as packetVariantBrandName',
                'looseVariant_brand.brand_name as looseVariantBrandName',
                'packetVariant_item.ItemName as packetVariant_ItemName',
                'looseVariant_item.ItemName as looseVariant_ItemName'
            )
            ->get();


                    $Varient_items = [];

                    if ($relatedVariants->isNotEmpty()) {

                        $v_packet_images = DB::table('packet_varient_image')->select('packet_variant_id', 'image_path')->get()->groupBy('packet_variant_id');

                        foreach ($relatedVariants as $v_variant) {

                            $v_images = [];

                            $v_specifications = [];

                            $v_purchase_Item = "";

                            if (isset($v_variant->packetVarient_Id)) {

                            $v_images = isset($v_packet_images[$v_variant->packetVarient_Id])
                                    ? $v_packet_images[$v_variant->packetVarient_Id]->pluck("image_path")->map(function ($imagePath) {
                                        return asset($imagePath);
                                    })->toArray()
                                    : [];

                            $v_specifications = DB::table('packet_variant_Specification')->where('packet_variant_id', $v_variant->packetVarient_Id)->select(
                                    "id",
                                    "key",
                                    "value"
                                )->get();

                            $v_purchase_Item = DB::table('purchases_items')
                                    ->where('packet_varient_id', $v_variant->packetVarient_Id)
                                    ->leftJoin('si_units', 'purchases_items.unit_Id', '=', 'si_units.id')
                                    ->select(
                                        'purchases_items.id as purchases_id',
                                        'purchases_items.packet_varient_id as packet_varient_id',
                                        'purchases_items.varient_type',
                                        'purchases_items.quantity',
                                        'purchases_items.unit_Id',
                                        'si_units.unit',
                                        'purchases_items.quantity_perPacket as quantity_perPacket',
                                        'purchases_items.sellingPrice as sellingPrice',
                                        'purchases_items.discount_percentage_in_mrp as discount_percentage_in_mrp',
                                        'purchases_items.mrp'
                                    )
                                    ->first();


                            } 
                            
                            else if (isset($v_variant->loose_variant_Id)) {
                            $v_looseImage = DB::table('loose_variant')
                                    ->where('id', $v_variant->loose_variant_Id)
                                    ->select('image_path')
                                    ->first();
                            if ($v_looseImage && $v_looseImage->image_path) {
                                    $v_images = asset('images/' . $v_looseImage->image_path);
                                }

                            $v_specifications = DB::table('loose_variant_Specification')->where('loose_variant_id', $v_variant->loose_variant_Id)->select(
                                    "id",
                                    "key",
                                    "value"
                                )->get();

                            $v_purchase_Item = DB::table('purchases_items')
                            ->where('loose_varient_id', $v_variant->loose_variant_Id)
                            ->leftJoin('si_units', 'purchases_items.unit_Id', '=', 'si_units.id')
                            ->select(
                                        'purchases_items.id as purchases_id',
                                        'purchases_items.packet_varient_id as packet_varient_id',
                                        'purchases_items.varient_type',
                                        'purchases_items.quantity',
                                        'purchases_items.unit_Id',
                                        'si_units.unit',
                                        'purchases_items.quantity_perPacket as quantity_perPacket',
                                        'purchases_items.sellingPrice as sellingPrice',
                                        'purchases_items.discount_percentage_in_mrp as discount_percentage_in_mrp',
                                        'purchases_items.mrp'
                                    )
                            ->first();
                            }

                            //   return response()->json($v_purchase_Item);

                            if ($v_purchase_Item) {
                                
                                $v_item = [

                                    'ItemName' => $variant->packetVariant_ItemName ?? $variant->looseVariant_ItemName,
                                    'Item_Id' => $variant->packetVarient_Id ?? $variant->loose_variant_Id,
                                    'variantName' => $variant->loose_variantName ?? $variant->packetVarientName,
                                    'variant_id' => $variant->packetVarient_Id ?? $variant->loose_variant_Id,


                                    'stock_type' => 'packet',
                                    'brand' => $variant->packetVariantBrandName ?? $variant->looseVariantBrandName,
                                    'sku_id' => $variant->packetVarientsku_id ?? $variant->loose_variantsku_id,

                                    'quantity' => intval($purchase_Item->quantity ?? 0), // Provide a default value
                                    'quantity/pct' => $purchase_Item->quantity_perPacket ?? 0,
                                    'sellingPrice' => intval($purchase_Item->sellingPrice) ?? 0,
                                    'mrp' => intval($purchase_Item->mrp) ?? 0,
                                    'discount_percentage_in_mrp' => intval($purchase_Item->discount_percentage_in_mrp) ?? 0,
                                    'unit' => $purchase_Item->unit ?? 'N/A',
                                    'si_unit_id' => $purchase_Item->unit_Id ?? null,
                                    'limit_per_order' => $variant->packetVarient_limit_per_order ?? $variant->loose_variant_limit_per_order,
                                    'images' => $images,
                                    'specifications' => $specifications
                                ];
                                $item['Variants'][] = $v_item;


                            }
                            

                        }
                        
                        
                        
                          $items[] = $item;


                    }
                    
                    
                    
                    
                }

            }


        }
        
        
        return response()->json($items);
        
        

    }



    public function getAllStockItems()
    {
        // Fetch stock items with necessary joins and attributes
        $purchases_items = DB::table('purchases_items')
            ->leftJoin('purchases', 'purchases_items.purchase_id', '=', 'purchases.id')
            ->leftJoin('Items', 'purchases_items.item_id', '=', 'Items.id')
            ->leftJoin('packet_variant', 'purchases_items.packet_varient_id', '=', 'packet_variant.id')
            ->leftJoin('loose_variant', 'purchases_items.loose_varient_id', '=', 'loose_variant.id')
            ->leftJoin('brands as packetVarientBrand', 'packet_variant.brand_id', '=', 'packetVarientBrand.id')
            ->leftJoin('brands as looseVarientBrand', 'loose_variant.brand_id', '=', 'looseVarientBrand.id')
            ->leftJoin('si_units as unit', 'purchases_items.unit_Id', '=', 'unit.id')
            // ->leftJoin('si_units as packet_unit', 'purchases_items.quantityPerPacketUnit', '=', 'packet_unit.id')
            ->leftJoin('gst_table', 'purchases_items.gstRate_id', '=', 'gst_table.id')
            ->select([

                'Items.ItemName as ItemName',
                'purchases_items.id as id',
                'purchases_items.purchase_id',
                'purchases_items.item_id',
                'purchases_items.packet_varient_id',
                'purchases_items.loose_varient_id',
                'purchases_items.varient_type',
                'purchases_items.batchNo',
                'purchases_items.HSN',
                'purchases_items.quantity',
                'purchases_items.unit_Id',
                'purchases_items.quantity_perPacket',
                'purchases_items.cost_per_unit',
                'purchases_items.sellingPrice',
                'purchases_items.gstRate_Id',
                'purchases_items.mrp',
                'purchases_items.discount_percentage_in_mrp',
                'purchases_items.Totalcost',
                'purchases_items.discountPercent',
                'purchases_items.discount',
                'purchases_items.Line_Total',
                'purchases_items.gstAmount',
                'purchases_items.mfgDate',
                'purchases_items.expiryDate',
                'packetVarientBrand.brand_name as packetVarientBrand_name',
                'looseVarientBrand.brand_name as looseVarientBrand_name',


                'packet_variant.variantName as packetvariantName',
                'loose_variant.variantName as loosevariantName',

                'packet_variant.Status as packetVarientStatus',
                'loose_variant.Status as looseVarientStatus',


                'unit.unit as unit_name',
                'unit.value as unit_value',
                'unit.parent_id as unit_parent_id',
                'packet_variant.sku_id as packet_variant_sku',
                'loose_variant.sku_id as loose_variant_sku',
                'gst_table.gst_title',
                'gst_table.value as gst_value',
            ])
            ->get();

        // Return the response
        return response()->json([
            'message' => 'Stock items retrieved successfully!',
            'data' => $purchases_items
        ]);
    }



    public function getAllVarients()
    {
        // Fetch packet variants with related purchase items
        $packetVariants = DB::table('packet_variant')
            ->leftJoin('brands', 'packet_variant.brand_id', '=', 'brands.id')
            ->leftJoin('Items', 'packet_variant.item_id', '=', 'Items.id')
            ->select(
                'packet_variant.id as variant_id',
                'packet_variant.item_id',
                'packet_variant.brand_id',
                'packet_variant.variantName',
                'packet_variant.sku_id',
                'packet_variant.varient_type',
                'packet_variant.limit_per_order',
                'packet_variant.Status',
                'brands.brand_name'
            )
            ->get()
            ->map(function ($variant) {
                // Fetch related purchase items for each packet variant
                $variant->itemDetails = DB::table('purchases_items')
                    ->where('purchases_items.packet_varient_id', $variant->variant_id)
                    ->leftJoin('si_units', 'purchases_items.unit_Id', '=', 'si_units.id')
                    ->select(
                        'purchases_items.id as id',
                        'purchases_items.packet_varient_id',
                        'purchases_items.varient_type',
                        'purchases_items.HSN',
                        'purchases_items.quantity',
                        'purchases_items.quantity_perPacket',
                        'purchases_items.mrp',
                        'purchases_items.sellingPrice',
                        'purchases_items.mfgDate',
                        'purchases_items.expiryDate',
                        'si_units.unit as unitName'
                    )
                    ->get();
                return $variant;
            });

        // Fetch loose variants with related purchase items
        $looseVariants = DB::table('loose_variant')
            ->leftJoin('brands', 'loose_variant.brand_id', '=', 'brands.id')
            ->leftJoin('Items', 'loose_variant.item_id', '=', 'Items.id')
            ->select(
                'loose_variant.id as variant_id',
                'loose_variant.item_id',
                'loose_variant.brand_id',
                'loose_variant.variantName',
                'loose_variant.sku_id',
                'loose_variant.varient_type',
                'loose_variant.limit_per_order',
                'loose_variant.Status',
                'brands.brand_name'
            )
            ->get()
            ->map(function ($variant) {
                // Fetch related purchase items for each loose variant
                $variant->itemDetails = DB::table('purchases_items')
                    ->where('loose_varient_id', $variant->variant_id)
                    ->leftJoin('si_units', 'purchases_items.unit_Id', '=', 'si_units.id')
                    ->select(
                        'purchases_items.id as id',
                        'purchases_items.packet_varient_id',
                        'purchases_items.varient_type',
                        'purchases_items.HSN',
                        'purchases_items.quantity',
                        'purchases_items.quantity_perPacket',
                        'purchases_items.mrp',
                        'purchases_items.sellingPrice',
                        'purchases_items.mfgDate',
                        'purchases_items.expiryDate',
                        'si_units.unit as unitName'
                    )
                    ->get();
                return $variant;
            });

        // Merge and filter for unique ItemNames
        $items = array_merge($packetVariants->toArray(), $looseVariants->toArray());

        // Return response as JSON
        return response()->json([
            'items' => $items,
            'message' => 'All variants successfully retrieved',
        ]);
    }





}
