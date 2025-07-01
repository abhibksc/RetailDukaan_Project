

********************* request has many values.. if i wannt to remove a key from that array... we can you "unset" .*************

eg :-

  $validatedData = $request->validate([
            'name' => 'required|string|max:255',
            'image' => 'required|image|mimes:jpeg,png,jpg,gif,webp',
            'status' => 'required|string',
            'pincode' => 'required|array',
            'pincode.*' => 'integer',
            
                'warehouse_ids' => 'required|array',
            'warehouse_ids.*' => 'integer|exists:warehouse,id',
        ]);


     $warehouseIds = $validatedData['warehouse_ids'];
        unset($validatedData['warehouse_ids']);

        now it is like...

        $validatedData = $request->validate([
            'name' => 'required|string|max:255',
            'image' => 'required|image|mimes:jpeg,png,jpg,gif,webp',
            'status' => 'required|string',
            'pincode' => 'required|array',
            'pincode.*' => 'integer',
        ]);


  **********************************************************************************

  ✅ 1. Arr::except() --> Removes multiple keys from an array.

  use Illuminate\Support\Arr;

$filtered = Arr::except($validatedData, ['warehouse_ids', 'pincode']);


✅ 2. Arr::only()
Keeps only specific keys from the array.
$insertData = Arr::only($validatedData, ['name', 'email', 'phone']);


✅ 3. array_merge()
Merges two arrays.
$finalData = array_merge($validatedData, ['status' => 'active']);

✅ 4. collect()
Convert array to Laravel Collection, then manipulate easily.
$collection = collect($validatedData)->except(['warehouse_ids', 'pincode'])->toArray();

✅ 5. request()->only() or request()->except()
Fetch only some inputs or exclude some directly from the request.
$data = request()->except(['token', '_method']);

✅ 6. array_filter()
Remove null or empty values.
$cleanData = array_filter($validatedData);

✅ 7. array_key_exists()
Check if key exists before using/unsetting.
if (array_key_exists('pincode', $validatedData)) {
    unset($validatedData['pincode']);
}

✅ 8. data_get()
Get a value from nested array using dot notation.
$value = data_get($validatedData, 'address.pincode');

✅ 9. data_set()
Set a value in a nested array using dot notation.
data_set($validatedData, 'address.pincode', '123456');

✅ 10. array_diff_key()
Exclude keys by comparing with another array.
$filtered = array_diff_key($validatedData, array_flip(['warehouse_ids', 'pincode']));



****************************************************************************************************************************************************

1."whereIn" funtion ---- This will fetch all products that belong to warehouse IDs 1, 2, or 3.

✅ Basic Usage of whereIn()

$warehouseIds = [1, 2, 3];

$products = DB::table('products')
              ->whereIn('warehouse_id', $warehouseIds)
              ->get();



✅ whereNotIn() — Opposite of whereIn()

$products = DB::table('products')
              ->whereNotIn('warehouse_id', $warehouseIds)
              ->get();



  ✅ With count() to Check "How Many" Items            


  $count = DB::table('products')
           ->whereIn('warehouse_id', $warehouseIds)
           ->count();



           ***************************************Diff Between Where and WhereIn************************

           🔹 where()  ---> Used for matching a single value . It checks if a column equals a specific value.

           DB::table('products')
             ->where('warehouse_id', 1)
             ->get();      
             ➡ Returns rows where warehouse_id = 1.


            🔹 whereIn() ---> Used for matching multiple values (array) . It checks if a column’s value is in a list of values.

            DB::table('products')
              ->whereIn('warehouse_id', [1, 2, 3])
              ->get();
              ➡ Returns rows where warehouse_id IN (1, 2, 3).


****************************************************************************************************************************************************

<span style="color:red">


      $groups = $groups->map(function ($group) use ($warehouses) {
        $group->image = asset('images/' . $group->image);
      $group->warehouses = $warehouses->get($group->group_id, collect())->values();

        return $group;
    });

    inside map .. the function is anonymous function.. and all anonymous funtion are called clouser in php. , but named function is not clouser ever remember!!!.

    inside map .. $warehouses is a external variable which we use inside anonumous funtion..

A named function in PHP is not a closure unless it captures variables from outside.



</span>  



****************************************************************************************************************************************************


<span style="color:red">

📝 **Laravel Collections - Summary Notes**

🔸 What is Collection?
- A Laravel Collection is an advanced wrapper for arrays.
- You get it using `collect()`, `Model::all()`, or `DB::table()->get()`.

🔸 Common Methods:

1. `pluck('key')` → Get values of a specific key  
   ➤ `$emails = $users->pluck('email');`

2. `where('key', 'value')` → Filter items  
   ➤ `$active = $users->where('status', 'active');`

3. `map(fn)` → Modify each item  
   ➤ `$users->map(fn($u) => $u->name = strtoupper($u->name));`

4. `filter(fn)` → Keep matching items  
   ➤ `$users->filter(fn($u) => $u->age > 18);`

5. `each(fn)` → Loop through  
   ➤ `$users->each(fn($u) => echo $u->name);`

6. `sortBy('key')` → Sort by key  
   ➤ `$users->sortBy('name');`

7. `groupBy('key')` → Group by key  
   ➤ `$users->groupBy('role_id');`

8. `values()` → Reset indexes  
   ➤ `$users->where(...)->values();`

9. `toArray()` / `toJson()` → Convert  
   ➤ `$users->toArray();`, `$users->toJson();`

10. `contains()` → Check if exists  
   ➤ `$users->contains('email', 'test@example.com');`

