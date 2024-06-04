import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from 'sweetalert2';
import config from "../../config";
import "./restaurant.css";

export default function RestaurantList() {
  const [restaurants, setRestaurants] = useState([]);
  const [formData, setFormData] = useState({
    Name: "",
    Address: "",
    Telephone: ""
  });
  const [editFormData, setEditFormData] = useState({
    Name: "",
    Address: "",
    Telephone: ""
  });
  const [currentEditId, setCurrentEditId] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        console.log("User not authenticated.");
        return;
      }

      try {
        const tempData = await getData(token);
        setRestaurants(tempData);
        console.log(JSON.stringify(tempData));
      } catch (error) {
        console.log("Error fetching restaurant data:", error);
      }
    };
    fetchData();
  }, []);

  const getData = async (token) => {
    try {
      const finalURL = `${config.apiUrl}/api/restaurant/`;
      const res = await axios.get(finalURL, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const restaurant = res.data?.restaurant || [];

      return restaurant;
    } catch (error) {
      console.log("Error fetching Restaurant data:", error);
      throw error;
    }
  };

  const removeRestaurant = async (restaurantId) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.log("User not authenticated. Redirecting to login page.");
        return;
      }

      const isConfirmed = await Swal.fire({
        title: 'Are you sure?',
        text: 'You want to delete this Restaurant?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete it!'
      });

      if (isConfirmed.isConfirmed) {
        const finalURL = `${config.apiUrl}/api/restaurant/${restaurantId}`;
        await axios.delete(finalURL, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        Swal.fire(
          'Deleted!',
          'The Restaurant has been deleted.',
          'success'
        ).then(() => {
          window.location.reload(false);
        });
      }
    } catch (error) {
      console.log("Error deleting Restaurant:", error);
      Swal.fire(
        'Error!',
        'Failed to delete the Restaurant.',
        'error'
      );
    }
  };

  function handleChange(evt) {
    const name = evt.target.name;
    const value = evt.target.value;
    setFormData({
      ...formData,
      [name]: value,
    });
  }

  const onSubmitForm = async (e) => {
    try {
      e.preventDefault();

      const token = localStorage.getItem("token");

      const res = await axios({
        method: "post",
        baseURL: config.apiUrl,
        url: "/api/restaurant/create",
        data: formData,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      console.log(res.data);

      Swal.fire({
        icon: 'success',
        title: 'Success!',
        text: 'Data Saved Successfully!',
      }).then(() => {
        window.location.assign("/");
      });
    } catch (error) {
      console.log(error);

      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'An error occurred while saving the data. Please try again.',
      });
    }
  };

  const handleEditClick = (restaurant) => {
    setCurrentEditId(restaurant._id);
    setEditFormData({
      Name: restaurant.Name,
      Address: restaurant.Address,
      Telephone: restaurant.Telephone
    });
  }

  function handleEditChange(evt) {
    const { name, value } = evt.target;
    setEditFormData({
      ...editFormData,
      [name]: value,
    });
  }

  const onSubmitEditForm = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `${config.apiUrl}/api/restaurant/update/${currentEditId}`,
        editFormData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      Swal.fire({
        icon: 'success',
        title: 'Success!',
        text: 'Updated Successfully!',
      }).then(() => {
        window.location.assign("/");
      });
    } catch (error) {
      console.log(error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'An error occurred while updating the data. Please try again.',
      });
    }
  };

  return (
    <div id="mainDiv" className="container">
      {/* <!-- Modal for Adding Restaurant --> */}
      <div className="modal fade" id="addRestaurantModal" tabIndex="-1" aria-labelledby="addRestaurantModalLabel" aria-hidden="true">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="addRestaurantModalLabel">Add Restaurant</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body">
              <form className="row g-3" onSubmit={onSubmitForm} id="formSubject">
                <div className="col-auto">
                  <label htmlFor="inputText2" className="visually-hidden">Restaurant Name</label>
                  <input type="text" className="form-control" id="inputText2" placeholder="Enter Restaurant Name"
                    name="Name"
                    value={formData.Name}
                    onChange={handleChange} />
                </div>
                <div className="col-auto">
                  <label htmlFor="inputText2" className="visually-hidden">Address</label>
                  <input type="text" className="form-control" id="inputText2" placeholder="Enter Address"
                    name="Address"
                    value={formData.Address}
                    onChange={handleChange} />
                </div>
                <div className="col-auto">
                  <label htmlFor="inputText2" className="visually-hidden">Telephone</label>
                  <input type="text" className="form-control" id="inputText2" placeholder="Enter Telephone "
                    name="Telephone"
                    value={formData.Telephone}
                    onChange={handleChange} />
                </div>
                <div className="col-auto">
                  <button type="submit" value="Submit" className="btn btn-success mb-3">Add</button>
                </div>
              </form>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
            </div>
          </div>
        </div>
      </div>

      {/* <!-- Modal for Editing Restaurant --> */}
      <div className="modal fade" id="editRestaurantModal" tabIndex="-1" aria-labelledby="editRestaurantModalLabel" aria-hidden="true">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="editRestaurantModalLabel">Edit Restaurant</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body">
              <form className="row g-3" onSubmit={onSubmitEditForm} id="formEdit">
                <div className="col-auto">
                  <label htmlFor="editText2" className="visually-hidden">Restaurant Name</label>
                  <input type="text" className="form-control" id="editText2" placeholder="Enter Restaurant Name"
                    name="Name"
                    value={editFormData.Name}
                    onChange={handleEditChange} />
                </div>
                <div className="col-auto">
                  <label htmlFor="editText2" className="visually-hidden">Address</label>
                  <input type="text" className="form-control" id="editText2" placeholder="Enter Address"
                    name="Address"
                    value={editFormData.Address}
                    onChange={handleEditChange} />
                </div>
                <div className="col-auto">
                  <label htmlFor="editText2" className="visually-hidden">Telephone</label>
                  <input type="text" className="form-control" id="editText2" placeholder="Enter Telephone"
                    name="Telephone"
                    value={editFormData.Telephone}
                    onChange={handleEditChange} />
                </div>
                <div className="col-auto">
                  <button type="submit" value="Submit" className="btn btn-success mb-3">Update</button>
                </div>
              </form>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
            </div>
          </div>
        </div>
      </div>


      <div className='container' id="RestaurantContainer">
        <h1 id="title">Dine Hub</h1>

        {/* <!-- Button trigger modal --> */}
        <div id="addModal">
        <button type="button" className="btn btn-primary" data-bs-toggle="modal" data-bs-target="#addRestaurantModal">
          Add Restaurant
        </button>
        </div>

        <table id="list" className='table table-hover'>
          <thead>
            <tr>
              <th scope='col'><i className='fas fa-list'></i></th>
              <th id="header" scope='col'>Restaurant Name</th>
              <th id="header" scope='col'>Address</th>
              <th id="header" scope='col'>Telephone</th>
              <th id="header" scope='col'>Action</th>
            </tr>
          </thead>
          <tbody>
            {restaurants.map((restaurant, index) => (
              <tr key={index}>
                <th scope='row'>{index + 1}</th>
                <td id="data">{restaurant.Name}</td>
                <td id="data">{restaurant.Address}</td>
                <td id="data">{restaurant.Telephone}</td>
                <td>
                  <button className='btn' id="editBtn" data-bs-toggle="modal" data-bs-target="#editRestaurantModal" onClick={() => handleEditClick(restaurant)}>
                    <i className='fas fa-edit' id="editIcon"></i>
                  </button>
                  &nbsp;
                  <button className='btn' id="editDelete" onClick={() => removeRestaurant(restaurant._id)}>
                    <i className='fas fa-trash-alt' id="DeleteIcon"></i>&nbsp;
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
