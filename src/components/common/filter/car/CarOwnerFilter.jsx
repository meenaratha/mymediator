import React, { useState, useEffect } from "react";
import { api } from "@/api/axios";
const CarOwnerFilter = ({
  filters,
  setFilters,
  expandedSections,
  toggleSection,
}) => {
 const [noOwnerOptions, setNoOwnerOptions] = useState([]);
   const [loading, setLoading] = useState(true);
   const [selectedNoOwner, setSelectedNoOwner] = useState([]);
 
   // Load no owner options from API on component mount
   useEffect(() => {
     fetchNoOwnerOptions();
   }, []);
 
   // Set initial selected values from filters
   useEffect(() => {
     if (filters.number_of_owner_id) {
       const filterValues = Array.isArray(filters.number_of_owner_id)
         ? filters.number_of_owner_id
         : [filters.number_of_owner_id];
 
       setSelectedNoOwner(filterValues.filter((val) => val && val !== ""));
     } else {
       setSelectedNoOwner([]);
     }
   }, [filters.number_of_owner_id]);
 
   const fetchNoOwnerOptions = async () => {
     setLoading(true);
     try {
       const response = await api.get('/car/get/owner');
 
       if (response.data && Array.isArray(response.data)) {
         setNoOwnerOptions(response.data);
       } else {
         setNoOwnerOptions([]);
       }
     } catch (error) {
       setNoOwnerOptions([]);
     } finally {
       setLoading(false);
     }
   };
 
   const handleNoOwnerSelect = (option) => {
     const isCurrentlySelected = selectedNoOwner.includes(option.value);
     let newSelectedNoOwner;
 
     if (isCurrentlySelected) {
       // Remove from selection
       newSelectedNoOwner = selectedNoOwner.filter(
         (val) => val !== option.value
       );
     } else {
       // Add to selection
       newSelectedNoOwner = [...selectedNoOwner, option.value];
     }
 
     setSelectedNoOwner(newSelectedNoOwner);
 
     // Update filters - send array or single value based on selection count
     const filterValue =
       newSelectedNoOwner.length === 0
         ? ""
         : newSelectedNoOwner.length === 1
         ? newSelectedNoOwner[0] // Single value for single selection
         : newSelectedNoOwner; // Array for multiple selections
 
     setFilters((prev) => ({
       ...prev,
       number_of_owner_id: filterValue,
     }));
   };
 
   const clearAllSelections = () => {
     setSelectedNoOwner([]);
     setFilters((prev) => ({
       ...prev,
       number_of_owner_id: "",
     }));
   };
 
   const formatCount = (count) => {
     if (count === null || count === undefined) return "0";
     if (count >= 1000) {
       return `${Math.floor(count / 1000)}k+ items`;
     }
     return `${count}+ items`;
   };
 
   const getSelectedSummary = () => {
     if (selectedNoOwner.length === 0) return "";
     if (selectedNoOwner.length === 1) {
       const option = noOwnerOptions.find((o) => o.value === selectedNoOwner[0]);
       return option?.label || selectedNoOwner[0];
     }
     return `${selectedNoOwner.length} types`;
   };
 
   if (loading) {
     return (
       <div className="mb-4">
         <div className="flex justify-between items-center cursor-pointer py-2 border-b">
           <h2 className="font-medium text-gray-800">No Owner</h2>
         </div>
         <div className="py-4 text-center">
           <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-emerald-500 mx-auto"></div>
           <p className="text-sm text-gray-500 mt-2">Loading...</p>
         </div>
       </div>
     );
   };
 
   return (
     <div className="mb-4">
       <div
         className="flex justify-between items-center cursor-pointer py-2 border-b"
         onClick={() => toggleSection("noOwner")}
       >
         <h2 className="font-medium text-gray-800">
           No Owner
           {selectedNoOwner.length > 0 && (
             <span className="ml-2 text-xs bg-emerald-100 text-emerald-800 px-2 py-1 rounded-full">
               {selectedNoOwner.length} selected
             </span>
           )}
         </h2>
         <svg
           className={`w-5 h-5 transition-transform duration-300 ${
             expandedSections.noOwner ? "rotate-180" : ""
           }`}
           fill="none"
           stroke="currentColor"
           viewBox="0 0 24 24"
         >
           <path
             strokeLinecap="round"
             strokeLinejoin="round"
             strokeWidth="2"
             d="M19 9l-7 7-7-7"
           />
         </svg>
       </div>
 
       <div
         className={`transition-all duration-300 ease-in-out overflow-hidden custom-scrollbar ${
           expandedSections.noOwner ? "max-h-96 py-2" : "max-h-0"
         }`}
       >
         {/* Selection Summary */}
         {selectedNoOwner.length > 0 && (
           <div className="mb-3 p-2 bg-emerald-50 border border-emerald-200 rounded text-sm">
             <div className="flex justify-between items-center">
               <span className="text-emerald-800">
                 Selected: {getSelectedSummary()}
               </span>
               <button
                 onClick={clearAllSelections}
                 className="text-emerald-600 hover:text-emerald-800 text-xs underline"
               >
                 Clear All
               </button>
             </div>
           </div>
         )}
 
         {noOwnerOptions.length > 0 ? (
           <div className="grid grid-cols-1 gap-2 mb-2">
             {noOwnerOptions.map((option, index) => {
               const isSelected = selectedNoOwner.includes(option.value);
 
               return (
                 <div
                   key={option.value || index}
                   className={`rounded text-sm p-4 flex justify-between gap-[15px] cursor-pointer transition-all duration-200 ${
                     isSelected
                       ? "bg-emerald-100 border-2 border-emerald-500 shadow-sm"
                       : "bg-gray-100 hover:bg-emerald-50 hover:border-emerald-300 border-2 border-transparent"
                   }`}
                   onClick={() => handleNoOwnerSelect(option)}
                 >
                   <div className="flex items-center">
                     {/* Checkbox style indicator */}
                     <div
                       className={`w-4 h-4 mr-3 border-2 rounded flex items-center justify-center ${
                         isSelected
                           ? "border-emerald-500 bg-emerald-500"
                           : "border-gray-300"
                       }`}
                     >
                       {isSelected && (
                         <svg
                           className="w-3 h-3 text-white"
                           fill="currentColor"
                           viewBox="0 0 20 20"
                         >
                           <path
                             fillRule="evenodd"
                             d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                             clipRule="evenodd"
                           />
                         </svg>
                       )}
                     </div>
                     <span
                       className={`font-medium ${
                         isSelected ? "text-emerald-800" : ""
                       }`}
                     >
                       {option.label}
                     </span>
                   </div>
                   <div
                     className={`text-xs flex items-center ${
                       isSelected ? "text-emerald-600" : "text-gray-500"
                     }`}
                   >
                     {option.count !== undefined
                       ? formatCount(option.count)
                       : "0 items"}
                   </div>
                 </div>
               );
             })}
           </div>
         ) : (
           <div className="text-center py-4">
             <p className="text-gray-500 text-sm">No options available</p>
             <button
               onClick={fetchNoOwnerOptions}
               className="mt-2 text-blue-600 text-sm hover:underline"
             >
               Retry
             </button>
           </div>
         )}
 
         {/* Action Buttons */}
         {selectedNoOwner.length > 0 && (
           <div className="mt-3 pt-2 border-t space-y-2">
             <div className="flex gap-2">
               <button
                 onClick={clearAllSelections}
                 className="flex-1 text-sm text-red-600 hover:text-red-800 py-2 hover:bg-red-50 rounded transition-colors border border-red-200"
               >
                 Clear All ({selectedNoOwner.length})
               </button>
               <button
                 onClick={() => {
                   // Select all no owner options
                   const allValues = noOwnerOptions.map((o) => o.value);
                   setSelectedNoOwner(allValues);
                   setFilters((prev) => ({
                     ...prev,
                     number_of_owner_id:
                       allValues.length === 1 ? allValues[0] : allValues,
                   }));
                 }}
                 className="flex-1 text-sm text-emerald-600 hover:text-emerald-800 py-2 hover:bg-emerald-50 rounded transition-colors border border-emerald-200"
                 disabled={selectedNoOwner.length === noOwnerOptions.length}
               >
                 Select All
               </button>
             </div>
           </div>
         )}
       </div>
     </div>
   );
}

export default CarOwnerFilter
