const handleFormSubmit =  (e) => {
    e.preventDefault();

    console.log("chala");
    

    const formData = {
      purchases_id,
      purchase_item_id,
      loose_stock_id,
      category_id,
      subCategory_id,
      sub_subCategory_id,
      warehouse_id
      ,LooseVarients
    };


    console.log(formData);

    // try {

    //     if (image_path instanceof File) {
    //       formData = { ...formData, image_path };
    //     }

    //    const  response = await storeloose_Varient({ formData });
    //     if (response.data.message === "loose_variant Saved successfully!") {

    //       const Merchanttoken = localStorage.getItem('Merchanttoken');



    //       navigate(`/admin/${Merchanttoken}/looseVarient`);
    //     }
   
    // } catch (error) {
    //   toast.error("Failed to save Loose Varient. Please try again.");
    // }


  };