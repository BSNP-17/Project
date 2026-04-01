import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import useAuth from '../hooks/useAuth';           // ✅ Needed to get user.id
import axiosClient from '../api/axiosClient';     // ✅ Needed to call the backend
import Navbar from '../components/Navbar';
import useAuth from '../hooks/useAuth'; // (Adjust the path if your useAuth is in a different folder)
import Footer from '../components/Footer';
import Button from '../components/Button';
import './BusResults.css'; 

const CartPage = () => {
  const { cart, removeFromCart, cartTotal, clearCart } = useCart(); // Added clearCart
  const { user } = useAuth(); // Get the logged-in user
  const navigate = useNavigate();
  
  const [processing, setProcessing] = useState(false); // To show loading state

  // ✅ Here is your Checkout Function!
  const handleCartCheckout = async () => {
    if (!user) {
      alert("Please login to complete your booking.");
      navigate('/login');
      return;
    }

    setProcessing(true);

    try {
      const payload = {
        userId: user.id, 
        paymentMethod: "UPI",
        cartItems: cart.map(item => ({
          busId: item.busId,
          selectedSeats: item.selectedSeats,
          totalPrice: item.totalPrice
        }))
      };

      // Call the new Spring Boot endpoint
      await axiosClient.post('/bookings/cart-checkout', payload);
      
      alert("All trips booked successfully! 🎟️");
      clearCart(); // Empty the cart globally
      navigate('/my-bookings'); // Take them to see their tickets

    } catch (error) {
      // If a seat was stolen while sitting in the cart, this catches the backend error
      alert(error.response?.data || "Checkout failed. Please try again.");
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="page-wrapper">
      <Navbar />
      
      <div className="bus-results" style={{ minHeight: '70vh', padding: '40px 20px' }}>
        <div className="results-container" style={{ maxWidth: '800px', margin: '0 auto' }}>
          
          <div className="results-header" style={{ marginBottom: '20px' }}>
            <h2>Your Travel Cart 🛒</h2>
            <p>{cart.length} Trips Pending</p>
          </div>

          {cart.length === 0 ? (
            <div className="no-buses" style={{ textAlign: 'center', padding: '50px' }}>
              <h3>Your cart is empty 😔</h3>
              <p>Looks like you haven't added any trips yet.</p>
              <Button text="Explore Routes" onClick={() => navigate('/home')} variant="primary" />
            </div>
          ) : (
            <>
              {/* List Cart Items */}
              {cart.map((item, index) => (
                <div key={index} className="bus-card" style={{ borderLeft: '5px solid #ff6b35' }}>
                  <div className="bus-left">
                    <div className="operator-info">
                      <h3>{item.from} → {item.to}</h3>
                      <span className="bus-type">{item.busName} • {item.date}</span>
                    </div>
                    <div className="bus-timing" style={{ marginTop: '10px' }}>
                      <span className="badge ac">Seats: {item.selectedSeats.join(', ')}</span>
                    </div>
                  </div>

                  <div className="bus-right" style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <div className="price">₹{item.totalPrice}</div>
                    <button 
                      className="select-seats-btn" 
                      style={{ background: '#ef4444' }} 
                      onClick={() => removeFromCart(index)}
                      disabled={processing}
                    >
                      Remove 🗑️
                    </button>
                  </div>
                </div>
              ))}

              {/* Checkout Section */}
              <div className="bus-card" style={{ marginTop: '30px', background: 'rgba(255,255,255,0.95)' }}>
                <div className="bus-left">
                  <h3>Grand Total</h3>
                  <p>Taxes and fees included</p>
                </div>
                <div className="bus-right">
                  <div className="price" style={{ fontSize: '2rem', color: '#10b981' }}>₹{cartTotal}</div>
                  
                  {/* ✅ Connect the button to the function here */}
                  <Button 
                    text={processing ? "Processing..." : "Pay Now 💳"} 
                    variant="primary" 
                    onClick={handleCartCheckout} 
                    disabled={processing}
                  />
                </div>
              </div>
            </>
          )}
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default CartPage;