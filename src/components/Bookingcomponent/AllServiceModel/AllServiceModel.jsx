import React, { useEffect, useState } from "react";
import "./AllServiceModel.scss";

const AllServiceModel = ({
  closeServiceModel,
  GetAllServices,
  setPreviousService,
}) => {
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedServiceId, setSelectedServiceId] = useState("");
  const [allSelectedService, setAllSelectedService] = useState();
  const getServiceById = (selectedCategory) => {
    const allService = GetAllServices.flatMap((s) => s.serviceOptionDtos);
    const selected = allService.filter(
      (s) => s.serviceId.toString() === selectedCategory
    );
    setAllSelectedService(selected);
  };
  useEffect(() => {
    getServiceById(selectedCategory);
  }, [selectedCategory]);
  // add service
  const handleAddService = () => {
    const selected = allSelectedService.find(
      (s) => s.id.toString() === selectedServiceId
    );

    if (selected) {
      const serviceToAdd = {
        ...selected,
        selectedService: selected.name,
      };

      setPreviousService((prev) => [...prev, serviceToAdd]);
      closeServiceModel();
    }
  };

  return (
    <div className="allservice-modal-overlay" onClick={closeServiceModel}>
      <div className="allservice-modal" onClick={(e) => e.stopPropagation()}>
        <h2 className="modal-title">Add New Service</h2>

        <div className="form-group">
          <label>Category</label>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="">-- Select category --</option>
            {GetAllServices.map((category) => (
              <option key={category.id} value={category.id}>
                {category.title}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Service</label>
          <select
            value={selectedServiceId}
            onChange={(e) => setSelectedServiceId(e.target.value)}
            disabled={!selectedCategory}
          >
            <option value="">-- Select service --</option>
            {allSelectedService?.map((srv) => (
              <option key={srv.id} value={srv.id}>
                {`${srv.name} — ${srv.duration}min — $${srv.price}`}
              </option>
            ))}
          </select>
        </div>

        <div className="modal-footer">
          <button className="cancel-btn" onClick={closeServiceModel}>
            Cancel
          </button>
          <button
            className="add-btn"
            disabled={!selectedServiceId}
            onClick={() => handleAddService()}
          >
            + Add
          </button>
        </div>
      </div>
    </div>
  );
};

export default AllServiceModel;
