import React from 'react';

function FilterOverlay({setSelectedFilter, filter, viewAs, setloading}) {
    console.log(filter, viewAs, "SHWOING")
    return (
        <div className='relative w-full left-0 h-full grid grid-cols-2 lg:grid-cols-3 gap-4'>
          <div className="w-full">
          <label htmlFor="select" className='text-gray-600 font-bold'>Status</label>
          <select
              value={"Default"} 
              onChange={(e) => {
                const selectedValue = e.target.value;
                if (selectedValue === "assignment") {
                  setSelectedFilter([]);
                
                } else {
                  const optgroup = e.target.options[e.target.selectedIndex].closest('optgroup')?.label;
                  
                  //console.log(optgroup)
                  setSelectedFilter((prevSelectedOptions) => {
                    // Create a copy of the previous selected options
                    let updatedOptions = [...prevSelectedOptions];
              
                    
                    
                    const isOptionSelected = prevSelectedOptions.some(item => item.optgroup === optgroup && item.selectedValue === selectedValue);

                    // Create a copy of the previous selected options
                    updatedOptions = prevSelectedOptions.filter(item => !(item.optgroup === optgroup && item.selectedValue === selectedValue));
                    updatedOptions = updatedOptions.filter((option) => option.optgroup !== optgroup);            
                    // If the option wasn't selected, add it to the list
                    if (!isOptionSelected) {
                      updatedOptions.push({ optgroup, selectedValue });
                    }
                    // Add the newly selected option
                    //updatedOptions.push({optgroup: optgroup, selectedValue: selectedValue});
                    console.log('update:', updatedOptions)
                    return updatedOptions;
                  });
                 
                }
                setloading(true);
              }}
                className="w-full border-2 border-[#00FFD3] text-[#00FFD3] p-2 rounded focus-within:outline-none transform transition-transform hover:bg-[#00FFD3] hover:text-white scrollbar-thin scrollbar-thumb-[#00FFD3] scrollbar-track-gray-300"
                
                
              >
                <option value={filter?.filter((option) => option.optgroup==="-Status-").map(item => item.selectedValue).join(', ')} selected={""}>{filter.filter((option) => option.optgroup==="-Status-")?.length>0? filter.filter((option) => option.optgroup==="-Status-")?.map(item => item.selectedValue.toUpperCase()).join(', ').toUpperCase(): "Default".toUpperCase()}</option>
                <option value={"assignment"} selected={filter?.includes('assignment')}>{"Default"}</option>
                
                <optgroup label={"-Status-"}>
                  <option value="fully mapped" selected={filter?.some(item => item.selectedValue === 'fully mapped')}>
                    Fully Mapped {filter?.some(item => item.selectedValue === 'fully mapped') && '✓'}
                  </option>
                  <option value="field mapped" selected={filter?.some(item => item.selectedValue === 'field mapped')}>
                    Field Mapped {filter?.some(item => item.selectedValue === 'field mapped') && '✓'}
                  </option>
                  <option value="drawing ready" selected={filter?.some(item => item.selectedValue === 'drawing ready')}>
                    Drawing Ready {filter?.some(item => item.selectedValue === 'drawing ready') && '✓'}
                  </option>
                  <option value="gis ready" selected={filter?.some(item => item.selectedValue === 'gis ready')}>
                    GIS Ready {filter?.some(item => item.selectedValue === 'gis ready') && '✓'}
                  </option>
                  <option value="checked" selected={filter?.some(item => item.selectedValue === 'checked')}>
                    Checked {filter?.some(item => item.selectedValue === 'checked') && '✓'}
                  </option>
                  <option value="submitted" selected={filter?.some(item => item.selectedValue === 'submitted')}>
                    Submitted {filter?.some(item => item.selectedValue === 'submitted') && '✓'}
                  </option>
                  <option value="pending" selected={filter?.some(item => item.selectedValue === 'pending')}>
                    Pending {filter?.some(item => item.selectedValue === 'pending') && '✓'}
                  </option>
                </optgroup>
                </select>
          </div>
            <div className="w-full">
            <label htmlFor="select" className='text-gray-600 font-bold'>Property Type</label>
            <select
              value={"Default"} 
              onChange={(e) => {
                const selectedValue = e.target.value;
                if (selectedValue === "assignment") {
                  setSelectedFilter([]);
                
                } else {
                  const optgroup = e.target.options[e.target.selectedIndex].closest('optgroup')?.label;
                  
                  //console.log(optgroup)
                  setSelectedFilter((prevSelectedOptions) => {
                    // Create a copy of the previous selected options
                    let updatedOptions = [...prevSelectedOptions];
              
                    
                    
                    const isOptionSelected = prevSelectedOptions.some(item => item.optgroup === optgroup && item.selectedValue === selectedValue);

                    // Create a copy of the previous selected options
                    updatedOptions = prevSelectedOptions.filter(item => !(item.optgroup === optgroup && item.selectedValue === selectedValue));
                    updatedOptions = updatedOptions.filter((option) => option.optgroup !== optgroup);            
                    // If the option wasn't selected, add it to the list
                    if (!isOptionSelected) {
                      updatedOptions.push({ optgroup, selectedValue });
                    }
                    // Add the newly selected option
                    //updatedOptions.push({optgroup: optgroup, selectedValue: selectedValue});
                    console.log('update:', updatedOptions)
                    return updatedOptions;
                  });
                 
                }
                setloading(true);
              }}
                className="w-full border-2 border-[#00FFD3] text-[#00FFD3] p-2 rounded focus-within:outline-none transform transition-transform hover:bg-[#00FFD3] hover:text-white scrollbar-thin scrollbar-thumb-[#00FFD3] scrollbar-track-gray-300"
                
                
              >
                <option value={filter.filter((option) => option.optgroup==="-Property Type-")?.map(item => item.selectedValue).join(', ')} selected={""}>{filter.filter((option) => option.optgroup==="-Property Type-")?.length>0? filter.filter((option) => option.optgroup==="-Property Type-")?.map(item => item.selectedValue.toUpperCase()).join(', ').toUpperCase(): "Default".toUpperCase()}</option>
                <option value={"assignment"} selected={filter?.includes('assignment')}>{"Default"}</option>
                <optgroup label={"-Property Type-"}>
                  <option value="residential" selected={filter?.some(item => item.selectedValue === 'residential')}>
                    Residential {filter?.some(item => item.selectedValue === 'residential') && '✓'}
                  </option>
                  <option value="business" selected={filter?.some(item => item.selectedValue === 'business')}>
                    Business {filter?.some(item => item.selectedValue === 'business') && '✓'}
                  </option>
                  <option value="industry" selected={filter?.some(item => item.selectedValue === 'industry')}>
                    Industry {filter?.some(item => item.selectedValue === 'industry') && '✓'}
                  </option>
                  <option value="agricultural" selected={filter?.some(item => item.selectedValue === 'agricultural')}>
                    Agricultural {filter?.some(item => item.selectedValue === 'agricultural') && '✓'}
                  </option>
                  <option value="government" selected={filter?.some(item => item.selectedValue === 'government')}>
                    Government{filter?.some(item => item.selectedValue === 'government') && '✓'}
                  </option>
                </optgroup>
                </select>
            </div>
            <div className="w-full">
            <label htmlFor="select" className='text-gray-600 font-bold'>Classification</label>
            <select
              value={"Default"} 
              onChange={(e) => {
                const selectedValue = e.target.value;
                if (selectedValue === "assignment") {
                  setSelectedFilter([]);
                
                } else {
                  const optgroup = e.target.options[e.target.selectedIndex].closest('optgroup')?.label;
                  
                  //console.log(optgroup)
                  setSelectedFilter((prevSelectedOptions) => {
                    // Create a copy of the previous selected options
                    let updatedOptions = [...prevSelectedOptions];
              
                    
                    
                    const isOptionSelected = prevSelectedOptions.some(item => item.optgroup === optgroup && item.selectedValue === selectedValue);

                    // Create a copy of the previous selected options
                    updatedOptions = prevSelectedOptions.filter(item => !(item.optgroup === optgroup && item.selectedValue === selectedValue));
                    updatedOptions = updatedOptions.filter((option) => option.optgroup !== optgroup);            
                    // If the option wasn't selected, add it to the list
                    if (!isOptionSelected) {
                      updatedOptions.push({ optgroup, selectedValue });
                    }
                    // Add the newly selected option
                    //updatedOptions.push({optgroup: optgroup, selectedValue: selectedValue});
                    console.log('update:', updatedOptions)
                    return updatedOptions;
                  });
                 
                }
                setloading(true);
              }}
                className="w-full border-2 border-[#00FFD3] text-[#00FFD3] p-2 rounded focus-within:outline-none transform transition-transform hover:bg-[#00FFD3] hover:text-white scrollbar-thin scrollbar-thumb-[#00FFD3] scrollbar-track-gray-300"
                
                
              >
                <option value={filter.filter((option) => option.optgroup==="-Classification-")?.map(item => item.selectedValue).join(', ')} selected={""}>{filter.filter((option) => option.optgroup==="-Classification-")?.length>0? filter.filter((option) => option.optgroup==="-Classification-")?.map(item => item.selectedValue.toUpperCase()).join(', ').toUpperCase(): "Default".toUpperCase()}</option>
                <option value={"assignment"} selected={filter?.includes('assignment')}>{"Default"}</option>
                <optgroup label={"-Classification-"}>
                  <option value="coordination letter 1" selected={filter?.some(item => item.selectedValue === 'coordination letter 1')}>
                    Coordination Letter 1 {filter?.some(item => item.selectedValue === 'coordination letter 1') && '✓'}
                  </option>
                  <option value="coordination letter 2" selected={filter?.some(item => item.selectedValue === 'coordination letter 2')}>
                    Coordination Letter 2 {filter?.some(item => item.selectedValue === 'coordination letter 2') && '✓'}
                  </option>
                  <option value="coordination letter 1 expired" selected={filter?.some(item => item.selectedValue === 'coordination letter 1 expired')}>
                    Coordination Letter 1 Expired {filter?.some(item => item.selectedValue === 'coordination letter 1 expired') && '✓'}
                  </option>
                  <option value="coordination letter 2 expired" selected={filter?.some(item => item.selectedValue === 'coordination letter 2 expired')}>
                    Coordination Letter 2 Expired {filter?.some(item => item.selectedValue === 'coordination letter 2 expired') && '✓'}
                  </option>
                  <option value="refused survey" selected={filter?.some(item => item.selectedValue === 'refused survey')}>
                    Refused Survey {filter?.some(item => item.selectedValue === 'refused survey') && '✓'}
                  </option>
                  <option value="pending" selected={filter?.some(item => item.selectedValue === 'pending')}>
                    Pending {filter?.some(item => item.selectedValue === 'pending') && '✓'}
                  </option>
                </optgroup>
            </select>
            </div>
            <div className="w-full">
            <label htmlFor="select" className='text-gray-600 font-bold'>Stats</label>
            <select
              value={"Default"} 
              onChange={(e) => {
                const selectedValue = e.target.value;
                if (selectedValue === "assignment") {
                  setSelectedFilter([]);
                
                } else {
                  const optgroup = e.target.options[e.target.selectedIndex].closest('optgroup')?.label;
                  
                  //console.log(optgroup)
                  setSelectedFilter((prevSelectedOptions) => {
                    // Create a copy of the previous selected options
                    let updatedOptions = [...prevSelectedOptions];
              
                    
                    
                    const isOptionSelected = prevSelectedOptions.some(item => item.optgroup === optgroup && item.selectedValue === selectedValue);

                    // Create a copy of the previous selected options
                    updatedOptions = prevSelectedOptions.filter(item => !(item.optgroup === optgroup && item.selectedValue === selectedValue));
                    updatedOptions = updatedOptions.filter((option) => option.optgroup !== optgroup);            
                    // If the option wasn't selected, add it to the list
                    if (!isOptionSelected) {
                      updatedOptions.push({ optgroup, selectedValue });
                    }
                    // Add the newly selected option
                    //updatedOptions.push({optgroup: optgroup, selectedValue: selectedValue});
                    console.log('update:', updatedOptions)
                    return updatedOptions;
                  });
                 
                }
                setloading(true);
              }}
                className="w-full border-2 border-[#00FFD3] text-[#00FFD3] p-2 rounded focus-within:outline-none transform transition-transform hover:bg-[#00FFD3] hover:text-white scrollbar-thin scrollbar-thumb-[#00FFD3] scrollbar-track-gray-300"
                
                
              >
                <option value={filter.filter((option) => option.optgroup==="-Stats-")?.map(item => item.selectedValue).join(', ')} selected={""}>{filter.filter((option) => option.optgroup==="-Stats-")?.length>0? filter.filter((option) => option.optgroup==="-Stats-")?.map(item => item.selectedValue.toUpperCase()).join(', ').toUpperCase(): "Default".toUpperCase()}</option>
                <option value={"assignment"} selected={filter?.includes('assignment')}>{"Default"}</option>
                <optgroup label={"-Stats-"}>
                  <option value="under construction" selected={filter?.some(item => item.selectedValue === 'under construction')}>
                    Under Construction {filter?.some(item => item.selectedValue === 'under construction') && '✓'}
                  </option>
                  <option value="Aerial Mapped" selected={filter?.some(item => item.selectedValue === 'Aerial Mapped')}>
                    Aerial Mapped {filter?.some(item => item.selectedValue === 'Aerial Mapped') && '✓'}
                  </option>
                  <option value="missing information" selected={filter?.some(item => item.selectedValue === 'missing information')}>
                    Missing Information {filter?.some(item => item.selectedValue === 'missing information') && '✓'}
                  </option>
                  <option value="missing physical number" selected={filter?.some(item => item.selectedValue === 'missing physical number')}>
                    Missing Physical Number {filter?.some(item => item.selectedValue === 'missing physical number') && '✓'}
                  </option>
                  <option value="pending" selected={filter?.some(item => item.selectedValue === 'pending')}>
                    Pending {filter?.some(item => item.selectedValue === 'pending') && '✓'}
                  </option>
                </optgroup>
                </select>
                </div>
                <div className="w-full">
                <label htmlFor="select" className='text-gray-600 font-bold'>Building Number</label>
                <select
              value={"Default"} 
              onChange={(e) => {
                const selectedValue = e.target.value;
                if (selectedValue === "assignment") {
                  setSelectedFilter([]);
                
                } else {
                  const optgroup = e.target.options[e.target.selectedIndex].closest('optgroup')?.label;
                  
                  //console.log(optgroup)
                  setSelectedFilter((prevSelectedOptions) => {
                    // Create a copy of the previous selected options
                    let updatedOptions = [...prevSelectedOptions];
              
                    
                    
                    const isOptionSelected = prevSelectedOptions.some(item => item.optgroup === optgroup && item.selectedValue === selectedValue);

                    // Create a copy of the previous selected options
                    updatedOptions = prevSelectedOptions.filter(item => !(item.optgroup === optgroup && item.selectedValue === selectedValue));
                    updatedOptions = updatedOptions.filter((option) => option.optgroup !== optgroup);            
                    // If the option wasn't selected, add it to the list
                    if (!isOptionSelected) {
                      updatedOptions.push({ optgroup, selectedValue });
                    }
                    // Add the newly selected option
                    //updatedOptions.push({optgroup: optgroup, selectedValue: selectedValue});
                    console.log('update:', updatedOptions)
                    return updatedOptions;
                  });
                 
                }
                setloading(true);
              }}
                className="w-full border-2 border-[#00FFD3] text-[#00FFD3] p-2 rounded focus-within:outline-none transform transition-transform hover:bg-[#00FFD3] hover:text-white scrollbar-thin scrollbar-thumb-[#00FFD3] scrollbar-track-gray-300"
                
                
              >
                <option value={filter.filter((option) => option.optgroup==="-Building Number-")?.map(item => item.selectedValue).join(', ')} selected={""}>{filter.filter((option) => option.optgroup==="-Building Number-")?.length>0? filter.filter((option) => option.optgroup==="-Building Number-")?.map(item => item.selectedValue.toUpperCase()).join(', ').toUpperCase(): "Default".toUpperCase()}</option>
                <option value={"assignment"} selected={filter?.includes('assignment')}>{"Default"}</option>
                <optgroup label={"-Building Number-"}>
                  <option value="a" selected={filter?.some(item => item.selectedValue === 'a')}>
                    A1-AX {filter?.some(item => item.selectedValue === 'a') && '✓'}
                  </option>
                  <option value="b" selected={filter?.some(item => item.selectedValue === 'b')}>
                    B1-BX {filter?.some(item => item.selectedValue === 'b') && '✓'}
                  </option>
                  <option value="c" selected={filter?.some(item => item.selectedValue === 'c')}>
                    C1-CX {filter?.some(item => item.selectedValue === 'c') && '✓'}
                  </option>
                  <option value="a-z" selected={filter?.some(item => item.selectedValue === 'a-z')}>
                    All from A-Z {filter?.some(item => item.selectedValue === 'a-z') && '✓'}
                  </option>
                  <option value="z-a" selected={filter?.some(item => item.selectedValue === 'z-a')}>
                    All from Z-A {filter?.some(item => item.selectedValue === 'z-a') && '✓'}
                  </option>
                </optgroup>
                </select>
                </div>
                <div className="w-full">
                <label htmlFor="select" className='text-gray-600 font-bold'>Time</label>
                <select
              value={"Default"} 
              onChange={(e) => {
                const selectedValue = e.target.value;
                if (selectedValue === "assignment") {
                  setSelectedFilter([]);
                
                } else {
                  const optgroup = e.target.options[e.target.selectedIndex].closest('optgroup')?.label;
                  
                  //console.log(optgroup)
                  setSelectedFilter((prevSelectedOptions) => {
                    // Create a copy of the previous selected options
                    let updatedOptions = [...prevSelectedOptions];
              
                    
                    
                    const isOptionSelected = prevSelectedOptions.some(item => item.optgroup === optgroup && item.selectedValue === selectedValue);

                    // Create a copy of the previous selected options
                    updatedOptions = prevSelectedOptions.filter(item => !(item.optgroup === optgroup && item.selectedValue === selectedValue));
                    updatedOptions = updatedOptions.filter((option) => option.optgroup !== optgroup);            
                    // If the option wasn't selected, add it to the list
                    if (!isOptionSelected) {
                      updatedOptions.push({ optgroup, selectedValue });
                    }
                    // Add the newly selected option
                    //updatedOptions.push({optgroup: optgroup, selectedValue: selectedValue});
                    console.log('update:', updatedOptions)
                    return updatedOptions;
                  });
                 
                }
                setloading(true);
              }}
                className="w-full border-2 border-[#00FFD3] text-[#00FFD3] p-2 rounded focus-within:outline-none transform transition-transform hover:bg-[#00FFD3] hover:text-white scrollbar-thin scrollbar-thumb-[#00FFD3] scrollbar-track-gray-300"
                
                
              >
                <option value={filter.filter((option) => !option.optgroup)?.map(item => item.selectedValue).join(', ')} selected={""}>{filter.filter((option) => !option.optgroup)?.length>0? filter.filter((option) => !option.optgroup)?.map(item => item.selectedValue.toUpperCase()).join(', ').toUpperCase(): "Default".toUpperCase()}</option>
                <option value={"assignment"} selected={filter?.includes('assignment')}>{"Default"}</option>
                <option value={!viewAs ? "most recent" : "most recent"}>
                  {!viewAs ? "Most Recent" : "Most Recent"}
                </option>
                <option value={!viewAs ? "latest update" : "latest update"}>
                  {!viewAs ? "Latest Update" : "Latest Update"}
                </option>
                <option value={!viewAs ? "manual" : "manual"}>
                  {!viewAs ? "Manually Entered" : "Manually Entered"}
                </option>
              </select>
              </div>
            
        </div>
    );
}

export default FilterOverlay;