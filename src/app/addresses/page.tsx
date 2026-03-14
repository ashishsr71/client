"use client";

import { useAuthStore } from "@/stores/authStore";
import { useEffect, useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { Trash2, Plus, MapPin } from "lucide-react";
import { toast } from "react-toastify";

type AddressInputs = {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
};

export default function AddressesPage() {
  const { user, isAuthenticated, checkAuth } = useAuthStore();
  const [addresses, setAddresses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isValid },
  } = useForm<AddressInputs>({ mode: "onChange" });

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  useEffect(() => {
    if (isAuthenticated && user?.id) {
      fetchAddresses();
    } else if (!isAuthenticated && !loading) {
      setLoading(false);
    }
  }, [isAuthenticated, user?.id]);

  const fetchAddresses = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/users/${user?.id}/addresses`);
      if (res.ok) {
        const data = await res.json();
        setAddresses(data.addresses);
      }
    } catch (error) {
      toast.error("Failed to load addresses");
    } finally {
      setLoading(false);
    }
  };

  const handleAddAddress: SubmitHandler<AddressInputs> = async (data) => {
    try {
      const res = await fetch(`/api/users/${user?.id}/addresses`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        toast.success("Address added successfully");
        setShowAddForm(false);
        reset();
        fetchAddresses();
      } else {
        toast.error("Failed to add address");
      }
    } catch (error) {
      toast.error("An error occurred adding the address");
    }
  };

  const handleDeleteAddress = async (addressId: string) => {
    try {
      const res = await fetch(`/api/users/${user?.id}/addresses/${addressId}`, {
        method: "DELETE",
      });

      if (res.ok) {
        toast.success("Address deleted");
        fetchAddresses();
      } else {
        toast.error("Failed to delete address");
      }
    } catch (error) {
      toast.error("An error occurred deleting the address");
    }
  };

  if (!isAuthenticated && !loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Please log in to view your addresses.</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-12 px-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
          <MapPin className="w-8 h-8 text-cyan-500" />
          My Addresses
        </h1>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="flex items-center gap-2 bg-gray-900 text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors"
        >
          {showAddForm ? "Cancel" : <><Plus className="w-5 h-5"/> Add Address</>}
        </button>
      </div>

      {showAddForm && (
        <form
          onSubmit={handleSubmit(handleAddAddress)}
          className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm mb-8 grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          <div className="flex flex-col gap-1 md:col-span-2">
            <label className="text-xs text-gray-500 font-medium">Street Address</label>
            <input
              {...register("street", { required: "Street is required" })}
              className="border-b border-gray-200 py-2 outline-none focus:border-cyan-500 transition-colors"
              placeholder="123 Main St"
            />
            {errors.street && <span className="text-xs text-red-500">{errors.street.message}</span>}
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs text-gray-500 font-medium">City</label>
            <input
              {...register("city", { required: "City is required" })}
              className="border-b border-gray-200 py-2 outline-none focus:border-cyan-500 transition-colors"
              placeholder="New York"
            />
            {errors.city && <span className="text-xs text-red-500">{errors.city.message}</span>}
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs text-gray-500 font-medium">State/Province</label>
            <input
              {...register("state", { required: "State is required" })}
              className="border-b border-gray-200 py-2 outline-none focus:border-cyan-500 transition-colors"
              placeholder="NY"
            />
            {errors.state && <span className="text-xs text-red-500">{errors.state.message}</span>}
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs text-gray-500 font-medium">Zip Code</label>
            <input
              {...register("zipCode", { required: "Zip Code is required" })}
              className="border-b border-gray-200 py-2 outline-none focus:border-cyan-500 transition-colors"
              placeholder="10001"
            />
            {errors.zipCode && <span className="text-xs text-red-500">{errors.zipCode.message}</span>}
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs text-gray-500 font-medium">Country</label>
            <input
              {...register("country", { required: "Country is required" })}
              className="border-b border-gray-200 py-2 outline-none focus:border-cyan-500 transition-colors"
              placeholder="USA"
            />
            {errors.country && <span className="text-xs text-red-500">{errors.country.message}</span>}
          </div>
          <div className="md:col-span-2 mt-4 flex justify-end">
            <button
              type="submit"
              disabled={!isValid}
              className="bg-cyan-600 hover:bg-cyan-700 disabled:opacity-50 text-white px-6 py-2 rounded-lg font-medium transition-colors"
            >
              Save Address
            </button>
          </div>
        </form>
      )}

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1,2,3].map(i => (
            <div key={i} className="h-32 bg-gray-100 rounded-xl animate-pulse"></div>
          ))}
        </div>
      ) : addresses.length === 0 ? (
        <div className="text-center py-16 bg-gray-50 rounded-2xl border border-gray-100">
          <MapPin className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-1">No addresses saved</h3>
          <p className="text-gray-500 max-w-sm mx-auto">You haven't added any addresses yet. Add one now to make future checkouts easier.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {addresses.map((address) => (
            <div key={address._id} className="bg-white border border-gray-200 p-5 rounded-xl hover:shadow-md transition-shadow relative group">
              <button 
                onClick={() => handleDeleteAddress(address._id)}
                className="absolute top-4 right-4 text-gray-400 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                title="Delete address"
              >
                <Trash2 className="w-5 h-5" />
              </button>
              <div className="flex flex-col h-full justify-between">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2 truncate pr-6">{address.street}</h4>
                  <div className="text-sm text-gray-500 space-y-1">
                     <p>{address.city}, {address.state} {address.zipCode}</p>
                     <p>{address.country}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
