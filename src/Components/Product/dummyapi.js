







const currentDate = new Date().toISOString().split('T')[0];
console.log(currentDate);

'current_date' => 'required|date|date_format:Y-m-d'










  const location = useLocation();
  const [product, setProduct] = useState(location.state?.product || null);
  const [selectedVariation, setSelectedVariation] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);

  const [ImagesList, setImagesList] = useState([]);

  useEffect(() => {
    console.log(location);
    
    const fetchVariantDetails = async () => {
      if (location.state?.Variantid) {
        const response = await GetVariantDetails(location.state.Variantid , location.state.Varient_type );
        console.log(response);

        if(response){
          setImagesList(response.data.Images);
        }
      }
    };
    fetchVariantDetails();
  }, [location]);

  useEffect(() => {
    if (product) {
      setSelectedVariation(product.product_variations?.[0] || null);
      setSelectedImage(product.images?.[0] || null);
    }
  }, [product]);

  const handleVariationChange = variation => {
    setSelectedVariation(variation);
    setSelectedImage(variation.image);
  };
