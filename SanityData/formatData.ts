const formatData = (sampleData) => {
  console.log('FORMAT DATA START');
  const records: any[] = [];


  sampleData.map((item) => {

    const newItem = {
      id: item._id,
      title: item.name,
      brand: null,
      description: item.details,
      pk: item.group,
      sk: `${item.category}#${item._id}`,
    };
    records.push(newItem);
  });


  
  console.log('FORMAT DATA ENDED', records);

  return records;
};

export default formatData;
