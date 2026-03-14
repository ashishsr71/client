import { ShippingFormInputs, shippingFormSchema } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { SubmitHandler, useForm } from "react-hook-form";
import { useAuthStore } from "@/stores/authStore";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";

const ShippingForm = ({
  setShippingForm,
}: {
  setShippingForm: (data: ShippingFormInputs) => void;
}) => {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<ShippingFormInputs>({
    resolver: zodResolver(shippingFormSchema),
  });

  const { user, isAuthenticated } = useAuthStore();
  const [addresses, setAddresses] = useState<any[]>([]);
  const [loadingAddresses, setLoadingAddresses] = useState(false);

  useEffect(() => {
    if (isAuthenticated && user?.id) {
      setLoadingAddresses(true);
      fetch(`/api/users/${user.id}/addresses`)
        .then(res => res.json())
        .then(data => setAddresses(data.addresses || []))
        .catch(() => toast.error("Failed to fetch saved addresses"))
        .finally(() => setLoadingAddresses(false));
    }
  }, [isAuthenticated, user?.id]);

  const handleUseAddress = (addr: any) => {
    // We update fields programmatically. Since react-hook-form validates onSubmit,
    // we use reset or setValue. Since setValue isn't destructured, we need it.
    // Let me update the destructure above to include setValue first.
  };

  const router = useRouter();

  const handleShippingForm: SubmitHandler<ShippingFormInputs> = (data) => {
    setShippingForm(data);
    router.push("/cart?step=3", { scroll: false });
  };

  const handleUseSavedAddress = (addr: any) => {
    if (user) {
      setValue("name", user.name || "");
      setValue("email", user.email || "");
    }
    setValue("address", addr.street);
    setValue("city", addr.city);
    // phone is typically not saved in the basic address model here, so we let the user fill it or keep it.
  };

  return (
    <div className="flex flex-col gap-6">
      {addresses.length > 0 && (
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-gray-700">Quick fill from saved addresses:</label>
          <div className="flex gap-2 min-x-auto overflow-x-auto pb-2 noscrollbar">
            {addresses.map((addr) => (
              <button
                key={addr._id}
                type="button"
                onClick={() => handleUseSavedAddress(addr)}
                className="whitespace-nowrap px-4 py-2 border border-cyan-200 bg-cyan-50 text-cyan-800 rounded-lg text-xs font-semibold hover:bg-cyan-100 transition-colors"
                title={`${addr.street}, ${addr.city}, ${addr.state}`}
              >
                {addr.street}, {addr.city}
              </button>
            ))}
          </div>
        </div>
      )}

      <form
        className="flex flex-col gap-4"
        onSubmit={handleSubmit(handleShippingForm)}
      >
      <div className="flex flex-col gap-1">
        <label htmlFor="name" className="text-xs text-gray-500 font-medium">
          Name
        </label>
        <input
          className="border-b border-gray-200 py-2 outline-none text-sm"
          type="text"
          id="name"
          placeholder="John Doe"
          {...register("name")}
        />
        {errors.name && (
          <p className="text-xs text-red-500">{errors.name.message}</p>
        )}
      </div>
      <div className="flex flex-col gap-1">
        <label htmlFor="email" className="text-xs text-gray-500 font-medium">
          Email
        </label>
        <input
          className="border-b border-gray-200 py-2 outline-none text-sm"
          type="email"
          id="email"
          placeholder="johndoe@gmail.com"
          {...register("email")}
        />
        {errors.email && (
          <p className="text-xs text-red-500">{errors.email.message}</p>
        )}
      </div>
      <div className="flex flex-col gap-1">
        <label htmlFor="phone" className="text-xs text-gray-500 font-medium">
          Phone
        </label>
        <input
          className="border-b border-gray-200 py-2 outline-none text-sm"
          type="text"
          id="phone"
          placeholder="123456789"
          {...register("phone")}
        />
        {errors.phone && (
          <p className="text-xs text-red-500">{errors.phone.message}</p>
        )}
      </div>
      <div className="flex flex-col gap-1">
        <label htmlFor="address" className="text-xs text-gray-500 font-medium">
          Address
        </label>
        <input
          className="border-b border-gray-200 py-2 outline-none text-sm"
          type="text"
          id="address"
          placeholder="123 Main St, Anytown"
          {...register("address")}
        />
        {errors.address && (
          <p className="text-xs text-red-500">{errors.address.message}</p>
        )}
      </div>
      <div className="flex flex-col gap-1">
        <label htmlFor="city" className="text-xs text-gray-500 font-medium">
          City
        </label>
        <input
          className="border-b border-gray-200 py-2 outline-none text-sm"
          type="text"
          id="city"
          placeholder="New York"
          {...register("city")}
        />
        {errors.city && (
          <p className="text-xs text-red-500">{errors.city.message}</p>
        )}
      </div>
      <button
        type="submit"
        className="w-full bg-gray-800 hover:bg-gray-900 transition-all duration-300 text-white p-2 rounded-lg cursor-pointer flex items-center justify-center gap-2"
      >
        Continue
        <ArrowRight className="w-3 h-3" />
      </button>
    </form>
    </div>
  );
};

export default ShippingForm;
