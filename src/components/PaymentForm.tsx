import { PaymentFormInputs, paymentFormSchema } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight, ShoppingCart, Banknote, CreditCard } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { SubmitHandler, useForm } from "react-hook-form";
import useCartStore from "@/stores/cartStore";
import { useAuthStore } from "@/stores/authStore";
import { toast } from "react-toastify";
import { useState } from "react";

const PaymentForm = () => {
  const [method, setMethod] = useState<"Card" | "COD" | null>(null);
  const { cart, clearCart } = useCartStore();
  const { user } = useAuthStore();
  
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<PaymentFormInputs>({
    resolver: zodResolver(paymentFormSchema),
  });

  const handleMethodChange = (newMethod: "Card" | "COD") => {
    setMethod(newMethod);
    setValue("paymentMethod", newMethod);
  };

  const router = useRouter();

  const handlePaymentForm: SubmitHandler<PaymentFormInputs> = async (data) => {
    if (!user) {
      toast.error("Please login first to place an order");
      router.push("/login");
      return;
    }

    try {
      if (!method) {
        toast.error("Please select a payment method.");
        return;
      }

      const amount = cart.reduce((acc, item) => acc + item.price * item.quantity, 0) + 10 - 10; // Simple calculation from cart

      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user.id,
          fullName: user.name,
          email: user.email,
          amount,
          paymentMethod: data.paymentMethod || method,
          status: (data.paymentMethod || method) === "COD" ? "pending" : "success" // Mock payment gateway
        })
      });

      if (!res.ok) throw new Error("Order failed");

      toast.success("Order Placed Successfully!");
      clearCart();
      router.push("/orders");
    } catch (err) {
      toast.error("Failed to place order. Try again.");
    }
  };

  return (
    <form
      className="flex flex-col gap-6"
      onSubmit={handleSubmit(handlePaymentForm)}
    >
      <div className="flex gap-4 mb-2">
         <button 
           type="button"
           onClick={() => handleMethodChange("Card")}
           className={`flex-1 p-3 border rounded-xl flex items-center justify-center gap-2 font-medium transition-all ${method === "Card" ? "border-zinc-800 bg-zinc-50 text-zinc-900 shadow-sm" : "border-gray-200 text-gray-500 hover:border-gray-300"}`}
         >
           <CreditCard size={18} />
           Credit Card
         </button>
         <button 
           type="button"
           onClick={() => handleMethodChange("COD")}
           className={`flex-1 p-3 border rounded-xl flex items-center justify-center gap-2 font-medium transition-all ${method === "COD" ? "border-cyan-600 bg-cyan-50 text-cyan-800 shadow-sm" : "border-gray-200 text-gray-500 hover:border-gray-300"}`}
         >
           <Banknote size={18} />
           Cash on Delivery
         </button>
      </div>

      {method === "Card" && (
        <div className="flex flex-col gap-4 animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="flex flex-col gap-1">
            <label htmlFor="cardHolder" className="text-xs text-gray-500 font-medium">
              Name on card
            </label>
            <input
              className="border-b border-gray-200 py-2 outline-none text-sm focus:border-cyan-500 transition-colors"
              type="text"
              id="cardHolder"
              placeholder="John Doe"
              {...register("cardHolder")}
            />
            {errors.cardHolder && (
              <p className="text-xs text-red-500">{errors.cardHolder.message}</p>
            )}
          </div>
          <div className="flex flex-col gap-1">
            <label htmlFor="cardNumber" className="text-xs text-gray-500 font-medium">
              Card Number
            </label>
            <input
              className="border-b border-gray-200 py-2 outline-none text-sm focus:border-cyan-500 transition-colors"
              type="text"
              id="cardNumber"
              placeholder="123456789123"
              {...register("cardNumber")}
            />
            {errors.cardNumber && (
              <p className="text-xs text-red-500">{errors.cardNumber.message}</p>
            )}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1">
              <label htmlFor="expirationDate" className="text-xs text-gray-500 font-medium">
                Expiration Date
              </label>
              <input
                className="border-b border-gray-200 py-2 outline-none text-sm focus:border-cyan-500 transition-colors"
                type="text"
                id="expirationDate"
                placeholder="MM/YY"
                {...register("expirationDate")}
              />
              {errors.expirationDate && (
                <p className="text-xs text-red-500">{errors.expirationDate.message}</p>
              )}
            </div>
            <div className="flex flex-col gap-1">
              <label htmlFor="cvv" className="text-xs text-gray-500 font-medium">
                CVV
              </label>
              <input
                className="border-b border-gray-200 py-2 outline-none text-sm focus:border-cyan-500 transition-colors"
                type="text"
                id="cvv"
                placeholder="123"
                {...register("cvv")}
              />
              {errors.cvv && (
                <p className="text-xs text-red-500">{errors.cvv.message}</p>
              )}
            </div>
          </div>
          <div className='flex items-center gap-2 mt-2 opacity-80'>
            <Image src="/klarna.png" alt="klarna" width={50} height={25} className="rounded-md"/>
            <Image src="/cards.png" alt="cards" width={50} height={25} className="rounded-md"/>
            <Image src="/stripe.png" alt="stripe" width={50} height={25} className="rounded-md"/>
          </div>
        </div>
      )}

      {method === "COD" && (
        <div className="p-4 bg-cyan-50/50 border border-cyan-100 rounded-lg animate-in fade-in slide-in-from-top-4 duration-300">
           <h4 className="text-cyan-800 font-semibold text-sm mb-1">Pay with Cash on Delivery</h4>
           <p className="text-xs text-cyan-700/80 leading-relaxed">
             You&apos;ll pay for your items in cash when they are delivered to your doorstep. Make sure to have exact change ready!
           </p>
        </div>
      )}

      <button
        type="submit"
        className="w-full bg-gray-900 hover:bg-black transition-all duration-300 text-white p-3.5 rounded-xl font-medium mt-2 flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
      >
        Place Order
        <ShoppingCart className="w-4 h-4 ml-1" />
      </button>
    </form>
  );
};

export default PaymentForm;