✅ Use Collections to write cleaner, readable, and chainable code in Laravel.

</span>



<!-- ********************** 
With these example i can understand groupBy....
****************************************************************************************************************************** -->

<!-- withous groupByy -->

   $warehouses = DB::table('main_group_warehouses as gwp')
        ->join('warehouse as w', 'gwp.warehouse_id', '=', 'w.id')
        ->whereIn('gwp.group_id', $groupIds)
        ->select('gwp.group_id', 'w.id as warehouse_id', 'w.warehouse_unique_id  as warehouse_unique_id', 'w.warehouse_name as warehouse_name')
        ->get()

result :-


[
  (object)[
    'group_id' => 1,
    'warehouse_id' => 101,
    'warehouse_unique_id' => 'WH001',
    'warehouse_name' => 'Delhi Warehouse'
  ],
  (object)[
    'group_id' => 1,
    'warehouse_id' => 102,
    'warehouse_unique_id' => 'WH002',
    'warehouse_name' => 'Noida Warehouse'
  ],
  (object)[
    'group_id' => 2,
    'warehouse_id' => 103,
    'warehouse_unique_id' => 'WH003',
    'warehouse_name' => 'Mumbai Warehouse'
  ],
  (object)[
    'group_id' => 3,
    'warehouse_id' => 104,
    'warehouse_unique_id' => 'WH004',
    'warehouse_name' => 'Chennai Warehouse'
  ],
  (object)[
    'group_id' => 3,
    'warehouse_id' => 105,
    'warehouse_unique_id' => 'WH005',
    'warehouse_name' => 'Bangalore Warehouse'
  ]
];


<!-- ✅ After .groupBy('group_id'), the $warehouses Collection becomes: -->

  $warehouses = DB::table('main_group_warehouses as gwp')
        ->join('warehouse as w', 'gwp.warehouse_id', '=', 'w.id')
        ->whereIn('gwp.group_id', $groupIds)
        ->select('gwp.group_id', 'w.id as warehouse_id', 'w.warehouse_unique_id  as warehouse_unique_id', 'w.warehouse_name as warehouse_name')
        ->get()
        ->groupBy('group_id');

        retsult :-

        collect([
  1 => collect([
    (object)[
      'group_id' => 1,
      'warehouse_id' => 101,
      'warehouse_unique_id' => 'WH001',
      'warehouse_name' => 'Delhi Warehouse'
    ],
    (object)[
      'group_id' => 1,
      'warehouse_id' => 102,
      'warehouse_unique_id' => 'WH002',
      'warehouse_name' => 'Noida Warehouse'
    ]
  ]),

  2 => collect([
    (object)[
      'group_id' => 2,
      'warehouse_id' => 103,
      'warehouse_unique_id' => 'WH003',
      'warehouse_name' => 'Mumbai Warehouse'
    ]
  ]),

  3 => collect([
    (object)[
      'group_id' => 3,
      'warehouse_id' => 104,
      'warehouse_unique_id' => 'WH004',
      'warehouse_name' => 'Chennai Warehouse'
    ],
    (object)[
      'group_id' => 3,
      'warehouse_id' => 105,
      'warehouse_unique_id' => 'WH005',
      'warehouse_name' => 'Bangalore Warehouse'
    ]
  ])
]);

*************************** we can use groupBy and make structure ok.. like this.. *************************** 


 $stockData = DB::table('packet_stock')
        ->leftJoin('purchases', 'packet_stock.purchase_id', '=', 'purchases.id')
        ->leftJoin('purchases_items', 'packet_stock.purchase_item_id', '=', 'purchases_items.id')
        ->leftJoin('loose_variant', 'packet_stock.loose_varient_id', '=', 'loose_variant.id')
        ->leftJoin('packet_variant', 'packet_stock.packet_variant_id', '=', 'packet_variant.id')
        ->leftJoin('si_units', 'packet_stock.si_units_id', '=', 'si_units.id')
        ->leftJoin('warehouse', 'packet_stock.warehouse_id', '=', 'warehouse.id')
        ->select(
            'warehouse.id as warehouse_id',
            'warehouse.warehouse_unique_id',
            'warehouse.warehouse_name',
            'warehouse.pin_code as warehouse_pin_code',
            'packet_stock.id as stock_id',
            'packet_stock.purchase_id',
            'packet_stock.purchase_item_id',
            'packet_stock.stock_type',
            'packet_stock.quantity',
            'packet_stock.price',
            'si_units.unit',
            'loose_variant.variantName as loosevariantName',
            'packet_variant.variantName as packetvariantName',
            'packet_variant.varient_type as varient_type'
        )
        ->get();

    // Group by warehouse_id and format output
    $grouped = $stockData->groupBy('warehouse_id')->map(function ($items) {
        $first = $items->first();
        return [
            'warehouse_id' => $first->warehouse_id,
            'warehouse_unique_id' => $first->warehouse_unique_id,
            'warehouse_name' => $first->warehouse_name,
            'warehouse_pin_code' => $first->warehouse_pin_code,
            'stocks' => $items->map(function ($item) {
                return [
                    'stock_id' => $item->stock_id,
                    'purchase_id' => $item->purchase_id,
                    'purchase_item_id' => $item->purchase_item_id,
                    'stock_type' => $item->stock_type,
                    'quantity' => $item->quantity,
                    'price' => $item->price,
                    'unit' => $item->unit,
                    'loosevariantName' => $item->loosevariantName,
                    'packetvariantName' => $item->packetvariantName,
                    'varient_type' => $item->varient_type
                ];
            })->values()
        ];
    })->values(); // Re-index the collection







