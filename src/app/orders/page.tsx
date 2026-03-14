"use client";

import { useAuthStore } from "@/stores/authStore";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

const fetchUserOrders = async (userId: string) => {
  try {
    // Because we are on the client, we must hit an API route to securely query the DB
    const res = await fetch(`/api/orders?userId=${userId}`);
    if (!res.ok) throw new Error("Failed to fetch");
    return await res.json();
  } catch (err) {
    console.log("Failed to fetch user orders", err);
    return [];
  }
};

const OrdersPage = () => {
  const { user, isAuthenticated, checkAuth } = useAuthStore();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  useEffect(() => {
    if (isAuthenticated && user?.id) {
      fetchUserOrders(user.id).then((data) => {
        // Our API returns all orders, so we filter them here if the API wasn't updated to accept userId
        const userOrders = data.filter((o: any) => o.userId === user.id);
        setOrders(userOrders);
      }).finally(() => {
        setLoading(false);
      });
    } else if (isAuthenticated === false) {
      setLoading(false); // Done checking auth, user is not logged in
    }
  }, [isAuthenticated, user]);

  if (loading) {
    return <div className="flex justify-center p-24">Loading your orders...</div>;
  }
  
  if (!isAuthenticated) {
    return (
      <div className="flex flex-col items-center justify-center p-24 text-center">
         <h1 className="text-2xl font-semibold mb-4 text-zinc-800">Please Sign In</h1>
         <p className="text-zinc-500 mb-6">You must be signed in to view your orders.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8 max-w-5xl mx-auto py-12 px-4 sm:px-6">
      <div className="flex items-center gap-4 border-b border-zinc-100 pb-6">
        <h1 className="text-3xl font-semibold text-zinc-800 tracking-tight">Your Orders</h1>
        <span className="px-3 py-1 bg-zinc-100 text-zinc-600 rounded-full text-sm font-medium">{orders.length}</span>
      </div>
      
      {orders.length === 0 ? (
        <div className="text-center py-24 bg-zinc-50 rounded-2xl border border-zinc-100">
          <p className="text-zinc-500">You haven&apos;t placed any orders yet.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-6">
          {orders.map((order: any) => (
            <div key={order.id || order._id} className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 p-6 border border-zinc-200 rounded-2xl shadow-sm hover:shadow-md transition-shadow bg-white">
              <div className="flex flex-col gap-2">
                <span className="text-xs font-mono text-cyan-600 font-bold bg-cyan-50 px-2 py-1 flex-max w-fit rounded-md">ORDER #{String(order.id || order._id).slice(-8).toUpperCase()}</span>
                <p className="font-semibold text-2xl text-zinc-800 mt-2">₹{order.amount.toFixed(2)}</p>
                <p className="text-sm text-zinc-500">{new Date(order.createdAt).toLocaleDateString("en-US", { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>
              </div>

              <div className="flex items-center gap-8 self-end md:self-auto w-full md:w-auto justify-between md:justify-end">
                <div className="flex flex-col items-start md:items-end gap-2">
                   <p className="text-[10px] text-zinc-400 font-bold tracking-widest uppercase">Method</p>
                   <span className={`px-4 py-1.5 text-xs font-semibold rounded-full border ${order.paymentMethod === 'COD' ? 'bg-amber-50 text-amber-700 border-amber-200' : 'bg-slate-50 text-slate-700 border-slate-200'}`}>
                     {order.paymentMethod === 'COD' ? 'Cash on Delivery' : 'Credit Card'}
                   </span>
                </div>

                <div className="flex flex-col items-start md:items-end gap-2">
                   <p className="text-[10px] text-zinc-400 font-bold tracking-widest uppercase">Payment</p>
                   <span className={`px-4 py-1.5 text-xs font-semibold rounded-full border shadow-sm ${
                     order.status === 'success' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 
                     order.status === 'pending' ? 'bg-blue-50 text-blue-700 border-blue-200' : 
                     'bg-red-50 text-red-700 border-red-200'
                   }`}>
                     {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                   </span>
                </div>

                <div className="flex flex-col items-start md:items-end gap-2">
                   <p className="text-[10px] text-zinc-400 font-bold tracking-widest uppercase">Tracking</p>
                   <span className={`px-4 py-1.5 text-xs font-semibold rounded-full border shadow-sm ${
                     order.trackingStatus === 'delivered' ? 'bg-green-50 text-green-700 border-green-200' : 
                     order.trackingStatus === 'out_for_delivery' ? 'bg-amber-50 text-amber-700 border-amber-200' : 
                     order.trackingStatus === 'shipped' ? 'bg-indigo-50 text-indigo-700 border-indigo-200' : 
                     'bg-gray-50 text-gray-700 border-gray-200'
                   }`}>
                     {(order.trackingStatus || 'processing').replace(/_/g, ' ').replace(/\b\w/g, (char: string) => char.toUpperCase())}
                   </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrdersPage;
